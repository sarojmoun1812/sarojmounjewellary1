import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import WhatsAppButton from "@/components/whatsapp-button";
import { OrganizationSchema, WebsiteSchema } from "@/components/structured-data";
import { ToastProvider } from "@/components/toast";

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
  description: "Shop authentic handcrafted 925 silver jewellery at Saroj Moun. Hallmark certified necklaces, earrings, rings & bangles with transparent pricing. Based in Jind, Haryana. Free shipping above ₹5000.",
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
    description: "Shop authentic handcrafted 925 silver jewellery with hallmark certification. Transparent pricing based on live silver rates. Free shipping above ₹5000.",
    siteName: "Saroj Moun Jewellery",
    images: [
      {
        url: "/peacock-jewellery.jpeg",
        width: 1200,
        height: 630,
        alt: "Saroj Moun Silver Jewellery Collection"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Saroj Moun - Premium Silver Jewellery",
    description: "Shop authentic handcrafted 925 silver jewellery with hallmark certification",
    images: ["/peacock-jewellery.jpeg"]
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
  verification: {
    google: "your-google-verification-code", // Add when you set up Google Search Console
  }
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
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <WhatsAppButton />
        </ToastProvider>
      </body>
    </html>
  );
}
