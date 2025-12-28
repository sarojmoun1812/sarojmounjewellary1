import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const orderSchema = z.object({
  customer: z.object({
    name: z.string(),
    phone: z.string(),
    email: z.string().email().optional(),
  }),
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().min(1),
      price: z.number(),
    })
  ),
  shippingAddress: z.object({
    name: z.string(),
    phone: z.string(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    pincode: z.string(),
  }),
  paymentMethod: z.enum(["COD", "PREPAID"]),
  notes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validated = orderSchema.parse(body);

    // Calculate totals
    const subtotal = validated.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shipping = subtotal >= 299900 ? 0 : 5000; // Free shipping above ₹2,999
    const total = subtotal + shipping;

    // Find or create customer
    let customer = await prisma.customer.findUnique({
      where: { phone: validated.customer.phone },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name: validated.customer.name,
          phone: validated.customer.phone,
          email: validated.customer.email,
        },
      });
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        customerId: customer.id,
        subtotal,
        shipping,
        total,
        paymentMethod: validated.paymentMethod,
        shippingAddress: validated.shippingAddress,
        notes: validated.notes,
        items: {
          create: validated.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone");

    let where = {};
    if (phone) {
      const customer = await prisma.customer.findUnique({
        where: { phone },
      });
      if (customer) {
        where = { customerId: customer.id };
      }
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
