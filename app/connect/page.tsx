import type { Metadata } from "next";
import { ConnectPageClient } from "./connect-client";

export const metadata: Metadata = {
  title: "Connect",
  description:
    "Connect with Saroj Moun Jewellery & Fashion — shop the website, follow on Instagram, and watch on YouTube.",
  alternates: {
    canonical: "/connect",
  },
  openGraph: {
    title: "Connect | Saroj Moun Jewellery & Fashion",
    description:
      "One place for Saroj Moun — website, Instagram, and YouTube.",
    url: "/connect",
  },
};

export default function ConnectPage() {
  return <ConnectPageClient />;
}
