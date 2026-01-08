import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// POST /api/product-inquiry - Submit product inquiry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, name, email, phone, message } = body;

    if (!productId || !name || !phone) {
      return NextResponse.json(
        { error: "Product, name, and phone are required" },
        { status: 400 }
      );
    }

    // Validate phone number
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone.replace(/\D/g, "").slice(-10))) {
      return NextResponse.json(
        { error: "Invalid phone number" },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    const inquiry = await prisma.productInquiry.create({
      data: {
        productId,
        name,
        email: email || null,
        phone: phone.replace(/\D/g, "").slice(-10),
        message: message || null,
        status: "NEW",
      },
    });

    // Also create a lead
    await prisma.lead.create({
      data: {
        name,
        email: email || null,
        phone: phone.replace(/\D/g, "").slice(-10),
        source: "PRODUCT_INQUIRY",
        message: `Inquiry for: ${product.name}${message ? ` - ${message}` : ""}`,
        status: "NEW",
      },
    });

    return NextResponse.json(
      { success: true, id: inquiry.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Product inquiry error:", error);
    return NextResponse.json(
      { error: "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}
