"use client";

import { motion, useReducedMotion } from "framer-motion";

const marqueeItems = [
  "925 HALLMARKED SILVER",
  "FREE SHIPPING OVER ₹2999",
  "HANDCRAFTED WITH LOVE",
  "LIFETIME POLISH FREE",
  "7 DAY EASY RETURNS",
  "100% AUTHENTIC",
];

export function MarqueeBanner() {
  const prefersReducedMotion = useReducedMotion();
  // Duplicate items multiple times for seamless loop
  const items = [...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems];

  return (
    <div className="relative overflow-hidden border-b border-champagne-600/30 bg-gradient-to-r from-champagne-600 via-champagne-500 to-champagne-600 py-2.5">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)] opacity-60" />
      <motion.div
        className="flex whitespace-nowrap"
        animate={
          prefersReducedMotion
            ? undefined
            : {
                x: ["0%", "-50%"],
              }
        }
        transition={
          prefersReducedMotion
            ? undefined
            : {
                x: {
                  duration: 30,
                  repeat: Infinity,
                  ease: "linear",
                },
              }
        }
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center mx-10 text-[11px] font-medium tracking-[0.2em] text-ivory-50"
          >
            <span className="mr-10">{item}</span>
            <span className="text-ivory-50/50">✦</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
