import { cache } from "react";
import { redirect } from "next/navigation";
import { prisma } from "./prisma";
import { createSupabaseServerClient } from "./supabase/server";

// Empresa "atual".
// - Com AUTH_ENABLED=true: vem do usuário logado (Supabase → usuario → empresa),
//   e a assinatura é checada AQUI (vale também nas server actions, que não
//   passam pelo layout — fecha o bypass de paywall).
// - Sem auth (padrão/demo): primeira empresa cadastrada.
//
// Envolvido em React cache(): resolve sessão→empresa uma única vez por
// requisição, mesmo com várias funções de dados chamando no mesmo render.
let cachedNoAuth: string | null = null;

export const getCurrentEmpresaId = cache(async (): Promise<string> => {
  if (process.env.AUTH_ENABLED === "true") {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getUser();
    const user = data.user;
    if (!user) redirect("/entrar");

    const email = user.email?.toLowerCase();
    const u = await prisma.usuario.findFirst({
      where: { OR: [{ authUserId: user.id }, ...(email ? [{ email }] : [])] },
      include: { empresa: { select: { statusAssinatura: true } } },
    });
    if (!u) redirect("/acesso-bloqueado");

    const status = u.empresa?.statusAssinatura;
    if (!u.ativo || status === "cancelada" || status === "inadimplente") {
      redirect("/acesso-bloqueado");
    }
    return u.empresaId;
  }

  if (cachedNoAuth) return cachedNoAuth;
  const empresa = await prisma.empresa.findFirst({ orderBy: { criadoEm: "asc" } });
  if (!empresa) throw new Error("Nenhuma empresa cadastrada. Rode o seed.");
  cachedNoAuth = empresa.id;
  return cachedNoAuth;
});
