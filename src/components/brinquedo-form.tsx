import Link from "next/link";
import { Field, Toggle, SectionTitle, inputClass, textareaClass } from "@/components/ui/form";
import { SubmitButton } from "@/components/ui/submit-button";
import { BRINQUEDO_STATUS } from "@/lib/status";
import type { Brinquedo } from "@/lib/data/brinquedos";

export function BrinquedoForm({
  action,
  brinquedo,
  submitLabel,
}: {
  action: (fd: FormData) => void | Promise<void>;
  brinquedo?: Brinquedo;
  submitLabel: string;
}) {
  const b = brinquedo;

  return (
    <form action={action} className="space-y-6 max-w-4xl">
      {/* Identificação */}
      <div className="card p-5">
        <SectionTitle>Identificação</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nome do brinquedo" htmlFor="nome" className="sm:col-span-2">
            <input id="nome" name="nome" required defaultValue={b?.nome} className={inputClass} placeholder="Ex.: Pula-pula Castelo 3x3" />
          </Field>
          <Field label="Código interno" htmlFor="codigoInterno" hint="Deixe em branco para gerar automático">
            <input id="codigoInterno" name="codigoInterno" defaultValue={b?.codigoInterno} className={inputClass} placeholder="BR-001" />
          </Field>
          <Field label="Categoria" htmlFor="categoriaNome">
            <input id="categoriaNome" name="categoriaNome" defaultValue={b?.categoriaNome} className={inputClass} placeholder="Infláveis" />
          </Field>
          <Field label="Quantidade em estoque" htmlFor="quantidade" hint="Quantas unidades iguais você tem (a agenda permite alugar todas ao mesmo tempo)" className="sm:col-span-2">
            <input id="quantidade" name="quantidade" type="number" min="1" step="1" defaultValue={b?.quantidade ?? 1} className={inputClass} placeholder="1" />
          </Field>
          <Field label="Descrição" htmlFor="descricao" className="sm:col-span-2">
            <textarea id="descricao" name="descricao" defaultValue={b?.descricao} className={textareaClass} placeholder="Detalhes para o cliente…" />
          </Field>
          <Field label="URL da foto" htmlFor="fotoUrl" hint="Upload de imagem chega com o Supabase Storage" className="sm:col-span-2">
            <input id="fotoUrl" name="fotoUrl" defaultValue={b?.fotoUrl} className={inputClass} placeholder="https://…" />
          </Field>
        </div>
      </div>

      {/* Valores */}
      <div className="card p-5">
        <SectionTitle>Valores</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Valor da diária (R$)" htmlFor="valorDiaria">
            <input id="valorDiaria" name="valorDiaria" type="number" step="0.01" min="0" required defaultValue={b?.valorDiaria ?? 0} className={inputClass} />
          </Field>
          <Field label="Valor por período (R$)" htmlFor="valorPeriodo">
            <input id="valorPeriodo" name="valorPeriodo" type="number" step="0.01" min="0" defaultValue={b?.valorPeriodo ?? ""} className={inputClass} />
          </Field>
          <Field label="Hora adicional (R$)" htmlFor="valorHoraExtra">
            <input id="valorHoraExtra" name="valorHoraExtra" type="number" step="0.01" min="0" defaultValue={b?.valorHoraExtra ?? ""} className={inputClass} />
          </Field>
          <Field label="Valor promocional (R$)" htmlFor="valorPromocional">
            <input id="valorPromocional" name="valorPromocional" type="number" step="0.01" min="0" defaultValue={b?.valorPromocional ?? ""} className={inputClass} />
          </Field>
        </div>
      </div>

      {/* Especificações */}
      <div className="card p-5">
        <SectionTitle>Especificações</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Medidas" htmlFor="medidas">
            <input id="medidas" name="medidas" defaultValue={b?.medidas} className={inputClass} placeholder="3x3x3m" />
          </Field>
          <Field label="Peso (kg)" htmlFor="pesoKg">
            <input id="pesoKg" name="pesoKg" type="number" step="0.1" min="0" defaultValue={b?.pesoKg ?? ""} className={inputClass} />
          </Field>
          <Field label="Capacidade (crianças)" htmlFor="capacidadeCriancas">
            <input id="capacidadeCriancas" name="capacidadeCriancas" type="number" min="0" defaultValue={b?.capacidadeCriancas ?? ""} className={inputClass} />
          </Field>
          <Field label="Idade mínima" htmlFor="idadeMin">
            <input id="idadeMin" name="idadeMin" type="number" min="0" defaultValue={b?.idadeMin ?? ""} className={inputClass} />
          </Field>
          <Field label="Idade máxima" htmlFor="idadeMax">
            <input id="idadeMax" name="idadeMax" type="number" min="0" defaultValue={b?.idadeMax ?? ""} className={inputClass} />
          </Field>
          <Field label="Qtd. motores/sopradores" htmlFor="qtdMotores">
            <input id="qtdMotores" name="qtdMotores" type="number" min="0" defaultValue={b?.qtdMotores ?? 0} className={inputClass} />
          </Field>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mt-4">
          <Toggle name="precisaEnergia" label="Precisa de energia" defaultChecked={b?.precisaEnergia} />
          <Toggle name="precisaAgua" label="Precisa de água" defaultChecked={b?.precisaAgua} />
          <Toggle name="pisoIrregular" label="Pode em piso irregular" defaultChecked={b?.pisoIrregular ?? false} />
          <Toggle name="localAberto" label="Pode em local aberto" defaultChecked={b?.localAberto ?? true} />
          <Toggle name="localCoberto" label="Pode em local coberto" defaultChecked={b?.localCoberto ?? true} />
        </div>
      </div>

      {/* Operação: tempos e manutenção */}
      <div className="card p-5">
        <SectionTitle>Operação (impacta a agenda)</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Montagem (min)" htmlFor="tempoMontagemMin">
            <input id="tempoMontagemMin" name="tempoMontagemMin" type="number" min="0" defaultValue={b?.tempoMontagemMin ?? 30} className={inputClass} />
          </Field>
          <Field label="Desmontagem (min)" htmlFor="tempoDesmontagemMin">
            <input id="tempoDesmontagemMin" name="tempoDesmontagemMin" type="number" min="0" defaultValue={b?.tempoDesmontagemMin ?? 20} className={inputClass} />
          </Field>
          <Field label="Limpeza (min)" htmlFor="tempoLimpezaMin">
            <input id="tempoLimpezaMin" name="tempoLimpezaMin" type="number" min="0" defaultValue={b?.tempoLimpezaMin ?? 30} className={inputClass} />
          </Field>
          <Field label="Custo médio manut. (R$)" htmlFor="custoManutMedio">
            <input id="custoManutMedio" name="custoManutMedio" type="number" step="0.01" min="0" defaultValue={b?.custoManutMedio ?? ""} className={inputClass} />
          </Field>
        </div>
        <p className="text-xs text-muted mt-3">
          Esses tempos entram nos buffers da agenda para impedir conflito de reserva.
        </p>
      </div>

      {/* Status + observações */}
      <div className="card p-5">
        <SectionTitle>Status e observações</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Status" htmlFor="status">
            <select id="status" name="status" defaultValue={b?.status ?? "disponivel"} className={inputClass}>
              {Object.entries(BRINQUEDO_STATUS).map(([value, { label }]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </Field>
          <div className="flex items-end">
            <Toggle name="inativo" label="Marcar como inativo (fora do catálogo)" defaultChecked={b ? !b.ativo : false} />
          </div>
          <Field label="Observações internas" htmlFor="obsInternas" className="sm:col-span-2">
            <textarea id="obsInternas" name="obsInternas" defaultValue={b?.obsInternas} className={textareaClass} placeholder="Anotações que só a equipe vê…" />
          </Field>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <SubmitButton>{submitLabel}</SubmitButton>
        <Link href="/brinquedos" className="text-sm text-muted hover:text-foreground">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
