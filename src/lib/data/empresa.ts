// Dados da empresa (locadora) — usados no cabeçalho de orçamentos e contratos.
// Mock por enquanto; virá da tabela `empresa` (multi-tenant) com o Supabase.

export type Empresa = {
  nome: string;
  cnpj: string;
  telefone: string;
  email: string;
  endereco: string;
  cidade: string;
  responsavel: string;
};

export async function getEmpresa(): Promise<Empresa> {
  return {
    nome: "Festa Feliz Locações",
    cnpj: "12.345.678/0001-90",
    telefone: "(19) 99999-0000",
    email: "contato@festafeliz.com.br",
    endereco: "Rua das Alegrias, 123 — Centro",
    cidade: "Indaiatuba/SP",
    responsavel: "Dona Festa",
  };
}
