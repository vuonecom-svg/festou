"use server";

import { revalidatePath } from "next/cache";
import { createCombo, deleteCombo } from "@/lib/data/combos";
import { podeGerir } from "@/lib/rbac";

export async function createComboAction(fd: FormData) {
  const nome = String(fd.get("nome") ?? "").trim();
  const descricao = String(fd.get("descricao") ?? "").trim();
  const valor = Number(String(fd.get("valor") ?? "").replace(",", "."));
  // Valor obrigatório e positivo — sem combo fantasma de R$ 0,00 nem negativo.
  if (nome && Number.isFinite(valor) && valor > 0) {
    await createCombo({ nome, descricao, valor });
  }
  revalidatePath("/combos");
}

export async function deleteComboAction(id: string) {
  if (!(await podeGerir())) return;
  await deleteCombo(id);
  revalidatePath("/combos");
}
