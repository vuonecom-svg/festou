// Nichos de negócio atendidos pelo FesFlow (locação e serviços de festa).
// Uma única fonte de verdade — usada no site (cards), no onboarding (opções)
// e no painel (linguagem + dores por ramo).

export type NichoKey = "brinquedos" | "espacos" | "buffet" | "pegmonte" | "decoracao" | "doces" | "outro";

// Vocabulário que adapta o painel ao ramo (menu, títulos, botões, stats).
export type Termos = {
  itens: string;        // rótulo do catálogo no menu (plural) ex.: "Espaços"
  item: string;         // singular minúsculo ex.: "espaço"
  novo: string;         // botão de cadastro ex.: "Novo espaço"
  pedidos: string;      // rótulo de "Locações/Pedidos" no menu ex.: "Reservas"
  disponiveis: string;  // stat de disponíveis no dashboard
  subtitulo: string;    // subtítulo do menu lateral
  contratoTitulo: string;   // título do PDF de contrato
  exemploNome: string;      // placeholder do nome no cadastro
  exemploCategoria: string; // placeholder da categoria no cadastro
  inflavel: boolean;        // inclui cláusulas específicas de infláveis no contrato?
};

export type Nicho = {
  key: NichoKey;
  label: string;        // nome curto (menu/onboarding)
  titulo: string;       // título do card no site
  desc: string;         // descrição do card
  icon: string;         // nome do ícone lucide-react
  cor: { bg: string; text: string }; // classes tailwind
  termoItem: string;    // (legado) como chamar o item do catálogo
  foco: string;         // frase de valor para esse ramo
  termos: Termos;       // vocabulário do painel
  dores: string[];      // 3 dores específicas do ramo (diferencial)
};

// Vocabulário padrão (ramo "outro" ou não definido).
export const TERMOS_PADRAO: Termos = {
  itens: "Itens", item: "item", novo: "Novo item",
  pedidos: "Pedidos", disponiveis: "Itens disponíveis", subtitulo: "Locações de festa",
  contratoTitulo: "CONTRATO DE LOCAÇÃO", exemploNome: "Ex.: nome do item", exemploCategoria: "Categoria", inflavel: false,
};

