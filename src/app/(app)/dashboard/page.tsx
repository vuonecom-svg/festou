import Link from "next/link";
import {
  CalendarDays, CalendarRange, Truck, PackageCheck, Package, Wrench, Sparkles,
  Wallet, TrendingUp, AlertTriangle, Clock, User, MapPin, CheckCircle2, ArrowRight,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { formatBRL } from "@/lib/utils";
import { brinquedoStats } from "@/lib/data/brinquedos";
import { dashboardEventos, RESERVA_STATUS } from "@/lib/data/reservas";
import { pedidoStats, dashboardFinanceiro } from "@/lib/data/pedidos";
import { orcamentoStats } from "@/lib/data/orcamentos";

export default async function DashboardPage() {
  const agora = new Date();
  const [brinq, eventos, fin, pStats, oStats] = await Promise.all([
    brinquedoStats(),
    dashboardEventos(agora),
    dashboardFinanceiro(agora),
    pedidoStats(),
    orcamentoStats(),
  ]);

  const { hoje, semana, proximas } = eventos;
  const { faturamentoMes, pagamentosPendentes } = fin;

  const alertas: { icon: typeof Wrench; tone: string; texto: string }[] = [];
  if (pagamentosPendentes > 0)
    alertas.push({ icon: Wallet, tone: "warning", texto: `${pagamentosPendentes} pedido(s) com pagamento pendente (${formatBRL(pStats.aReceber)})` });
  if (brinq.manutencao > 0)
    alertas.push({ icon: Wrench, tone: "warning", texto: `${brinq.manutencao} brinquedo(s) em manutenção — indisponíveis para locação` });
  if (brinq.limpeza > 0)
    alertas.push({ icon: Sparkles, tone: "info", texto: `${brinq.limpeza} brinquedo(s) em limpeza aguardando liberação` });
  if (oStats.abertos > 0)
    alertas.push({ icon: Clock, tone: "info", texto: `${oStats.abertos} orçamento(s) aberto(s) aguardando resposta` });
  if (alertas.length === 0)
    alertas.push({ icon: AlertTriangle, tone: "info", texto: "Nenhum alerta no momento. Tudo em dia! 🎉" });

  const toneMap: Record<string, string> = {
    warning: "bg-amber-100 text-amber-700",
    danger: "bg-rose-100 text-rose-700",
    info: "bg-sky-100 text-sky-700",
  };

  // Guia de primeiros passos: aparece até o usuário fechar o 1º ciclo completo
  // (catálogo → orçamento → locação). Depois some sozinho.
  const passos = [
    { feito: brinq.total > 0, titulo: "Cadastre seus brinquedos", href: "/brinquedos/novo" },
    { feito: oStats.total > 0, titulo: "Monte o primeiro orçamento", href: "/orcamentos/novo" },
    { feito: pStats.total > 0, titulo: "Converta em locação e gere o contrato", href: "/orcamentos" },
  ];
  // Some só depois da 2ª locação — assim o usuário vê o ciclo fechar em verde.
  const mostrarPassos = pStats.total < 2;

  return (
    <div className="space-y-6">
      {mostrarPassos && (
        <section className="card p-5 border border-primary/20 bg-primary-soft/30">
          <h2 className="font-semibold">Bem-vindo ao FesFlow! Comece por aqui 👇</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {passos.map((p, i) => (
              <Link
                key={p.titulo}
                href={p.href}
                className={
                  "flex items-center gap-2.5 rounded-lg border p-3 text-sm transition-colors " +
                  (p.feito
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-border bg-surface hover:border-primary hover:text-primary")
                }
              >
                {p.feito ? (
                  <CheckCircle2 size={18} className="shrink-0 text-emerald-500" />
                ) : (
                  <span className="grid place-items-center h-5 w-5 rounded-full bg-primary text-primary-fg text-[11px] font-bold shrink-0">{i + 1}</span>
                )}
                <span className="flex-1 font-medium">{p.titulo}</span>
                {!p.feito && <ArrowRight size={15} className="shrink-0 text-muted" />}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Eventos hoje" value={hoje} icon={CalendarDays} />
        <StatCard label="Eventos na semana" value={semana} icon={CalendarRange} tone="info" />
        <StatCard label="Faturamento do mês" value={formatBRL(faturamentoMes)} icon={TrendingUp} tone="success" />
        <StatCard label="A receber" value={formatBRL(pStats.aReceber)} hint={`${pagamentosPendentes} pendentes`} icon={Wallet} tone="warning" />
      </section>

      <section className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Brinquedos disponíveis" value={brinq.disponivel} icon={Package} tone="success" />
        <StatCard label="Alugados" value={brinq.alugado} icon={PackageCheck} tone="info" />
        <StatCard label="Em manutenção" value={brinq.manutencao} icon={Wrench} tone="warning" />
        <StatCard label="Em limpeza" value={brinq.limpeza} icon={Sparkles} />
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Próximos eventos</h2>
            <Link href="/agenda" className="text-sm text-primary hover:underline">Ver agenda</Link>
          </div>
          {proximas.length === 0 ? (
            <p className="text-sm text-muted">Nenhum evento agendado.</p>
          ) : (
            <ul className="divide-y divide-border">
              {proximas.map((r) => (
                <li key={r.id} className="flex items-center gap-4 py-3">
                  <div className="text-center w-16 shrink-0">
                    <p className="text-sm font-semibold">{format(parseISO(r.eventoInicio), "dd/MM")}</p>
                    <p className="text-xs text-muted tabular-nums">{format(parseISO(r.eventoInicio), "HH:mm")}</p>
                  </div>
                  <Truck size={16} className="text-sky-500 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{r.brinquedoNome}</p>
                    <p className="text-xs text-muted truncate flex items-center gap-2">
                      <span className="inline-flex items-center gap-1"><User size={11} /> {r.clienteNome}</span>
                      <span className="inline-flex items-center gap-1"><MapPin size={11} /> {r.cidade}</span>
                    </p>
                  </div>
                  <Badge className={RESERVA_STATUS[r.status].badge}>{RESERVA_STATUS[r.status].label}</Badge>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={18} className="text-amber-500" />
            <h2 className="font-semibold">Alertas</h2>
          </div>
          <ul className="space-y-2.5">
            {alertas.map((a, i) => {
              const Icon = a.icon;
              return (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  <span className={"grid place-items-center h-6 w-6 rounded-md shrink-0 " + toneMap[a.tone]}>
                    <Icon size={13} />
                  </span>
                  <span className="text-foreground/80 leading-snug">{a.texto}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}
