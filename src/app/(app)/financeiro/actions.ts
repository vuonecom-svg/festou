"use server";

import { revalidatePath } from "next/cache";
import { createDespesa, deleteDespesa, DESPESA_CATEGORIAS, type DespesaCategoria } from "@/lib/data/despesas";
import { createReceita, deleteReceita, RECEITA_CATEGORIAS, type ReceitaCategoria } from "@/lib/data/receitas";

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

export async function createReceitaAction(fd: FormData) {
  const categoria = String(fd.get("categoria") ?? "locacao_avulsa") as ReceitaCategoria;
  const valor = Number(String(fd.get("valor") ?? "").replace(",", "."));
  const data = String(fd.get("data") ?? "");
  const forma = String(fd.get("forma") ?? "").trim();
  const descricao = String(fd.get("descricao") ?? "").trim();
  if (categoria in RECEITA_CATEGORIAS && Number.isFinite(valor) && valor > 0) {
    await createReceita({ categoria, valor, data, forma, descricao });
  }
  revalidatePath("/financeiro");
}

export async function deleteReceitaAction(id: string) {
  await deleteReceita(id);
  revalidatePath("/financeiro");
}
