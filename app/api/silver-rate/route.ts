import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { isPlausibleRate } from "@/lib/pricing";
import { getCurrentSilverRate, SILVER_RATE_CACHE_MS } from "@/lib/silver-rate";

const METAL_PRICE_API_KEY = process.env.METAL_PRICE_API_KEY || "";

const GRAMS_PER_TROY_OUNCE = 31.1035;

/**
 * Fetches the current silver rate in INR per gram, or null if the feed is
 * unavailable or returns something implausible. Returning null rather than a
 * constant lets the caller keep the last known good rate.
 */
async function fetchSilverRateFromAPI(): Promise<number | null> {
  if (!METAL_PRICE_API_KEY) {
    console.warn("[silver-rate] METAL_PRICE_API_KEY is not set; skipping refresh.");
    return null;
  }

  try {
    const response = await fetch(
      `https://api.metalpriceapi.com/v1/latest?api_key=${METAL_PRICE_API_KEY}&base=INR&currencies=XAG`,
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
    const rounded = Math.round(perGram * 100) / 100;

    if (!isPlausibleRate(rounded)) {
      console.error(
        `[silver-rate] Feed produced ${rounded}/g, outside the plausible band. Ignoring.`
      );
      return null;
    }

    return rounded;
  } catch (error) {
    console.error("[silver-rate] Feed request failed:", error);
    return null;
  }
}

/** GET /api/silver-rate - current rate, refreshing from the feed when stale. */
export async function GET() {
  const current = await getCurrentSilverRate();

  const needsRefresh =
    current.isFallback ||
    current.updatedAt === null ||
    Date.now() - current.updatedAt.getTime() > SILVER_RATE_CACHE_MS;

  if (needsRefresh) {
    const fresh = await fetchSilverRateFromAPI();

    if (fresh !== null) {
      try {
        const saved = await prisma.silverRate.create({
          data: { ratePerGram: fresh, source: "MetalPriceAPI" },
        });

        return NextResponse.json({
          success: true,
          ratePerGram: saved.ratePerGram,
          updatedAt: saved.updatedAt,
          cached: false,
        });
      } catch (error) {
        console.error("[silver-rate] Could not store the refreshed rate:", error);
      }
    }
  }

  // Either the rate is fresh, or the refresh failed and we keep the last known
  // good value rather than swinging the whole catalogue's prices.
  return NextResponse.json({
    success: true,
    ratePerGram: current.ratePerGram,
    updatedAt: current.updatedAt,
    cached: true,
    stale: current.isStale,
    fallback: current.isFallback,
  });
}

/** POST /api/silver-rate - admin override. */
export async function POST(request: Request) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { ratePerGram } = await request.json();

    if (!isPlausibleRate(ratePerGram)) {
      return NextResponse.json(
        { error: "Enter a rate between ₹50 and ₹5,000 per gram" },
        { status: 400 }
      );
    }

    const saved = await prisma.silverRate.create({
      data: { ratePerGram, source: `Manual (${admin.email})` },
    });

    return NextResponse.json({
      success: true,
      ratePerGram: saved.ratePerGram,
      updatedAt: saved.updatedAt,
    });
  } catch (error) {
    console.error("[silver-rate] Manual update failed:", error);
    return NextResponse.json(
      { error: "Failed to update silver rate" },
      { status: 500 }
    );
  }
}
