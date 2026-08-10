import { NextRequest, NextResponse } from "next/server";
import { refreshSilverRate } from "@/lib/silver-rate-refresh";

// Without this the route is prerendered at build time and the scheduled request
// would be served a cached response instead of refreshing anything.
export const dynamic = "force-dynamic";

/**
 * Daily silver rate refresh, triggered by the Vercel cron entry in vercel.json.
 *
 * Before this existed, the rate was only refreshed as a side effect of somebody
 * loading the homepage. For a new shop with little traffic that meant prices
 * could sit frozen at a week-old rate, and the first visitor after it went
 * stale saw the rate badge and the product prices disagree — the badge fetched
 * the new rate while the page had already been rendered from the old one.
 *
 * Refreshing on a schedule means the database always holds a current rate
 * before anyone renders a price.
 */
export async function GET(request: NextRequest) {
  // Vercel sends this header on cron invocations. Without the check, anyone
  // could hammer the endpoint and burn through the metal price API quota.
  const secret = process.env.CRON_SECRET;

  if (secret) {
    const authorization = request.headers.get("authorization");
    if (authorization !== `Bearer ${secret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } else {
    console.warn(
      "[cron] CRON_SECRET is not set; the silver rate refresh endpoint is open."
    );
  }

  const result = await refreshSilverRate();

  if (!result) {
    // 200 rather than 500: the feed being briefly unavailable is expected and
    // the last known good rate is still being served, so this is not an
    // incident worth alerting on.
    return NextResponse.json({
      success: false,
      message: "Feed unavailable; keeping the last known rate.",
    });
  }

  console.log(
    `[cron] Silver rate refreshed to ₹${result.ratePerGram}/g (spot ₹${result.spotPerGram}/g +${result.premiumPercent}%).`
  );

  return NextResponse.json({ success: true, ...result });
}
