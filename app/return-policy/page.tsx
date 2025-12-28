"use client";

import { motion } from "framer-motion";
import { RefreshCw, AlertCircle, CheckCircle } from "lucide-react";

export default function ReturnPolicyPage() {
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
              <RefreshCw className="h-5 w-5 text-powder-600" />
              <span className="text-sm font-semibold text-powder-700">Hassle-Free Returns</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
              Return & Refund Policy
            </h1>
            <p className="text-gray-600">Last updated: December 24, 2025</p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7-Day Return Policy</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  At Saroj Moun Jewellery, we want you to be completely satisfied with your purchase. If you're not happy with your order, you can return or exchange it within <strong>7 days</strong> of delivery.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-600" />
                Eligible for Return
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>Products can be returned if:</p>
                <ul className="list-disc list-inside space-y-2 ml-4 bg-green-50 p-6 rounded-xl">
                  <li>Product is unused and in original condition</li>
                  <li>Original packaging, tags, and certificate are intact</li>
                  <li>No scratches, stains, or damage</li>
                  <li>Returned within 7 days of delivery</li>
                  <li>Product received is defective or damaged</li>
                  <li>Wrong product was delivered</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="h-6 w-6 text-red-600" />
                Not Eligible for Return
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>The following items cannot be returned:</p>
                <ul className="list-disc list-inside space-y-2 ml-4 bg-red-50 p-6 rounded-xl">
                  <li>Customized or engraved jewellery</li>
                  <li>Products purchased during special sales (unless defective)</li>
                  <li>Items without original packaging or tags</li>
                  <li>Products showing signs of wear or damage</li>
                  <li>Return requested after 7 days of delivery</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Return</h2>
              <div className="space-y-4 text-gray-700">
                <p className="font-semibold text-powder-700">Step-by-Step Process:</p>
                
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-powder-600 text-white rounded-full flex items-center justify-center font-bold">
                      1
                    </div>
                    <div>
                      <p className="font-semibold">Contact Us</p>
                      <p className="text-sm">Email us at sarojmounjewellary@gmail.com or WhatsApp +91 81687 90171 with your order number and reason for return.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-powder-600 text-white rounded-full flex items-center justify-center font-bold">
                      2
                    </div>
                    <div>
                      <p className="font-semibold">Get Approval</p>
                      <p className="text-sm">Our team will review and approve your return request within 24 hours.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-powder-600 text-white rounded-full flex items-center justify-center font-bold">
                      3
                    </div>
                    <div>
                      <p className="font-semibold">Pack Securely</p>
                      <p className="text-sm">Pack the product in original packaging with all tags, certificates, and accessories.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-powder-600 text-white rounded-full flex items-center justify-center font-bold">
                      4
                    </div>
                    <div>
                      <p className="font-semibold">Pickup/Ship</p>
                      <p className="text-sm">We'll arrange reverse pickup or you can ship it to our address (shipping charges applicable).</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-powder-600 text-white rounded-full flex items-center justify-center font-bold">
                      5
                    </div>
                    <div>
                      <p className="font-semibold">Quality Check</p>
                      <p className="text-sm">We'll inspect the product within 2-3 business days of receiving it.</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-powder-600 text-white rounded-full flex items-center justify-center font-bold">
                      6
                    </div>
                    <div>
                      <p className="font-semibold">Refund/Exchange</p>
                      <p className="text-sm">Refund will be processed or exchange will be dispatched within 5-7 business days.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Refund Process</h2>
              <div className="space-y-4 text-gray-700">
                <div className="bg-powder-50 p-6 rounded-xl">
                  <p className="font-semibold text-powder-700 mb-3">Prepaid Orders</p>
                  <p>Refund will be credited to your original payment method (Card/UPI/Net Banking) within 7-10 business days after quality check.</p>
                </div>
                
                <div className="bg-powder-50 p-6 rounded-xl">
                  <p className="font-semibold text-powder-700 mb-3">Cash on Delivery (COD)</p>
                  <p>Refund will be processed via bank transfer (NEFT/IMPS). Please provide your bank account details.</p>
                </div>

                <p className="text-sm text-gray-600 italic mt-4">
                  * Shipping charges are non-refundable unless the product is defective or wrong item was delivered.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Exchange Policy</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  You can exchange your product for:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Same product in different size/design</li>
                  <li>Different product of equal or higher value</li>
                  <li>If exchanging for higher value, pay the difference</li>
                  <li>If exchanging for lower value, difference will be refunded</li>
                </ul>
                <p className="mt-4">
                  Exchange shipping charges: ₹99 (or free if defective/wrong product)
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Damaged/Defective Products</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  If you receive a damaged or defective product:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Contact us within 24 hours of delivery</li>
                  <li>Share photos/videos of the damaged product</li>
                  <li>We'll arrange immediate replacement or full refund</li>
                  <li>No questions asked - we'll bear all shipping charges</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cancellation Policy</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  You can cancel your order:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Before Dispatch:</strong> Full refund (including shipping)</li>
                  <li><strong>After Dispatch:</strong> Cancellation not possible; use return policy instead</li>
                  <li>Refund will be processed within 5-7 business days</li>
                </ul>
              </div>
            </section>

            <section className="border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <div className="space-y-3 text-gray-700">
                <p>For returns, refunds, or exchanges:</p>
                <ul className="space-y-2">
                <li><strong>Email:</strong> sarojmounjewellary@gmail.com</li>
                <li><strong>Phone:</strong> +91 81687 90171</li>
                <li><strong>WhatsApp:</strong> +91 81687 90171</li>
                  <li><strong>Support Hours:</strong> Monday - Saturday, 10 AM - 6 PM IST</li>
                </ul>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
