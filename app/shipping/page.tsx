"use client";

import { motion } from "framer-motion";
import { Truck, Package, MapPin, Clock } from "lucide-react";

export default function ShippingPolicyPage() {
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
              <Truck className="h-5 w-5 text-powder-600" />
              <span className="text-sm font-semibold text-powder-700">Nationwide Delivery</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
              Shipping Policy
            </h1>
            <p className="text-gray-600">Last updated: December 24, 2025</p>
          </div>

          {/* Content */}
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="h-6 w-6 text-powder-600" />
                Shipping Coverage
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  We currently ship to all locations within India. International shipping is not available at this time.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="h-6 w-6 text-powder-600" />
                Processing Time
              </h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  All orders are processed within <strong>1-2 business days</strong> (Monday to Saturday, excluding public holidays).
                </p>
                <p>
                  Orders placed after 3:00 PM IST will be processed the next business day.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="h-6 w-6 text-powder-600" />
                Delivery Timeline
              </h2>
              <div className="space-y-4 text-gray-700">
                <div className="bg-powder-50 p-6 rounded-xl">
                  <p className="font-semibold text-powder-700 mb-3">Metro Cities</p>
                  <p><strong>5-7 business days</strong> - Delhi NCR, Mumbai, Bangalore, Chennai, Kolkata, Hyderabad, Pune, Ahmedabad</p>
                </div>
                
                <div className="bg-powder-50 p-6 rounded-xl">
                  <p className="font-semibold text-powder-700 mb-3">Other Cities</p>
                  <p><strong>7-10 business days</strong> - All other locations across India</p>
                </div>

                <div className="bg-powder-50 p-6 rounded-xl">
                  <p className="font-semibold text-powder-700 mb-3">Remote Areas</p>
                  <p><strong>10-14 business days</strong> - Northeastern states, Jammu & Kashmir, Ladakh, Andaman & Nicobar Islands</p>
                </div>

                <p className="text-sm text-gray-600 italic mt-4">
                  * Delivery times are estimates and may vary due to courier delays, weather conditions, or other unforeseen circumstances.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Shipping Charges</h2>
              <div className="space-y-4 text-gray-700">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-powder-100">
                        <th className="border border-powder-300 px-4 py-3 text-left">Order Value</th>
                        <th className="border border-powder-300 px-4 py-3 text-left">Shipping Charge</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-powder-200 px-4 py-3">Below ₹2,000</td>
                        <td className="border border-powder-200 px-4 py-3">₹99</td>
                      </tr>
                      <tr className="bg-powder-50">
                        <td className="border border-powder-200 px-4 py-3">₹2,000 - ₹4,999</td>
                        <td className="border border-powder-200 px-4 py-3">₹49</td>
                      </tr>
                      <tr>
                        <td className="border border-powder-200 px-4 py-3">₹5,000 and above</td>
                        <td className="border border-powder-200 px-4 py-3 font-bold text-green-600">FREE</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Tracking</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  Once your order is dispatched, you will receive:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Shipping confirmation email with tracking number</li>
                  <li>SMS notification with courier partner details</li>
                  <li>Real-time tracking link to monitor your delivery</li>
                </ul>
                <p className="mt-4">
                  You can also track your order by logging into your account on our website.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Packaging</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  All jewellery is carefully packaged to ensure safe delivery:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Premium gift box packaging</li>
                  <li>Bubble wrap protection</li>
                  <li>Tamper-proof sealed packaging</li>
                  <li>Insurance coverage during transit</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Delivery Partners</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  We work with trusted courier partners including:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Blue Dart</li>
                  <li>DTDC</li>
                  <li>Delhivery</li>
                  <li>FedEx</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Delivery Instructions</h2>
              <div className="space-y-3 text-gray-700">
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Please ensure someone is available to receive the delivery</li>
                  <li>Valid ID proof may be required at the time of delivery</li>
                  <li>Please check the package for any damage before accepting</li>
                  <li>In case of damage, refuse delivery and contact us immediately</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Undelivered Packages</h2>
              <div className="space-y-3 text-gray-700">
                <p>
                  If delivery attempts fail due to incorrect address or recipient unavailability:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Courier partner will attempt delivery 3 times</li>
                  <li>Package will be returned to us if delivery fails</li>
                  <li>Return shipping charges will apply for reshipment</li>
                  <li>Refund will be processed after deducting return charges</li>
                </ul>
              </div>
            </section>

            <section className="border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help?</h2>
              <div className="space-y-3 text-gray-700">
                <p>For shipping-related queries, contact us:</p>
                <ul className="space-y-2">
                  <li><strong>Email:</strong> shipping@sarojmoun.com</li>
                  <li><strong>Phone:</strong> +91 XXXXX XXXXX</li>
                  <li><strong>WhatsApp:</strong> +91 XXXXX XXXXX</li>
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
