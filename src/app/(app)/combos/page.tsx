import { EmConstrucao } from "@/components/em-construcao";
import { Boxes } from "lucide-react";

export default function CombosPage() {
  return (
    <EmConstrucao
      icon={Boxes}
      titulo="Combos"
      descricao="Pacotes de brinquedos e itens com preço fechado para acelerar orçamentos."
      fase="V2"
    />
  );
}
