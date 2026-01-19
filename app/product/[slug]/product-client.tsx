"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
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
  Phone,
  Check,
} from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { calculateProductPrice, formatPrice } from "@/lib/pricing";
import { ProductInquiryForm } from "@/components/product-inquiry-form";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  silverWeight: number;
  makingCharges: number;
  profitPerGram: number;
  fixedPrice: number | null;
  category: string;
  images: string[];
  stock: number;
  material: string;
  featured: boolean;
  bestseller: boolean;
  tags: string[];
}

interface ProductDetailClientProps {
  product: Product;
  silverRate: number;
  relatedProducts: Product[];
}

export function ProductDetailClient({
  product,
  silverRate,
  relatedProducts,
}: ProductDetailClientProps) {
  const router = useRouter();
  const addItem = useCart((state) => state.addItem);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  // Calculate price
  const priceBreakdown = calculateProductPrice(
    {
      silverWeight: product.silverWeight,
      makingCharges: product.makingCharges,
      profitPerGram: product.profitPerGram,
      fixedPrice: product.fixedPrice || undefined,
    },
    silverRate
  );

  const images = product.images.length > 0 ? product.images : ["/peacock-jewellery.jpeg"];

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: priceBreakdown.finalPrice,
      image: images[0],
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const whatsappMessage = `Hi! I'm interested in "${product.name}" (${formatPrice(priceBreakdown.finalPrice)}). Please share more details.`;

  return (
    <div className="min-h-screen bg-ivory-50 pt-24">
      <div className="container-luxury py-8">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center gap-2 text-charcoal-500">
            <li>
              <Link href="/" className="hover:text-champagne-600 transition-colors">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/shop" className="hover:text-champagne-600 transition-colors">
                Shop
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link
                href={`/shop?category=${product.category.toLowerCase()}`}
                className="hover:text-champagne-600 transition-colors capitalize"
              >
                {product.category}
              </Link>
            </li>
            <li>/</li>
            <li className="text-charcoal-900 font-medium truncate max-w-[200px]">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Main Image */}
            <div className="relative bg-ivory-100 aspect-square overflow-hidden mb-4">
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
                    src={images[selectedImageIndex]}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-ivory-50/90 hover:bg-ivory-50 p-3 transition-all"
                  >
                    <ChevronLeft className="h-5 w-5 text-charcoal-900" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-ivory-50/90 hover:bg-ivory-50 p-3 transition-all"
                  >
                    <ChevronRight className="h-5 w-5 text-charcoal-900" />
                  </button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.bestseller && (
                  <span className="bg-champagne-500 text-charcoal-900 px-3 py-1 text-xs font-medium tracking-wider uppercase">
                    Bestseller
                  </span>
                )}
                {product.stock < 5 && product.stock > 0 && (
                  <span className="bg-red-500 text-white px-3 py-1 text-xs font-medium tracking-wider uppercase">
                    Only {product.stock} left
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-square overflow-hidden transition-all ${
                      selectedImageIndex === index
                        ? "ring-2 ring-champagne-500"
                        : "opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-champagne-600 mb-2">
                {product.category}
              </p>
              <h1 className="text-3xl md:text-4xl font-heading font-light text-charcoal-900 mb-4">
                {product.name}
              </h1>
              <p className="text-charcoal-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Price Section */}
            <div className="bg-ivory-100 p-6 space-y-4">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-heading font-medium text-charcoal-900">
                  {formatPrice(priceBreakdown.finalPrice)}
                </span>
                <span className="text-sm text-charcoal-500">(incl. all charges)</span>
              </div>

              {/* Price Breakdown */}
              {!product.fixedPrice && (
                <div className="space-y-2 text-sm border-t border-ivory-200 pt-4">
                  <div className="flex justify-between text-charcoal-600">
                    <span>Silver ({product.silverWeight}g × ₹{silverRate}/g)</span>
                    <span>{formatPrice(priceBreakdown.silverCost)}</span>
                  </div>
                  <div className="flex justify-between text-charcoal-600">
                    <span>Making Charges</span>
                    <span>{formatPrice(priceBreakdown.makingCharges)}</span>
                  </div>
                  <div className="flex justify-between font-medium text-charcoal-900 pt-2 border-t border-ivory-200">
                    <span>Total</span>
                    <span>{formatPrice(priceBreakdown.finalPrice)}</span>
                  </div>
                </div>
              )}

              <p className="text-xs text-charcoal-500 italic">
                * Prices updated based on live silver rates
              </p>
            </div>

            {/* Quantity Selector */}
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-3">
                Quantity
              </label>
              <div className="inline-flex items-center gap-4 bg-ivory-100 p-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-ivory-200 transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-medium text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-ivory-200 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleBuyNow}
                className="w-full bg-charcoal-900 text-ivory-50 py-4 font-medium tracking-wider uppercase hover:bg-charcoal-800 transition-colors flex items-center justify-center gap-2"
              >
                <Zap className="h-5 w-5" />
                Buy Now
              </button>

              <button
                onClick={handleAddToCart}
                className={`w-full border py-4 font-medium tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
                  addedToCart
                    ? "bg-green-500 text-white border-green-500"
                    : "border-charcoal-900 text-charcoal-900 hover:bg-charcoal-900 hover:text-ivory-50"
                }`}
              >
                {addedToCart ? (
                  <>
                    <Check className="h-5 w-5" />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5" />
                    Add to Cart
                  </>
                )}
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowInquiryForm(true)}
                  className="py-3 bg-champagne-500 text-charcoal-900 font-medium tracking-wider uppercase hover:bg-champagne-600 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <MessageCircle className="h-4 w-4" />
                  Inquire
                </button>

                <a
                  href={`https://wa.me/918168790171?text=${encodeURIComponent(whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 bg-green-500 text-white font-medium tracking-wider uppercase hover:bg-green-600 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Phone className="h-4 w-4" />
                  WhatsApp
                </a>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-ivory-200">
              <div className="text-center">
                <div className="w-12 h-12 bg-ivory-100 flex items-center justify-center mx-auto mb-2">
                  <Truck className="h-5 w-5 text-champagne-600" />
                </div>
                <p className="text-xs font-medium text-charcoal-700">Free Shipping</p>
                <p className="text-xs text-charcoal-500">Above ₹2999</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-ivory-100 flex items-center justify-center mx-auto mb-2">
                  <Shield className="h-5 w-5 text-champagne-600" />
                </div>
                <p className="text-xs font-medium text-charcoal-700">7-Day Returns</p>
                <p className="text-xs text-charcoal-500">Easy refunds</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-ivory-100 flex items-center justify-center mx-auto mb-2">
                  <Award className="h-5 w-5 text-champagne-600" />
                </div>
                <p className="text-xs font-medium text-charcoal-700">Hallmarked</p>
                <p className="text-xs text-charcoal-500">925 Sterling</p>
              </div>
            </div>

            {/* Product Details */}
            <div className="bg-white p-6 space-y-4">
              <h3 className="text-lg font-heading font-medium text-charcoal-900">
                Product Details
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-ivory-100">
                  <span className="text-charcoal-500">Metal Purity</span>
                  <span className="font-medium text-charcoal-900">{product.material}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-ivory-100">
                  <span className="text-charcoal-500">Weight</span>
                  <span className="font-medium text-charcoal-900">{product.silverWeight}g</span>
                </div>
                <div className="flex justify-between py-2 border-b border-ivory-100">
                  <span className="text-charcoal-500">Category</span>
                  <span className="font-medium text-charcoal-900 capitalize">{product.category}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-ivory-100">
                  <span className="text-charcoal-500">Availability</span>
                  <span className={`font-medium ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-charcoal-500">Hallmark Certified</span>
                  <span className="font-medium text-champagne-600">✓ Yes</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-20 pt-12 border-t border-ivory-200"
          >
            <h2 className="text-2xl font-heading font-light text-charcoal-900 mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => {
                const relatedPrice = calculateProductPrice(
                  {
                    silverWeight: relatedProduct.silverWeight,
                    makingCharges: relatedProduct.makingCharges,
                    profitPerGram: relatedProduct.profitPerGram,
                    fixedPrice: relatedProduct.fixedPrice || undefined,
                  },
                  silverRate
                );

                return (
                  <Link
                    key={relatedProduct.id}
                    href={`/product/${relatedProduct.slug}`}
                    className="group"
                  >
                    <div className="relative aspect-square bg-ivory-100 overflow-hidden mb-3">
                      <Image
                        src={relatedProduct.images[0] || "/peacock-jewellery.jpeg"}
                        alt={relatedProduct.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <h3 className="font-heading text-charcoal-900 group-hover:text-champagne-600 transition-colors line-clamp-2 mb-1">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-charcoal-600">{formatPrice(relatedPrice.finalPrice)}</p>
                  </Link>
                );
              })}
            </div>
          </motion.section>
        )}
      </div>

      {/* Product Inquiry Modal */}
      <ProductInquiryForm
        productId={product.id}
        productName={product.name}
        isOpen={showInquiryForm}
        onClose={() => setShowInquiryForm(false)}
      />
    </div>
  );
}

