import { describe, it, expect } from "vitest";
import { janelaBloqueio, sobrepoe, verificarDisponibilidade, type ReservaLike } from "../disponibilidade";

const buffers = { transporteMin: 45, montagemMin: 30, desmontagemMin: 20, limpezaMin: 30 };
const B = "b1";
const ev = (h1: string, h2: string): [Date, Date] => [
  new Date(`2026-07-30T${h1}:00:00Z`),
  new Date(`2026-07-30T${h2}:00:00Z`),
];
const reserva = (unidade: number, ini: Date, fim: Date): ReservaLike => ({
  id: `r${unidade}`, brinquedoId: B, unidade, janelaInicio: ini, janelaFim: fim,
});

describe("janelaBloqueio", () => {
  it("expande a janela com buffers antes (75min) e depois (95min)", () => {
    const [ini, fim] = ev("16", "20");
    const j = janelaBloqueio(ini, fim, buffers);
    expect(j.inicio.toISOString()).toBe("2026-07-30T14:45:00.000Z");
    expect(j.fim.toISOString()).toBe("2026-07-30T21:35:00.000Z");
  });
});

describe("sobrepoe (intervalo meio-aberto)", () => {
  it("janelas que apenas se tocam NÃO conflitam", () => {
    const a = { inicio: new Date("2026-07-30T10:00:00Z"), fim: new Date("2026-07-30T12:00:00Z") };
    const b = { inicio: new Date("2026-07-30T12:00:00Z"), fim: new Date("2026-07-30T14:00:00Z") };
    expect(sobrepoe(a, b)).toBe(false);
  });
  it("janelas realmente sobrepostas conflitam", () => {
    const a = { inicio: new Date("2026-07-30T10:00:00Z"), fim: new Date("2026-07-30T13:00:00Z") };
    const b = { inicio: new Date("2026-07-30T12:00:00Z"), fim: new Date("2026-07-30T14:00:00Z") };
    expect(sobrepoe(a, b)).toBe(true);
  });
});

describe("verificarDisponibilidade", () => {
  it("REGRESSÃO (bug do fuso): locação 16-20h NÃO bloqueia 09-12h no mesmo dia", () => {
    const jt = janelaBloqueio(...ev("16", "20"), buffers);
    const existentes = [reserva(1, jt.inicio, jt.fim)];
    const [ini, fim] = ev("09", "12");
    const r = verificarDisponibilidade(B, ini, fim, buffers, 1, existentes);
    expect(r.disponivel).toBe(true);
  });

  it("mesma janela ocupa a única unidade → indisponível", () => {
    const [ini, fim] = ev("14", "18");
    const j = janelaBloqueio(ini, fim, buffers);
    const r = verificarDisponibilidade(B, ini, fim, buffers, 1, [reserva(1, j.inicio, j.fim)]);
    expect(r.disponivel).toBe(false);
    expect(r.unidadeLivre).toBeNull();
  });

  it("quantidade 2: segunda locação simultânea pega a unidade 2", () => {
    const [ini, fim] = ev("14", "18");
    const j = janelaBloqueio(ini, fim, buffers);
    const r = verificarDisponibilidade(B, ini, fim, buffers, 2, [reserva(1, j.inicio, j.fim)]);
    expect(r.disponivel).toBe(true);
    expect(r.unidadeLivre).toBe(2);
  });

  it("quantidade 2 com as duas unidades ocupadas → indisponível", () => {
    const [ini, fim] = ev("14", "18");
    const j = janelaBloqueio(ini, fim, buffers);
    const existentes = [reserva(1, j.inicio, j.fim), reserva(2, j.inicio, j.fim)];
    const r = verificarDisponibilidade(B, ini, fim, buffers, 2, existentes);
    expect(r.disponivel).toBe(false);
    expect(r.unidadesLivres).toEqual([]);
  });

  it("ignora a própria reserva ao reagendar", () => {
    const [ini, fim] = ev("14", "18");
    const j = janelaBloqueio(ini, fim, buffers);
    const propria: ReservaLike = { id: "self", brinquedoId: B, unidade: 1, janelaInicio: j.inicio, janelaFim: j.fim };
    const r = verificarDisponibilidade(B, ini, fim, buffers, 1, [propria], "self");
    expect(r.disponivel).toBe(true);
  });
});
