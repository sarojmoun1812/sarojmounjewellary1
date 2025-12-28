"use client";

import { motion } from "framer-motion";
import { Home, Search, ShoppingBag, Sparkles } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-powder-50 via-white to-powder-100 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl"
      >
        {/* 404 Number */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative mb-8"
        >
          <h1 className="text-[150px] md:text-[200px] font-heading font-bold text-powder-600/20 leading-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="h-20 w-20 md:h-32 md:w-32 text-powder-600 animate-pulse" />
          </div>
        </motion.div>

        {/* Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="space-y-4 mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-gray-600">
            The jewel you're looking for seems to have vanished. Don't worry, let's help you find something beautiful!
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-powder-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-powder-700 transition-colors shadow-lg hover:shadow-xl"
          >
            <Home className="h-5 w-5" />
            Back to Home
          </Link>

          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 bg-white text-powder-600 border-2 border-powder-600 px-8 py-4 rounded-xl font-semibold hover:bg-powder-50 transition-colors shadow-lg hover:shadow-xl"
          >
            <ShoppingBag className="h-5 w-5" />
            Browse Shop
          </Link>
        </motion.div>

        {/* Popular Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16"
        >
          <p className="text-sm font-semibold text-gray-500 mb-4">POPULAR PAGES</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/shop?category=necklaces" className="text-powder-600 hover:text-powder-700 hover:underline">
              Necklaces
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/shop?category=earrings" className="text-powder-600 hover:text-powder-700 hover:underline">
              Earrings
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/shop?category=rings" className="text-powder-600 hover:text-powder-700 hover:underline">
              Rings
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/about" className="text-powder-600 hover:text-powder-700 hover:underline">
              About Us
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/contact" className="text-powder-600 hover:text-powder-700 hover:underline">
              Contact
            </Link>
          </div>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-powder-200 rounded-full blur-3xl opacity-50 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-powder-300 rounded-full blur-3xl opacity-50 animate-pulse delay-1000" />
      </motion.div>
    </div>
  );
}
