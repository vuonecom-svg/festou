// Nichos de negócio atendidos pelo FesFlow (locação e serviços de festa).
// Uma única fonte de verdade — usada no site (cards), no onboarding (opções)
// e no painel (personalização por ramo).

export type NichoKey = "brinquedos" | "espacos" | "buffet" | "pegmonte" | "decoracao" | "outro";

export type Nicho = {
  key: NichoKey;
  label: string;        // nome curto (menu/onboarding)
  titulo: string;       // título do card no site
  desc: string;         // descrição do card
  icon: string;         // nome do ícone lucide-react
  cor: { bg: string; text: string }; // classes tailwind
  termoItem: string;    // como chamar o "item do catálogo" nesse ramo (plural)
  foco: string;         // frase de valor para esse ramo
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
  },
  {
    key: "pegmonte",
    label: "Peg-monte de doces & salgados",
    titulo: "Peg-monte de doces & salgados",
    desc: "Mesa de guloseimas, doces, salgados e tortas por encomenda para festas.",
    icon: "Candy",
    cor: { bg: "bg-fuchsia-100", text: "text-fuchsia-600" },
    termoItem: "kits",
    foco: "Pedidos por data de entrega, kits, agenda de produção e recebimentos.",
  },
  {
    key: "decoracao",
    label: "Decoração de festas",
    titulo: "Decoração de festas",
    desc: "Painéis, balões, temas, mobiliário e cenografia para aluguel e montagem.",
    icon: "Sparkles",
    cor: { bg: "bg-cyan-100", text: "text-cyan-600" },
    termoItem: "kits",
    foco: "Agenda de montagem/retirada, orçamento por tema e contrato automático.",
  },
];

export function getNicho(key: string | null | undefined): Nicho | undefined {
  if (!key) return undefined;
  return NICHOS.find((n) => n.key === key);
}

// Opções do onboarding (nichos + "Outro").
export const NICHO_OPCOES: { key: NichoKey; label: string; icon: string }[] = [
  ...NICHOS.map((n) => ({ key: n.key, label: n.label, icon: n.icon })),
  { key: "outro", label: "Outro tipo de festa/evento", icon: "PartyPopper" },
];
