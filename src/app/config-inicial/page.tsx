"use client";

import { useState } from "react";
import {
  Tent, Building2, UtensilsCrossed, Candy, Sparkles, PartyPopper, ArrowRight, Check,
  type LucideIcon,
} from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { inputClass } from "@/components/ui/form";
import { NICHO_OPCOES } from "@/lib/nichos";
import { salvarPerfilInicial } from "./actions";

const ICONS: Record<string, LucideIcon> = {
  Tent, Building2, UtensilsCrossed, Candy, Sparkles, PartyPopper,
};

const EQUIPES = [
  { v: "so-eu", label: "Só eu" },
  { v: "2-5", label: "2 a 5 pessoas" },
  { v: "6-mais", label: "6 ou mais" },
];
const FOCOS = [
  { v: "agenda", label: "Agenda e disponibilidade" },
  { v: "orcamentos", label: "Orçamentos e contratos" },
  { v: "financeiro", label: "Financeiro e recebimentos" },
  { v: "clientes", label: "Clientes e catálogo" },
];

export default function ConfigInicialPage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [nicho, setNicho] = useState<string>("");
  const [oferece, setOferece] = useState("");
  const [equipe, setEquipe] = useState("");
  const [foco, setFoco] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  async function concluir() {
    setSalvando(true);
    setErro("");
    try {
      const r = await salvarPerfilInicial({ nicho, oferece, equipe, foco });
      if (!r.ok) { setErro("Não foi possível salvar. Tente de novo."); setSalvando(false); return; }
      window.location.href = "/dashboard";
    } catch {
      setErro("Algo deu errado. Tente de novo.");
      setSalvando(false);
    }
  }

  return (
    <div className="min-h-screen bg-background px-4 py-10">
      <div className="w-full max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-2 mb-2">
          <BrandMark size={34} />
          <span className="font-semibold text-xl tracking-wide">FesFlow</span>
        </div>
        <p className="text-center text-sm text-muted mb-6">
          Passo {step} de 2 — vamos deixar o sistema com a sua cara.
        </p>

        {step === 1 ? (
          <div className="card p-6">
            <h1 className="text-xl font-semibold text-center">Qual é o seu ramo?</h1>
            <p className="text-sm text-muted text-center mt-1">
              Assim montamos o painel ideal pra você — agenda, financeiro, cadastros e tudo mais.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {NICHO_OPCOES.map((n) => {
                const Icon = ICONS[n.icon] ?? PartyPopper;
                const ativo = nicho === n.key;
                return (
                  <button
                    key={n.key}
                    type="button"
                    onClick={() => setNicho(n.key)}
                    className={
                      "flex items-center gap-3 rounded-xl border p-4 text-left transition " +
                      (ativo ? "border-primary bg-primary-soft ring-1 ring-primary" : "border-border hover:bg-surface")
                    }
                  >
                    <span className={"grid place-items-center h-10 w-10 rounded-lg shrink-0 " + (ativo ? "bg-primary text-primary-fg" : "bg-surface text-primary")}>
                      <Icon size={20} />
                    </span>
                    <span className="font-medium text-sm">{n.label}</span>
                    {ativo && <Check size={18} className="ml-auto text-primary" />}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              disabled={!nicho}
              onClick={() => setStep(2)}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 rounded-lg h-11 bg-primary text-primary-fg font-medium hover:bg-primary/90 disabled:opacity-50"
            >
              Continuar <ArrowRight size={18} />
            </button>
          </div>
        ) : (
          <div className="card p-6">
            <h1 className="text-xl font-semibold text-center">Conta um pouco sobre você</h1>
            <p className="text-sm text-muted text-center mt-1">Rapidinho — 3 perguntas para priorizar o que importa.</p>

            <div className="mt-6 space-y-5">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-foreground/80">O que você aluga ou oferece?</label>
                <input value={oferece} onChange={(e) => setOferece(e.target.value)} className={inputClass} placeholder="Ex.: pula-pulas e infláveis, mesa de doces, salão para 150 pessoas…" />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-foreground/80">Tamanho da equipe</label>
                <div className="flex flex-wrap gap-2">
                  {EQUIPES.map((e) => (
                    <button key={e.v} type="button" onClick={() => setEquipe(e.v)}
                      className={"rounded-lg border px-4 h-10 text-sm font-medium " + (equipe === e.v ? "border-primary bg-primary-soft text-primary" : "border-border hover:bg-surface")}>
                      {e.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-foreground/80">Qual sua maior prioridade agora?</label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {FOCOS.map((f) => (
                    <button key={f.v} type="button" onClick={() => setFoco(f.v)}
                      className={"rounded-lg border px-4 h-11 text-sm font-medium text-left " + (foco === f.v ? "border-primary bg-primary-soft text-primary" : "border-border hover:bg-surface")}>
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {erro && <p className="text-sm text-rose-600">{erro}</p>}

              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setStep(1)} className="rounded-lg border border-border px-5 h-11 font-medium hover:bg-surface">
                  Voltar
                </button>
                <button type="button" onClick={concluir} disabled={salvando}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg h-11 bg-primary text-primary-fg font-medium hover:bg-primary/90 disabled:opacity-60">
                  {salvando ? "Preparando seu painel…" : "Concluir e entrar"} <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
