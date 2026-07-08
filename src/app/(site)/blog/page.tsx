import type { Metadata } from "next";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Clock, ArrowRight } from "lucide-react";
import { POSTS } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Blog — FesFlow",
  description: "Dicas e ideias para organizar e crescer sua locadora de brinquedos e itens de festa.",
};

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-bold">Blog do FesFlow</h1>
        <p className="mt-3 text-muted">Ideias práticas para organizar e crescer sua locadora de brinquedos.</p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {POSTS.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="card p-6 flex flex-col hover:shadow-md transition-shadow group">
            <div className="flex items-center gap-3 text-xs text-muted">
              <span>{format(parseISO(post.data), "dd 'de' MMM 'de' yyyy", { locale: ptBR })}</span>
              <span className="inline-flex items-center gap-1"><Clock size={12} /> {post.leituraMin} min</span>
            </div>
            <h2 className="mt-3 font-semibold text-lg leading-snug group-hover:text-primary">{post.titulo}</h2>
            <p className="mt-2 text-sm text-muted flex-1">{post.resumo}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
              Ler artigo <ArrowRight size={15} />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
