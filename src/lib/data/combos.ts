// Combos — pacotes com preço fechado. Versão enxuta (nome, valor, descrição).
import { prisma } from "@/lib/prisma";
import { getCurrentEmpresaId } from "@/lib/tenant";

export type Combo = { id: string; nome: string; descricao: string; valor: number; ativo: boolean };

export async function listCombos(): Promise<Combo[]> {
  const empresaId = await getCurrentEmpresaId();
  const rows = await prisma.combo.findMany({ where: { empresaId }, orderBy: { nome: "asc" } });
  return rows.map((c) => ({ id: c.id, nome: c.nome, descricao: c.descricao ?? "", valor: Number(c.valor), ativo: c.ativo }));
}

export async function createCombo(input: { nome: string; descricao: string; valor: number }): Promise<void> {
  const empresaId = await getCurrentEmpresaId();
  if (!input.nome) return;
  await prisma.combo.create({ data: { empresaId, nome: input.nome, descricao: input.descricao || null, valor: input.valor } });
}

export async function deleteCombo(id: string): Promise<void> {
  const empresaId = await getCurrentEmpresaId();
  await prisma.combo.deleteMany({ where: { id, empresaId } });
}
