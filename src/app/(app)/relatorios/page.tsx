import { TrendingUp, Receipt, Wallet, Ticket, Package, Users, MapPin, Percent } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { gerarRelatorios, type LinhaRanking } from "@/lib/data/relatorios";
import { formatBRL } from "@/lib/utils";

export default async function RelatoriosPage() {
  const r = await gerarRelatorios();
  const maxMes = Math.max(1, ...r.porMes.map((m) => m.total));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Relatórios</h1>
        <p className="text-sm text-muted">Visão de faturamento e desempenho da locadora</p>
      </div>

      {/* KPIs */}
      <section className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Faturamento total" value={formatBRL(r.faturamentoTotal)} icon={TrendingUp} tone="success" />
        <StatCard label="Ticket médio" value={formatBRL(r.ticketMedio)} hint={`${r.qtdPedidos} pedidos`} icon={Ticket} />
        <StatCard label="Recebido" value={formatBRL(r.recebido)} icon={Receipt} tone="info" />
        <StatCard label="A receber" value={formatBRL(r.aReceber)} icon={Wallet} tone="warning" />
      </section>

      {/* Faturamento por mês */}
      <section className="card p-5">
        <h2 className="font-semibold mb-4">Faturamento por mês</h2>
        {r.porMes.length === 0 ? (
          <p className="text-sm text-muted">Sem pedidos ainda.</p>
        ) : (
          <div className="flex items-end gap-4 h-48">
            {r.porMes.map((m) => (
              <div key={m.chave} className="flex-1 flex flex-col items-center gap-2 min-w-0">
                <span className="text-xs font-medium tabular-nums">{formatBRL(m.total)}</span>
                <div
                  className="w-full max-w-[64px] rounded-t-lg bg-primary/80"
                  style={{ height: `${Math.max(6, (m.total / maxMes) * 100)}%` }}
                />
                <span className="text-xs text-muted capitalize">{m.label}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Rankings */}
      <section className="grid gap-4 lg:grid-cols-2">
        <Ranking titulo="Brinquedos mais lucrativos" icon={Package} linhas={r.brinquedos} unidade="locações" />
        <Ranking titulo="Clientes que mais alugam" icon={Users} linhas={r.clientes} unidade="eventos" />
        <Ranking titulo="Cidades com mais eventos" icon={MapPin} linhas={r.cidades} unidade="eventos" />

        <div className="card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Percent size={18} className="text-primary" />
            <h2 className="font-semibold">Conversão de orçamentos</h2>
          </div>
          {r.conversao.taxa == null ? (
            <p className="text-sm text-muted">
              Ainda não há orçamentos criados nesta sessão. Crie orçamentos e converta em pedidos para ver a taxa aqui.
            </p>
          ) : (
            <div>
              <p className="text-3xl font-semibold">{Math.round(r.conversao.taxa * 100)}%</p>
              <p className="text-sm text-muted mt-1">
                {r.conversao.convertidos} de {r.conversao.orcamentos} orçamentos viraram pedido
              </p>
            </div>
          )}
        </div>
      </section>

      <p className="text-xs text-muted text-center">
        Dados de exemplo (pré-Supabase). Ao conectar o banco, estes números passam a refletir sua operação real.
      </p>
    </div>
  );
}

function Ranking({
  titulo,
  icon: Icon,
  linhas,
  unidade,
}: {
  titulo: string;
  icon: typeof Package;
  linhas: LinhaRanking[];
  unidade: string;
}) {
  const max = Math.max(1, ...linhas.map((l) => l.total));
  return (
    <div className="card p-5">
      <div className="flex items-center gap-2 mb-3">
        <Icon size={18} className="text-primary" />
        <h2 className="font-semibold">{titulo}</h2>
      </div>
      {linhas.length === 0 ? (
        <p className="text-sm text-muted">Sem dados.</p>
      ) : (
        <ul className="space-y-2.5">
          {linhas.slice(0, 6).map((l) => (
            <li key={l.nome}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="truncate pr-2">{l.nome}</span>
                <span className="tabular-nums font-medium shrink-0">{formatBRL(l.total)}</span>
              </div>
              <div className="h-1.5 rounded-full bg-background overflow-hidden">
                <div className="h-full bg-primary/70 rounded-full" style={{ width: `${(l.total / max) * 100}%` }} />
              </div>
              <p className="text-xs text-muted mt-0.5">{l.qtd} {unidade}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
