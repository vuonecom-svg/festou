# Dados, tracking, CRO, testes e economia SaaS — FesFlow

> **Estado atual verificado (07/08/2026): não existe NENHUM tracking no projeto.**
> Sem GA4, sem Google Tag Manager, sem Meta Pixel, sem Vercel Analytics, sem PostHog, sem Clarity.
> Ver `references/produto.md`. Enquanto isso não mudar, **não existe medição de aquisição** —
> e qualquer número de canal que alguém citar é palpite.

## 1. Métricas que acompanhamos

Visitantes · usuários · canais · origem · campanhas · leads · leads qualificados · demonstrações ·
testes · cadastros · ativações · clientes · **CAC · CPL · CPA · MRR · ARR · churn · retenção · LTV ·
payback** · conversões.

⛔ Quando não houver dado suficiente para uma métrica, **diga isso**. Nunca invente número.

## 2. Tracking — o que implementar (P0)

- **Google Analytics 4** + **Google Tag Manager**
- **Google Search Console** (SEO — hoje nem sitemap existe)
- **Meta Pixel** + **Conversions API** (quando houver mídia paga)
- **Google Ads Conversion Tracking**
- **UTMs padronizadas** em todo link de campanha
- **Eventos internos do produto**

**Eventos sugeridos para o FesFlow** (nomes estáveis, snake_case):
```
page_view
pricing_view
cta_clicked
demo_requested
signup_started
signup_completed
first_brinquedo_created      ← primeiro brinquedo cadastrado
first_cliente_created        ← primeiro cliente cadastrado
first_orcamento_created      ← primeiro orçamento
first_reserva_created        ← primeira reserva (candidato a ATIVAÇÃO)
first_contrato_generated     ← primeiro contrato em PDF
checkout_started             ← clicou no checkout Kiwify
subscription_started         ← pagamento aprovado (webhook Kiwify já existe)
```

O webhook da Kiwify (`src/app/api/webhooks/kiwify`) já é o ponto natural para marcar a conversão
de receita com confiabilidade — vale mais que pixel de navegador.

⚠️ Implementar tracking **mexe no código** → handoff técnico + autorização antes do deploy.

## 3. North Star Metric

Escolha a ação que representa **valor real entregue ao cliente**, não vaidade.

Candidata mais forte no FesFlow: **quantidade de reservas/pedidos gerenciados com sucesso no
sistema** (por empresa, por semana). É o uso que só acontece se o produto está resolvendo o problema
— e é o que prevê retenção.

Alternativas a considerar com dado: orçamentos convertidos em pedido · contratos gerados ·
empresas com agenda ativa na semana.

⛔ Não escolha "cadastros" nem "seguidores". Isso é vaidade.

## 4. CRO — aumentar conversão do que já temos

Analise sempre: headlines · subtítulos · CTAs · formulários · fricção · prova social · quantidade de
campos · vídeos · prints · demonstrações · preço · oferta · garantia · páginas · **mobile** ·
velocidade.

Neste produto, o dono de locadora acessa muito pelo celular — **mobile e velocidade não são
detalhe**, são conversão.

Todo teste de CRO tem: **HIPÓTESE · MÉTRICA · RESULTADO · DECISÃO.**

## 5. Cultura de experimentação

Testes iniciais sugeridos (cada um com hipótese explícita):

| # | Teste |
|---|---|
| 01 | Dor de conflito de agenda como ângulo principal |
| 02 | Dor de WhatsApp desorganizado |
| 03 | Dor de crescimento ("cresceu mais que sua organização") |
| 04 | Demonstração visual do sistema |
| 05 | Sistema × planilha/caderno |
| 06 | Oferta de 1º mês por R$ 5,00 em destaque × plano anual em destaque |

Para cada teste registre: **HIPÓTESE · CANAL · PÚBLICO · CRIATIVO · MÉTRICA · RESULTADO · DECISÃO.**

## 6. Priorização

Não entregue 100 ideias. Classifique por **impacto × confiança × esforço × velocidade de
aprendizado**, e rotule:

- **P0** — fazer agora
- **P1** — fazer depois
- **P2** — testar no futuro

## 7. Economia SaaS — marketing não vive isolado

Entenda e use: **MRR · ARR · CAC · LTV · churn · ARPU · CAC payback · retention · expansion ·
activation · trial conversion · MQL · SQL · pipeline.**

Com ticket de R$ 44,90/mês (ver `produto.md`), a conta é apertada: **CAC precisa ser baixo e o
payback curto**. Isso empurra a estratégia para orgânico, SEO, indicação e parceria — mídia paga
entra como acelerador quando a conversão já estiver medida, não como primeiro movimento.
Trate isso como **inferência a validar com dados reais de retenção**, não como veredito.

## 8. Relatório semanal (quando houver dados)

**AQUISIÇÃO** — tráfego, leads, CPL, cadastros, demos, CAC
**CONVERSÃO** — visitante→lead, lead→demo, demo→cliente, trial→cliente
**CONTEÚDO** — alcance, visualizações, engajamento, cliques, leads
**SEO** — cliques, impressões, posições, keywords, páginas
**RECEITA** — MRR gerado, pipeline, CAC, payback
**TESTES** — o que testamos, resultado, aprendizado, próximo teste

Se um bloco não tiver dado, escreva "sem instrumentação" — não preencha com estimativa disfarçada.

## 9. Memória de marketing

Todo aprendizado vai para `memoria/REGISTRO.md`: testes realizados, criativos vencedores e
perdedores, públicos, canais, CAC, CPL, conversões, palavras-chave, conteúdos, objeções ouvidas.
**Não repita teste ruim sem motivo.**
