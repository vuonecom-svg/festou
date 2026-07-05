import Link from "next/link";
import {
  CalendarDays, CalendarRange, Truck, PackageCheck, Package, Wrench, Sparkles,
  Wallet, TrendingUp, AlertTriangle, Clock, User, MapPin,
} from "lucide-react";
import { format, parseISO, isSameDay, isWithinInterval, startOfDay, addDays, isSameMonth } from "date-fns";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { formatBRL } from "@/lib/utils";
import { brinquedoStats } from "@/lib/data/brinquedos";
import { listReservas, RESERVA_STATUS } from "@/lib/data/reservas";
import { listPedidos, pedidoStats } from "@/lib/data/pedidos";
import { orcamentoStats } from "@/lib/data/orcamentos";

export default async function DashboardPage() {
  const agora = new Date();
  const [brinq, reservas, pedidos, pStats, oStats] = await Promise.all([
    brinquedoStats(),
    listReservas(),
    listPedidos(),
    pedidoStats(),
    orcamentoStats(),
  ]);

  const hoje = reservas.filter((r) => isSameDay(parseISO(r.eventoInicio), agora));
  const semana = reservas.filter((r) =>
    isWithinInterval(parseISO(r.eventoInicio), { start: startOfDay(agora), end: addDays(agora, 7) })
  );
  const proximas = reservas
    .filter((r) => parseISO(r.eventoInicio) >= startOfDay(agora))
    .slice(0, 5);

  const faturamentoMes = pedidos
    .filter((p) => p.dataEvento && isSameMonth(parseISO(p.dataEvento + "T00:00"), agora))
    .reduce((s, p) => s + p.total, 0);

  const pagamentosPendentes = pedidos.filter((p) => p.valorRestante > 0);

  const alertas: { icon: typeof Wrench; tone: string; texto: string }[] = [];
  if (pagamentosPendentes.length > 0)
    alertas.push({ icon: Wallet, tone: "warning", texto: `${pagamentosPendentes.length} pedido(s) com pagamento pendente (${formatBRL(pStats.aReceber)})` });
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

  return (
    <div className="space-y-6">
      <section className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <StatCard label="Eventos hoje" value={hoje.length} icon={CalendarDays} />
        <StatCard label="Eventos na semana" value={semana.length} icon={CalendarRange} tone="info" />
        <StatCard label="Faturamento do mês" value={formatBRL(faturamentoMes)} icon={TrendingUp} tone="success" />
        <StatCard label="A receber" value={formatBRL(pStats.aReceber)} hint={`${pagamentosPendentes.length} pendentes`} icon={Wallet} tone="warning" />
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
