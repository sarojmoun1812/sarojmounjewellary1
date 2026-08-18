import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { normalizeProducts, isNewArrival } from "@/lib/products";
import { calculateProductPrice } from "@/lib/pricing";
import { getCurrentSilverRate } from "@/lib/silver-rate";
import { ShopPageClient } from "./shop-client";

export const metadata: Metadata = {
  title: "Shop Silver Jewellery | Saroj Moun Jewellery",
  description: "Browse our complete collection of handcrafted 925 sterling silver jewellery. Necklaces, earrings, kadas, rings and more. Free shipping above ₹2999.",
  keywords: ["silver jewellery", "925 silver", "buy silver jewellery online", "silver necklace", "silver earrings", "silver kada"],
  openGraph: {
    title: "Shop Silver Jewellery Collection | Saroj Moun",
    description: "Handcrafted 925 sterling silver jewellery with hallmark certification. Browse necklaces, earrings, kadas and more.",
  },
};

// Force dynamic rendering to always fetch fresh products
export const dynamic = "force-dynamic";

async function getProducts(category?: string) {
  try {
    const where: any = { isActive: true };
    if (category && category !== "all") {
      where.category = category;
    }


    const products = await prisma.product.findMany({
      where,
      orderBy: [
        { featured: "desc" },
        { bestseller: "desc" },
        { createdAt: "desc" },
      ],
    });

    return products;
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

  // Links from the sitemap and from older bookmarks are lowercased, but products
  // store "Necklaces". Matching the requested value against what is actually in
  // the catalogue keeps the filter exact without being case-sensitive; before
  // this, "?category=necklaces" quietly rendered an empty shop.
  const requested = searchParams.category;
  const category =
    requested && requested !== "all"
      ? categories.find((c) => c.toLowerCase() === requested.toLowerCase()) ??
        requested
      : requested;

  const rawProducts = await getProducts(category);

  // Priced here rather than in the browser. The client used to recompute every
  // price from the raw weight and rate, which meant the grid could quietly show
  // a different figure than the cart charged if either input disagreed.
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
