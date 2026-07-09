import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { sairAction } from "@/app/entrar/actions";

export const dynamic = "force-dynamic";

export default function AcessoBloqueadoPage() {
  return (
    <div className="min-h-screen grid place-items-center bg-background px-4">
      <div className="w-full max-w-sm text-center">
        <Link href="/" className="flex items-center justify-center gap-2 mb-6">
          <BrandMark size={38} />
          <span className="font-semibold text-2xl tracking-wide">FesFlow</span>
        </Link>

        <div className="card p-7">
          <span className="mx-auto grid place-items-center h-14 w-14 rounded-2xl bg-amber-100 text-amber-600 mb-4">
            <AlertTriangle size={26} />
          </span>
          <h1 className="text-lg font-semibold">Assinatura inativa</h1>
          <p className="text-sm text-muted mt-2">
            Seu acesso ao FesFlow está pausado porque a assinatura não está em dia.
            Regularize o pagamento para liberar a plataforma na hora.
          </p>
          <Link href="/#precos" className="mt-5 inline-flex w-full items-center justify-center rounded-lg h-11 bg-primary text-primary-fg font-semibold hover:bg-primary/90">
            Ver planos e reativar
          </Link>
          <form action={sairAction} className="mt-3">
            <button className="text-sm text-muted hover:text-foreground">Sair</button>
          </form>
        </div>

        <p className="text-xs text-muted mt-4">
          Já pagou e ainda está bloqueado? Aguarde alguns minutos ou fale com o suporte.
        </p>
      </div>
    </div>
  );
}
