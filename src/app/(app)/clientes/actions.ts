"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  createCliente,
  updateCliente,
  deleteCliente,
  type ClienteInput,
  type ClienteTag,
  CLIENTE_TAGS,
} from "@/lib/data/clientes";

function str(fd: FormData, key: string) {
  return (fd.get(key) as string | null)?.trim() ?? "";
}
function numOrNull(fd: FormData, key: string): number | null {
  const v = str(fd, key);
  if (v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function parse(fd: FormData): ClienteInput {
  const tagsValidas = Object.keys(CLIENTE_TAGS) as ClienteTag[];
  const tags = (fd.getAll("tags") as string[]).filter((t): t is ClienteTag =>
    tagsValidas.includes(t as ClienteTag)
  );
  return {
    nome: str(fd, "nome"),
    doc: str(fd, "doc"),
    telefone: str(fd, "telefone"),
    whatsapp: str(fd, "whatsapp"),
    email: str(fd, "email"),
    nascimento: str(fd, "nascimento"),
    avaliacao: numOrNull(fd, "avaliacao"),
    obs: str(fd, "obs"),
    rua: str(fd, "rua"),
    numero: str(fd, "numero"),
    bairro: str(fd, "bairro"),
    cidade: str(fd, "cidade"),
    cep: str(fd, "cep"),
    complemento: str(fd, "complemento"),
    tags,
  };
}

export async function createClienteAction(fd: FormData) {
  await createCliente(parse(fd));
  revalidatePath("/clientes");
  redirect("/clientes");
}

export async function updateClienteAction(id: string, fd: FormData) {
  await updateCliente(id, parse(fd));
  revalidatePath("/clientes");
  revalidatePath(`/clientes/${id}`);
  redirect("/clientes");
}

export async function deleteClienteAction(id: string) {
  await deleteCliente(id);
  revalidatePath("/clientes");
  redirect("/clientes");
}
