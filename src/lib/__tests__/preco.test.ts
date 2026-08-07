import { describe, it, expect } from "vitest";
import { precoUnitario, type PrecoBrinquedo } from "../preco";

const base: PrecoBrinquedo = { valorDiaria: 100, valorPeriodo: 250, valorHoraExtra: 20, valorPromocional: null };

describe("precoUnitario", () => {
  it("diária usa valorDiaria", () => {
    expect(precoUnitario(base, "diaria", 0).valorUnit).toBe(100);
  });

  it("diária respeita o preço promocional", () => {
    expect(precoUnitario({ ...base, valorPromocional: 80 }, "diaria", 0).valorUnit).toBe(80);
  });

  it("período usa valorPeriodo e ignora o promocional", () => {
    const r = precoUnitario({ ...base, valorPromocional: 80 }, "periodo", 0);
    expect(r.valorUnit).toBe(250);
    expect(r.sufixo).toContain("período");
  });

  it("período cai para diária quando valorPeriodo é null", () => {
    expect(precoUnitario({ ...base, valorPeriodo: null }, "periodo", 0).valorUnit).toBe(100);
  });

  it("horas adicionais somam valorHoraExtra e anotam o sufixo", () => {
    const r = precoUnitario(base, "diaria", 2);
    expect(r.valorUnit).toBe(140);
    expect(r.sufixo).toContain("+2h");
  });

  it("horas negativas ou sem valorHoraExtra não alteram o preço", () => {
    expect(precoUnitario(base, "diaria", -5).valorUnit).toBe(100);
    expect(precoUnitario({ ...base, valorHoraExtra: null }, "diaria", 3).valorUnit).toBe(100);
  });

  it("sem modo/horas especiais o sufixo é vazio", () => {
    expect(precoUnitario(base, "diaria", 0).sufixo).toBe("");
  });
});
