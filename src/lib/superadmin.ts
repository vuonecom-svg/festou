import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { authAtivo } from "@/lib/auth-flag";

// Donos da plataforma (super admin). Além destes, dá pra adicionar e-mails em
// app_config.chave='super_admin_emails' (separados por vírgula) sem novo deploy.
const DONOS = ["ecomclube@gmail.com"];

export async function emailAtual(): Promise<string | null> {
  if (!authAtivo()) return DONOS[0]; // dev/local: assume dono
  const sb = await createSupabaseServerClient();
  const { data } = await sb.auth.getUser();
  return data.user?.email?.toLowerCase() ?? null;
}

export async function ehSuperAdmin(): Promise<boolean> {
  const email = await emailAtual();
  if (!email) return false;
  if (DONOS.includes(email)) return true;
  try {
    const rows = await prisma.$queryRaw<{ valor: string }[]>`
      select valor from app_config where chave = 'super_admin_emails' limit 1`;
    const extra = (rows[0]?.valor ?? "").toLowerCase().split(/[,;\s]+/).filter(Boolean);
    return extra.includes(email);
  } catch {
    return false;
  }
}
