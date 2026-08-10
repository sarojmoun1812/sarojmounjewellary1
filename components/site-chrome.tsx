"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FloatingCTA } from "@/components/floating-cta";
import { ExitIntentPopup } from "@/components/exit-intent-popup";
import { MarqueeBanner } from "@/components/marquee-banner";
import { PageTransition } from "@/components/page-transition";
import { hasDarkHero } from "@/lib/nav";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  const darkHero = hasDarkHero(pathname);
  const headerRef = useRef<HTMLDivElement>(null);

  /**
   * Publishes the header's real height as --header-height.
   *
   * The announcement strip and the bar are both fixed, so they take no space in
   * the document and pages have to be pushed down by hand. That measurement used
   * to be absent entirely: the strip sat at the top of the flow underneath the
   * fixed bar, completely covered by it, and page content began 37px down with
   * the bar occupying the first 81px — so every page quietly lost the top of
   * itself. Measuring rather than hardcoding keeps this correct when the bar
   * changes height at the lg breakpoint or the strip wraps on a narrow phone.
   */
  useEffect(() => {
    const element = headerRef.current;
    if (!element) return;

    const apply = () => {
      document.documentElement.style.setProperty(
        "--header-height",
        `${element.offsetHeight}px`
      );
    };

    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <div ref={headerRef} className="fixed inset-x-0 top-0 z-50">
        <MarqueeBanner />
        <Navbar />
      </div>

      <main
        className="min-h-screen pb-16 md:pb-0"
        // A dark-hero page reaches under the header on purpose; its own hero
        // handles clearing the bar for the text inside it. The fallback matters:
        // until the effect below runs, an undefined variable would collapse to
        // no padding and the first paint would tuck content under the header.
        style={
          darkHero
            ? undefined
            : { paddingTop: "var(--header-height, 7.5rem)" }
        }
      >
        <PageTransition>{children}</PageTransition>
      </main>

      <Footer />
      {/* FloatingCTA is the only floating contact control. It previously shared
          the exact same bottom-6/right-6 slot as WhatsAppButton, so the two sat
          on top of each other. */}
      <FloatingCTA />
      <ExitIntentPopup />
    </>
  );
}
