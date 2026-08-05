import { prisma } from "./db";
import { FALLBACK_SILVER_RATE_PER_GRAM, isPlausibleRate } from "./pricing";

/**
 * Server-side access to the silver rate that every product price derives from.
 *
 * Two rules follow from how load-bearing this value is:
 *  1. A rate from the outside world is only accepted if it looks plausible.
 *  2. When a refresh fails we keep serving the last known good rate rather than
 *     dropping to a constant. The constant is a last resort for a database that
 *     has never recorded a rate at all.
 */

export const SILVER_RATE_CACHE_MS = 6 * 60 * 60 * 1000;

export type SilverRate = {
  ratePerGram: number;
  updatedAt: Date | null;
  /** True when no usable stored rate was found and the constant is in use. */
  isFallback: boolean;
  /** True when the stored rate is older than the cache window. */
  isStale: boolean;
};

export async function getCurrentSilverRate(): Promise<SilverRate> {
  try {
    const latest = await prisma.silverRate.findFirst({
      orderBy: { updatedAt: "desc" },
    });

    if (latest && isPlausibleRate(latest.ratePerGram)) {
      return {
        ratePerGram: latest.ratePerGram,
        updatedAt: latest.updatedAt,
        isFallback: false,
        isStale: Date.now() - latest.updatedAt.getTime() > SILVER_RATE_CACHE_MS,
      };
    }

    if (latest) {
      console.error(
        `[silver-rate] Stored rate ${latest.ratePerGram} is outside the plausible band; using fallback.`
      );
    } else {
      console.error("[silver-rate] No rate recorded; using fallback.");
    }
  } catch (error) {
    console.error("[silver-rate] Could not read the stored rate:", error);
  }

  return {
    ratePerGram: FALLBACK_SILVER_RATE_PER_GRAM,
    updatedAt: null,
    isFallback: true,
    isStale: true,
  };
}
