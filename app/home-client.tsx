"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useState, useEffect } from "react";
import { ArrowRight, Shield, Truck, RefreshCw, Sparkles, Instagram } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { Reveal, StaggerItem, StaggerReveal } from "@/components/reveal";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { LeadCapturePopup } from "@/components/lead-capture-popup";
import { useSilverRate } from "@/lib/use-silver-rate";
import { canShowLeadPrompt, markLeadPromptShown } from "@/lib/lead-capture";
import type { HomeCategory, HomeProduct } from "@/lib/home";
import {
  blurReveal,
  fadeIn,
  fadeUp,
  heroCascade,
  revealLeft,
  revealRight,
} from "@/lib/motion";

interface HomeClientProps {
  featuredProducts: HomeProduct[];
  categories: HomeCategory[];
}

export function HomeClient({ featuredProducts, categories }: HomeClientProps) {
  const [showLeadPopup, setShowLeadPopup] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const { silverRate, loading: silverRateLoading } = useSilverRate();

  useEffect(() => {
    if (!canShowLeadPrompt()) return;

    // Long enough that someone has actually looked at the collection first.
    // Ten seconds landed while the hero was still animating in.
    const timer = setTimeout(() => {
      if (!canShowLeadPrompt()) return;
      setShowLeadPopup(true);
      markLeadPromptShown();
    }, 35000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-ivory-50">

      <section className="pt-below-header relative isolate min-h-screen overflow-hidden bg-charcoal-950 text-ivory-50">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(196,167,100,0.18),transparent_45%),radial-gradient(circle_at_bottom_left,rgba(196,167,100,0.1),transparent_50%),linear-gradient(150deg,#111216_0%,#1b1c22_55%,#111216_100%)]" />
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
                Haathon Ki Karigari, Jind Se
              </motion.p>
              <motion.h1
                variants={fadeUp}
                className="max-w-3xl text-5xl font-heading font-light leading-[1.02] text-ivory-50 md:text-7xl"
              >
                Chaandi Ka Husn,
                <br />
                <span className="text-gradient-gold italic">Aapke Liye.</span>
              </motion.h1>
              <motion.p
                variants={fadeUp}
                className="mt-7 max-w-2xl text-lg leading-relaxed text-ivory-100/75 md:text-xl"
              >
                Jaipur aur Udaipur ke karigaron ke haathon se bane, hallmarked 92.5
                pure silver ke gehne. Har piece ka daam aaj ke chaandi ke bhaav par,
                bilkul saaf-saaf. Jind, Haryana se poore India tak.
              </motion.p>

              {/* The rate badge used to sit above the hero in the old powder
                  palette, where the fixed header covered it completely. Since
                  every price on the site is derived from this number, it belongs
                  somewhere a customer can actually see it. */}
              {!silverRateLoading && (
                <motion.div variants={fadeUp} className="mt-8">
                  <div className="inline-flex items-center gap-2 rounded-full border border-champagne-400/30 bg-charcoal-950/40 px-5 py-2.5 text-sm text-champagne-200 backdrop-blur-md">
                    <Sparkles className="h-4 w-4 text-champagne-300" />
                    <span>
                      Aaj ka chaandi bhaav:{" "}
                      <strong className="text-champagne-200">
                        ₹{silverRate.toFixed(2)}/gram
                      </strong>
                    </span>
                  </div>
                </motion.div>
              )}

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
                  { value: "92.5", label: "Hallmarked silver" },
                  { value: "Handmade", label: "Jaipur & Udaipur karigars" },
                  { value: "Jind", label: "Haryana, India" },
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
                  { icon: Shield, label: "Hallmarked 92.5" },
                  { icon: Truck, label: "Free Shipping Above ₹2,999" },
                  { icon: RefreshCw, label: "7-Day Returns" },
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
              <div className="media-frame relative aspect-[4/5] overflow-hidden rounded-[2rem]">
                {featuredProducts[0]?.image ? (
                  <Image
                    src={featuredProducts[0].image}
                    alt={featuredProducts[0].name}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1280px) 100vw, 45vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(196,167,100,0.4),transparent_50%),linear-gradient(165deg,#1a1712_0%,#0f1014_55%,#241c14_100%)]" />
                )}
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,18,22,0.08),rgba(17,18,22,0.72))]" />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                  <div className="glass-dark rounded-[1.6rem] p-5">
                    <p className="section-kicker text-champagne-300">Temple Work</p>
                    <p className="mt-3 max-w-xs text-sm leading-relaxed text-ivory-100/75">
                      Oxidised silver, hand-set stones, aur ghungroo detailing —
                      Jaipur aur Udaipur ki traditional karigari jo peedhiyon se
                      chali aa rahi hai.
                    </p>
                  </div>
                </div>
              </div>
              <div className="glass-dark absolute -bottom-8 right-4 max-w-[220px] rounded-[1.5rem] p-5 shadow-2xl">
                <p className="text-3xl font-heading text-champagne-300">92.5</p>
                <p className="mt-2 text-sm uppercase tracking-[0.22em] text-ivory-100/60">
                  Hallmarked Sterling Silver
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
                  sizes="(max-width: 1024px) 100vw, 45vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/45 via-transparent to-transparent" />
              </div>
              <div className="glass-light absolute -bottom-8 right-6 rounded-[1.6rem] px-6 py-5 shadow-2xl">
                <p className="font-heading text-2xl text-charcoal-900">Saroj Moun</p>
                <p className="mt-1 text-xs uppercase tracking-[0.24em] text-charcoal-500">
                  Founder
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
                  { value: "Live", label: "Silver rate pricing" },
                  { value: "7 Day", label: "Easy returns" },
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

      {categories.length > 0 && (
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
                    href={`/shop?category=${encodeURIComponent(category.slug)}`}
                    className="group media-frame relative block aspect-[3/4] rounded-[1.8rem]"
                  >
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-charcoal-800 via-charcoal-900 to-charcoal-950" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/10 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <div className="glass-dark rounded-[1.4rem] p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <h3 className="text-xl font-heading font-light text-ivory-50">
                              {category.name}
                            </h3>
                            <p className="mt-1 text-xs uppercase tracking-[0.22em] text-champagne-300">
                              {category.count}{" "}
                              {category.count === 1 ? "Design" : "Designs"}
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
      )}

      {featuredProducts.length > 0 && (
        <section className="section-padding luxury-mesh section-divider">
          <div className="container-luxury">
            <Reveal className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-xl">
                <p className="section-kicker text-champagne-700">Curated Selection</p>
                <h2 className="mt-4 text-4xl font-heading font-light text-charcoal-950 md:text-5xl">
                  Our Picks
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-charcoal-600 md:text-base">
                  Handpicked 925 sterling pieces — hallmark trust, roz ya tyohaar dono ke liye.
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
      )}

      {/* Full Width Banner */}
      <section className="relative isolate min-h-[420px] overflow-hidden section-divider">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(196,167,100,0.16),transparent_60%),linear-gradient(120deg,#111216_0%,#22232b_50%,#111216_100%)]" />
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
              Bridal sets, roz ke staples, aur order par banaye gaye designs — sab ek jagah.
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
                title: "92.5 Hallmarked",
                desc: "Handcrafted in 92.5 sterling silver, hallmarked for purity",
              },
              {
                icon: Truck,
                title: "Free Shipping",
                desc: "Complimentary delivery on all orders above ₹2,999 across India",
              },
              {
                icon: RefreshCw,
                title: "Easy Returns",
                desc: "7-day returns on unworn pieces in their original packaging",
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

      {/* Instagram */}
      <section className="section-padding bg-charcoal-950 text-ivory-50">
        <div className="container-luxury">
          <Reveal className="mx-auto max-w-xl text-center">
            <p className="section-kicker text-champagne-300">Humse Judiye</p>
            <h2 className="mt-4 text-4xl font-heading font-light md:text-5xl">
              @sarojmounfashion
            </h2>
            <p className="mx-auto mt-4 max-w-md text-ivory-100/60">
              Nayi designs, behind-the-scenes karigari, aur customer orders —
              sab Instagram par.
            </p>
            <a
              href="https://instagram.com/sarojmounfashion"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-10 inline-flex items-center gap-3 rounded-full bg-champagne-500 px-8 py-4 text-sm font-medium uppercase tracking-[0.22em] text-charcoal-950 transition-colors hover:bg-champagne-400"
            >
              <Instagram className="h-4 w-4" />
              Follow on Instagram
            </a>
          </Reveal>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="section-padding luxury-mesh section-divider">
        <div className="container-luxury max-w-2xl text-center">
          <Reveal>
            <div className="elevated-card gradient-border rounded-[2rem] px-6 py-10 md:px-12 md:py-12">
              <p className="section-kicker text-champagne-700">Judi Rahiye</p>
              <h2 className="mt-4 text-3xl font-heading font-light text-charcoal-950 md:text-4xl">
                Nayi Collection Ki Pehli Jhalak
              </h2>
              <p className="mt-6 text-charcoal-600">
                Subscribe karein aur paayein silver rate updates aur nayi collections ki
                pehli jhalak, seedhe aapke inbox mein.
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
        title="Kuch Khaas Dhoondh Rahe Hain?"
        description="Apna number chhodein — Saroj aapko WhatsApp par help karengi."
        source="HOMEPAGE_POPUP"
      />
    </div>
  );
}
