import { EmConstrucao } from "@/components/em-construcao";
import { HardHat } from "lucide-react";

export default function EquipePage() {
  return (
    <EmConstrucao
      icon={HardHat}
      titulo="Equipe e logística"
      descricao="Montadores, motoristas, veículos e definição de equipe por evento. Base para o app da equipe de rua e as rotas."
      fase="V2"
    />
  );
}
