"use server";

import { revalidatePath } from "next/cache";
import { createLead, setLeadEtapa, deleteLead, ETAPAS, type LeadEtapa } from "@/lib/data/crm";
import { podeGerir } from "@/lib/rbac";

export async function createLeadAction(fd: FormData) {
  const clienteId = String(fd.get("clienteId") ?? "");
  const origem = String(fd.get("origem") ?? "").trim();
  const obs = String(fd.get("obs") ?? "").trim();
  if (clienteId) await createLead({ clienteId, origem, obs });
  revalidatePath("/crm");
}

export async function setLeadEtapaAction(id: string, fd: FormData) {
  const etapa = String(fd.get("etapa") ?? "novo") as LeadEtapa;
  if (ETAPAS.some((e) => e.key === etapa)) await setLeadEtapa(id, etapa);
  revalidatePath("/crm");
}

export async function deleteLeadAction(id: string) {
  if (!(await podeGerir())) return;
  await deleteLead(id);
  revalidatePath("/crm");
}
