import { describe, it, expect } from "vitest";
import { classificarEventoAsaas, verificarTokenAsaas, ehCobrancaFesflow, baseUrlAsaas } from "../asaas";

describe("classificarEventoAsaas", () => {
  it.each(["PAYMENT_CONFIRMED", "PAYMENT_RECEIVED", "PAYMENT_AWAITING_CHARGEBACK_REVERSAL"])(
    "libera em '%s'",
    (e) => expect(classificarEventoAsaas(e)).toBe("liberar")
  );
  it.each([
    "PAYMENT_REFUNDED",
    "PAYMENT_CHARGEBACK_REQUESTED",
    "PAYMENT_CHARGEBACK_DISPUTE",
    "PAYMENT_OVERDUE",
    "PAYMENT_RECEIVED_IN_CASH_UNDONE",
  ])("bloqueia em '%s'", (e) => expect(classificarEventoAsaas(e)).toBe("bloquear"));
  it.each([
    "PAYMENT_CREATED",
    "PAYMENT_UPDATED",
    "PAYMENT_AUTHORIZED",
    "PAYMENT_BANK_SLIP_VIEWED",
    "PAYMENT_CHECKOUT_VIEWED",
    "PAYMENT_PARTIALLY_REFUNDED",
    "PAYMENT_DELETED",
    "",
  ])("ignora '%s'", (e) => expect(classificarEventoAsaas(e)).toBe("ignorar"));
  it("é case-insensitive e tolera espaços", () => {
    expect(classificarEventoAsaas(" payment_received ")).toBe("liberar");
  });
});

describe("verificarTokenAsaas", () => {
  it("aceita token igual", () => expect(verificarTokenAsaas("abc123", "abc123")).toBe(true));
  it("rejeita token diferente", () => expect(verificarTokenAsaas("abc124", "abc123")).toBe(false));
  it("rejeita tamanho diferente", () => expect(verificarTokenAsaas("abc", "abc123")).toBe(false));
  it("fail-closed: vazio de qualquer lado", () => {
    expect(verificarTokenAsaas("", "abc")).toBe(false);
    expect(verificarTokenAsaas("abc", "")).toBe(false);
    expect(verificarTokenAsaas("", "")).toBe(false);
  });
});

describe("ehCobrancaFesflow", () => {
  it("aceita 'fesflow' na descrição (qualquer caixa)", () => {
    expect(ehCobrancaFesflow("Assinatura FesFlow Completo", "")).toBe(true);
    expect(ehCobrancaFesflow("", "FESFLOW-MENSAL")).toBe(true);
  });
  it("conta dedicada: descrição e referência vazias → aceita", () => {
    expect(ehCobrancaFesflow("", "")).toBe(true);
    expect(ehCobrancaFesflow("  ", "")).toBe(true);
  });
  it("outro produto explícito → recusa", () => {
    expect(ehCobrancaFesflow("Curso de Marketing", "")).toBe(false);
    expect(ehCobrancaFesflow("", "OUTRO-SAAS")).toBe(false);
  });
});

describe("baseUrlAsaas", () => {
  it("sandbox pela chave hmlg", () => {
    expect(baseUrlAsaas("$aact_hmlg_abc")).toBe("https://api-sandbox.asaas.com/v3");
  });
  it("produção pela chave prod", () => {
    expect(baseUrlAsaas("$aact_prod_abc")).toBe("https://api.asaas.com/v3");
  });
});
