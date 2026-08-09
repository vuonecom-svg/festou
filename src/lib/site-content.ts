// Conteúdo do site institucional (marketing). Sem dependência de banco.

export const FEATURES = [
  { icon: "CalendarClock", titulo: "Agenda anti-overbooking", desc: "O mesmo brinquedo nunca é alugado duas vezes no mesmo período — contando transporte, montagem, retirada e limpeza. A trava é no banco de dados, não só na tela." },
  { icon: "FileText", titulo: "Orçamentos em 2 minutos", desc: "Monte o orçamento escolhendo brinquedos com disponibilidade ao vivo, calcule sinal e restante, e envie um PDF profissional." },
  { icon: "FileSignature", titulo: "Contratos automáticos", desc: "Gere contrato de locação e termo de responsabilidade em PDF, com cláusulas de segurança, chuva, danos e cancelamento." },
  { icon: "Wallet", titulo: "Financeiro no controle", desc: "Sinal, valor restante, contas a receber e faturamento por período, brinquedo, cliente e cidade." },
  { icon: "Package", titulo: "Catálogo e estoque", desc: "Ficha completa de cada brinquedo: fotos, medidas, capacidade, valores, manutenção e rentabilidade." },
  { icon: "Users", titulo: "Clientes e histórico", desc: "Cadastro com endereço do cliente separado do endereço do evento, tags, avaliação e histórico de locações." },
  { icon: "Truck", titulo: "Equipe e entregas", desc: "Rotas do dia, checklists de montagem e retirada, e status da operação em tempo real (em breve)." },
  { icon: "BarChart3", titulo: "Relatórios que decidem", desc: "Descubra qual brinquedo dá mais lucro, quais clientes mais alugam e o ticket médio da sua locadora." },
];

// Pagamentos via Kiwify — checkouts dos produtos "FesFlow Completo" (conta SK DISTRIBUIDOR).
export const KIWIFY = {
  mensal: "https://pay.kiwify.com.br/ZcSAeRf", // Mensal — 1ª cobrança R$5,00, depois R$44,90/mês
  semestral: "https://pay.kiwify.com.br/NHEFA0R", // Semestral — R$239,40 (parcela em até 6x)
  anual: "https://pay.kiwify.com.br/YsY9z9x", // Anual — R$358,80 (parcela em até 12x)
};

// Plano único "FesFlow Completo" — MESMO acesso em todos; muda só o ciclo/pacote.
export const BILLING: {
  ciclo: string; precoMes: string; meses: number; total: string | null;
  economia: string | null; destaque: boolean; link: string;
}[] = [
  { ciclo: "Mensal", precoMes: "44,90", meses: 1, total: null, economia: null, destaque: false, link: KIWIFY.mensal },
  { ciclo: "Semestral", precoMes: "39,90", meses: 6, total: "239,40", economia: "~11%", destaque: false, link: KIWIFY.semestral },
  { ciclo: "Anual", precoMes: "29,90", meses: 12, total: "358,80", economia: "~33%", destaque: true, link: KIWIFY.anual },
];

export const PLAN_FEATURES = [
  "Brinquedos ilimitados",
  "Usuários ilimitados",
  "Locações ilimitadas",
  "Orçamentos ilimitados",
  "Agenda anti-overbooking",
  "Disponibilidade por data e horário",
  "Contratos em PDF",
  "Controle financeiro completo",
  "Relatórios de faturamento",
  "Cadastro de clientes e catálogo",
  "Acesso pelo celular e computador",
  "WhatsApp e rotas (em breve)",
];

