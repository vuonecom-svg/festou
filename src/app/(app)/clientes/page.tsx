import { Plus } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { ClientesTable } from "@/components/clientes-table";
import { listClientes, clienteStats } from "@/lib/data/clientes";
import { formatBRL } from "@/lib/utils";

export default async function ClientesPage() {
  const [clientes, stats] = await Promise.all([listClientes(), clienteStats()]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Clientes</h1>
          <p className="text-sm text-muted">
            {stats.total} cadastrados · {stats.recorrentes} recorrentes ·{" "}
            {formatBRL(stats.faturamentoTotal)} em locações
          </p>
        </div>
        <ButtonLink href="/clientes/novo">
          <Plus size={18} /> Novo cliente
        </ButtonLink>
      </div>

      <ClientesTable clientes={clientes} />
    </div>
  );
}
