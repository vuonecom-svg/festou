import { EmConstrucao } from "@/components/em-construcao";
import { Wrench } from "lucide-react";

export default function ManutencaoPage() {
  return (
    <EmConstrucao
      icon={Wrench}
      titulo="Manutenção e limpeza"
      descricao="Controle de brinquedos em manutenção/limpeza, histórico de avarias, custos, fotos antes/depois e bloqueio automático na agenda."
      fase="V2"
    />
  );
}
