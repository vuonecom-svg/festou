import { Plus } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { BrinquedosGrid } from "@/components/brinquedos-grid";
import { listBrinquedos, brinquedoStats } from "@/lib/data/brinquedos";
import { getNichoAtual } from "@/lib/nicho-atual";
import { termosDo } from "@/lib/nichos";

export default async function BrinquedosPage() {
  const [brinquedos, stats, nicho] = await Promise.all([listBrinquedos(), brinquedoStats(), getNichoAtual()]);
  const termos = termosDo(nicho);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">{termos.itens}</h1>
          <p className="text-sm text-muted">
            {stats.total} cadastrados · {stats.disponivel} disponíveis · {stats.alugado} alugados ·{" "}
            {stats.manutencao} em manutenção · {stats.limpeza} em limpeza
          </p>
        </div>
        <ButtonLink href="/brinquedos/novo">
          <Plus size={18} /> {termos.novo}
        </ButtonLink>
      </div>

      <BrinquedosGrid brinquedos={brinquedos} />
    </div>
  );
}
