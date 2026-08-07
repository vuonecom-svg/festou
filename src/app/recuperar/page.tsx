"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { inputClass } from "@/components/ui/form";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Supa = ReturnType<typeof createSupabaseBrowserClient>;

export default function RecuperarPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "enviando" | "ok" | "erro">("idle");
  const [msg, setMsg] = useState("");
  const supaRef = useRef<Supa | null>(null);

  useEffect(() => {
    try { supaRef.current = createSupabaseBrowserClient(); } catch { /* noop */ }
  }, []);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    const supa = supaRef.current;
    if (!supa) { setMsg("Não foi possível iniciar. Recarregue a página."); setStatus("erro"); return; }
    const alvo = email.trim().toLowerCase();
    if (!alvo) return;
    setStatus("enviando");
    const { error } = await supa.auth.resetPasswordForEmail(alvo, {
      redirectTo: `${window.location.origin}/definir-senha`,
    });
    if (error) { setMsg(error.message); setStatus("erro"); return; }
    setStatus("ok");
  }

  return (
    <div className="min-h-screen grid place-items-center bg-background px-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center justify-center gap-2 mb-6">
          <BrandMark size={38} />
          <span className="font-semibold text-2xl tracking-wide">FesFlow</span>
        </Link>

        <div className="card p-6">
          <h1 className="text-lg font-semibold text-center">Recuperar acesso</h1>
          <p className="text-sm text-muted text-center mt-1">
            Enviamos um link para você criar uma nova senha.
          </p>

          {status === "ok" ? (
            <p className="mt-4 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
              Se este e-mail tiver uma conta, o link chega em instantes. Confira também o spam.
            </p>
          ) : (
            <form onSubmit={enviar} className="mt-5 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-foreground/80">E-mail</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className={inputClass} placeholder="voce@empresa.com" />
              </div>
              {status === "erro" && <p className="text-sm text-rose-600">{msg}</p>}
              <button type="submit" disabled={status === "enviando"}
                className="w-full inline-flex items-center justify-center rounded-lg h-10 bg-primary text-primary-fg font-medium hover:bg-primary/90 disabled:opacity-60">
                {status === "enviando" ? "Enviando…" : "Enviar link de acesso"}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-muted mt-5">
          <Link href="/entrar" className="text-primary font-medium hover:underline">← Voltar para o login</Link>
        </p>
      </div>
    </div>
  );
}
