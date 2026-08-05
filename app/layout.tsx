import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { OrganizationSchema, WebsiteSchema } from "@/components/structured-data";
import { ToastProvider } from "@/components/toast";
import { Analytics } from "@/components/analytics";
import { SiteChrome } from "@/components/site-chrome";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Saroj Moun - Premium Silver Jewellery | Handcrafted 925 Silver Jewelry",
    template: "%s | Saroj Moun Jewellery"
  },
  description: "Shop authentic handcrafted 925 silver jewellery at Saroj Moun. Hallmark certified necklaces, earrings, rings & bangles with transparent pricing. Based in Jind, Haryana. Free shipping above ₹2999.",
  keywords: ["silver jewellery", "925 silver", "hallmark silver", "indian jewellery", "handcrafted jewellery", "silver necklace", "silver earrings", "silver rings", "saroj moun", "jind jewellery", "haryana silver jewellery"],
  authors: [{ name: "Saroj Moun Jewellery" }],
  creator: "Saroj Moun Jewellery",
  publisher: "Saroj Moun Jewellery",
  metadataBase: new URL("https://sarojmoun.com"),
  alternates: {
    canonical: "https://sarojmoun.com"
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://sarojmoun.com",
    title: "Saroj Moun - Premium Silver Jewellery | Handcrafted 925 Silver",
    description: "Shop authentic handcrafted 925 silver jewellery with hallmark certification. Transparent pricing based on live silver rates. Free shipping above ₹2999.",
    siteName: "Saroj Moun Jewellery",
    // Images come from app/opengraph-image.tsx, which renders at a true 1200x630.
  },
  twitter: {
    card: "summary_large_image",
    title: "Saroj Moun - Premium Silver Jewellery",
    description: "Shop authentic handcrafted 925 silver jewellery with hallmark certification",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // Omitted unless the real token is configured. A placeholder here publishes a
  // meta tag that fails verification rather than simply being absent.
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <OrganizationSchema />
        <WebsiteSchema />
      </head>
      <body className={`${inter.variable} ${cormorant.variable} font-body antialiased bg-ivory-50`}>
        <ToastProvider>
          <SiteChrome>{children}</SiteChrome>
          <Analytics />
        </ToastProvider>
      </body>
    </html>
  );
}
