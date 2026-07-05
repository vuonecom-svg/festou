import { EmConstrucao } from "@/components/em-construcao";
import { Truck } from "lucide-react";

export default function RotasPage() {
  return (
    <EmConstrucao
      icon={Truck}
      titulo="Rotas"
      descricao="Roteiro de entregas e retiradas do dia, ordem das paradas, horário de saída e abertura da rota no Google Maps."
      fase="V2"
    />
  );
}
