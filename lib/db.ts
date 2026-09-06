import { PrismaClient } from "@prisma/client";

/**
 * Render (and other hosted Postgres) often drops idle connections. Without a
 * short connect timeout the first query after sleep can hang, then fail with
 * "Server has closed the connection". Keep the URL intact; only add params
 * that are missing.
 */
function withReliableConnectionParams(url: string | undefined): string | undefined {
  if (!url || url.startsWith("file:")) return url;
  try {
    const parsed = new URL(url);
    if (!parsed.searchParams.has("connect_timeout")) {
      parsed.searchParams.set("connect_timeout", "30");
    }
    if (!parsed.searchParams.has("sslmode") && /render\.com|amazonaws\.com/i.test(url)) {
      parsed.searchParams.set("sslmode", "require");
    }
    return parsed.toString();
  } catch {
    return url;
  }
}

const datasourceUrl = withReliableConnectionParams(process.env.DATABASE_URL);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: datasourceUrl
      ? { db: { url: datasourceUrl } }
      : undefined,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Case-insensitive "contains" that works on both providers.
 *
 * Prisma's `mode: "insensitive"` is Postgres-only and throws on SQLite, which
 * turned admin product search into a 500. SQLite does not need it: its LIKE is
 * already case-insensitive for ASCII.
 */
export function containsInsensitive(value: string) {
  return isSqlite()
    ? { contains: value }
    : { contains: value, mode: "insensitive" as const };
}

function isSqlite(): boolean {
  return process.env.DATABASE_URL?.startsWith("file:") ?? false;
}
