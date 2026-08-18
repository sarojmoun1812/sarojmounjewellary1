import type { Metadata } from "next";
import { getHomeData } from "@/lib/home";
import { DEFAULT_DESCRIPTION, SEO_KEYWORDS } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import { HomeClient } from "./home-client";

export const metadata: Metadata = {
  title: {
    absolute:
      "Saroj Moun Jewellery | Handcrafted 925 Silver Jewellery in Jind, Haryana",
  },
  description:
    "Buy handcrafted 925 sterling silver jewellery from Saroj Moun Jewellery in Jind, Haryana (also searched as Saroj Moun Jewellary / Saroj Mohan Jewellery). Hallmark-certified necklaces, earrings, rings and kadas — wholesale prices on live silver rates.",
  keywords: [...SEO_KEYWORDS],
  alternates: { canonical: "/" },
  openGraph: {
    title:
      "Saroj Moun Jewellery | Handcrafted 925 Silver Jewellery in Jind, Haryana",
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    siteName: "Saroj Moun Jewellery",
    locale: "en_IN",
    type: "website",
  },
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { featuredProducts, categories } = await getHomeData();

  return <HomeClient featuredProducts={featuredProducts} categories={categories} />;
}
