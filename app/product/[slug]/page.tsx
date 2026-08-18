import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { normalizeProduct, normalizeProducts, isNewArrival } from "@/lib/products";
import { getCurrentSilverRate } from "@/lib/silver-rate";
import { calculateProductPrice } from "@/lib/pricing";
import { getGstSettings } from "@/lib/orders";
import { ProductDetailClient } from "./product-client";
import { ProductSchema, BreadcrumbSchema } from "@/components/structured-data";
import { SITE_URL } from "@/lib/site";

interface Props {
  params: { slug: string };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const raw = await getProduct(params.slug);

  if (!raw) {
    return {
      title: "Product Not Found",
    };
  }

  const product = normalizeProduct(raw);
  const keywords =
    product.tags.length > 0
      ? product.tags.join(", ")
      : `${product.category}, silver jewellery, 925 silver`;

  return {
    title: `${product.name} | Saroj Moun Jewellery`,
    description: product.metaDescription || product.description.slice(0, 160),
    keywords,
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 200),
      ...(product.images.length > 0 ? { images: [product.images[0]] } : {}),
      type: "website",
    },
  };
}

async function getProduct(slug: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { slug },
    });
    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

async function getRelatedProducts(category: string, currentId: string) {
  try {
    const products = await prisma.product.findMany({
      where: {
        category,
        id: { not: currentId },
        isActive: true,
      },
      take: 4,
      orderBy: { bestseller: "desc" },
    });
    return products;
  } catch {
    return [];
  }
}

export default async function ProductPage({ params }: Props) {
  const [product, silverRateInfo, gst] = await Promise.all([
    getProduct(params.slug),
    getCurrentSilverRate(),
    getGstSettings(),
  ]);

  if (!product) {
    notFound();
  }

  const silverRate = silverRateInfo.ratePerGram;
  const relatedProducts = await getRelatedProducts(product.category, product.id);

  const parsedProduct = normalizeProduct(product);
  const parsedRelated = normalizeProducts(relatedProducts);

  // Priced on the server so the page, the structured data Google reads and the
  // cart all quote one figure. The client used to recompute this itself.
  const priceOf = (item: { silverWeight: number; fixedPrice?: number | null }) =>
    calculateProductPrice(
      {
        silverWeight: item.silverWeight,
        fixedPrice: item.fixedPrice ?? undefined,
      },
      silverRate,
      silverRateInfo.labourPerGram
    );

  const breakdown = priceOf(parsedProduct);
  const relatedWithPrices = parsedRelated.map((item) => ({
    ...item,
    price: priceOf(item).finalPrice,
  }));

  const breadcrumbs = [
    { name: "Home", url: SITE_URL },
    { name: "Shop", url: `${SITE_URL}/shop` },
    { name: product.category, url: `${SITE_URL}/shop?category=${product.category.toLowerCase()}` },
    { name: product.name, url: `${SITE_URL}/product/${product.slug}` },
  ];

  return (
    <>
      <ProductSchema
        product={{
          name: parsedProduct.name,
          description: parsedProduct.description,
          images: parsedProduct.images,
          slug: parsedProduct.slug,
          // Must match the price shown on the page, or Google flags a mismatch.
          price: (breakdown.finalPrice / 100).toFixed(2),
          inStock: parsedProduct.stock > 0,
        }}
      />
      <BreadcrumbSchema items={breadcrumbs} />

      <ProductDetailClient
        product={
          {
            ...parsedProduct,
            isNew: isNewArrival(parsedProduct.createdAt),
          } as any
        }
        breakdown={breakdown}
        gst={gst}
        relatedProducts={relatedWithPrices as any}
      />
    </>
  );
}
