import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { OrganizationSchema, WebsiteSchema } from "@/components/structured-data";
import { ToastProvider } from "@/components/toast";
import { Analytics } from "@/components/analytics";
import { SiteChrome } from "@/components/site-chrome";
import { SITE_URL } from "@/lib/site";
import { DEFAULT_DESCRIPTION, SEO_KEYWORDS } from "@/lib/seo";

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
    default:
      "Saroj Moun Jewellery | Handcrafted 925 Silver Jewellery in Jind, Haryana",
    template: "%s | Saroj Moun Jewellery",
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [...SEO_KEYWORDS],
  authors: [{ name: "Saroj Moun Jewellery" }],
  creator: "Saroj Moun Jewellery",
  publisher: "Saroj Moun Jewellery",
  metadataBase: new URL(SITE_URL),
  // Canonicals are set per page — a root "/" here used to leak onto every
  // child route that forgot its own alternates.canonical.
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    title:
      "Saroj Moun Jewellery | Handcrafted 925 Silver Jewellery in Jind, Haryana",
    description: DEFAULT_DESCRIPTION,
    siteName: "Saroj Moun Jewellery",
  },
  twitter: {
    card: "summary_large_image",
    title: "Saroj Moun Jewellery | Handcrafted 925 Silver",
    description: DEFAULT_DESCRIPTION,
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
  category: "shopping",
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
    <html lang="en-IN">
      <head>
        <OrganizationSchema />
        <WebsiteSchema />
      </head>
      <body
        className={`${inter.variable} ${cormorant.variable} font-body antialiased bg-ivory-50`}
      >
        <ToastProvider>
          <SiteChrome>{children}</SiteChrome>
          <Analytics />
        </ToastProvider>
      </body>
    </html>
  );
}
