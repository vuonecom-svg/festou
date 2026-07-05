"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createBrinquedo,
  updateBrinquedo,
  deleteBrinquedo,
  setBrinquedoStatus,
  type BrinquedoInput,
  type BrinquedoStatus,
} from "@/lib/data/brinquedos";

// ── helpers de parsing do FormData ──────────────────────────
function str(fd: FormData, key: string) {
  return (fd.get(key) as string | null)?.trim() ?? "";
}
function num(fd: FormData, key: string): number {
  const v = str(fd, key);
  const n = Number(v.replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}
function numOrNull(fd: FormData, key: string): number | null {
  const v = str(fd, key);
  if (v === "") return null;
  const n = Number(v.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}
function bool(fd: FormData, key: string) {
  return fd.get(key) != null;
}

function parse(fd: FormData): BrinquedoInput {
  return {
    nome: str(fd, "nome"),
    codigoInterno: str(fd, "codigoInterno"),
    categoriaNome: str(fd, "categoriaNome"),
    descricao: str(fd, "descricao"),
    fotoUrl: str(fd, "fotoUrl"),
    medidas: str(fd, "medidas"),
    pesoKg: numOrNull(fd, "pesoKg"),
    capacidadeCriancas: numOrNull(fd, "capacidadeCriancas"),
    idadeMin: numOrNull(fd, "idadeMin"),
    idadeMax: numOrNull(fd, "idadeMax"),
    valorDiaria: num(fd, "valorDiaria"),
    valorPeriodo: numOrNull(fd, "valorPeriodo"),
    valorHoraExtra: numOrNull(fd, "valorHoraExtra"),
    valorPromocional: numOrNull(fd, "valorPromocional"),
    status: (str(fd, "status") || "disponivel") as BrinquedoStatus,
    precisaEnergia: bool(fd, "precisaEnergia"),
    precisaAgua: bool(fd, "precisaAgua"),
    qtdMotores: num(fd, "qtdMotores"),
    pisoIrregular: bool(fd, "pisoIrregular"),
    localAberto: bool(fd, "localAberto"),
    localCoberto: bool(fd, "localCoberto"),
    tempoMontagemMin: num(fd, "tempoMontagemMin"),
    tempoDesmontagemMin: num(fd, "tempoDesmontagemMin"),
    tempoLimpezaMin: num(fd, "tempoLimpezaMin"),
    custoManutMedio: numOrNull(fd, "custoManutMedio"),
    obsInternas: str(fd, "obsInternas"),
    ativo: !bool(fd, "inativo"),
  };
}

export async function createBrinquedoAction(fd: FormData) {
  await createBrinquedo(parse(fd));
  revalidatePath("/brinquedos");
  redirect("/brinquedos");
}

export async function updateBrinquedoAction(id: string, fd: FormData) {
  await updateBrinquedo(id, parse(fd));
  revalidatePath("/brinquedos");
  revalidatePath(`/brinquedos/${id}`);
  redirect("/brinquedos");
}

export async function deleteBrinquedoAction(id: string) {
  await deleteBrinquedo(id);
  revalidatePath("/brinquedos");
  redirect("/brinquedos");
}

export async function setStatusAction(id: string, status: BrinquedoStatus) {
  await setBrinquedoStatus(id, status);
  revalidatePath("/brinquedos");
  revalidatePath(`/brinquedos/${id}`);
}
