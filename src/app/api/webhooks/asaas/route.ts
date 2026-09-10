// Webhook Asaas → provisiona/bloqueia acesso ao FesFlow.
// Configurar no painel Asaas: URL https://fesflow.com.br/api/webhooks/asaas,
// versão v3, com token de autenticação (chega no header `asaas-access-token`).
// IMPORTANTE (doc Asaas): 15 falhas consecutivas PAUSAM a fila de eventos —
// por isso payload inaceitável responde 200 (retry nunca resolveria) e só
// erro transitório (banco/API fora) responde 500 (retry resolve).
import { provisionarAcesso, bloquearAcesso } from "@/lib/access";
import { prisma } from "@/lib/prisma";
import {
  classificarEventoAsaas,
  verificarTokenAsaas,
  ehCobrancaFesflow,
  buscarClienteAsaas,
} from "@/lib/asaas";

export const runtime = "nodejs";

// Config: env OU app_config no banco (mesmo padrão da chave do SendGrid — o
// dono cadastra uma vez, sem depender de env var no host).
async function getAsaasConfig(): Promise<{ apiKey: string | null; webhookToken: string | null }> {
  let apiKey = process.env.ASAAS_API_KEY ?? null;
  let webhookToken = process.env.ASAAS_WEBHOOK_TOKEN ?? null;
  if (!apiKey || !webhookToken) {
    try {
      const rows = await prisma.$queryRaw<{ chave: string; valor: string }[]>`
        select chave, valor from app_config where chave in ('asaas_api_key', 'asaas_webhook_token')`;
      for (const r of rows) {
        if (r.chave === "asaas_api_key" && !apiKey) apiKey = r.valor;
        if (r.chave === "asaas_webhook_token" && !webhookToken) webhookToken = r.valor;
      }
    } catch {
      // sem tabela/banco acessível: segue só com env
    }
  }
  return { apiKey, webhookToken };
}

export async function GET() {
  return Response.json({ ok: true, service: "asaas-webhook" });
}

export async function POST(req: Request) {
  const cfg = await getAsaasConfig();

  // FAIL-CLOSED: sem token configurado, recusa tudo (nunca tratar "sem segredo"
  // como confiável). 401 também para token errado.
  if (!cfg.webhookToken) {
    console.error("Asaas: asaas_webhook_token não configurado — webhook recusado.");
    return new Response("webhook não configurado", { status: 500 });
  }
  const tokenRecebido = req.headers.get("asaas-access-token") ?? "";
  if (!verificarTokenAsaas(tokenRecebido, cfg.webhookToken)) {
    return new Response("token inválido", { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(await req.text());
  } catch {
    // Malformado nunca melhora com retry — 200 para não pausar a fila do Asaas.
    return Response.json({ ok: true, acao: "ignorado-payload-invalido" });
  }

  const event = String(body.event ?? "");
  const payment = (body.payment ?? {}) as Record<string, unknown>;
  const evento = classificarEventoAsaas(event);
  if (evento === "ignorar") {
    return Response.json({ ok: true, acao: "ignorado", event });
  }

  const description = String(payment.description ?? "");
  const externalReference = String(payment.externalReference ?? "");
  // Só age em cobrança do FesFlow. ehCobrancaFesflow: contém "fesflow" OU
  // descrição/referência vazias (conta dedicada). Cobrança que nomeia OUTRO
  // produto é ignorada tanto para liberar quanto para bloquear (bloquear
  // e-mail de outro produto puniria cliente de outro negócio do dono).
  if (!ehCobrancaFesflow(description, externalReference)) {
    return Response.json({ ok: true, acao: "ignorado-nao-fesflow" });
  }

  const customerId = String(payment.customer ?? "");
  if (!customerId) {
    return Response.json({ ok: true, acao: "ignorado-sem-cliente" });
  }
  if (!cfg.apiKey) {
    // Sem API key não dá para resolver o e-mail — transitório de configuração:
    // 500 para o Asaas re-tentar depois que o dono cadastrar a chave.
    console.error("Asaas: asaas_api_key não configurada — não dá para buscar o e-mail do cliente.");
    return new Response("api key não configurada", { status: 500 });
  }

  const cliente = await buscarClienteAsaas(customerId, cfg.apiKey);
  if (!cliente) {
    // Pode ser instabilidade da API do Asaas — 500 para re-tentar.
    return new Response("cliente não encontrado no Asaas", { status: 500 });
  }

  const gatewayRef = String(payment.subscription ?? payment.id ?? body.id ?? "");
  const ciclo = description || "FesFlow (Asaas)";

  try {
    if (evento === "liberar") {
      const r = await provisionarAcesso({ email: cliente.email, nome: cliente.nome, ciclo, gatewayRef });
      return Response.json({ ok: true, acao: "liberado", novo: r.novo, event });
    }
    await bloquearAcesso(cliente.email);
    return Response.json({ ok: true, acao: "bloqueado", event });
  } catch (e) {
    console.error("Erro no webhook Asaas:", (e as Error).message);
    return new Response("erro interno", { status: 500 });
  }
}
