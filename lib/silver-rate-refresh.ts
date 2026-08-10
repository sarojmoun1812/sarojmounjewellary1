import { prisma } from "./db";
import { isPlausibleRate } from "./pricing";

/**
 * Pulls the silver price from the outside world and stores the rate her prices
 * are built from.
 *
 * Two things happen here that are easy to miss:
 *
 * 1. The feed reports the *international spot* price — about Rs 179/g at the
 *    time of writing. That is not what an Indian jeweller pays. Import duty,
 *    GST in the supply chain and the dealer's margin sit on top, and she buys
 *    at roughly Rs 235/g. Storing spot directly would underprice every single
 *    piece by about a quarter, which is a real loss on every sale rather than
 *    a cosmetic bug. So a premium percentage is applied before storing.
 *
 * 2. The stored value is therefore the rate to price with, not a raw market
 *    figure. Everything that reads the SilverRate table can use it as-is.
 */

const GRAMS_PER_TROY_OUNCE = 31.1035;

/** Applied when no setting is stored. Reproduces ~Rs 235/g from ~Rs 179/g spot. */
export const DEFAULT_SILVER_PREMIUM_PERCENT = 31;

export type RefreshResult = {
  ratePerGram: number;
  spotPerGram: number;
  premiumPercent: number;
  updatedAt: Date;
};

/** International spot in rupees per gram, or null if the feed is unusable. */
export async function fetchSpotRatePerGram(): Promise<number | null> {
  const apiKey = process.env.METAL_PRICE_API_KEY || "";

  if (!apiKey) {
    console.warn("[silver-rate] METAL_PRICE_API_KEY is not set; skipping refresh.");
    return null;
  }

  try {
    const response = await fetch(
      `https://api.metalpriceapi.com/v1/latest?api_key=${apiKey}&base=INR&currencies=XAG`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      console.error(`[silver-rate] Feed returned HTTP ${response.status}.`);
      return null;
    }

    const data = await response.json();
    const xagPerInr = data?.rates?.XAG;

    if (typeof xagPerInr !== "number" || xagPerInr <= 0) {
      console.error("[silver-rate] Feed response missing a usable XAG rate.");
      return null;
    }

    // XAG is priced per troy ounce; base=INR means rates.XAG is ounces per rupee.
    const perGram = 1 / xagPerInr / GRAMS_PER_TROY_OUNCE;
    return Math.round(perGram * 100) / 100;
  } catch (error) {
    console.error("[silver-rate] Feed request failed:", error);
    return null;
  }
}

async function getPremiumPercent(): Promise<number> {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "settings" },
      select: { silverRatePremiumPercent: true },
    });

    const premium = settings?.silverRatePremiumPercent;
    // A negative premium would price below spot, which she never does. Anything
    // above 200% is a typo rather than an intent.
    if (
      typeof premium === "number" &&
      Number.isFinite(premium) &&
      premium >= 0 &&
      premium <= 200
    ) {
      return premium;
    }
  } catch (error) {
    console.error("[silver-rate] Could not read the premium setting:", error);
  }

  return DEFAULT_SILVER_PREMIUM_PERCENT;
}

/**
 * Refreshes and stores the rate. Returns null when the feed is unavailable or
 * produced something implausible, in which case the caller should keep serving
 * the last stored rate rather than moving the whole catalogue.
 */
export async function refreshSilverRate(): Promise<RefreshResult | null> {
  const spotPerGram = await fetchSpotRatePerGram();
  if (spotPerGram === null) return null;

  const premiumPercent = await getPremiumPercent();
  const ratePerGram =
    Math.round(spotPerGram * (1 + premiumPercent / 100) * 100) / 100;

  if (!isPlausibleRate(ratePerGram)) {
    console.error(
      `[silver-rate] Computed ${ratePerGram}/g from spot ${spotPerGram}/g, outside the plausible band. Ignoring.`
    );
    return null;
  }

  try {
    const saved = await prisma.silverRate.create({
      data: {
        ratePerGram,
        source: `MetalPriceAPI (spot ₹${spotPerGram}/g +${premiumPercent}%)`,
      },
    });

    return {
      ratePerGram: saved.ratePerGram,
      spotPerGram,
      premiumPercent,
      updatedAt: saved.updatedAt,
    };
  } catch (error) {
    console.error("[silver-rate] Could not store the refreshed rate:", error);
    return null;
  }
}
