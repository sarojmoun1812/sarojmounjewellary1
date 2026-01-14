"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ProductCard } from "@/components/product-card";
import { ArrowRight, Shield, Truck, RefreshCw, Star } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { LeadCapturePopup } from "@/components/lead-capture-popup";
import { MarqueeBanner } from "@/components/marquee-banner";

// Premium silver jewellery images
const featuredProducts = [
  {
    slug: "ethnic-jhumka-earrings",
    price: 249900,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
  },
];

const categories = [
  { name: "Rings", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80" },
  { name: "Necklaces", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80" },
  { name: "Kadas", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80" },
  { name: "Earrings", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80" },
];

export default function HomePage() {
  const [showLeadPopup, setShowLeadPopup] = useState(false);

  // Show lead capture popup after 10 seconds if not already captured
  useEffect(() => {
    const alreadyCaptured = localStorage.getItem("lead_captured");
    if (alreadyCaptured) return;

    const timer = setTimeout(() => {
      setShowLeadPopup(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-ivory-50">
      {/* Scrolling Marquee Banner */}
      <MarqueeBanner />
      
      {/* Hero Section - Full Screen with Parallax */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&q=80"
            alt="Luxury silver jewellery"
            fill
            className="object-cover"
            priority
            quality={95}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal-900/40 via-charcoal-900/30 to-charcoal-900/60" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-[11px] tracking-[0.4em] uppercase text-champagne-300 mb-8"
          >
            Premium 925 Silver Collection
          </motion.p>
          
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-light tracking-tight mb-8"
          >
            Everyday Silver,
            <br />
            <span className="italic">Elevated.</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-base md:text-lg text-ivory-100/80 max-w-xl mx-auto font-light tracking-wide mb-12"
          >
            Discover handcrafted silver jewellery designed for the modern woman. 
            Timeless elegance meets contemporary style.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/shop">
              <button className="group px-12 py-4 bg-ivory-50 text-charcoal-900 text-xs font-medium tracking-[0.2em] uppercase transition-all duration-500 hover:bg-champagne-500 hover:text-ivory-50">
                Shop Collection
                <ArrowRight className="inline-block ml-3 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </Link>
            <Link href="/about">
              <button className="px-12 py-4 border border-ivory-50/50 text-ivory-50 text-xs font-medium tracking-[0.2em] uppercase transition-all duration-500 hover:bg-ivory-50/10">
                Our Story
              </button>
            </Link>
          </motion.div>
        </div>

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
      </section>

      {/* Shop by Category - Elegant Grid */}
      <section className="section-padding bg-ivory-50">
        <div className="container-luxury">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[11px] tracking-[0.3em] uppercase text-champagne-600 mb-4">
              Explore Our Collection
            </p>
            <h2 className="text-4xl md:text-5xl font-heading font-light text-charcoal-900">
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
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link
                  href={`/shop?category=${category.name.toLowerCase()}`}
                  className="group block relative aspect-[3/4] overflow-hidden"
                >
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/70 via-charcoal-900/20 to-transparent" />
                  <div className="absolute inset-0 flex flex-col items-center justify-end pb-8">
                    <h3 className="text-xl md:text-2xl font-heading font-light text-white tracking-wide mb-2">
                      {category.name}
                    </h3>
                    <span className="text-[10px] tracking-[0.2em] uppercase text-champagne-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Explore →
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial Section - Split Layout */}
      <section className="section-padding bg-white">
        <div className="container-luxury">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-[4/5] overflow-hidden"
            >
              <Image
                src="/peacock-jewellery.jpeg"
                alt="Handcrafted silver jewellery"
                fill
                className="object-cover"
              />
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:py-12"
            >
              <p className="text-[11px] tracking-[0.3em] uppercase text-champagne-600 mb-6">
                Our Craft
              </p>
              <h2 className="text-4xl md:text-5xl font-heading font-light text-charcoal-900 leading-tight mb-8">
                Handcrafted with<br />
                <span className="italic">Love & Tradition</span>
              </h2>
              <p className="text-charcoal-600 leading-relaxed mb-8 text-base">
                Every piece in our collection is meticulously handcrafted by skilled artisans 
                who have inherited the art of silver jewellery making through generations. 
                We use only certified 925 sterling silver, ensuring each creation is not just 
                beautiful but built to last a lifetime.
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

      {/* Best Sellers - Product Grid */}
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
      <section className="relative h-[70vh] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=1920&q=80"
          alt="Silver jewellery collection"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-charcoal-900/50" />
        <div className="absolute inset-0 flex items-center justify-center text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[11px] tracking-[0.4em] uppercase text-champagne-300 mb-6">
              New Collection
            </p>
            <h2 className="text-4xl md:text-6xl font-heading font-light text-white mb-8 max-w-3xl">
              The Art of<br />
              <span className="italic">Silver Making</span>
            </h2>
            <Link href="/shop">
              <button className="px-12 py-4 bg-ivory-50 text-charcoal-900 text-xs font-medium tracking-[0.2em] uppercase transition-all duration-500 hover:bg-champagne-500 hover:text-ivory-50">
                Explore Now
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Trust Badges - Minimal */}
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

      {/* Testimonials - Elegant */}
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
            {[
              {
                name: "Priya Sharma",
                location: "Mumbai",
                rating: 5,
                text: "The craftsmanship is incredible. My kada has become my everyday essential - elegant and comfortable.",
              },
              {
                name: "Anita Patel",
                location: "Delhi",
                rating: 5,
                text: "Perfect for my wedding! The necklace was exactly as shown. Beautiful packaging and prompt delivery.",
              },
              {
                name: "Sneha Reddy",
                location: "Hyderabad",
                rating: 5,
                text: "Love the minimal design aesthetic. These pieces go with everything from casual to formal wear.",
              },
            ].map((testimonial, index) => (
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
                  "{testimonial.text}"
                </p>

                <div>
                  <p className="font-medium text-charcoal-900">{testimonial.name}</p>
                  <p className="text-xs text-charcoal-400 tracking-wider uppercase mt-1">
                    {testimonial.location}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section - Luxury */}
      <section className="section-padding bg-charcoal-900">
        <div className="container-luxury max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[11px] tracking-[0.3em] uppercase text-champagne-400 mb-4">
              Stay Updated
            </p>
            <h2 className="text-3xl md:text-4xl font-heading font-light text-ivory-50 mb-6">
              Join Our Community
            </h2>
            <p className="text-ivory-100/70 mb-10">
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
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-7 h-12 border-2 border-powder-400 rounded-full flex items-start justify-center p-2 bg-white/30 backdrop-blur-sm">
            <motion.div 
              className="w-1.5 h-2.5 bg-powder-600 rounded-full shadow-lg"
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </section>

      {/* Featured Products */}
      <section className="py-28 bg-gradient-to-b from-white via-powder-50/40 to-white relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-powder-200/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.span 
              className="inline-block px-6 py-2 bg-gradient-to-r from-powder-400 to-blue-500 text-white text-sm font-bold tracking-wider uppercase mb-6 rounded-full shadow-lg"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              ✨ Trending Now
            </motion.span>
            <h2 className="text-6xl md:text-7xl font-heading font-bold bg-gradient-to-r from-gray-800 via-powder-500 to-blue-600 bg-clip-text text-transparent mb-6">
              Best Sellers
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our most loved pieces, handpicked for you
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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

          <motion.div 
            className="text-center mt-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Link href="/shop">
              <Button size="lg" className="group border-2 bg-gradient-to-r from-powder-400 to-blue-500 text-white hover:from-powder-500 hover:to-blue-600 shadow-xl rounded-full px-10 py-6 text-lg">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Category Showcase */}
      <section className="py-24 bg-primary relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-heading font-bold text-white mb-6">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-300">
              Find the perfect piece for every occasion
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Rings", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80" },
              { name: "Necklaces", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80" },
              { name: "Kadas", image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80" },
              { name: "Earrings", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80" },
            ].map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={`/shop?category=${category.name.toLowerCase()}`}
                  className="group relative h-80 block rounded-2xl overflow-hidden shadow-2xl"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10 group-hover:from-accent/20 transition-all duration-500" />
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
                    <h3 className="text-3xl font-heading font-bold text-white mb-2 group-hover:scale-110 transition-transform">
                      {category.name}
                    </h3>
                    <span className="text-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2">
                      Explore <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "Hallmarked Silver", desc: "Certified 925 sterling silver on all pieces" },
              { icon: Truck, title: "PAN India Delivery", desc: "Free shipping on orders above ₹2,999" },
              { icon: RefreshCw, title: "Easy Returns", desc: "7-day hassle-free return policy" },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <motion.div
                  className="h-20 w-20 rounded-full bg-accent/10 flex items-center justify-center mb-4"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <item.icon className="h-10 w-10 text-accent" />
                </motion.div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Testimonials Carousel */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-accent rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block text-accent text-sm font-semibold tracking-wider uppercase mb-4">
              What Our Customers Say
            </span>
            <h2 className="text-5xl md:text-6xl font-heading font-bold text-primary mb-4">
              Stories of Love & Trust
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of happy customers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Priya Sharma",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
                rating: 5,
                text: "Absolutely stunning kada! The craftsmanship is incredible and it arrived beautifully packaged. Will definitely order again!",
                product: "Silver Kada",
              },
              {
                name: "Anita Patel",
                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
                rating: 5,
                text: "The necklace I ordered for my wedding was perfect! Such intricate detailing and the silver quality is top-notch.",
                product: "Temple Necklace",
              },
              {
                name: "Sneha Reddy",
                image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80",
                rating: 5,
                text: "Best silver jewellery purchase ever! Fast delivery, beautiful pieces, and amazing customer service. Highly recommend!",
                product: "Jhumka Earrings",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300 relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ y: -8 }}
              >
                {/* Quote Icon */}
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-accent rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-3xl font-serif">"</span>
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-accent fill-accent" />
                  ))}
                </div>

                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  "{testimonial.text}"
                </p>

                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-accent/20">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">Purchased: {testimonial.product}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Parallax Hero Section - Susicala Style */}
      <ParallaxHero />

      {/* Instagram Feed Section */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyMDEsMTYyLDc3LDAuMSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-heading font-bold text-white mb-6">
              #SarojMounJewellery
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              See how our customers style their silver jewellery
            </p>
            <motion.a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Follow Us on Instagram
            </motion.a>
          </motion.div>

          {/* Instagram Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80",
              "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80",
              "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80",
              "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80",
              "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&q=80",
              "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80",
            ].map((image, index) => (
              <motion.div
                key={index}
                className="relative aspect-square group cursor-pointer overflow-hidden rounded-xl"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 0.95 }}
              >
                <Image
                  src={image}
                  alt={`Instagram post ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center gap-3 text-sm">
                      <span className="flex items-center gap-1">
                        <Heart className="h-4 w-4 fill-white" /> 1.2k
                      </span>
                      <span className="flex items-center gap-1">
                        💬 89
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Hallmarked Silver</h3>
              <p className="text-gray-600 text-sm">
                Certified 925 sterling silver on all pieces
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <Truck className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">PAN India Delivery</h3>
              <p className="text-gray-600 text-sm">
                Free shipping on orders above ₹2,999
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <RefreshCw className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Easy Returns</h3>
              <p className="text-gray-600 text-sm">
                7-day hassle-free return policy
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Newsletter Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <NewsletterSignup />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-heading font-bold mb-4">
            Join Our Silver Story
          </h2>
          <p className="text-xl mb-8 text-gray-300">
            Follow us on Instagram & YouTube for styling tips, new launches, and exclusive offers
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" variant="secondary">
              Follow on Instagram
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
              Subscribe on YouTube
            </Button>
          </div>
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