export const FAQS = [
  { q: "O FesFlow serve para a minha locadora de brinquedos?", a: "Sim. O FesFlow foi feito sob medida para locadoras de pula-pula, infláveis, cama elástica, piscina de bolinha, tobogã, mesas, cadeiras, tendas e itens de festa. Se você aluga brinquedos para festas e eventos, ele foi feito para você." },
  { q: "Como o sistema impede alugar o mesmo brinquedo duas vezes?", a: "Cada reserva bloqueia o brinquedo por uma janela que inclui o tempo de transporte, montagem, desmontagem e limpeza. Se você tentar reservar o mesmo item num período que conflita, o sistema bloqueia automaticamente — a garantia é feita no banco de dados, então nem por engano acontece." },
  { q: "Preciso instalar alguma coisa?", a: "Não. O FesFlow funciona 100% no navegador, pelo computador, tablet ou celular. Você acessa de qualquer lugar, inclusive a equipe na rua." },
  { q: "Consigo gerar contrato e orçamento em PDF?", a: "Sim. Com um clique você gera o orçamento e o contrato de locação em PDF, prontos para enviar ao cliente pelo WhatsApp ou e-mail." },
  { q: "Tem controle financeiro?", a: "Tem. Você controla o sinal, o valor restante, contas a receber e vê o faturamento do mês, além de relatórios de qual brinquedo dá mais lucro." },
  { q: "Meus dados ficam separados de outras empresas?", a: "Sim. O FesFlow é multiempresa: cada locadora tem seu próprio ambiente isolado, com seus clientes, brinquedos, agenda e financeiro. Uma empresa nunca vê os dados da outra." },
  { q: "Como funciona a cobrança? Tem desconto para começar?", a: "No plano mensal, o primeiro mês sai por apenas R$ 5,00 — depois a mensalidade fica R$ 44,90, cobrada automaticamente enquanto você quiser continuar. Nos planos semestral e anual você já garante o desconto: o semestral (R$ 239,40) pode ser parcelado em até 6x e o anual (R$ 358,80) em até 12x. Você pode cancelar quando quiser." },
  { q: "Quais as formas de pagamento?", a: "Os pagamentos são processados com segurança pela Kiwify, que aceita cartão de crédito, Pix e boleto. Você escolhe o ciclo (mensal, semestral ou anual) e o acesso à plataforma é liberado automaticamente assim que o pagamento é aprovado." },
  { q: "E se eu tiver mais de um brinquedo igual?", a: "Você cadastra cada unidade, e o sistema controla a disponibilidade unidade por unidade — assim você sabe exatamente quantos pula-pulas estão livres em cada data." },
];

export type Post = {
  slug: string;
  titulo: string;
  data: string;
  leituraMin: number;
  resumo: string;
  secoes: { h?: string; p?: string[]; ul?: string[] }[];
};

