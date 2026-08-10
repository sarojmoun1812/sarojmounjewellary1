/**
 * Dynamic Pricing Utilities for Silver Jewellery
 * Calculates product prices based on current silver rate
 *
 * Client-safe: no database or server-only imports. The server-side rate lookup
 * lives in lib/silver-rate.ts and reuses the constants below.
 */

/**
 * Used only when no rate has ever been recorded. Every product price derives
 * from the rate, so a value that is too low sells stock below the cost of its
 * own metal — review this against the market when it changes materially.
 * Indian retail silver, reviewed 3 Aug 2026 (~₹235/g across metros).
 */
export const FALLBACK_SILVER_RATE_PER_GRAM = 235;

/** A rate outside this band is treated as a bad feed, not a market move. */
export const PLAUSIBLE_MIN_RATE_PER_GRAM = 50;
export const PLAUSIBLE_MAX_RATE_PER_GRAM = 5000;

export function isPlausibleRate(rate: unknown): rate is number {
  return (
    typeof rate === "number" &&
    Number.isFinite(rate) &&
    rate >= PLAUSIBLE_MIN_RATE_PER_GRAM &&
    rate <= PLAUSIBLE_MAX_RATE_PER_GRAM
  );
}

/**
 * Rounds paise to a whole rupee.
 *
 * Every price on the site is displayed to the nearest rupee, and the WhatsApp
 * message is the customer's copy of the bill. If an amount carries paise, the
 * figure she quotes and the figure stored against the order differ, and nobody
 * can see why. Keeping the stored amounts on whole rupees makes the displayed
 * price exact rather than rounded.
 */
export function roundToRupee(paise: number): number {
  return Math.round(paise / 100) * 100;
}

/** Labour and commission per gram, in rupees, when no setting is stored. */
export const DEFAULT_LABOUR_PER_GRAM = 100;

export interface ProductPricing {
  silverWeight: number; // grams
  fixedPrice?: number; // optional override in paise, for one-off pieces
}

export interface PriceBreakdown {
  silverCost: number; // in paise
  labour: number; // in paise — labour and commission
  finalPrice: number; // in paise
  silverRatePerGram: number; // rupees
  labourPerGram: number; // rupees
}

/**
 * The whole price of a piece: weight × (silver rate + labour per gram).
 *
 * She prices every item this way, so there is deliberately nothing else to
 * enter — she types the weight in grams and the rest follows from the daily
 * rate. Per-product making charges and profit used to exist here and were the
 * reason two pieces of the same weight could carry different prices for no
 * reason anyone could explain to a customer.
 *
 * @param silverRatePerGram Her local buying rate in rupees, not spot.
 */
export function calculateProductPrice(
  product: ProductPricing,
  silverRatePerGram: number,
  labourPerGram: number = DEFAULT_LABOUR_PER_GRAM
): PriceBreakdown {
  if (product.fixedPrice) {
    return {
      silverCost: 0,
      labour: 0,
      finalPrice: product.fixedPrice,
      silverRatePerGram,
      labourPerGram,
    };
  }

  const silverCost = Math.round(product.silverWeight * silverRatePerGram * 100);

  // Labour absorbs the rounding so silverCost + labour always equals the price
  // charged. A breakdown whose lines do not add up invites the question of
  // which number is real.
  const rawLabour = Math.round(labourPerGram * product.silverWeight * 100);
  const finalPrice = roundToRupee(silverCost + rawLabour);

  return {
    silverCost,
    labour: finalPrice - silverCost,
    finalPrice,
    silverRatePerGram,
    labourPerGram,
  };
}

/**
 * Format price from paise to rupees with commas
 * @param priceInPaise - Price in paise
 * @returns Formatted price string (e.g., "₹3,499")
 */
export function formatPrice(priceInPaise: number): string {
  const rupees = priceInPaise / 100;
  return `₹${rupees.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

/**
 * Get cached silver rate from localStorage (client-side)
 * Expires after 6 hours
 */
export function getCachedSilverRate(): number | null {
  if (typeof window === "undefined") return null;

  const cached = localStorage.getItem("silverRate");
  if (!cached) return null;

  const { rate, timestamp } = JSON.parse(cached);
  const now = Date.now();
  const sixHours = 6 * 60 * 60 * 1000;

  // Check if cache expired
  if (now - timestamp > sixHours) {
    localStorage.removeItem("silverRate");
    return null;
  }

  return rate;
}

/**
 * Cache silver rate in localStorage (client-side)
 */
export function cacheSilverRate(rate: number): void {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    "silverRate",
    JSON.stringify({
      rate,
      timestamp: Date.now(),
    })
  );
}

/**
 * Fetch current silver rate from API
 */
export async function fetchSilverRate(): Promise<number> {
  try {
    // Check cache first
    const cached = getCachedSilverRate();
    if (isPlausibleRate(cached)) return cached;

    // Fetch from API
    const response = await fetch("/api/silver-rate");
    const data = await response.json();

    if (isPlausibleRate(data?.ratePerGram)) {
      cacheSilverRate(data.ratePerGram);
      return data.ratePerGram;
    }

    return FALLBACK_SILVER_RATE_PER_GRAM;
  } catch (error) {
    console.error("Error fetching silver rate:", error);
    return FALLBACK_SILVER_RATE_PER_GRAM;
  }
}

/**
 * Generate price disclaimer text
 */
export function getPriceDisclaimer(): string {
  return "Price may vary based on current silver market rates. Final price will be confirmed at checkout.";
}
