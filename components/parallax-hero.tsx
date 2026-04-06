"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
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
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? ["0%", "0%"] : ["0%", "25%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], prefersReducedMotion ? [1, 1] : [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [1, 1] : [1, 1.1]);

  const fadeIn = prefersReducedMotion
    ? { opacity: 1, y: 0 }
    : { opacity: 0, y: 20 };
  const fadeInH1 = prefersReducedMotion
    ? { opacity: 1, y: 0 }
    : { opacity: 0, y: 30 };

  return (
    <div
      ref={ref}
      className="relative overflow-hidden"
      style={{ height }}
    >
      <motion.div
        className="absolute inset-0 h-[120%] w-full"
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
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_22%),linear-gradient(110deg,rgba(17,18,22,0.82)_0%,rgba(17,18,22,0.45)_45%,rgba(17,18,22,0.88)_100%)]"
          style={{ opacity: overlayOpacity }}
        />
        <div className="noise-overlay absolute inset-0" />
      </motion.div>

      <motion.div
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white"
        style={{ opacity }}
      >
        <motion.p
          initial={fadeIn}
          animate={{ opacity: 1, y: 0 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }
          }
          className="section-kicker mb-6 text-champagne-300"
        >
          Premium 925 Silver Collection
        </motion.p>

        <motion.h1
          initial={fadeInH1}
          animate={{ opacity: 1, y: 0 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }
          }
          className="mb-6 max-w-4xl font-heading text-4xl font-light tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={fadeIn}
            animate={{ opacity: 1, y: 0 }}
            transition={
              prefersReducedMotion
                ? { duration: 0 }
                : { duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }
            }
            className="max-w-xl font-light tracking-wide text-ivory-100/80 text-base md:text-lg"
          >
            {subtitle}
          </motion.p>
        )}

        <motion.div
          initial={fadeIn}
          animate={{ opacity: 1, y: 0 }}
          transition={
            prefersReducedMotion
              ? { duration: 0 }
              : { duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }
          }
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          {children || (
            <>
              <Link href="/shop">
                <span className="group inline-flex items-center justify-center rounded-full bg-ivory-50 px-10 py-4 text-xs font-medium uppercase tracking-[0.2em] text-charcoal-900 shadow-[0_20px_50px_rgba(17,18,22,0.2)] transition-all duration-500 hover:bg-champagne-500 hover:text-ivory-50">
                  Shop Now
                  <ArrowRight className="ml-3 inline-block h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Link>
              <Link href="/about">
                <span className="glass-dark inline-flex items-center justify-center rounded-full px-10 py-4 text-xs font-medium uppercase tracking-[0.2em] text-ivory-50 transition-all duration-500 hover:bg-white/10">
                  Our Story
                </span>
              </Link>
            </>
          )}
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        animate={prefersReducedMotion ? undefined : { y: [0, 8, 0] }}
        transition={prefersReducedMotion ? undefined : { duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="flex flex-col items-center gap-3">
          <span className="text-[10px] uppercase tracking-[0.35em] text-ivory-100/55">
            Scroll
          </span>
          <div className="h-12 w-px bg-gradient-to-b from-champagne-300/80 to-transparent" />
        </div>
      </motion.div>
    </div>
  );
}
