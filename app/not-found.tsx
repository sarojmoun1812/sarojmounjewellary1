"use client";

import { motion } from "framer-motion";
import { Home, ShoppingBag, Sparkles } from "lucide-react";
import Link from "next/link";

const POPULAR_LINKS = [
  { href: "/shop", label: "Full Collection" },
  { href: "/about", label: "Our Story" },
  { href: "/contact", label: "Contact" },
];

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ivory-50 px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl text-center"
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative mb-8"
        >
          <h1 className="font-heading text-[130px] font-light leading-none text-champagne-200 md:text-[190px]">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles
              className="h-16 w-16 text-champagne-400 md:h-24 md:w-24"
              strokeWidth={1}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h2 className="font-heading text-3xl font-light text-charcoal-900 md:text-4xl">
            Ye page nahi mila
          </h2>
          <p className="mx-auto mt-4 max-w-md text-charcoal-500">
            Jo aap dhoondh rahe hain wo yahan nahi hai. Hamari collection dekhiye
            — kuch pasand aa jayega.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-12 flex flex-col justify-center gap-4 sm:flex-row"
        >
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 bg-charcoal-900 px-10 py-4 text-sm font-medium uppercase tracking-[0.18em] text-ivory-50 transition-colors can-hover:hover:bg-charcoal-800"
          >
            <ShoppingBag className="h-4 w-4" />
            Collection Dekhein
          </Link>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 border border-charcoal-900 px-10 py-4 text-sm font-medium uppercase tracking-[0.18em] text-charcoal-900 transition-colors can-hover:hover:bg-charcoal-900 can-hover:hover:text-ivory-50"
          >
            <Home className="h-4 w-4" />
            Home
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16"
        >
          <p className="section-kicker text-charcoal-400">Aur dekhein</p>
          <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
            {POPULAR_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-charcoal-600 underline-offset-4 transition-colors can-hover:hover:text-champagne-700 can-hover:hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
