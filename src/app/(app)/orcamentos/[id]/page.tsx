import Link from "next/link";
import { notFound } from "next/navigation";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, Trash2, ArrowRight, AlertTriangle, MapPin, CheckCircle2, FileDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getOrcamento, ORC_STATUS, type OrcStatus } from "@/lib/data/orcamentos";
import { formatBRL } from "@/lib/utils";
import { setOrcamentoStatusAction, deleteOrcamentoAction, converterAction } from "../actions";

const STATUS_ACOES: OrcStatus[] = ["enviado", "aprovado", "recusado"];

export default async function OrcamentoDetalhePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ erro?: string }>;
}) {
  const { id } = await params;
  const { erro } = await searchParams;
  const o = await getOrcamento(id);
  if (!o) notFound();

  const remove = deleteOrcamentoAction.bind(null, id);
  const converter = converterAction.bind(null, id);
  const convertido = o.status === "convertido";

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link href="/orcamentos" className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground">
            <ChevronLeft size={16} /> Orçamentos
          </Link>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <h1 className="text-xl font-semibold">Orçamento #{o.numero}</h1>
            <Badge className={ORC_STATUS[o.status].badge}>{ORC_STATUS[o.status].label}</Badge>
          </div>
          <p className="text-sm text-muted">{o.clienteNome}</p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={`/orcamentos/${id}/pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg text-sm font-medium h-10 px-4 border border-border bg-surface hover:bg-background"
          >
            <FileDown size={16} /> Baixar PDF
          </a>
          {!convertido && (
            <form action={remove}>
              <button className="inline-flex items-center gap-2 rounded-lg text-sm font-medium h-10 px-4 border border-rose-200 text-rose-600 hover:bg-rose-50">
                <Trash2 size={16} /> Excluir
              </button>
            </form>
          )}
        </div>
      </div>

      {erro && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 flex items-start gap-2">
          <AlertTriangle size={18} className="text-rose-600 mt-0.5 shrink-0" />
          <div>
            <p className="font-medium text-rose-700">Não foi possível converter em pedido</p>
            <p className="text-sm text-rose-700/90">{erro}</p>
          </div>
        </div>
      )}

      {convertido && o.pedidoId && (
        <div className="rounded-lg border border-violet-200 bg-violet-50 p-4 flex items-center justify-between gap-3">
          <p className="flex items-center gap-2 text-violet-700 font-medium">
            <CheckCircle2 size={18} /> Este orçamento já virou um pedido.
          </p>
          <Link href={`/pedidos/${o.pedidoId}`} className="inline-flex items-center gap-1 text-sm font-medium text-violet-700 hover:underline">
            Ver pedido <ArrowRight size={15} />
          </Link>
        </div>
      )}

      {/* Ações */}
      {!convertido && (
        <div className="card p-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted uppercase tracking-wide mr-1">Ações:</span>
          {STATUS_ACOES.map((s) => {
            const change = setOrcamentoStatusAction.bind(null, id, s);
            const atual = o.status === s;
            return (
              <form key={s} action={change}>
                <button disabled={atual}
                  className={"h-9 px-3 rounded-lg text-sm border transition-colors " +
                    (atual ? ORC_STATUS[s].badge + " border-transparent font-medium" : "border-border bg-surface hover:bg-background text-foreground/70")}>
                  Marcar {ORC_STATUS[s].label.toLowerCase()}
                </button>
              </form>
            );
          })}
          <form action={converter} className="ml-auto">
            <button className="inline-flex items-center gap-2 rounded-lg text-sm font-medium h-9 px-4 bg-primary text-primary-fg hover:bg-primary/90">
              Converter em pedido <ArrowRight size={16} />
            </button>
          </form>
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Itens + totais */}
        <div className="lg:col-span-2 card p-5">
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
                {o.itens.map((it, i) => (
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
          <div className="border-t border-border mt-3 pt-3 space-y-1 text-sm max-w-xs ml-auto">
            <Linha label="Subtotal" v={o.subtotal} />
            {o.desconto > 0 && <Linha label={`Desconto${o.motivoDesconto ? ` (${o.motivoDesconto})` : ""}`} v={-o.desconto} />}
            {o.taxaEntrega > 0 && <Linha label="Taxa entrega" v={o.taxaEntrega} />}
            {o.taxaMontagem > 0 && <Linha label="Taxa montagem" v={o.taxaMontagem} />}
            <div className="flex justify-between font-semibold text-base pt-1.5 border-t border-border">
              <span>Total</span><span>{formatBRL(o.total)}</span>
            </div>
            <Linha label="Sinal" v={o.valorSinal} muted />
            <div className="flex justify-between font-medium text-primary">
              <span>Restante</span><span>{formatBRL(o.valorRestante)}</span>
            </div>
            {o.formaPagamento && <p className="text-xs text-muted pt-1">Pagamento: {o.formaPagamento}</p>}
          </div>
        </div>

        {/* Evento + endereço */}
        <div className="space-y-5">
          <div className="card p-5">
            <h2 className="font-semibold mb-2">Evento</h2>
            <p className="text-sm">
              {o.dataEvento ? format(parseISO(o.dataEvento + "T00:00"), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : "—"}
            </p>
            <p className="text-sm text-muted mt-1">
              Entrega {o.horaEntrega || "—"} · Retirada {o.horaRetirada || "—"}
            </p>
          </div>
          <div className="card p-5">
            <h2 className="font-semibold mb-2 flex items-center gap-1.5"><MapPin size={16} /> Local da festa</h2>
            <p className="text-sm font-medium">{o.endereco.nomeLocal || "—"} <span className="text-muted font-normal">({o.endereco.tipoLocal})</span></p>
            <p className="text-sm text-muted mt-1">
              {[o.endereco.rua, o.endereco.numero].filter(Boolean).join(", ")}
              {o.endereco.bairro ? ` — ${o.endereco.bairro}` : ""}
            </p>
            <p className="text-sm text-muted">{o.endereco.cidade}</p>
            {o.endereco.referencia && <p className="text-xs text-muted mt-1">Ref.: {o.endereco.referencia}</p>}
          </div>
          {o.obs && (
            <div className="card p-5">
              <h2 className="font-semibold mb-2">Observações</h2>
              <p className="text-sm text-foreground/80 whitespace-pre-wrap">{o.obs}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Linha({ label, v, muted }: { label: string; v: number; muted?: boolean }) {
  return (
    <div className={"flex justify-between " + (muted ? "text-muted" : "")}>
      <span>{label}</span>
      <span className="tabular-nums">{formatBRL(v)}</span>
    </div>
  );
}
