import { EmConstrucao } from "@/components/em-construcao";
import { Settings } from "lucide-react";

export default function ConfiguracoesPage() {
  return (
    <EmConstrucao
      icon={Settings}
      titulo="Configurações"
      descricao="Dados da empresa, usuários e permissões, plano de assinatura, categorias, templates de checklist e cláusulas de contrato."
      fase="MVP"
    />
  );
}
