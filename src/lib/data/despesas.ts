// Despesas — sobre Postgres (Prisma/Supabase), por empresa.

import { prisma } from "@/lib/prisma";
import { getCurrentEmpresaId } from "@/lib/tenant";

export type DespesaCategoria =
  | "combustivel" | "funcionario" | "manutencao" | "limpeza" | "compra"
  | "espaco" | "marketing" | "imposto" | "outros";

export const DESPESA_CATEGORIAS: Record<DespesaCategoria, string> = {
  combustivel: "Combustível",
  funcionario: "Funcionário",
  manutencao: "Manutenção",
  limpeza: "Limpeza",
  compra: "Compra de brinquedos",
  espaco: "Aluguel de espaço",
  marketing: "Marketing",
  imposto: "Impostos",
  outros: "Outros",
};

export type Despesa = {
  id: string;
  categoria: DespesaCategoria;
  valor: number;
  data: string; // yyyy-mm-dd
  descricao: string;
  criadoEm: string;
};

export type DespesaInput = { categoria: DespesaCategoria; valor: number; data: string; descricao: string };

export async function listDespesas(): Promise<Despesa[]> {
  const empresaId = await getCurrentEmpresaId();
  const rows = await prisma.despesa.findMany({ where: { empresaId }, orderBy: { data: "desc" } });
  return rows.map((d) => ({
    id: d.id,
    categoria: d.categoria as DespesaCategoria,
    valor: Number(d.valor),
    data: d.data.toISOString().slice(0, 10),
    descricao: d.descricao ?? "",
    criadoEm: (d as { criadoEm?: Date }).criadoEm?.toISOString?.() ?? d.data.toISOString(),
  }));
}

export async function createDespesa(input: DespesaInput): Promise<Despesa | null> {
  const empresaId = await getCurrentEmpresaId();
  if (!(input.valor > 0)) return null;
  const d = await prisma.despesa.create({
    data: {
      empresaId,
      categoria: input.categoria,
      valor: input.valor,
      data: input.data ? new Date(input.data) : new Date(),
      descricao: input.descricao || null,
    },
  });
  return {
    id: d.id, categoria: d.categoria as DespesaCategoria, valor: Number(d.valor),
    data: d.data.toISOString().slice(0, 10), descricao: d.descricao ?? "", criadoEm: d.data.toISOString(),
  };
}

export async function deleteDespesa(id: string): Promise<void> {
  const empresaId = await getCurrentEmpresaId();
  await prisma.despesa.deleteMany({ where: { id, empresaId } });
}

export async function despesaStats() {
  const empresaId = await getCurrentEmpresaId();
  const agg = await prisma.despesa.aggregate({ where: { empresaId }, _sum: { valor: true } });
  const porCategoria = await prisma.despesa.groupBy({
    by: ["categoria"], where: { empresaId }, _sum: { valor: true },
  });
  return {
    total: Number(agg._sum.valor ?? 0),
    porCategoria: porCategoria
      .map((c) => ({ categoria: c.categoria as DespesaCategoria, valor: Number(c._sum.valor ?? 0) }))
      .sort((a, b) => b.valor - a.valor),
  };
}
