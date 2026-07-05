// Constantes/tipos de Cliente seguros para o cliente (browser).
// NÃO importa Prisma — pode ser usado por Client Components.

export type ClienteTag =
  | "recorrente"
  | "escola"
  | "condominio"
  | "empresa"
  | "particular";

export const CLIENTE_TAGS: Record<ClienteTag, { label: string; badge: string }> = {
  recorrente: { label: "Recorrente", badge: "bg-emerald-100 text-emerald-700" },
  escola: { label: "Escola", badge: "bg-sky-100 text-sky-700" },
  condominio: { label: "Condomínio", badge: "bg-indigo-100 text-indigo-700" },
  empresa: { label: "Empresa", badge: "bg-amber-100 text-amber-700" },
  particular: { label: "Particular", badge: "bg-slate-100 text-slate-600" },
};

export const TAGS_VALIDAS = Object.keys(CLIENTE_TAGS) as ClienteTag[];
