import { Plus } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { BrinquedosGrid } from "@/components/brinquedos-grid";
import { listBrinquedos, brinquedoStats } from "@/lib/data/brinquedos";

export default async function BrinquedosPage() {
  const [brinquedos, stats] = await Promise.all([listBrinquedos(), brinquedoStats()]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Brinquedos e itens</h1>
          <p className="text-sm text-muted">
            {stats.total} cadastrados · {stats.disponivel} disponíveis · {stats.alugado} alugados ·{" "}
            {stats.manutencao} em manutenção · {stats.limpeza} em limpeza
          </p>
        </div>
        <ButtonLink href="/brinquedos/novo">
          <Plus size={18} /> Novo brinquedo
        </ButtonLink>
      </div>

      <BrinquedosGrid brinquedos={brinquedos} />
    </div>
  );
}
