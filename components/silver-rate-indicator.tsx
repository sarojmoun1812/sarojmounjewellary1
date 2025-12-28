"use client";

import { useSilverRate } from "@/lib/use-silver-rate";
import { TrendingUp, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function SilverRateIndicator() {
  const { silverRate, loading, lastUpdated } = useSilverRate();

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <div className="w-2 h-2 bg-powder-400 rounded-full animate-pulse" />
        <span>Loading rate...</span>
      </div>
    );
  }

  return (
    <motion.div
      className="inline-flex items-center gap-2 bg-gradient-to-r from-powder-100 to-powder-50 px-4 py-2 rounded-full border border-powder-300 shadow-sm"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Sparkles className="h-4 w-4 text-powder-600" />
      <div className="flex items-baseline gap-1">
        <span className="text-xs font-medium text-gray-600">Silver</span>
        <span className="text-base font-bold text-powder-700">
          ₹{silverRate.toFixed(2)}
        </span>
        <span className="text-xs text-gray-500">/gram</span>
      </div>
      <TrendingUp className="h-3 w-3 text-green-500" />
    </motion.div>
  );
}

/**
 * Mini version for navbar
 */
export function SilverRateBadge() {
  const { silverRate, loading } = useSilverRate();

  if (loading) return null;

  return (
    <div className="flex items-center gap-1 text-xs">
      <Sparkles className="h-3 w-3 text-powder-500" />
      <span className="font-semibold text-powder-700">
        ₹{silverRate.toFixed(0)}/g
      </span>
    </div>
  );
}
