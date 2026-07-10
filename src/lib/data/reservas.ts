// Reservas — sobre Postgres. Cada reserva é uma linha de reserva_item
// (janela de bloqueio com buffers). Os dados de exibição (cliente, cidade,
// janela do evento) vêm do pedido vinculado.

import { prisma } from "@/lib/prisma";
import { getCurrentEmpresaId } from "@/lib/tenant";
import type { Prisma } from "@/generated/prisma/client";
import {
  verificarDisponibilidade,
  type Buffers,
  type ResultadoDisponibilidade,
} from "../disponibilidade";
import type { Brinquedo } from "./brinquedos";
import { getBrinquedo } from "./brinquedos";

export const TRANSPORTE_PADRAO_MIN = 45;

export type ReservaStatus = "orcamento" | "confirmado" | "em_evento" | "finalizado";

export const RESERVA_STATUS: Record<ReservaStatus, { label: string; badge: string; dot: string }> = {
  orcamento: { label: "Orçamento", badge: "bg-amber-100 text-amber-700", dot: "bg-amber-400" },
  confirmado: { label: "Confirmado", badge: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  em_evento: { label: "Em evento", badge: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
  finalizado: { label: "Finalizado", badge: "bg-slate-100 text-slate-600", dot: "bg-slate-400" },
};

export type Reserva = {
  id: string;
  brinquedoId: string;
  unidade: number;
  brinquedoNome: string;
  clienteNome: string;
  cidade: string;
  eventoInicio: string;
  eventoFim: string;
  janelaInicio: string;
  janelaFim: string;
  status: ReservaStatus;
};

export function buffersDe(b: Brinquedo, transporteMin = TRANSPORTE_PADRAO_MIN): Buffers {
  return {
    transporteMin,
    montagemMin: b.tempoMontagemMin,
    desmontagemMin: b.tempoDesmontagemMin,
    limpezaMin: b.tempoLimpezaMin,
  };
}

const include = {
  brinquedo: { select: { nome: true } },
  pedido: {
    select: {
      dataEvento: true, horaEntrega: true, horaRetirada: true, statusOperacional: true,
      cliente: { select: { nome: true } },
      enderecoEvento: { select: { cidade: true } },
    },
  },
} satisfies Prisma.ReservaItemInclude;

type ReservaRow = Prisma.ReservaItemGetPayload<{ include: typeof include }>;

function statusDoPedido(op: string): ReservaStatus {
  if (op === "finalizado" || op === "retirado" || op === "retornou_base") return "finalizado";
  if (op === "em_evento" || op === "montado") return "em_evento";
  return "confirmado";
}

function eventoISO(dataEvento: Date, hora: string | null, fallback: string): string {
  const dia = dataEvento.toISOString().slice(0, 10);
  return new Date(`${dia}T${(hora || fallback)}:00`).toISOString();
}

function toDTO(r: ReservaRow): Reserva {
  const ped = r.pedido;
  return {
    id: r.id,
    brinquedoId: r.brinquedoId,
    unidade: r.unidade ?? 1,
    brinquedoNome: r.brinquedo?.nome ?? "",
    clienteNome: ped?.cliente?.nome ?? "",
    cidade: ped?.enderecoEvento?.cidade ?? "",
    eventoInicio: ped ? eventoISO(ped.dataEvento, ped.horaEntrega, "12:00") : r.janelaInicio.toISOString(),
    eventoFim: ped ? eventoISO(ped.dataEvento, ped.horaRetirada, "18:00") : r.janelaFim.toISOString(),
    janelaInicio: r.janelaInicio.toISOString(),
    janelaFim: r.janelaFim.toISOString(),
    status: ped ? statusDoPedido(ped.statusOperacional) : "confirmado",
  };
}

export async function listReservas(): Promise<Reserva[]> {
  const empresaId = await getCurrentEmpresaId();
  const rows = await prisma.reservaItem.findMany({ where: { empresaId }, include, orderBy: { janelaInicio: "asc" } });
  return rows.map(toDTO);
}

export async function reservasParaEngine() {
  return listReservas();
}

/** Dados de agenda do dashboard: contagens + próximos 5 (tudo no banco, sem
 *  carregar a tabela inteira). */
export async function dashboardEventos(agora: Date) {
  const empresaId = await getCurrentEmpresaId();
  const inicioHoje = new Date(agora); inicioHoje.setHours(0, 0, 0, 0);
  const inicioAmanha = new Date(inicioHoje); inicioAmanha.setDate(inicioAmanha.getDate() + 1);
  const fimSemana = new Date(inicioHoje); fimSemana.setDate(fimSemana.getDate() + 7);

  const [hoje, semana, proximasRows] = await Promise.all([
    prisma.reservaItem.count({ where: { empresaId, pedido: { dataEvento: { gte: inicioHoje, lt: inicioAmanha } } } }),
    prisma.reservaItem.count({ where: { empresaId, pedido: { dataEvento: { gte: inicioHoje, lt: fimSemana } } } }),
    prisma.reservaItem.findMany({
      where: { empresaId, pedido: { dataEvento: { gte: inicioHoje } } },
      include, orderBy: { janelaInicio: "asc" }, take: 5,
    }),
  ]);
  return { hoje, semana, proximas: proximasRows.map(toDTO) };
}

/** Reservas cruas (janela) para checagem de conflito de um brinquedo. */
async function reservasDoBrinquedo(empresaId: string, brinquedoId: string, ignorarPedidoId?: string) {
  const rows = await prisma.reservaItem.findMany({
    where: { empresaId, brinquedoId, ...(ignorarPedidoId ? { pedidoId: { not: ignorarPedidoId } } : {}) },
    include,
  });
  return rows.map(toDTO);
}

/** Checa disponibilidade de um brinquedo numa janela de festa desejada. */
export async function verificarBrinquedo(
  brinquedoId: string,
  eventoInicio: Date,
  eventoFim: Date,
  transporteMin = TRANSPORTE_PADRAO_MIN,
  ignorarPedidoId?: string
): Promise<ResultadoDisponibilidade<Reserva> & { brinquedo: Brinquedo | null }> {
  const empresaId = await getCurrentEmpresaId();
  const brinquedo = await getBrinquedo(brinquedoId);
  if (!brinquedo) {
    return { disponivel: false, janela: { inicio: eventoInicio, fim: eventoFim }, conflitos: [], unidadesLivres: [], unidadeLivre: null, brinquedo: null };
  }
  const existentes = await reservasDoBrinquedo(empresaId, brinquedoId, ignorarPedidoId);
  const res = verificarDisponibilidade(
    brinquedoId, eventoInicio, eventoFim, buffersDe(brinquedo, transporteMin), brinquedo.quantidade, existentes
  );
  return { ...res, brinquedo };
}
