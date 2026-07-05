// Pedidos (locações) — sobre Postgres (Prisma/Supabase), por empresa.
// O pedido não tem tabela de itens própria: os itens vêm do orçamento de origem.
// Sinal/restante ficam nos campos agregados do pedido.

import { prisma } from "@/lib/prisma";
import { getCurrentEmpresaId } from "@/lib/tenant";
import type { Prisma } from "@/generated/prisma/client";

export type PedidoStatusFin = "aguardando_sinal" | "sinal_pago" | "quitado";
export type PedidoStatusOp =
  | "aguardando_separacao"
  | "saiu_entrega"
  | "montado"
  | "em_evento"
  | "retirado"
  | "finalizado";

export const PEDIDO_FIN: Record<PedidoStatusFin, { label: string; badge: string }> = {
  aguardando_sinal: { label: "Aguardando sinal", badge: "bg-orange-100 text-orange-700" },
  sinal_pago: { label: "Sinal pago", badge: "bg-sky-100 text-sky-700" },
  quitado: { label: "Quitado", badge: "bg-emerald-100 text-emerald-700" },
};

export const PEDIDO_OP: Record<string, { label: string; badge: string }> = {
  aguardando_separacao: { label: "Aguardando separação", badge: "bg-slate-100 text-slate-700" },
  saiu_entrega: { label: "Saiu para entrega", badge: "bg-indigo-100 text-indigo-700" },
  montado: { label: "Montado", badge: "bg-teal-100 text-teal-700" },
  em_evento: { label: "Em evento", badge: "bg-blue-100 text-blue-700" },
  retirado: { label: "Retirado", badge: "bg-violet-100 text-violet-700" },
  finalizado: { label: "Finalizado", badge: "bg-emerald-100 text-emerald-700" },
};

export type PedidoItem = {
  brinquedoId: string;
  nome: string;
  qtd: number;
  valorUnit: number;
  valorTotal: number;
};

export type Pedido = {
  id: string;
  numero: number;
  orcamentoId: string;
  clienteNome: string;
  cidade: string;
  dataEvento: string;
  horaEntrega: string;
  horaRetirada: string;
  itens: PedidoItem[];
  total: number;
  sinalPago: number;
  valorRestante: number;
  statusFinanceiro: PedidoStatusFin;
  statusOperacional: PedidoStatusOp;
  reservaIds: string[];
  criadoEm: string;
};

const include = {
  cliente: { select: { nome: true } },
  enderecoEvento: { select: { cidade: true } },
  orcamento: { include: { itens: true } },
  reservaItens: { select: { id: true } },
} satisfies Prisma.PedidoInclude;

type PedidoRow = Prisma.PedidoGetPayload<{ include: typeof include }>;

export function statusFin(total: number, sinalPago: number): PedidoStatusFin {
  if (total > 0 && sinalPago >= total) return "quitado";
  if (sinalPago > 0) return "sinal_pago";
  return "aguardando_sinal";
}

function toDTO(p: PedidoRow): Pedido {
  const itens: PedidoItem[] = (p.orcamento?.itens ?? []).map((it) => ({
    brinquedoId: it.brinquedoId ?? "",
    nome: it.descricao ?? "",
    qtd: it.qtd,
    valorUnit: Number(it.valorUnit),
    valorTotal: Number(it.valorTotal),
  }));
  return {
    id: p.id,
    numero: p.numero,
    orcamentoId: p.orcamentoId ?? "",
    clienteNome: p.cliente?.nome ?? "",
    cidade: p.enderecoEvento?.cidade ?? "",
    dataEvento: p.dataEvento.toISOString().slice(0, 10),
    horaEntrega: p.horaEntrega ?? "",
    horaRetirada: p.horaRetirada ?? "",
    itens,
    total: Number(p.total),
    sinalPago: Number(p.sinalPago),
    valorRestante: Number(p.valorRestante),
    statusFinanceiro: p.statusFinanceiro as PedidoStatusFin,
    statusOperacional: p.statusOperacional as PedidoStatusOp,
    reservaIds: p.reservaItens.map((r) => r.id),
    criadoEm: p.criadoEm.toISOString(),
  };
}

export async function listPedidos(): Promise<Pedido[]> {
  const empresaId = await getCurrentEmpresaId();
  const rows = await prisma.pedido.findMany({ where: { empresaId }, include, orderBy: { criadoEm: "desc" } });
  return rows.map(toDTO);
}

export async function getPedido(id: string): Promise<Pedido | null> {
  const empresaId = await getCurrentEmpresaId();
  const row = await prisma.pedido.findFirst({ where: { id, empresaId }, include });
  return row ? toDTO(row) : null;
}

export async function registrarPagamento(id: string, valor: number): Promise<Pedido | null> {
  const empresaId = await getCurrentEmpresaId();
  const p = await prisma.pedido.findFirst({ where: { id, empresaId } });
  if (!p) return null;
  const total = Number(p.total);
  const sinalPago = Math.min(total, Number(p.sinalPago) + valor);
  await prisma.pedido.update({
    where: { id },
    data: {
      sinalPago,
      valorRestante: Math.max(0, total - sinalPago),
      statusFinanceiro: statusFin(total, sinalPago),
    },
  });
  return getPedido(id);
}

export async function avancarStatusOperacional(id: string, status: PedidoStatusOp): Promise<void> {
  const empresaId = await getCurrentEmpresaId();
  await prisma.pedido.updateMany({ where: { id, empresaId }, data: { statusOperacional: status } });
}

export async function pedidoStats() {
  const empresaId = await getCurrentEmpresaId();
  const agg = await prisma.pedido.aggregate({
    where: { empresaId },
    _sum: { valorRestante: true, total: true },
    _count: { _all: true },
  });
  return {
    total: agg._count._all,
    aReceber: Number(agg._sum.valorRestante ?? 0),
    faturamento: Number(agg._sum.total ?? 0),
  };
}
