"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  Shield,
  Truck,
  RefreshCw,
  Star,
  Heart,
  Sparkles,
  Play,
} from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Reveal, StaggerItem, StaggerReveal } from "@/components/reveal";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { LeadCapturePopup } from "@/components/lead-capture-popup";
import { SilverRateIndicator } from "@/components/silver-rate-indicator";
import {
  blurReveal,
  fadeIn,
  fadeUp,
  heroCascade,
  revealLeft,
  revealRight,
} from "@/lib/motion";

// Featured products data
const featuredProducts = [
  {
    id: "1",
    name: "Royal Peacock Necklace",
    slug: "royal-peacock-necklace",
    price: 549900,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80",
    badge: "Bestseller",
  },
  {
    id: "2",
    name: "Traditional Silver Kada",
    slug: "traditional-silver-kada",
    price: 349900,
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80",
    badge: "New",
  },
  {
    id: "3",
    name: "Elegant Jhumka Earrings",
    slug: "elegant-jhumka-earrings",
    price: 189900,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80",
  },
  {
    id: "4",
    name: "Designer Silver Ring",
    slug: "designer-silver-ring",
    price: 129900,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80",
    badge: "Trending",
  },
];

// Categories
const categories = [
  { 
    name: "Necklaces", 
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80",
    count: "24+ Designs"
  },
  { 
    name: "Kadas", 
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80",
    count: "18+ Designs"
  },
  { 
    name: "Earrings", 
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80",
    count: "32+ Designs"
  },
  { 
    name: "Rings", 
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80",
    count: "15+ Designs"
  },
];

// Testimonials
const testimonials = [
  {
    name: "Priya Sharma",
    location: "Mumbai",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    rating: 5,
    text: "The craftsmanship is incredible. My kada has become my everyday essential - elegant and comfortable. Will definitely order again!",
    product: "Silver Kada"
  },
  {
    name: "Anita Patel",
    location: "Delhi",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
    rating: 5,
    text: "Perfect for my wedding! The necklace was exactly as shown. Beautiful packaging and prompt delivery.",
    product: "Temple Necklace"
  },
  {
    name: "Sneha Reddy",
    location: "Hyderabad",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
    rating: 5,
    text: "Love the minimal design aesthetic. These pieces go with everything from casual to formal wear. Best quality silver!",
    product: "Jhumka Earrings"
  },
];

const instagramImages = [
  "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80",
  "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80",
  "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80",
  "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80",
  "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&q=80",
  "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80",
];

