"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface ParallaxHeroProps {
  imageSrc?: string;
  title?: string;
  subtitle?: string;
  height?: string;
  overlayOpacity?: number;
  children?: React.ReactNode;
}

export function ParallaxHero({
  imageSrc = "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&q=80",
  title = "Everyday Silver, Elevated.",
  subtitle = "Discover our exclusive collection of handcrafted silver jewellery",
  height = "100vh",
  overlayOpacity = 0.35,
  children,
}: ParallaxHeroProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Parallax effect - image moves slower than scroll
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  return (
    <div
      ref={ref}
      className="relative overflow-hidden"
      style={{ height }}
    >
      {/* Parallax Background Image */}
      <motion.div
        className="absolute inset-0 w-full h-[120%]"
        style={{ y, scale }}
      >
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover"
          priority
          quality={95}
        />
        {/* Subtle Gradient Overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-charcoal-900/30 via-charcoal-900/20 to-charcoal-900/50"
          style={{ opacity: overlayOpacity }}
        />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-6"
        style={{ opacity }}
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-[11px] tracking-[0.4em] uppercase text-champagne-300 mb-6"
        >
          Premium 925 Silver Collection
        </motion.p>
        
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-light tracking-tight mb-6 max-w-4xl"
        >
          {title}
        </motion.h1>
        
        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-base md:text-lg text-ivory-100/80 max-w-xl font-light tracking-wide"
          >
            {subtitle}
          </motion.p>
        )}
        
        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-10 flex flex-col sm:flex-row gap-4"
        >
          {children || (
            <>
              <Link href="/shop">
                <button className="group px-10 py-4 bg-ivory-50 text-charcoal-900 text-xs font-medium tracking-[0.2em] uppercase transition-all duration-500 hover:bg-champagne-500 hover:text-ivory-50">
                  Shop Now
                  <ArrowRight className="inline-block ml-3 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </Link>
              <Link href="/about">
                <button className="px-10 py-4 border border-ivory-50/50 text-ivory-50 text-xs font-medium tracking-[0.2em] uppercase transition-all duration-500 hover:bg-ivory-50/10">
                  Our Story
                </button>
              </Link>
            </>
          )}
        </motion.div>
      </motion.div>

      {/* Elegant Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex flex-col items-center gap-3">
          <span className="text-[10px] tracking-[0.3em] uppercase text-ivory-50/60">
            Scroll
          </span>
          <div className="w-px h-12 bg-gradient-to-b from-ivory-50/60 to-transparent" />
        </div>
      </motion.div>
    </div>
  );
}
