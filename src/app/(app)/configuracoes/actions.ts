"use server";

import { revalidatePath } from "next/cache";
import { updateEmpresa } from "@/lib/data/empresa";

export async function updateEmpresaAction(fd: FormData) {
  const s = (k: string) => String(fd.get(k) ?? "").trim();
  await updateEmpresa({
    nome: s("nome"),
    cnpj: s("cnpj"),
    telefone: s("telefone"),
    email: s("email"),
    endereco: s("endereco"),
    cidade: s("cidade"),
    responsavel: s("responsavel"),
  });
  revalidatePath("/configuracoes");
  revalidatePath("/dashboard");
}
