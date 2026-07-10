import crypto from "crypto";
import { provisionarAcesso, bloquearAcesso } from "@/lib/access";

export const runtime = "nodejs";

// Status que LIBERAM acesso e que BLOQUEIAM (Kiwify usa nomes variados).
const LIBERAM = ["paid", "approved", "active", "authorized", "trialing", "completed"];
const BLOQUEIAM = ["refunded", "chargedback", "chargeback", "canceled", "cancelled", "late", "overdue", "expired", "suspended"];

export async function GET() {
  return Response.json({ ok: true, service: "kiwify-webhook" });
}

export async function POST(req: Request) {
  const raw = await req.text();

  // Verificação de assinatura (Kiwify: HMAC-SHA1 do corpo com o token do webhook).
  const token = process.env.KIWIFY_WEBHOOK_TOKEN;
  if (token) {
    const url = new URL(req.url);
    const signature = url.searchParams.get("signature") ?? req.headers.get("x-kiwify-signature") ?? "";
    const expected = crypto.createHmac("sha1", token).update(raw).digest("hex");
    if (signature !== expected) {
      return new Response("assinatura inválida", { status: 401 });
    }
  }

  // O webhook da Kiwify é "Todos que sou produtor" (o mesmo token vale para todos).
  // Só agimos em vendas do FesFlow — os produtos se chamam "FesFlow Completo (...)".
  // Vendas de outros produtos da conta (FINLOCA, SCANAFIN, etc.) são ignoradas.
  if (!raw.toLowerCase().includes("fesflow")) {
    return Response.json({ ok: true, acao: "ignorado-nao-fesflow" });
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

  const email = String(customer.email ?? customer.Email ?? body.email ?? "").trim();
  const nome = String(customer.full_name ?? customer.name ?? customer.nome ?? "").trim();
  const status = String(
    body.order_status ?? body.status ?? subscription.status ?? body.webhook_event_type ?? ""
  ).toLowerCase();
  const ciclo = String(product.product_name ?? product.name ?? "").trim();
  const gatewayRef = String(body.order_id ?? subscription.id ?? body.id ?? "");

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
