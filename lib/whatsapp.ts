import { prisma } from "./db";
import { formatPrice } from "./pricing";
import { WHATSAPP_NUMBER } from "./constants";
import { absoluteUrl } from "./site";
import type { PricedLine } from "./orders";
import type { GstBreakdown } from "./tax";

export function normalizeWhatsAppNumber(value: string | null | undefined): string | null {
  if (!value) return null;
  const digits = value.replace(/\D/g, "");
  // A bare 10-digit Indian mobile needs the country code prefixed.
  if (/^[6-9]\d{9}$/.test(digits)) return `91${digits}`;
  return digits.length >= 11 ? digits : null;
}

/** Her WhatsApp number, preferring the value she can edit in admin settings. */
export async function getWhatsAppNumber(): Promise<string> {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "settings" },
      select: { whatsapp: true, phone: true },
    });

    const fromSettings =
      normalizeWhatsAppNumber(settings?.whatsapp) ??
      normalizeWhatsAppNumber(settings?.phone);
    if (fromSettings) return fromSettings;
  } catch {
    // Fall through to the environment value.
  }

  return (
    normalizeWhatsAppNumber(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER) ??
    WHATSAPP_NUMBER
  );
}

type OrderMessageInput = {
  phoneNumber: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  lines: PricedLine[];
  subtotal: number;
  shipping: number;
  gst?: GstBreakdown;
  total: number;
  shippingAddress?: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  notes?: string;
};

/**
 * Builds the wa.me link the customer sends. The message is the order record in
 * her chat, so it has to be readable on its own without opening the admin panel.
 *
 * Each line includes the product page URL so she can open the piece (and its
 * photos) from the chat. Image files cannot be attached via wa.me text links.
 */
export function buildWhatsAppOrderUrl({
  phoneNumber,
  orderNumber,
  customerName,
  customerPhone,
  lines,
  subtotal,
  shipping,
  gst,
  total,
  shippingAddress,
  notes,
}: OrderMessageInput): string {
  const parts: string[] = [
    `Namaste! I would like to place this order.`,
    ``,
    `Order: ${orderNumber}`,
    `Name: ${customerName}`,
    `Phone: ${customerPhone}`,
    ``,
    `Items:`,
  ];

  for (const [index, line] of lines.entries()) {
    const productPage = absoluteUrl(`/product/${line.slug}`);

    parts.push(
      `${index + 1}. ${line.name}`,
      `   ${line.silverWeight}g × ${line.quantity} — ${formatPrice(line.lineTotal)}`,
      `   Product: ${productPage}`,
      ``
    );
  }

  parts.push(`Subtotal: ${formatPrice(subtotal)}`);
  if (gst && gst.amount > 0 && !gst.inclusive) {
    parts.push(`GST (${gst.rate}%): ${formatPrice(gst.amount)}`);
  }
  parts.push(shipping === 0 ? `Shipping: Free` : `Shipping: ${formatPrice(shipping)}`);
  parts.push(`Total: ${formatPrice(total)}`);
  if (gst && gst.amount > 0 && gst.inclusive) {
    parts.push(`(incl. ${gst.rate}% GST ${formatPrice(gst.amount)})`);
  }

  if (shippingAddress) {
    parts.push(
      ``,
      `Delivery address:`,
      shippingAddress.address,
      shippingAddress.landmark ? `Near ${shippingAddress.landmark}` : "",
      `${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.pincode}`
    );
  }

  if (notes) {
    parts.push(``, `Note: ${notes}`);
  }

  const message = parts.filter((part) => part !== "").join("\n");

  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
}
