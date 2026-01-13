import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const bestseller = searchParams.get("bestseller");

    const where: any = {};
    if (category) where.category = category;
    if (featured === "true") where.featured = true;
    if (bestseller === "true") where.bestseller = true;

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Basic validation
    if (!body.name || !body.silverWeight || !body.slug) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description || "",
        silverWeight: body.silverWeight,
        makingCharges: body.makingCharges || 0,
        profitPerGram: body.profitPerGram || 100.0,
        fixedPrice: body.fixedPrice || null,
        category: body.category,
        images: body.images || [],
        stock: body.stock || 0,
        material: body.material || "925 Silver",
        featured: body.featured || false,
        bestseller: body.bestseller || false,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
