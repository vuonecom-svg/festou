import { EmConstrucao } from "@/components/em-construcao";
import { Wallet } from "lucide-react";

export default function FinanceiroPage() {
  return (
    <EmConstrucao
      icon={Wallet}
      titulo="Financeiro"
      descricao="Contas a receber e a pagar, controle de sinal e valor restante, formas de pagamento, despesas por evento, fluxo de caixa e lucro por brinquedo/cliente/cidade."
      fase="MVP"
    />
  );
}
