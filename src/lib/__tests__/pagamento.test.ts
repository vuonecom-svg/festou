import { describe, it, expect } from "vitest";
import { aplicarPagamento } from "../pagamento";

describe("aplicarPagamento", () => {
  it("sinal parcial: total 100, antes 0, paga 40", () => {
    const r = aplicarPagamento(100, 0, 40);
    expect(r).toMatchObject({ aplicar: true, recebido: 40, sinalPago: 40, valorRestante: 60, tipo: "sinal", quitado: false });
  });

  it("quitação: total 100, antes 40, paga 60 → restante 0", () => {
    const r = aplicarPagamento(100, 40, 60);
    expect(r).toMatchObject({ aplicar: true, recebido: 60, sinalPago: 100, valorRestante: 0, tipo: "restante", quitado: true });
  });

  it("nunca recebe além do total (overpay é limitado)", () => {
    const r = aplicarPagamento(100, 0, 150);
    expect(r).toMatchObject({ aplicar: true, recebido: 100, sinalPago: 100, valorRestante: 0, quitado: true });
  });

  it("já quitado: não aplica novo pagamento", () => {
    const r = aplicarPagamento(100, 100, 50);
    expect(r.aplicar).toBe(false);
    expect(r.recebido).toBe(0);
    expect(r.valorRestante).toBe(0);
  });

  it("valor zero ou negativo não aplica", () => {
    expect(aplicarPagamento(100, 0, 0).aplicar).toBe(false);
    expect(aplicarPagamento(100, 0, -20).aplicar).toBe(false);
  });

  it("arredonda centavos (sem 0.01 residual no quitado)", () => {
    const r = aplicarPagamento(100, 33.33, 66.67);
    expect(r.sinalPago).toBe(100);
    expect(r.valorRestante).toBe(0);
    expect(r.quitado).toBe(true);
  });

  it("sinalAntes maior que o total é normalizado (dados sujos)", () => {
    const r = aplicarPagamento(100, 120, 10);
    expect(r.aplicar).toBe(false);
    expect(r.valorRestante).toBe(0);
    expect(r.quitado).toBe(true);
  });
});
