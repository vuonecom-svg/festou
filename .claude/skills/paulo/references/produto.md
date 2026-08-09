# FesFlow — o que o produto REALMENTE é (verificado)

> **Levantamento verificado em 07/08/2026**, lendo o código deste repositório.
> Este arquivo é o antídoto contra promessa inventada. **Ele envelhece.** Antes de usar qualquer
> item como argumento forte de venda (landing, anúncio, artigo comercial), **revalide no código**
> com os caminhos citados. Se divergir, corrija este arquivo na mesma tarefa.

## Identidade

- **Nome:** FesFlow.
- **Categoria:** SaaS de gestão (multiempresa) para **locadoras de brinquedos e itens de festa**.
- **Domínio:** `fesflow.com.br` (`src/lib/access.ts`, `src/lib/email.ts` — `NEXT_PUBLIC_APP_URL`).
- **E-mails:** remetente `acesso@fesflow.com.br` (SendGrid), contato `contato@fesflow.com.br`
  (`src/lib/email.ts`, `src/app/(site)/termos/page.tsx`).
- **Posicionamento declarado no site:** "Gestão para locadoras de brinquedos" — agenda inteligente
  sem overbooking, orçamentos, contratos e financeiro (`src/app/layout.tsx`, metadata).
- **Stack:** Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4 + Prisma 7 + Supabase
  (Postgres/Auth/Storage/RLS). Multi-tenant por `empresa_id` (`README.md`, `prisma/schema.prisma`).

## O diferencial central (é real, e é técnico)

**Agenda anti-overbooking com garantia no banco de dados.**
Cada reserva bloqueia o brinquedo por uma janela que **já inclui transporte, montagem, desmontagem e
limpeza** — não só o horário da festa. A trava é uma *exclusion constraint* no Postgres
(`prisma/sql/001_antioverbooking_rls.sql`), então erro humano não fura a agenda.
Motor de disponibilidade: `src/lib/disponibilidade.ts` (função pura, com testes em
`src/lib/__tests__/disponibilidade.test.ts`).

**Por que isso importa em marketing:** é o argumento mais forte e mais defensável que existe aqui.
"O sistema bloqueia" é o que todo concorrente diz. "A trava é no banco de dados, não só na tela"
é o que só quem realmente fez pode dizer. Use — e explique em linguagem de dono de locadora.

## Módulos com rota real no app (`src/app/(app)/`)

`agenda` · `brinquedos` (+ `novo`, `[id]`) · `clientes` (+ `novo`, `[id]`) · `combos` · `orcamentos`
(+ `novo`, `[id]`, `[id]/pdf`) · `pedidos` (+ `[id]`, `[id]/contrato`) · `contratos` · `crm` ·
`financeiro` · `manutencao` · `equipe` · `rotas` · `relatorios` · `dashboard` · `auditoria` ·
`configuracoes`.

Camada de dados em `src/lib/data/` (brinquedos, clientes, reservas, orcamentos, pedidos, combos,
crm, despesas, receitas, equipe, manutencoes, relatorios, empresa, auditoria).

**PDFs reais:** orçamento (`src/lib/pdf/orcamento-doc.tsx`) e contrato de locação
(`src/lib/pdf/contrato-doc.tsx`).

⚠️ **Existir rota ≠ estar completo.** Antes de anunciar um módulo (ex.: `rotas`, `equipe`, `crm`),
abra a página e confirme o que ela entrega hoje. O próprio site marca "equipe e entregas" e
"WhatsApp e rotas" como **"em breve"** (`src/lib/site-content.ts`) — se você for comunicar como
pronto, precisa de evidência.

## O que o site já promete hoje (`src/lib/site-content.ts`)

Oito blocos de features publicados: agenda anti-overbooking · orçamentos em 2 minutos · contratos
automáticos · financeiro · catálogo e estoque · clientes e histórico · equipe e entregas (**em
breve**) · relatórios.

Lista do plano: brinquedos/usuários/locações/orçamentos ilimitados, agenda anti-overbooking,
disponibilidade por data e horário, contratos em PDF, financeiro completo, relatórios de
faturamento, cadastro de clientes e catálogo, acesso por celular e computador, WhatsApp e rotas
(**em breve**).

## Preço e cobrança (verificado — NÃO altere sem autorização)

Plano **único** "FesFlow Completo" — o acesso é o mesmo; muda só o ciclo:

| Ciclo | Preço/mês | Total | Observação |
|---|---|---|---|
| Mensal | R$ 44,90 | — | **1ª cobrança R$ 5,00** |
| Semestral | R$ 39,90 | R$ 239,40 | ~11% de economia; parcela em até 6x |
| Anual | R$ 29,90 | R$ 358,80 | ~33% de economia; **destaque**; até 12x |

Processado pela **Kiwify** (cartão, Pix, boleto). Liberação automática por webhook
(`src/app/api/webhooks/kiwify`, lógica em `src/lib/kiwify.ts`). O gancho de oferta mais forte hoje
é o **primeiro mês por R$ 5,00** — ele é fato, está no código, e pode ser usado em copy.

