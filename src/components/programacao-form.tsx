"use client";

import { useEffect, useState } from "react";
import { FileDown, CalendarRange } from "lucide-react";
import { Field, inputClass } from "@/components/ui/form";

function iso(d: Date): string {
  return d.toISOString().slice(0, 10);
}
function addDias(d: Date, n: number): Date {
  return new Date(d.getTime() + n * 86_400_000);
}

// Relatório de programação: escolhe o período (com atalhos) e abre o PDF.
export function ProgramacaoForm() {
  const [de, setDe] = useState("");
  const [ate, setAte] = useState("");

  // Preenchido no cliente (evita hydration mismatch com data do servidor).
  useEffect(() => {
    const hoje = new Date();
    setDe(iso(hoje));
    setAte(iso(addDias(hoje, 6)));
  }, []);

  function preset(tipo: "hoje" | "fds" | "semana") {
    const hoje = new Date();
    if (tipo === "hoje") {
      setDe(iso(hoje)); setAte(iso(hoje));
      return;
    }
    if (tipo === "fds") {
      // Próximo fim de semana: sexta a domingo (se já for fds, o atual).
      const dow = hoje.getDay(); // 0=dom ... 5=sex 6=sáb
      const ateSexta = dow === 0 ? -2 : dow === 6 ? -1 : 5 - dow;
      const sexta = addDias(hoje, ateSexta);
      setDe(iso(dow === 0 || dow === 6 ? hoje : sexta));
      setAte(iso(addDias(sexta, 2)));
      return;
    }
    setDe(iso(hoje)); setAte(iso(addDias(hoje, 6)));
  }

  const ok = de && ate && ate >= de;

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-1">
        <CalendarRange size={18} className="text-primary" />
        <h2 className="font-semibold">Programação de eventos</h2>
      </div>
      <p className="text-sm text-muted mb-4">
        Relatório em PDF com tudo que acontece no período — horários, contatos, endereços, brinquedos e o que falta receber. Perfeito pra passar pra equipe.
      </p>

      <div className="flex flex-wrap gap-2 mb-3">
        <button type="button" onClick={() => preset("hoje")} className="h-9 px-3 rounded-lg text-sm border border-border bg-surface hover:bg-background">Hoje</button>
        <button type="button" onClick={() => preset("fds")} className="h-9 px-3 rounded-lg text-sm border border-border bg-surface hover:bg-background">Fim de semana</button>
        <button type="button" onClick={() => preset("semana")} className="h-9 px-3 rounded-lg text-sm border border-border bg-surface hover:bg-background">Próximos 7 dias</button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="De" htmlFor="prog-de">
          <input id="prog-de" type="date" value={de} onChange={(e) => setDe(e.target.value)} className={inputClass} />
        </Field>
        <Field label="Até" htmlFor="prog-ate">
          <input id="prog-ate" type="date" value={ate} onChange={(e) => setAte(e.target.value)} className={inputClass} />
        </Field>
      </div>

      <a
        href={ok ? `/agenda/programacao?de=${de}&ate=${ate}` : undefined}
        target="_blank"
        rel="noopener noreferrer"
        aria-disabled={!ok}
        className={
          "mt-4 inline-flex items-center gap-2 rounded-lg h-10 px-4 text-sm font-semibold " +
          (ok ? "bg-primary text-primary-fg hover:bg-primary/90" : "bg-primary/40 text-primary-fg cursor-not-allowed pointer-events-none")
        }
      >
        <FileDown size={16} /> Gerar relatório (PDF)
      </a>
    </div>
  );
}
