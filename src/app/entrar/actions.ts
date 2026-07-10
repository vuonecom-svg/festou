"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function entrarAction(fd: FormData) {
  const email = String(fd.get("email") ?? "").trim();
  const senha = String(fd.get("senha") ?? "");
  // Só aceita caminho interno — evita open-redirect (?next=https://evil.com ou //evil.com).
  const nextRaw = String(fd.get("next") ?? "/dashboard");
  const next = nextRaw.startsWith("/") && !nextRaw.startsWith("//") ? nextRaw : "/dashboard";

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
  if (error) {
    redirect(`/entrar?erro=1&next=${encodeURIComponent(next)}`);
  }
  redirect(next);
}

export async function sairAction() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/entrar");
}
