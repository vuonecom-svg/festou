"use server";

import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Limpa a flag de senha temporária do usuário logado. Não passa por
// getCurrentEmpresaId (que redirecionaria de volta), resolve direto pela sessão.
export async function concluirTrocaSenha(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) return;
  const email = user.email?.toLowerCase();
  await prisma.usuario.updateMany({
    where: { OR: [{ authUserId: user.id }, ...(email ? [{ email }] : [])] },
    data: { trocarSenha: false },
  });
}
