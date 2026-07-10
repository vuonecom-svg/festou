// Orçamentos — sobre Postgres. converterEmPedido roda em transação:
// cria pedido + reserva_item; o Postgres recusa overbooking pela exclusion
// constraint (reserva_item_sem_overbooking). Pré-checagem dá mensagem amigável.

import { prisma } from "@/lib/prisma";
import { getCurrentEmpresaId } from "@/lib/tenant";
import type { Prisma } from "@/generated/prisma/client";
import { getBrinquedo } from "./brinquedos";
import { verificarBrinquedo, buffersDe, TRANSPORTE_PADRAO_MIN } from "./reservas";
import { janelaBloqueio } from "../disponibilidade";

export type OrcStatus =
  | "novo" | "enviado" | "aprovado" | "recusado" | "convertido" | "cancelado";

export const ORC_STATUS: Record<string, { label: string; badge: string }> = {
  novo: { label: "Novo", badge: "bg-slate-100 text-slate-700" },
  enviado: { label: "Enviado", badge: "bg-sky-100 text-sky-700" },
  aprovado: { label: "Aprovado", badge: "bg-emerald-100 text-emerald-700" },
  recusado: { label: "Recusado", badge: "bg-rose-100 text-rose-700" },
  convertido: { label: "Convertido em pedido", badge: "bg-violet-100 text-violet-700" },
  cancelado: { label: "Cancelado", badge: "bg-slate-200 text-slate-600" },
};

// Status graváveis no banco (enum do Postgres). "convertido" é derivado (pedido vinculado).
const DB_STATUS = new Set(["novo", "enviado", "aprovado", "recusado", "cancelado"]);

export type OrcItem = {
  brinquedoId: string; nome: string; qtd: number; valorUnit: number; valorTotal: number;
};

export type EnderecoEvento = {
  nomeLocal: string; tipoLocal: string; rua: string; numero: string;
  bairro: string; cidade: string; complemento: string; referencia: string;
};

export type Orcamento = {
  id: string; numero: number; clienteId: string; clienteNome: string;
  dataEvento: string; horaEntrega: string; horaRetirada: string;
  endereco: EnderecoEvento; itens: OrcItem[];
  subtotal: number; desconto: number; motivoDesconto: string;
  taxaEntrega: number; taxaMontagem: number; total: number;
  valorSinal: number; valorRestante: number; formaPagamento: string; obs: string;
  status: OrcStatus; pedidoId?: string; criadoEm: string;
};

export type OrcamentoInput = {
  clienteId: string; dataEvento: string; horaEntrega: string; horaRetirada: string;
  endereco: EnderecoEvento; itens: { brinquedoId: string; qtd: number; valorUnit?: number }[];
  desconto: number; motivoDesconto: string; taxaEntrega: number; taxaMontagem: number;
  valorSinal: number; formaPagamento: string; obs: string;
};

const include = {
  itens: true,
  enderecoEvento: true,
  cliente: { select: { nome: true } },
  pedido: { select: { id: true } },
} satisfies Prisma.OrcamentoInclude;

type OrcamentoRow = Prisma.OrcamentoGetPayload<{ include: typeof include }>;

function toDTO(o: OrcamentoRow): Orcamento {
  const e = o.enderecoEvento;
  return {
    id: o.id,
    numero: o.numero,
    clienteId: o.clienteId,
    clienteNome: o.cliente?.nome ?? "",
    dataEvento: o.dataEvento.toISOString().slice(0, 10),
    horaEntrega: o.horaEntrega ?? "",
    horaRetirada: o.horaRetirada ?? "",
    endereco: {
      nomeLocal: e?.nomeLocal ?? "", tipoLocal: e?.tipoLocal ?? "", rua: e?.rua ?? "",
      numero: e?.numero ?? "", bairro: e?.bairro ?? "", cidade: e?.cidade ?? "",
      complemento: e?.complemento ?? "", referencia: e?.pontoReferencia ?? "",
    },
    itens: o.itens.map((it) => ({
      brinquedoId: it.brinquedoId ?? "", nome: it.descricao ?? "", qtd: it.qtd,
      valorUnit: Number(it.valorUnit), valorTotal: Number(it.valorTotal),
    })),
    subtotal: Number(o.subtotal), desconto: Number(o.desconto), motivoDesconto: o.motivoDesconto ?? "",
    taxaEntrega: Number(o.taxaEntrega), taxaMontagem: Number(o.taxaMontagem), total: Number(o.total),
    valorSinal: Number(o.valorSinal), valorRestante: Number(o.valorRestante),
    formaPagamento: o.formaPagamento ?? "", obs: o.obs ?? "",
    status: o.pedido ? "convertido" : (o.status as OrcStatus),
    pedidoId: o.pedido?.id,
    criadoEm: o.criadoEm.toISOString(),
  };
}

