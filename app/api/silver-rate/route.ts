import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { isPlausibleRate } from "@/lib/pricing";
import { enforceRateLimit } from "@/lib/rate-limit";
import { getCurrentSilverRate, SILVER_RATE_CACHE_MS } from "@/lib/silver-rate";
import { refreshSilverRate } from "@/lib/silver-rate-refresh";

/** GET /api/silver-rate - the current rate, refreshing from the feed when stale. */
export async function GET(request: NextRequest) {
  // A stale rate makes this endpoint reach the paid metal price feed and write a
  // row, so an unthrottled public GET is a way to burn her API quota and fill
  // the database. The daily cron is the intended refresh path; this is a
  // fallback for the rate badge.
  const limited = enforceRateLimit(request, "silver-rate", {
    limit: 30,
    windowMs: 60 * 1000,
  });
  if (limited) return limited;

  const current = await getCurrentSilverRate();

  const needsRefresh =
    current.isFallback ||
    current.updatedAt === null ||
    Date.now() - current.updatedAt.getTime() > SILVER_RATE_CACHE_MS;

  if (needsRefresh) {
    const saved = await refreshSilverRate();

    if (saved) {
      return NextResponse.json({
        success: true,
        ratePerGram: saved.ratePerGram,
        labourPerGram: current.labourPerGram,
        updatedAt: saved.updatedAt,
        cached: false,
      });
    }
  }

  // Either the rate is fresh, or the refresh failed and we keep the last known
  // good value rather than swinging the whole catalogue's prices.
  return NextResponse.json({
    success: true,
    ratePerGram: current.ratePerGram,
    labourPerGram: current.labourPerGram,
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
