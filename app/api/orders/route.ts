import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { cartSchema, quoteCart } from "@/lib/orders";
import { formatPrice } from "@/lib/pricing";
import { buildWhatsAppOrderUrl, getWhatsAppNumber } from "@/lib/whatsapp";
import { enforceRateLimit } from "@/lib/rate-limit";

/**
 * Orders are placed over WhatsApp: this route records the order so she has it
 * in the admin panel, then hands back a prefilled WhatsApp link for the
 * customer to send. No payment is taken online.
 *
 * There is deliberately no GET handler — an unauthenticated one previously
 * returned every customer's name, phone and address. Order history lives
 * behind admin auth at /api/admin/orders.
 */

const orderSchema = z.object({
  customer: z.object({
    name: z.string().trim().min(1, "Please enter your name"),
    phone: z
      .string()
      .trim()
      .transform((value) => value.replace(/\D/g, "").slice(-10))
      .refine((value) => /^[6-9]\d{9}$/.test(value), "Enter a valid mobile number"),
    email: z.string().trim().email().optional().or(z.literal("")),
  }),
  items: cartSchema,
  shippingAddress: z
    .object({
      address: z.string().trim().min(1),
      city: z.string().trim().min(1),
      state: z.string().trim().min(1),
      pincode: z
        .string()
        .trim()
        .regex(/^\d{6}$/, "Enter a valid 6-digit PIN code"),
      landmark: z.string().trim().optional(),
    })
    .optional(),
  notes: z.string().trim().max(1000).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const limited = enforceRateLimit(request, "orders", {
      limit: 5,
      windowMs: 10 * 60 * 1000,
      message: "You've placed several orders just now. Please wait a few minutes.",
    });
    if (limited) return limited;

    const parsed = orderSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: parsed.error.errors[0]?.message ?? "Please check your details",
          details: parsed.error.errors,
        },
        { status: 400 }
      );
    }

    const { customer, items, shippingAddress, notes } = parsed.data;

    // Prices come from the database and the live silver rate, never the client.
    const quote = await quoteCart(items);

    if (quote.lines.length === 0) {
      return NextResponse.json(
        {
          error:
            "None of the items in your cart are available right now. Please refresh and try again.",
          unavailable: quote.unavailable,
        },
        { status: 409 }
      );
    }

    const email = customer.email ? customer.email.toLowerCase() : null;

    const order = await prisma.$transaction(async (tx) => {
      const existingCustomer = await tx.customer.findUnique({
        where: { phone: customer.phone },
      });

      const customerRecord = existingCustomer
        ? await tx.customer.update({
            where: { id: existingCustomer.id },
            data: {
              name: customer.name,
              ...(email ? { email } : {}),
            },
          })
        : await tx.customer.create({
            data: { name: customer.name, phone: customer.phone, email },
          });

      const created = await tx.order.create({
        data: {
          customerId: customerRecord.id,
          subtotal: quote.subtotal,
          tax: quote.gst.amount,
          taxRate: quote.gst.rate,
          shipping: quote.shipping,
          total: quote.total,
          status: "PENDING",
          paymentMethod: "WHATSAPP",
          paymentStatus: "PENDING",
          shippingAddress: JSON.stringify({
            name: customer.name,
            phone: customer.phone,
            ...(shippingAddress ?? {}),
          }),
          notes: notes || null,
          items: {
            create: quote.lines.map((line) => ({
              productId: line.productId,
              quantity: line.quantity,
              price: line.unitPrice,
            })),
          },
        },
      });

      // Stock is deliberately not decremented here. Orders are confirmed by
      // hand over WhatsApp, and an unconfirmed submission reducing stock would
      // let anyone empty the shop's inventory by filling in the form.
      await tx.lead.create({
        data: {
          name: customer.name,
          email,
          phone: customer.phone,
          source: "WHATSAPP",
          message: `Order ${created.orderNumber} — ${quote.lines.length} item(s), ${formatPrice(
            quote.total
          )}`,
          status: "NEW",
        },
      });

      return created;
    });

    return NextResponse.json(
      {
        success: true,
        orderNumber: order.orderNumber,
        subtotal: quote.subtotal,
        gst: quote.gst,
        shipping: quote.shipping,
        total: quote.total,
        unavailable: quote.unavailable,
        whatsappUrl: buildWhatsAppOrderUrl({
          phoneNumber: await getWhatsAppNumber(),
          orderNumber: order.orderNumber,
          customerName: customer.name,
          customerPhone: customer.phone,
          lines: quote.lines,
          subtotal: quote.subtotal,
          shipping: quote.shipping,
          gst: quote.gst,
          total: quote.total,
          shippingAddress,
          notes,
        }),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create order error:", error);
    return NextResponse.json(
      { error: "Could not place your order. Please try again." },
      { status: 500 }
    );
  }
}
