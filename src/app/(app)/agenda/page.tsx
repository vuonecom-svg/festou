import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MapPin, User, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { VerificadorDisponibilidade } from "@/components/verificador-disponibilidade";
import { listBrinquedos } from "@/lib/data/brinquedos";
import { listReservas, reservasParaEngine, RESERVA_STATUS } from "@/lib/data/reservas";

const hora = (iso: string) => format(parseISO(iso), "HH:mm");
const janelaFmt = (iso: string) => format(parseISO(iso), "dd/MM HH:mm");

export default async function AgendaPage() {
  const [reservas, brinquedos, engineReservas] = await Promise.all([
    listReservas(),
    listBrinquedos(),
    reservasParaEngine(),
  ]);

  // Agrupa por dia
  const porDia = new Map<string, typeof reservas>();
  for (const r of reservas) {
    const dia = format(parseISO(r.eventoInicio), "yyyy-MM-dd");
    if (!porDia.has(dia)) porDia.set(dia, []);
    porDia.get(dia)!.push(r);
  }

  const brinquedosDisp = brinquedos.map((b) => ({
    id: b.id,
    nome: b.nome,
    quantidade: b.quantidade,
    tempoMontagemMin: b.tempoMontagemMin,
    tempoDesmontagemMin: b.tempoDesmontagemMin,
    tempoLimpezaMin: b.tempoLimpezaMin,
  }));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold">Agenda</h1>
        <p className="text-sm text-muted">
          {reservas.length} reservas · bloqueio automático com transporte, montagem e limpeza
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Verificador (diferencial) */}
        <div className="lg:col-span-1 lg:sticky lg:top-0 lg:self-start">
          <VerificadorDisponibilidade brinquedos={brinquedosDisp} reservas={engineReservas} />
        </div>

        {/* Lista por dia */}
        <div className="lg:col-span-2 space-y-5">
          {[...porDia.entries()].map(([dia, itens]) => (
            <div key={dia}>
              <div className="flex items-center gap-2 mb-2">
                <CalendarDays size={16} className="text-primary" />
                <h2 className="font-semibold capitalize">
                  {format(parseISO(dia + "T00:00"), "EEEE, dd 'de' MMMM", { locale: ptBR })}
                </h2>
                <span className="text-xs text-muted">({itens.length})</span>
              </div>
              <div className="space-y-2">
                {itens.map((r) => {
                  const st = RESERVA_STATUS[r.status];
                  return (
                    <div key={r.id} className="card p-4 flex items-start gap-4">
                      <div className="text-center shrink-0 w-16">
                        <p className="font-semibold tabular-nums">{hora(r.eventoInicio)}</p>
                        <p className="text-xs text-muted tabular-nums">{hora(r.eventoFim)}</p>
                      </div>
                      <span className={"mt-1.5 h-2.5 w-2.5 rounded-full shrink-0 " + st.dot} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium">{r.brinquedoNome}</p>
                          <Badge className={st.badge}>{st.label}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted mt-1 flex-wrap">
                          <span className="inline-flex items-center gap-1">
                            <User size={13} /> {r.clienteNome}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <MapPin size={13} /> {r.cidade}
                          </span>
                        </div>
                        <p className="text-xs text-muted/80 mt-1.5">
                          Brinquedo bloqueado: {janelaFmt(r.janelaInicio)} → {janelaFmt(r.janelaFim)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
