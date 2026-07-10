"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, XCircle, CalendarSearch } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { verificarDisponibilidade } from "@/lib/disponibilidade";
import { inputClass, Field } from "@/components/ui/form";

export type BrinquedoDisp = {
  id: string;
  nome: string;
  tempoMontagemMin: number;
  tempoDesmontagemMin: number;
  tempoLimpezaMin: number;
};

export type ReservaDisp = {
  id: string;
  brinquedoId: string;
  brinquedoNome: string;
  clienteNome: string;
  cidade: string;
  eventoInicio: string;
  eventoFim: string;
  janelaInicio: string;
  janelaFim: string;
};

const fmt = (d: Date) => format(d, "dd/MM 'às' HH:mm", { locale: ptBR });

export function VerificadorDisponibilidade({
  brinquedos,
  reservas,
  transporteMin = 45,
}: {
  brinquedos: BrinquedoDisp[];
  reservas: ReservaDisp[];
  transporteMin?: number;
}) {
  const [brinquedoId, setBrinquedoId] = useState(brinquedos[0]?.id ?? "");
  const [data, setData] = useState(""); // preenchido com "hoje" no cliente (evita data fixa/hydration mismatch)
  const [horaIni, setHoraIni] = useState("14:00");
  const [horaFim, setHoraFim] = useState("18:00");

  useEffect(() => {
    setData(new Date().toISOString().slice(0, 10));
  }, []);

  const resultado = useMemo(() => {
    const b = brinquedos.find((x) => x.id === brinquedoId);
    if (!b || !data || !horaIni || !horaFim) return null;
    const inicio = new Date(`${data}T${horaIni}`);
    const fim = new Date(`${data}T${horaFim}`);
    if (isNaN(inicio.getTime()) || isNaN(fim.getTime()) || fim <= inicio) {
      return { erro: "Horário de término deve ser depois do início." };
    }
    const r = verificarDisponibilidade(
      brinquedoId,
      inicio,
      fim,
      {
        transporteMin,
        montagemMin: b.tempoMontagemMin,
        desmontagemMin: b.tempoDesmontagemMin,
        limpezaMin: b.tempoLimpezaMin,
      },
      reservas
    );
    return { ...r, nome: b.nome };
  }, [brinquedoId, data, horaIni, horaFim, brinquedos, reservas, transporteMin]);

  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-4">
        <CalendarSearch size={18} className="text-primary" />
        <h2 className="font-semibold">Está livre nesta data?</h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Brinquedo" htmlFor="v-brinquedo" className="sm:col-span-2">
          <select id="v-brinquedo" value={brinquedoId} onChange={(e) => setBrinquedoId(e.target.value)} className={inputClass}>
            {brinquedos.map((b) => (
              <option key={b.id} value={b.id}>{b.nome}</option>
            ))}
          </select>
        </Field>
        <Field label="Data do evento" htmlFor="v-data">
          <input id="v-data" type="date" value={data} onChange={(e) => setData(e.target.value)} className={inputClass} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Início" htmlFor="v-ini">
            <input id="v-ini" type="time" value={horaIni} onChange={(e) => setHoraIni(e.target.value)} className={inputClass} />
          </Field>
          <Field label="Término" htmlFor="v-fim">
            <input id="v-fim" type="time" value={horaFim} onChange={(e) => setHoraFim(e.target.value)} className={inputClass} />
          </Field>
        </div>
      </div>

      {resultado && "erro" in resultado && resultado.erro && (
        <p className="mt-4 text-sm text-rose-600">{resultado.erro}</p>
      )}

      {resultado && "disponivel" in resultado && (
        <div className="mt-4">
          {resultado.disponivel ? (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <p className="flex items-center gap-2 font-medium text-emerald-700">
                <CheckCircle2 size={18} /> Disponível!
              </p>
              <p className="text-sm text-emerald-700/80 mt-1">
                {resultado.nome} pode ser reservado. O brinquedo fica bloqueado de{" "}
                <strong>{fmt(resultado.janela.inicio)}</strong> a{" "}
                <strong>{fmt(resultado.janela.fim)}</strong> (já incluindo transporte, montagem e limpeza).
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-4">
              <p className="flex items-center gap-2 font-medium text-rose-700">
                <XCircle size={18} /> Indisponível — conflito de reserva
              </p>
              <ul className="mt-2 space-y-1.5">
                {resultado.conflitos.map((c) => (
                  <li key={c.id} className="text-sm text-rose-700/90">
                    Já reservado por <strong>{c.clienteNome}</strong> ({c.cidade}) —{" "}
                    {fmt(new Date(c.eventoInicio))} a {fmt(new Date(c.eventoFim))}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-rose-700/70 mt-2">
                O bloqueio considera os buffers de transporte, montagem, desmontagem e limpeza — por isso o conflito.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
