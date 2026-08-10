import { NextRequest, NextResponse } from "next/server";
import { prisma, containsInsensitive } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import {
  normalizeProduct,
  normalizeProducts,
  productCreateSchema,
  slugify,
  toProductCreateData,
} from "@/lib/products";

/**
 * Finds a free slug, appending -2, -3 and so on. Returns null if the base is
 * empty (a name with no letters or digits) or if too many collisions pile up.
 */
async function resolveUniqueSlug(base: string): Promise<string | null> {
  if (!base) return null;

  for (let suffix = 1; suffix <= 50; suffix++) {
    const candidate = suffix === 1 ? base : `${base}-${suffix}`;
    const clash = await prisma.product.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!clash) return candidate;
  }

  return null;
}

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

    // She types a name, not a URL. Two pieces can legitimately share a name, so
    // a repeat gets a numeric suffix instead of an error she cannot act on.
    const slug = await resolveUniqueSlug(
      parsed.data.slug || slugify(parsed.data.name)
    );

    if (!slug) {
      return NextResponse.json(
        { error: "Is naam se link nahi ban paaya. Naam thoda badal ke dekhein." },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: toProductCreateData({ ...parsed.data, slug }),
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
