import { EmConstrucao } from "@/components/em-construcao";
import { FileSignature } from "lucide-react";

export default function ContratosPage() {
  return (
    <EmConstrucao
      icon={FileSignature}
      titulo="Contratos e documentos"
      descricao="Geração automática de contrato de locação, termo de responsabilidade, recibo, ordem de serviço e checklists — em PDF, com assinatura digital simples."
      fase="MVP"
    />
  );
}
