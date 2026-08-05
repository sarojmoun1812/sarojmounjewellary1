/**
 * GST on jewellery.
 *
 * Off by default, and it must stay off: this is an unregistered personal
 * business with no GSTIN, and section 32 of the CGST Act forbids anyone who is
 * not registered from collecting tax. A rate above zero here would put an
 * illegal charge on every order, so only raise it after registration.
 *
 * The calculation is kept for that day. When it is enabled, silver jewellery is
 * a composite supply taxed at 3% (HSN 7113) — the making charges are not billed
 * at a separate rate, and shipping is part of the same supply rather than taxed
 * on its own.
 *
 * Client-safe: no database or server-only imports.
 */

import { roundToRupee } from "./pricing";

/** Percent, not a fraction. Zero means no GST is charged or shown anywhere. */
export const DEFAULT_GST_RATE = 0;

/** The rate to use if she registers for GST. Not applied until she does. */
export const REGISTERED_JEWELLERY_GST_RATE = 3;

export interface GstSettings {
  /** Percent. */
  gstRate: number;
  /** True when the catalogue price already contains GST. */
  gstInclusive: boolean;
}

export const DEFAULT_GST_SETTINGS: GstSettings = {
  gstRate: DEFAULT_GST_RATE,
  gstInclusive: false,
};

export interface GstBreakdown {
  /** Percent applied. */
  rate: number;
  /** Paise of tax. */
  amount: number;
  /** Paise, excluding tax. */
  taxableValue: number;
  /** Paise, including tax. */
  grossValue: number;
  inclusive: boolean;
}

/**
 * Splits an amount into taxable value and tax.
 *
 * When prices are GST-inclusive the tax is extracted from the amount rather
 * than added to it, so the customer still pays exactly the advertised price.
 */
export function calculateGst(
  amountInPaise: number,
  settings: GstSettings = DEFAULT_GST_SETTINGS
): GstBreakdown {
  const rate = Number.isFinite(settings.gstRate) ? Math.max(settings.gstRate, 0) : 0;

  if (rate === 0 || amountInPaise <= 0) {
    return {
      rate,
      amount: 0,
      taxableValue: Math.max(amountInPaise, 0),
      grossValue: Math.max(amountInPaise, 0),
      inclusive: settings.gstInclusive,
    };
  }

  if (settings.gstInclusive) {
    const taxableValue = roundToRupee(amountInPaise / (1 + rate / 100));
    return {
      rate,
      amount: amountInPaise - taxableValue,
      taxableValue,
      grossValue: amountInPaise,
      inclusive: true,
    };
  }

  const amount = roundToRupee((amountInPaise * rate) / 100);
  return {
    rate,
    amount,
    taxableValue: amountInPaise,
    grossValue: amountInPaise + amount,
    inclusive: false,
  };
}

/** Short label for price displays, e.g. "Inclusive of 3% GST". */
export function gstLabel(settings: GstSettings = DEFAULT_GST_SETTINGS): string {
  if (settings.gstRate <= 0) return "";
  return settings.gstInclusive
    ? `Inclusive of ${settings.gstRate}% GST`
    : `${settings.gstRate}% GST added at checkout`;
}
