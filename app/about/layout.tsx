import type { Metadata } from "next";
import { BRAND_NAME_VARIANTS, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About Saroj Moun — Silver Jewellery from Jind, Haryana",
  description:
    "Meet Saroj Moun, founder of Saroj Moun Jewellery (also searched as Saroj Moun Jewellary / Saroj Mohan Jewellery) in Jind, Haryana. Handcrafted 925 sterling silver jewellery with hallmark certification.",
  path: "/about",
  keywords: [
    ...BRAND_NAME_VARIANTS,
    "about Saroj Moun",
    "silver jewellery Jind",
    "handcrafted silver jewellery Haryana",
    "925 silver jewellery",
  ],
});

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
