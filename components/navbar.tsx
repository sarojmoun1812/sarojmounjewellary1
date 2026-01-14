"use client";

import Link from "next/link";
import { ShoppingBag, Menu, X, Search, User } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const totalItems = useCart((state) => state.getTotalItems());

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-ivory-50/95 backdrop-blur-md shadow-sm"
            : "bg-transparent"
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
                  className={`relative text-xs font-medium tracking-[0.15em] uppercase transition-colors duration-300 ${
                    scrolled
                      ? "text-charcoal-700 hover:text-charcoal-900"
                      : "text-white/90 hover:text-white"
                  }`}
                >
                  <span className="relative">
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-px bg-champagne-500 transition-all duration-300 group-hover:w-full" />
                  </span>
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className={`lg:hidden p-2 transition-colors ${
                scrolled ? "text-charcoal-800" : "text-white"
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
                scrolled ? "text-charcoal-900" : "text-white"
              }`}>
                SAROJ MOUN
              </span>
              <span className={`text-[10px] tracking-[0.3em] uppercase transition-colors duration-300 ${
                scrolled ? "text-champagne-600" : "text-champagne-300"
              }`}>
                JEWELLERY
              </span>
            </Link>

            {/* Right - Icons */}
            <div className="flex items-center gap-6">
              <button 
                className={`hidden sm:block p-2 transition-colors ${
                  scrolled ? "text-charcoal-700 hover:text-charcoal-900" : "text-white/90 hover:text-white"
                }`}
                aria-label="Search"
              >
                <Search className="h-5 w-5" strokeWidth={1.5} />
              </button>

              <Link
                href="/admin"
                className={`hidden sm:block p-2 transition-colors ${
                  scrolled ? "text-charcoal-700 hover:text-charcoal-900" : "text-white/90 hover:text-white"
                }`}
                aria-label="Account"
              >
                <User className="h-5 w-5" strokeWidth={1.5} />
              </Link>

              <Link href="/cart" className="relative p-2 group">
                <ShoppingBag 
                  className={`h-5 w-5 transition-colors ${
                    scrolled ? "text-charcoal-700 group-hover:text-charcoal-900" : "text-white/90 group-hover:text-white"
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
