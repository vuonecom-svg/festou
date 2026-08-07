// Lógica PURA do registro de pagamento (sem I/O) — testável isolada.
// Garante: nunca recebe além do que falta, arredonda centavos, e classifica
// o pagamento como sinal (primeiro) ou restante.

export const round2 = (n: number) => Math.round(n * 100) / 100;

export type ResultadoPagamento = {
  aplicar: boolean; // false => nada a fazer (valor<=0 ou já quitado)
  recebido: number; // quanto de fato entra (limitado ao que falta)
  sinalPago: number; // novo acumulado
  valorRestante: number;
  tipo: "sinal" | "restante";
  quitado: boolean;
};

export function aplicarPagamento(total: number, sinalAntes: number, valor: number): ResultadoPagamento {
  const t = round2(Math.max(0, total));
  const antes = round2(Math.min(t, Math.max(0, sinalAntes)));
  const tipo: "sinal" | "restante" = antes <= 0 ? "sinal" : "restante";
  const base = { sinalPago: antes, valorRestante: round2(Math.max(0, t - antes)), tipo, quitado: antes >= t };

  if (!(valor > 0)) return { aplicar: false, recebido: 0, ...base };
  const recebido = round2(Math.min(t - antes, valor));
  if (!(recebido > 0)) return { aplicar: false, recebido: 0, ...base }; // já quitado

  const sinalPago = round2(antes + recebido);
  return {
    aplicar: true,
    recebido,
    sinalPago,
    valorRestante: round2(Math.max(0, t - sinalPago)),
    tipo,
    quitado: sinalPago >= t,
  };
}
