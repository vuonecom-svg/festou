import { EmConstrucao } from "@/components/em-construcao";
import { Filter } from "lucide-react";

export default function CrmPage() {
  return (
    <EmConstrucao
      icon={Filter}
      titulo="CRM comercial"
      descricao="Funil de atendimentos: novo lead → orçamento → aguardando sinal → confirmado. Origem do lead, próxima ação, motivo de perda e reativação de clientes antigos."
      fase="V2"
    />
  );
}
