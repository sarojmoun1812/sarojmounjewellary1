import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { normalizeProducts, isNewArrival } from "@/lib/products";
import { calculateProductPrice } from "@/lib/pricing";
import { getCurrentSilverRate } from "@/lib/silver-rate";
import { pageMetadata, BRAND_NAME_VARIANTS } from "@/lib/seo";
import { ShopPageClient } from "./shop-client";

export const metadata: Metadata = pageMetadata({
  title: "Shop Handcrafted 925 Silver Jewellery",
  description:
    "Shop handcrafted 925 sterling silver jewellery online from Saroj Moun Jewellery, Jind, Haryana. Browse necklaces, earrings, rings, kadas and oxidized silver — hallmark certified, wholesale priced.",
  path: "/shop",
  keywords: [
    ...BRAND_NAME_VARIANTS,
    "buy silver jewellery online",
    "925 silver jewellery shop",
    "handcrafted silver jewellery",
    "silver necklace",
    "silver earrings",
    "silver rings",
    "silver kada",
    "oxidized silver jewellery",
    "silver jewellery Jind",
  ],
});

export const dynamic = "force-dynamic";

async function getProducts(category?: string) {
  try {
    const where: any = { isActive: true };
    if (category && category !== "all") {
      where.category = category;
    }

    return await prisma.product.findMany({
      where,
      orderBy: [
        { featured: "desc" },
        { bestseller: "desc" },
        { createdAt: "desc" },
      ],
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

async function getCategories() {
  try {
    const categories = await prisma.product.findMany({
      where: { isActive: true },
      select: { category: true },
      distinct: ["category"],
    });
    return categories.map((c) => c.category);
  } catch {
    return [];
  }
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { category?: string; sort?: string };
}) {
  const [categories, silverRate] = await Promise.all([
    getCategories(),
    getCurrentSilverRate(),
  ]);

  const requested = searchParams.category;
  const category =
    requested && requested !== "all"
      ? categories.find((c) => c.toLowerCase() === requested.toLowerCase()) ??
        requested
      : requested;

  const rawProducts = await getProducts(category);

  const products = normalizeProducts(rawProducts).map((product) => ({
    ...product,
    isNew: isNewArrival(product.createdAt),
    price: calculateProductPrice(
      {
        silverWeight: product.silverWeight,
        fixedPrice: product.fixedPrice ?? undefined,
      },
      silverRate.ratePerGram,
      silverRate.labourPerGram
    ).finalPrice,
  }));

  return (
    <ShopPageClient
      products={products as any}
      categories={categories}
      silverRate={silverRate.ratePerGram}
      selectedCategory={category}
    />
  );
}
