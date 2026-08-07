"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { updateEmpresa } from "@/lib/data/empresa";
import { uploadImagem } from "@/lib/upload";

export async function updateEmpresaAction(fd: FormData) {
  const s = (k: string) => String(fd.get(k) ?? "").trim();

  // Logo: upload de arquivo tem prioridade; senão usa o link colado.
  const arquivo = fd.get("logoFile");
  let enviado: string | null = null;
  if (arquivo instanceof File && arquivo.size > 0) {
    try {
      enviado = await uploadImagem(arquivo, "logos");
    } catch (e) {
      redirect(`/configuracoes?erro=${encodeURIComponent(e instanceof Error ? e.message : "Falha no upload do logo.")}`);
    }
  }
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
