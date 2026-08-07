"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { inputClass } from "@/components/ui/form";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { concluirTrocaSenha } from "@/app/trocar-senha/actions";

type Supa = ReturnType<typeof createSupabaseBrowserClient>;

export default function DefinirSenhaPage() {
  const [senha, setSenha] = useState("");
  const [confirma, setConfirma] = useState("");
  const [status, setStatus] = useState<"idle" | "salvando" | "ok" | "erro" | "semsessao">("idle");
  const [msg, setMsg] = useState("");
  const supaRef = useRef<Supa | null>(null);

  // Cria o cliente Supabase só no navegador (nunca no build/SSR) e estabelece a
  // sessão a partir do link do e-mail. Duas formas:
  // 1) token_hash na query (?token_hash=..&type=recovery): verificamos AQUI, no
  //    navegador (verifyOtp). Como o scanner do e-mail só faz GET e não roda
  //    nosso JS, ele NÃO consome o token — resolve o "otp_expired" por pré-clique.
  // 2) fluxo implícito (token no #hash): o cliente já cria a sessão sozinho.
  useEffect(() => {
    let supa: Supa;
    try {
      supa = createSupabaseBrowserClient();
    } catch {
      setStatus("semsessao");
      return;
    }
    supaRef.current = supa;

    (async () => {
      const params = new URLSearchParams(window.location.search);
      const tokenHash = params.get("token_hash");
      const type = params.get("type") ?? "recovery";
      if (tokenHash) {
        const { error } = await supa.auth.verifyOtp({
          type: type as "recovery" | "invite" | "signup" | "email",
          token_hash: tokenHash,
        });
        if (error) { setStatus("semsessao"); return; }
        window.history.replaceState({}, "", "/definir-senha");
        return;
      }
      const { data } = await supa.auth.getSession();
      if (!data.session) setStatus("semsessao");
    })();
  }, []);

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    if (senha.length < 6) { setMsg("A senha precisa ter ao menos 6 caracteres."); setStatus("erro"); return; }
    if (senha !== confirma) { setMsg("As senhas não conferem."); setStatus("erro"); return; }
    const supa = supaRef.current;
    if (!supa) { setMsg("Não foi possível iniciar. Recarregue a página."); setStatus("erro"); return; }
    setStatus("salvando");
    const { error } = await supa.auth.updateUser({ password: senha });
    if (error) { setMsg(error.message); setStatus("erro"); return; }
    await concluirTrocaSenha();
    setStatus("ok");
    setTimeout(() => { window.location.href = "/dashboard"; }, 1200);
  }

  return (
    <div className="min-h-screen grid place-items-center bg-background px-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center justify-center gap-2 mb-6">
          <BrandMark size={38} />
          <span className="font-semibold text-2xl tracking-wide">FesFlow</span>
        </Link>

        <div className="card p-6">
          <h1 className="text-lg font-semibold text-center">Crie sua senha</h1>
          <p className="text-sm text-muted text-center mt-1">Defina a senha de acesso à sua conta.</p>

          {status === "semsessao" ? (
            <p className="mt-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              Link inválido ou expirado. Abra o link mais recente que enviamos no seu e-mail.
            </p>
          ) : status === "ok" ? (
            <p className="mt-4 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
              Senha criada! Entrando… 🎉
            </p>
          ) : (
            <form onSubmit={salvar} className="mt-5 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-foreground/80">Nova senha</label>
                <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required className={inputClass} placeholder="••••••••" />
              </div>
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-foreground/80">Confirmar senha</label>
                <input type="password" value={confirma} onChange={(e) => setConfirma(e.target.value)} required className={inputClass} placeholder="••••••••" />
              </div>
              {status === "erro" && <p className="text-sm text-rose-600">{msg}</p>}
              <button type="submit" disabled={status === "salvando"}
                className="w-full inline-flex items-center justify-center rounded-lg h-10 bg-primary text-primary-fg font-medium hover:bg-primary/90 disabled:opacity-60">
                {status === "salvando" ? "Salvando…" : "Criar senha e entrar"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
