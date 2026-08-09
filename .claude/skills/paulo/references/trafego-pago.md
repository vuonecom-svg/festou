# Tráfego pago — Meta Ads, Google Ads, criativos e retargeting — FesFlow

> ⚠️ **Pré-requisito absoluto:** hoje o projeto **não tem nenhum tracking** (sem GA4, GTM, Pixel —
> verificado, ver `produto.md`). **Não recomende subir mídia antes de tracking + conversão medida.**
> Investir sem medição é queimar dinheiro e não aprender nada. Isso é P0.
>
> ⛔ Você **não publica campanha, não altera orçamento e não pausa/deleta campanha** sem autorização
> explícita do dono. Você planeja, escreve, estrutura e recomenda.

## 1. Meta Ads (Facebook + Instagram)

É onde o dono de locadora está. Domine: públicos, remarketing, lookalike, Advantage+, criativos em
vídeo, formatos, testes e otimização.

**Estrutura de teste recomendada (topo):** um conjunto por **ângulo de dor**, não por cor de botão.
Teste sempre: hooks · criativos · dores · públicos · formatos · CTAs · ofertas.

**Ângulos iniciais a testar (hipóteses, não fatos):**
| # | Ângulo | Hook base |
|---|---|---|
| A | Conflito de agenda | "Esse erro faz você mandar o mesmo brinquedo para duas festas" |
| B | Tempo perdido | "Quantos lugares você abre para saber se um brinquedo está livre?" |
| C | Crescimento | "3 sinais de que sua locadora cresceu mais que sua organização" |
| D | Controle de reservas | "Sua agenda cabe na sua cabeça? Até quando?" |
| E | Demonstração | Tela do sistema montando um orçamento com disponibilidade ao vivo |
| F | Oferta | Primeiro mês por R$ 5,00 (fato verificado — ver `produto.md`) |

**Remarketing por comportamento** (ver seção 4).

## 2. Google Ads

Domine: Search, Display (quando fizer sentido), YouTube, Performance Max (só com justificativa
estratégica), remarketing, palavras-chave, intenção, negativas, correspondência, Quality Score,
landing page e conversão.

**Search é o canal mais quente aqui** — quem busca "sistema para locação de brinquedos" já sabe que
tem o problema e já está procurando solução.

**Termos a investigar (NÃO assuma volume — pesquise antes de montar campanha):**
`sistema para locação` · `sistema para locadora` · `sistema para locação de festas` · `sistema para
aluguel de brinquedos` · `sistema pula pula` · `sistema para pegue e monte` · `agenda para
locadora` · `programa para locação` · `software para locação` · `sistema para buffet` · `gestão de
festas` · `controle de reservas` · `sistema para aluguel de mesas e cadeiras`.

**Negativas obrigatórias a considerar:** "aluguel de brinquedos" puro (é o consumidor final
procurando alugar, não a locadora procurando sistema), "grátis", "download", "curso", "como montar",
nomes de brinquedo sem intenção de software. Isso protege boa parte do orçamento.

⚠️ **Landing dedicada é pré-requisito.** Hoje não existe `/precos` nem página por termo — mandar
tráfego pago para a home genérica desperdiça clique caro. Ver `references/seo-geo-aeo.md` §3.

## 3. Criativos — o teste é de conceito, não de cor

Para **cada** anúncio, defina antes de produzir:
**ICP · etapa do funil · problema · hipótese · hook · argumento · imagem/vídeo · copy · headline ·
CTA · landing page · conversão esperada · métrica.**

⛔ Trocar cor de botão e chamar de "teste de criativo" não é teste. **Teste conceitos diferentes.**

## 4. Retargeting — mensagem diferente por comportamento

| Comportamento | Mensagem |
|---|---|
| Visitou o site | Reforço da dor + prova |
| Visitou preço | Quebra de objeção de valor + oferta (1º mês R$ 5) |
| Assistiu vídeo | Aprofundamento / demonstração |
| Abriu cadastro e não concluiu | Fricção: "leva 2 minutos, sem instalar nada" |
| Criou conta e não ativou | Time-to-value: "cadastre seu primeiro brinquedo" |
| Testou e não comprou | Objeção específica + prova + suporte humano |

Cada comportamento exige mensagem diferente. Um único anúncio para todos desperdiça verba.

## 5. Orçamento — nunca chute

⛔ Nunca diga "invista R$ 10.000" sem contexto.

Antes de qualquer recomendação de verba, analise: **ticket · margem · CAC máximo aceitável ·
taxa de conversão · capacidade de atendimento · estágio da empresa.**

Referência de cálculo (a base vem do produto, ver `produto.md`):
- Ticket mensal atual: R$ 44,90 (anual equivale a R$ 29,90/mês).
- CAC máximo depende do **tempo médio de retenção**, que hoje é **INFORMAÇÃO NECESSÁRIA** — sem ela,
  trabalhe com **cenários** (ex.: retenção de 6, 12 e 24 meses) e mostre os três.
- Um SaaS de ticket baixo raramente sustenta CAC alto: a conta precisa fechar em payback, não em
  otimismo.

Quando não houver dado, entregue **cenários explícitos** com a premissa escrita — nunca um número
solto apresentado como certeza.
