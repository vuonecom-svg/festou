"use server";

import { revalidatePath } from "next/cache";
import { updateEmpresa } from "@/lib/data/empresa";
import { uploadImagem } from "@/lib/upload";

export async function updateEmpresaAction(fd: FormData) {
  const s = (k: string) => String(fd.get(k) ?? "").trim();

  // Logo: upload de arquivo tem prioridade; senão usa o link colado.
  const arquivo = fd.get("logoFile");
  const enviado = arquivo instanceof File ? await uploadImagem(arquivo, "logos") : null;
  const logoUrl = enviado ?? s("logoUrl");

  await updateEmpresa({
    nome: s("nome"),
    cnpj: s("cnpj"),
    telefone: s("telefone"),
    email: s("email"),
    endereco: s("endereco"),
    cidade: s("cidade"),
    responsavel: s("responsavel"),
    logoUrl,
  });
  revalidatePath("/configuracoes");
  revalidatePath("/dashboard");
}
