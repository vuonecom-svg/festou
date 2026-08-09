// SEO — fonte única da verdade para URL canônica, dados estruturados e
// metadados compartilhados do site institucional.
// Sem dependência de banco: pode ser importado por qualquer Server Component.

import { BILLING, FAQS, POSTS } from "@/lib/site-content";

export const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL ?? "https://fesflow.com.br").replace(/\/$/, "");

export const SITE = {
  nome: "FesFlow",
  slogan: "Do pedido à devolução, tudo flui.",
  descricao:
    "Sistema de gestão para locadoras de brinquedos e itens de festa: agenda anti-overbooking, orçamentos, contratos em PDF e financeiro num só lugar.",
  email: "contato@fesflow.com.br",
  whatsapp: "5519983760954",
  whatsappLabel: "(19) 98376-0954",
} as const;

/** URL absoluta a partir de um caminho ("/blog" → "https://fesflow.com.br/blog"). */
export function abs(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Imagem de compartilhamento gerada por `src/app/opengraph-image.tsx`. */
export const OG_IMAGE = {
  url: abs("/opengraph-image"),
  width: 1200,
  height: 630,
  alt: "FesFlow — Sistema de gestão para locadoras de brinquedos e itens de festa",
};

/**
 * Metadados de uma página do site institucional.
 *
 * Existe para garantir og:image e twitter:card em TODA página: quando uma página
 * exporta `openGraph`/`twitter` próprios, o Next substitui o objeto do layout
 * inteiro — sem isso, a imagem de compartilhamento some silenciosamente.
 */
export function paginaMetadata(opts: {
  titulo: string;
  descricao: string;
  path: string;
  tipo?: "website" | "article";
  publicadoEm?: string;
}) {
  const { titulo, descricao, path, tipo = "website", publicadoEm } = opts;
  return {
    title: titulo,
    description: descricao,
    alternates: { canonical: path },
    openGraph: {
      type: tipo,
      locale: "pt_BR",
      siteName: SITE.nome,
      title: titulo,
      description: descricao,
      url: abs(path),
      images: [OG_IMAGE],
      ...(publicadoEm ? { publishedTime: publicadoEm } : {}),
    },
    twitter: {
      card: "summary_large_image" as const,
      title: titulo,
      description: descricao,
      images: [OG_IMAGE.url],
    },
  };
}

/** Menor preço mensal ofertado — usado no schema de oferta. */
const precoMinimo = Math.min(...BILLING.map((b) => Number(b.precoMes.replace(",", "."))));

/** Rotas privadas (área logada e fluxos de conta): nunca devem ser indexadas. */
export const ROTAS_PRIVADAS = [
  "/api/",
  "/dashboard",
  "/agenda",
  "/brinquedos",
  "/clientes",
  "/combos",
  "/contratos",
  "/crm",
  "/equipe",
  "/financeiro",
  "/manutencao",
  "/orcamentos",
  "/pedidos",
  "/relatorios",
  "/rotas",
  "/auditoria",
  "/configuracoes",
  "/entrar",
  "/recuperar",
  "/trocar-senha",
  "/definir-senha",
  "/acesso-bloqueado",
  "/config-inicial",
];

// ─────────────────────────── JSON-LD ───────────────────────────

const ORG_ID = abs("/#organizacao");
const SITE_ID = abs("/#site");

export function ldOrganization() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: SITE.nome,
    url: abs("/"),
    logo: abs("/icon.svg"),
    description: SITE.descricao,
    email: SITE.email,
    areaServed: "BR",
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        telephone: `+${SITE.whatsapp}`,
        availableLanguage: ["Portuguese"],
      },
    ],
  };
}

export function ldWebSite() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": SITE_ID,
    url: abs("/"),
    name: SITE.nome,
    inLanguage: "pt-BR",
    publisher: { "@id": ORG_ID },
  };
}

/** O produto em si. Preço vem do site-content — nunca escreva valor à mão aqui. */
export function ldSoftwareApplication() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE.nome,
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Sistema de gestão para locadoras de brinquedos e festas",
    operatingSystem: "Web",
    url: abs("/"),
    description: SITE.descricao,
    inLanguage: "pt-BR",
    publisher: { "@id": ORG_ID },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "BRL",
      lowPrice: precoMinimo.toFixed(2),
      highPrice: Math.max(...BILLING.map((b) => Number(b.precoMes.replace(",", ".")))).toFixed(2),
      offerCount: BILLING.length,
      availability: "https://schema.org/InStock",
      offers: BILLING.map((b) => ({
        "@type": "Offer",
        name: `FesFlow Completo — ${b.ciclo}`,
        price: Number(b.precoMes.replace(",", ".")).toFixed(2),
        priceCurrency: "BRL",
        url: abs("/precos"),
        availability: "https://schema.org/InStock",
      })),
    },
  };
}

export function ldFaq(perguntas: readonly { q: string; a: string }[] = FAQS) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: perguntas.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function ldBlog() {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": abs("/blog#blog"),
    url: abs("/blog"),
    name: `Blog do ${SITE.nome}`,
    description: "Ideias práticas para organizar e crescer sua locadora de brinquedos e itens de festa.",
    inLanguage: "pt-BR",
    publisher: { "@id": ORG_ID },
    blogPost: POSTS.map((p) => ({
      "@type": "BlogPosting",
      headline: p.titulo,
      url: abs(`/blog/${p.slug}`),
      datePublished: p.data,
    })),
  };
}

export function ldBlogPosting(post: (typeof POSTS)[number]) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.titulo,
    description: post.resumo,
    url: abs(`/blog/${post.slug}`),
    mainEntityOfPage: { "@type": "WebPage", "@id": abs(`/blog/${post.slug}`) },
    datePublished: post.data,
    dateModified: post.data,
    inLanguage: "pt-BR",
    image: abs("/opengraph-image"),
    author: { "@id": ORG_ID },
    publisher: { "@id": ORG_ID },
    timeRequired: `PT${post.leituraMin}M`,
  };
}

export function ldBreadcrumb(itens: { nome: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: itens.map((i, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: i.nome,
      item: abs(i.url),
    })),
  };
}

/** Renderiza um bloco <script type="application/ld+json">. */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
