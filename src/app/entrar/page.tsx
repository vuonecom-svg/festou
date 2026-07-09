import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { Field, inputClass } from "@/components/ui/form";
import { SubmitButton } from "@/components/ui/submit-button";
import { entrarAction } from "./actions";

export default async function EntrarPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string; next?: string }>;
}) {
  const { erro, next } = await searchParams;

  return (
    <div className="min-h-screen grid place-items-center bg-background px-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center justify-center gap-2 mb-6">
          <BrandMark size={38} />
          <span className="font-semibold text-2xl tracking-wide">FesFlow</span>
        </Link>

        <div className="card p-6">
          <h1 className="text-lg font-semibold text-center">Entrar na plataforma</h1>
          <p className="text-sm text-muted text-center mt-1">Acesse a gestão da sua locadora.</p>

          {erro && (
            <p className="mt-4 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
              E-mail ou senha incorretos.
            </p>
          )}

          <form action={entrarAction} className="mt-5 space-y-4">
            <input type="hidden" name="next" value={next ?? "/dashboard"} />
            <Field label="E-mail" htmlFor="email">
              <input id="email" name="email" type="email" required className={inputClass} placeholder="voce@empresa.com" />
            </Field>
            <Field label="Senha" htmlFor="senha">
              <input id="senha" name="senha" type="password" required className={inputClass} placeholder="••••••••" />
            </Field>
            <SubmitButton className="w-full">Entrar</SubmitButton>
          </form>
        </div>

        <p className="text-center text-sm text-muted mt-5">
          Ainda não tem acesso?{" "}
          <Link href="/#precos" className="text-primary font-medium hover:underline">Assine o FesFlow</Link>
        </p>
      </div>
    </div>
  );
}
