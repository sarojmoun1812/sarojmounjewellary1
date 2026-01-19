"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
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
import { Button } from "@/components/ui/button";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { LeadCapturePopup } from "@/components/lead-capture-popup";
import { SilverRateIndicator } from "@/components/silver-rate-indicator";

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

export default function HomePage() {
  const [showLeadPopup, setShowLeadPopup] = useState(false);

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
    <div className="min-h-screen">
      {/* Silver Rate Indicator */}
      <SilverRateIndicator />

      {/* Hero Section */}
      <section className="relative h-screen min-h-[700px] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&q=80"
            alt="Silver Jewellery"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-900/80 via-charcoal-900/60 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative container-luxury z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-2xl"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-[11px] tracking-[0.4em] uppercase text-champagne-400 mb-6"
            >
              Handcrafted Excellence
            </motion.p>
            
            <h1 className="text-5xl md:text-7xl font-heading font-light text-ivory-50 mb-6 leading-[1.1]">
              Pure Silver,
              <br />
              <span className="italic text-champagne-400">Timeless Beauty</span>
            </h1>
            
            <p className="text-lg text-ivory-100/80 mb-10 max-w-lg leading-relaxed">
              Discover our collection of hallmarked 925 sterling silver jewellery. 
              Each piece is handcrafted with love, designed to make you shine.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/shop">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-10 py-4 bg-champagne-500 text-charcoal-900 text-sm font-medium tracking-[0.15em] uppercase transition-all duration-300 hover:bg-champagne-400"
                >
                  Shop Now
                  <ArrowRight className="inline-block ml-3 h-4 w-4" />
                </motion.button>
              </Link>
              <Link href="/about">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-10 py-4 border border-ivory-50/30 text-ivory-50 text-sm font-medium tracking-[0.15em] uppercase transition-all duration-300 hover:bg-ivory-50/10"
                >
                  Our Story
                </motion.button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="flex flex-wrap gap-8 mt-14"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-champagne-500/20 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-champagne-400" />
                </div>
                <span className="text-sm text-ivory-100/70">Hallmarked 925</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-champagne-500/20 flex items-center justify-center">
                  <Truck className="h-5 w-5 text-champagne-400" />
                </div>
                <span className="text-sm text-ivory-100/70">Free Shipping</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-champagne-500/20 flex items-center justify-center">
                  <RefreshCw className="h-5 w-5 text-champagne-400" />
                </div>
                <span className="text-sm text-ivory-100/70">7-Day Returns</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-ivory-50/30 rounded-full flex items-start justify-center p-1.5">
            <motion.div 
              className="w-1.5 h-3 bg-champagne-400 rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Our Story Section */}
      <section className="section-padding bg-ivory-50">
        <div className="container-luxury">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-[4/5] relative rounded-sm overflow-hidden">
                <Image
                  src="/saroj.jpeg"
                  alt="Saroj Moun - Founder"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-champagne-500 text-charcoal-900 p-6 max-w-[200px]">
                <p className="text-3xl font-heading font-light mb-1">25+</p>
                <p className="text-xs tracking-wider uppercase">Years of Excellence</p>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-[11px] tracking-[0.3em] uppercase text-champagne-600 mb-4">
                Our Heritage
              </p>
              <h2 className="text-4xl md:text-5xl font-heading font-light text-charcoal-900 mb-6">
                A Legacy of
                <br />
                <span className="italic">Craftsmanship</span>
              </h2>
              <p className="text-charcoal-600 leading-relaxed mb-6">
                Founded by Saroj Moun, our journey began with a simple passion - 
                creating silver jewellery that tells a story. Based in Jind, Haryana, 
                we are a family of artisans who have inherited the art of silver 
                jewellery making through generations.
              </p>
              <p className="text-charcoal-600 leading-relaxed mb-8">
                We use only certified 925 sterling silver, ensuring each creation 
                is not just beautiful but built to last a lifetime. Every piece 
                carries our hallmark of quality and love.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-8 mb-10">
                <div>
                  <p className="text-3xl font-heading font-light text-champagne-600 mb-1">925</p>
                  <p className="text-xs tracking-wider uppercase text-charcoal-500">Sterling Silver</p>
                </div>
                <div>
                  <p className="text-3xl font-heading font-light text-champagne-600 mb-1">10K+</p>
                  <p className="text-xs tracking-wider uppercase text-charcoal-500">Happy Customers</p>
                </div>
                <div>
                  <p className="text-3xl font-heading font-light text-champagne-600 mb-1">100%</p>
                  <p className="text-xs tracking-wider uppercase text-charcoal-500">Hallmarked</p>
                </div>
              </div>
              
              <Link href="/about">
                <button className="btn-luxury-outline">
                  Learn Our Story
                  <ArrowRight className="inline-block ml-3 h-4 w-4" />
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <section className="section-padding bg-charcoal-900">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="text-[11px] tracking-[0.3em] uppercase text-champagne-400 mb-4">
              Explore
            </p>
            <h2 className="text-4xl md:text-5xl font-heading font-light text-ivory-50">
              Shop by Category
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={`/shop?category=${category.name.toLowerCase()}`}
                  className="group relative aspect-[3/4] block overflow-hidden"
                >
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/80 via-charcoal-900/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-heading font-light text-ivory-50 mb-1">
                      {category.name}
                    </h3>
                    <p className="text-xs text-champagne-400 tracking-wider">
                      {category.count}
                    </p>
                  </div>
                  <div className="absolute top-4 right-4 w-10 h-10 bg-ivory-50/0 group-hover:bg-ivory-50 rounded-full flex items-center justify-center transition-all duration-300">
                    <ArrowRight className="h-5 w-5 text-ivory-50 group-hover:text-charcoal-900 transition-colors" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="section-padding bg-ivory-50">
        <div className="container-luxury">
          <motion.div 
            className="flex flex-col md:flex-row md:items-end md:justify-between mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div>
              <p className="text-[11px] tracking-[0.3em] uppercase text-champagne-600 mb-4">
                Curated Selection
              </p>
              <h2 className="text-4xl md:text-5xl font-heading font-light text-charcoal-900">
                Best Sellers
              </h2>
            </div>
            <Link 
              href="/shop" 
              className="mt-6 md:mt-0 text-xs tracking-[0.2em] uppercase text-charcoal-700 hover:text-champagne-600 transition-colors flex items-center gap-2"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProductCard {...product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Full Width Banner */}
      <section className="relative h-[60vh] min-h-[500px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=1920&q=80"
          alt="Silver jewellery collection"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-charcoal-900/60" />
        <div className="absolute inset-0 flex items-center justify-center text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[11px] tracking-[0.4em] uppercase text-champagne-300 mb-6">
              New Arrivals
            </p>
            <h2 className="text-4xl md:text-6xl font-heading font-light text-white mb-8 max-w-3xl">
              The Art of
              <br />
              <span className="italic">Silver Making</span>
            </h2>
            <Link href="/shop">
              <button className="px-12 py-4 bg-ivory-50 text-charcoal-900 text-sm font-medium tracking-[0.2em] uppercase transition-all duration-500 hover:bg-champagne-500 hover:text-ivory-50">
                Explore Collection
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-20 bg-white">
        <div className="container-luxury">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                icon: Shield, 
                title: "925 Hallmarked", 
                desc: "Every piece is certified 925 sterling silver with official hallmark" 
              },
              { 
                icon: Truck, 
                title: "Free Shipping", 
                desc: "Complimentary delivery on all orders above ₹2,999 across India" 
              },
              { 
                icon: RefreshCw, 
                title: "Easy Returns", 
                desc: "7-day hassle-free returns with full refund guarantee" 
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-ivory-100 mb-6">
                  <item.icon className="h-7 w-7 text-champagne-600" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-heading font-medium text-charcoal-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-charcoal-500 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-ivory-100">
        <div className="container-luxury">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[11px] tracking-[0.3em] uppercase text-champagne-600 mb-4">
              Customer Love
            </p>
            <h2 className="text-4xl md:text-5xl font-heading font-light text-charcoal-900">
              What They Say
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                className="bg-white p-8 lg:p-10"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-champagne-500 fill-champagne-500" />
                  ))}
                </div>

                <p className="text-charcoal-700 leading-relaxed mb-8 italic">
                  &quot;{testimonial.text}&quot;
                </p>

                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-charcoal-900">{testimonial.name}</p>
                    <p className="text-xs text-charcoal-400 tracking-wider uppercase mt-1">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Feed */}
      <section className="section-padding bg-charcoal-900">
        <div className="container-luxury">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[11px] tracking-[0.3em] uppercase text-champagne-400 mb-4">
              Follow Us
            </p>
            <h2 className="text-4xl md:text-5xl font-heading font-light text-ivory-50 mb-4">
              @sarojmounfashion
            </h2>
            <p className="text-ivory-100/60 max-w-md mx-auto">
              Join our community and see how our customers style their silver jewellery
            </p>
          </motion.div>

          {/* Instagram Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80",
              "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80",
              "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80",
              "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80",
              "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&q=80",
              "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80",
            ].map((image, index) => (
              <motion.a
                key={index}
                href="https://instagram.com/sarojmounfashion"
                target="_blank"
                rel="noopener noreferrer"
                className="relative aspect-square group overflow-hidden"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Image
                  src={image}
                  alt={`Instagram post ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-charcoal-900/0 group-hover:bg-charcoal-900/50 transition-colors duration-300 flex items-center justify-center">
                  <Heart className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.a>
            ))}
          </div>

          <div className="text-center mt-10">
            <a
              href="https://instagram.com/sarojmounfashion"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-champagne-400 hover:text-champagne-300 transition-colors text-sm tracking-wider"
            >
              Follow on Instagram
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="section-padding bg-ivory-50">
        <div className="container-luxury max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[11px] tracking-[0.3em] uppercase text-champagne-600 mb-4">
              Stay Connected
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-light text-charcoal-900 mb-6">
              Join Our Community
            </h2>
            <p className="text-charcoal-600 mb-10">
              Subscribe to receive exclusive offers, silver rate updates, and early access to new collections.
            </p>
            <NewsletterSignup />
          </motion.div>
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
