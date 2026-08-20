import { provisionarAcesso, bloquearAcesso } from "@/lib/access";
import { verificarAssinaturaKiwify, classificarEventoCampos } from "@/lib/kiwify";

export const runtime = "nodejs";

export async function GET() {
  return Response.json({ ok: true, service: "kiwify-webhook" });
}

function assinaturaValida(raw: string, req: Request, token: string): boolean {
  const url = new URL(req.url);
  const signature = url.searchParams.get("signature") ?? req.headers.get("x-kiwify-signature") ?? "";
  return verificarAssinaturaKiwify(raw, signature, token);
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
  const plan = (subscription.plan ?? {}) as Record<string, unknown>;
  const ciclo = String(product.product_name ?? product.name ?? body.product_name ?? plan.name ?? "").trim();
  const gatewayRef = String(body.order_id ?? subscription.id ?? body.id ?? "");

  // Classifica olhando TODOS os campos de status: eventos de assinatura chegam
  // com o pedido original junto (order_status "paid" ao lado de um
  // subscription_canceled). Bloqueio vence liberação em qualquer campo.
  const evento = classificarEventoCampos([
    String(body.webhook_event_type ?? ""),
    String(subscription.status ?? ""),
    String(plan.status ?? ""),
    String(body.order_status ?? ""),
    String(body.status ?? ""),
  ]);

  // O webhook é "Todos que sou produtor". O filtro por produto vale só para
  // LIBERAR (nunca conceder acesso por venda de outro produto). Para BLOQUEAR,
  // só ignora se o evento diz explicitamente que é de OUTRO produto — evento de
  // bloqueio sem nome de produto segue em frente (bloquear e-mail que não é
  // cliente FesFlow é um no-op inofensivo; ignorar um bloqueio real é receita
  // perdida em silêncio).
  const ehFesflow = ciclo.toLowerCase().includes("fesflow");
  if (evento === "liberar" && !ehFesflow) {
    return Response.json({ ok: true, acao: "ignorado-nao-fesflow" });
  }
  if (evento === "bloquear" && ciclo && !ehFesflow) {
    return Response.json({ ok: true, acao: "ignorado-nao-fesflow" });
  }

  if (!email) {
    return new Response("sem e-mail no evento", { status: 200 });
  }

  try {
    if (evento === "liberar") {
      const r = await provisionarAcesso({ email, nome, ciclo, gatewayRef });
      return Response.json({ ok: true, acao: "liberado", novo: r.novo });
    }
    if (evento === "bloquear") {
      await bloquearAcesso(email);
      return Response.json({ ok: true, acao: "bloqueado" });
    }
    // Evento não acionável (ex.: waiting_payment) — apenas confirma o recebimento.
    return Response.json({ ok: true, acao: "ignorado" });
  } catch (e) {
    console.error("Erro no webhook Kiwify:", (e as Error).message);
    return new Response("erro interno", { status: 500 });
  }
}
