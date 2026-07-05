import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ClienteForm } from "@/components/cliente-form";
import { createClienteAction } from "../actions";

export default function NovoClientePage() {
  return (
    <div className="space-y-5">
      <div>
        <Link href="/clientes" className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground">
          <ChevronLeft size={16} /> Clientes
        </Link>
        <h1 className="text-xl font-semibold mt-1">Novo cliente</h1>
      </div>

      <ClienteForm action={createClienteAction} submitLabel="Cadastrar cliente" />
    </div>
  );
}
