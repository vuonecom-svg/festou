import "server-only";
import { createClient } from "@supabase/supabase-js";
import { prisma } from "@/lib/prisma";

// service_role: prioriza a tabela app_config (banco) — assim uma chave cadastrada
// lá vence, mesmo que a env do host (Vercel) esteja ausente ou errada. Env fica
// como fallback. Mesmo padrão da SENDGRID_API_KEY.
async function getServiceRoleKey(): Promise<string | undefined> {
  try {
    const rows = await prisma.$queryRaw<{ valor: string }[]>`
      select valor from app_config where chave = 'supabase_service_role' limit 1`;
    if (rows[0]?.valor) return rows[0].valor;
  } catch {
    // sem banco/coluna: cai para a env
  }
  return process.env.SUPABASE_SERVICE_ROLE_KEY;
}

// Cliente admin (service_role) — SERVER-ONLY. Usado pelo webhook para criar
// usuários e enviar convites. NUNCA importar em código de cliente.
export async function supabaseAdmin() {
  const key = await getServiceRoleKey();
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    key!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
