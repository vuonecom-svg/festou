import Link from "next/link";
import { Field, SectionTitle, inputClass, textareaClass } from "@/components/ui/form";
import { SubmitButton } from "@/components/ui/submit-button";
import { CLIENTE_TAGS, type Cliente, type ClienteTag } from "@/lib/data/clientes";

export function ClienteForm({
  action,
  cliente,
  submitLabel,
}: {
  action: (fd: FormData) => void | Promise<void>;
  cliente?: Cliente;
  submitLabel: string;
}) {
  const c = cliente;
  const tagsAtuais = new Set(c?.tags ?? []);

  return (
    <form action={action} className="space-y-6 max-w-4xl">
      {/* Dados pessoais */}
      <div className="card p-5">
        <SectionTitle>Dados do cliente</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nome completo / Razão social" htmlFor="nome" className="sm:col-span-2">
            <input id="nome" name="nome" required defaultValue={c?.nome} className={inputClass} placeholder="Ex.: Ana Paula Ribeiro" />
          </Field>
          <Field label="CPF ou CNPJ" htmlFor="doc">
            <input id="doc" name="doc" defaultValue={c?.doc} className={inputClass} placeholder="000.000.000-00" />
          </Field>
          <Field label="Data de nascimento" htmlFor="nascimento">
            <input id="nascimento" name="nascimento" type="date" defaultValue={c?.nascimento} className={inputClass} />
          </Field>
          <Field label="Telefone" htmlFor="telefone">
            <input id="telefone" name="telefone" defaultValue={c?.telefone} className={inputClass} placeholder="(19) 99999-0000" />
          </Field>
          <Field label="WhatsApp" htmlFor="whatsapp">
            <input id="whatsapp" name="whatsapp" defaultValue={c?.whatsapp} className={inputClass} placeholder="(19) 99999-0000" />
          </Field>
          <Field label="E-mail" htmlFor="email">
            <input id="email" name="email" type="email" defaultValue={c?.email} className={inputClass} placeholder="cliente@email.com" />
          </Field>
          <Field label="Avaliação (1 a 5)" htmlFor="avaliacao">
            <input id="avaliacao" name="avaliacao" type="number" min="1" max="5" defaultValue={c?.avaliacao ?? ""} className={inputClass} placeholder="—" />
          </Field>
        </div>
      </div>

      {/* Endereço residencial */}
      <div className="card p-5">
        <SectionTitle>Endereço residencial</SectionTitle>
        <p className="text-xs text-muted -mt-2 mb-3">
          É onde o cliente mora. O endereço da festa é informado depois, em cada orçamento.
        </p>
        <div className="grid gap-4 sm:grid-cols-6">
          <Field label="Rua" htmlFor="rua" className="sm:col-span-4">
            <input id="rua" name="rua" defaultValue={c?.rua} className={inputClass} />
          </Field>
          <Field label="Número" htmlFor="numero" className="sm:col-span-2">
            <input id="numero" name="numero" defaultValue={c?.numero} className={inputClass} />
          </Field>
          <Field label="Bairro" htmlFor="bairro" className="sm:col-span-3">
            <input id="bairro" name="bairro" defaultValue={c?.bairro} className={inputClass} />
          </Field>
          <Field label="Cidade" htmlFor="cidade" className="sm:col-span-2">
            <input id="cidade" name="cidade" defaultValue={c?.cidade} className={inputClass} />
          </Field>
          <Field label="CEP" htmlFor="cep" className="sm:col-span-1">
            <input id="cep" name="cep" defaultValue={c?.cep} className={inputClass} />
          </Field>
          <Field label="Complemento / referência" htmlFor="complemento" className="sm:col-span-6">
            <input id="complemento" name="complemento" defaultValue={c?.complemento} className={inputClass} placeholder="Apto, bloco, ponto de referência…" />
          </Field>
        </div>
      </div>

      {/* Tags + observações */}
      <div className="card p-5">
        <SectionTitle>Classificação</SectionTitle>
        <div className="flex flex-wrap gap-2 mb-4">
          {(Object.entries(CLIENTE_TAGS) as [ClienteTag, { label: string }][]).map(
            ([value, { label }]) => (
              <label
                key={value}
                className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 h-10 cursor-pointer hover:border-primary/40 select-none"
              >
                <input type="checkbox" name="tags" value={value} defaultChecked={tagsAtuais.has(value)} className="h-4 w-4 accent-[var(--primary)]" />
                <span className="text-sm text-foreground/80">{label}</span>
              </label>
            )
          )}
        </div>
        <Field label="Observações" htmlFor="obs">
          <textarea id="obs" name="obs" defaultValue={c?.obs} className={textareaClass} placeholder="Preferências, histórico, cuidados…" />
        </Field>
      </div>

      <div className="flex items-center gap-3">
        <SubmitButton>{submitLabel}</SubmitButton>
        <Link href="/clientes" className="text-sm text-muted hover:text-foreground">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
