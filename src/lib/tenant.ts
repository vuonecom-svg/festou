import { prisma } from "./prisma";
import { createSupabaseServerClient } from "./supabase/server";

// Empresa "atual".
// - Com AUTH_ENABLED=true: vem do usuário logado (Supabase → usuario → empresa).
// - Sem auth (padrão/demo): primeira empresa cadastrada.
let cachedNoAuth: string | null = null;

export async function getCurrentEmpresaId(): Promise<string> {
  if (process.env.AUTH_ENABLED === "true") {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getUser();
    const user = data.user;
    if (user) {
      const porAuth = await prisma.usuario.findFirst({ where: { authUserId: user.id } });
      if (porAuth?.empresaId) return porAuth.empresaId;
      if (user.email) {
        const porEmail = await prisma.usuario.findFirst({ where: { email: user.email.toLowerCase() } });
        if (porEmail?.empresaId) return porEmail.empresaId;
      }
    }
    throw new Error("Sessão sem empresa vinculada. Faça login novamente.");
  }

  if (cachedNoAuth) return cachedNoAuth;
  const empresa = await prisma.empresa.findFirst({ orderBy: { criadoEm: "asc" } });
  if (!empresa) throw new Error("Nenhuma empresa cadastrada. Rode o seed.");
  cachedNoAuth = empresa.id;
  return cachedNoAuth;
}
