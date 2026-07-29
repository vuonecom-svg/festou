import Link from "next/link";
import { notFound } from "next/navigation";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, CalendarCheck, CheckCircle2, FileSignature, Trash2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { inputClass } from "@/components/ui/form";
import { ConfirmButton } from "@/components/confirm-button";
import { getPedido, PEDIDO_FIN, PEDIDO_OP, type PedidoStatusOp } from "@/lib/data/pedidos";
import { formatBRL } from "@/lib/utils";
import { registrarPagamentoAction, avancarStatusAction, excluirPedidoAction, reagendarPedidoAction } from "../actions";

const FLUXO_OP: PedidoStatusOp[] = [
  "aguardando_separacao",
  "saiu_entrega",
  "montado",
  "em_evento",
  "retirado",
  "finalizado",
];

export default async function PedidoDetalhePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ erro?: string; ok?: string }>;
}) {
  const { id } = await params;
  const { erro, ok } = await searchParams;
  const p = await getPedido(id);
  if (!p) notFound();

  const pagar = registrarPagamentoAction.bind(null, id);
  const quitar = registrarPagamentoAction.bind(null, id);
  const excluir = excluirPedidoAction.bind(null, id);
  const remarcar = reagendarPedidoAction.bind(null, id);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link href="/pedidos" className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground">
            <ChevronLeft size={16} /> Locações
          </Link>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <h1 className="text-xl font-semibold">Pedido #{p.numero}</h1>
            <Badge className={PEDIDO_FIN[p.statusFinanceiro].badge}>{PEDIDO_FIN[p.statusFinanceiro].label}</Badge>
            <Badge className={PEDIDO_OP[p.statusOperacional].badge}>{PEDIDO_OP[p.statusOperacional].label}</Badge>
          </div>
          <p className="text-sm text-muted">{p.clienteNome} · {p.cidade}</p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={`/pedidos/${p.id}/contrato`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg text-sm font-medium h-10 px-4 bg-primary text-primary-fg hover:bg-primary/90"
          >
            <FileSignature size={16} /> Gerar contrato (PDF)
          </a>
          <ConfirmButton
            action={excluir}
            confirm={`Excluir a locação #${p.numero}? Isso remove as reservas da agenda e não pode ser desfeito.`}
            className="inline-flex items-center gap-2 rounded-lg text-sm font-medium h-10 px-4 border border-rose-200 text-rose-600 hover:bg-rose-50"
          >
            <Trash2 size={16} /> Excluir
          </ConfirmButton>
        </div>
      </div>

      {erro && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 flex items-center gap-2">
          <AlertCircle size={16} /> {erro}
        </div>
      )}
      {ok && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700 flex items-center gap-2">
          <CheckCircle2 size={16} /> Locação remarcada com sucesso.
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Itens */}
        <div className="lg:col-span-2 space-y-5">
          <div className="card p-5">
            <h2 className="font-semibold mb-3">Brinquedos e itens</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted border-b border-border">
                    <th className="font-medium py-2">Item</th>
                    <th className="font-medium py-2 text-center">Qtd</th>
                    <th className="font-medium py-2 text-right">Unit.</th>
                    <th className="font-medium py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {p.itens.map((it, i) => (
                    <tr key={i} className="border-b border-border last:border-0">
                      <td className="py-2.5">{it.nome}</td>
                      <td className="py-2.5 text-center tabular-nums">{it.qtd}</td>
                      <td className="py-2.5 text-right tabular-nums">{formatBRL(it.valorUnit)}</td>
                      <td className="py-2.5 text-right tabular-nums font-medium">{formatBRL(it.valorTotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-emerald-600 mt-3 flex items-center gap-1.5">
              <CalendarCheck size={14} /> {p.reservaIds.length} reserva(s) criada(s) na agenda (sem conflito).
            </p>
          </div>

          {/* Status operacional */}
          <div className="card p-5">
            <h2 className="font-semibold mb-3">Status da operação</h2>
            <div className="flex flex-wrap gap-2">
              {FLUXO_OP.map((s) => {
                const avancar = avancarStatusAction.bind(null, id, s);
                const atual = p.statusOperacional === s;
                return (
                  <form key={s} action={avancar}>
                    <button disabled={atual}
                      className={"h-9 px-3 rounded-lg text-sm border transition-colors " +
                        (atual ? PEDIDO_OP[s].badge + " border-transparent font-medium" : "border-border bg-surface hover:bg-background text-foreground/70")}>
                      {PEDIDO_OP[s].label}
                    </button>
                  </form>
                );
              })}
            </div>
          </div>
        </div>

        {/* Financeiro + evento */}
        <div className="space-y-5">
          <div className="card p-5">
            <h2 className="font-semibold mb-3">Financeiro</h2>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-muted">Total</span><span className="font-semibold">{formatBRL(p.total)}</span></div>
              <div className="flex justify-between"><span className="text-muted">Sinal / pago</span><span className="tabular-nums">{formatBRL(p.sinalPago)}</span></div>
              <div className="flex justify-between text-primary font-medium"><span>Restante</span><span className="tabular-nums">{formatBRL(p.valorRestante)}</span></div>
            </div>

            {p.valorRestante > 0 ? (
              <div className="mt-4 space-y-2">
                <form action={pagar} className="flex gap-2">
                  <input name="valor" type="number" step="0.01" min="0" placeholder="Valor recebido" className={inputClass} />
                  <button className="h-10 px-3 rounded-lg text-sm font-medium bg-primary text-primary-fg hover:bg-primary/90 shrink-0">Registrar</button>
                </form>
                <form action={quitar}>
                  <input type="hidden" name="valor" value={p.valorRestante} />
                  <button className="w-full h-9 rounded-lg text-sm border border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                    Quitar restante ({formatBRL(p.valorRestante)})
                  </button>
                </form>
              </div>
            ) : (
              <p className="mt-4 flex items-center gap-2 text-sm text-emerald-600 font-medium">
                <CheckCircle2 size={16} /> Pedido quitado
              </p>
            )}
          </div>

          <div className="card p-5">
            <h2 className="font-semibold mb-2">Evento</h2>
            <p className="text-sm">
              {p.dataEvento ? format(parseISO(p.dataEvento + "T00:00"), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : "—"}
            </p>
            <p className="text-sm text-muted mt-1">Entrega {p.horaEntrega || "—"} · Retirada {p.horaRetirada || "—"}</p>
            <Link href={`/orcamentos/${p.orcamentoId}`} className="text-sm text-primary hover:underline mt-2 inline-block">
              Ver orçamento de origem
            </Link>

            <details className="mt-4 border-t border-border pt-3 group">
              <summary className="text-sm font-medium cursor-pointer text-foreground/80 hover:text-foreground select-none">
                Editar / remarcar data e horário
              </summary>
              <form action={remarcar} className="mt-3 space-y-3">
                <div>
                  <label className="block text-xs text-muted mb-1">Data do evento</label>
                  <input name="dataEvento" type="date" defaultValue={p.dataEvento} required className={inputClass} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-muted mb-1">Entrega</label>
                    <input name="horaEntrega" type="time" defaultValue={p.horaEntrega} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-xs text-muted mb-1">Retirada</label>
                    <input name="horaRetirada" type="time" defaultValue={p.horaRetirada} className={inputClass} />
                  </div>
                </div>
                <button className="w-full h-9 rounded-lg text-sm font-medium bg-primary text-primary-fg hover:bg-primary/90">
                  Salvar remarcação
                </button>
                <p className="text-xs text-muted">Reagenda as reservas na agenda e checa conflito no novo horário.</p>
              </form>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
