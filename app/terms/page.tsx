"use client";

import { motion } from "framer-motion";
import { FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-powder-50 via-white to-powder-100 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-powder-100 px-6 py-3 rounded-full mb-6">
              <FileText className="h-5 w-5 text-powder-600" />
              <span className="text-sm font-semibold text-powder-700">Legal Terms</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
              Terms & Conditions
            </h1>
            <p className="text-gray-600">Last updated: December 24, 2025</p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  By accessing and using Saroj Moun Jewellery website, you accept and agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our website or services.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Products and Pricing</h2>
              <div className="space-y-3 text-gray-700">
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>All jewellery is handcrafted 925 Silver with hallmark certification</li>
                  <li>Prices are based on current silver rates and may fluctuate</li>
                  <li>Product images are for reference; actual products may vary slightly</li>
                  <li>We reserve the right to modify prices without prior notice</li>
                  <li>Final price will be confirmed at checkout based on current silver rates</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Orders and Payment</h2>
              <div className="space-y-3 text-gray-700">
                <p><strong>Order Acceptance:</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>All orders are subject to availability and confirmation</li>
                  <li>We reserve the right to refuse or cancel any order</li>
                  <li>Order confirmation will be sent via email/SMS</li>
                </ul>
                <p className="mt-4"><strong>Payment Methods:</strong></p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Credit/Debit Cards, UPI, Net Banking (via Razorpay)</li>
                  <li>Cash on Delivery (COD) available on select orders</li>
                  <li>All payments are processed securely</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Shipping and Delivery</h2>
              <div className="space-y-3 text-gray-700">
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>We ship across India via trusted courier partners</li>
                  <li>Delivery timeline: 5-7 business days (metro cities), 7-10 days (other locations)</li>
                  <li>Shipping charges applicable as per order value</li>
                  <li>Free shipping on orders above ₹5,000</li>
                  <li>Orders are insured during transit</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Returns and Exchanges</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  Please refer to our <a href="/return-policy" className="text-powder-600 hover:underline">Return & Refund Policy</a> for detailed information.
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>7-day return/exchange policy</li>
                  <li>Products must be unused and in original packaging</li>
                  <li>Customized/engraved items are non-returnable</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Product Care and Warranty</h2>
              <div className="space-y-3 text-gray-700">
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>6-month manufacturing defect warranty</li>
                  <li>Store in a cool, dry place when not in use</li>
                  <li>Avoid contact with water, perfumes, and chemicals</li>
                  <li>Clean with soft cloth regularly</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Intellectual Property</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  All content on this website, including text, images, logos, and designs, is the property of Saroj Moun Jewellery and protected by copyright laws. Unauthorized use is prohibited.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  Saroj Moun Jewellery shall not be liable for any indirect, incidental, or consequential damages arising from the use of our website or products.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Governing Law</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  These Terms and Conditions are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Jind, Haryana.
                </p>
              </div>
            </section>

            <section className="border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <div className="space-y-3 text-gray-700">
                <p>For any questions regarding these Terms & Conditions:</p>
                <ul className="space-y-2">
                  <li><strong>Email:</strong> sarojmounjewellary@gmail.com</li>
                  <li><strong>Phone:</strong> +91 81687 90171</li>
                  <li><strong>WhatsApp:</strong> +91 81687 90171</li>
                </ul>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
