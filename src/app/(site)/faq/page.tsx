import type { Metadata } from "next";
import Link from "next/link";
import { FAQS } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Perguntas frequentes — Festou",
  description: "Tire suas dúvidas sobre o Festou, o sistema de gestão para locadoras de brinquedos e itens de festa.",
};

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Perguntas frequentes</h1>
        <p className="mt-3 text-muted">Tudo o que você precisa saber sobre o Festou.</p>
      </div>

      <div className="mt-10 space-y-3">
        {FAQS.map((f) => (
          <details key={f.q} className="card p-5 group">
            <summary className="font-medium cursor-pointer list-none flex items-center justify-between gap-4">
              {f.q}
              <span className="text-primary group-open:rotate-45 transition-transform text-2xl leading-none shrink-0">+</span>
            </summary>
            <p className="mt-3 text-sm text-muted leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>

      <div className="mt-12 card p-8 text-center bg-primary-soft/50">
        <h2 className="text-xl font-semibold">Ainda com dúvida?</h2>
        <p className="mt-2 text-muted">Teste grátis por 7 dias e veja o Festou funcionando na sua locadora.</p>
        <Link href="/dashboard" className="mt-5 inline-flex items-center rounded-lg bg-primary text-primary-fg px-6 h-11 font-semibold hover:bg-primary/90">
          Testar grátis
        </Link>
      </div>
    </div>
  );
}
