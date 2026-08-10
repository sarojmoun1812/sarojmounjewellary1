"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { hasDarkHero } from "@/lib/nav";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const totalItems = useCart((state) => state.getTotalItems());
  const pathname = usePathname();

  // Light text only while genuinely over dark artwork. On every other route, and
  // on a dark-hero route once the hero has scrolled away, the bar takes its own
  // opaque background — otherwise the logo and links were white on ivory.
  const overDarkHero = hasDarkHero(pathname) && !scrolled;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    // Run once on mount: a page restored mid-scroll would otherwise render the
    // transparent bar over light content until the first scroll event.
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/shop", label: "Shop" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <>
      <motion.nav
        // Positioning belongs to the fixed header stack in SiteChrome, which
        // holds the announcement strip above this bar.
        className={`transition-all duration-500 ${
          overDarkHero
            ? "border-b border-transparent bg-transparent"
            : "border-b border-ivory-200/80 bg-ivory-50/95 shadow-[0_12px_44px_rgba(17,18,22,0.07)] backdrop-blur-xl"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="container-luxury">
          <div className="flex items-center justify-between h-20 lg:h-24">
            {/* Left - Navigation Links (Desktop) */}
            <div className="hidden lg:flex items-center gap-10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group relative text-xs font-medium uppercase tracking-[0.15em] transition-colors duration-300 ${
                    overDarkHero
                      ? "text-white/90 hover:text-white"
                      : "text-charcoal-700 hover:text-charcoal-900"
                  }`}
                >
                  <span className="relative inline-block">
                    {link.label}
                    <span className="absolute -bottom-1 left-0 h-px w-0 bg-champagne-500 transition-all duration-300 ease-out group-hover:w-full" />
                  </span>
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className={`lg:hidden p-2 transition-colors ${
                overDarkHero ? "text-white" : "text-charcoal-800"
              }`}
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Center - Logo */}
            <Link 
              href="/" 
              className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center group"
            >
              <span className={`text-xl md:text-2xl font-heading font-light tracking-[0.1em] transition-colors duration-300 ${
                overDarkHero ? "text-white" : "text-charcoal-900"
              }`}>
                SAROJ MOUN
              </span>
              <span className={`text-[10px] tracking-[0.3em] uppercase transition-colors duration-300 ${
                overDarkHero ? "text-champagne-300" : "text-champagne-600"
              }`}>
                JEWELLERY
              </span>
            </Link>

            {/* Right - Icons */}
            {/* A magnifying glass that opened nothing and a person icon that led
                to the shop owner's admin login used to sit here. There are no
                customer accounts, so both only invited misdirected clicks. */}
            <div className="flex items-center gap-6">
              <Link
                href="/cart"
                className="relative p-2 group"
                aria-label={
                  totalItems > 0
                    ? `Cart, ${totalItems} item${totalItems === 1 ? "" : "s"}`
                    : "Cart"
                }
              >
                <ShoppingBag 
                  className={`h-5 w-5 transition-colors ${
                    overDarkHero
                      ? "text-white/90 group-hover:text-white"
                      : "text-charcoal-700 group-hover:text-charcoal-900"
                  }`} 
                  strokeWidth={1.5} 
                />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-champagne-500 text-ivory-50 text-[10px] font-medium rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-charcoal-900/50 backdrop-blur-sm lg:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 left-0 bottom-0 w-80 z-50 bg-ivory-50 shadow-2xl lg:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-ivory-200">
                  <div className="flex flex-col">
                    <span className="text-lg font-heading font-light tracking-[0.1em] text-charcoal-900">
                      SAROJ MOUN
                    </span>
                    <span className="text-[9px] tracking-[0.3em] uppercase text-champagne-600">
                      JEWELLERY
                    </span>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-charcoal-600 hover:text-charcoal-900"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 py-8 px-6">
                  <div className="space-y-1">
                    <Link
                      href="/"
                      className="block py-4 text-sm font-medium tracking-[0.15em] uppercase text-charcoal-700 hover:text-charcoal-900 border-b border-ivory-200"
                      onClick={() => setIsOpen(false)}
                    >
                      Home
                    </Link>
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="block py-4 text-sm font-medium tracking-[0.15em] uppercase text-charcoal-700 hover:text-charcoal-900 border-b border-ivory-200"
                        onClick={() => setIsOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </nav>

                {/* Footer */}
                <div className="p-6 border-t border-ivory-200 bg-ivory-100/50">
                  <p className="text-xs text-charcoal-500 tracking-wider">
                    Premium 925 Silver Jewellery
                  </p>
                  <p className="text-xs text-champagne-600 mt-1 tracking-wider">
                    Handcrafted with Love
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
