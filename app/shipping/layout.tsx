import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Shipping Policy",
  description:
    "Shipping information for Saroj Moun Jewellery — free delivery above ₹2999 on handcrafted 925 silver jewellery across India.",
  path: "/shipping",
});

export default function ShippingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
