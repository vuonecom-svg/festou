"use client";

// Demonstração ao vivo do motor anti-overbooking, no site público.
//
// PROVA HONESTA: este componente importa `@/lib/disponibilidade` — exatamente o
// mesmo módulo que o sistema usa para aceitar ou recusar uma reserva. Não é
// simulação nem número inventado: o visitante mexe no horário e vê a decisão
// real do produto. É o tipo de prova que não depende de depoimento de ninguém.

import { useMemo, useState } from "react";
import { Check, X, Clock } from "lucide-react";
import { janelaBloqueio, verificarDisponibilidade, type Buffers } from "@/lib/disponibilidade";

// Buffers de exemplo — os valores reais são configuráveis por brinquedo no sistema.
const BUFFERS: Buffers = {
  transporteMin: 45,
  montagemMin: 30,
  desmontagemMin: 30,
  limpezaMin: 20,
};

const DIA = "2026-09-12";
const MIN = 60_000;
const DURACAO_FESTA_MIN = 4 * 60;

const hora = (h: number, m = 0) => new Date(`${DIA}T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`);
/** Soma minutos a uma data — vira o dia corretamente (21h + 4h = 01:00). */
const mais = (d: Date, min: number) => new Date(d.getTime() + min * MIN);
const hhmm = (d: Date) =>
  `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;

// A festa que já está confirmada na agenda: 14h–18h.
const FESTA_EXISTENTE = { inicio: hora(14), fim: hora(18) };
const JANELA_EXISTENTE = janelaBloqueio(FESTA_EXISTENTE.inicio, FESTA_EXISTENTE.fim, BUFFERS);

const RESERVAS = [
  {
    id: "reserva-existente",
    brinquedoId: "pula-pula-1",
    unidade: 1,
    janelaInicio: JANELA_EXISTENTE.inicio,
    janelaFim: JANELA_EXISTENTE.fim,
  },
];

const OPCOES = [10, 12, 16, 19, 20, 21, 22];

export function DemoAntiOverbooking() {
  const [inicioH, setInicioH] = useState(19);

  const { resultado, inicio, fim } = useMemo(() => {
    const ini = hora(inicioH);
    // A festa dura 4h: somar em minutos, para virar o dia sem gerar hora 25.
    const f = mais(ini, DURACAO_FESTA_MIN);
    return {
      resultado: verificarDisponibilidade("pula-pula-1", ini, f, BUFFERS, 1, RESERVAS),
      inicio: ini,
      fim: f,
    };
  }, [inicioH]);

  const livre = resultado.disponivel;

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
      <p className="text-xs uppercase tracking-wide text-sidebar-fg/60 mb-1">
        Teste você mesmo
      </p>
      <p className="text-sm text-sidebar-fg/80 mb-4">
        Já existe uma festa confirmada das <strong className="text-white">14h às 18h</strong> com o
        único pula-pula. Tente encaixar outra festa de 4 horas:
      </p>

      <div className="flex flex-wrap gap-2 mb-5">
        {OPCOES.map((h) => (
          <button
            key={h}
            type="button"
            onClick={() => setInicioH(h)}
            aria-pressed={inicioH === h}
            className={
              "rounded-lg px-3 h-9 text-sm font-medium transition-colors " +
              (inicioH === h
                ? "bg-white text-sidebar"
                : "bg-white/10 text-white hover:bg-white/20")
            }
          >
            {String(h).padStart(2, "0")}h
          </button>
        ))}
      </div>

      <div
        className={
          "rounded-lg border p-4 " +
          (livre
            ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-100"
            : "bg-rose-500/15 border-rose-500/30 text-rose-100")
        }
        aria-live="polite"
      >
        <p className="flex items-center gap-2 font-semibold">
          {livre ? <Check size={18} /> : <X size={18} />}
          Festa das {hhmm(inicio)} às {hhmm(fim)} — {livre ? "liberado" : "bloqueado"}
        </p>
        <p className="mt-2 text-sm opacity-90 flex items-start gap-2">
          <Clock size={15} className="shrink-0 mt-0.5" />
          <span>
            O brinquedo ficaria indisponível das{" "}
            <strong>{hhmm(resultado.janela.inicio)}</strong> às{" "}
            <strong>{hhmm(resultado.janela.fim)}</strong> — a festa mais {BUFFERS.transporteMin}min
            de transporte, {BUFFERS.montagemMin}min de montagem, {BUFFERS.desmontagemMin}min de
            desmontagem e {BUFFERS.limpezaMin}min de limpeza.
          </span>
        </p>
        {!livre && (
          <p className="mt-2 text-sm opacity-90">
            Conflita com a festa das 14h (que ocupa o brinquedo até{" "}
            {hhmm(JANELA_EXISTENTE.fim)}). O sistema recusa a reserva.
          </p>
        )}
      </div>

      <p className="mt-4 text-xs text-sidebar-fg/60">
        Esta demonstração roda o mesmo motor de disponibilidade do sistema — não é uma simulação.
        No FesFlow, a garantia final é do banco de dados: mesmo que duas pessoas tentem reservar no
        mesmo instante, o conflito é recusado.
      </p>
    </div>
  );
}
