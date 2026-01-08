"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { ArrowRight, Shield, Truck, RefreshCw, Sparkles, Star, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { TestimonialsSection } from "@/components/testimonials";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { LeadCapturePopup } from "@/components/lead-capture-popup";

// Premium silver jewellery images
const featuredProducts = [
  {
    id: "1",
    name: "Handcrafted Silver Kada",
    slug: "handcrafted-silver-kada",
    price: 349900,
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
    badge: "Best Seller",
  },
  {
    id: "2",
    name: "Temple Design Necklace",
    slug: "temple-design-necklace",
    price: 599900,
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
    badge: "New",
  },
  {
    id: "3",
    name: "Oxidized Silver Rings",
    slug: "oxidized-silver-rings",
    price: 149900,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
  },
  {
    id: "4",
    name: "Ethnic Jhumka Earrings",
    slug: "ethnic-jhumka-earrings",
    price: 249900,
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80",
  },
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
    <div className="overflow-hidden">
      {/* Hero Section - Split Layout */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-powder-50 via-white to-powder-100">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Floating Gradient Orbs */}
          <div className="absolute top-20 left-10 w-[600px] h-[600px] bg-gradient-to-br from-powder-300/40 to-powder-500/30 rounded-full blur-3xl animate-blob" />
          <div className="absolute bottom-20 right-10 w-[700px] h-[700px] bg-gradient-to-br from-powder-400/30 to-powder-600/25 rounded-full blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-gradient-to-br from-powder-200/35 to-powder-400/30 rounded-full blur-3xl animate-blob animation-delay-4000" />
          
          {/* Elegant Sparkles */}
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-powder-500 rounded-full shadow-lg"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [0, 1.5, 0],
                opacity: [0, 0.9, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3,
              }}
            />
          ))}
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <motion.div 
                className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-md border-2 border-powder-400 px-6 py-3 rounded-full shadow-xl"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Sparkles className="h-5 w-5 text-powder-600" />
                <span className="text-sm text-powder-700 font-bold">Premium 925 Silver Collection</span>
              </motion.div>

              <motion.h1 
                className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <span className="block bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 bg-clip-text text-transparent">
                  Timeless
                </span>
                <span className="block bg-gradient-to-r from-powder-600 via-powder-700 to-powder-600 bg-clip-text text-transparent mt-2"
                  style={{
                    backgroundSize: "200% 200%",
                    animation: "gradient 3s ease infinite",
                  }}
                >
                  Elegance
                </span>
                <span className="block bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 bg-clip-text text-transparent mt-2">
                  Crafted with Soul
                </span>
              </motion.h1>

              <motion.p 
                className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Discover handcrafted ethnic silver jewellery that tells your story. Each piece is a masterpiece of tradition and artistry.
              </motion.p>

              <motion.div 
                className="flex items-center gap-4 text-sm text-powder-700 font-semibold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-powder-600 rounded-full animate-pulse" />
                  <span>Hallmarked</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-powder-600 rounded-full animate-pulse animation-delay-2000" />
                  <span>Authentic</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-powder-600 rounded-full animate-pulse animation-delay-4000" />
                  <span>Premium Finish</span>
                </div>
              </motion.div>

              <motion.div 
                className="flex gap-4 flex-wrap pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Link href="/shop">
                  <Button size="lg" className="text-base px-8 py-6 bg-gradient-to-r from-powder-600 to-powder-700 hover:from-powder-700 hover:to-powder-800 text-white font-bold shadow-2xl shadow-powder-600/50 hover:shadow-powder-700/60 transition-all duration-300 rounded-full">
                    Shop Collection
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="outline" className="text-base px-8 py-6 border-2 border-powder-500 text-gray-800 hover:bg-powder-100 transition-all duration-300 rounded-full backdrop-blur-sm bg-white/80">
                    Our Story
                  </Button>
                </Link>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div 
                className="flex items-center gap-6 flex-wrap pt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <motion.div 
                  className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-md border border-powder-300"
                  whileHover={{ scale: 1.05 }}
                >
                  <Star className="h-4 w-4 text-powder-600 fill-powder-600" />
                  <span className="text-sm font-semibold text-gray-700">4.9/5 Rating</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-md border border-powder-300"
                  whileHover={{ scale: 1.05 }}
                >
                  <Shield className="h-4 w-4 text-powder-600" />
                  <span className="text-sm font-semibold text-gray-700">925 Hallmarked</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-5 py-2.5 rounded-full shadow-md border border-powder-300"
                  whileHover={{ scale: 1.05 }}
                >
                  <Heart className="h-4 w-4 text-powder-600 fill-powder-600" />
                  <span className="text-sm font-semibold text-gray-700">10K+ Customers</span>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Right Side - Peacock Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative lg:h-[700px] h-[500px]"
            >
              {/* Decorative Background Circle */}
              <div className="absolute inset-0 bg-gradient-to-br from-powder-400/30 to-powder-600/20 rounded-full blur-3xl scale-110" />
              
              {/* Main Image Container */}
              <motion.div
                className="relative h-full w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src="/peacock-jewellery.jpeg"
                  alt="Exquisite silver jewellery collection on majestic peacock"
                  fill
                  className="object-cover"
                  priority
                />
                
                {/* Subtle Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-powder-900/20 via-transparent to-transparent" />
                
                {/* Floating Badge */}
                <motion.div
                  className="absolute top-6 right-6 bg-white/95 backdrop-blur-md px-6 py-3 rounded-full shadow-xl border-2 border-powder-400"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1, type: "spring" }}
                >
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-powder-600" />
                    <span className="text-sm font-bold bg-gradient-to-r from-powder-600 to-powder-700 bg-clip-text text-transparent">
                      Premium Collection
                    </span>
                  </div>
                </motion.div>
              </motion.div>

              {/* Decorative Elements */}
              <motion.div
                className="absolute -bottom-4 -right-4 w-32 h-32 bg-powder-500/30 rounded-full blur-2xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute -top-4 -left-4 w-24 h-24 bg-powder-400/40 rounded-full blur-2xl"
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.4, 0.6, 0.4],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </div>
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
