"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function entrarAction(fd: FormData) {
  const email = String(fd.get("email") ?? "").trim();
  const senha = String(fd.get("senha") ?? "");
  const next = String(fd.get("next") ?? "/dashboard") || "/dashboard";

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
