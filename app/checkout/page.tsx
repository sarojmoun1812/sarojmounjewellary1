"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  Truck,
  MapPin,
  Phone,
  Mail,
  User,
  Home,
  Check,
  ChevronRight,
  AlertCircle,
  Wallet,
  Building
} from "lucide-react";
import { formatPrice } from "@/lib/pricing";

// Mock cart data - will be replaced with actual cart state
const mockCartItems = [
  {
    id: "1",
    name: "Elegant Silver Peacock Necklace",
    price: 4500,
    quantity: 1,
    image: "/peacock-jewellery.jpeg",
    weight: 25.5
  }
];

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Confirmation
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("online");
  const [isProcessing, setIsProcessing] = useState(false);

  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    landmark: ""
  });

  // Calculate totals
  const subtotal = mockCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = subtotal >= 5000 ? 0 : subtotal >= 2000 ? 49 : 99;
  const total = subtotal + shippingCost;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    // TODO: Implement actual payment logic
    setTimeout(() => {
      setIsProcessing(false);
      setStep(3);
    }, 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setShippingInfo(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-powder-50 via-white to-powder-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
            Checkout
          </h1>
          <p className="text-gray-600">Complete your purchase securely</p>
        </div>

        {/* Progress Steps */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: "Shipping" },
              { num: 2, label: "Payment" },
              { num: 3, label: "Confirmation" }
            ].map((s, index) => (
              <div key={s.num} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-colors ${
                      step >= s.num
                        ? "bg-powder-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step > s.num ? <Check className="h-6 w-6" /> : s.num}
                  </div>
                  <span className={`mt-2 text-sm font-semibold ${
                    step >= s.num ? "text-powder-600" : "text-gray-500"
                  }`}>
                    {s.label}
                  </span>
                </div>
                {index < 2 && (
                  <ChevronRight className={`h-6 w-6 ${
                    step > s.num ? "text-powder-600" : "text-gray-300"
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping Information */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-3xl shadow-xl p-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Truck className="h-7 w-7 text-powder-600" />
                  Shipping Information
                </h2>

                <form onSubmit={handleShippingSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <User className="inline h-4 w-4 mr-1" />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={shippingInfo.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-powder-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Phone className="inline h-4 w-4 mr-1" />
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={shippingInfo.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-powder-500 focus:border-transparent"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <Mail className="inline h-4 w-4 mr-1" />
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={shippingInfo.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-powder-500 focus:border-transparent"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <Home className="inline h-4 w-4 mr-1" />
                      Complete Address *
                    </label>
                    <textarea
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-powder-500 focus:border-transparent resize-none"
                      placeholder="House No., Street, Area"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-powder-500 focus:border-transparent"
                        placeholder="City"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={shippingInfo.state}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-powder-500 focus:border-transparent"
                        placeholder="State"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <MapPin className="inline h-4 w-4 mr-1" />
                        PIN Code *
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        value={shippingInfo.pincode}
                        onChange={handleInputChange}
                        required
                        pattern="[0-9]{6}"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-powder-500 focus:border-transparent"
                        placeholder="123456"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Landmark (Optional)
                      </label>
                      <input
                        type="text"
                        name="landmark"
                        value={shippingInfo.landmark}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-powder-500 focus:border-transparent"
                        placeholder="Near..."
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-powder-600 text-white py-4 rounded-xl font-semibold hover:bg-powder-700 transition-colors flex items-center justify-center gap-2"
                  >
                    Continue to Payment
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </form>
              </motion.div>
            )}

            {/* Step 2: Payment Method */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                {/* Shipping Summary */}
                <div className="bg-white rounded-3xl shadow-xl p-6">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Truck className="h-5 w-5 text-powder-600" />
                    Delivering To:
                  </h3>
                  <div className="text-sm text-gray-700 space-y-1">
                    <p className="font-semibold">{shippingInfo.fullName}</p>
                    <p>{shippingInfo.address}</p>
                    <p>{shippingInfo.city}, {shippingInfo.state} - {shippingInfo.pincode}</p>
                    <p>{shippingInfo.phone} | {shippingInfo.email}</p>
                  </div>
                  <button
                    onClick={() => setStep(1)}
                    className="text-powder-600 text-sm font-semibold mt-3 hover:text-powder-700"
                  >
                    Edit Address
                  </button>
                </div>

                {/* Payment Options */}
                <div className="bg-white rounded-3xl shadow-xl p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <CreditCard className="h-7 w-7 text-powder-600" />
                    Payment Method
                  </h2>

                  <div className="space-y-4">
                    {/* Online Payment */}
                    <button
                      onClick={() => setPaymentMethod("online")}
                      className={`w-full p-6 rounded-xl border-2 transition-all text-left ${
                        paymentMethod === "online"
                          ? "border-powder-600 bg-powder-50"
                          : "border-gray-200 hover:border-powder-300"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === "online"
                            ? "border-powder-600 bg-powder-600"
                            : "border-gray-300"
                        }`}>
                          {paymentMethod === "online" && <Check className="h-4 w-4 text-white" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CreditCard className="h-5 w-5 text-powder-600" />
                            <span className="font-bold text-gray-900">Online Payment</span>
                            <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">Recommended</span>
                          </div>
                          <p className="text-sm text-gray-600">
                            Pay securely using UPI, Cards, Net Banking, or Wallets via Razorpay
                          </p>
                        </div>
                      </div>
                    </button>

                    {/* Cash on Delivery */}
                    <button
                      onClick={() => setPaymentMethod("cod")}
                      className={`w-full p-6 rounded-xl border-2 transition-all text-left ${
                        paymentMethod === "cod"
                          ? "border-powder-600 bg-powder-50"
                          : "border-gray-200 hover:border-powder-300"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          paymentMethod === "cod"
                            ? "border-powder-600 bg-powder-600"
                            : "border-gray-300"
                        }`}>
                          {paymentMethod === "cod" && <Check className="h-4 w-4 text-white" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Wallet className="h-5 w-5 text-powder-600" />
                            <span className="font-bold text-gray-900">Cash on Delivery</span>
                          </div>
                          <p className="text-sm text-gray-600">
                            Pay with cash when your order is delivered (+ ₹50 COD charges)
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>

                  <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full mt-8 bg-powder-600 text-white py-4 rounded-xl font-semibold hover:bg-powder-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                        Processing...
                      </>
                    ) : (
                      <>
                        {paymentMethod === "online" ? "Pay Now" : "Place Order"}
                        <ChevronRight className="h-5 w-5" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Order Confirmation */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-3xl shadow-xl p-12 text-center"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Order Placed Successfully!
                </h2>
                <p className="text-gray-600 mb-8">
                  Thank you for your purchase. Your order has been confirmed and will be delivered soon.
                </p>
                <div className="bg-powder-50 rounded-xl p-6 mb-8">
                  <p className="text-sm text-gray-600 mb-2">Order ID</p>
                  <p className="text-2xl font-bold text-powder-700">#SM{Date.now().toString().slice(-8)}</p>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={() => router.push("/shop")}
                    className="w-full bg-powder-600 text-white py-4 rounded-xl font-semibold hover:bg-powder-700 transition-colors"
                  >
                    Continue Shopping
                  </button>
                  <button
                    onClick={() => router.push("/")}
                    className="w-full bg-white text-powder-600 border-2 border-powder-600 py-4 rounded-xl font-semibold hover:bg-powder-50 transition-colors"
                  >
                    Back to Home
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl shadow-xl p-8 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>

              {/* Cart Items */}
              <div className="space-y-4 mb-6 pb-6 border-b">
                {mockCartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-20 bg-powder-100 rounded-xl flex-shrink-0"></div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">{item.name}</h4>
                      <p className="text-xs text-gray-500">Weight: {item.weight}g</p>
                      <p className="text-sm font-bold text-powder-600 mt-1">
                        {formatPrice(item.price)} × {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="font-semibold">
                    {shippingCost === 0 ? "FREE" : formatPrice(shippingCost)}
                  </span>
                </div>
                {paymentMethod === "cod" && step >= 2 && (
                  <div className="flex justify-between text-gray-700">
                    <span>COD Charges</span>
                    <span className="font-semibold">₹50</span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-powder-600">
                  {formatPrice(total + (paymentMethod === "cod" && step >= 2 ? 50 : 0))}
                </span>
              </div>

              {/* Trust Badges */}
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>100% Secure Payment</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>7-Day Easy Returns</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-600" />
                  <span>Hallmark Certified Silver</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
