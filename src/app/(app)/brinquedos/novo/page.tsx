import Link from "next/link";
import { ChevronLeft, AlertCircle } from "lucide-react";
import { BrinquedoForm } from "@/components/brinquedo-form";
import { createBrinquedoAction } from "../actions";
import { getNichoAtual } from "@/lib/nicho-atual";
import { termosDo } from "@/lib/nichos";

export default async function NovoBrinquedoPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;
  const termos = termosDo(await getNichoAtual());
  return (
    <div className="space-y-5">
      <div>
        <Link href="/brinquedos" className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground">
          <ChevronLeft size={16} /> {termos.itens}
        </Link>
        <h1 className="text-xl font-semibold mt-1">{termos.novo}</h1>
      </div>

      {erro && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 flex items-center gap-2">
          <AlertCircle size={16} /> {erro}
        </div>
      )}

      <BrinquedoForm action={createBrinquedoAction} submitLabel={`Cadastrar ${termos.item}`} />
    </div>
  );
}
