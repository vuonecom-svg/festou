import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Prisma 7 usa driver adapters. Runtime conecta pela URL POOLED (pgbouncer).
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL não definida — configure a variável de ambiente do banco.");
}

// Pool enxuto: em serverless cada instância atende ~1 requisição por vez,
// então um pool grande só segura conexões ociosas contra o pooler do Supabase.
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
  max: 3,
  idleTimeoutMillis: 10_000,
});

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
