// Rótulos e cores por status — usados na agenda, pedidos e brinquedos.
// As classes usam tokens Tailwind (badge com bg/texto suaves).

export const BRINQUEDO_STATUS: Record<string, { label: string; badge: string }> = {
  disponivel: { label: "Disponível", badge: "bg-emerald-100 text-emerald-700" },
  alugado: { label: "Alugado", badge: "bg-blue-100 text-blue-700" },
  manutencao: { label: "Em manutenção", badge: "bg-amber-100 text-amber-700" },
  limpeza: { label: "Em limpeza", badge: "bg-violet-100 text-violet-700" },
  inativo: { label: "Inativo", badge: "bg-slate-200 text-slate-600" },
};

export const ORCAMENTO_STATUS: Record<string, { label: string; badge: string }> = {
  novo: { label: "Novo", badge: "bg-slate-100 text-slate-700" },
  enviado: { label: "Enviado", badge: "bg-sky-100 text-sky-700" },
  visualizado: { label: "Visualizado", badge: "bg-indigo-100 text-indigo-700" },
  aguardando_resposta: { label: "Aguardando resposta", badge: "bg-amber-100 text-amber-700" },
  aguardando_sinal: { label: "Aguardando sinal", badge: "bg-orange-100 text-orange-700" },
  aprovado: { label: "Aprovado", badge: "bg-emerald-100 text-emerald-700" },
  recusado: { label: "Recusado", badge: "bg-rose-100 text-rose-700" },
  expirado: { label: "Expirado", badge: "bg-slate-200 text-slate-600" },
  cancelado: { label: "Cancelado", badge: "bg-rose-100 text-rose-700" },
};

// Status operacional do pedido (fluxo da rua).
export const PEDIDO_OP_STATUS: Record<string, { label: string; badge: string }> = {
  aguardando_separacao: { label: "Aguardando separação", badge: "bg-slate-100 text-slate-700" },
  separado: { label: "Separado", badge: "bg-sky-100 text-sky-700" },
  carregado: { label: "Carregado", badge: "bg-sky-100 text-sky-700" },
  saiu_entrega: { label: "Saiu para entrega", badge: "bg-indigo-100 text-indigo-700" },
  chegou_local: { label: "Chegou ao local", badge: "bg-indigo-100 text-indigo-700" },
  em_montagem: { label: "Em montagem", badge: "bg-amber-100 text-amber-700" },
  montado: { label: "Montado", badge: "bg-teal-100 text-teal-700" },
  em_evento: { label: "Em evento", badge: "bg-blue-100 text-blue-700" },
  em_retirada: { label: "Em retirada", badge: "bg-amber-100 text-amber-700" },
  retirado: { label: "Retirado", badge: "bg-violet-100 text-violet-700" },
  retornou_base: { label: "Retornou à base", badge: "bg-violet-100 text-violet-700" },
  finalizado: { label: "Finalizado", badge: "bg-emerald-100 text-emerald-700" },
  cancelado: { label: "Cancelado", badge: "bg-rose-100 text-rose-700" },
  reagendado: { label: "Reagendado", badge: "bg-orange-100 text-orange-700" },
};

export const PEDIDO_FIN_STATUS: Record<string, { label: string; badge: string }> = {
  aguardando_sinal: { label: "Aguardando sinal", badge: "bg-orange-100 text-orange-700" },
  sinal_pago: { label: "Sinal pago", badge: "bg-sky-100 text-sky-700" },
  quitado: { label: "Quitado", badge: "bg-emerald-100 text-emerald-700" },
  reembolsado: { label: "Reembolsado", badge: "bg-slate-200 text-slate-600" },
};