export const NICHOS: Nicho[] = [
  {
    key: "brinquedos",
    label: "Locação de brinquedos",
    titulo: "Locação de brinquedos",
    desc: "Pula-pula, infláveis, cama elástica, tobogã, piscina de bolinha, mesas e cadeiras.",
    icon: "Tent",
    cor: { bg: "bg-teal-100", text: "text-teal-600" },
    termoItem: "brinquedos",
    foco: "Agenda anti-overbooking por unidade, com transporte e limpeza no cálculo.",
    termos: { itens: "Brinquedos", item: "brinquedo", novo: "Novo brinquedo", pedidos: "Locações", disponiveis: "Brinquedos disponíveis", subtitulo: "Locação de brinquedos", contratoTitulo: "CONTRATO DE LOCAÇÃO DE BRINQUEDOS", exemploNome: "Ex.: Pula-pula Castelo 3x3", exemploCategoria: "Infláveis", inflavel: true },
    dores: [
      "Alugar o mesmo brinquedo para duas festas no mesmo dia",
      "Esquecer o tempo de transporte e limpeza entre um evento e outro",
      "Não saber qual brinquedo realmente dá lucro",
    ],
  },
  {
    key: "espacos",
    label: "Espaços & salões",
    titulo: "Espaços & salões de festa",
    desc: "Salão de festas, buffet infantil, chácara e áreas de evento para alugar por data.",
    icon: "Building2",
    cor: { bg: "bg-indigo-100", text: "text-indigo-600" },
    termoItem: "espaços",
    foco: "Agenda por data e turno, contrato e controle de sinal — sem reserva dupla.",
    termos: { itens: "Espaços", item: "espaço", novo: "Novo espaço", pedidos: "Reservas", disponiveis: "Espaços disponíveis", subtitulo: "Espaços & salões", contratoTitulo: "CONTRATO DE LOCAÇÃO DE ESPAÇO PARA EVENTOS", exemploNome: "Ex.: Salão Principal (150 pessoas)", exemploCategoria: "Salão", inflavel: false },
    dores: [
      "Reservar o mesmo salão para dois eventos na mesma data",
      "Perder o controle do sinal e do saldo de cada reserva",
      "Agenda de datas e turnos bagunçada no caderno",
    ],
  },
  {
    key: "buffet",
    label: "Buffet & gastronomia",
    titulo: "Buffet & gastronomia",
    desc: "Buffet completo, finger food, ilhas gastronômicas e equipe para eventos.",
    icon: "UtensilsCrossed",
    cor: { bg: "bg-amber-100", text: "text-amber-600" },
    termoItem: "pacotes",
    foco: "Orçamento por convidado, pacotes, contrato e financeiro do evento.",
    termos: { itens: "Pacotes", item: "pacote", novo: "Novo pacote", pedidos: "Eventos", disponiveis: "Pacotes ativos", subtitulo: "Buffet & gastronomia", contratoTitulo: "CONTRATO DE PRESTAÇÃO DE SERVIÇO DE BUFFET", exemploNome: "Ex.: Pacote Festa 100 convidados", exemploCategoria: "Pacotes", inflavel: false },
    dores: [
      "Orçamento por convidado feito na mão, com erro de conta",
      "Não saber quantos eventos cabem na mesma data e equipe",
      "Recebimentos e saldo de cada evento sem controle",
    ],
  },
  {
    key: "pegmonte",
    label: "Pegue e monte (decoração)",
    titulo: "Pegue e monte",
    desc: "Kits de decoração prontos para o cliente retirar, montar a própria festa e devolver.",
    icon: "PackageOpen",
    cor: { bg: "bg-fuchsia-100", text: "text-fuchsia-600" },
    termoItem: "kits",
    foco: "Kits por data de retirada e devolução, com contrato e controle de caução.",
    termos: { itens: "Kits", item: "kit", novo: "Novo kit", pedidos: "Locações", disponiveis: "Kits disponíveis", subtitulo: "Pegue e monte", contratoTitulo: "CONTRATO DE LOCAÇÃO — PEGUE E MONTE", exemploNome: "Ex.: Kit Painel Redondo + balões", exemploCategoria: "Kits", inflavel: false },
    dores: [
      "Locar o mesmo kit de decoração para duas festas no mesmo dia",
      "Perder o controle da caução e do que saiu e voltou",
      "Datas de retirada e devolução se atropelando",
    ],
  },
  {
    key: "decoracao",
    label: "Decoração de festas",
    titulo: "Decoração de festas (montagem)",
    desc: "Painéis, balões, temas, mobiliário e cenografia — sua equipe monta e desmonta.",
    icon: "Sparkles",
    cor: { bg: "bg-cyan-100", text: "text-cyan-600" },
    termoItem: "kits",
    foco: "Agenda de montagem/retirada, orçamento por tema e contrato automático.",
    termos: { itens: "Kits de decoração", item: "kit", novo: "Novo kit", pedidos: "Eventos", disponiveis: "Kits disponíveis", subtitulo: "Decoração de festas", contratoTitulo: "CONTRATO DE LOCAÇÃO E MONTAGEM DE DECORAÇÃO", exemploNome: "Ex.: Decoração Tema Safari", exemploCategoria: "Temas", inflavel: false },
    dores: [
      "Montagem e retirada da equipe sem uma agenda clara",
      "Orçar o tema na mão e esquecer itens no fechamento",
      "Contrato e responsabilidade por danos sem padrão",
    ],
  },
  {
    key: "doces",
    label: "Doces & salgados",
    titulo: "Doces & salgados",
    desc: "Mesa de doces, bolos, docinhos e salgados por encomenda para festas e eventos.",
    icon: "Candy",
    cor: { bg: "bg-rose-100", text: "text-rose-600" },
    termoItem: "encomendas",
    foco: "Pedidos por data de entrega, agenda de produção e recebimentos no controle.",
    termos: { itens: "Cardápio", item: "item", novo: "Novo item", pedidos: "Encomendas", disponiveis: "Itens no cardápio", subtitulo: "Doces & salgados", contratoTitulo: "CONTRATO DE ENCOMENDA DE DOCES E SALGADOS", exemploNome: "Ex.: 100 brigadeiros gourmet", exemploCategoria: "Doces", inflavel: false },
    dores: [
      "Encomendas se acumulando na mesma data de entrega",
      "Produção sem agenda — vira correria e atraso",
      "Sinal e recebimento das encomendas sem controle",
    ],
  },
];

export function getNicho(key: string | null | undefined): Nicho | undefined {
  if (!key) return undefined;
  return NICHOS.find((n) => n.key === key);
}

// Capitaliza a primeira letra (para rótulos no singular: "espaço" -> "Espaço").
export function cap(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

// Vocabulário do ramo (com fallback padrão para "outro"/não definido).
export function termosDo(nicho: Nicho | undefined): Termos {
  return nicho?.termos ?? TERMOS_PADRAO;
}

// Opções do onboarding (nichos + "Outro").
export const NICHO_OPCOES: { key: NichoKey; label: string; icon: string }[] = [
  ...NICHOS.map((n) => ({ key: n.key, label: n.label, icon: n.icon })),
  { key: "outro", label: "Outro tipo de festa/evento", icon: "PartyPopper" },
];
