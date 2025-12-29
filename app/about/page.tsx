"use client";

import { motion } from "framer-motion";
import { Heart, Award, Sparkles, Users, Target, Shield } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-powder-50 via-white to-powder-100">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-powder-600/10 to-powder-400/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-powder-100 px-6 py-3 rounded-full mb-6">
              <Heart className="h-5 w-5 text-powder-600" />
              <span className="text-sm font-semibold text-powder-700">Crafted with Love</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-heading font-bold text-gray-900 mb-6">
              About Saroj Moun
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Where timeless elegance meets modern craftsmanship in pure silver jewellery
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-heading font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-gray-700 text-lg">
                <p>
                  From the heart of Sherkhan Kheri, Kaithal, Saroj Moun has become a symbol of inspiration and empowerment. As the elected Sarpanch of her village and a certified expert in cutting, tailoring, and beauty, Saroj’s journey is a testament to resilience, vision, and relentless hard work.
                </p>
                <p>
                  Starting with humble beginnings, Saroj transformed her skills into a thriving business in Jind, now serving customers all across India. Her keen eye for fashion and her signature designs have made her a trendsetter—her style and suggestions are celebrated throughout Jind and beyond. In a traditional Jaat family, she has balanced the roles of a devoted mother, a dynamic entrepreneur, and a respected community leader.
                </p>
                <p>
                  Saroj’s achievements are not hers alone—her journey is powered by the unwavering support of her husband, a dedicated police officer who stands by her side in every challenge, and her two children—a son and a daughter, with her daughter being an IIT Madras graduate and a lead developer at top firms. Together, they prove that with courage, unity, and determination, no dream is too big.
                </p>
                <p>
                  Saroj Moun’s story inspires women everywhere to break barriers, embrace their uniqueness, and lead with kindness and strength. Her legacy is not just in the beautiful designs she creates, but in the lives she touches and the example she sets for future generations.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-powder-600/20 to-powder-400/20 z-10"></div>
              <Image
                src="/saroj%20.jpeg"
                alt="Saroj Moun - Founder"
                fill
                className="object-cover object-center z-0"
                priority
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-heading font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-gradient-to-br from-powder-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-16 h-16 bg-powder-600 rounded-2xl flex items-center justify-center mb-6">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Authenticity</h3>
              <p className="text-gray-600">
                Every piece is crafted from 100% pure silver with hallmark certification, ensuring you receive only genuine, high-quality jewellery.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gradient-to-br from-powder-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-16 h-16 bg-powder-600 rounded-2xl flex items-center justify-center mb-6">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Craftsmanship</h3>
              <p className="text-gray-600">
                Our artisans bring decades of experience, creating intricate designs that blend traditional techniques with contemporary aesthetics.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gradient-to-br from-powder-50 to-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-16 h-16 bg-powder-600 rounded-2xl flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Trust</h3>
              <p className="text-gray-600">
                Transparent pricing based on live silver rates, secure payments, and hassle-free returns build lasting relationships with our customers.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-powder-600 to-powder-500 p-12 rounded-3xl text-white shadow-2xl"
            >
              <Target className="h-12 w-12 mb-6" />
              <h3 className="text-3xl font-heading font-bold mb-4">Our Mission</h3>
              <p className="text-powder-100 text-lg">
                To make beautiful, authentic silver jewellery accessible to every woman in India, combining traditional craftsmanship with transparent, fair pricing and exceptional customer service.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 p-12 rounded-3xl text-white shadow-2xl"
            >
              <Sparkles className="h-12 w-12 mb-6" />
              <h3 className="text-3xl font-heading font-bold mb-4">Our Vision</h3>
              <p className="text-gray-300 text-lg">
                To become India's most trusted online destination for silver jewellery, known for our quality, transparency, and the joy we bring to customers through every piece they wear.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-heading font-bold text-gray-900 mb-4">
              Why Choose Saroj Moun?
            </h2>
            <p className="text-xl text-gray-600">
              Experience the difference of authentic craftsmanship
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "✓",
                title: "100% Pure Silver",
                description: "Hallmarked and certified silver in every piece"
              },
              {
                icon: "₹",
                title: "Transparent Pricing",
                description: "Prices based on live silver rates with clear breakdowns"
              },
              {
                icon: "🎁",
                title: "Beautiful Packaging",
                description: "Elegant gift boxes perfect for every occasion"
              },
              {
                icon: "🔒",
                title: "Secure Payments",
                description: "Razorpay integration with COD option available"
              },
              {
                icon: "🚚",
                title: "Fast Delivery",
                description: "5-7 days delivery to metro cities across India"
              },
              {
                icon: "↩️",
                title: "Easy Returns",
                description: "7-day return policy with no questions asked"
              },
              {
                icon: "🛡️",
                title: "6-Month Warranty",
                description: "Comprehensive warranty on manufacturing defects"
              },
              {
                icon: "💬",
                title: "24/7 Support",
                description: "WhatsApp and email support for all queries"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 rounded-xl hover:bg-powder-50 transition-colors"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-powder-600 to-powder-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-heading font-bold text-white mb-6">
              Ready to Find Your Perfect Piece?
            </h2>
            <p className="text-xl text-powder-100 mb-8">
              Explore our collection of handcrafted silver jewellery
            </p>
            <a
              href="/shop"
              className="inline-flex items-center gap-2 bg-white text-powder-600 px-8 py-4 rounded-full font-semibold hover:bg-powder-50 transition-colors"
            >
              Shop Now
              <Sparkles className="h-5 w-5" />
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
