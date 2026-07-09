import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AcessoResultado = { ok: boolean; motivo?: "sem-sessao" | "bloqueado" };

// Verifica se o usuário logado tem assinatura ativa. Só age com AUTH_ENABLED=true.
export async function verificarAcesso(): Promise<AcessoResultado> {
  if (process.env.AUTH_ENABLED !== "true") return { ok: true };

  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return { ok: false, motivo: "sem-sessao" };

  const email = data.user.email?.toLowerCase();
  const u = await prisma.usuario.findFirst({
    where: { OR: [{ authUserId: data.user.id }, ...(email ? [{ email }] : [])] },
    include: { empresa: { select: { statusAssinatura: true } } },
  });

  if (!u || !u.ativo) return { ok: false, motivo: "bloqueado" };
  const status = u.empresa?.statusAssinatura;
  if (status === "cancelada" || status === "inadimplente") {
    return { ok: false, motivo: "bloqueado" };
  }
  return { ok: true };
}
