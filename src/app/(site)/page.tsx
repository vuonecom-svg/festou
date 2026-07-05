import type { Metadata } from "next";
import Link from "next/link";
import {
  CalendarClock, FileText, FileSignature, Wallet, Package, Users, Truck, BarChart3,
  ShieldCheck, Check, ArrowRight, Sparkles, type LucideIcon,
} from "lucide-react";
import { FEATURES, BILLING, PLAN_FEATURES, FAQS } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Festou — Sistema de gestão para locadoras de brinquedos",
  description:
    "Agenda anti-overbooking, orçamentos, contratos em PDF e financeiro para locadoras de pula-pula, infláveis e itens de festa. Teste grátis por 7 dias.",
};

const ICONS: Record<string, LucideIcon> = {
  CalendarClock, FileText, FileSignature, Wallet, Package, Users, Truck, BarChart3,
};

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-soft/60 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-4 pt-16 pb-14 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft text-primary px-3 py-1 text-sm font-medium">
            <Sparkles size={15} /> Feito para locadoras de brinquedos
          </span>
          <h1 className="mt-5 text-4xl sm:text-5xl font-bold tracking-tight max-w-3xl mx-auto leading-tight">
            Organize sua locadora e <span className="text-accent">nunca mais alugue o mesmo brinquedo duas vezes</span>
          </h1>
          <p className="mt-5 text-lg text-muted max-w-2xl mx-auto">
            Do orçamento no WhatsApp ao brinquedo de volta na base: agenda inteligente, contratos, financeiro e relatórios num só lugar. Chega de caderno e planilha.
          </p>
          <p className="mt-5 text-sm font-bold uppercase tracking-[0.2em]">
            <span className="text-accent">Agende.</span> <span className="text-accent-orange">Alugue.</span> <span className="text-accent-purple">Celebre.</span>
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/#precos" className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-fg px-6 h-12 font-semibold hover:bg-primary/90">
              Testar grátis por 30 dias <ArrowRight size={18} />
            </Link>
            <Link href="/#funcionalidades" className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-6 h-12 font-semibold hover:bg-background">
              Ver funcionalidades
            </Link>
          </div>
          <p className="mt-3 text-sm text-muted">30 dias grátis · Acesso pelo celular ou computador</p>
        </div>
      </section>

      {/* Dores */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 text-sm">
          {[
            "Dois clientes com o mesmo brinquedo no mesmo dia",
            "Informações perdidas no WhatsApp",
            "Esquecer de cobrar sinal ou valor restante",
            "Não saber qual brinquedo dá mais lucro",
          ].map((dor) => (
            <div key={dor} className="card p-4 text-foreground/70">
              <span className="text-rose-500 font-semibold">✗</span> {dor}
            </div>
          ))}
        </div>
      </section>

      {/* Diferencial */}
      <section className="bg-sidebar text-sidebar-fg">
        <div className="mx-auto max-w-6xl px-4 py-16 grid gap-8 lg:grid-cols-2 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 text-white px-3 py-1 text-sm font-medium">
              <ShieldCheck size={15} /> Nosso diferencial
            </span>
            <h2 className="mt-4 text-3xl font-bold text-white">Overbooking impossível — garantido no banco de dados</h2>
            <p className="mt-4 text-sidebar-fg/90">
              Todo sistema promete "controle de disponibilidade". O Festou vai além: cada reserva bloqueia o brinquedo por uma janela que já inclui <strong className="text-white">transporte, montagem, retirada e limpeza</strong>. Se conflita, o sistema não deixa reservar — nem por erro humano.
            </p>
            <ul className="mt-6 space-y-2">
              {["Disponibilidade ao vivo ao montar o orçamento", "Buffers automáticos entre uma festa e outra", "Bloqueio físico no banco, não só na tela"].map((i) => (
                <li key={i} className="flex items-center gap-2 text-white">
                  <Check size={18} className="text-emerald-400" /> {i}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
            <p className="text-xs uppercase tracking-wide text-sidebar-fg/60 mb-3">Exemplo real</p>
            <div className="space-y-3 text-sm">
              <div className="rounded-lg bg-emerald-500/15 border border-emerald-500/30 p-3 text-emerald-200">
                <strong>Festa 14h–18h</strong> — brinquedo bloqueado das 12:45 às 19:35 (com transporte + limpeza)
              </div>
              <div className="rounded-lg bg-rose-500/15 border border-rose-500/30 p-3 text-rose-200">
                Tentar reservar às <strong>19h no mesmo dia</strong> → ❌ bloqueado (ainda em limpeza)
              </div>
              <div className="rounded-lg bg-emerald-500/15 border border-emerald-500/30 p-3 text-emerald-200">
                Reservar às <strong>21h</strong> → ✅ liberado
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Funcionalidades */}
      <section id="funcionalidades" className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold">Tudo o que a sua locadora precisa</h2>
          <p className="mt-3 text-muted">Um sistema completo para substituir caderno, planilha e WhatsApp desorganizado.</p>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => {
            const Icon = ICONS[f.icon] ?? Package;
            return (
              <div key={f.titulo} className="card p-5">
                <span className="grid place-items-center h-11 w-11 rounded-xl bg-primary-soft text-primary mb-3">
                  <Icon size={22} />
                </span>
                <h3 className="font-semibold">{f.titulo}</h3>
                <p className="mt-1.5 text-sm text-muted">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Como funciona */}
      <section className="bg-surface border-y border-border">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-3xl font-bold text-center">Como funciona, do começo ao fim</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { n: "1", t: "Cadastre e orce", d: "Cadastre brinquedos e clientes. Monte orçamentos vendo a disponibilidade em tempo real e envie em PDF." },
              { n: "2", t: "Confirme e agende", d: "Cobre o sinal, converta em pedido e o brinquedo é reservado automaticamente na agenda, sem risco de conflito." },
              { n: "3", t: "Entregue e cobre", d: "Organize a entrega, gere o contrato, receba o valor restante e acompanhe o faturamento nos relatórios." },
            ].map((s) => (
              <div key={s.n} className="text-center">
                <span className="mx-auto grid place-items-center h-12 w-12 rounded-full bg-primary text-primary-fg font-bold text-lg">{s.n}</span>
                <h3 className="mt-4 font-semibold text-lg">{s.t}</h3>
                <p className="mt-2 text-sm text-muted">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Preços */}
      <section id="precos" className="mx-auto max-w-5xl px-4 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold">Festou Completo</h2>
          <p className="mt-3 text-muted">Acesso completo a todas as funcionalidades. Escolha o ciclo que cabe no seu bolso.</p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-3 items-stretch">
          {BILLING.map((b) => (
            <a
              key={b.ciclo}
              href={b.link}
              className={"card p-6 flex flex-col text-center relative " + (b.destaque ? "ring-2 ring-primary" : "")}
            >
              {b.economia && (
                <span className={"absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap " + (b.destaque ? "bg-primary text-primary-fg" : "bg-emerald-100 text-emerald-700")}>
                  Economize {b.economia}
                </span>
              )}
              <p className="font-semibold text-lg">{b.ciclo}</p>
              <p className="mt-3 leading-none">
                <span className="text-muted align-top text-lg">R$ </span>
                <span className="text-4xl font-bold">{b.precoMes}</span>
              </p>
              <p className="text-sm text-muted mt-1">/mês</p>
              <p className="text-xs text-muted mt-1 min-h-[1rem]">{b.total ? `Referente ao pacote de ${b.meses} meses — R$ ${b.total} em parcela única` : " "}</p>
              <span className={"mt-5 inline-flex items-center justify-center rounded-lg h-11 font-semibold " + (b.destaque ? "bg-primary text-primary-fg hover:bg-primary/90" : "border border-border hover:bg-background")}>
                Começar grátis
              </span>
            </a>
          ))}
        </div>

        <div className="mt-8 card p-6">
          <p className="text-center font-medium mb-4">Tudo isso incluído — em qualquer ciclo:</p>
          <div className="grid gap-2.5 sm:grid-cols-2 max-w-3xl mx-auto">
            {PLAN_FEATURES.map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm">
                <Check size={16} className="text-emerald-500 shrink-0" /> {f}
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-sm text-muted mt-6">
          🎁 <strong className="text-foreground">30 dias grátis</strong> — cadastre o cartão e não pague nada no primeiro mês. Cancele quando quiser.
        </p>
      </section>

      {/* FAQ teaser */}
      <section className="bg-surface border-y border-border">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <h2 className="text-3xl font-bold text-center">Perguntas frequentes</h2>
          <div className="mt-8 space-y-3">
            {FAQS.slice(0, 4).map((f) => (
              <details key={f.q} className="card p-4 group">
                <summary className="font-medium cursor-pointer list-none flex items-center justify-between">
                  {f.q}<span className="text-primary group-open:rotate-45 transition-transform text-xl leading-none">+</span>
                </summary>
                <p className="mt-2 text-sm text-muted">{f.a}</p>
              </details>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/faq" className="text-primary font-medium hover:underline">Ver todas as perguntas →</Link>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="mx-auto max-w-6xl px-4 py-20 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold max-w-2xl mx-auto">Pronto para organizar sua locadora de vez?</h2>
        <p className="mt-4 text-muted">Comece agora, leve 7 dias para testar e veja a diferença já na primeira festa.</p>
        <Link href="/dashboard" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-primary text-primary-fg px-8 h-13 py-3.5 font-semibold hover:bg-primary/90">
          Criar minha conta grátis <ArrowRight size={18} />
        </Link>
      </section>
    </>
  );
}
