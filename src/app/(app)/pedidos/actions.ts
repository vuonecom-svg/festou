"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  registrarPagamento,
  avancarStatusOperacional,
  deletePedido,
  reagendarPedido,
  type PedidoStatusOp,
} from "@/lib/data/pedidos";
import { podeGerir } from "@/lib/rbac";

export async function registrarPagamentoAction(id: string, fd: FormData) {
  const valor = Number(String(fd.get("valor") ?? "").replace(",", "."));
  const forma = String(fd.get("forma") ?? "dinheiro");
  if (Number.isFinite(valor) && valor > 0) {
    await registrarPagamento(id, valor, forma);
  }
  revalidatePath(`/pedidos/${id}`);
  revalidatePath("/pedidos");
  revalidatePath("/financeiro");
}

export async function avancarStatusAction(id: string, status: PedidoStatusOp) {
  await avancarStatusOperacional(id, status);
  revalidatePath(`/pedidos/${id}`);
}

export async function excluirPedidoAction(id: string) {
  if (!(await podeGerir())) {
    redirect(`/pedidos/${id}?erro=${encodeURIComponent("Sem permissão para excluir (apenas admin/gerente).")}`);
  }
  await deletePedido(id);
  revalidatePath("/pedidos");
  revalidatePath("/agenda");
  revalidatePath("/dashboard");
  redirect("/pedidos");
}

export async function reagendarPedidoAction(id: string, fd: FormData) {
  const dataEvento = String(fd.get("dataEvento") ?? "");
  const horaEntrega = String(fd.get("horaEntrega") ?? "");
  const horaRetirada = String(fd.get("horaRetirada") ?? "");
  const r = await reagendarPedido(id, dataEvento, horaEntrega, horaRetirada);
  revalidatePath(`/pedidos/${id}`);
  revalidatePath("/pedidos");
  revalidatePath("/agenda");
  if (!r.ok) redirect(`/pedidos/${id}?erro=${encodeURIComponent(r.erro ?? "Falha ao remarcar")}`);
  redirect(`/pedidos/${id}?ok=1`);
}
