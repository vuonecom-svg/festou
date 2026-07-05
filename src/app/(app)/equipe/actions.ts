"use server";

import { revalidatePath } from "next/cache";
import {
  createFuncionario, deleteFuncionario, createVeiculo, deleteVeiculo,
  FUNCAO, type FuncionarioFuncao,
} from "@/lib/data/equipe";

export async function createFuncionarioAction(fd: FormData) {
  const nome = String(fd.get("nome") ?? "").trim();
  const funcao = String(fd.get("funcao") ?? "ajudante") as FuncionarioFuncao;
  const telefone = String(fd.get("telefone") ?? "").trim();
  if (nome && funcao in FUNCAO) await createFuncionario({ nome, funcao, telefone });
  revalidatePath("/equipe");
}

export async function deleteFuncionarioAction(id: string) {
  await deleteFuncionario(id);
  revalidatePath("/equipe");
}

export async function createVeiculoAction(fd: FormData) {
  await createVeiculo({
    placa: String(fd.get("placa") ?? "").trim(),
    modelo: String(fd.get("modelo") ?? "").trim(),
    capacidade: String(fd.get("capacidade") ?? "").trim(),
  });
  revalidatePath("/equipe");
}

export async function deleteVeiculoAction(id: string) {
  await deleteVeiculo(id);
  revalidatePath("/equipe");
}
