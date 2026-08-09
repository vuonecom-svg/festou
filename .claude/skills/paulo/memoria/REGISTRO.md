# Memória de marketing — FesFlow

Registro vivo do Paulo. **Sempre que houver teste, resultado, objeção nova, criativo vencedor ou
perdedor, decisão de canal, keyword validada ou número de CAC/CPL — registre aqui.**
Objetivo: não repetir teste ruim e não perder aprendizado entre sessões.

Regra: **só entra o que foi observado.** Hipótese entra rotulada como hipótese.

---

## Testes realizados

| Data | Teste | Hipótese | Canal | Público | Métrica | Resultado | Decisão |
|---|---|---|---|---|---|---|---|
| — | _nenhum registrado ainda_ | | | | | | |

## Criativos

| Data | Criativo | Ângulo | Canal | Resultado | Veredito |
|---|---|---|---|---|---|
| — | _nenhum registrado ainda_ | | | | |

## Palavras-chave validadas

| Keyword | Volume (fonte) | Dificuldade | Intenção | Página | Status |
|---|---|---|---|---|---|
| — | _nenhuma validada ainda — todas as sementes em `references/seo-geo-aeo.md` são HIPÓTESE_ | | | | |

## Objeções ouvidas de clientes reais

| Data | Objeção (palavras do cliente) | Origem | Como respondemos | Funcionou? |
|---|---|---|---|---|
| — | _nenhuma registrada ainda_ | | | |

## Números de aquisição

| Período | Canal | Investimento | Leads | CPL | Clientes | CAC | Observação |
|---|---|---|---|---|---|---|---|
| — | _sem instrumentação — não existe tracking no projeto (verificado 07/08/2026)_ | | | | | | |

## Concorrentes mapeados (pesquisa real — 09/08/2026)

| Concorrente | Foco | Modelo | Ameaça |
|---|---|---|---|
| **Cortex Agenda** (cortexagenda.com.br) | 100% locadora de **infláveis e brinquedos de festa** | SaaS, teste grátis | 🔴 **ALTA** — é o rival direto. Tem vitrine online, assinatura digital com validade jurídica, blog ativo atacando EXATAMENTE as mesmas pautas nossas |
| **Estoque NOW** (estoquenow.com.br) | Locação em geral, com página dedicada a aluguel de brinquedos | SaaS, **10 dias grátis** | 🟠 MÉDIA-ALTA — loja virtual integrada, blog, várias landings por segmento |
| **Enkad / Kad Locação** | Locação de produtos para festas | **Licença vitalícia R$ 145** (desktop Windows), sem mensalidade | 🟡 MÉDIA — âncora de preço perigosa: "pago uma vez e pronto" |
| **MSLocações**, **LocApp**, **Sistemas Empresariais** | Locação genérica | Vários | 🟢 BAIXA — menos focados no nicho de festa |

**Achados que mudam a estratégia:**
1. **Cortex Agenda já publica nos nossos temas** — tem artigo de contrato de locação de infláveis,
   de como organizar a agenda da locadora e de "do WhatsApp ao contrato assinado". Nossos 3 artigos
   cobrem quase os mesmos assuntos. Estamos disputando as mesmas SERPs, e eles chegaram antes.
2. **Praticamente todos oferecem teste grátis. Nós não.** Nosso equivalente é o 1º mês por R$ 5 —
   é barato, mas ainda é uma barreira de cartão de crédito que o concorrente não tem.
3. **Vitrine/loja online é padrão do mercado** (Cortex e Estoque NOW têm). O FesFlow não tem.
   Para o locador, isso não é "recurso extra" — é como ele vende.
4. **Assinatura digital com validade jurídica** é o diferencial que o Cortex mais destaca. Nós
   geramos o contrato em PDF, mas o cliente ainda assina fora do sistema.
5. **Nenhum deles publica prova social.** Depoimento e case é terra de ninguém no nicho inteiro —
   quem fizer primeiro ganha vantagem barata.

## Decisões e aprendizados

- **07/08/2026** — Levantamento inicial do estado de marketing feito a partir do código. Confirmado:
  sem sitemap, robots, canonical/OG, manifest, JSON-LD ou qualquer tracking. Blog com 3 artigos,
  FAQ com 9 perguntas, sem página `/precos`. Oferta: plano único, 3 ciclos, 1º mês por R$ 5,00.
  → Conclusão: **tracking + fundação de SEO são P0**; mídia paga antes disso é dinheiro cego.

- **09/08/2026 — FRONTEIRA definida pelo dono:** este Paulo é **exclusivo do FesFlow**. Não age no
  Scana nem no FINLOCA; o que acontece neles não vira fato aqui. Pode consultar o Paulo do Scana
  para aprender **método** (não conteúdo). Detalhe em `../FRONTEIRA.md`.

