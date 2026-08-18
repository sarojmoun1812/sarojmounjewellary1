import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Return & Refund Policy",
  description:
    "Return and refund policy for Saroj Moun Jewellery handcrafted 925 silver jewellery orders.",
  path: "/return-policy",
});

export default function ReturnPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
