// CRM comercial — funil de leads (vinculados a clientes). Sobre Postgres.
import { prisma } from "@/lib/prisma";
import { getCurrentEmpresaId } from "@/lib/tenant";

export type LeadEtapa =
  | "novo" | "atendimento" | "orcamento_enviado" | "aguardando_resposta"
  | "aguardando_sinal" | "confirmado" | "perdido" | "reativacao";

// Ordem e rótulos do funil.
export const ETAPAS: { key: LeadEtapa; label: string; cor: string }[] = [
  { key: "novo", label: "Novo lead", cor: "border-slate-300" },
  { key: "atendimento", label: "Em atendimento", cor: "border-sky-300" },
  { key: "orcamento_enviado", label: "Orçamento enviado", cor: "border-indigo-300" },
  { key: "aguardando_resposta", label: "Aguardando resposta", cor: "border-amber-300" },
  { key: "aguardando_sinal", label: "Aguardando sinal", cor: "border-orange-300" },
  { key: "confirmado", label: "Confirmado", cor: "border-emerald-400" },
  { key: "reativacao", label: "Reativação", cor: "border-violet-300" },
  { key: "perdido", label: "Perdido", cor: "border-rose-300" },
];

export const ORIGENS: Record<string, string> = {
  instagram: "Instagram", whatsapp: "WhatsApp", google: "Google",
  indicacao: "Indicação", site: "Site", cliente_antigo: "Cliente antigo", campanha: "Campanha paga",
};

export type Lead = {
  id: string; clienteId: string; clienteNome: string; origem: string;
  etapa: LeadEtapa; obs: string; criadoEm: string;
};

export async function listLeads(): Promise<Lead[]> {
  const empresaId = await getCurrentEmpresaId();
  const rows = await prisma.lead.findMany({
    where: { empresaId },
    include: { cliente: { select: { nome: true } } },
    orderBy: { criadoEm: "desc" },
  });
  return rows.map((l) => ({
    id: l.id,
    clienteId: l.clienteId ?? "",
    clienteNome: l.cliente?.nome ?? "Lead",
    origem: l.origem ?? "",
    etapa: l.etapa as LeadEtapa,
    obs: l.obs ?? "",
    criadoEm: l.criadoEm.toISOString(),
  }));
}

export async function createLead(input: { clienteId: string; origem: string; obs: string }): Promise<void> {
  const empresaId = await getCurrentEmpresaId();
  if (!input.clienteId) return;
  await prisma.lead.create({
    data: { empresaId, clienteId: input.clienteId, origem: input.origem || null, etapa: "novo", obs: input.obs || null },
  });
}

export async function setLeadEtapa(id: string, etapa: LeadEtapa): Promise<void> {
  const empresaId = await getCurrentEmpresaId();
  await prisma.lead.updateMany({ where: { id, empresaId }, data: { etapa } });
}

export async function deleteLead(id: string): Promise<void> {
  const empresaId = await getCurrentEmpresaId();
  await prisma.lead.deleteMany({ where: { id, empresaId } });
}