async function proximoNumero(model: "orcamento" | "pedido", empresaId: string, base: number) {
  const last =
    model === "orcamento"
      ? await prisma.orcamento.findFirst({ where: { empresaId }, orderBy: { numero: "desc" }, select: { numero: true } })
      : await prisma.pedido.findFirst({ where: { empresaId }, orderBy: { numero: "desc" }, select: { numero: true } });
  return (last?.numero ?? base) + 1;
}

export async function listOrcamentos(): Promise<Orcamento[]> {
  const empresaId = await getCurrentEmpresaId();
  const rows = await prisma.orcamento.findMany({ where: { empresaId }, include, orderBy: { numero: "desc" } });
  return rows.map(toDTO);
}

export async function getOrcamento(id: string): Promise<Orcamento | null> {
  const empresaId = await getCurrentEmpresaId();
  const row = await prisma.orcamento.findFirst({ where: { id, empresaId }, include });
  return row ? toDTO(row) : null;
}

export async function createOrcamento(input: OrcamentoInput): Promise<Orcamento> {
  const empresaId = await getCurrentEmpresaId();

  // Segurança: o cliente precisa pertencer a ESTA empresa (não confia no id vindo do form).
  const donoOk = await prisma.cliente.count({ where: { id: input.clienteId, empresaId } });
  if (!donoOk) throw new Error("Cliente inválido.");

  // Resolve itens (nome/valor a partir do brinquedo)
  const itensData: Prisma.OrcamentoItemCreateWithoutOrcamentoInput[] = [];
  let subtotal = 0;
  for (const it of input.itens) {
    const b = await getBrinquedo(it.brinquedoId);
    if (!b) continue;
    const valorUnit = it.valorUnit ?? (b.valorPromocional ?? b.valorDiaria);
    const qtd = Math.max(1, it.qtd);
    const valorTotal = valorUnit * qtd;
    subtotal += valorTotal;
    itensData.push({
      brinquedo: { connect: { id: b.id } }, descricao: b.nome, qtd, valorUnit, valorTotal,
    });
  }
  const total = Math.max(0, subtotal - input.desconto + input.taxaEntrega + input.taxaMontagem);
  const valorRestante = Math.max(0, total - input.valorSinal);
  const numero = await proximoNumero("orcamento", empresaId, 2000);

  const e = input.endereco;
  const endereco = await prisma.enderecoEvento.create({
    data: {
      empresaId, nomeLocal: e.nomeLocal || null, tipoLocal: e.tipoLocal || null,
      rua: e.rua || null, numero: e.numero || null, bairro: e.bairro || null,
      cidade: e.cidade || null, complemento: e.complemento || null, pontoReferencia: e.referencia || null,
    },
  });

  const created = await prisma.orcamento.create({
    data: {
      empresaId, numero, clienteId: input.clienteId, enderecoEventoId: endereco.id,
      dataEvento: new Date(input.dataEvento || new Date().toISOString().slice(0, 10)),
      horaEntrega: input.horaEntrega || null, horaRetirada: input.horaRetirada || null,
      subtotal, desconto: input.desconto, motivoDesconto: input.motivoDesconto || null,
      taxaEntrega: input.taxaEntrega, taxaMontagem: input.taxaMontagem, total,
      valorSinal: input.valorSinal, valorRestante, formaPagamento: input.formaPagamento || null,
      obs: input.obs || null, status: "novo",
      itens: { create: itensData },
    },
    include,
  });
  return toDTO(created);
}

export async function setOrcamentoStatus(id: string, status: OrcStatus): Promise<void> {
  if (!DB_STATUS.has(status)) return; // "convertido" é derivado, não grava
  const empresaId = await getCurrentEmpresaId();
  const o = await prisma.orcamento.findFirst({ where: { id, empresaId }, include: { pedido: { select: { id: true } } } });
  if (!o || o.pedido) return; // não mexe em orçamento já convertido
  await prisma.orcamento.update({ where: { id }, data: { status: status as Prisma.OrcamentoUpdateInput["status"] } });
}

export async function deleteOrcamento(id: string): Promise<void> {
  const empresaId = await getCurrentEmpresaId();
  await prisma.orcamento.deleteMany({ where: { id, empresaId, pedido: { is: null } } });
}

function ehConflito(e: unknown): boolean {
  const msg = e instanceof Error ? e.message : String(e);
  return msg.includes("reserva_item_sem_overbooking") || msg.includes("23P01") || msg.toLowerCase().includes("exclusion");
}

