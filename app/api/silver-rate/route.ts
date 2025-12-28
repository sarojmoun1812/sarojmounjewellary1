import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Metal Price API - Free tier: 100 requests/month
// Alternative: https://metalpriceapi.com/
const METAL_PRICE_API_KEY = process.env.METAL_PRICE_API_KEY || "";
const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

/**
 * Fetches current silver rate from external API
 * Free API: https://metalpriceapi.com/
 * Returns rate per gram in INR
 */
async function fetchSilverRateFromAPI(): Promise<number> {
  try {
    // Using MetalPriceAPI.com (Free: 100 requests/month)
    const response = await fetch(
      `https://api.metalpriceapi.com/v1/latest?api_key=${METAL_PRICE_API_KEY}&base=INR&currencies=XAG`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch silver rate");
    }

    const data = await response.json();
    
    // XAG is silver troy ounce
    // 1 troy ounce = 31.1035 grams
    const silverPerOunce = 1 / data.rates.XAG; // Price per troy ounce in INR
    const silverPerGram = silverPerOunce / 31.1035; // Price per gram

    return Math.round(silverPerGram * 100) / 100; // Round to 2 decimals
  } catch (error) {
    console.error("Error fetching silver rate:", error);
    
    // Fallback: Return approximate Indian silver rate
    // This is a backup in case API fails
    return 95.0; // Default rate per gram
  }
}

/**
 * GET /api/silver-rate
 * Returns current cached silver rate or fetches new one if expired
 */
export async function GET() {
  try {
    // Check for cached rate in database
    const latestRate = await prisma.silverRate.findFirst({
      orderBy: { updatedAt: "desc" },
    });

    const now = new Date();
    const needsUpdate =
      !latestRate ||
      now.getTime() - latestRate.updatedAt.getTime() > CACHE_DURATION;

    if (needsUpdate) {
      // Fetch new rate from API
      const newRate = await fetchSilverRateFromAPI();

      // Store in database
      const updatedRate = await prisma.silverRate.create({
        data: {
          ratePerGram: newRate,
          source: "MetalPriceAPI",
        },
      });

      return NextResponse.json({
        success: true,
        ratePerGram: updatedRate.ratePerGram,
        updatedAt: updatedRate.updatedAt,
        cached: false,
      });
    }

    // Return cached rate
    return NextResponse.json({
      success: true,
      ratePerGram: latestRate.ratePerGram,
      updatedAt: latestRate.updatedAt,
      cached: true,
    });
  } catch (error) {
    console.error("Error in silver rate API:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch silver rate",
        ratePerGram: 95.0, // Fallback rate
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/silver-rate
 * Manually update silver rate (for admin override)
 */
export async function POST(request: Request) {
  try {
    const { ratePerGram } = await request.json();

    if (!ratePerGram || ratePerGram <= 0) {
      return NextResponse.json(
        { error: "Invalid rate provided" },
        { status: 400 }
      );
    }

    const updatedRate = await prisma.silverRate.create({
      data: {
        ratePerGram,
        source: "Manual Admin Update",
      },
    });

    return NextResponse.json({
      success: true,
      ratePerGram: updatedRate.ratePerGram,
      updatedAt: updatedRate.updatedAt,
    });
  } catch (error) {
    console.error("Error updating silver rate:", error);
    return NextResponse.json(
      { error: "Failed to update silver rate" },
      { status: 500 }
    );
  }
}
