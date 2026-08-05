import { z } from "zod";
import { prisma } from "./db";
import { calculateProductPrice } from "./pricing";
import { getCurrentSilverRate } from "./silver-rate";
import { parseStringArray } from "./products";
import {
  calculateShipping,
  DEFAULT_SHIPPING_SETTINGS,
  type ShippingSettings,
} from "./shipping";
import {
  calculateGst,
  DEFAULT_GST_SETTINGS,
  type GstBreakdown,
  type GstSettings,
} from "./tax";

/**
 * Prices are always recomputed here from the database and the live silver rate.
 * The browser sends product IDs and quantities only — never an amount — so a
 * tampered cart cannot change what an item costs.
 */

export const cartItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(99),
});

export const cartSchema = z.array(cartItemSchema).min(1, "Your cart is empty");

export type CartItemInput = z.infer<typeof cartItemSchema>;

export type PricedLine = {
  productId: string;
  name: string;
  slug: string;
  image: string | null;
  silverWeight: number;
  quantity: number;
  /** Paise, per unit. */
  unitPrice: number;
  /** Paise, unitPrice × quantity. */
  lineTotal: number;
  /** Quantity actually available, when it is less than requested. */
  availableStock: number;
};

export type CartQuote = {
  lines: PricedLine[];
  subtotal: number;
  shipping: number;
  /** GST breakdown for the goods. Shipping is part of the same composite supply. */
  gst: GstBreakdown;
  total: number;
  silverRatePerGram: number;
  /** Products that no longer exist, are inactive, or are out of stock. */
  unavailable: { productId: string; name: string | null; reason: string }[];
};

export async function getShippingSettings(): Promise<ShippingSettings> {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "settings" },
      select: { shippingCharge: true, freeShippingMin: true },
    });

    if (!settings) return DEFAULT_SHIPPING_SETTINGS;

    return {
      shippingCharge: settings.shippingCharge,
      freeShippingMin: settings.freeShippingMin,
    };
  } catch {
    return DEFAULT_SHIPPING_SETTINGS;
  }
}

export async function getGstSettings(): Promise<GstSettings> {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "settings" },
      select: { gstRate: true, gstInclusive: true },
    });

    if (!settings) return DEFAULT_GST_SETTINGS;

    return {
      gstRate: settings.gstRate,
      gstInclusive: settings.gstInclusive,
    };
  } catch {
    return DEFAULT_GST_SETTINGS;
  }
}

/**
 * Turns a list of product IDs and quantities into authoritative pricing.
 * Unavailable products are reported rather than silently dropped, so the
 * customer is told why their total changed.
 */
export async function quoteCart(items: CartItemInput[]): Promise<CartQuote> {
  const [{ ratePerGram }, shippingSettings, gstSettings] = await Promise.all([
    getCurrentSilverRate(),
    getShippingSettings(),
    getGstSettings(),
  ]);

  // Collapse duplicate IDs so a repeated entry cannot exceed available stock.
  const requested = new Map<string, number>();
  for (const item of items) {
    requested.set(
      item.productId,
      (requested.get(item.productId) ?? 0) + item.quantity
    );
  }

  const products = await prisma.product.findMany({
    where: { id: { in: Array.from(requested.keys()) } },
  });
  const byId = new Map(products.map((product) => [product.id, product]));

  const lines: PricedLine[] = [];
  const unavailable: CartQuote["unavailable"] = [];

  for (const [productId, quantity] of requested) {
    const product = byId.get(productId);

    if (!product || !product.isActive) {
      unavailable.push({
        productId,
        name: product?.name ?? null,
        reason: "no longer available",
      });
      continue;
    }

    if (product.stock <= 0) {
      unavailable.push({
        productId,
        name: product.name,
        reason: "out of stock",
      });
      continue;
    }

    const grantedQuantity = Math.min(quantity, product.stock);

    const { finalPrice } = calculateProductPrice(
      {
        silverWeight: product.silverWeight,
        makingCharges: product.makingCharges,
        profitPerGram: product.profitPerGram,
        fixedPrice: product.fixedPrice ?? undefined,
      },
      ratePerGram
    );

    lines.push({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: parseStringArray(product.images)[0] ?? null,
      silverWeight: product.silverWeight,
      quantity: grantedQuantity,
      unitPrice: finalPrice,
      lineTotal: finalPrice * grantedQuantity,
      availableStock: product.stock,
    });
  }

  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);

  // Free-shipping thresholds are advertised against the ticket price the
  // customer sees, so the threshold is compared before GST is added on top.
  const shipping = calculateShipping(subtotal, shippingSettings);
  const gst = calculateGst(subtotal, gstSettings);

  // When prices already contain GST the tax is inside `subtotal`, so adding it
  // again would double-charge.
  const total = gst.inclusive
    ? subtotal + shipping
    : subtotal + gst.amount + shipping;

  return {
    lines,
    subtotal,
    shipping,
    gst,
    total,
    silverRatePerGram: ratePerGram,
    unavailable,
  };
}
