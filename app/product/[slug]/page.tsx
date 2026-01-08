"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import {
  Sparkles,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  Award,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Zap,
  MessageCircle,
  Phone
} from "lucide-react";
import { useSilverRate } from "@/lib/use-silver-rate";
import { calculateProductPrice, formatPrice } from "@/lib/pricing";
import { ProductInquiryForm } from "@/components/product-inquiry-form";

// Mock product data - will be replaced with actual API call
const mockProduct = {
  id: "1",
  name: "Elegant Silver Peacock Necklace",
  slug: "elegant-silver-peacock-necklace",
  description: "Handcrafted silver peacock necklace featuring intricate traditional designs. Perfect for weddings, festivals, and special occasions. Made with 100% pure silver with hallmark certification.",
  silverWeight: 25.5,
  makingCharges: 800,
  profitPercent: 45,
  images: [
    "/peacock-jewellery.jpeg",
    "/peacock-jewellery.jpeg",
    "/peacock-jewellery.jpeg"
  ],
  category: "necklaces",
  inStock: true,
  bestseller: true,
  featured: true
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { silverRate, loading: rateLoading } = useSilverRate();
  
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showInquiryForm, setShowInquiryForm] = useState(false);

  // Calculate price
  const priceBreakdown = calculateProductPrice(
    {
      silverWeight: mockProduct.silverWeight,
      makingCharges: mockProduct.makingCharges,
      profitPercent: mockProduct.profitPercent
    },
    silverRate
  );

  const silverCost = mockProduct.silverWeight * silverRate;

  const handleAddToCart = () => {
    // TODO: Implement cart functionality
    console.log("Added to cart:", { ...mockProduct, quantity });
  };

  const handleBuyNow = () => {
    // TODO: Implement buy now functionality
    router.push("/checkout");
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => 
      prev === mockProduct.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? mockProduct.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-powder-50 via-white to-powder-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8 text-sm text-gray-600">
          <a href="/" className="hover:text-powder-600">Home</a>
          <span className="mx-2">/</span>
          <a href="/shop" className="hover:text-powder-600">Shop</a>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{mockProduct.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Main Image */}
            <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden mb-4 aspect-square">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={mockProduct.images[selectedImageIndex]}
                    alt={mockProduct.name}
                    fill
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
              >
                <ChevronLeft className="h-6 w-6 text-gray-900" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
              >
                <ChevronRight className="h-6 w-6 text-gray-900" />
              </button>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {mockProduct.bestseller && (
                  <span className="bg-powder-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Bestseller
                  </span>
                )}
                {mockProduct.featured && (
                  <span className="bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Featured
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-3 gap-4">
              {mockProduct.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative aspect-square rounded-xl overflow-hidden transition-all ${
                    selectedImageIndex === index
                      ? "ring-4 ring-powder-600"
                      : "ring-2 ring-gray-200 hover:ring-powder-300"
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${mockProduct.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-4xl font-heading font-bold text-gray-900 mb-4">
                {mockProduct.name}
              </h1>
              <p className="text-gray-600 text-lg">
                {mockProduct.description}
              </p>
            </div>

            {/* Price Section */}
            <div className="bg-gradient-to-r from-powder-50 to-powder-100 rounded-2xl p-6 space-y-4">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-powder-700">
                  {formatPrice(priceBreakdown.finalPrice)}
                </span>
                {!rateLoading && (
                  <span className="text-sm text-gray-600">
                    (incl. all charges)
                  </span>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Silver ({mockProduct.silverWeight}g @ ₹{silverRate}/g)</span>
                  <span>{formatPrice(priceBreakdown.silverCost)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Making Charges</span>
                  <span>{formatPrice(priceBreakdown.makingCharges)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold text-powder-700">
                  <span>Total Price</span>
                  <span>{formatPrice(priceBreakdown.finalPrice)}</span>
                </div>
              </div>

              <p className="text-xs text-gray-500 italic">
                * Prices updated based on live silver rates
              </p>
            </div>

            {/* Quantity Selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Quantity
              </label>
              <div className="inline-flex items-center gap-4 bg-white rounded-xl p-2 shadow-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-5 w-5" />
                </button>
                <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleBuyNow}
                className="w-full bg-powder-600 text-white py-4 rounded-xl font-semibold hover:bg-powder-700 transition-colors flex items-center justify-center gap-2"
              >
                <Zap className="h-5 w-5" />
                Buy Now
              </button>

              <button
                onClick={handleAddToCart}
                className="w-full bg-white text-powder-600 border-2 border-powder-600 py-4 rounded-xl font-semibold hover:bg-powder-50 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 ${
                    isWishlisted
                      ? "bg-red-50 text-red-600 border-2 border-red-600"
                      : "bg-white text-gray-600 border-2 border-gray-300 hover:border-red-600 hover:text-red-600"
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? "fill-current" : ""}`} />
                  Wishlist
                </button>

                <button className="bg-white text-gray-600 border-2 border-gray-300 py-3 rounded-xl font-semibold hover:border-powder-600 hover:text-powder-600 transition-colors flex items-center justify-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Share
                </button>
              </div>

              {/* Inquiry & WhatsApp Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowInquiryForm(true)}
                  className="bg-gradient-to-r from-powder-500 to-powder-600 text-white py-3 rounded-xl font-semibold hover:from-powder-600 hover:to-powder-700 transition-all shadow-lg shadow-powder-500/20 flex items-center justify-center gap-2"
                >
                  <MessageCircle className="h-5 w-5" />
                  Inquire Now
                </button>

                <a
                  href={`https://wa.me/919876543210?text=Hi! I'm interested in "${mockProduct.name}" (₹${priceBreakdown.finalPrice.toLocaleString()}). Please share more details.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Phone className="h-5 w-5" />
                  WhatsApp
                </a>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <div className="w-12 h-12 bg-powder-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Truck className="h-6 w-6 text-powder-600" />
                </div>
                <p className="text-xs font-semibold text-gray-700">Free Shipping</p>
                <p className="text-xs text-gray-500">Above ₹5000</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-powder-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Shield className="h-6 w-6 text-powder-600" />
                </div>
                <p className="text-xs font-semibold text-gray-700">6-Month Warranty</p>
                <p className="text-xs text-gray-500">Manufacturing defects</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-powder-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Award className="h-6 w-6 text-powder-600" />
                </div>
                <p className="text-xs font-semibold text-gray-700">Hallmark Certified</p>
                <p className="text-xs text-gray-500">100% Pure Silver</p>
              </div>
            </div>

            {/* Product Details */}
            <div className="bg-white rounded-2xl p-6 shadow-md space-y-4">
              <h3 className="text-xl font-bold text-gray-900">Product Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Metal Purity</span>
                  <span className="font-semibold">92.5% Sterling Silver</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Weight</span>
                  <span className="font-semibold">{mockProduct.silverWeight}g</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Category</span>
                  <span className="font-semibold capitalize">{mockProduct.category}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Availability</span>
                  <span className={`font-semibold ${mockProduct.inStock ? "text-green-600" : "text-red-600"}`}>
                    {mockProduct.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Hallmark Certified</span>
                  <span className="font-semibold text-powder-600">✓ Yes</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products Section (Placeholder) */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20"
        >
          <h2 className="text-3xl font-heading font-bold text-gray-900 mb-8 text-center">
            You May Also Like
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg p-4">
                <div className="aspect-square bg-powder-100 rounded-xl mb-4 flex items-center justify-center">
                  <Sparkles className="h-12 w-12 text-powder-400" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Related Product {i}</h4>
                <p className="text-powder-600 font-bold">₹2,999</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Product Inquiry Modal */}
      <ProductInquiryForm
        productId={mockProduct.id}
        productName={mockProduct.name}
        isOpen={showInquiryForm}
        onClose={() => setShowInquiryForm(false)}
      />
    </div>
  );
}
