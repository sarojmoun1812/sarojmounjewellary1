"use client";

import { motion } from "framer-motion";
import { Shield } from "lucide-react";

export default function PrivacyPolicyPage() {
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
              <Shield className="h-5 w-5 text-powder-600" />
              <span className="text-sm font-semibold text-powder-700">Your Privacy Matters</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-gray-600">Last updated: December 24, 2025</p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  At Saroj Moun Jewellery, we collect information that you provide directly to us when you:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Create an account or place an order</li>
                  <li>Contact us for customer support</li>
                  <li>Subscribe to our newsletter</li>
                  <li>Participate in surveys or promotions</li>
                </ul>
                <p className="mt-4">
                  <strong>Personal Information:</strong> Name, email address, phone number, shipping address, and payment information.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
              <div className="space-y-3 text-gray-700">
                <p>We use the information we collect to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Process and fulfill your orders</li>
                  <li>Communicate with you about your orders and provide customer support</li>
                  <li>Send you promotional emails (with your consent)</li>
                  <li>Improve our website and services</li>
                  <li>Detect and prevent fraud or abuse</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Information Sharing</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  We do not sell or rent your personal information to third parties. We may share your information with:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Payment Processors:</strong> Razorpay for secure payment processing</li>
                  <li><strong>Shipping Partners:</strong> Courier services for order delivery</li>
                  <li><strong>Service Providers:</strong> Companies that help us operate our business</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Security</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. All payment transactions are processed through secure payment gateways using SSL encryption.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Cookies</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookies through your browser settings.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights</h2>
              <div className="space-y-3 text-gray-700">
                <p>You have the right to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Request deletion of your information</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Object to processing of your information</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Children's Privacy</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  Our services are not directed to children under 18. We do not knowingly collect personal information from children.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Changes to This Policy</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
                </p>
              </div>
            </section>

            <section className="border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <div className="space-y-3 text-gray-700">
                <p>If you have any questions about this Privacy Policy, please contact us:</p>
                <ul className="space-y-2">
                  <li><strong>Email:</strong> privacy@sarojmoun.com</li>
                  <li><strong>Phone:</strong> +91 XXXXX XXXXX</li>
                  <li><strong>Address:</strong> [Your Business Address]</li>
                </ul>
              </div>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
