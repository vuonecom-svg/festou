"use server";

import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Troca a senha NO SERVIDOR e só então limpa a flag de senha temporária.
// (Antes a troca era no cliente e a limpeza numa action separada — dava para
// limpar a flag sem trocar a senha de fato.)
export async function trocarSenhaAction(novaSenha: string): Promise<{ ok: boolean; erro?: string }> {
  const senha = String(novaSenha ?? "");
  if (senha.length < 6) return { ok: false, erro: "A senha precisa ter ao menos 6 caracteres." };

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) return { ok: false, erro: "Sessão expirada. Entre novamente." };

  const { error } = await supabase.auth.updateUser({ password: senha });
  if (error) return { ok: false, erro: error.message };

  // Limpa a flag SÓ do usuário deste login (nunca por e-mail — e-mail não é
  // único global e limparia a flag de homônimo de outra empresa).
  await prisma.usuario.updateMany({
    where: { authUserId: user.id },
    data: { trocarSenha: false },
  });
  return { ok: true };
}

// Compat: limpa a flag do login atual (fluxos antigos). Escopado por authUserId.
export async function concluirTrocaSenha(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) return;
  await prisma.usuario.updateMany({
    where: { authUserId: user.id },
    data: { trocarSenha: false },
  });
}
