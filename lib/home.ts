import { prisma } from "@/lib/db";
import { calculateProductPrice } from "@/lib/pricing";
import { normalizeProducts, isNewArrival } from "@/lib/products";
import { getCurrentSilverRate } from "@/lib/silver-rate";

/**
 * Homepage data.
 *
 * The homepage used to hardcode four products, four category counts and a grid
 * of stock photos. The product slugs did not match anything in the database, so
 * every "Best Seller" link was a 404, and the prices shown were unrelated to
 * what the silver-rate formula actually charges. Everything here is read from
 * the same tables the shop reads, so the two can no longer disagree.
 */

export interface HomeProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  /** Empty when no real photo has been uploaded yet. */
  image: string;
  fixedPrice?: number | null;
  badge?: string;
}

export interface HomeCategory {
  name: string;
  slug: string;
  image: string;
  count: number;
}

export interface HomeData {
  featuredProducts: HomeProduct[];
  categories: HomeCategory[];
}

export async function getHomeData(): Promise<HomeData> {
  try {
    const [rawProducts, silverRate] = await Promise.all([
      prisma.product.findMany({
        where: { isActive: true },
        orderBy: [
          { bestseller: "desc" },
          { featured: "desc" },
          { createdAt: "desc" },
        ],
      }),
      getCurrentSilverRate(),
    ]);

    const products = normalizeProducts(rawProducts);

    const featuredProducts: HomeProduct[] = products.slice(0, 4).map((product) => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: calculateProductPrice(
        {
          silverWeight: product.silverWeight,
          fixedPrice: product.fixedPrice ?? undefined,
        },
        silverRate.ratePerGram,
        silverRate.labourPerGram
      ).finalPrice,
      image: product.images[0] ?? "",
      fixedPrice: product.fixedPrice ?? null,
      badge:
        product.stock <= 0
          ? "Sold Out"
          : isNewArrival(product.createdAt)
          ? "New!"
          : product.bestseller
          ? "Bestseller"
          : product.featured
          ? "Featured"
          : undefined,
    }));

    // One tile per category that actually has stock listed, with a real count
    // rather than an invented "24+ Designs".
    const byCategory = new Map<string, HomeCategory>();
    for (const product of products) {
      const existing = byCategory.get(product.category);
      if (existing) {
        existing.count += 1;
        if (!existing.image && product.images[0]) {
          existing.image = product.images[0];
        }
        continue;
      }
      byCategory.set(product.category, {
        name: product.category,
        slug: product.category.toLowerCase(),
        image: product.images[0] ?? "",
        count: 1,
      });
    }

    const categories = [...byCategory.values()]
      .sort((a, b) => b.count - a.count)
      .slice(0, 4);

    return { featuredProducts, categories };
  } catch (error) {
    // A homepage that renders without a catalogue is far better than one that
    // 500s, so a database problem degrades to the static sections only.
    console.error("Failed to load homepage data:", error);
    return { featuredProducts: [], categories: [] };
  }
}
