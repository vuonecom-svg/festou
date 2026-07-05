import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Trash2, CalendarCheck, Wallet } from "lucide-react";
import { ClienteForm } from "@/components/cliente-form";
import { Badge } from "@/components/ui/badge";
import { CLIENTE_TAGS, getCliente } from "@/lib/data/clientes";
import { formatBRL } from "@/lib/utils";
import { updateClienteAction, deleteClienteAction } from "../actions";

export default async function EditarClientePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cliente = await getCliente(id);
  if (!cliente) notFound();

  const update = updateClienteAction.bind(null, id);
  const remove = deleteClienteAction.bind(null, id);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link href="/clientes" className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground">
            <ChevronLeft size={16} /> Clientes
          </Link>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <h1 className="text-xl font-semibold">{cliente.nome}</h1>
            {cliente.tags.map((t) => (
              <Badge key={t} className={CLIENTE_TAGS[t].badge}>
                {CLIENTE_TAGS[t].label}
              </Badge>
            ))}
          </div>
          {cliente.doc && <p className="text-sm text-muted">{cliente.doc}</p>}
        </div>

        <form action={remove}>
          <button className="inline-flex items-center gap-2 rounded-lg text-sm font-medium h-10 px-4 border border-rose-200 text-rose-600 hover:bg-rose-50">
            <Trash2 size={16} /> Excluir
          </button>
        </form>
      </div>

      {/* Resumo do cliente */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="card p-4 flex items-center gap-3">
          <span className="grid place-items-center h-10 w-10 rounded-lg bg-sky-100 text-sky-700">
            <CalendarCheck size={20} />
          </span>
          <div>
            <p className="text-xs text-muted">Eventos realizados</p>
            <p className="text-xl font-semibold">{cliente.qtdEventos}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-3">
          <span className="grid place-items-center h-10 w-10 rounded-lg bg-emerald-100 text-emerald-700">
            <Wallet size={20} />
          </span>
          <div>
            <p className="text-xs text-muted">Total gasto</p>
            <p className="text-xl font-semibold">{formatBRL(cliente.totalGasto)}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center justify-center text-center text-sm text-muted">
          Histórico de locações aparece aqui quando o módulo de Pedidos estiver ligado.
        </div>
      </div>

      <ClienteForm action={update} cliente={cliente} submitLabel="Salvar alterações" />
    </div>
  );
}
