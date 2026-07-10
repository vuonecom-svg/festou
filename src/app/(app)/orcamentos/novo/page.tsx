import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { OrcamentoWizard } from "@/components/orcamento-wizard";
import { criarOrcamentoAction } from "../actions";
import { listBrinquedos } from "@/lib/data/brinquedos";
import { listClientes } from "@/lib/data/clientes";
import { reservasParaEngine } from "@/lib/data/reservas";

export default async function NovoOrcamentoPage() {
  const [clientes, brinquedos, reservas] = await Promise.all([
    listClientes(),
    listBrinquedos(),
    reservasParaEngine(),
  ]);

  const clientesW = clientes.map((c) => ({ id: c.id, nome: c.nome, cidade: c.cidade }));
  const brinquedosW = brinquedos
    .filter((b) => b.ativo && b.status !== "inativo")
    .map((b) => ({
      id: b.id,
      nome: b.nome,
      valorDiaria: Number(b.valorDiaria),
      valorPromocional: b.valorPromocional != null ? Number(b.valorPromocional) : null,
      quantidade: b.quantidade,
      tempoMontagemMin: b.tempoMontagemMin,
      tempoDesmontagemMin: b.tempoDesmontagemMin,
      tempoLimpezaMin: b.tempoLimpezaMin,
    }));

  return (
    <div className="space-y-5">
      <div>
        <Link href="/orcamentos" className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground">
          <ChevronLeft size={16} /> Orçamentos
        </Link>
        <h1 className="text-xl font-semibold mt-1">Novo orçamento</h1>
      </div>

      <OrcamentoWizard
        action={criarOrcamentoAction}
        clientes={clientesW}
        brinquedos={brinquedosW}
        reservas={reservas}
      />
    </div>
  );
}
