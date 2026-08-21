// Programação de eventos por período (relatório operacional para a equipe):
// tudo que acontece entre duas datas — horários, cliente, contato, endereço,
// itens e pendência financeira. Considera locações por diárias (evento que
// começou antes e ainda está em andamento entra no relatório).

import "server-only";
import { prisma } from "@/lib/prisma";
import { getCurrentEmpresaId } from "@/lib/tenant";
import { diaISO } from "@/lib/utils";

export type EventoProgramacao = {
  pedidoId: string;
  numero: number;
  dataInicio: string; // yyyy-mm-dd
  dataFim: string;    // yyyy-mm-dd (mesmo dia quando 1 diária)
  diarias: number;
  horaEntrega: string;
  horaRetirada: string;
  clienteNome: string;
  telefone: string;
  local: string;      // nome do local (tipo)
  enderecoLinha: string;
  referencia: string;
  itens: string;      // "2x Pula-pula, 1x Piscina de bolinha"
  statusOperacional: string;
  statusFinanceiro: string;
  total: number;
  valorRestante: number;
};

export type Programacao = {
  de: string;
  ate: string;
  emAndamento: EventoProgramacao[]; // começaram antes de `de` e ainda ocupam o período
  porDia: { dia: string; eventos: EventoProgramacao[] }[];
  totalEventos: number;
  totalAReceber: number;
};

function addDias(iso: string, n: number): string {
  return new Date(new Date(iso + "T00:00:00Z").getTime() + n * 86_400_000).toISOString().slice(0, 10);
}

export async function programacaoPeriodo(de: string, ate: string): Promise<Programacao> {
  const empresaId = await getCurrentEmpresaId();

  // Busca ampla: eventos iniciados até 60 dias antes ainda podem estar em
  // andamento no período (locações longas); o filtro fino é feito abaixo.
  const rows = await prisma.pedido.findMany({
    where: {
      empresaId,
      dataEvento: {
        gte: new Date(addDias(de, -60) + "T00:00:00Z"),
        lte: new Date(ate + "T23:59:59Z"),
      },
      statusOperacional: { notIn: ["cancelado"] },
    },
    include: {
      cliente: { select: { nome: true, telefone: true, whatsapp: true } },
      enderecoEvento: true,
      orcamento: { select: { diarias: true, itens: { select: { qtd: true, descricao: true } } } },
    },
    orderBy: [{ dataEvento: "asc" }, { horaEntrega: "asc" }],
  });

  const eventos: EventoProgramacao[] = rows.map((p) => {
    const inicio = diaISO(p.dataEvento);
    const diarias = Math.max(1, p.orcamento?.diarias ?? 1);
    const e = p.enderecoEvento;
    const endereco = [
      [e?.rua, e?.numero].filter(Boolean).join(", "),
      e?.bairro,
      e?.cidade,
    ].filter(Boolean).join(" — ");
    return {
      pedidoId: p.id,
      numero: p.numero,
      dataInicio: inicio,
      dataFim: addDias(inicio, diarias - 1),
      diarias,
      horaEntrega: p.horaEntrega ?? "",
      horaRetirada: p.horaRetirada ?? "",
      clienteNome: p.cliente?.nome ?? "",
      telefone: p.cliente?.whatsapp || p.cliente?.telefone || "",
      local: e?.nomeLocal ? `${e.nomeLocal}${e.tipoLocal ? ` (${e.tipoLocal})` : ""}` : (e?.tipoLocal ?? ""),
      enderecoLinha: endereco,
      referencia: e?.pontoReferencia ?? "",
      itens: (p.orcamento?.itens ?? []).map((i) => `${i.qtd}x ${i.descricao ?? ""}`).join(", "),
      statusOperacional: p.statusOperacional,
      statusFinanceiro: p.statusFinanceiro,
      total: Number(p.total),
      valorRestante: Number(p.valorRestante),
    };
  }).filter((ev) => ev.dataFim >= de && ev.dataInicio <= ate);

  const emAndamento = eventos.filter((ev) => ev.dataInicio < de);
  const doPeriodo = eventos.filter((ev) => ev.dataInicio >= de);

  // Agrupa pelos dias do período (só dias com evento).
  const porDiaMap = new Map<string, EventoProgramacao[]>();
  for (const ev of doPeriodo) {
    if (!porDiaMap.has(ev.dataInicio)) porDiaMap.set(ev.dataInicio, []);
    porDiaMap.get(ev.dataInicio)!.push(ev);
  }
  const porDia = [...porDiaMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([dia, evs]) => ({ dia, eventos: evs }));

  return {
    de,
    ate,
    emAndamento,
    porDia,
    totalEventos: eventos.length,
    totalAReceber: eventos.reduce((s, ev) => s + ev.valorRestante, 0),
  };
}