export const POSTS: Post[] = [
  {
    slug: "quanto-cobrar-aluguel-de-pula-pula",
    titulo: "Quanto cobrar pelo aluguel de um pula-pula",
    data: "2026-08-09",
    leituraMin: 6,
    resumo:
      "A conta que quase nenhuma locadora faz: quanto custa de verdade colocar um brinquedo na rua — e em quantas festas ele se paga.",
    secoes: [
      {
        p: [
          "A maioria das locadoras define o preço olhando o concorrente do bairro. O problema é que o concorrente também está olhando alguém — e ninguém sabe se a conta fecha. O resultado é uma agenda cheia com margem apertada.",
          "A pergunta certa não é \"quanto os outros cobram\". É: quanto me custa colocar esse brinquedo na festa, e em quantas locações ele se paga?",
        ],
      },
      {
        h: "1. Comece pelo custo real de cada locação",
        p: ["Some tudo que sai do seu bolso para aquele brinquedo sair e voltar:"],
        ul: [
          "Combustível e desgaste do veículo (ida e volta, duas vezes: entrega e retirada)",
          "Mão de obra de montagem e desmontagem — inclusive a sua, se for você quem monta",
          "Limpeza e higienização entre uma festa e outra",
          "Energia e material de manutenção (remendo, cola, motor, tela)",
          "Uma reserva mensal para manutenção corretiva — o brinquedo vai rasgar em algum momento",
        ],
      },
      {
        h: "2. Descubra em quantas festas o brinquedo se paga",
        p: [
          "Divida o valor que você pagou no brinquedo pela margem que sobra em cada locação. Um inflável de R$ 4.000 que deixa R$ 150 líquidos por festa se paga em cerca de 27 locações. Se ele sai 4 vezes por mês, são quase 7 meses só para empatar.",
          "Esse número muda tudo. Ele diz se vale comprar a segunda unidade, se o preço está baixo demais e quanto tempo você fica exposto antes de começar a lucrar.",
        ],
      },
      {
        h: "3. Não venda a hora — venda o dia ocupado",
        p: [
          "Um erro comum é precificar por hora de festa. Só que o brinquedo não fica disponível por hora: entre transporte, montagem, desmontagem e limpeza, uma festa de quatro horas costuma consumir o dia inteiro daquele item.",
          "Se você cobra como se coubesse outra festa no mesmo dia — mas na prática não cabe — está vendendo mais barato do que imagina.",
        ],
      },
      {
        h: "4. Diferencie o que realmente muda o custo",
        ul: [
          "Distância: festa a 40 km não pode custar o mesmo que a três quarteirões",
          "Horário: montagem de madrugada ou retirada tarde da noite custa mais caro",
          "Fim de semana e datas de pico: é quando a demanda existe e a capacidade é escassa",
          "Complexidade: brinquedo que precisa de dois montadores não é igual a um que precisa de um",
        ],
      },
      {
        h: "5. Reajuste com dado, não com sensação",
        p: [
          "Sem registro, você não sabe qual brinquedo se paga e qual está sustentado pelos outros. Com o histórico de locações por item, a decisão fica simples: sobe o preço do que vive ocupado, descontinua o que não sai e compra a segunda unidade do que vive lotado.",
        ],
      },
      {
        h: "Onde o FesFlow entra",
        p: [
          "O FesFlow registra cada locação por item e mostra, nos relatórios, quanto cada brinquedo faturou no período e quantas vezes saiu. É a base para você precificar olhando a sua operação — não a do vizinho.",
        ],
      },
    ],
  },
  {
    slug: "do-whatsapp-ao-contrato-assinado-locadora-de-festas",
    titulo: "Do orçamento no WhatsApp ao contrato assinado: organizando o atendimento da locadora",
    data: "2026-08-09",
    leituraMin: 5,
    resumo:
      "O caminho entre \"quanto fica?\" e a festa confirmada é onde a maioria das locadoras perde venda. Veja como fechar esse funil.",
    secoes: [
      {
        p: [
          "Toda locadora de festa vende pelo WhatsApp. O problema não é o canal — é que o WhatsApp não é um sistema. Ele não lembra quem pediu orçamento na terça, não avisa que o cliente não respondeu e não guarda qual versão da proposta foi combinada.",
        ],
      },
      {
        h: "Onde a venda escorre",
        ul: [
          "O orçamento é digitado na conversa e se perde 200 mensagens depois",
          "O cliente pergunta, some, e ninguém faz follow-up",
          "Duas pessoas da equipe respondem a mesma pessoa com valores diferentes",
          "A data é \"segurada\" de boca e some quando alguém confirma outra festa",
          "A festa é confirmada sem contrato e sem sinal",
        ],
      },
      {
        h: "O caminho que funciona",
        p: [
          "O atendimento não precisa sair do WhatsApp. Precisa de um lugar onde cada etapa fica registrada — e o WhatsApp vira só o canal de conversa, não o arquivo da empresa.",
        ],
        ul: [
          "1. Pedido chega: registre o cliente e o endereço do evento (que é diferente do endereço dele)",
          "2. Orçamento: monte olhando a disponibilidade real da data e envie um PDF, não um texto solto",
          "3. Follow-up: acompanhe as propostas em aberto — proposta sem retorno é venda parada, não venda perdida",
          "4. Confirmação: cobre o sinal e só então bloqueie a data",
          "5. Contrato: gere o documento com as cláusulas de segurança, chuva, dano e cancelamento",
          "6. Entrega e acerto: registre o valor restante recebido",
        ],
      },
      {
        h: "Por que o sinal vem antes do bloqueio",
        p: [
          "Segurar data sem sinal é o hábito que mais custa caro numa locadora. A data fica indisponível para quem pagaria, o cliente some, e você descobre na véspera. Cobrar sinal não é desconfiança — é o que separa a intenção da reserva.",
        ],
      },
      {
        h: "O contrato não é burocracia",
        p: [
          "Um termo simples protege os dois lados e passa profissionalismo. Ele responde o que acontece se chover, quem responde por dano, o que vale em caso de cancelamento e quais são as regras de segurança do uso. Quando está tudo escrito, a conversa difícil não acontece no dia da festa.",
        ],
      },
      {
        h: "Onde o FesFlow entra",
        p: [
          "No FesFlow, o orçamento é montado com a disponibilidade conferida ao vivo, vira PDF para enviar no WhatsApp, e — quando o cliente aprova — se transforma em pedido com a data bloqueada e o contrato gerado a partir dos mesmos dados. O canal continua sendo o WhatsApp; a memória da empresa passa a ser o sistema.",
        ],
      },
    ],
  },
  {
    slug: "como-organizar-agenda-locadora-de-festas",
    titulo: "Como organizar a agenda de uma locadora de festas (sem depender da memória)",
    data: "2026-08-09",
    leituraMin: 5,
    resumo:
      "Agenda de locadora não é agenda de compromisso: um item ocupa muito mais tempo do que a festa dura. Veja como montar a sua.",
    secoes: [
      {
        p: [
          "Agenda de locadora tem uma diferença que quase nenhum aplicativo de agenda entende: o compromisso não é seu, é do item. E o item fica ocupado muito antes e muito depois da festa acontecer.",
        ],
      },
      {
        h: "O erro de agendar pelo horário da festa",
        p: [
          "Uma festa das 14h às 18h parece deixar a noite livre. Não deixa. O brinquedo precisa ser transportado, montado antes, desmontado depois, transportado de volta e limpo. Na prática, aquele item saiu por volta do meio-dia e só está pronto de novo à noite.",
          "Quem agenda olhando só o horário da festa acaba prometendo o impossível — e descobre no sábado de manhã.",
        ],
      },
      {
        h: "Os quatro tempos que precisam estar na agenda",
        ul: [
          "Transporte de ida — quanto tempo até o endereço do evento",
          "Montagem — quanto a sua equipe leva para deixar pronto",
          "Desmontagem — o inverso, no fim da festa",
          "Limpeza e conferência — antes de o item poder sair de novo",
        ],
      },
      {
        h: "Uma agenda por unidade, não por modelo",
        p: [
          "Se você tem três pula-pulas iguais, eles não são \"um brinquedo\". São três recursos distintos. Controlar por modelo faz você achar que tem disponibilidade quando não tem — ou recusar festa quando ainda havia unidade livre.",
        ],
      },
      {
        h: "A agenda só funciona se for uma só",
        p: [
          "Agenda do celular de um, planilha de outro e caderno no balcão é a receita da reserva duplicada. Não porque alguém é desatento, mas porque três fontes de verdade sempre divergem. Uma agenda única, que a equipe inteira enxerga, resolve mais do que qualquer combinado.",
        ],
      },
      {
        h: "Bloqueio que não depende de disciplina",
        p: [
          "O melhor processo do mundo falha num sábado corrido. Por isso o bloqueio precisa ser do sistema, não da lembrança de quem está atendendo. Se a reserva conflita, a resposta certa é o sistema não deixar concluir.",
        ],
      },
      {
        h: "Onde o FesFlow entra",
        p: [
          "No FesFlow, cada reserva bloqueia o item por uma janela que já inclui transporte, montagem, desmontagem e limpeza — por unidade. E a garantia é feita no banco de dados: mesmo que duas pessoas tentem reservar ao mesmo tempo, o conflito é recusado. Não é validação de tela; é trava física.",
        ],
      },
    ],
  },
  {
    slug: "como-evitar-overbooking-locadora-brinquedos",
    titulo: "Como evitar o overbooking na sua locadora de brinquedos",
    data: "2026-07-01",
    leituraMin: 4,
    resumo: "Alugar o mesmo pula-pula para duas festas no mesmo dia é o pesadelo de toda locadora. Veja como acabar com isso de vez.",
    secoes: [
      { p: ["Poucos erros doem tanto quanto perceber, na sexta à noite, que você prometeu o mesmo brinquedo para duas festas no sábado. Alguém vai ficar sem — e a sua reputação vai junto."] },
      { h: "Por que o overbooking acontece", p: ["Na correria do WhatsApp, agenda de papel e planilha, é fácil confirmar uma data sem checar se o brinquedo já está comprometido. Pior: mesmo quando a festa 'cabe' no horário, você esquece que o brinquedo precisa de tempo para ser transportado, montado, desmontado e limpo entre um evento e outro."] },
      { h: "A conta que quase ninguém faz", p: ["Um pula-pula que sai às 8h para uma festa às 10h não pode estar em outra festa às 9h do outro lado da cidade. Entre a retirada de uma festa e a entrega da próxima, existe transporte e limpeza. Ignorar isso é receita para atraso e cliente insatisfeito."] },
      { h: "Como o FesFlow resolve", p: ["No FesFlow, cada reserva bloqueia o brinquedo por uma janela que já inclui transporte, montagem, desmontagem e limpeza. Quando você tenta reservar o mesmo item num período conflitante, o sistema simplesmente não deixa."], ul: ["Disponibilidade ao vivo ao montar o orçamento", "Bloqueio automático considerando os tempos de operação", "Garantia no banco de dados — nem um erro humano fura a agenda"] },
      { p: ["O resultado é simples: você para de perder festas, para de pagar a conta do erro e passa a prometer só o que consegue entregar."] },
    ],
  },
  {
    slug: "5-erros-que-fazem-locadora-perder-dinheiro",
    titulo: "5 erros que fazem a locadora de brinquedos perder dinheiro",
    data: "2026-06-24",
    leituraMin: 5,
    resumo: "Do sinal esquecido ao brinquedo parado sem manutenção: os vazamentos silenciosos que corroem o seu lucro.",
    secoes: [
      { h: "1. Esquecer de cobrar o sinal", p: ["Sem um controle claro, é comum a festa acontecer e o sinal (ou o valor restante) ficar para trás. Cada cobrança esquecida é dinheiro que sai do seu bolso."] },
      { h: "2. Não saber qual brinquedo dá lucro", p: ["Você tem certeza de qual item paga as contas e qual só dá manutenção? Sem relatório, a decisão de comprar o próximo brinquedo vira aposta."] },
      { h: "3. Brinquedo indo sujo ou quebrado para a festa", p: ["Falta de controle de limpeza e manutenção gera reclamação, devolução e, no limite, acidente. Um brinquedo bloqueado para manutenção não pode sair — e o sistema precisa saber disso."] },
      { h: "4. Perder o histórico do cliente", p: ["Cliente recorrente é ouro. Sem histórico, você não sabe quem já alugou, quanto gastou, nem quando vale a pena oferecer de novo."] },
      { h: "5. Atendimento desorganizado no WhatsApp", p: ["Orçamento que se perde na conversa, cliente que some, follow-up que não acontece. Um funil comercial simples recupera vendas que hoje escorrem pelo ralo."] },
      { p: ["A boa notícia: todos esses vazamentos se resolvem com organização. É exatamente para isso que o FesFlow existe."] },
    ],
  },
  {
    slug: "contrato-locacao-brinquedos-clausulas-essenciais",
    titulo: "Contrato de locação de brinquedos: as cláusulas essenciais",
    data: "2026-06-15",
    leituraMin: 4,
    resumo: "Um bom contrato protege a sua locadora e profissionaliza o atendimento. Veja o que não pode faltar.",
    secoes: [
      { p: ["Trabalhar sem contrato é apostar que nada vai dar errado — e, quando dá, é a sua locadora que paga. Um termo simples e claro protege os dois lados e passa profissionalismo."] },
      { h: "O que todo contrato precisa ter", ul: ["Dados da empresa e do cliente", "Data, horário e endereço do evento", "Brinquedos alugados e valores (sinal e restante)", "Responsabilidade pelo uso correto e supervisão", "Regras de segurança e proibições (objetos cortantes, excesso de crianças)", "O que acontece em caso de chuva", "Cancelamento, reagendamento e multa por atraso", "Responsabilidade por danos ao equipamento"] },
      { h: "Gere em segundos", p: ["No FesFlow, o contrato é gerado automaticamente a partir do pedido, já com as cláusulas de segurança e a área de assinatura. Você economiza tempo e nunca mais esquece uma cláusula importante."] },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}
