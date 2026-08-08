"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentEmpresaId } from "@/lib/tenant";

export type PerfilInicial = {
  nicho: string;
  oferece?: string;
  equipe?: string;
  foco?: string;
};

// Salva o nicho + respostas do onboarding na empresa do usuário logado.
export async function salvarPerfilInicial(input: PerfilInicial): Promise<{ ok: boolean }> {
  const nicho = (input.nicho || "").trim();
  if (!nicho) return { ok: false };
  const empresaId = await getCurrentEmpresaId();
  await prisma.empresa.update({
    where: { id: empresaId },
    data: {
      nicho,
      perfilNegocio: {
        oferece: input.oferece?.trim() ?? "",
        equipe: input.equipe ?? "",
        foco: input.foco ?? "",
      },
      onboardingEm: new Date(),
    },
  });
  return { ok: true };
}
