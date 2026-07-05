"use server";

import { revalidatePath } from "next/cache";
import {
  registrarPagamento,
  avancarStatusOperacional,
  type PedidoStatusOp,
} from "@/lib/data/pedidos";

export async function registrarPagamentoAction(id: string, fd: FormData) {
  const valor = Number(String(fd.get("valor") ?? "").replace(",", "."));
  if (Number.isFinite(valor) && valor > 0) {
    await registrarPagamento(id, valor);
  }
  revalidatePath(`/pedidos/${id}`);
  revalidatePath("/pedidos");
}

export async function avancarStatusAction(id: string, status: PedidoStatusOp) {
  await avancarStatusOperacional(id, status);
  revalidatePath(`/pedidos/${id}`);
}
