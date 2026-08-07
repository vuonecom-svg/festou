import Link from "next/link";
import { ChevronLeft, AlertCircle } from "lucide-react";
import { BrinquedoForm } from "@/components/brinquedo-form";
import { createBrinquedoAction } from "../actions";

export default async function NovoBrinquedoPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const { erro } = await searchParams;
  return (
    <div className="space-y-5">
      <div>
        <Link href="/brinquedos" className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground">
          <ChevronLeft size={16} /> Brinquedos
        </Link>
        <h1 className="text-xl font-semibold mt-1">Novo brinquedo</h1>
      </div>

      {erro && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 flex items-center gap-2">
          <AlertCircle size={16} /> {erro}
        </div>
      )}

      <BrinquedoForm action={createBrinquedoAction} submitLabel="Cadastrar brinquedo" />
    </div>
  );
}
