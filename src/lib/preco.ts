// Lógica PURA de precificação de item de orçamento (sem I/O) — testável isolada.
export type OrcModo = "diaria" | "periodo";

export type PrecoBrinquedo = {
  valorDiaria: number;
  valorPeriodo: number | null;
  valorHoraExtra: number | null;
  valorPromocional: number | null;
};

// Preço unitário conforme a base de cobrança escolhida. A base diária respeita
// o preço promocional; período usa valorPeriodo; horas adicionais somam
// valorHoraExtra. Recalculado no SERVIDOR a partir dos valores reais do brinquedo.
export function precoUnitario(
  b: PrecoBrinquedo,
  modo: OrcModo,
  horasExtras: number
): { valorUnit: number; sufixo: string } {
  const base =
    modo === "periodo" && b.valorPeriodo != null
      ? b.valorPeriodo
      : b.valorPromocional ?? b.valorDiaria;
  const horas = Math.max(0, Math.trunc(horasExtras) || 0);
  const extra = horas * (b.valorHoraExtra ?? 0);
  const partes: string[] = [];
  if (modo === "periodo" && b.valorPeriodo != null) partes.push("período");
  if (horas > 0) partes.push(`+${horas}h`);
  return { valorUnit: base + extra, sufixo: partes.length ? ` (${partes.join(", ")})` : "" };
}
