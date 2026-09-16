import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { enforceRateLimit } from "@/lib/rate-limit";

/**
 * Customer tapped "Maine pay kar diya" after scanning the UPI QR.
 * Does not mark the order PAID — admin confirms when money arrives.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const limited = enforceRateLimit(request, "payment-claimed", {
      limit: 10,
      windowMs: 10 * 60 * 1000,
      message: "Thoda rukein, phir try karein.",
    });
    if (limited) return limited;

    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      select: { id: true, paymentStatus: true, paymentClaimedAt: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order nahi mila" }, { status: 404 });
    }

    if (order.paymentStatus === "PAID") {
      return NextResponse.json({ success: true, alreadyPaid: true });
    }

    if (order.paymentClaimedAt) {
      return NextResponse.json({ success: true, alreadyClaimed: true });
    }

    await prisma.order.update({
      where: { id },
      data: { paymentClaimedAt: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Payment claimed error:", error);
    return NextResponse.json(
      { error: "Update nahi ho paaya. Dobara try karein." },
      { status: 500 }
    );
  }
}
