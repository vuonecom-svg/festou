// Páginas comerciais por segmento (SEO de intenção).
//
// Cada segmento tem conteúdo PRÓPRIO — dor, vocabulário e FAQ do ramo. Não é
// template com a palavra trocada: página quase igual à outra não ranqueia e
// ainda derruba a qualidade do domínio inteiro.
//
// Regra ao adicionar um segmento novo:
//   1. só crie se houver intenção de busca real para o termo;
//   2. escreva dores e FAQ específicas — se você não consegue escrever algo
//      genuinamente diferente, a página não deve existir;
//   3. o slug entra automaticamente no sitemap.
//
// ⚠️ Só prometa o que o produto faz de verdade (ver a skill do Paulo,
// references/produto.md). Nada aqui pode descrever funcionalidade inexistente.

import type { NichoKey } from "@/lib/nichos";

export type Segmento = {
  slug: string;
  nicho: NichoKey;
  /** Termo-alvo principal da página. */
  keyword: string;
  title: string;
  description: string;
  h1: string;
  subtitulo: string;
  /** Abertura — direta, sem "no mundo atual". */
  intro: string[];
  /** Dores concretas DESTE ramo, na linguagem de quem vive nele. */
  dores: string[];
  /** Como o FesFlow resolve — cada item amarrado a algo que existe. */
  solucoes: { titulo: string; desc: string }[];
  /** FAQ específica do segmento (alimenta o FAQPage da página). */
  faq: { q: string; a: string }[];
};

