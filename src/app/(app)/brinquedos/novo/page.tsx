import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { BrinquedoForm } from "@/components/brinquedo-form";
import { createBrinquedoAction } from "../actions";

export default function NovoBrinquedoPage() {
  return (
    <div className="space-y-5">
      <div>
        <Link href="/brinquedos" className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground">
          <ChevronLeft size={16} /> Brinquedos
        </Link>
        <h1 className="text-xl font-semibold mt-1">Novo brinquedo</h1>
      </div>

      <BrinquedoForm action={createBrinquedoAction} submitLabel="Cadastrar brinquedo" />
    </div>
  );
}
