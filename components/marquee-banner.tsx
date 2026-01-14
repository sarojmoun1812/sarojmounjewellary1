"use client";

import { motion } from "framer-motion";

const marqueeItems = [
  "925 HALLMARKED SILVER",
  "FREE SHIPPING OVER ₹2999",
  "HANDCRAFTED WITH LOVE",
  "LIFETIME POLISH FREE",
  "7 DAY EASY RETURNS",
  "100% AUTHENTIC",
];

export function MarqueeBanner() {
  // Duplicate items multiple times for seamless loop
  const items = [...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems];

  return (
    <div className="bg-champagne-500 py-2.5 overflow-hidden relative">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{
          x: ["0%", "-50%"],
        }}
        transition={{
          x: {
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          },
        }}
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
