import { describe, it, expect } from "vitest";
import crypto from "crypto";
import { verificarAssinaturaKiwify, classificarEvento } from "../kiwify";

const token = "segredo-do-webhook-123";
const raw = '{"order_status":"paid","Customer":{"email":"a@b.com"}}';
const sigOk = crypto.createHmac("sha1", token).update(raw).digest("hex");

describe("verificarAssinaturaKiwify", () => {
  it("aceita a assinatura correta", () => {
    expect(verificarAssinaturaKiwify(raw, sigOk, token)).toBe(true);
  });
  it("rejeita assinatura errada", () => {
    expect(verificarAssinaturaKiwify(raw, "deadbeef", token)).toBe(false);
  });
  it("rejeita corpo adulterado (mesma assinatura)", () => {
    expect(verificarAssinaturaKiwify(raw + "x", sigOk, token)).toBe(false);
  });
  it("rejeita token errado", () => {
    expect(verificarAssinaturaKiwify(raw, sigOk, "outro-token")).toBe(false);
  });
  it("rejeita assinatura ou token vazios (fail-closed)", () => {
    expect(verificarAssinaturaKiwify(raw, "", token)).toBe(false);
    expect(verificarAssinaturaKiwify(raw, sigOk, "")).toBe(false);
  });
});

describe("classificarEvento", () => {
  it.each(["paid", "approved", "order_approved", "subscription_renewed", "active", "completed"])(
    "libera em '%s'",
    (s) => expect(classificarEvento(s)).toBe("liberar")
  );
  it.each(["refunded", "order_refunded", "chargeback", "subscription_canceled", "subscription_late", "expired"])(
    "bloqueia em '%s'",
    (s) => expect(classificarEvento(s)).toBe("bloquear")
  );
  it.each(["waiting_payment", "pending", "processing", ""])(
    "ignora não-acionável '%s'",
    (s) => expect(classificarEvento(s)).toBe("ignorar")
  );
  it("bloqueio tem prioridade sobre liberação", () => {
    expect(classificarEvento("paid_then_refunded")).toBe("bloquear");
  });
});