- **09/08/2026 — Auditoria de SEO + fundação técnica implementada.**
  - 🚨 **Achado mais grave:** `fesflow.com.br` **está no ar mas não está indexado** — a busca
    `site:fesflow.com.br` retornou zero resultados. O site existia sem `robots.txt` nem
    `sitemap.xml`, e o Search Console nunca foi conectado. Ou seja: tráfego orgânico = 0 por
    construção, não por competição.
  - ✅ Implementado e verificado no HTML gerado: robots, sitemap, manifest, opengraph-image,
    metadataBase/canonical/OG/Twitter, JSON-LD completo (Organization, WebSite,
    SoftwareApplication+Offer, FAQPage, Blog, BlogPosting, BreadcrumbList) e a página `/precos`.
  - 🐛 **Bug encontrado e corrigido:** `og:image` não era emitido em NENHUMA página e o
    `twitter:card` caía para `summary`. Causa: página que declara `openGraph`/`twitter` próprios
    substitui o objeto do layout inteiro — a imagem some sem erro nenhum. Solução: helper
    `paginaMetadata()` em `src/lib/seo.tsx`. **Toda página nova deve usar esse helper.**
  - ⚙️ O middleware (`src/proxy.ts`) rodava `supabase.auth.getUser()` até em `robots.txt` —
    excluído dos arquivos de SEO.
  - ✅ **DEPLOYADO EM PRODUÇÃO em 09/08/2026** — ver o registro de deploy no fim deste arquivo.

- **09/08/2026 — Segunda rodada: páginas comerciais e conteúdo.**
  - **6 páginas por segmento** criadas em `src/lib/segmentos.ts` + rota `(site)/[segmento]`
    (`dynamicParams = false`, então só os 6 slugs existem e o resto é 404):
    `/sistema-para-locadora-de-brinquedos`, `/sistema-para-aluguel-de-salao-de-festas`,
    `/sistema-para-buffet`, `/sistema-para-pegue-e-monte`, `/sistema-para-decoracao-de-festas`,
    `/sistema-para-doces-e-salgados`. Cada uma com dor, solução e FAQ **próprias** do ramo —
    nada de template com a palavra trocada. Os 6 nichos já existiam em `src/lib/nichos.ts` e
    nenhum tinha página.
  - Cards de nicho da home viraram links para as páginas de segmento (passa autoridade da home).
  - **3 artigos novos** mirando as pautas que o Cortex Agenda já ocupa: precificação de pula-pula,
    "do WhatsApp ao contrato assinado" e organização da agenda. Blog foi de 3 → 6 artigos.
  - Sitemap: de **0 URLs (inexistente) → 18 URLs**.
  - ⚠️ Lint do projeto tem 4 erros + 2 warnings **pré-existentes** (definir-senha, trocar-senha,
    mobile-nav, verificador-disponibilidade, PDFs) — nenhum é do trabalho de SEO. Não mexidos.

- **09/08/2026 — DEPLOY EM PRODUÇÃO (e a armadilha de branch que quase passou batido).**
  ⛔ **Armadilha para a próxima vez:** o trabalho estava sendo feito na branch **`nichos-onboarding`**,
  não em `main`. Produção sai de `main`. Mais grave: `src/lib/nichos.ts` **só existe na branch** —
  ou seja, as 6 páginas por segmento dependiam de um recurso do dono ainda não lançado.
  Mergear a branch para deployar o SEO teria empurrado junto o recurso multi-nicho + onboarding
  dele, sem ele pedir. **Sempre confira `git status -sb` e de onde a produção sai antes de falar
  em deploy.**

  Solução aplicada — separar o que dá para separar:
  1. Worktree limpo a partir de `origin/main` (não encostar na árvore de trabalho do dono, que tinha
     `config-inicial/`, `launch.json` e 6 `scripts/*.mjs` não commitados).
  2. Levados só os arquivos sem dependência de nichos; `sitemap.ts` reescrito sem `SEGMENTOS`; na
     home antiga aplicados só metadata + JSON-LD + links `/precos`.
  3. Build verde + 44 testes, push fast-forward `7585dc9..acedc80` para `main`.
  4. Depois, `origin/main` mergeado de volta na `nichos-onboarding` (2 conflitos triviais em
     `(site)/page.tsx` e `sitemap.ts`, resolvidos mantendo a branch, que é superconjunto) — commit
     `8da7bb9`. **A branch do dono ficou limpa para mergear quando ele quiser.**

  ✅ **Verificado ao vivo em produção:** `fesflow.com.br/sitemap.xml` responde com as 12 URLs,
  `/precos` no ar com a tabela comparativa, e o artigo de precificação de pula-pula publicado.

  **No ar agora:** fundação de SEO + `/precos` + 6 artigos de blog.
  **Ainda na branch `nichos-onboarding`** (sobem quando o dono lançar o multi-nicho): as 6 páginas
  por segmento e a home multi-nicho.

  ➡️ **Próximo passo que só o dono faz:** Search Console (verificar domínio + submeter o sitemap).
  Sem isso o site continua sem ser indexado, mesmo com tudo publicado.
