"use server";

import { revalidatePath } from "next/cache";
import { createCombo, deleteCombo } from "@/lib/data/combos";

export async function createComboAction(fd: FormData) {
  const nome = String(fd.get("nome") ?? "").trim();
  const descricao = String(fd.get("descricao") ?? "").trim();
  const valor = Number(String(fd.get("valor") ?? "").replace(",", "."));
  if (nome) await createCombo({ nome, descricao, valor: Number.isFinite(valor) ? valor : 0 });
  revalidatePath("/combos");
}

export async function deleteComboAction(id: string) {
  await deleteCombo(id);
  revalidatePath("/combos");
}
