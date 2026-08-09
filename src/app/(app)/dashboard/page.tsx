import Link from "next/link";
import {
  CalendarDays, CalendarRange, Truck, PackageCheck, Package, Wrench, Sparkles,
  Wallet, TrendingUp, AlertTriangle, Clock, User, MapPin,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { formatBRL } from "@/lib/utils";
import { brinquedoStats } from "@/lib/data/brinquedos";
import { dashboardEventos, RESERVA_STATUS } from "@/lib/data/reservas";
import { pedidoStats, dashboardFinanceiro } from "@/lib/data/pedidos";
import { orcamentoStats } from "@/lib/data/orcamentos";
import { getCurrentEmpresaId } from "@/lib/tenant";
import { prisma } from "@/lib/prisma";
import { getNicho, termosDo } from "@/lib/nichos";

const FOCO_ATALHO: Record<string, { href: string; label: string }> = {
  agenda: { href: "/agenda", label: "Ver a agenda" },
  orcamentos: { href: "/orcamentos/novo", label: "Criar orçamento" },
  financeiro: { href: "/financeiro", label: "Ver o financeiro" },
  clientes: { href: "/clientes", label: "Cadastrar clientes" },
};

export default async function DashboardPage() {
  const agora = new Date();
  const empresaId = await getCurrentEmpresaId();
  const [empresa, brinq, eventos, fin, pStats, oStats] = await Promise.all([
    prisma.empresa.findUnique({ where: { id: empresaId }, select: { nicho: true, perfilNegocio: true } }),
    brinquedoStats(),
    dashboardEventos(agora),
    dashboardFinanceiro(agora),
    pedidoStats(),
    orcamentoStats(),
  ]);

  const nicho = getNicho(empresa?.nicho);
  const termos = termosDo(nicho);
  const perfil = (empresa?.perfilNegocio ?? null) as { focos?: string[] } | null;
  const atalhos = (perfil?.focos ?? []).map((f) => FOCO_ATALHO[f]).filter(Boolean);

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

  return (
    <div className="space-y-6">
      {nicho && (
        <section className="card p-5 bg-primary-soft/40 border border-primary/20">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wide text-primary font-semibold">Seu painel — {nicho.label}</p>
              <h2 className="mt-1 font-semibold text-lg">Organizamos o FesFlow para o seu ramo. 🎉</h2>
              <p className="text-sm text-muted mt-1">{nicho.foco}</p>
            </div>
            {atalhos.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {atalhos.map((a) => (
                  <Link key={a.href} href={a.href} className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-fg px-4 h-10 text-sm font-medium hover:bg-primary/90">
                    {a.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div className="mt-4 border-t border-primary/10 pt-4">
            <p className="text-xs uppercase tracking-wide text-muted font-semibold mb-2">O que o FesFlow resolve para {nicho.label.toLowerCase()}</p>
            <ul className="grid gap-2 sm:grid-cols-3">
              {nicho.dores.map((d) => (
                <li key={d} className="flex items-start gap-2 text-sm text-foreground/80">
                  <Sparkles size={15} className="text-primary shrink-0 mt-0.5" /> {d}
                </li>
              ))}
            </ul>
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
        <StatCard label={`${termos.itens} disponíveis`} value={brinq.disponivel} icon={Package} tone="success" />
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
