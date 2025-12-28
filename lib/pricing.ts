/**
 * Dynamic Pricing Utilities for Silver Jewellery
 * Calculates product prices based on current silver rate
 */

export interface ProductPricing {
  silverWeight: number; // grams
  makingCharges: number; // in paise
  profitPercent: number; // percentage
  fixedPrice?: number; // optional override in paise
}

export interface PriceBreakdown {
  silverCost: number; // in paise
  makingCharges: number; // in paise
  subtotal: number; // in paise
  profit: number; // in paise
  finalPrice: number; // in paise
  pricePerGram: number; // silver rate in rupees
}

/**
 * Calculate dynamic product price
 * @param product - Product pricing details
 * @param silverRatePerGram - Current silver rate per gram in rupees
 * @returns Final price in paise and breakdown
 */
export function calculateProductPrice(
  product: ProductPricing,
  silverRatePerGram: number
): PriceBreakdown {
  // If fixed price is set, use it
  if (product.fixedPrice) {
    return {
      silverCost: 0,
      makingCharges: 0,
      subtotal: product.fixedPrice,
      profit: 0,
      finalPrice: product.fixedPrice,
      pricePerGram: silverRatePerGram,
    };
  }

  // Calculate silver cost
  const silverCost = Math.round(
    product.silverWeight * silverRatePerGram * 100
  ); // in paise

  // Add making charges
  const subtotal = silverCost + product.makingCharges;

  // Calculate profit
  const profit = Math.round(subtotal * (product.profitPercent / 100));

  // Final price
  const finalPrice = subtotal + profit;

  return {
    silverCost,
    makingCharges: product.makingCharges,
    subtotal,
    profit,
    finalPrice,
    pricePerGram: silverRatePerGram,
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
    if (cached) return cached;

    // Fetch from API
    const response = await fetch("/api/silver-rate");
    const data = await response.json();

    if (data.success && data.ratePerGram) {
      // Cache the rate
      cacheSilverRate(data.ratePerGram);
      return data.ratePerGram;
    }

    // Fallback rate
    return 95.0;
  } catch (error) {
    console.error("Error fetching silver rate:", error);
    return 95.0; // Fallback
  }
}

/**
 * Generate price disclaimer text
 */
export function getPriceDisclaimer(): string {
  return "Price may vary based on current silver market rates. Final price will be confirmed at checkout.";
}
