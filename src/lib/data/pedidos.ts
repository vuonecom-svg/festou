// Pedidos (locações) — sobre Postgres (Prisma/Supabase), por empresa.
// O pedido não tem tabela de itens própria: os itens vêm do orçamento de origem.
// Sinal/restante ficam nos campos agregados do pedido.

import { prisma } from "@/lib/prisma";
import { getCurrentEmpresaId } from "@/lib/tenant";
import type { Prisma } from "@/generated/prisma/client";
import { janelaBloqueio } from "../disponibilidade";
import { buffersDe, TRANSPORTE_PADRAO_MIN } from "./reservas";
import { getBrinquedo } from "./brinquedos";
import { aplicarPagamento } from "../pagamento";
import { auditar } from "../audit";
import { usuarioAtualId } from "../rbac";

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

const FORMAS_PAGAMENTO = ["pix", "dinheiro", "cartao", "boleto", "transferencia"] as const;
export type PagamentoForma = (typeof FORMAS_PAGAMENTO)[number];

export async function registrarPagamento(
  id: string,
  valor: number,
  forma: string = "dinheiro"
): Promise<Pedido | null> {
  const empresaId = await getCurrentEmpresaId();
  if (!(valor > 0)) return null; // valor deve ser positivo (defesa em profundidade)
  const p = await prisma.pedido.findFirst({ where: { id, empresaId } });
  if (!p) return null;

  // Toda a matemática (limite ao total, arredondamento, tipo) na função pura.
  const r = aplicarPagamento(Number(p.total), Number(p.sinalPago), valor);
  if (!r.aplicar) return getPedido(id); // já quitado / nada a receber

  const formaOk: PagamentoForma = (FORMAS_PAGAMENTO as readonly string[]).includes(forma)
    ? (forma as PagamentoForma)
    : "dinheiro";

  // Transação: grava o histórico em Pagamento + atualiza o agregado do pedido.
  await prisma.$transaction([
    prisma.pagamento.create({
      data: {
        empresaId, pedidoId: id, tipo: r.tipo, forma: formaOk,
        valor: r.recebido, status: "pago", pagoEm: new Date(),
      },
    }),
    prisma.pedido.update({
      where: { id },
      data: {
        sinalPago: r.sinalPago,
        valorRestante: r.valorRestante,
        statusFinanceiro: statusFin(Number(p.total), r.sinalPago),
      },
    }),
  ]);
  await auditar({
    empresaId, usuarioId: await usuarioAtualId(), entidade: "pedido", entidadeId: id,
    acao: "registrar_pagamento", dados: { valor: r.recebido, forma: formaOk, tipo: r.tipo },
  });
  return getPedido(id);
}

export async function avancarStatusOperacional(id: string, status: PedidoStatusOp): Promise<void> {
  const empresaId = await getCurrentEmpresaId();
  await prisma.pedido.updateMany({ where: { id, empresaId }, data: { statusOperacional: status } });
}

/** Exclui a locação. As reservas (reserva_item) e pagamentos caem em cascata,
 *  liberando a agenda. O orçamento de origem volta a ficar sem pedido. */
export async function deletePedido(id: string): Promise<void> {
  const empresaId = await getCurrentEmpresaId();
  const del = await prisma.pedido.deleteMany({ where: { id, empresaId } });
  if (del.count > 0) {
    await auditar({ empresaId, usuarioId: await usuarioAtualId(), entidade: "pedido", entidadeId: id, acao: "excluir_pedido" });
  }
}

/** Remarca a locação (data + horários), recalculando as janelas de bloqueio de
 *  cada reserva e checando conflito (ignora as próprias reservas). */
export async function reagendarPedido(
  id: string,
  dataEvento: string,
  horaEntrega: string,
  horaRetirada: string
): Promise<{ ok: boolean; erro?: string }> {
  const empresaId = await getCurrentEmpresaId();
  const pedido = await prisma.pedido.findFirst({ where: { id, empresaId }, include: { reservaItens: true } });
  if (!pedido) return { ok: false, erro: "Locação não encontrada." };
  if (!dataEvento) return { ok: false, erro: "Informe a data do evento." };

  const eventoInicio = new Date(`${dataEvento}T${horaEntrega || "12:00"}:00Z`);
  const eventoFim = new Date(`${dataEvento}T${horaRetirada || "18:00"}:00Z`);
  if (isNaN(eventoInicio.getTime()) || isNaN(eventoFim.getTime()) || eventoFim <= eventoInicio) {
    return { ok: false, erro: "Horário inválido (retirada deve ser após a entrega)." };
  }

  const updates: { id: string; janelaInicio: Date; janelaFim: Date }[] = [];
  for (const ri of pedido.reservaItens) {
    const b = await getBrinquedo(ri.brinquedoId);
    if (!b) continue;
    const jan = janelaBloqueio(eventoInicio, eventoFim, buffersDe(b, TRANSPORTE_PADRAO_MIN));
    const conflito = await prisma.reservaItem.findFirst({
      where: {
        empresaId, brinquedoId: ri.brinquedoId, unidade: ri.unidade,
        pedidoId: { not: id },
        janelaInicio: { lt: jan.fim },
        janelaFim: { gt: jan.inicio },
      },
      select: { id: true },
    });
    if (conflito) return { ok: false, erro: `${b.nome} já está reservado nesse novo horário.` };
    updates.push({ id: ri.id, janelaInicio: jan.inicio, janelaFim: jan.fim });
  }

  try {
    await prisma.$transaction([
      prisma.pedido.update({
        where: { id },
        data: {
          dataEvento: new Date(`${dataEvento}T00:00:00Z`),
          horaEntrega: horaEntrega || null,
          horaRetirada: horaRetirada || null,
        },
      }),
      ...updates.map((u) =>
        prisma.reservaItem.update({ where: { id: u.id }, data: { janelaInicio: u.janelaInicio, janelaFim: u.janelaFim } })
      ),
    ]);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("reserva_item_sem_overbooking") || msg.includes("23P01") || msg.toLowerCase().includes("exclusion")) {
      return { ok: false, erro: "Conflito de horário: outro pedido reservou esse brinquedo nesse intervalo. Revise a agenda." };
    }
    throw e;
  }
  return { ok: true };
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

/** Financeiro do dashboard: faturamento do mês corrente + nº de pedidos com
 *  pagamento pendente — agregado no banco. */
export async function dashboardFinanceiro(agora: Date) {
  const empresaId = await getCurrentEmpresaId();
  const inicioMes = new Date(agora.getFullYear(), agora.getMonth(), 1);
  const inicioProxMes = new Date(agora.getFullYear(), agora.getMonth() + 1, 1);
  const [fat, pendentes] = await Promise.all([
    prisma.pedido.aggregate({
      where: { empresaId, dataEvento: { gte: inicioMes, lt: inicioProxMes } },
      _sum: { total: true },
    }),
    prisma.pedido.count({ where: { empresaId, valorRestante: { gt: 0 } } }),
  ]);
  return { faturamentoMes: Number(fat._sum.total ?? 0), pagamentosPendentes: pendentes };
}
