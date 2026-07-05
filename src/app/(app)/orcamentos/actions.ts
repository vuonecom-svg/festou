"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createOrcamento,
  setOrcamentoStatus,
  deleteOrcamento,
  converterEmPedido,
  type OrcamentoInput,
  type OrcStatus,
} from "@/lib/data/orcamentos";

function n(v: unknown): number {
  const x = Number(v);
  return Number.isFinite(x) ? x : 0;
}

export async function criarOrcamentoAction(fd: FormData) {
  const raw = fd.get("payload");
  if (typeof raw !== "string") throw new Error("Payload ausente.");
  const p = JSON.parse(raw);

  const input: OrcamentoInput = {
    clienteId: String(p.clienteId ?? ""),
    dataEvento: String(p.dataEvento ?? ""),
    horaEntrega: String(p.horaEntrega ?? ""),
    horaRetirada: String(p.horaRetirada ?? ""),
    endereco: {
      nomeLocal: String(p.endereco?.nomeLocal ?? ""),
      tipoLocal: String(p.endereco?.tipoLocal ?? ""),
      rua: String(p.endereco?.rua ?? ""),
      numero: String(p.endereco?.numero ?? ""),
      bairro: String(p.endereco?.bairro ?? ""),
      cidade: String(p.endereco?.cidade ?? ""),
      complemento: String(p.endereco?.complemento ?? ""),
      referencia: String(p.endereco?.referencia ?? ""),
    },
    itens: Array.isArray(p.itens)
      ? p.itens.map((i: Record<string, unknown>) => ({
          brinquedoId: String(i.brinquedoId ?? ""),
          qtd: Math.max(1, n(i.qtd)),
          valorUnit: i.valorUnit != null ? n(i.valorUnit) : undefined,
        }))
      : [],
    desconto: n(p.desconto),
    motivoDesconto: String(p.motivoDesconto ?? ""),
    taxaEntrega: n(p.taxaEntrega),
    taxaMontagem: n(p.taxaMontagem),
    valorSinal: n(p.valorSinal),
    formaPagamento: String(p.formaPagamento ?? ""),
    obs: String(p.obs ?? ""),
  };

  if (!input.clienteId) throw new Error("Selecione um cliente.");
  if (input.itens.length === 0) throw new Error("Adicione ao menos um brinquedo.");

  const orc = await createOrcamento(input);
  revalidatePath("/orcamentos");
  redirect(`/orcamentos/${orc.id}`);
}

export async function setOrcamentoStatusAction(id: string, status: OrcStatus) {
  await setOrcamentoStatus(id, status);
  revalidatePath("/orcamentos");
  revalidatePath(`/orcamentos/${id}`);
}

export async function deleteOrcamentoAction(id: string) {
  await deleteOrcamento(id);
  revalidatePath("/orcamentos");
  redirect("/orcamentos");
}

export async function converterAction(id: string) {
  let pedidoId: string | null = null;
  let erro: string | null = null;
  try {
    const pedido = await converterEmPedido(id);
    pedidoId = pedido.id;
  } catch (e) {
    erro = e instanceof Error ? e.message : "Falha ao converter.";
  }
  if (pedidoId) {
    revalidatePath("/orcamentos");
    revalidatePath("/pedidos");
    redirect(`/pedidos/${pedidoId}`);
  }
  redirect(`/orcamentos/${id}?erro=${encodeURIComponent(erro ?? "Falha")}`);
}
