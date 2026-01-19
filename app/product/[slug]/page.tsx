import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { ProductDetailClient } from "./product-client";
import { ProductSchema, BreadcrumbSchema } from "@/components/structured-data";

interface Props {
  params: { slug: string };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProduct(params.slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `${product.name} | Saroj Moun Jewellery`,
    description: product.metaDescription || product.description.slice(0, 160),
    keywords: product.tags?.join(", ") || `${product.category}, silver jewellery, 925 silver`,
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 200),
      images: product.images.length > 0 ? [product.images[0]] : ["/peacock-jewellery.jpeg"],
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
  const [product, silverRate] = await Promise.all([
    getProduct(params.slug),
    getSilverRate(),
  ]);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.category, product.id);

  // Breadcrumb data for SEO
  const breadcrumbs = [
    { name: "Home", url: "https://sarojmoun.com" },
    { name: "Shop", url: "https://sarojmoun.com/shop" },
    { name: product.category, url: `https://sarojmoun.com/shop?category=${product.category.toLowerCase()}` },
    { name: product.name, url: `https://sarojmoun.com/product/${product.slug}` },
  ];

  return (
    <>
      {/* Structured Data for SEO */}
      <ProductSchema
        product={{
          name: product.name,
          description: product.description,
          images: product.images,
          slug: product.slug,
          price: product.silverWeight * silverRate + product.makingCharges / 100,
          inStock: product.stock > 0,
        }}
      />
      <BreadcrumbSchema items={breadcrumbs} />

      <ProductDetailClient
        product={product}
        silverRate={silverRate}
        relatedProducts={relatedProducts}
      />
    </>
  );
}
