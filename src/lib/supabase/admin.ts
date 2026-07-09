import { createClient } from "@supabase/supabase-js";

// Cliente admin (service_role) — SERVER-ONLY. Usado pelo webhook para criar
// usuários e enviar convites. NUNCA importar em código de cliente.
export function supabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
