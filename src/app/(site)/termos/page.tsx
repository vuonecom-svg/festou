import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Termos de Uso — FesFlow",
  description: "Condições de uso da plataforma FesFlow: assinatura, responsabilidades, pagamento e cancelamento.",
};

const ATUALIZADO = "agosto de 2026";
const WHATS = "5519983760954";

function H({ children }: { children: React.ReactNode }) {
  return <h2 className="text-lg font-semibold mt-8 mb-2 text-foreground">{children}</h2>;
}

export default function TermosPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-sm text-muted">
        <Link href="/" className="hover:text-foreground">← Início</Link>
      </p>
      <h1 className="text-3xl font-semibold mt-3">Termos de Uso</h1>
      <p className="text-sm text-muted mt-1">Última atualização: {ATUALIZADO}</p>

      <div className="mt-6 text-[15px] leading-7 text-foreground/90 space-y-3">
        <p>
          Estes Termos regem o uso do <strong>FesFlow</strong>, plataforma de gestão para locadoras de brinquedos e
          itens de festa. Ao criar uma conta ou usar o serviço, você concorda com estas condições.
        </p>

        <H>1. O serviço</H>
        <p>
          O FesFlow oferece agenda com controle de disponibilidade, orçamentos, pedidos, contratos em PDF, controle
          financeiro e ferramentas relacionadas, disponibilizadas por assinatura, no modelo &quot;software como
          serviço&quot; (SaaS).
        </p>

        <H>2. Conta e acesso</H>
        <ul className="list-disc pl-5 space-y-1">
          <li>Você é responsável por manter a confidencialidade das suas credenciais e por toda atividade na sua conta.</li>
          <li>Os dados que você cadastra devem ser verídicos e você deve ter base legal para tratá-los (LGPD).</li>
          <li>O acesso é liberado mediante assinatura ativa e bloqueado em caso de inadimplência ou cancelamento.</li>
        </ul>

        <H>3. Assinatura e pagamento</H>
        <ul className="list-disc pl-5 space-y-1">
          <li>Os pagamentos são processados pela <strong>Kiwify</strong>. A confirmação do pagamento libera o acesso.</li>
          <li>Planos disponíveis: mensal (primeiro mês por R$ 5,00, depois o valor vigente), semestral e anual.</li>
          <li>A renovação é automática conforme o plano contratado, até o cancelamento.</li>
          <li>Reembolsos e chargebacks seguem as regras da Kiwify e a legislação aplicável; após reembolso/cancelamento, o acesso é bloqueado.</li>
        </ul>

        <H>4. Uso aceitável</H>
        <p>Você concorda em não: usar o serviço para fins ilícitos; tentar burlar a segurança, o controle de acesso
          ou a cobrança; sobrecarregar a infraestrutura; ou inserir conteúdo que viole direitos de terceiros.</p>

        <H>5. Seus dados e conteúdo</H>
        <p>
          Os dados e conteúdos que você insere continuam seus. Você nos concede uma licença limitada para processá-los
          apenas para operar o serviço, conforme a <Link href="/privacidade" className="text-primary hover:underline">Política de Privacidade</Link>.
        </p>

        <H>6. Disponibilidade</H>
        <p>
          Empregamos esforços para manter o serviço disponível e íntegro, incluindo a prevenção de conflitos de agenda.
          O serviço é fornecido &quot;no estado em que se encontra&quot;; não garantimos operação ininterrupta ou livre
          de erros, e recomendamos que você mantenha seus próprios registros dos eventos críticos.
        </p>

        <H>7. Limitação de responsabilidade</H>
        <p>
          Na máxima extensão permitida pela lei, o FesFlow não se responsabiliza por danos indiretos, lucros cessantes
          ou perdas decorrentes de mau uso, indisponibilidade temporária ou de dados inseridos incorretamente pelo
          usuário. Nossa responsabilidade total fica limitada ao valor pago pela assinatura nos últimos 12 meses.
        </p>

        <H>8. Cancelamento</H>
        <p>
          Você pode cancelar a assinatura a qualquer momento pela Kiwify; o acesso permanece até o fim do período já
          pago. Podemos suspender contas que violem estes Termos.
        </p>

        <H>9. Alterações</H>
        <p>
          Podemos atualizar estes Termos. Mudanças relevantes serão comunicadas na plataforma ou por e-mail; o uso
          continuado após a atualização representa concordância.
        </p>

        <H>10. Lei aplicável e foro</H>
        <p>
          Estes Termos são regidos pela legislação brasileira. Fica eleito o foro do domicílio do consumidor para
          dirimir eventuais controvérsias, quando aplicável.
        </p>

        <H>11. Contato</H>
        <ul className="list-disc pl-5 space-y-1">
          <li>WhatsApp: <a href={`https://wa.me/${WHATS}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">(19) 98376-0954</a></li>
          <li>E-mail: <a href="mailto:contato@fesflow.com.br" className="text-primary hover:underline">contato@fesflow.com.br</a></li>
        </ul>
      </div>

      <p className="mt-10 text-sm text-muted">
        Veja também a <Link href="/privacidade" className="text-primary hover:underline">Política de Privacidade</Link>.
      </p>
    </div>
  );
}
