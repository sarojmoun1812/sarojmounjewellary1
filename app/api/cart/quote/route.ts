import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { cartSchema, quoteCart } from "@/lib/orders";
import { enforceRateLimit } from "@/lib/rate-limit";

/**
 * POST /api/cart/quote
 *
 * Prices a cart from the server so the customer always sees the current
 * silver rate rather than whatever was cached in their browser. Read-only.
 */
export async function POST(request: NextRequest) {
  try {
    // Each quote runs a database query per line, so this is the cheapest way to
    // load the free-tier Render database from outside. Generous enough that real
    // cart editing never trips it.
    const limited = enforceRateLimit(request, "cart-quote", {
      limit: 60,
      windowMs: 60 * 1000,
    });
    if (limited) return limited;

    const parsed = cartSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message ?? "Invalid cart" },
        { status: 400 }
      );
    }

    const quote = await quoteCart(parsed.data);
    return NextResponse.json(quote);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid cart" }, { status: 400 });
    }

    console.error("Cart quote error:", error);
    return NextResponse.json(
      { error: "Could not price your cart" },
      { status: 500 }
    );
  }
}
