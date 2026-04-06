"use client";

import { Heart, Award, Sparkles, Target, Shield, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { GoogleMap } from "@/components/google-map";
import { Reveal, StaggerReveal, StaggerItem } from "@/components/reveal";
import { revealLeft, revealRight } from "@/lib/motion";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-ivory-50">
      <section className="section-padding luxury-mesh border-b border-ivory-200/70 pt-28">
        <div className="container-luxury">
          <Reveal className="mx-auto max-w-3xl text-center">
            <div className="glass-light mx-auto mb-8 inline-flex items-center gap-2 rounded-full px-6 py-3">
              <Heart className="h-4 w-4 text-champagne-600" />
              <span className="section-kicker text-champagne-700">Crafted with care</span>
            </div>
            <h1 className="text-4xl font-heading font-light text-charcoal-950 md:text-6xl">
              About Saroj Moun
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-charcoal-600">
              Where timeless elegance meets modern craftsmanship in pure silver jewellery.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-luxury">
          <div className="grid items-center gap-14 md:grid-cols-2">
            <Reveal variants={revealLeft}>
              <p className="section-kicker text-champagne-700">Our story</p>
              <h2 className="mt-4 text-3xl font-heading font-light text-charcoal-950 md:text-4xl">Heritage &amp; heart</h2>
              <div className="mt-8 space-y-5 text-base leading-relaxed text-charcoal-600 md:text-lg">
                <p>
                  From the heart of Sherkhan Kheri, Kaithal, Saroj Moun has become a symbol of inspiration and
                  empowerment. As the elected Sarpanch of her village and a certified expert in cutting, tailoring,
                  and beauty, Saroj&apos;s journey is a testament to resilience, vision, and relentless hard work.
                </p>
                <p>
                  Starting with humble beginnings, Saroj transformed her skills into a thriving business in Jind, now
                  serving customers all across India. Her keen eye for fashion and her signature designs have made her a
                  trendsetter—her style and suggestions are celebrated throughout Jind and beyond.
                </p>
                <p>
                  Saroj&apos;s achievements are not hers alone—her journey is powered by the unwavering support of her
                  husband, a dedicated police officer who stands by her side in every challenge, and her two
                  children—a son and a daughter, with her daughter being an IIT Madras graduate and a lead developer at
                  top firms.
                </p>
                <p>
                  Saroj Moun&apos;s story inspires women everywhere to break barriers, embrace their uniqueness, and lead
                  with kindness and strength.
                </p>
              </div>
            </Reveal>

            <Reveal variants={revealRight} className="relative">
              <div className="media-frame relative aspect-[4/5] overflow-hidden rounded-[2rem]">
                <Image src="/saroj.jpeg" alt="Saroj Moun - Founder" fill className="object-cover object-center" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/40 via-transparent to-transparent" />
              </div>
              <div className="glass-light absolute -bottom-6 right-4 max-w-[220px] rounded-[1.5rem] px-6 py-5 shadow-xl md:right-8">
                <p className="font-heading text-3xl text-charcoal-900">25+</p>
                <p className="mt-1 text-xs uppercase tracking-[0.24em] text-charcoal-500">Years of excellence</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section-padding luxury-mesh border-y border-ivory-200/70">
        <div className="container-luxury">
          <Reveal className="mb-14 text-center">
            <p className="section-kicker text-champagne-700">Principles</p>
            <h2 className="mt-4 text-3xl font-heading font-light text-charcoal-950 md:text-4xl">Our values</h2>
            <p className="mx-auto mt-4 max-w-2xl text-charcoal-600">The principles that guide everything we do.</p>
          </Reveal>

          <StaggerReveal className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Sparkles,
                title: "Authenticity",
                body: "Every piece is crafted from hallmarked 925 sterling silver, ensuring genuine, high-quality jewellery.",
              },
              {
                icon: Award,
                title: "Craftsmanship",
                body: "Our artisans blend traditional techniques with contemporary aesthetics for intricate, lasting design.",
              },
              {
                icon: Shield,
                title: "Trust",
                body: "Transparent pricing, secure payments, and hassle-free returns build lasting relationships.",
              },
            ].map((v) => (
              <StaggerItem key={v.title}>
                <div className="elevated-card gradient-border h-full rounded-[1.75rem] p-8">
                  <div className="glass-dark mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10">
                    <v.icon className="h-7 w-7 text-champagne-300" />
                  </div>
                  <h3 className="text-xl font-heading font-light text-charcoal-950">{v.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-charcoal-600">{v.body}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerReveal>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-luxury">
          <div className="grid gap-8 md:grid-cols-2">
            <Reveal variants={revealLeft}>
              <div className="spotlight-panel gradient-border h-full rounded-[2rem] p-10 text-ivory-50">
                <Target className="mb-6 h-10 w-10 text-champagne-300" />
                <h3 className="font-heading text-2xl font-light md:text-3xl">Our mission</h3>
                <p className="mt-4 text-base leading-relaxed text-ivory-100/75">
                  To make beautiful, authentic silver jewellery accessible to every woman in India, combining traditional
                  craftsmanship with transparent, fair pricing and exceptional customer service.
                </p>
              </div>
            </Reveal>
            <Reveal variants={revealRight}>
              <div className="elevated-card gradient-border h-full rounded-[2rem] border-charcoal-200/80 bg-charcoal-950 p-10 text-ivory-50">
                <Sparkles className="mb-6 h-10 w-10 text-champagne-300" />
                <h3 className="font-heading text-2xl font-light md:text-3xl">Our vision</h3>
                <p className="mt-4 text-base leading-relaxed text-ivory-100/72">
                  To become India&apos;s most trusted online destination for silver jewellery, known for our quality,
                  transparency, and the joy we bring to customers through every piece they wear.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section-padding luxury-mesh">
        <div className="container-luxury">
          <Reveal className="mb-14 text-center">
            <p className="section-kicker text-champagne-700">Why us</p>
            <h2 className="mt-4 text-3xl font-heading font-light text-charcoal-950 md:text-4xl">
              Why choose Saroj Moun?
            </h2>
          </Reveal>
          <StaggerReveal className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { t: "100% hallmarked", d: "Certified silver in every piece" },
              { t: "Transparent pricing", d: "Live silver rates with clear breakdowns" },
              { t: "Beautiful packaging", d: "Gifting-ready presentation" },
              { t: "Secure payments", d: "Trusted checkout with COD where available" },
              { t: "Fast delivery", d: "Reliable shipping across India" },
              { t: "Easy returns", d: "7-day return window" },
              { t: "Warranty", d: "Support for manufacturing defects" },
              { t: "Support", d: "WhatsApp & email for queries" },
            ].map((item) => (
              <StaggerItem key={item.t}>
                <div className="elevated-card rounded-[1.25rem] p-6 text-center">
                  <p className="font-heading text-lg text-charcoal-900">{item.t}</p>
                  <p className="mt-2 text-sm text-charcoal-600">{item.d}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerReveal>
        </div>
      </section>

      <section className="section-padding border-t border-ivory-200/80 bg-ivory-50">
        <div className="container-luxury">
          <Reveal className="mb-12 text-center">
            <div className="glass-light mx-auto mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2">
              <MapPin className="h-4 w-4 text-champagne-600" />
              <span className="section-kicker text-champagne-700">Visit us</span>
            </div>
            <h2 className="text-3xl font-heading font-light text-charcoal-950 md:text-4xl">Our store location</h2>
            <p className="mx-auto mt-4 max-w-2xl text-charcoal-600">
              Experience our silver jewellery collection in person at our store.
            </p>
          </Reveal>
          <Reveal>
            <div className="overflow-hidden rounded-[1.5rem] border border-ivory-200/80 shadow-lg">
              <GoogleMap address="B-90 Police Colony, Jind, Haryana 126102, India" height="450px" showInfoCard />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-padding bg-charcoal-950 text-ivory-50">
        <div className="container-luxury max-w-4xl text-center">
          <Reveal>
            <h2 className="text-3xl font-heading font-light md:text-4xl">Ready to find your perfect piece?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-ivory-100/70">
              Explore our collection of handcrafted silver jewellery.
            </p>
            <Link
              href="/shop"
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-champagne-500 px-8 py-4 text-sm font-medium uppercase tracking-[0.18em] text-charcoal-950 transition-colors hover:bg-champagne-400"
            >
              Shop now
              <Sparkles className="h-5 w-5" />
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
