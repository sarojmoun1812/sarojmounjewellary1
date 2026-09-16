import { prisma } from "./db";

export const DEFAULT_UPI_ID = "sarojmoun1812-1@okicici";
export const DEFAULT_UPI_PAYEE_NAME = "Saroj Moun";
export const DEFAULT_UPI_QR_URL = "/upi-qr.png";

export type UpiDetails = {
  upiId: string;
  payeeName: string;
  qrUrl: string;
};

/** UPI collect details from admin settings, with shop defaults. */
export async function getUpiDetails(): Promise<UpiDetails> {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: "settings" },
      select: { upiId: true, upiPayeeName: true, upiQrUrl: true },
    });

    return {
      upiId: settings?.upiId?.trim() || DEFAULT_UPI_ID,
      payeeName: settings?.upiPayeeName?.trim() || DEFAULT_UPI_PAYEE_NAME,
      qrUrl: settings?.upiQrUrl?.trim() || DEFAULT_UPI_QR_URL,
    };
  } catch {
    return {
      upiId: DEFAULT_UPI_ID,
      payeeName: DEFAULT_UPI_PAYEE_NAME,
      qrUrl: DEFAULT_UPI_QR_URL,
    };
  }
}

/**
 * Deep link that opens GPay / PhonePe / Paytm with amount prefilled.
 * Amount is in paise on our side; UPI expects rupees with up to 2 decimals.
 */
export function buildUpiPayUrl({
  upiId,
  payeeName,
  amountPaise,
  orderNumber,
}: {
  upiId: string;
  payeeName: string;
  amountPaise: number;
  orderNumber: string;
}): string {
  const amountRupees = (amountPaise / 100).toFixed(2);
  const params = new URLSearchParams({
    pa: upiId,
    pn: payeeName,
    am: amountRupees,
    cu: "INR",
    tn: `Order ${orderNumber}`,
  });
  return `upi://pay?${params.toString()}`;
}
