import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBRL(value: number | string) {
  const n = typeof value === "string" ? Number(value) : value;
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number.isFinite(n) ? n : 0);
}

// Um Date inválido (ex.: ano 20206 por erro de digitação) quebra .toISOString()
// e derruba a página inteira. Estes helpers blindam entrada e saída de datas.
const ANO_MIN = 1990;
const ANO_MAX = 2100;

function dataValida(d: Date | null | undefined): boolean {
  if (!d || Number.isNaN(d.getTime())) return false;
  const ano = d.getUTCFullYear();
  return ano >= ANO_MIN && ano <= ANO_MAX;
}

// Saída segura "yyyy-mm-dd" — nunca lança; datas inválidas viram fallback.
export function diaISO(d: Date | null | undefined, fallback = "2000-01-01"): string {
  return dataValida(d) ? d!.toISOString().slice(0, 10) : fallback;
}

// Saída segura ISO completa — nunca lança.
export function dtISO(d: Date | null | undefined, fallback = "2000-01-01T00:00:00.000Z"): string {
  return dataValida(d) ? d!.toISOString() : fallback;
}

// Entrada segura: string do formulário -> Date válido (ou hoje, se absurda/vazia).
// Impede que um ano digitado errado (ex.: 20206) seja gravado no banco.
export function parseDataEntrada(input: string | null | undefined): Date {
  if (input) {
    const d = new Date(input);
    if (dataValida(d)) return d;
  }
  return new Date();
}