export const SEGMENTOS: Segmento[] = [
  {
    slug: "sistema-para-locadora-de-brinquedos",
    nicho: "brinquedos",
    keyword: "sistema para locadora de brinquedos",
    title: "Sistema para locadora de brinquedos — FesFlow",
    description:
      "Agenda que impede alugar o mesmo pula-pula duas vezes no mesmo dia, orçamento em PDF, contrato e financeiro. Feito para locadora de brinquedos e infláveis.",
    h1: "Sistema para locadora de brinquedos",
    subtitulo:
      "Pula-pula, infláveis, cama elástica, tobogã, piscina de bolinha, mesas e cadeiras — com a agenda no controle.",
    intro: [
      "Poucos erros doem tanto quanto descobrir, na sexta à noite, que o mesmo pula-pula foi prometido para duas festas no sábado. Alguém vai ficar sem — e a sua reputação vai junto.",
      "O FesFlow existe para que isso não aconteça. Cada reserva bloqueia o brinquedo por uma janela que já inclui transporte, montagem, desmontagem e limpeza. Se conflita, o sistema simplesmente não deixa reservar.",
    ],
    dores: [
      "Confirmar uma data no WhatsApp sem lembrar que o brinquedo já estava comprometido",
      "Esquecer que entre uma festa e outra existe transporte, montagem e limpeza",
      "Ter três unidades do mesmo brinquedo e não saber quantas estão livres numa data",
      "Perder o orçamento antigo no meio da conversa quando o cliente volta",
      "Não saber qual brinquedo paga as contas e qual só dá manutenção",
    ],
    solucoes: [
      {
        titulo: "Agenda anti-overbooking por unidade",
        desc: "Você cadastra cada unidade e o sistema controla a disponibilidade uma a uma. A trava é no banco de dados, não só na tela — nem por erro humano fura.",
      },
      {
        titulo: "Buffers de transporte e limpeza no cálculo",
        desc: "Uma festa das 14h às 18h bloqueia o brinquedo antes e depois, pelo tempo real da sua operação. Sem atraso na entrega da festa seguinte.",
      },
      {
        titulo: "Orçamento com disponibilidade ao vivo",
        desc: "Monte a proposta escolhendo brinquedos e vendo na hora o que está livre naquela data. Envie o PDF pelo WhatsApp.",
      },
      {
        titulo: "Contrato e termo de responsabilidade",
        desc: "Gere o contrato de locação em PDF com as cláusulas de segurança, chuva, danos e cancelamento — sem montar tudo à mão.",
      },
    ],
    faq: [
      {
        q: "E se eu tiver mais de um brinquedo igual?",
        a: "Você cadastra cada unidade separadamente e o sistema controla a disponibilidade unidade por unidade. Assim você sabe exatamente quantos pula-pulas estão livres em cada data.",
      },
      {
        q: "O sistema considera o tempo de montagem e limpeza?",
        a: "Sim. Cada reserva bloqueia o brinquedo por uma janela que inclui transporte, montagem, desmontagem e limpeza. Se você tentar reservar num período que conflita com essa janela, o sistema bloqueia.",
      },
      {
        q: "Serve para quem aluga também mesas, cadeiras e tendas?",
        a: "Serve. Qualquer item do seu catálogo entra na mesma agenda e no mesmo orçamento — brinquedos, mobiliário e estruturas.",
      },
    ],
  },
  {
    slug: "sistema-para-aluguel-de-salao-de-festas",
    nicho: "espacos",
    keyword: "sistema para aluguel de salão de festas",
    title: "Sistema para aluguel de salão de festas e espaços — FesFlow",
    description:
      "Controle de datas e turnos sem reserva dupla, contrato, sinal e financeiro para salão de festas, buffet infantil e chácara de eventos.",
    h1: "Sistema para aluguel de salão de festas",
    subtitulo: "Salão, buffet infantil, chácara e área de eventos — uma data, um cliente, sem confusão.",
    intro: [
      "No aluguel de espaço, o erro é mais caro do que em qualquer outro ramo de festa: você não tem uma segunda unidade para mandar no lugar. Uma data vendida duas vezes vira devolução de sinal e reputação queimada.",
      "O FesFlow trata a data e o turno como recurso único. Reservou, está bloqueado — e o bloqueio é garantido no banco de dados, não só na tela de quem digitou.",
    ],
    dores: [
      "Duas festas marcadas para o mesmo dia porque a agenda estava em dois lugares",
      "Não saber se o intervalo entre um evento e outro dá tempo de limpar e remontar",
      "Sinal recebido e ninguém lembra quanto ainda falta receber",
      "Visita marcada, cliente sumiu, e nada registrado para dar follow-up",
      "Contrato de locação do espaço refeito no Word toda vez",
    ],
    solucoes: [
      {
        titulo: "Agenda por data e turno",
        desc: "Cada reserva ocupa a data e o turno do espaço. O sistema não deixa encaixar um segundo evento em cima, mesmo que a tentativa venha de outra pessoa da equipe.",
      },
      {
        titulo: "Intervalo entre eventos respeitado",
        desc: "O tempo de desmontagem, limpeza e remontagem entra no cálculo do bloqueio — não adianta o horário 'caber' se a operação não cabe.",
      },
      {
        titulo: "Sinal e saldo sob controle",
        desc: "Registre o sinal na confirmação e acompanhe o valor restante, o que já entrou e o que ainda está a receber, por evento e por período.",
      },
      {
        titulo: "Contrato gerado do próprio pedido",
        desc: "O contrato sai em PDF a partir dos dados do evento — data, horário, endereço, valores e cláusulas — pronto para enviar.",
      },
    ],
    faq: [
      {
        q: "Consigo alugar o mesmo espaço em turnos diferentes no mesmo dia?",
        a: "Sim. Você define a janela de cada reserva e o sistema respeita o intervalo necessário entre um evento e outro, considerando desmontagem e limpeza.",
      },
      {
        q: "Dá para controlar mais de um espaço?",
        a: "Dá. Cada espaço é um item do seu catálogo, com agenda e disponibilidade próprias.",
      },
      {
        q: "O sistema controla o sinal e o valor restante?",
        a: "Controla. Você registra o sinal, acompanha o saldo a receber e vê o faturamento por período — sem depender de anotação avulsa.",
      },
    ],
  },
  {
    slug: "sistema-para-buffet",
    nicho: "buffet",
    keyword: "sistema para buffet",
    title: "Sistema para buffet e gastronomia de eventos — FesFlow",
    description:
      "Orçamento por convidado, pacotes, contrato e financeiro do evento. Sistema de gestão para buffet, finger food e ilhas gastronômicas.",
    h1: "Sistema para buffet",
    subtitulo: "Buffet completo, finger food, ilhas gastronômicas e equipe — do orçamento ao acerto final.",
    intro: [
      "No buffet, o orçamento muda o tempo todo: o número de convidados sobe, o cardápio troca, o cliente pede mais uma ilha. Quando isso vive só no WhatsApp, alguma versão se perde — e normalmente é a que você combinou.",
      "O FesFlow guarda cada proposta, com o que foi combinado, quanto foi pago e o que falta receber. E a agenda avisa quando você está prestes a fechar dois eventos que a sua equipe não dá conta de atender.",
    ],
    dores: [
      "Recalcular o orçamento por convidado na mão toda vez que o número muda",
      "Não achar a última versão da proposta que o cliente aprovou",
      "Fechar dois eventos no mesmo horário sem equipe para os dois",
      "Perder o controle de quanto já foi pago de sinal em cada evento",
      "Não saber, no fim do mês, qual pacote deu mais lucro",
    ],
    solucoes: [
      {
        titulo: "Orçamento por pacote e por convidado",
        desc: "Monte a proposta com os seus pacotes, ajuste o número de convidados e o sistema recalcula o total, o sinal e o valor restante.",
      },
      {
        titulo: "Agenda de eventos sem sobreposição",
        desc: "Cada evento ocupa data e horário. O sistema bloqueia o conflito, considerando o tempo de montagem e desmontagem da operação.",
      },
      {
        titulo: "Proposta em PDF para enviar na hora",
        desc: "O orçamento vira um PDF profissional, pronto para o WhatsApp ou e-mail — a mesma versão que fica registrada no sistema.",
      },
      {
        titulo: "Financeiro do evento fechado",
        desc: "Sinal, restante, contas a receber e faturamento por período, cliente e pacote — para saber o que realmente dá margem.",
      },
    ],
    faq: [
      {
        q: "Dá para trabalhar com preço por convidado?",
        a: "Dá. Você define o pacote e o valor, e o orçamento é montado a partir da quantidade — com o sinal e o restante calculados automaticamente.",
      },
      {
        q: "Consigo guardar o histórico do cliente?",
        a: "Sim. Cada cliente tem o histórico de eventos, orçamentos e valores, com o endereço do evento separado do endereço de cadastro.",
      },
      {
        q: "Serve para buffet que também aluga mesas e estrutura?",
        a: "Serve. Você pode ter no mesmo catálogo os pacotes de buffet e os itens de locação, e ambos entram no mesmo orçamento e na mesma agenda.",
      },
    ],
  },
  {
    slug: "sistema-para-pegue-e-monte",
    nicho: "pegmonte",
    keyword: "sistema para pegue e monte",
    title: "Sistema para pegue e monte — FesFlow",
    description:
      "Controle de kits por data de retirada e devolução, contrato, caução e financeiro. Sistema de gestão para empresas de pegue e monte.",
    h1: "Sistema para pegue e monte",
    subtitulo: "Kits prontos para o cliente retirar, montar a própria festa e devolver — sem kit sumido.",
    intro: [
      "No pegue e monte, o item sai da sua mão e volta pela mão do cliente. Sem registro do que saiu, quando volta e em que estado, o prejuízo aparece semanas depois — quando você percebe que faltam peças do kit.",
      "O FesFlow controla o kit por data de retirada e devolução. Enquanto ele não voltou, não está disponível para ninguém — e o contrato de responsabilidade sai junto com a retirada.",
    ],
    dores: [
      "Kit prometido para sábado sem lembrar que só volta no domingo",
      "Peça faltando na devolução e nada assinado que responsabilize o cliente",
      "Caução combinada de boca e esquecida na hora de devolver",
      "Não saber qual kit está na rua e qual está na prateleira",
      "Cliente atrasando a devolução e travando a festa do próximo",
    ],
    solucoes: [
      {
        titulo: "Kit bloqueado da retirada à devolução",
        desc: "A janela de bloqueio cobre todo o período em que o kit está com o cliente, incluindo o tempo de conferência e limpeza antes de sair de novo.",
      },
      {
        titulo: "Combos: o kit inteiro em um clique",
        desc: "Monte o kit como um conjunto de itens e reserve tudo de uma vez — sem esquecer uma peça no orçamento.",
      },
      {
        titulo: "Contrato de responsabilidade na retirada",
        desc: "Gere o contrato em PDF com as cláusulas de danos, devolução e cancelamento antes de o kit sair da sua porta.",
      },
      {
        titulo: "Sinal, caução e saldo registrados",
        desc: "Tudo o que foi cobrado e o que ainda falta fica no sistema, por pedido e por cliente — não na memória.",
      },
    ],
    faq: [
      {
        q: "Como o sistema sabe que o kit ainda está com o cliente?",
        a: "A reserva cobre da retirada até a devolução prevista. Enquanto essa janela não termina, o kit não aparece como disponível para outra data conflitante.",
      },
      {
        q: "Dá para montar kits com vários itens?",
        a: "Dá. Você monta o combo com todos os itens que compõem o kit e reserva o conjunto de uma vez.",
      },
      {
        q: "E o controle de caução?",
        a: "Você registra os valores cobrados no pedido — sinal, restante e caução — e acompanha o que já entrou e o que falta devolver ou receber.",
      },
    ],
  },
  {
    slug: "sistema-para-decoracao-de-festas",
    nicho: "decoracao",
    keyword: "sistema para decoração de festas",
    title: "Sistema para decoração de festas — FesFlow",
    description:
      "Agenda de montagem e retirada, orçamento por tema, contrato e financeiro para empresas de decoração de festas e cenografia.",
    h1: "Sistema para decoração de festas",
    subtitulo: "Painéis, balões, temas, mobiliário e cenografia — com a equipe sabendo onde estar e quando.",
    intro: [
      "Na decoração, o item não é só alugado: ele é montado e desmontado pela sua equipe. Isso significa que uma festa não ocupa só o material — ocupa também gente e caminhão, antes e depois do evento.",
      "O FesFlow bloqueia o material pela janela real da operação, incluindo montagem e desmontagem. Você para de fechar duas montagens no mesmo horário em pontos opostos da cidade.",
    ],
    dores: [
      "Duas montagens marcadas para o mesmo horário em bairros diferentes",
      "Painel prometido para sábado que só sai da festa de sexta no domingo",
      "Orçamento por tema refeito do zero toda vez",
      "Material voltando danificado sem nada assinado",
      "Não saber quais temas mais saem e quais estão parados",
    ],
    solucoes: [
      {
        titulo: "Agenda de montagem e retirada",
        desc: "A reserva cobre o tempo de montagem, o evento e a desmontagem — não só o horário da festa.",
      },
      {
        titulo: "Orçamento por tema montado como combo",
        desc: "Salve o tema como um conjunto de itens e reutilize na próxima proposta, com a disponibilidade de cada peça conferida ao vivo.",
      },
      {
        titulo: "Contrato automático a partir do pedido",
        desc: "Cláusulas de responsabilidade, danos, chuva e cancelamento em PDF, geradas com os dados do evento.",
      },
      {
        titulo: "Relatórios de rentabilidade por item",
        desc: "Descubra qual tema dá mais lucro e qual só ocupa espaço antes de comprar o próximo.",
      },
    ],
    faq: [
      {
        q: "O sistema considera o tempo da minha equipe montar?",
        a: "Considera. A janela de bloqueio inclui transporte, montagem e desmontagem, então o material não é oferecido para um horário em que sua operação ainda está ocupada.",
      },
      {
        q: "Consigo reaproveitar um tema em vários orçamentos?",
        a: "Sim. Monte o tema como um combo de itens e use nas próximas propostas, sempre com a disponibilidade verificada na data.",
      },
      {
        q: "Dá para separar o endereço do cliente do endereço da festa?",
        a: "Dá. O cadastro do cliente guarda o endereço dele, e cada evento tem o seu próprio endereço de montagem.",
      },
    ],
  },
  {
    slug: "sistema-para-doces-e-salgados",
    nicho: "doces",
    keyword: "sistema para doces e salgados por encomenda",
    title: "Sistema para doces e salgados por encomenda — FesFlow",
    description:
      "Controle de pedidos por data de entrega, agenda de produção, orçamento, contrato e recebimentos para mesa de doces, bolos e salgados.",
    h1: "Sistema para doces e salgados",
    subtitulo: "Mesa de doces, bolos, docinhos e salgados por encomenda — com a agenda de produção sob controle.",
    intro: [
      "Aqui o recurso escasso não é o produto: é o seu dia de produção. Aceitar três mesas de doces para o mesmo sábado é fácil; entregar as três é que não é.",
      "O FesFlow organiza os pedidos por data de entrega, guarda o que foi combinado em cada um e mostra o que já foi pago e o que falta receber — para você aceitar encomenda olhando a agenda, não a memória.",
    ],
    dores: [
      "Aceitar mais encomendas do que a cozinha dá conta no mesmo dia",
      "Perder o detalhe do pedido (sabor, cor, tema) no meio da conversa",
      "Cliente que sumiu depois do orçamento e ninguém deu follow-up",
      "Sinal recebido sem registro de quanto ainda falta",
      "Não saber quanto realmente faturou no mês",
    ],
    solucoes: [
      {
        titulo: "Pedidos organizados por data de entrega",
        desc: "Cada encomenda ocupa a data e o horário combinados, e você enxerga a semana inteira antes de aceitar mais uma.",
      },
      {
        titulo: "Orçamento registrado e enviável em PDF",
        desc: "O que foi combinado fica salvo no pedido — não some na conversa. Envie a proposta pronta pelo WhatsApp.",
      },
      {
        titulo: "Sinal e restante no controle",
        desc: "Registre a entrada, acompanhe o saldo e veja o que está a receber por período e por cliente.",
      },
      {
        titulo: "Histórico do cliente que volta",
        desc: "Cliente recorrente é o mais lucrativo. Veja o que ele já encomendou, quanto gastou e quando vale oferecer de novo.",
      },
    ],
    faq: [
      {
        q: "Serve para quem só trabalha com encomenda, sem alugar nada?",
        a: "Serve. Os pedidos são organizados por data de entrega, com orçamento, registro do que foi combinado e controle de sinal e valor restante.",
      },
      {
        q: "Consigo controlar quantas encomendas cabem no mesmo dia?",
        a: "Você enxerga todos os pedidos por data antes de aceitar mais um, o que evita assumir mais produção do que a sua cozinha entrega.",
      },
      {
        q: "Dá para acompanhar o faturamento?",
        a: "Dá. Os relatórios mostram faturamento por período, ticket médio e quais clientes mais encomendam.",
      },
    ],
  },
];

export function getSegmento(slug: string): Segmento | undefined {
  return SEGMENTOS.find((s) => s.slug === slug);
}
