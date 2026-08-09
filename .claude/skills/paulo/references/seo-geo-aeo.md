# SEO · Arquitetura · Blog · GEO · AEO — FesFlow

> Estado atual verificado (07/08/2026): **sem sitemap, sem robots, sem canonical/metadataBase, sem
> Open Graph, sem manifest, sem JSON-LD, sem tracking.** Ver `references/produto.md`.
> Isso significa que a base técnica é **P0** — antes de escalar conteúdo.

## 1. SEO técnico — o checklist do FesFlow

Ordem de execução recomendada (do que trava indexação para o que amplia):

**P0 — fundação (sem isso, o resto rende menos)**
1. `src/app/robots.ts` e `src/app/sitemap.ts` (com `lastModified` nas rotas estáticas e nos posts).
2. `metadataBase` + `alternates.canonical` no layout raiz; `title`/`description` únicos por página.
3. `opengraph-image` (next/og), `icon`, `apple-icon`, `manifest`.
4. **Tracking** (GA4 + Search Console + Meta Pixel) — ver `references/dados-cro-testes.md`.

**P1 — dados estruturados (JSON-LD)**
- `SoftwareApplication` (ou `Product` + `Offer`) na home, com preço e ciclos reais do
  `site-content.ts` — **nunca preço inventado**.
- `FAQPage` na `/faq` — já existem 9 perguntas escritas, é ganho imediato.
- `BlogPosting` em `/blog/[slug]` (autor, data, imagem).
- `Organization` + `BreadcrumbList`.

**P2 — performance e saúde**
- Core Web Vitals (LCP, INP, CLS) — performance é fator de rankeamento e de conversão.
- Headings coerentes (um H1 por página), internal linking, imagens com `alt` descritivo.
- Indexação: checar cobertura no Search Console depois que o sitemap subir.

⚠️ Qualquer um desses itens **mexe no código** → é handoff técnico, com autorização do dono antes
do deploy.

## 2. Keyword research — como fazer aqui

**Não assuma volume. Pesquise.** Sem dado, rotule como HIPÓTESE.

Sementes para investigar (intenção comercial → mais perto da conversão):
`sistema para locação de brinquedos` · `sistema para locadora de festas` · `software para locadora
de brinquedos` · `programa para aluguel de brinquedos` · `sistema para pula pula` · `sistema para
pegue e monte` · `agenda para locadora de brinquedos` · `controle de reservas de brinquedos` ·
`sistema para aluguel de mesas e cadeiras` · `sistema para buffet` · `gestão de locadora de festas`.

Sementes informacionais (topo/meio → blog):
`como organizar locadora de brinquedos` · `como precificar aluguel de pula pula` · `quanto cobrar
aluguel de pula pula` · `como montar empresa de aluguel de brinquedos` · `contrato de aluguel de
brinquedos` · `como evitar conflito de agenda` · `como cobrar sinal na locação` · `como organizar
entrega de festa`.

Para cada keyword registre: **volume (fonte) · dificuldade · intenção · ICP · etapa do funil ·
página de destino · CTA.** Sem esses campos, não vale como pauta.

## 3. Arquitetura de páginas (SEO comercial)

Candidatas — **valide demanda e intenção antes de criar**:

```
/precos                                   ← não existe hoje; alta prioridade comercial
/sistema-para-locacao-de-brinquedos
/sistema-para-locadora-de-festas
/sistema-para-pula-pula
/sistema-para-pegue-e-monte
/sistema-para-aluguel-de-mesas-e-cadeiras
/sistema-para-buffet
/software-para-locadora
/agenda-para-locadora
/controle-de-reservas
/gestao-de-locacao-de-festas
```

Regra: **uma página só nasce se tiver demanda comprovada e conteúdo próprio suficiente.** Página
comercial precisa de: H1 com a intenção, dor, como o FesFlow resolve (com prova real), FAQ da
página, links internos e CTA único.

