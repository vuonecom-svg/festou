"use server";

import { revalidatePath } from "next/cache";
import { createDespesa, deleteDespesa, DESPESA_CATEGORIAS, type DespesaCategoria } from "@/lib/data/despesas";

export async function createDespesaAction(fd: FormData) {
  const categoria = String(fd.get("categoria") ?? "outros") as DespesaCategoria;
  const valor = Number(String(fd.get("valor") ?? "").replace(",", "."));
  const data = String(fd.get("data") ?? "");
  const descricao = String(fd.get("descricao") ?? "").trim();
  if (categoria in DESPESA_CATEGORIAS && Number.isFinite(valor) && valor > 0) {
    await createDespesa({ categoria, valor, data, descricao });
  }
  revalidatePath("/financeiro");
}

export async function deleteDespesaAction(id: string) {
  await deleteDespesa(id);
  revalidatePath("/financeiro");
}
