"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Globe2, Instagram, Youtube } from "lucide-react";
import { fadeUp, luxuryEase } from "@/lib/motion";

const LINKS = [
  {
    label: "Website",
    href: "https://www.sarojmounjewellary.com/",
    hint: "Shop silver jewellery",
    icon: Globe2,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/sarojmounfashion/",
    hint: "@sarojmounfashion",
    icon: Instagram,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@sarojmoun1207",
    hint: "@sarojmoun1207",
    icon: Youtube,
  },
] as const;

export function ConnectPageClient() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <main className="relative isolate min-h-[100dvh] overflow-hidden bg-charcoal-950 text-ivory-50">
      <div className="absolute inset-0">
        <Image
          src="/saroj.jpeg"
          alt=""
          fill
          priority
          className="object-cover object-[center_20%] opacity-55"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(196,167,100,0.28),transparent_48%),linear-gradient(180deg,rgba(15,15,15,0.55)_0%,rgba(15,15,15,0.82)_42%,rgba(15,15,15,0.96)_100%)]" />
        <div className="noise-overlay absolute inset-0" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-lg flex-col justify-center px-6 pb-16 pt-[calc(var(--header-height,5.5rem)+1.5rem)]">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: prefersReducedMotion ? 0 : 0.12,
                delayChildren: prefersReducedMotion ? 0 : 0.08,
              },
            },
          }}
          className="text-center"
        >
          <motion.p
            variants={fadeUp}
            className="section-kicker text-champagne-300"
          >
            Jewellery &amp; Fashion
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="mt-4 font-heading text-5xl font-light tracking-tight text-ivory-50 sm:text-6xl"
          >
            Saroj Moun
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-ivory-100/70 sm:text-base"
          >
            Handcrafted 925 silver and signature style — pick where you want to
            go next.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="mx-auto mt-10 h-px w-16 bg-gradient-to-r from-transparent via-champagne-400/80 to-transparent"
          />

          <ul className="mt-10 space-y-3.5">
            {LINKS.map((link, index) => {
              const Icon = link.icon;

              return (
                <motion.li
                  key={link.label}
                  variants={fadeUp}
                  transition={{
                    duration: 0.75,
                    ease: luxuryEase,
                    delay: prefersReducedMotion ? 0 : 0.05 * index,
                  }}
                >
                  <a
                    href={link.href}
                    target={link.label === "Website" ? undefined : "_blank"}
                    rel={
                      link.label === "Website"
                        ? undefined
                        : "noopener noreferrer"
                    }
                    className="group relative flex w-full items-center gap-4 overflow-hidden rounded-[1.35rem] border border-ivory-50/15 bg-charcoal-950/45 px-5 py-4 text-left shadow-[0_18px_50px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all duration-500 hover:border-champagne-400/45 hover:bg-charcoal-950/65"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-champagne-500/15 text-champagne-300 ring-1 ring-champagne-400/30 transition-colors duration-500 group-hover:bg-champagne-500 group-hover:text-charcoal-950">
                      <Icon className="h-5 w-5" strokeWidth={1.75} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-heading text-2xl font-light tracking-wide text-ivory-50">
                        {link.label}
                      </span>
                      <span className="mt-0.5 block text-xs uppercase tracking-[0.2em] text-ivory-100/45">
                        {link.hint}
                      </span>
                    </span>
                    <ArrowUpRight className="h-5 w-5 shrink-0 text-champagne-300/70 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-champagne-300" />
                  </a>
                </motion.li>
              );
            })}
          </ul>

          <motion.p
            variants={fadeUp}
            className="mt-12 text-[10px] uppercase tracking-[0.28em] text-ivory-100/35"
          >
            Jind, Haryana · Hallmarked 92.5
          </motion.p>
        </motion.div>
      </div>
    </main>
  );
}
