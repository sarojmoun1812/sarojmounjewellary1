import { NextRequest, NextResponse } from "next/server";
import { prisma, containsInsensitive } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import {
  normalizeProduct,
  normalizeProducts,
  productCreateSchema,
  toProductCreateData,
} from "@/lib/products";

// GET /api/admin/products - Get all products
export async function GET(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const category = searchParams.get("category");

    const where: any = {};

    if (search) {
      where.OR = [
        { name: containsInsensitive(search) },
        { slug: containsInsensitive(search) },
      ];
    }

    if (category) {
      where.category = category;
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ products: normalizeProducts(products) });
  } catch (error) {
    console.error("Get products error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST /api/admin/products - Create product
export async function POST(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parsed = productCreateSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: parsed.error.errors[0]?.message ?? "Invalid product details",
          details: parsed.error.errors,
        },
        { status: 400 }
      );
    }

    const existing = await prisma.product.findUnique({
      where: { slug: parsed.data.slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: "A product with this URL name already exists" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: toProductCreateData(parsed.data),
    });

    return NextResponse.json({ product: normalizeProduct(product) }, { status: 201 });
  } catch (error) {
    console.error("Create product error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
