"use client";

import { usePathname } from "next/navigation";
import WhatsAppButton from "@/components/whatsapp-button";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FloatingCTA } from "@/components/floating-cta";
import { ExitIntentPopup } from "@/components/exit-intent-popup";
import { MarqueeBanner } from "@/components/marquee-banner";
import { PageTransition } from "@/components/page-transition";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <MarqueeBanner />
      <main className="min-h-screen pb-16 md:pb-0">
        <PageTransition>{children}</PageTransition>
        <WhatsAppButton />
      </main>
      <Footer />
      <FloatingCTA />
      <ExitIntentPopup />
    </>
  );
}
