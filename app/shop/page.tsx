import { Metadata } from "next";
import { prisma } from "@/lib/db";
import { ShopPageClient } from "./shop-client";

export const metadata: Metadata = {
  title: "Shop Silver Jewellery | Saroj Moun Jewellery",
  description: "Browse our complete collection of handcrafted 925 sterling silver jewellery. Necklaces, earrings, kadas, rings and more. Free shipping above ₹2999.",
  keywords: ["silver jewellery", "925 silver", "buy silver jewellery online", "silver necklace", "silver earrings", "silver kada"],
  openGraph: {
    title: "Shop Silver Jewellery Collection | Saroj Moun",
    description: "Handcrafted 925 sterling silver jewellery with hallmark certification. Browse necklaces, earrings, kadas and more.",
    images: ["/peacock-jewellery.jpeg"],
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

async function getSilverRate() {
  try {
    const rate = await prisma.silverRate.findFirst({
      orderBy: { updatedAt: "desc" },
    });
    return rate?.ratePerGram || 95;
  } catch {
    return 95;
  }
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { category?: string; sort?: string };
}) {
  const [products, categories, silverRate] = await Promise.all([
    getProducts(searchParams.category),
    getCategories(),
    getSilverRate(),
  ]);

  return (
    <ShopPageClient
      products={products}
      categories={categories}
      silverRate={silverRate}
      selectedCategory={searchParams.category}
    />
  );
}
