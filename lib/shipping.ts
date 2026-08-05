/**
 * Shipping rules in one place. Previously the cart, the checkout, the orders
 * API and the terms page each had their own numbers, and all four disagreed.
 * Anything that displays or charges shipping must read from here.
 *
 * All amounts are in paise.
 */

export const DEFAULT_SHIPPING_CHARGE = 9900; // ₹99
export const DEFAULT_FREE_SHIPPING_MIN = 299900; // ₹2,999

export type ShippingSettings = {
  shippingCharge: number;
  freeShippingMin: number | null;
};

export const DEFAULT_SHIPPING_SETTINGS: ShippingSettings = {
  shippingCharge: DEFAULT_SHIPPING_CHARGE,
  freeShippingMin: DEFAULT_FREE_SHIPPING_MIN,
};

export function calculateShipping(
  subtotalInPaise: number,
  settings: ShippingSettings = DEFAULT_SHIPPING_SETTINGS
): number {
  if (subtotalInPaise <= 0) return 0;

  const { shippingCharge, freeShippingMin } = settings;

  if (freeShippingMin !== null && subtotalInPaise >= freeShippingMin) {
    return 0;
  }

  return shippingCharge;
}
