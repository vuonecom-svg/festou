import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ArrowRight, X } from "lucide-react";
import { SEGMENTOS, getSegmento } from "@/lib/segmentos";
import { getNicho } from "@/lib/nichos";
import { KIWIFY } from "@/lib/site-content";
import { JsonLd, ldFaq, ldBreadcrumb, paginaMetadata } from "@/lib/seo";

// Só os slugs de SEGMENTOS existem. Qualquer outro caminho cai em 404 — sem
// isso, essa rota dinâmica na raiz viraria um catch-all.
export const dynamicParams = false;

export function generateStaticParams() {
  return SEGMENTOS.map((s) => ({ segmento: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ segmento: string }>;
}): Promise<Metadata> {
  const { segmento } = await params;
  const s = getSegmento(segmento);
  if (!s) return { title: "Página não encontrada — FesFlow" };
  return paginaMetadata({
    titulo: s.title,
    descricao: s.description,
    path: `/${s.slug}`,
  });
}

export default async function SegmentoPage({
  params,
}: {
  params: Promise<{ segmento: string }>;
}) {
  const { segmento } = await params;
  const s = getSegmento(segmento);
  if (!s) notFound();

  const nicho = getNicho(s.nicho);
  const outros = SEGMENTOS.filter((o) => o.slug !== s.slug);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <JsonLd
        data={[
          ldFaq(s.faq),
          ldBreadcrumb([
            { nome: "Início", url: "/" },
            { nome: s.h1, url: `/${s.slug}` },
          ]),
        ]}
      />

      {/* Hero */}
      <header className="text-center max-w-3xl mx-auto">
        {nicho && (
          <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${nicho.cor.bg} ${nicho.cor.text}`}>
            {nicho.label}
          </span>
        )}
        <h1 className="mt-5 text-4xl sm:text-5xl font-bold tracking-tight leading-tight">{s.h1}</h1>
        <p className="mt-5 text-lg text-muted">{s.subtitulo}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href={KIWIFY.mensal}
            className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-fg px-6 h-12 font-semibold hover:bg-primary/90"
          >
            Começar — 1º mês por R$ 5 <ArrowRight size={18} />
          </a>
          <Link
            href="/precos"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-6 h-12 font-semibold hover:bg-background"
          >
            Ver planos
          </Link>
        </div>
      </header>

      {/* Intro */}
      <section className="mt-14 max-w-2xl mx-auto space-y-4">
        {s.intro.map((p, i) => (
          <p key={i} className="text-lg text-foreground/80 leading-relaxed">{p}</p>
        ))}
      </section>

      {/* Dores */}
      <section className="mt-16">
        <h2 className="text-3xl font-bold text-center">Se você já passou por isso, é para você</h2>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {s.dores.map((d) => (
            <div key={d} className="card p-4 flex items-start gap-3 text-foreground/75">
              <X size={18} className="text-rose-500 shrink-0 mt-0.5" />
              <span className="text-sm">{d}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Soluções */}
      <section className="mt-16">
        <h2 className="text-3xl font-bold text-center">Como o FesFlow resolve</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {s.solucoes.map((sol) => (
            <div key={sol.titulo} className="card p-6">
              <div className="flex items-start gap-3">
                <span className="grid place-items-center h-9 w-9 rounded-lg bg-primary-soft text-primary shrink-0">
                  <Check size={18} />
                </span>
                <div>
                  <h3 className="font-semibold">{sol.titulo}</h3>
                  <p className="mt-1.5 text-sm text-muted leading-relaxed">{sol.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ do segmento */}
      <section className="mt-16 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center">Perguntas de quem trabalha com isso</h2>
        <div className="mt-8 space-y-3">
          {s.faq.map((f) => (
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

      {/* Outros segmentos — links internos */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold text-center">O FesFlow também atende</h2>
        <div className="mt-6 flex flex-wrap justify-center gap-2.5">
          {outros.map((o) => (
            <Link
              key={o.slug}
              href={`/${o.slug}`}
              className="rounded-lg border border-border bg-surface px-4 py-2 text-sm hover:bg-background hover:text-primary"
            >
              {o.h1.replace("Sistema para ", "")}
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-16 card p-10 text-center bg-primary-soft/50">
        <h2 className="text-3xl font-bold">Comece hoje por R$ 5</h2>
        <p className="mt-3 text-muted max-w-xl mx-auto">
          Primeiro mês por R$ 5 no plano mensal. Se não fizer diferença já no primeiro evento, é só
          cancelar.
        </p>
        <a
          href={KIWIFY.mensal}
          className="mt-7 inline-flex items-center gap-2 rounded-lg bg-primary text-primary-fg px-8 h-12 font-semibold hover:bg-primary/90"
        >
          Começar agora <ArrowRight size={18} />
        </a>
      </section>
    </div>
  );
}
