import { Building2, Info, AlertCircle } from "lucide-react";
import { Field, SectionTitle, inputClass } from "@/components/ui/form";
import { SubmitButton } from "@/components/ui/submit-button";
import { getEmpresa } from "@/lib/data/empresa";
import { updateEmpresaAction } from "./actions";

export default async function ConfiguracoesPage({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string }>;
}) {
  const [empresa, { erro }] = await Promise.all([getEmpresa(), searchParams]);

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h1 className="text-xl font-semibold">Configurações</h1>
        <p className="text-sm text-muted">Dados da sua empresa — aparecem nos orçamentos e contratos.</p>
      </div>

      {erro && (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 flex items-center gap-2">
          <AlertCircle size={16} /> {erro}
        </div>
      )}

      <form action={updateEmpresaAction} className="card p-5 space-y-4">
        <SectionTitle>
          <span className="inline-flex items-center gap-2"><Building2 size={15} /> Dados da empresa</span>
        </SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nome da empresa" htmlFor="nome" className="sm:col-span-2">
            <input id="nome" name="nome" required defaultValue={empresa.nome} className={inputClass} />
          </Field>
          <Field label="CNPJ / CPF" htmlFor="cnpj">
            <input id="cnpj" name="cnpj" defaultValue={empresa.cnpj} className={inputClass} />
          </Field>
          <Field label="Responsável" htmlFor="responsavel">
            <input id="responsavel" name="responsavel" defaultValue={empresa.responsavel} className={inputClass} />
          </Field>
          <Field label="Telefone / WhatsApp" htmlFor="telefone">
            <input id="telefone" name="telefone" defaultValue={empresa.telefone} className={inputClass} />
          </Field>
          <Field label="E-mail" htmlFor="email">
            <input id="email" name="email" type="email" defaultValue={empresa.email} className={inputClass} />
          </Field>
          <Field label="Endereço" htmlFor="endereco">
            <input id="endereco" name="endereco" defaultValue={empresa.endereco} className={inputClass} placeholder="Rua, número — bairro" />
          </Field>
          <Field label="Cidade / UF" htmlFor="cidade">
            <input id="cidade" name="cidade" defaultValue={empresa.cidade} className={inputClass} placeholder="Indaiatuba/SP" />
          </Field>
        </div>

        <div className="border-t border-border pt-4">
          <SectionTitle>Logotipo (aparece nos orçamentos e contratos)</SectionTitle>
          <div className="flex items-start gap-4">
            <div className="h-20 w-20 shrink-0 rounded-lg border border-border bg-background grid place-items-center overflow-hidden">
              {empresa.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={empresa.logoUrl} alt="Logo atual" className="h-full w-full object-contain" />
              ) : (
                <span className="text-xs text-muted text-center px-1">sem logo</span>
              )}
            </div>
            <div className="flex-1 space-y-3">
              <Field label="Enviar imagem (PNG/JPG, até 6 MB)" htmlFor="logoFile">
                <input id="logoFile" name="logoFile" type="file" accept="image/*"
                  className="block w-full text-sm text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-primary file:text-primary-fg file:px-3 file:py-2 file:text-sm file:font-medium hover:file:bg-primary/90" />
              </Field>
              <Field label="…ou cole o link de uma imagem" htmlFor="logoUrl">
                <input id="logoUrl" name="logoUrl" defaultValue={empresa.logoUrl} className={inputClass} placeholder="https://…" />
              </Field>
            </div>
          </div>
        </div>

        <SubmitButton>Salvar configurações</SubmitButton>
      </form>

      <div className="card p-4 flex items-start gap-2 text-sm text-muted">
        <Info size={16} className="mt-0.5 shrink-0 text-primary" />
        <p>Usuários, permissões e plano de assinatura chegam em breve. Por enquanto, o acesso é único por empresa.</p>
      </div>
    </div>
  );
}
