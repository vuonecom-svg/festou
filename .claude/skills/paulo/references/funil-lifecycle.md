# Funil, landing, product marketing e ciclo de vida — FesFlow

## 1. Funil de marketing

**TOPO — gerar consciência.** Erros, problemas, situações, curiosidades, identificação, rotina do
locador. A pessoa nem sempre sabe que tem o problema.

**MEIO — educar.** Como organizar, como controlar reservas, como evitar conflito, como
profissionalizar, como escalar, comparações.

**FUNDO — converter.** Demonstração, sistema funcionando, funcionalidades, diferenciais, estudos de
caso, depoimentos reais, comparação, oferta, teste.

## 2. Funil SaaS — o que realmente medimos

```
VISITANTE → LEAD → DEMONSTRAÇÃO → CADASTRO → TESTE → ATIVAÇÃO →
CLIENTE → CLIENTE RETIDO → CLIENTE PROMOTOR
```

⛔ **Cadastro não é vitória.** O objetivo é **cliente pagando e usando**. Comemorar cadastro é
métrica de vaidade.

## 3. Product marketing — traduzir funcionalidade em resultado

Para cada funcionalidade que o produto lançar, descubra: **que problema resolve · para qual ICP ·
por que importa · que resultado gera · como demonstrar · como comunicar · que objeção elimina.**

⛔ Nunca anuncie: *"Agora temos agenda inteligente."*
✅ Anuncie: *"Veja em segundos quais brinquedos estão livres na data da festa, antes de confirmar
com o cliente."*

Sempre traduza: **FUNCIONALIDADE → BENEFÍCIO → RESULTADO.**

## 4. Landing pages

Toda landing responde rápido: **O QUE É? · PARA QUEM? · QUE PROBLEMA RESOLVE? · QUAL BENEFÍCIO? ·
QUAL O PRÓXIMO PASSO?**

Estrutura de referência:
`HERO → PROBLEMA → BENEFÍCIOS → COMO FUNCIONA → DEMONSTRAÇÃO → FUNCIONALIDADES → PROVAS →
SEGMENTOS → COMPARAÇÃO → OBJEÇÕES → FAQ → CTA`

⚠️ Hoje **não existe `/precos`** no FesFlow (verificado) — a oferta vive só na home. É uma lacuna
comercial e de SEO ao mesmo tempo.

## 5. Ativação e time-to-value

Seu trabalho **não acaba quando alguém cria conta**. A pergunta é: qual é o menor caminho entre
criar a conta e pensar *"agora entendi por que esse sistema é útil"*?

Candidatos a **momento de ativação** no FesFlow (a validar com dado de produto, não presumir):
- cadastrar o primeiro brinquedo;
- cadastrar o primeiro cliente;
- criar o primeiro orçamento;
- **criar a primeira reserva/pedido e ver a agenda bloquear o conflito** ← hipótese mais forte,
  porque é exatamente o diferencial do produto;
- gerar o primeiro contrato em PDF.

Escolha **um** como métrica de ativação, meça, e só troque com dado.

## 6. Onboarding

Jornada de referência (deve reagir ao comportamento, não só ao calendário):

| Momento | Objetivo |
|---|---|
| Dia 0 | Criou conta — boas-vindas + primeiro passo único e claro |
| Dia 1 | Cadastre seus brinquedos |
| Dia 2 | Crie sua primeira reserva/orçamento |
| Dia 3 | Cadastre seus clientes |
| Dia 5 | Conheça um recurso de alto valor (contrato em PDF / financeiro) |
| Dia 7 | Mostre o quanto a operação já está centralizada |

Quem já ativou não deve receber o e-mail de quem não ativou. Comportamento manda.

## 7. CRM — jornadas que você desenha

Novos leads · leads sem resposta · demonstração · no-show · trial · trial inativo · trial ativado ·
cliente · cliente inativo · churn · indicação.

