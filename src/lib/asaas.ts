// Integração Asaas (meio de pagamento) — lógica PURA + cliente HTTP da API,
// sem prisma/server-only para ser testável isolada (mesmo padrão de kiwify.ts;
// a leitura de config no banco fica na rota do webhook).
// Webhook: o Asaas manda o header `asaas-access-token` com o token que o dono
// configurou no painel (NUNCA a API key). O payload de cobrança NÃO traz o
// e-mail do cliente — buscamos via GET /v3/customers/{id} com a API key.
// Doc: docs.asaas.com (webhook-para-cobrancas, autenticação).
import crypto from "crypto";

export type EventoAsaas = "liberar" | "bloquear" | "ignorar";

// Dinheiro entrou (cartão confirmado / PIX-boleto recebido). AWAITING_CHARGEBACK_REVERSAL
// = disputa de chargeback VENCIDA pelo lojista → reativa o acesso.
const LIBERAM = new Set([
  "PAYMENT_CONFIRMED",
  "PAYMENT_RECEIVED",
  "PAYMENT_AWAITING_CHARGEBACK_REVERSAL",
]);

// Estorno, chargeback, mensalidade vencida ou recebimento desfeito → bloqueia.
// (Estorno PARCIAL não bloqueia: o cliente ainda pagou parte — caso raro, manual.)
const BLOQUEIAM = new Set([
  "PAYMENT_REFUNDED",
  "PAYMENT_CHARGEBACK_REQUESTED",
  "PAYMENT_CHARGEBACK_DISPUTE",
  "PAYMENT_OVERDUE",
  "PAYMENT_RECEIVED_IN_CASH_UNDONE",
]);

export function classificarEventoAsaas(event: string): EventoAsaas {
  const e = (event ?? "").trim().toUpperCase();
  if (BLOQUEIAM.has(e)) return "bloquear";
  if (LIBERAM.has(e)) return "liberar";
  return "ignorar";
}

// Comparação em tempo constante do token do webhook (fail-closed em vazio).
export function verificarTokenAsaas(recebido: string, esperado: string): boolean {
  if (!recebido || !esperado) return false;
  const a = Buffer.from(recebido, "utf8");
  const b = Buffer.from(esperado, "utf8");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// O webhook é da conta inteira. Liberação exige que a cobrança seja do FesFlow:
// description/externalReference contendo "fesflow", OU ambos vazios (conta
// dedicada — links criados sem descrição). Se há texto e não é FesFlow, ignora.
export function ehCobrancaFesflow(description: string, externalReference: string): boolean {
  const texto = `${description} ${externalReference}`.toLowerCase();
  if (texto.includes("fesflow")) return true;
  return !description.trim() && !externalReference.trim();
}

// Sandbox usa chave $aact_hmlg_...; produção $aact_prod_... — detecta pela chave.
export function baseUrlAsaas(apiKey: string): string {
  if (process.env.ASAAS_API_URL) return process.env.ASAAS_API_URL;
  return apiKey.includes("hmlg") ? "https://api-sandbox.asaas.com/v3" : "https://api.asaas.com/v3";
}

// Busca nome/e-mail do cliente Asaas (o payload do webhook só traz o id).
export async function buscarClienteAsaas(
  customerId: string,
  apiKey: string
): Promise<{ email: string; nome: string } | null> {
  if (!/^[A-Za-z0-9_-]{1,64}$/.test(customerId)) return null;
  try {
    const r = await fetch(`${baseUrlAsaas(apiKey)}/customers/${customerId}`, {
      headers: {
        access_token: apiKey,
        "User-Agent": "FesFlow", // exigido pelo Asaas em contas novas
        "Content-Type": "application/json",
      },
    });
    if (!r.ok) {
      console.error(`Asaas GET /customers/${customerId} -> ${r.status}`);
      return null;
    }
    const c = (await r.json()) as { email?: string; name?: string };
    const email = String(c.email ?? "").trim().toLowerCase();
    if (!email) return null;
    return { email, nome: String(c.name ?? "").trim() };
  } catch (e) {
    console.error("Asaas buscarCliente falhou:", (e as Error).message);
    return null;
  }
}