export default function HomePage() {
  const [showLeadPopup, setShowLeadPopup] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // Show popup after 10 seconds if not already captured
    const hasLead = localStorage.getItem("lead_captured");
    if (!hasLead) {
      const timer = setTimeout(() => {
        setShowLeadPopup(true);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="min-h-screen bg-ivory-50">
      <SilverRateIndicator />

      <section className="relative isolate min-h-[calc(100vh-2.5rem)] overflow-hidden bg-charcoal-950 pt-24 text-ivory-50">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&q=80"
            alt="Silver Jewellery"
            fill
            className="object-cover object-center scale-105"
            priority
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_20%),linear-gradient(110deg,rgba(17,18,22,0.92)_5%,rgba(17,18,22,0.72)_45%,rgba(17,18,22,0.9)_100%)]" />
          <div className="noise-overlay absolute inset-0" />
        </div>
        <div className="ambient-orb animate-pulse-glow left-[10%] top-24 h-48 w-48 opacity-80" />
        <div className="ambient-orb animate-float-slow bottom-20 right-[8%] h-64 w-64 opacity-50" />

        <div className="container-luxury relative z-10 py-16 md:py-20">
          <div className="grid items-center gap-16 xl:grid-cols-[1.1fr_0.9fr]">
            <motion.div
              variants={heroCascade}
              initial="hidden"
              animate="visible"
              className="max-w-3xl"
            >
              <motion.p variants={fadeIn} className="section-kicker mb-6 text-champagne-300">
                Haathon Ki Karigari, Future-Ready Presentation
              </motion.p>
              <motion.h1
                variants={fadeUp}
                className="max-w-3xl text-5xl font-heading font-light leading-[1.02] text-ivory-50 md:text-7xl"
              >
                Chaandi Ka Husn,
                <br />
                <span className="text-gradient-gold italic">Cinematic Roop Mein.</span>
              </motion.h1>
              <motion.p
                variants={fadeUp}
                className="mt-7 max-w-2xl text-lg leading-relaxed text-ivory-100/76 md:text-xl"
              >
                Hallmarked 925 pure silver ke haathon se bane gehne, ab ek aur zyada
                immersive, premium aur eye-catching digital experience ke saath. Jind,
                Haryana se poore India tak.
              </motion.p>
              <motion.div variants={fadeUp} className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link href="/shop" className="inline-flex">
                  <motion.span
                    whileHover={prefersReducedMotion ? undefined : { y: -2 }}
                    whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                    className="inline-flex items-center justify-center gap-3 rounded-full bg-champagne-500 px-8 py-4 text-sm font-medium uppercase tracking-[0.22em] text-charcoal-950 shadow-[0_20px_40px_rgba(196,167,100,0.25)] transition-colors duration-300 hover:bg-champagne-400"
                  >
                    Explore Collection
                    <ArrowRight className="h-4 w-4" />
                  </motion.span>
                </Link>
                <Link href="/about" className="inline-flex">
                  <motion.span
                    whileHover={prefersReducedMotion ? undefined : { y: -2 }}
                    whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
                    className="inline-flex items-center justify-center gap-3 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-sm font-medium uppercase tracking-[0.22em] text-ivory-50 backdrop-blur-md transition-colors duration-300 hover:bg-white/10"
                  >
                    Our Story
                  </motion.span>
                </Link>
              </motion.div>
              <motion.div variants={fadeUp} className="mt-10 grid gap-4 md:grid-cols-3">
                {[
                  { value: "925", label: "Sterling Silver" },
                  { value: "25+", label: "Years of trust" },
                  { value: "10K+", label: "Happy customers" },
                ].map((item) => (
                  <div key={item.label} className="glass-dark gradient-border rounded-[1.5rem] p-5">
                    <p className="font-heading text-3xl text-champagne-300">{item.value}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.22em] text-ivory-100/65">
                      {item.label}
                    </p>
                  </div>
                ))}
              </motion.div>
              <motion.div
                variants={fadeUp}
                className="mt-8 flex flex-wrap gap-3 text-xs uppercase tracking-[0.22em] text-ivory-100/70"
              >
                {[
                  { icon: Shield, label: "Hallmarked 925" },
                  { icon: Truck, label: "Free Shipping" },
                  { icon: RefreshCw, label: "Easy Returns" },
                ].map((item) => (
                  <div key={item.label} className="glass-dark flex items-center gap-3 rounded-full px-4 py-3">
                    <item.icon className="h-4 w-4 text-champagne-300" />
                    <span>{item.label}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              variants={prefersReducedMotion ? fadeUp : blurReveal}
              initial="hidden"
              animate="visible"
              className="relative"
            >
              <div className="media-frame aspect-[4/5] overflow-hidden rounded-[2rem]">
                <Image
                  src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=1200&q=80"
                  alt="Premium silver jewellery editorial"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,18,22,0.08),rgba(17,18,22,0.72))]" />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                  <div className="glass-dark rounded-[1.6rem] p-5">
                    <div className="flex items-center justify-between gap-6">
                      <div>
                        <p className="section-kicker text-champagne-300">Campaign Edit</p>
                        <p className="mt-3 max-w-xs text-sm leading-relaxed text-ivory-100/75">
                          Editorial styling, layered lighting, aur premium story-first visuals.
                        </p>
                      </div>
                      <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-champagne-500 text-charcoal-950">
                        <Play className="ml-1 h-5 w-5" fill="currentColor" />
                        <span className="absolute inset-0 rounded-full border border-champagne-200/70 animate-ping" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="glass-light absolute -left-8 top-10 hidden max-w-[220px] rounded-[1.5rem] p-5 shadow-xl md:block">
                <p className="section-kicker text-champagne-700">Luxury + High-Tech</p>
                <p className="mt-3 text-sm leading-relaxed text-charcoal-700">
                  Soft glass layers, floating highlights aur elegant motion cues for a richer first impression.
                </p>
              </div>
              <div className="glass-dark absolute -bottom-8 right-4 max-w-[220px] rounded-[1.5rem] p-5 shadow-2xl">
                <p className="text-3xl font-heading text-champagne-300">01</p>
                <p className="mt-2 text-sm uppercase tracking-[0.22em] text-ivory-100/60">
                  Signature Landing Experience
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {!prefersReducedMotion && (
          <motion.div
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2.4, repeat: Infinity }}
          >
            <div className="flex flex-col items-center gap-3">
              <span className="text-[10px] uppercase tracking-[0.35em] text-ivory-100/50">
                Scroll
              </span>
              <div className="h-12 w-px bg-gradient-to-b from-champagne-300 to-transparent" />
            </div>
          </motion.div>
        )}
      </section>

      <section className="section-padding luxury-mesh section-divider">
        <div className="container-luxury">
          <div className="grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr]">
            <Reveal variants={revealLeft} className="relative">
              <div className="media-frame aspect-[4/5] rounded-[2rem]">
                <Image
                  src="/saroj.jpeg"
                  alt="Saroj Moun - Founder"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/45 via-transparent to-transparent" />
              </div>
              <div className="glass-light absolute -bottom-8 right-6 rounded-[1.6rem] px-6 py-5 shadow-2xl">
                <p className="font-heading text-3xl text-charcoal-900">25+</p>
                <p className="mt-1 text-xs uppercase tracking-[0.24em] text-charcoal-500">
                  Years of Excellence
                </p>
              </div>
            </Reveal>

            <Reveal variants={revealRight}>
              <p className="section-kicker text-champagne-700">Hamari Pehchaan</p>
              <h2 className="mt-5 text-4xl font-heading font-light leading-tight text-charcoal-950 md:text-6xl">
                Peedhiyon Ki Virasat,
                <br />
                <span className="text-gradient-gold italic">Aaj Ki Presentation.</span>
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-8 text-charcoal-600 md:text-lg">
                Saroj Moun Jewellery ki shuruaat ek sapne se hui, jahan craftsmanship sirf
                design tak simit nahi tha, balki har customer ko khaas mehsoos karana bhi uska
                hissa tha. Hum 925 sterling silver, thoughtful detailing aur bharose ko ek hi
                experience mein pesh karte hain.
              </p>
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {[
                  { value: "925", label: "Certified purity" },
                  { value: "10K+", label: "Happy customers" },
                  { value: "100%", label: "Hallmarked promise" },
                ].map((item) => (
                  <div key={item.label} className="elevated-card rounded-[1.6rem] p-5">
                    <p className="font-heading text-3xl text-charcoal-900">{item.value}</p>
                    <p className="mt-2 text-xs uppercase tracking-[0.22em] text-charcoal-500">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-3 rounded-full bg-charcoal-900 px-7 py-4 text-sm uppercase tracking-[0.22em] text-ivory-50 transition-colors hover:bg-charcoal-800"
                >
                  Learn Our Story
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <div className="inline-flex items-center gap-3 rounded-full border border-champagne-300/70 bg-white/70 px-6 py-4 text-sm text-charcoal-700 backdrop-blur">
                  <Sparkles className="h-4 w-4 text-champagne-600" />
                  Premium packaging, gifting-ready feel
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section-padding bg-charcoal-950 text-ivory-50 section-divider">
        <div className="container-luxury">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="section-kicker text-champagne-300">Craftsmanship Film</p>
            <h2 className="mt-5 text-4xl font-heading font-light md:text-6xl">
              Visual Storytelling Jo Brand Ko
              <span className="text-gradient-gold italic"> High-End Banaye.</span>
            </h2>
            <p className="mt-6 text-base leading-8 text-ivory-100/68 md:text-lg">
              Ek cinematic spotlight section jahan placeholder video, layered text aur premium
              overlays milkar craftsmanship aur collection mood ko zyada memorable banate hain.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <Reveal variants={revealLeft}>
              <div className="media-frame spotlight-panel noise-overlay aspect-[16/10] rounded-[2rem]">
                <video
                  className="h-full w-full object-cover opacity-75"
                  autoPlay={!prefersReducedMotion}
                  muted
                  loop
                  playsInline
                  poster="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=1200&q=80"
                >
                  <source src="https://samplelib.com/lib/preview/mp4/sample-5s.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-r from-charcoal-950/80 via-charcoal-950/20 to-charcoal-950/75" />
                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-8 md:p-10">
                  <div className="glass-dark flex w-fit items-center gap-3 rounded-full px-4 py-3">
                    <Play className="h-4 w-4 text-champagne-300" />
                    <span className="text-xs uppercase tracking-[0.22em] text-ivory-100/70">
                      Placeholder campaign video
                    </span>
                  </div>
                  <div>
                    <p className="text-3xl font-heading font-light md:text-4xl">
                      Craft, shine aur bridal emotion ko ek moving experience mein dikhaiye.
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal variants={revealRight}>
              <div className="spotlight-panel gradient-border rounded-[2rem] p-8 md:p-10">
                <p className="section-kicker text-champagne-300">Media Direction</p>
                <div className="mt-8 space-y-5">
                  {[
                    "Hero-level storytelling with one high-impact video block.",
                    "Glassmorphism captions and glowing badges for a futuristic premium feel.",
                    "Easy placeholder swapping later when your real campaign assets are ready.",
                  ].map((item, index) => (
                    <div
                      key={item}
                      className="glass-dark flex items-start gap-4 rounded-[1.4rem] p-5"
                    >
                      <span className="font-heading text-2xl text-champagne-300">
                        0{index + 1}
                      </span>
                      <p className="text-sm leading-7 text-ivory-100/72">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section-padding bg-charcoal-950 text-ivory-50 section-divider">
        <div className="container-luxury">
          <Reveal className="mb-14 text-center">
            <p className="section-kicker text-champagne-300">Explore</p>
            <h2 className="mt-5 text-4xl font-heading font-light md:text-5xl">
              Shop By Category
            </h2>
          </Reveal>
          <StaggerReveal className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
            {categories.map((category) => (
              <StaggerItem key={category.name}>
                <Link
                  href={`/shop?category=${category.name.toLowerCase()}`}
                  className="group media-frame block aspect-[3/4] rounded-[1.8rem]"
                >
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <div className="glass-dark rounded-[1.4rem] p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-heading font-light text-ivory-50">
                            {category.name}
                          </h3>
                          <p className="mt-1 text-xs uppercase tracking-[0.22em] text-champagne-300">
                            {category.count}
                          </p>
                        </div>
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition-colors group-hover:bg-champagne-500 group-hover:text-charcoal-950">
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="section-padding luxury-mesh section-divider">
        <div className="container-luxury">
          <Reveal className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <p className="section-kicker text-champagne-700">Curated Selection</p>
              <h2 className="mt-4 text-4xl font-heading font-light text-charcoal-950 md:text-5xl">
                Best Sellers
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-charcoal-600 md:text-base">
                Handpicked 925 sterling pieces — editorial styling, hallmark trust, roz ya tyohaar dono ke liye.
              </p>
            </div>
            <Link
              href="/shop"
              className="elevated-card gradient-border mt-2 inline-flex w-fit items-center gap-2 rounded-full px-5 py-3 text-xs uppercase tracking-[0.22em] text-charcoal-800 transition-colors hover:border-champagne-400/50 hover:text-champagne-700 md:mt-0"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>

          <StaggerReveal className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <StaggerItem key={product.id}>
                <ProductCard {...product} />
              </StaggerItem>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* Full Width Banner */}
      <section className="relative isolate min-h-[500px] h-[60vh] overflow-hidden section-divider">
        <Image
          src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=1920&q=80"
          alt="Silver jewellery collection"
          fill
          className="scale-105 object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(17,18,22,0.2),rgba(17,18,22,0.75)),linear-gradient(110deg,rgba(17,18,22,0.88)_0%,rgba(17,18,22,0.45)_48%,rgba(17,18,22,0.82)_100%)]" />
        <div className="noise-overlay absolute inset-0" />
        <div className="absolute inset-0 flex items-center justify-center px-6 py-16">
          <Reveal className="glass-dark gradient-border max-w-3xl rounded-[2rem] px-8 py-10 text-center md:px-14 md:py-12">
            <p className="section-kicker text-champagne-300">Naye Designs</p>
            <h2 className="mt-5 text-4xl font-heading font-light text-ivory-50 md:text-6xl">
              Chaandi Ki
              <br />
              <span className="text-gradient-gold italic">Kala</span>
            </h2>
            <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-ivory-100/70 md:text-base">
              Fresh drops, bridal edits, aur roz ke staples — ek hi premium frame mein.
            </p>
            <div className="mt-10">
              <Link href="/shop">
                <span className="inline-flex items-center justify-center rounded-full bg-ivory-50 px-12 py-4 text-sm font-medium uppercase tracking-[0.22em] text-charcoal-900 shadow-lg transition-all duration-500 hover:bg-champagne-500 hover:text-ivory-50">
                  Explore Collection
                </span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="section-padding luxury-mesh section-divider">
        <div className="container-luxury">
          <Reveal className="mb-12 text-center">
            <p className="section-kicker text-champagne-700">Bharosa</p>
            <h2 className="mt-4 text-3xl font-heading font-light text-charcoal-950 md:text-4xl">
              Quality &amp; care, clearly stated
            </h2>
          </Reveal>
          <StaggerReveal className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
            {[
              {
                icon: Shield,
                title: "925 Hallmarked",
                desc: "Every piece is certified 925 sterling silver with official hallmark",
              },
              {
                icon: Truck,
                title: "Free Shipping",
                desc: "Complimentary delivery on all orders above ₹2,999 across India",
              },
              {
                icon: RefreshCw,
                title: "Easy Returns",
                desc: "7-day hassle-free returns with full refund guarantee",
              },
            ].map((item) => (
              <StaggerItem key={item.title}>
                <div className="elevated-card gradient-border h-full rounded-[1.75rem] p-8 text-center">
                  <div className="glass-dark mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10">
                    <item.icon className="h-7 w-7 text-champagne-400" strokeWidth={1.5} />
                  </div>
                  <h3 className="mb-3 text-lg font-heading font-medium text-charcoal-900">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-charcoal-600">{item.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding luxury-mesh section-divider">
        <div className="container-luxury">
          <Reveal className="mb-14 text-center">
            <p className="section-kicker text-champagne-700">Khush Customers</p>
            <h2 className="mt-4 text-4xl font-heading font-light text-charcoal-950 md:text-5xl">
              Unki Baatein
            </h2>
          </Reveal>

          <StaggerReveal className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <StaggerItem key={testimonial.name}>
                <div className="elevated-card gradient-border flex h-full flex-col rounded-[1.75rem] p-8 lg:p-10">
                  <div className="mb-6 flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-champagne-500 text-champagne-500" />
                    ))}
                  </div>
                  <p className="mb-8 flex-1 italic leading-relaxed text-charcoal-700">
                    &quot;{testimonial.text}&quot;
                  </p>
                  <div className="border-t border-ivory-200/80 pt-6">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-champagne-700">
                      {testimonial.product}
                    </p>
                    <div className="mt-4 flex items-center gap-4">
                      <div className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-champagne-200/80">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-charcoal-900">{testimonial.name}</p>
                        <p className="mt-1 text-xs uppercase tracking-wider text-charcoal-500">
                          {testimonial.location}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* Instagram Feed */}
      <section className="section-padding bg-charcoal-950 text-ivory-50">
        <div className="container-luxury">
          <Reveal className="mb-12 text-center">
            <p className="section-kicker text-champagne-300">Humse Judiye</p>
            <h2 className="mt-4 text-4xl font-heading font-light md:text-5xl">@sarojmounfashion</h2>
            <p className="mx-auto mt-4 max-w-md text-ivory-100/60">
              Instagram par hamari latest designs dekhiye aur apni favourite pick kariye
            </p>
          </Reveal>

          <StaggerReveal className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {instagramImages.map((image, index) => (
              <StaggerItem key={`${image}-${index}`}>
                <a
                  href="https://instagram.com/sarojmounfashion"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group media-frame relative block aspect-square overflow-hidden rounded-[1.25rem]"
                >
                  <Image
                    src={image}
                    alt={`Instagram post ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, 16vw"
                  />
                  <div className="noise-overlay pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute inset-0 flex items-center justify-center bg-charcoal-950/0 transition-colors duration-300 group-hover:bg-charcoal-950/45">
                    <Heart className="h-6 w-6 text-ivory-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>
                </a>
              </StaggerItem>
            ))}
          </StaggerReveal>

          <div className="mt-10 text-center">
            <a
              href="https://instagram.com/sarojmounfashion"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm tracking-wider text-champagne-400 transition-colors hover:text-champagne-300"
            >
              Follow on Instagram
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="section-padding luxury-mesh section-divider">
        <div className="container-luxury max-w-2xl text-center">
          <Reveal>
            <div className="elevated-card gradient-border rounded-[2rem] px-6 py-10 md:px-12 md:py-12">
              <p className="section-kicker text-champagne-700">Judi Rahiye</p>
              <h2 className="mt-4 text-3xl font-heading font-light text-charcoal-950 md:text-4xl">
                Exclusive Offers Paayein
              </h2>
              <p className="mt-6 text-charcoal-600">
                Subscribe karein aur paayein special discounts, silver rate updates, aur nayi collections ki pehli
                jhalak.
              </p>
              <div className="mt-10">
                <NewsletterSignup />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Lead Capture Popup */}
      <LeadCapturePopup
        isOpen={showLeadPopup}
        onClose={() => setShowLeadPopup(false)}
        title="Get 10% Off!"
        description="Subscribe to get exclusive offers and silver rate updates!"
        source="HOMEPAGE_POPUP"
      />
    </div>
  );
}
