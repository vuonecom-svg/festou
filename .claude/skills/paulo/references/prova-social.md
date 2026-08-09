# Prova social — o que é permitido, o que temos e como conseguir

## ⛔ A linha que não se cruza

**Nunca inventar:** depoimento, nome de cliente, case, número de usuários, faturamento, resultado,
avaliação, nota, selo, prêmio ou parceria. Nem "baseado em um cliente real". Nem como
"placeholder até chegar o de verdade" — placeholder vira produção e ninguém lembra de trocar.

Três motivos, em ordem de gravidade:
1. **Engana o comprador.** Uma locadora que assina por causa de um depoimento inventado tomou a
   decisão com informação falsa. Isso é dano a uma pessoa real, não detalhe de marketing.
2. **`Review`/`AggregateRating` falso em schema é violação explícita das diretrizes do Google** —
   penalização manual, justamente no domínio que estamos tentando indexar.
3. **Não sobrevive ao primeiro contato.** Basta um prospect perguntar "posso falar com esse
   cliente?" para a marca queimar.

Se não há prova suficiente, a entrega correta é **"precisamos gerar provas"** + o plano de como.
Nunca preencher o vazio com ficção.

## ✅ O que temos de verdade (medido em 09/08/2026)

Levantado com `scripts/uso-por-empresa.mjs` (somente leitura, banco de produção):

| Empresa | Assinatura | Desde | Brinquedos | Clientes | Orçamentos | Pedidos | Reservas | Último pedido |
|---|---|---|---|---|---|---|---|---|
| **AQUARELA KIDS** | **ativa** | 10/07/2026 | 17 | 16 | 16 | 14 | 35 | **07/08/2026** |
| Festa Feliz Locações | trial | 05/07/2026 | 5 | 4 | 2 | 2 | 2 | 05/07/2026 |
| (conta do dono) | ativa | 07/08/2026 | 0 | 0 | 0 | 0 | 0 | — |
| Empresa Teste (onboarding) | ativa | 09/08/2026 | 0 | 0 | 0 | 0 | 0 | — |

**Leitura honesta:** temos **uma** cliente pagante de verdade — a **AQUARELA KIDS** (Jamile) — e ela
não é usuária de fachada: em 30 dias cadastrou 17 brinquedos, 16 clientes, fez 16 orçamentos que
viraram 14 pedidos e 35 reservas, com atividade dois dias atrás.

⚠️ **Cuidado com o que essa tabela permite dizer.** "14 pedidos gerenciados" é fato.
"16 → 14 = 87% de conversão" é matematicamente certo mas **não sabemos se todo orçamento dela vira
pedido no sistema** — pode haver orçamento feito fora. Só use esse número se ela confirmar.
E **nenhum dado dela vai para o site sem autorização por escrito.**

⛔ **Não use "1 cliente" como prova de volume.** Com um cliente, a prova certa é **profundidade**
(um case bem contado), nunca quantidade.

## 📩 Como conseguir o depoimento (o dono envia — o Paulo não fala com cliente)

Mensagem pronta para o WhatsApp da Jamile. Curta, sem pedir favor grande, com saída fácil:

> Oi Jamile, tudo bem? Aqui é o Kleitom, do FesFlow.
>
> Vi que a Aquarela Kids já está com quase 15 festas organizadas pelo sistema desde julho — fiquei
> muito feliz de ver funcionando de verdade no dia a dia.
>
> Posso te fazer 3 perguntinhas rápidas sobre como era antes e como está agora? É pra eu montar
> uma página contando a experiência de vocês, e queria sua autorização pra usar o nome da Aquarela
> Kids. Se preferir, uso só "uma locadora de São Paulo", sem identificar.
>
> Leva uns 5 minutos e me ajuda demais. Pode ser por áudio, do jeito que for mais fácil pra você.

**Por que assim:** cita um fato real (ela reconhece), pede pouco, dá a opção de anonimato (aumenta
muito a taxa de sim) e aceita áudio (o público dela responde por áudio, não escreve texto longo).

## 🎤 As perguntas (produzem citação usável, não "muito bom")

⛔ Nunca pergunte "o que você achou?" — a resposta é sempre "adorei, muito bom", que não vende nada.

1. **"Como você controlava a agenda antes do FesFlow?"**
   → estabelece o *antes*. Provavelmente caderno/planilha/WhatsApp — é o nosso concorrente real.
2. **"Teve alguma vez que quase deu problema de data ou de brinquedo repetido?"**
   → é a história. Se ela contar um episódio concreto, esse é o case inteiro.
3. **"O que mudou no seu dia a dia depois que começou a usar?"**
   → o *depois*, na palavra dela.
4. (bônus) **"Se uma amiga que também aluga brinquedo te perguntasse, o que você diria?"**
   → costuma sair a melhor frase da entrevista, porque ela para de falar com o fornecedor e passa
   a falar com uma colega.

Peça **autorização explícita e registrada** para: usar o nome, usar o logo, publicar foto.
Guarde o print do aceite.

## 🧱 Provas que NÃO dependem de depoimento (podemos usar já)

1. **Demonstração ao vivo do anti-overbooking** — ✅ **feita em 09/08/2026**.
   `src/components/demo-anti-overbooking.tsx` na home importa `@/lib/disponibilidade`, o **mesmo
   módulo que o sistema usa para aceitar ou recusar reserva**. O visitante muda o horário e vê a
   decisão real. É prova verificável que não precisa da palavra de ninguém — e nenhum concorrente
   do nicho tem equivalente.
2. **Screenshots reais do produto** — do sistema funcionando com dados de demonstração.
   Honesto desde que **não** apresentados como a conta de um cliente. ⚠️ Nunca usar a base da
   AQUARELA KIDS: são dados de clientes finais dela (LGPD).
3. **A garantia técnica** — a *exclusion constraint* no Postgres existe e é verificável
   (`prisma/sql/001_antioverbooking_rls.sql`). "A trava é no banco, não na tela" é fato, não slogan.
4. **Transparência de preço** — preço aberto no site, sem "fale com um consultor". Num mercado onde
   metade dos concorrentes esconde o valor, isso é confiança.
5. **Garantias comerciais reais** — 1º mês por R$ 5, cancela quando quiser, sem fidelidade. Já é
   verdade, está no Kiwify; só precisa ganhar destaque.
6. **Bastidor honesto** — mostrar o produto sendo construído. Funciona bem em nicho pequeno e não
   exige cliente nenhum.

## Ordem de prioridade

- **P0** — conseguir o depoimento + autorização da Jamile (é o único cliente real; sem ele, não há
  case). Depende do dono enviar a mensagem.
- **P0** — screenshots reais do produto para a home e para `/precos`.
- **P1** — escrever o case da Aquarela Kids (`ANTES → PROBLEMA → PROCESSO → SOLUÇÃO → RESULTADO →
  DEPOIMENTO`) e publicar como página própria, linkada de `/precos`.
- **P2** — pedir depoimento aos próximos clientes **no momento certo**: logo após o primeiro
  contrato gerado, quando o valor acabou de acontecer. Aí a taxa de sim é maior.
