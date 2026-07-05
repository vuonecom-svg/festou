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

// Pagamentos via Kiwify. Substitua "/dashboard" pelos links de checkout de
// cada ciclo quando os produtos estiverem criados na Kiwify.
export const KIWIFY = {
  mensal: "/dashboard", // TODO: colar link do checkout Kiwify (plano mensal R$44,90)
  semestral: "/dashboard", // TODO: link do checkout Kiwify (semestral R$239,40)
  anual: "/dashboard", // TODO: link do checkout Kiwify (anual R$358,80)
};

// Plano único "Festou Completo" com 3 ciclos de cobrança.
export const BILLING: {
  ciclo: string; precoMes: string; total: string | null; economia: string | null;
  destaque: boolean; link: string; obs: string;
}[] = [
  { ciclo: "Mensal", precoMes: "44,90", total: null, economia: null, destaque: false, link: KIWIFY.mensal, obs: "cobrança mensal recorrente" },
  { ciclo: "Semestral", precoMes: "39,90", total: "239,40", economia: "~11%", destaque: false, link: KIWIFY.semestral, obs: "6 meses em uma parcela" },
  { ciclo: "Anual", precoMes: "29,90", total: "358,80", economia: "~33%", destaque: true, link: KIWIFY.anual, obs: "12 meses em uma parcela" },
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
  { q: "O Festou serve para a minha locadora de brinquedos?", a: "Sim. O Festou foi feito sob medida para locadoras de pula-pula, infláveis, cama elástica, piscina de bolinha, tobogã, mesas, cadeiras, tendas e itens de festa. Se você aluga brinquedos para festas e eventos, ele foi feito para você." },
  { q: "Como o sistema impede alugar o mesmo brinquedo duas vezes?", a: "Cada reserva bloqueia o brinquedo por uma janela que inclui o tempo de transporte, montagem, desmontagem e limpeza. Se você tentar reservar o mesmo item num período que conflita, o sistema bloqueia automaticamente — a garantia é feita no banco de dados, então nem por engano acontece." },
  { q: "Preciso instalar alguma coisa?", a: "Não. O Festou funciona 100% no navegador, pelo computador, tablet ou celular. Você acessa de qualquer lugar, inclusive a equipe na rua." },
  { q: "Consigo gerar contrato e orçamento em PDF?", a: "Sim. Com um clique você gera o orçamento e o contrato de locação em PDF, prontos para enviar ao cliente pelo WhatsApp ou e-mail." },
  { q: "Tem controle financeiro?", a: "Tem. Você controla o sinal, o valor restante, contas a receber e vê o faturamento do mês, além de relatórios de qual brinquedo dá mais lucro." },
  { q: "Meus dados ficam separados de outras empresas?", a: "Sim. O Festou é multiempresa: cada locadora tem seu próprio ambiente isolado, com seus clientes, brinquedos, agenda e financeiro. Uma empresa nunca vê os dados da outra." },
  { q: "Como funciona o teste grátis?", a: "Você tem 30 dias grátis para usar tudo. No cadastro você informa um cartão de crédito, mas nada é cobrado no primeiro mês. Depois dos 30 dias, o plano escolhido é cobrado automaticamente pela Kiwify — no anual e no semestral em parcela única, e no mensal de forma recorrente. Você pode cancelar quando quiser." },
  { q: "Quais as formas de pagamento?", a: "Os pagamentos são processados com segurança pela Kiwify, que aceita cartão de crédito. Você escolhe o ciclo (mensal, semestral ou anual) e a cobrança acontece após o período gratuito de 30 dias." },
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
    slug: "como-evitar-overbooking-locadora-brinquedos",
    titulo: "Como evitar o overbooking na sua locadora de brinquedos",
    data: "2026-07-01",
    leituraMin: 4,
    resumo: "Alugar o mesmo pula-pula para duas festas no mesmo dia é o pesadelo de toda locadora. Veja como acabar com isso de vez.",
    secoes: [
      { p: ["Poucos erros doem tanto quanto perceber, na sexta à noite, que você prometeu o mesmo brinquedo para duas festas no sábado. Alguém vai ficar sem — e a sua reputação vai junto."] },
      { h: "Por que o overbooking acontece", p: ["Na correria do WhatsApp, agenda de papel e planilha, é fácil confirmar uma data sem checar se o brinquedo já está comprometido. Pior: mesmo quando a festa 'cabe' no horário, você esquece que o brinquedo precisa de tempo para ser transportado, montado, desmontado e limpo entre um evento e outro."] },
      { h: "A conta que quase ninguém faz", p: ["Um pula-pula que sai às 8h para uma festa às 10h não pode estar em outra festa às 9h do outro lado da cidade. Entre a retirada de uma festa e a entrega da próxima, existe transporte e limpeza. Ignorar isso é receita para atraso e cliente insatisfeito."] },
      { h: "Como o Festou resolve", p: ["No Festou, cada reserva bloqueia o brinquedo por uma janela que já inclui transporte, montagem, desmontagem e limpeza. Quando você tenta reservar o mesmo item num período conflitante, o sistema simplesmente não deixa."], ul: ["Disponibilidade ao vivo ao montar o orçamento", "Bloqueio automático considerando os tempos de operação", "Garantia no banco de dados — nem um erro humano fura a agenda"] },
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
      { p: ["A boa notícia: todos esses vazamentos se resolvem com organização. É exatamente para isso que o Festou existe."] },
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
      { h: "Gere em segundos", p: ["No Festou, o contrato é gerado automaticamente a partir do pedido, já com as cláusulas de segurança e a área de assinatura. Você economiza tempo e nunca mais esquece uma cláusula importante."] },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}
