import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Case-insensitive "contains" that works on both providers.
 *
 * Prisma's `mode: "insensitive"` is Postgres-only and throws on SQLite, which
 * turned admin product search into a 500. SQLite does not need it: its LIKE is
 * already case-insensitive for ASCII.
 */
export function containsInsensitive(value: string) {
  const isSqlite = process.env.DATABASE_URL?.startsWith("file:") ?? false;

  return isSqlite
    ? { contains: value }
    : { contains: value, mode: "insensitive" as const };
}
