// Lógica PURA do webhook Kiwify (verificação de assinatura + classificação de
// evento) — isolada para ser testável sem HTTP/DB.
import crypto from "crypto";

// HMAC-SHA1 do corpo cru com o token do webhook, comparado em tempo constante.
export function verificarAssinaturaKiwify(raw: string, signature: string, token: string): boolean {
  if (!token || !signature) return false;
  const expected = crypto.createHmac("sha1", token).update(raw).digest("hex");
  const a = Buffer.from(signature, "utf8");
  const b = Buffer.from(expected, "utf8");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// Kiwify usa nomes variados (order_status, webhook_event_type, subscription.status).
const LIBERAM = ["paid", "approved", "active", "authorized", "trialing", "completed", "renewed"];
const BLOQUEIAM = ["refunded", "chargedback", "chargeback", "canceled", "cancelled", "late", "overdue", "expired", "suspended"];

export type EventoKiwify = "liberar" | "bloquear" | "ignorar";

// BLOQUEIO tem prioridade sobre liberação (nunca conceder acesso num evento de
// reembolso/cancelamento). Nenhum status de liberação contém substring de bloqueio.
export function classificarEvento(statusRaw: string): EventoKiwify {
  const status = (statusRaw ?? "").toLowerCase();
  if (BLOQUEIAM.some((s) => status.includes(s))) return "bloquear";
  if (LIBERAM.some((s) => status.includes(s))) return "liberar";
  return "ignorar";
}
