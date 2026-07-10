import Link from "next/link";
import { format, parseISO } from "date-fns";
import { Wallet, TrendingUp, Receipt, ArrowDownCircle, Scale, Trash2, Plus, PlusCircle } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { inputClass } from "@/components/ui/form";
import { formatBRL } from "@/lib/utils";
import { listPedidos } from "@/lib/data/pedidos";
import { listDespesas, despesaStats, DESPESA_CATEGORIAS } from "@/lib/data/despesas";
import { listReceitas, receitaStats, RECEITA_CATEGORIAS } from "@/lib/data/receitas";
import { createDespesaAction, deleteDespesaAction, createReceitaAction, deleteReceitaAction } from "./actions";

const FORMAS = ["Pix", "Dinheiro", "Cartão", "Boleto", "Transferência"];

export default async function FinanceiroPage() {
  const [pedidos, despesas, dStats, receitas, rStats] = await Promise.all([
    listPedidos(),
    listDespesas(),
    despesaStats(),
    listReceitas(),
    receitaStats(),
  ]);

  // Faturamento e recebido incluem as receitas avulsas (dinheiro recebido na hora).
  const faturamento = pedidos.reduce((s, p) => s + p.total, 0) + rStats.total;
  const recebido = pedidos.reduce((s, p) => s + p.sinalPago, 0) + rStats.total;
  const aReceber = pedidos.reduce((s, p) => s + p.valorRestante, 0);
  const saldo = recebido - dStats.total;
  const contasReceber = pedidos.filter((p) => p.valorRestante > 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Financeiro</h1>
        <p className="text-sm text-muted">Contas a receber, despesas e fluxo de caixa</p>
      </div>

      <section className="grid gap-3 grid-cols-2 lg:grid-cols-5">
        <StatCard label="Faturamento" value={formatBRL(faturamento)} icon={TrendingUp} tone="success" />
        <StatCard label="Recebido" value={formatBRL(recebido)} hint="pedidos + avulsas" icon={Receipt} tone="info" />
        <StatCard label="A receber" value={formatBRL(aReceber)} icon={Wallet} tone="warning" />
        <StatCard label="Despesas" value={formatBRL(dStats.total)} icon={ArrowDownCircle} tone="danger" />
        <StatCard label="Saldo em caixa" value={formatBRL(saldo)} hint="recebido − despesas" icon={Scale} tone={saldo >= 0 ? "success" : "danger"} />
      </section>

      <div className="grid gap-6 lg:grid-cols-2 items-start">
        {/* Contas a receber */}
        <div className="card p-5">
          <h2 className="font-semibold mb-3">Contas a receber</h2>
          {contasReceber.length === 0 ? (
            <p className="text-sm text-muted">Nenhum valor pendente. Tudo em dia! 🎉</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-muted border-b border-border">
                    <th className="font-medium py-2">Pedido / cliente</th>
                    <th className="font-medium py-2">Evento</th>
                    <th className="font-medium py-2 text-right">Restante</th>
                  </tr>
                </thead>
                <tbody>
                  {contasReceber.map((p) => (
                    <tr key={p.id} className="border-b border-border last:border-0">
                      <td className="py-2.5">
                        <Link href={`/pedidos/${p.id}`} className="font-medium hover:text-primary">#{p.numero}</Link>
                        <span className="text-muted"> · {p.clienteNome}</span>
                      </td>
                      <td className="py-2.5 text-muted">
                        {p.dataEvento ? format(parseISO(p.dataEvento + "T00:00"), "dd/MM/yyyy") : "—"}
                      </td>
                      <td className="py-2.5 text-right tabular-nums font-medium text-primary">{formatBRL(p.valorRestante)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Despesas por categoria */}
        <div className="card p-5">
          <h2 className="font-semibold mb-3">Despesas por categoria</h2>
          {dStats.porCategoria.length === 0 ? (
            <p className="text-sm text-muted">Nenhuma despesa lançada ainda.</p>
          ) : (
            <ul className="space-y-2">
              {dStats.porCategoria.map((c) => {
                const pct = dStats.total ? (c.valor / dStats.total) * 100 : 0;
                return (
                  <li key={c.categoria}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{DESPESA_CATEGORIAS[c.categoria]}</span>
                      <span className="tabular-nums font-medium">{formatBRL(c.valor)}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-background overflow-hidden">
                      <div className="h-full bg-rose-400 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Lançar receita avulsa + lista */}
      <div className="card p-5">
        <h2 className="font-semibold">Lançar receita</h2>
        <p className="text-sm text-muted mb-3">
          Dinheiro recebido fora de um pedido — ex.: montou o brinquedo no evento e recebeu na hora.
        </p>
        <form action={createReceitaAction} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6 items-end">
          <div>
            <label className="block text-xs text-muted mb-1">Tipo</label>
            <select name="categoria" className={inputClass} defaultValue="locacao_avulsa">
              {Object.entries(RECEITA_CATEGORIAS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Valor (R$)</label>
            <input name="valor" type="number" step="0.01" min="0" required className={inputClass} />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Forma</label>
            <select name="forma" className={inputClass} defaultValue="Dinheiro">
              {FORMAS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Data</label>
            <input name="data" type="date" className={inputClass} />
          </div>
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block text-xs text-muted mb-1">Descrição</label>
            <input name="descricao" className={inputClass} placeholder="opcional" />
          </div>
          <button className="inline-flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-emerald-600 text-white font-medium hover:bg-emerald-700">
            <PlusCircle size={16} /> Lançar
          </button>
        </form>

        {receitas.length > 0 && (
          <div className="overflow-x-auto mt-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted border-b border-border">
                  <th className="font-medium py-2">Data</th>
                  <th className="font-medium py-2">Tipo</th>
                  <th className="font-medium py-2">Forma</th>
                  <th className="font-medium py-2">Descrição</th>
                  <th className="font-medium py-2 text-right">Valor</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {receitas.map((r) => {
                  const remover = deleteReceitaAction.bind(null, r.id);
                  return (
                    <tr key={r.id} className="border-b border-border last:border-0">
                      <td className="py-2.5 text-muted">{format(parseISO(r.data + "T00:00"), "dd/MM/yyyy")}</td>
                      <td className="py-2.5">{RECEITA_CATEGORIAS[r.categoria]}</td>
                      <td className="py-2.5 text-muted">{r.forma || "—"}</td>
                      <td className="py-2.5 text-muted">{r.descricao || "—"}</td>
                      <td className="py-2.5 text-right tabular-nums font-medium text-emerald-600">{formatBRL(r.valor)}</td>
                      <td className="py-2.5 text-right">
                        <form action={remover}>
                          <button className="text-rose-500 hover:text-rose-700" aria-label="Excluir"><Trash2 size={15} /></button>
                        </form>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Lançar despesa + lista */}
      <div className="card p-5">
        <h2 className="font-semibold mb-3">Lançar despesa</h2>
        <form action={createDespesaAction} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 items-end">
          <div>
            <label className="block text-xs text-muted mb-1">Categoria</label>
            <select name="categoria" className={inputClass} defaultValue="outros">
              {Object.entries(DESPESA_CATEGORIAS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Valor (R$)</label>
            <input name="valor" type="number" step="0.01" min="0" required className={inputClass} />
          </div>
          <div>
            <label className="block text-xs text-muted mb-1">Data</label>
            <input name="data" type="date" className={inputClass} />
          </div>
          <div className="lg:col-span-1 sm:col-span-2">
            <label className="block text-xs text-muted mb-1">Descrição</label>
            <input name="descricao" className={inputClass} placeholder="opcional" />
          </div>
          <button className="inline-flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-primary text-primary-fg font-medium hover:bg-primary/90">
            <Plus size={16} /> Lançar
          </button>
        </form>

        {despesas.length > 0 && (
          <div className="overflow-x-auto mt-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted border-b border-border">
                  <th className="font-medium py-2">Data</th>
                  <th className="font-medium py-2">Categoria</th>
                  <th className="font-medium py-2">Descrição</th>
                  <th className="font-medium py-2 text-right">Valor</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {despesas.map((d) => {
                  const remover = deleteDespesaAction.bind(null, d.id);
                  return (
                    <tr key={d.id} className="border-b border-border last:border-0">
                      <td className="py-2.5 text-muted">{format(parseISO(d.data + "T00:00"), "dd/MM/yyyy")}</td>
                      <td className="py-2.5">{DESPESA_CATEGORIAS[d.categoria]}</td>
                      <td className="py-2.5 text-muted">{d.descricao || "—"}</td>
                      <td className="py-2.5 text-right tabular-nums font-medium">{formatBRL(d.valor)}</td>
                      <td className="py-2.5 text-right">
                        <form action={remover}>
                          <button className="text-rose-500 hover:text-rose-700" aria-label="Excluir"><Trash2 size={15} /></button>
                        </form>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
