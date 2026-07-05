// Manutenção & limpeza — sobre Postgres. Ao abrir, bloqueia o brinquedo
// (status manutencao/limpeza). Ao concluir, libera (disponivel).

import { prisma } from "@/lib/prisma";
import { getCurrentEmpresaId } from "@/lib/tenant";

export type ManutencaoTipo = "preventiva" | "corretiva" | "limpeza";
export type ManutencaoStatus = "aberta" | "em_andamento" | "concluida";

export const MANUT_TIPO: Record<ManutencaoTipo, string> = {
  preventiva: "Preventiva",
  corretiva: "Corretiva",
  limpeza: "Limpeza",
};
export const MANUT_STATUS: Record<ManutencaoStatus, { label: string; badge: string }> = {
  aberta: { label: "Aberta", badge: "bg-amber-100 text-amber-700" },
  em_andamento: { label: "Em andamento", badge: "bg-sky-100 text-sky-700" },
  concluida: { label: "Concluída", badge: "bg-emerald-100 text-emerald-700" },
};

export type Manutencao = {
  id: string;
  brinquedoId: string;
  brinquedoNome: string;
  tipo: ManutencaoTipo;
  status: ManutencaoStatus;
  descricao: string;
  custo: number | null;
  responsavel: string;
  abertura: string;
  fechamento: string | null;
};

export async function listManutencoes(): Promise<Manutencao[]> {
  const empresaId = await getCurrentEmpresaId();
  const rows = await prisma.manutencao.findMany({
    where: { empresaId },
    include: { brinquedo: { select: { nome: true } } },
    orderBy: [{ status: "asc" }, { abertura: "desc" }],
  });
  return rows.map((m) => ({
    id: m.id,
    brinquedoId: m.brinquedoId,
    brinquedoNome: m.brinquedo?.nome ?? "",
    tipo: m.tipo as ManutencaoTipo,
    status: m.status as ManutencaoStatus,
    descricao: m.descricao ?? "",
    custo: m.custo == null ? null : Number(m.custo),
    responsavel: m.responsavel ?? "",
    abertura: m.abertura.toISOString(),
    fechamento: m.fechamento ? m.fechamento.toISOString() : null,
  }));
}

export async function abrirManutencao(input: {
  brinquedoId: string; tipo: ManutencaoTipo; descricao: string; custo: number | null; responsavel: string;
}): Promise<void> {
  const empresaId = await getCurrentEmpresaId();
  const brinquedo = await prisma.brinquedo.findFirst({ where: { id: input.brinquedoId, empresaId } });
  if (!brinquedo) return;
  await prisma.manutencao.create({
    data: {
      empresaId, brinquedoId: input.brinquedoId, tipo: input.tipo, status: "aberta",
      descricao: input.descricao || null, custo: input.custo, responsavel: input.responsavel || null,
    },
  });
  // bloqueia o brinquedo
  await prisma.brinquedo.update({
    where: { id: input.brinquedoId },
    data: { status: input.tipo === "limpeza" ? "limpeza" : "manutencao" },
  });
}

export async function concluirManutencao(id: string): Promise<void> {
  const empresaId = await getCurrentEmpresaId();
  const m = await prisma.manutencao.findFirst({ where: { id, empresaId } });
  if (!m) return;
  await prisma.manutencao.update({ where: { id }, data: { status: "concluida", fechamento: new Date() } });
  // libera o brinquedo (volta a disponível)
  await prisma.brinquedo.updateMany({ where: { id: m.brinquedoId, empresaId }, data: { status: "disponivel" } });
}

export async function deleteManutencao(id: string): Promise<void> {
  const empresaId = await getCurrentEmpresaId();
  await prisma.manutencao.deleteMany({ where: { id, empresaId } });
}
