import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { authAtivo } from "@/lib/auth-flag";

export type AcessoResultado = { ok: boolean; motivo?: "sem-sessao" | "bloqueado" | "trocar-senha" };

// Verifica se o usuário logado tem assinatura ativa. Em prod sempre exige auth.
export async function verificarAcesso(): Promise<AcessoResultado> {
  if (!authAtivo()) return { ok: true };

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return { ok: false, motivo: "sem-sessao" };

  // Vínculo determinístico: prioriza authUserId; e-mail só como fallback e SÓ
  // para cadastro ainda sem login vinculado (e-mail não é único global — sem o
  // filtro, casaria homônimo de outra empresa).
  const email = data.user.email?.toLowerCase();
  let u = await prisma.usuario.findFirst({
    where: { authUserId: data.user.id },
    include: { empresa: { select: { statusAssinatura: true } } },
  });
  if (!u && email) {
    u = await prisma.usuario.findFirst({
      where: { email, authUserId: null },
      orderBy: { criadoEm: "asc" },
      include: { empresa: { select: { statusAssinatura: true } } },
    });
  }

  if (!u || !u.ativo) return { ok: false, motivo: "bloqueado" };
  const status = u.empresa?.statusAssinatura;
  if (status === "cancelada" || status === "inadimplente") {
    return { ok: false, motivo: "bloqueado" };
  }
  // Senha temporária: obriga a troca antes de usar qualquer página do painel.
  if (u.trocarSenha) return { ok: false, motivo: "trocar-senha" };
  return { ok: true };
}
