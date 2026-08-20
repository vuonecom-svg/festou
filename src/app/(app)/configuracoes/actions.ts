"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { updateEmpresa } from "@/lib/data/empresa";
import { uploadImagem } from "@/lib/upload";
import { getCurrentEmpresaId } from "@/lib/tenant";
import { podeGerir } from "@/lib/rbac";

export async function updateEmpresaAction(fd: FormData) {
  // Auth/tenant ANTES de tocar no storage (server action não passa pelo layout);
  // e dados da empresa (razão social, CNPJ, logo — saem no contrato) são de
  // admin/gerente.
  await getCurrentEmpresaId();
  if (!(await podeGerir())) {
    redirect(`/configuracoes?erro=${encodeURIComponent("Sem permissão para alterar os dados da empresa (apenas admin/gerente).")}`);
  }
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