## Site institucional (mora dentro do mesmo app, grupo `(site)`)

Páginas existentes: **home** (`/`), **blog** (`/blog` + `/blog/[slug]`), **FAQ** (`/faq`),
**privacidade**, **termos**.

**Blog: 3 artigos publicados** (`src/lib/site-content.ts`, `POSTS`):
1. `como-evitar-overbooking-locadora-brinquedos`
2. `5-erros-que-fazem-locadora-perder-dinheiro`
3. `contrato-locacao-brinquedos-clausulas-essenciais`

**FAQ: 9 perguntas** já respondidas (serve/como impede overbooking/instalação/PDF/financeiro/
isolamento de dados/cobrança/pagamento/várias unidades do mesmo brinquedo).

## Estado de SEO e tracking

### ✅ RESOLVIDO em 09/08/2026 (build verde, verificado no HTML gerado)

- `src/app/robots.ts` — libera o site e bloqueia toda a área logada (`ROTAS_PRIVADAS` em
  `src/lib/seo.tsx`), com `Sitemap:` e `Host:` apontando para o domínio.
- `src/app/sitemap.ts` — 6 rotas estáticas + os artigos do blog, com `lastModified`.
- `src/app/manifest.ts` — PWA/tema.
- `src/app/opengraph-image.tsx` — imagem 1200×630 gerada no build (140 KB, verificada visualmente).
- `src/app/layout.tsx` — `metadataBase`, canonical, Open Graph, Twitter card, `robots` e `viewport`.
- `src/lib/seo.tsx` — **fonte única** de URL canônica, dados estruturados e o helper
  `paginaMetadata()`. Use SEMPRE esse helper em página nova: quando uma página declara
  `openGraph`/`twitter` próprios, o Next substitui o objeto do layout inteiro e a imagem de
  compartilhamento **some silenciosamente** (foi exatamente o bug encontrado e corrigido).
- **JSON-LD:** `Organization` + `WebSite` (layout do site), `SoftwareApplication` +
  `AggregateOffer` + `Offer` (home e /precos, preço lido de `BILLING`), `FAQPage` (só em `/faq`),
  `Blog` (/blog), `BlogPosting` (artigos), `BreadcrumbList` (faq, blog, artigos, precos).
- **Nova página `/precos`** — planos, o que está incluído, garantias de compra, tabela comparativa
  "FesFlow × planilha", FAQ de pagamento e CTA. Todos os links internos foram repontados de
  `/#precos` para `/precos`.
- `src/proxy.ts` — o middleware não roda mais a checagem de sessão do Supabase em `robots.txt`,
  `sitemap.xml`, `manifest.webmanifest`, `opengraph-image` e ícones.

⚠️ **Regra ao criar página nova:** use `paginaMetadata()`, adicione a rota em `sitemap.ts` e, se for
rota privada, em `ROTAS_PRIVADAS`.

### ❌ AINDA ABERTO

- **Nenhum tracking**: sem GA4, Google Tag Manager, Meta Pixel, Vercel Analytics, PostHog ou
  Clarity. **Continua sendo o P0 absoluto** — sem isso não se mede aquisição.
- **Não indexado no Google**: em 09/08/2026, `site:fesflow.com.br` retornou zero resultados,
  mesmo com o site no ar. Depende de Search Console (ação do dono).
- **Sem página por segmento** (pula-pula, pegue e monte, buffet, mesas e cadeiras, espaços…) —
  apesar de o produto já ter 6 nichos definidos em `src/lib/nichos.ts`.
- **Sem prova social** e **sem screenshot do produto** em nenhum lugar do site.
- **Sem comparativo contra concorrente nomeado** (só contra planilha).

**Consequência prática:** hoje não existe forma de medir aquisição. Qualquer investimento em mídia
antes de resolver tracking é dinheiro cego. Isso deve ser **P0** em qualquer plano que você propuser.

## Comparação de referência (site FINLOCA, mesmo dono)

O outro SaaS do dono (FINLOCA, locação de equipamentos de construção) **já tem** sitemap, robots,
`opengraph-image`, icon/apple-icon, manifest e JSON-LD. Ou seja: o padrão existe e já foi executado
na casa — o FesFlow está atrás por lacuna, não por decisão. Isso encurta o argumento e a estimativa
de esforço quando você for propor o handoff técnico.

## INFORMAÇÃO NECESSÁRIA (pergunte ao dono — não presuma)

- O FesFlow está **no ar** hoje? Em qual URL/hospedagem? `fesflow.com.br` está apontado?
- Existem **clientes pagantes**? Quantos? Qual o MRR e o churn atual?
- Existe alguma **prova social real** (depoimento, print, case, número)? Se não houver, a
  prioridade é gerar — não escrever prova fictícia.
- Existe conta de **Google Ads / Meta Ads / Google Analytics / Search Console** já criada?
- Existe **Instagram/TikTok/YouTube** da marca? Com que frequência publica?
- Qual o **WhatsApp comercial** oficial e quem atende?
- Qual o **CAC máximo aceitável** dado o ticket (R$ 44,90/mês) e a expectativa de retenção?
