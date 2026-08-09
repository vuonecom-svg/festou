import { cache } from "react";
import { prisma } from "./prisma";
import { getCurrentEmpresaId } from "./tenant";
import { getNicho, type Nicho } from "./nichos";

// Nicho da empresa atual (server components). Cache por requisição.
export const getNichoAtual = cache(async (): Promise<Nicho | undefined> => {
  const empresaId = await getCurrentEmpresaId();
  const emp = await prisma.empresa.findUnique({
    where: { id: empresaId },
    select: { nicho: true },
  });
  return getNicho(emp?.nicho);
});