⛔ Você **cria** as mensagens. Você **não dispara** nada sem autorização explícita.

## 8. E-mail marketing

Domine: onboarding, nutrição, newsletter, recuperação, trial, reativação, lançamento, conteúdo,
oferta.
**Todo e-mail tem propósito.** Não envie e-mail só porque chegou terça-feira.
Infra já existente no produto: SendGrid (`src/lib/email.ts`) — reaproveite em vez de propor
ferramenta nova sem motivo.

## 9. WhatsApp

Canal **extremamente relevante** neste mercado — o dono de locadora vive no WhatsApp.
Pense jornadas de: lead · demo · acompanhamento · onboarding · conteúdo · recuperação · indicação.
⛔ Sem spam. Comunicação relevante e contextual, sempre com autorização para disparar.

## 10. Retenção, indicação, parcerias e influência

**Retenção** — é onde o ticket baixo se paga. Cliente que usa a agenda toda semana não cancela.
Acompanhe uso, não só pagamento.

**Indicação** — locador conhece locador. Possibilidades: crédito, desconto, mês grátis, benefício,
comissão, upgrade. **Sempre calcule a viabilidade** antes de propor (ticket de R$ 44,90 não sustenta
qualquer recompensa).

**Parcerias** — pergunte sempre: *"quem já tem acesso ao nosso cliente antes de nós?"*
Candidatos: fabricantes de pula-pula e infláveis, distribuidores, fornecedores, lojas de artigos de
festa, empresas de decoração, cursos, consultores, comunidades, eventos e associações do setor.

**Influência** — criadores do nicho, donos de locadora com audiência, consultores, fabricantes.
Avalie audiência, relevância, confiança, engajamento, custo e potencial de conversão.
**Microinfluenciador do nicho costuma valer mais que influenciador grande genérico.**

## 11. Lead magnets e ferramentas gratuitas

Geram SEO e lead ao mesmo tempo. Candidatos com ligação direta ao produto:
- calculadora de preço de locação de brinquedo;
- calculadora de rentabilidade por brinquedo (qual item se paga);
- modelo de contrato de locação de brinquedos;
- modelo de orçamento;
- checklist de entrega/montagem de festa;
- planilha de organização (a mesma que queremos substituir — é uma isca honesta e eficaz);
- guia "como montar uma empresa de aluguel de brinquedos".

Toda isca precisa ter **caminho até o produto**. Isca sem ponte é conteúdo perdido.

## 12. PLG — o produto como canal

Avalie se o próprio FesFlow pode gerar crescimento: contratos e orçamentos em PDF que chegam ao
consumidor final, páginas compartilháveis, links, convites de equipe, marca discreta nos documentos
gerados, recursos compartilhados.
**Sempre sem prejudicar a experiência do cliente pagante** — e sempre com autorização, porque mexe
no produto.

## 13. Lançamento de funcionalidade

⛔ Não publique "nova funcionalidade disponível".

`FASE 1 — TEASER → FASE 2 — EDUCAÇÃO DO PROBLEMA → FASE 3 — APRESENTAÇÃO → FASE 4 — DEMONSTRAÇÃO →
FASE 5 — PROVA → FASE 6 — RETARGETING`

## 14. Provas e cases

Use provas **reais**: clientes, depoimentos, números, prints, vídeos, cases, avaliações.
⛔ **NUNCA invente.** Se não houver prova suficiente, a entrega correta é:
*"precisamos gerar provas"* — com um plano de como consegui-las.

Estrutura de case: `ANTES → PROBLEMA → PROCESSO → SOLUÇÃO → RESULTADO → DEPOIMENTO`.

## 15. Comunidade (longo prazo)

Comunidade de locadores / empreendedores de festa / pegue e monte pode gerar autoridade, retenção,
conteúdo, indicação e aquisição ao mesmo tempo. Avalie quando houver base de clientes suficiente
para sustentá-la — comunidade vazia queima marca.
