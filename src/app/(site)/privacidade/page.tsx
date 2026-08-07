import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidade — FesFlow",
  description: "Como o FesFlow coleta, usa, armazena e protege dados pessoais, em conformidade com a LGPD.",
};

const ATUALIZADO = "agosto de 2026";
const WHATS = "5519983760954";

function H({ children }: { children: React.ReactNode }) {
  return <h2 className="text-lg font-semibold mt-8 mb-2 text-foreground">{children}</h2>;
}

export default function PrivacidadePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-sm text-muted">
        <Link href="/" className="hover:text-foreground">← Início</Link>
      </p>
      <h1 className="text-3xl font-semibold mt-3">Política de Privacidade</h1>
      <p className="text-sm text-muted mt-1">Última atualização: {ATUALIZADO}</p>

      <div className="mt-6 text-[15px] leading-7 text-foreground/90 space-y-3">
        <p>
          Esta Política explica como o <strong>FesFlow</strong> (&quot;plataforma&quot;, &quot;nós&quot;) trata dados
          pessoais, em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD). Ao
          usar o FesFlow, você concorda com as práticas aqui descritas.
        </p>

        <H>1. Quem somos</H>
        <p>
          O FesFlow é uma plataforma de gestão para locadoras de brinquedos e itens de festa. Somos
          <strong> controladores</strong> dos dados de cadastro e uso da sua conta e <strong>operadores</strong> dos
          dados que você (locadora) insere sobre os seus próprios clientes — que permanecem sob a sua
          responsabilidade como controlador.
        </p>

        <H>2. Dados que coletamos</H>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Dados da conta:</strong> nome, e-mail, telefone, dados da empresa (razão social/CNPJ, endereço) e credenciais de acesso.</li>
          <li><strong>Dados inseridos por você:</strong> informações de clientes, orçamentos, pedidos, contratos e financeiro que você cadastra na operação.</li>
          <li><strong>Dados de pagamento:</strong> processados pela <strong>Kiwify</strong>; não armazenamos números de cartão. Recebemos apenas a confirmação do status da assinatura.</li>
          <li><strong>Dados de uso:</strong> registros de acesso e logs técnicos necessários à segurança e ao funcionamento.</li>
        </ul>

        <H>3. Para que usamos</H>
        <ul className="list-disc pl-5 space-y-1">
          <li>Fornecer e operar a plataforma (agenda, orçamentos, contratos, financeiro).</li>
          <li>Autenticar o acesso e liberar/bloquear a conta conforme o status da assinatura.</li>
          <li>Enviar comunicações operacionais (ex.: definição de senha, avisos da conta).</li>
          <li>Garantir segurança, prevenir fraude e cumprir obrigações legais.</li>
        </ul>

        <H>4. Base legal</H>
        <p>
          Tratamos dados com base na <strong>execução do contrato</strong> (para prestar o serviço), no
          <strong> cumprimento de obrigação legal</strong>, no <strong>legítimo interesse</strong> (segurança e melhoria)
          e no <strong>consentimento</strong>, quando aplicável.
        </p>

        <H>5. Compartilhamento e subprocessadores</H>
        <p>Usamos prestadores que tratam dados em nosso nome, sob contrato e apenas para operar o serviço:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Supabase</strong> — banco de dados, autenticação e armazenamento.</li>
          <li><strong>Vercel</strong> — hospedagem da aplicação.</li>
          <li><strong>Kiwify</strong> — processamento de pagamentos e assinaturas.</li>
          <li><strong>SendGrid (Twilio)</strong> — envio de e-mails transacionais.</li>
        </ul>
        <p>Não vendemos dados pessoais. Só compartilhamos quando necessário ao serviço ou por exigência legal.</p>

        <H>6. Armazenamento e segurança</H>
        <p>
          Adotamos medidas técnicas e organizacionais para proteger os dados: criptografia em trânsito (HTTPS),
          isolamento por empresa (multi-tenant com Row Level Security), controle de acesso por papel e trilha de
          auditoria de eventos sensíveis. Nenhum sistema é 100% inviolável, mas trabalhamos para reduzir riscos.
        </p>

        <H>7. Retenção</H>
        <p>
          Mantemos os dados enquanto a conta estiver ativa e pelo prazo necessário para cumprir obrigações legais.
          Após o encerramento, os dados podem ser anonimizados ou eliminados, salvo quando a lei exigir retenção.
        </p>

        <H>8. Seus direitos (LGPD)</H>
        <p>Você pode, a qualquer tempo, solicitar: confirmação e acesso, correção, anonimização ou eliminação,
          portabilidade, informação sobre compartilhamentos e revogação de consentimento. Para exercê-los,
          fale conosco pelos canais abaixo.</p>

        <H>9. Cookies</H>
        <p>
          Usamos apenas cookies essenciais para autenticação e funcionamento da plataforma. Não usamos cookies de
          publicidade de terceiros dentro do sistema.
        </p>

        <H>10. Contato / Encarregado (DPO)</H>
        <p>
          Dúvidas ou solicitações sobre privacidade e dados pessoais:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>WhatsApp: <a href={`https://wa.me/${WHATS}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">(19) 98376-0954</a></li>
          <li>E-mail: <a href="mailto:contato@fesflow.com.br" className="text-primary hover:underline">contato@fesflow.com.br</a></li>
        </ul>

        <H>11. Alterações</H>
        <p>
          Podemos atualizar esta Política. Mudanças relevantes serão comunicadas na plataforma ou por e-mail. A data
          de &quot;última atualização&quot; no topo indica a versão vigente.
        </p>
      </div>

      <p className="mt-10 text-sm text-muted">
        Veja também os <Link href="/termos" className="text-primary hover:underline">Termos de Uso</Link>.
      </p>
    </div>
  );
}
