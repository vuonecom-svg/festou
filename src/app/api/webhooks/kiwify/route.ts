import crypto from "crypto";
import { provisionarAcesso, bloquearAcesso } from "@/lib/access";

export const runtime = "nodejs";

// Status que LIBERAM acesso e que BLOQUEIAM (Kiwify usa nomes variados).
const LIBERAM = ["paid", "approved", "active", "authorized", "trialing", "completed"];
const BLOQUEIAM = ["refunded", "chargedback", "chargeback", "canceled", "cancelled", "late", "overdue", "expired", "suspended"];

export async function GET() {
  return Response.json({ ok: true, service: "kiwify-webhook" });
}

// Assinatura da Kiwify: HMAC-SHA1 do corpo com o token do webhook. Comparação
// em tempo constante para não vazar o segredo por timing.
function assinaturaValida(raw: string, req: Request, token: string): boolean {
  const url = new URL(req.url);
  const signature = url.searchParams.get("signature") ?? req.headers.get("x-kiwify-signature") ?? "";
  const expected = crypto.createHmac("sha1", token).update(raw).digest("hex");
  const a = Buffer.from(signature, "utf8");
  const b = Buffer.from(expected, "utf8");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function POST(req: Request) {
  const raw = await req.text();

  // FAIL-CLOSED: sem o token configurado, recusa. Nunca tratar "sem segredo"
  // como "confiável" — senão qualquer POST forjaria provisionamento/bloqueio.
  const token = process.env.KIWIFY_WEBHOOK_TOKEN;
  if (!token) {
    console.error("KIWIFY_WEBHOOK_TOKEN não configurado — webhook recusado.");
    return new Response("webhook não configurado", { status: 500 });
  }
  if (!assinaturaValida(raw, req, token)) {
    return new Response("assinatura inválida", { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
  } catch {
    return new Response("payload inválido", { status: 400 });
  }

  // Extrai dados de forma tolerante ao formato da Kiwify.
  const customer = (body.Customer ?? body.customer ?? {}) as Record<string, unknown>;
  const subscription = (body.Subscription ?? body.subscription ?? {}) as Record<string, unknown>;
  const product = (body.Product ?? body.product ?? {}) as Record<string, unknown>;

  const email = String(customer.email ?? customer.Email ?? body.email ?? "").trim().toLowerCase();
  const nome = String(customer.full_name ?? customer.name ?? customer.nome ?? "").trim();
  const status = String(
    body.order_status ?? body.status ?? subscription.status ?? body.webhook_event_type ?? ""
  ).toLowerCase();
  const ciclo = String(product.product_name ?? product.name ?? body.product_name ?? "").trim();
  const gatewayRef = String(body.order_id ?? subscription.id ?? body.id ?? "");

  // O webhook é "Todos que sou produtor". Só agimos em vendas do FesFlow —
  // casando pelo NOME do produto parseado (os produtos são "FesFlow Completo (...)"),
  // e não por substring no corpo cru (que daria falso-positivo com nome/e-mail do cliente).
  if (!ciclo.toLowerCase().includes("fesflow")) {
    return Response.json({ ok: true, acao: "ignorado-nao-fesflow" });
  }

  if (!email) {
    return new Response("sem e-mail no evento", { status: 200 });
  }

  try {
    if (LIBERAM.some((s) => status.includes(s))) {
      const r = await provisionarAcesso({ email, nome, ciclo, gatewayRef });
      return Response.json({ ok: true, acao: "liberado", novo: r.novo });
    }
    if (BLOQUEIAM.some((s) => status.includes(s))) {
      await bloquearAcesso(email);
      return Response.json({ ok: true, acao: "bloqueado" });
    }
    // Evento não acionável (ex.: waiting_payment) — apenas confirma o recebimento.
    return Response.json({ ok: true, acao: "ignorado", status });
  } catch (e) {
    console.error("Erro no webhook Kiwify:", (e as Error).message);
    return new Response("erro interno", { status: 500 });
  }
}
