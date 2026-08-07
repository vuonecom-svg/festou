import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { authAtivo } from "@/lib/auth-flag";

export type AcessoResultado = { ok: boolean; motivo?: "sem-sessao" | "bloqueado" };

// Verifica se o usuário logado tem assinatura ativa. Em prod sempre exige auth.
export async function verificarAcesso(): Promise<AcessoResultado> {
  if (!authAtivo()) return { ok: true };

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return { ok: false, motivo: "sem-sessao" };

  // Vínculo determinístico: prioriza authUserId; e-mail só como fallback
  // (usuario.email é único por empresa, não global).
  const email = data.user.email?.toLowerCase();
  let u = await prisma.usuario.findFirst({
    where: { authUserId: data.user.id },
    include: { empresa: { select: { statusAssinatura: true } } },
  });
  if (!u && email) {
    u = await prisma.usuario.findFirst({
      where: { email },
      include: { empresa: { select: { statusAssinatura: true } } },
    });
  }

  if (!u || !u.ativo) return { ok: false, motivo: "bloqueado" };
  const status = u.empresa?.statusAssinatura;
  if (status === "cancelada" || status === "inadimplente") {
    return { ok: false, motivo: "bloqueado" };
  }
  return { ok: true };
}
