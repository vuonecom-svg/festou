import type { Metadata } from "next";
import Link from "next/link";
import { Check, ArrowRight, ShieldCheck, CreditCard, Sparkles } from "lucide-react";
import { BILLING, PLAN_FEATURES, FAQS, KIWIFY } from "@/lib/site-content";
import { JsonLd, ldSoftwareApplication, ldBreadcrumb, paginaMetadata } from "@/lib/seo";

export const metadata: Metadata = paginaMetadata({
  titulo: "Preços do FesFlow — a partir de R$ 29,90/mês",
  descricao:
    "Plano único com tudo incluído: agenda anti-overbooking, orçamentos, contratos em PDF e financeiro. 1º mês por R$ 5 no plano mensal. Cancele quando quiser.",
  path: "/precos",
});

// Perguntas de preço/cobrança que já existem no FAQ — reaproveitadas aqui para
// responder a objeção no momento da decisão.
const FAQ_PRECO = FAQS.filter((f) =>
  /cobran|pagamento|desconto|instalar/i.test(f.q),
);

const COMPARACAO = [
  { item: "Saber na hora se o brinquedo está livre numa data", planilha: false },
  { item: "Bloquear automaticamente transporte, montagem e limpeza", planilha: false },
  { item: "Impedir que o mesmo item vá para duas festas", planilha: false },
  { item: "Orçamento em PDF pronto para enviar no WhatsApp", planilha: false },
  { item: "Contrato de locação gerado com um clique", planilha: false },
  { item: "Controle de sinal, valor restante e a receber", planilha: true },
  { item: "Saber qual brinquedo dá mais lucro", planilha: true },
  { item: "Acesso da equipe pelo celular, na rua", planilha: false },
];

export default function PrecosPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <JsonLd
        data={[
          ldSoftwareApplication(),
          // Sem FAQPage aqui: essas perguntas já são marcadas em /faq, e schema
          // de FAQ repetido em duas URLs é descartado pelo Google.
          ldBreadcrumb([
            { nome: "Início", url: "/" },
            { nome: "Preços", url: "/precos" },
          ]),
        ]}
      />

      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft text-primary px-3 py-1 text-sm font-medium">
          <Sparkles size={15} /> Plano único — sem pegadinha de recurso bloqueado
        </span>
        <h1 className="mt-5 text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
          Quanto custa organizar sua locadora de vez?
        </h1>
        <p className="mt-5 text-lg text-muted">
          Menos do que uma festa perdida por reserva duplicada. Todo mundo tem acesso a{" "}
          <strong className="text-foreground">todas as funcionalidades</strong> — muda só o ciclo de
          pagamento.
        </p>
      </div>

      {/* Planos */}
      <div className="mt-12 grid gap-5 sm:grid-cols-3 items-stretch">
        {BILLING.map((b) => (
          <a
            key={b.ciclo}
            href={b.link}
            className={"card p-6 flex flex-col text-center relative " + (b.destaque ? "ring-2 ring-primary" : "")}
          >
            {b.economia && (
              <span
                className={
                  "absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap " +
                  (b.destaque ? "bg-primary text-primary-fg" : "bg-emerald-100 text-emerald-700")
                }
              >
                Economize {b.economia}
              </span>
            )}
            <p className="font-semibold text-lg">{b.ciclo}</p>
            <p className="mt-3 leading-none">
              <span className="text-muted align-top text-lg">R$ </span>
              <span className="text-4xl font-bold">{b.precoMes}</span>
            </p>
            <p className="text-sm text-muted mt-1">/mês</p>
            <p className="text-xs text-muted mt-1 min-h-[2rem]">
              {b.total
                ? `Pacote de ${b.meses} meses — R$ ${b.total} (parcele em até ${b.meses}x)`
                : "1º mês por R$ 5 · depois R$ 44,90/mês"}
            </p>
            <span
              className={
                "mt-5 inline-flex items-center justify-center rounded-lg h-11 font-semibold " +
                (b.destaque ? "bg-primary text-primary-fg hover:bg-primary/90" : "border border-border hover:bg-background")
              }
            >
              Assinar {b.ciclo.toLowerCase()}
            </span>
          </a>
        ))}
      </div>

      {/* Incluído */}
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

      {/* Segurança da compra */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3 text-sm">
        {[
          { icon: CreditCard, t: "Cartão, Pix ou boleto", d: "Pagamento processado com segurança pela Kiwify." },
          { icon: ShieldCheck, t: "Cancele quando quiser", d: "Sem fidelidade e sem multa de cancelamento." },
          { icon: Sparkles, t: "Sem instalação", d: "Funciona no navegador do computador, tablet e celular." },
        ].map((i) => (
          <div key={i.t} className="card p-5">
            <i.icon size={20} className="text-primary" />
            <p className="mt-2 font-semibold">{i.t}</p>
            <p className="mt-1 text-muted">{i.d}</p>
          </div>
        ))}
      </div>

      {/* Comparação com planilha */}
      <section className="mt-16">
        <h2 className="text-3xl font-bold text-center">FesFlow ou planilha?</h2>
        <p className="mt-3 text-muted text-center max-w-2xl mx-auto">
          A planilha é grátis até o dia em que você manda o mesmo pula-pula para duas festas.
        </p>
        <div className="mt-8 card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="text-left font-medium p-4">O que você precisa fazer</th>
                <th className="font-medium p-4 w-32">Planilha</th>
                <th className="font-medium p-4 w-32 text-primary">FesFlow</th>
              </tr>
            </thead>
            <tbody>
              {COMPARACAO.map((c) => (
                <tr key={c.item} className="border-b border-border last:border-0">
                  <td className="p-4 text-foreground/80">{c.item}</td>
                  <td className="p-4 text-center">
                    {c.planilha ? (
                      <span className="text-amber-600" title="Dá, mas na mão">~</span>
                    ) : (
                      <span className="text-rose-500 font-semibold">✗</span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <Check size={18} className="text-emerald-500 inline" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted text-center mt-3">
          &ldquo;~&rdquo; = a planilha até faz, mas depende de você lembrar e atualizar à mão.
        </p>
      </section>

      {/* FAQ de preço */}
      {FAQ_PRECO.length > 0 && (
        <section className="mt-16">
          <h2 className="text-3xl font-bold text-center">Dúvidas sobre pagamento</h2>
          <div className="mt-8 space-y-3 max-w-3xl mx-auto">
            {FAQ_PRECO.map((f) => (
              <details key={f.q} className="card p-5 group">
                <summary className="font-medium cursor-pointer list-none flex items-center justify-between gap-4">
                  {f.q}
                  <span className="text-primary group-open:rotate-45 transition-transform text-2xl leading-none shrink-0">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm text-muted leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
          <p className="text-center mt-6">
            <Link href="/faq" className="text-primary font-medium hover:underline">
              Ver todas as perguntas frequentes →
            </Link>
          </p>
        </section>
      )}

      {/* CTA final */}
      <section className="mt-16 card p-10 text-center bg-primary-soft/50">
        <h2 className="text-3xl font-bold">Comece hoje por R$ 5</h2>
        <p className="mt-3 text-muted max-w-xl mx-auto">
          No plano mensal, o primeiro mês sai por R$ 5. Se não fizer diferença já na primeira festa,
          é só cancelar.
        </p>
        <a
          href={KIWIFY.mensal}
          className="mt-7 inline-flex items-center gap-2 rounded-lg bg-primary text-primary-fg px-8 h-12 font-semibold hover:bg-primary/90"
        >
          Começar — 1º mês por R$ 5 <ArrowRight size={18} />
        </a>
      </section>
    </div>
  );
}
