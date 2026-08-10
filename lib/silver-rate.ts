import { prisma } from "./db";
import {
  DEFAULT_LABOUR_PER_GRAM,
  FALLBACK_SILVER_RATE_PER_GRAM,
  isPlausibleRate,
} from "./pricing";

/**
 * Server-side access to the two numbers every product price derives from: the
 * silver rate per gram and the labour charged per gram. They are returned
 * together because no caller needs one without the other, and fetching them
 * separately is how they end up read from different points in time.
 *
 * Two rules follow from how load-bearing the rate is:
 *  1. A rate from the outside world is only accepted if it looks plausible.
 *  2. When a refresh fails we keep serving the last known good rate rather than
 *     dropping to a constant. The constant is a last resort for a database that
 *     has never recorded a rate at all.
 */

export const SILVER_RATE_CACHE_MS = 6 * 60 * 60 * 1000;

/** Beyond this, the stored rate is old enough to be worth flagging. */
export const SILVER_RATE_STALE_WARNING_MS = 48 * 60 * 60 * 1000;

export type SilverRate = {
  /** Her local buying rate in rupees per gram, ready to price with. */
  ratePerGram: number;
  /** Labour and commission in rupees per gram. */
  labourPerGram: number;
  updatedAt: Date | null;
  /** True when no usable stored rate was found and the constant is in use. */
  isFallback: boolean;
  /** True when the stored rate is older than the refresh window. */
  isStale: boolean;
};

async function getLabourPerGram(): Promise<number> {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "settings" },
      select: { labourPerGram: true },
    });

    const labour = settings?.labourPerGram;
    // A zero or negative labour rate would sell her work for the cost of the
    // metal alone, so an implausible setting falls back rather than applying.
    if (typeof labour === "number" && Number.isFinite(labour) && labour > 0) {
      return labour;
    }
  } catch (error) {
    console.error("[silver-rate] Could not read the labour setting:", error);
  }

  return DEFAULT_LABOUR_PER_GRAM;
}

export async function getCurrentSilverRate(): Promise<SilverRate> {
  const labourPerGram = await getLabourPerGram();

  try {
    const latest = await prisma.silverRate.findFirst({
      orderBy: { updatedAt: "desc" },
    });

    if (latest && isPlausibleRate(latest.ratePerGram)) {
      return {
        ratePerGram: latest.ratePerGram,
        labourPerGram,
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
    labourPerGram,
    updatedAt: null,
    isFallback: true,
    isStale: true,
  };
}
