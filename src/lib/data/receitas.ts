// Receitas avulsas — dinheiro recebido fora de um pedido formal
// (ex.: montou o brinquedo no evento e recebeu na hora). Sobre Postgres,
// por empresa. Espelha a estrutura de Despesas.

import { prisma } from "@/lib/prisma";
import { getCurrentEmpresaId } from "@/lib/tenant";

export type ReceitaCategoria =
  | "locacao_avulsa" | "venda" | "taxa_extra" | "outros";

export const RECEITA_CATEGORIAS: Record<ReceitaCategoria, string> = {
  locacao_avulsa: "Locação avulsa",
  venda: "Venda",
  taxa_extra: "Taxa/hora extra",
  outros: "Outros",
};

export type Receita = {
  id: string;
  categoria: ReceitaCategoria;
  valor: number;
  data: string; // yyyy-mm-dd
  forma: string;
  descricao: string;
  criadoEm: string;
};

export type ReceitaInput = {
  categoria: ReceitaCategoria;
  valor: number;
  data: string;
  forma: string;
  descricao: string;
};

function catOk(c: string): ReceitaCategoria {
  return c in RECEITA_CATEGORIAS ? (c as ReceitaCategoria) : "outros";
}

export async function listReceitas(): Promise<Receita[]> {
  const empresaId = await getCurrentEmpresaId();
  const rows = await prisma.receita.findMany({ where: { empresaId }, orderBy: { data: "desc" } });
  return rows.map((r) => ({
    id: r.id,
    categoria: catOk(r.categoria),
    valor: Number(r.valor),
    data: r.data.toISOString().slice(0, 10),
    forma: r.forma ?? "",
    descricao: r.descricao ?? "",
    criadoEm: r.criadoEm.toISOString(),
  }));
}

export async function createReceita(input: ReceitaInput): Promise<Receita | null> {
  const empresaId = await getCurrentEmpresaId();
  if (!(input.valor > 0)) return null;
  const r = await prisma.receita.create({
    data: {
      empresaId,
      categoria: catOk(input.categoria),
      valor: input.valor,
      data: input.data ? new Date(input.data) : new Date(),
      forma: input.forma || null,
      descricao: input.descricao || null,
    },
  });
  return {
    id: r.id,
    categoria: catOk(r.categoria),
    valor: Number(r.valor),
    data: r.data.toISOString().slice(0, 10),
    forma: r.forma ?? "",
    descricao: r.descricao ?? "",
    criadoEm: r.criadoEm.toISOString(),
  };
}

export async function deleteReceita(id: string): Promise<void> {
  const empresaId = await getCurrentEmpresaId();
  await prisma.receita.deleteMany({ where: { id, empresaId } });
}

export async function receitaStats() {
  const empresaId = await getCurrentEmpresaId();
  const agg = await prisma.receita.aggregate({ where: { empresaId }, _sum: { valor: true } });
  return { total: Number(agg._sum.valor ?? 0) };
}
