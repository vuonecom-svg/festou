"use server";

import { revalidatePath } from "next/cache";
import { abrirManutencao, concluirManutencao, deleteManutencao, MANUT_TIPO, type ManutencaoTipo } from "@/lib/data/manutencoes";

export async function abrirManutencaoAction(fd: FormData) {
  const brinquedoId = String(fd.get("brinquedoId") ?? "");
  const tipo = String(fd.get("tipo") ?? "corretiva") as ManutencaoTipo;
  const descricao = String(fd.get("descricao") ?? "").trim();
  const custoRaw = String(fd.get("custo") ?? "").replace(",", ".");
  const custoNum = custoRaw ? Number(custoRaw) : NaN;
  const responsavel = String(fd.get("responsavel") ?? "").trim();
  if (brinquedoId && tipo in MANUT_TIPO) {
    await abrirManutencao({
      brinquedoId, tipo, descricao,
      custo: Number.isFinite(custoNum) ? custoNum : null,
      responsavel,
    });
  }
  revalidatePath("/manutencao");
  revalidatePath("/brinquedos");
  revalidatePath("/dashboard");
}

export async function concluirManutencaoAction(id: string) {
  await concluirManutencao(id);
  revalidatePath("/manutencao");
  revalidatePath("/brinquedos");
}

export async function deleteManutencaoAction(id: string) {
  await deleteManutencao(id);
  revalidatePath("/manutencao");
}
