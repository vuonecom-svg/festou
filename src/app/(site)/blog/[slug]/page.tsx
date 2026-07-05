import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, Clock, ArrowRight } from "lucide-react";
import { POSTS, getPost } from "@/lib/site-content";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Artigo não encontrado — Festou" };
  return { title: `${post.titulo} — Festou`, description: post.resumo };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-2xl px-4 py-14">
      <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground">
        <ChevronLeft size={16} /> Blog
      </Link>

      <div className="mt-4 flex items-center gap-3 text-xs text-muted">
        <span>{format(parseISO(post.data), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
        <span className="inline-flex items-center gap-1"><Clock size={12} /> {post.leituraMin} min de leitura</span>
      </div>
      <h1 className="mt-3 text-3xl sm:text-4xl font-bold leading-tight">{post.titulo}</h1>
      <p className="mt-4 text-lg text-muted">{post.resumo}</p>

      <div className="mt-8 space-y-6">
        {post.secoes.map((s, i) => (
          <div key={i}>
            {s.h && <h2 className="text-xl font-semibold mb-2">{s.h}</h2>}
            {s.p?.map((par, j) => (
              <p key={j} className="text-foreground/80 leading-relaxed mb-3">{par}</p>
            ))}
            {s.ul && (
              <ul className="space-y-1.5 mt-2">
                {s.ul.map((li, k) => (
                  <li key={k} className="flex items-start gap-2 text-foreground/80">
                    <span className="text-primary mt-1">•</span> {li}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 card p-8 text-center bg-primary-soft/50">
        <h2 className="text-xl font-semibold">Coloque isso em prática com o Festou</h2>
        <p className="mt-2 text-muted">Agenda anti-overbooking, contratos e financeiro numa plataforma só.</p>
        <Link href="/dashboard" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary text-primary-fg px-6 h-11 font-semibold hover:bg-primary/90">
          Testar grátis <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}