export async function converterEmPedido(id: string): Promise<{ id: string }> {
  const empresaId = await getCurrentEmpresaId();
  const o = await prisma.orcamento.findFirst({ where: { id, empresaId }, include });
  if (!o) throw new Error("Orçamento não encontrado.");
  if (o.pedido) throw new Error("Este orçamento já virou pedido.");
  if (o.itens.length === 0) throw new Error("Orçamento sem brinquedos.");

  const dia = o.dataEvento.toISOString().slice(0, 10);
  const eventoInicio = new Date(`${dia}T${o.horaEntrega || "12:00"}:00`);
  const eventoFim = new Date(`${dia}T${o.horaRetirada || "18:00"}:00`);
  if (eventoFim <= eventoInicio) throw new Error("Horário do evento inválido (retirada deve ser após a entrega).");

  // Pré-checagem (mensagem amigável) + coleta das janelas de bloqueio.
  // Cada unidade pedida ocupa uma unidade física distinta (1..quantidade).
  const reservas: { brinquedoId: string; unidade: number; janelaInicio: Date; janelaFim: Date }[] = [];
  const usadas: Record<string, Set<number>> = {}; // unidades já reservadas por brinquedo NESTE pedido
  for (const it of o.itens) {
    if (!it.brinquedoId) continue;
    const check = await verificarBrinquedo(it.brinquedoId, eventoInicio, eventoFim);
    if (!check.brinquedo) throw new Error(`Brinquedo do item "${it.descricao}" não existe mais.`);
    const jaUsadas = usadas[it.brinquedoId] ?? new Set<number>();
    const livres = check.unidadesLivres.filter((u) => !jaUsadas.has(u));
    const precisa = Math.max(1, it.qtd);
    if (livres.length < precisa) {
      const c = check.conflitos[0];
      const detalhe =
        check.brinquedo.quantidade > 1
          ? `${it.descricao}: só há ${livres.length} de ${check.brinquedo.quantidade} unidade(s) livre(s) nesse período (pedido: ${precisa}).`
          : `${it.descricao} já está reservado nesse período` +
            (c ? ` (${c.clienteNome} · ${c.cidade})` : "") + ".";
      throw new Error(detalhe + " O bloqueio considera transporte, montagem e limpeza.");
    }
    const jan = janelaBloqueio(eventoInicio, eventoFim, buffersDe(check.brinquedo, TRANSPORTE_PADRAO_MIN));
    for (let k = 0; k < precisa; k++) {
      const u = livres[k];
      jaUsadas.add(u);
      reservas.push({ brinquedoId: it.brinquedoId, unidade: u, janelaInicio: jan.inicio, janelaFim: jan.fim });
    }
    usadas[it.brinquedoId] = jaUsadas;
  }

  const numero = await proximoNumero("pedido", empresaId, 1000);
  const total = Number(o.total);

  try {
    const pedido = await prisma.$transaction(async (tx) => {
      // O "sinal" do orçamento é o valor ESPERADO — ainda não foi recebido.
      // O pedido nasce aguardando sinal; o dinheiro real entra só via
      // registrarPagamento (que cria o registro e ajusta o status).
      const ped = await tx.pedido.create({
        data: {
          empresaId, numero, orcamentoId: o.id, clienteId: o.clienteId,
          enderecoEventoId: o.enderecoEventoId, dataEvento: o.dataEvento,
          horaEntrega: o.horaEntrega, horaRetirada: o.horaRetirada,
          total, sinalPago: 0, valorRestante: total,
          statusFinanceiro: "aguardando_sinal",
          statusOperacional: "aguardando_separacao",
        },
      });
      for (const r of reservas) {
        // Insere reserva_item — a exclusion constraint dispara aqui se houver conflito.
        await tx.reservaItem.create({
          data: {
            empresaId, pedidoId: ped.id, brinquedoId: r.brinquedoId,
            qtd: 1, unidade: r.unidade, janelaInicio: r.janelaInicio, janelaFim: r.janelaFim,
          },
        });
      }
      await tx.orcamento.update({ where: { id: o.id }, data: { status: "aprovado" } });
      return ped;
    });
    return { id: pedido.id };
  } catch (e) {
    if (ehConflito(e)) {
      throw new Error("Conflito de reserva: algum brinquedo foi reservado nesse período enquanto convertia. Revise a agenda.");
    }
    throw e;
  }
}

export async function orcamentoStats() {
  const empresaId = await getCurrentEmpresaId();
  const rows = await prisma.orcamento.findMany({
    where: { empresaId },
    select: { status: true, pedido: { select: { id: true } } },
  });
  return {
    total: rows.length,
    abertos: rows.filter((o) => !o.pedido && ["novo", "enviado", "aprovado"].includes(o.status)).length,
    convertidos: rows.filter((o) => o.pedido).length,
  };
}
