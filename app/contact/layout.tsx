import type { Metadata } from "next";
import { BRAND_NAME_VARIANTS, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact Saroj Moun Jewellery in Jind, Haryana",
  description:
    "Contact Saroj Moun Jewellery in Jind, Haryana for handcrafted 925 silver jewellery. Call, WhatsApp or visit B-90 Police Colony. Orders confirmed on WhatsApp.",
  path: "/contact",
  keywords: [
    ...BRAND_NAME_VARIANTS,
    "Saroj Moun Jewellery contact",
    "silver jewellery Jind",
    "silver jewellery shop Haryana",
    "WhatsApp silver jewellery order",
    "925 silver Jind",
  ],
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
