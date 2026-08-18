import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ConnectPageClient } from "./connect-client";

export const metadata: Metadata = pageMetadata({
  title: "Connect with Saroj Moun Jewellery",
  description:
    "Connect with Saroj Moun Jewellery in Jind — shop handcrafted 925 silver jewellery online, follow on Instagram, and watch on YouTube.",
  path: "/connect",
  keywords: [
    "Saroj Moun Jewellery",
    "Saroj Moun Instagram",
    "silver jewellery Jind",
    "925 silver jewellery",
  ],
});

export default function ConnectPage() {
  return <ConnectPageClient />;
}