## 4. Topical authority — clusters

**PILLAR:** Gestão de locadora de brinquedos e festas.

**CLUSTERS:** agenda · reserva · disponibilidade · orçamento · contrato · pagamento e sinal ·
inadimplência · estoque e catálogo · entrega e retirada · montagem/desmontagem · limpeza e
manutenção · cliente e histórico · equipe · precificação · crescimento · marketing da locadora ·
finanças da locadora.

Tudo interligado por links internos: cluster → pillar → página comercial correspondente.

## 5. Blog — regra de qualidade

Hoje existem **3 artigos** (ver `produto.md`). Não produza artigo para inflar contagem de páginas.

Todo artigo precisa ter, declarado antes de escrever: **keyword · intenção · ICP · etapa do funil ·
problema · objetivo · CTA · página comercial relacionada · links internos.**

Pautas candidatas (validar demanda antes):
- Como organizar uma empresa de aluguel de brinquedos
- Como controlar reservas de pula-pula
- Como evitar conflito de agenda em locadoras
- Como administrar uma empresa de pegue e monte
- Como fazer contrato de locação de brinquedos
- Como organizar entregas de festas
- Como cobrar sinal na locação
- Como controlar estoque de uma locadora
- Quanto cobrar pelo aluguel de pula-pula
- Como montar uma empresa de aluguel de brinquedos

Nem todo conteúdo precisa vender direto — mas **todo conteúdo faz parte de uma estratégia**.

## 6. SEO programático — com freio

Padrões possíveis: `sistema para locadora de [segmento]`, `software para aluguel de [produto]`,
`gestão para empresa de [segmento]`.

⚠️ **Nunca crie milhares de páginas quase iguais.** Cada página precisa ter valor próprio: dados,
exemplos, FAQ específica, imagens diferentes. Se você não consegue escrever algo genuinamente
diferente para a variação, ela não deve existir.

## 7. GEO — Generative Engine Optimization

Objetivo: aumentar a **probabilidade** de o FesFlow ser encontrado, compreendido e citado por
ChatGPT, Google AI Overviews, Gemini, Claude, Perplexity, Copilot e afins.

Trabalhe: **entidades** (nome do produto sempre consistente), consistência de descrição em todos os
lugares, autoridade, dados estruturados, respostas objetivas, conteúdo profundo, estatísticas
verificáveis com fonte, citações, comparações honestas, perguntas reais dos clientes, páginas
institucionais claras (quem somos, contato, preço), autoria e atualização dos conteúdos.

⛔ **Nunca prometa "vamos colocar a empresa em primeiro no ChatGPT".** Não existe garantia.
Trabalhamos probabilidade, autoridade e encontrabilidade — e é assim que se comunica isso ao dono.

## 8. AEO — Answer Engine Optimization

Otimize para pergunta. Exemplos reais do nicho:
- "O que é um sistema para locação de festas?"
- "Qual o melhor sistema para locação de brinquedos?"
- "Como organizar a agenda de pula-pula?"
- "Como evitar reservar o mesmo brinquedo duas vezes?"
- "Como controlar uma locadora de festas?"

**Estrutura recomendada da página/seção:**
`PERGUNTA → RESPOSTA DIRETA (1 parágrafo, objetiva) → EXPLICAÇÃO → EXEMPLO → PASSO A PASSO → FAQ → CTA`

A resposta direta vem primeiro, sem rodeio. É o que motor de resposta extrai.

## 9. SEO local — só com justificativa

Existe oportunidade regional (ex.: "sistema para locadora de festas em Campinas"), mas **só crie
página local quando houver demanda ou operação real que justifique**. Não gere página de cidade
vazia para manipular busca — isso derruba a qualidade do domínio inteiro.

## 10. Como reportar SEO

Sempre com: **cliques · impressões · posição média · keywords · páginas** (Search Console), e o
que mudou desde a última medição. Sem Search Console conectado, diga que não há dado — não estime.
