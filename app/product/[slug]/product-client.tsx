"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
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
import { useToast } from "@/components/toast";
import { formatPrice, priceTypeLabel, type PriceBreakdown } from "@/lib/pricing";
import type { GstSettings } from "@/lib/tax";
import { ProductInquiryForm } from "@/components/product-inquiry-form";
import { Reveal, StaggerItem, StaggerReveal } from "@/components/reveal";
import { revealLeft, revealRight } from "@/lib/motion";
import { WHATSAPP_NUMBER } from "@/lib/constants";
import { getOptimizedImageUrl } from "@/lib/cloudinary";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  silverWeight: number;
  fixedPrice: number | null;
  category: string;
  images: string[];
  videoUrl?: string | null;
  stock: number;
  material: string;
  featured: boolean;
  bestseller: boolean;
  /** Added in the last two weeks. */
  isNew?: boolean;
  tags: string[];
}

/** Related products arrive already priced, in paise. */
interface RelatedProduct extends Product {
  price: number;
}

interface ProductDetailClientProps {
  product: Product;
  breakdown: PriceBreakdown;
  gst: GstSettings;
  /** Resolved from admin settings on the server; falls back to the constant. */
  whatsappNumber?: string;
  relatedProducts: RelatedProduct[];
}

export function ProductDetailClient({
  product,
  breakdown: priceBreakdown,
  gst,
  whatsappNumber = WHATSAPP_NUMBER,
  relatedProducts,
}: ProductDetailClientProps) {
  const router = useRouter();
  const addItem = useCart((state) => state.addItem);
  const { showToast } = useToast();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const images = product.images;
  const hasMedia = images.length > 0 || Boolean(product.videoUrl);

  const handleAddToCart = () => {
    if (product.stock <= 0) {
      showToast("warning", "This piece is sold out.");
      return;
    }
    addItem(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: priceBreakdown.finalPrice,
        image: images[0] || "",
      },
      quantity
    );
    setAddedToCart(true);
    showToast("success", `${product.name} added to cart`);
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
      <div className="container-luxury py-6 md:py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm md:mb-8">
          <ol className="flex items-center gap-2 text-charcoal-500">
            <li>
              <Link href="/" className="transition-colors hover:text-champagne-700">
                Home
              </Link>
            </li>
            <li className="text-charcoal-300">/</li>
            <li>
              <Link href="/shop" className="transition-colors hover:text-champagne-700">
                Shop
              </Link>
            </li>
            <li className="text-charcoal-300">/</li>
            <li>
              <Link
                href={`/shop?category=${product.category.toLowerCase()}`}
                className="capitalize transition-colors hover:text-champagne-700"
              >
                {product.category}
              </Link>
            </li>
            <li className="text-charcoal-300">/</li>
            <li className="max-w-[160px] truncate font-medium text-charcoal-900 sm:max-w-[240px]">
              {product.name}
            </li>
          </ol>
        </nav>

        <div className="grid items-start gap-8 lg:grid-cols-2 lg:gap-14">
          {/* Image / video gallery */}
          <Reveal variants={revealLeft} className="lg:sticky lg:top-28">
            <div className="product-media relative mb-3 aspect-[4/5] sm:mb-4">
              {images.length > 0 ? (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedImageIndex}
                    initial={{ opacity: 0.2 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={getOptimizedImageUrl(
                        images[selectedImageIndex],
                        1200,
                        1500,
                        88
                      )}
                      alt={`${product.name} – ${product.material} ${product.category}`}
                      fill
                      className="object-cover object-center"
                      priority
                      sizes="(max-width: 1024px) 100vw, 48vw"
                    />
                  </motion.div>
                </AnimatePresence>
              ) : (
                <div className="flex h-full w-full items-center justify-center px-8 text-center">
                  <p className="text-sm tracking-wide text-charcoal-400">
                    Photo coming soon
                  </p>
                </div>
              )}

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevImage}
                    aria-label="Previous photo"
                    className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-ivory-200/80 bg-ivory-50/90 text-charcoal-900 shadow-md backdrop-blur-md transition hover:bg-white sm:left-4 sm:h-11 sm:w-11"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={nextImage}
                    aria-label="Next photo"
                    className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-ivory-200/80 bg-ivory-50/90 text-charcoal-900 shadow-md backdrop-blur-md transition hover:bg-white sm:right-4 sm:h-11 sm:w-11"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              <div className="absolute left-3 top-3 z-10 flex flex-col gap-2 sm:left-4 sm:top-4">
                {product.stock <= 0 ? (
                  <span className="rounded-full bg-charcoal-950/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ivory-50 backdrop-blur-sm">
                    Sold Out
                  </span>
                ) : product.isNew ? (
                  <span className="rounded-full bg-champagne-500 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal-900 shadow-sm">
                    New
                  </span>
                ) : null}
                {product.bestseller && product.stock > 0 && !product.isNew && (
                  <span className="rounded-full bg-champagne-500/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal-900 shadow-sm">
                    Bestseller
                  </span>
                )}
              </div>

              {images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 rounded-full bg-charcoal-950/35 px-2.5 py-1.5 backdrop-blur-md">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      aria-label={`Photo ${index + 1}`}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`h-1.5 rounded-full transition-all ${
                        selectedImageIndex === index
                          ? "w-4 bg-champagne-400"
                          : "w-1.5 bg-ivory-50/55"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="mb-4 grid grid-cols-4 gap-2 sm:gap-2.5">
                {images.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setSelectedImageIndex(index)}
                    className={`product-media relative aspect-[4/5] overflow-hidden transition-all duration-200 ${
                      selectedImageIndex === index
                        ? "ring-2 ring-champagne-500 ring-offset-2 ring-offset-ivory-50"
                        : "opacity-75 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={getOptimizedImageUrl(image, 320, 400, 78)}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover object-center"
                      sizes="120px"
                    />
                  </button>
                ))}
              </div>
            )}

            {product.videoUrl && (
              <div className="overflow-hidden rounded-2xl border border-ivory-200 bg-charcoal-950 shadow-sm">
                <video
                  src={product.videoUrl}
                  controls
                  playsInline
                  preload="metadata"
                  className="aspect-video w-full"
                >
                  Your browser can&apos;t play this video.
                </video>
              </div>
            )}

            {!hasMedia && (
              <p className="mt-3 text-sm text-charcoal-500">
                Photos/video for this item aren&apos;t uploaded yet.
              </p>
            )}
          </Reveal>

          {/* Product Info */}
          <Reveal variants={revealRight} className="space-y-7">
            <div>
              <p className="mb-2 text-[10px] uppercase tracking-[0.28em] text-champagne-700">
                {product.category}
              </p>
              <h1 className="mb-4 font-heading text-3xl font-light leading-tight text-charcoal-950 md:text-[2.65rem]">
                {product.name}
              </h1>
              <p className="max-w-xl text-[0.98rem] leading-relaxed text-charcoal-600">
                {product.description}
              </p>
            </div>

            {/* Price Section */}
            <div className="rounded-2xl border border-ivory-200/90 bg-gradient-to-br from-white to-ivory-100/80 p-5 shadow-[0_12px_40px_rgba(37,33,23,0.05)] sm:p-6">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-heading text-3xl font-medium tracking-tight text-charcoal-950 md:text-4xl">
                  {formatPrice(priceBreakdown.finalPrice)}
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-champagne-700">
                  {priceTypeLabel(product.fixedPrice)}
                </span>
              </div>

              <p className="mt-2 text-xs leading-relaxed text-charcoal-500">
                {product.fixedPrice
                  ? "Special piece — fixed price"
                  : "Wholesale price based on today's silver rate"}
                {gst.gstRate > 0
                  ? gst.gstInclusive
                    ? ` · includes ${gst.gstRate}% GST`
                    : ` · ${gst.gstRate}% GST added at checkout`
                  : ""}
              </p>
            </div>

            {/* Quantity Selector */}
            <div>
              <label className="mb-2.5 block text-xs font-medium uppercase tracking-[0.16em] text-charcoal-600">
                Quantity
              </label>
              <div className="inline-flex items-center gap-1 rounded-full border border-ivory-200 bg-white p-1.5 shadow-sm">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-ivory-100 disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center text-lg font-medium tabular-nums text-charcoal-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-ivory-100 disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={quantity >= product.stock}
                  aria-label="Increase quantity"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              {product.stock > 0 && quantity >= product.stock && (
                <p className="mt-2 text-xs text-amber-700">
                  Maximum available quantity selected.
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-charcoal-950 py-4 text-sm font-medium uppercase tracking-[0.18em] text-ivory-50 transition-colors hover:bg-charcoal-800 disabled:cursor-not-allowed disabled:bg-charcoal-300"
              >
                <Zap className="h-4 w-4" />
                {product.stock > 0 ? "Order Now" : "Out of Stock"}
              </button>

              <button
                type="button"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className={`flex w-full items-center justify-center gap-2 rounded-full border py-4 text-sm font-medium uppercase tracking-[0.18em] transition-all disabled:cursor-not-allowed disabled:border-charcoal-200 disabled:text-charcoal-300 ${
                  addedToCart
                    ? "border-emerald-600 bg-emerald-600 text-white"
                    : "border-charcoal-900 text-charcoal-900 can-hover:hover:bg-charcoal-900 can-hover:hover:text-ivory-50"
                }`}
              >
                {addedToCart ? (
                  <>
                    <Check className="h-4 w-4" />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </>
                )}
              </button>

              <p className="text-center text-xs text-charcoal-500">
                {product.stock > 0
                  ? "After checkout, pay by scanning the UPI QR — confirmation on WhatsApp."
                  : "This piece is out of stock. Ask on WhatsApp — we may make it again."}
              </p>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setShowInquiryForm(true)}
                  className="flex items-center justify-center gap-2 rounded-full bg-champagne-500 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-charcoal-950 transition-colors hover:bg-champagne-400"
                >
                  <MessageCircle className="h-4 w-4" />
                  Inquire
                </button>

                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] py-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#1ebe57]"
                >
                  <Phone className="h-4 w-4" />
                  WhatsApp
                </a>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-3 border-t border-ivory-200 pt-6">
              {[
                {
                  icon: Truck,
                  title: "Free Shipping",
                  sub: "Above ₹2999",
                },
                {
                  icon: Shield,
                  title: "Wholesale",
                  sub: "Fair pricing",
                },
                {
                  icon: Award,
                  title: "Hallmarked",
                  sub: "925 Sterling",
                },
              ].map((item) => (
                <div key={item.title} className="text-center">
                  <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-ivory-100">
                    <item.icon className="h-4 w-4 text-champagne-700" strokeWidth={1.5} />
                  </div>
                  <p className="text-[11px] font-semibold text-charcoal-800">{item.title}</p>
                  <p className="text-[10px] text-charcoal-500">{item.sub}</p>
                </div>
              ))}
            </div>

            {/* Product Details */}
            <div className="rounded-2xl border border-ivory-200/90 bg-white/90 p-5 shadow-[0_12px_40px_rgba(37,33,23,0.04)] sm:p-6">
              <h3 className="mb-4 font-heading text-lg font-medium text-charcoal-950">
                Product Details
              </h3>
              <div className="space-y-0 text-sm">
                {[
                  { label: "Metal Purity", value: product.material },
                  { label: "Weight", value: `${product.silverWeight}g` },
                  { label: "Category", value: product.category },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex justify-between gap-4 border-b border-ivory-100 py-3 capitalize"
                  >
                    <span className="text-charcoal-500">{row.label}</span>
                    <span className="font-medium text-charcoal-900">{row.value}</span>
                  </div>
                ))}
                <div className="flex justify-between gap-4 py-3">
                  <span className="text-charcoal-500">Availability</span>
                  <span
                    className={`font-medium ${
                      product.stock > 0 ? "text-emerald-700" : "text-red-600"
                    }`}
                  >
                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 border-t border-ivory-200 pt-12">
            <Reveal className="mb-10">
              <p className="section-kicker text-champagne-700">More to love</p>
              <h2 className="mt-3 text-2xl font-heading font-light text-charcoal-900 md:text-3xl">
                You May Also Like
              </h2>
            </Reveal>
            <StaggerReveal className="grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-7">
              {relatedProducts.map((relatedProduct) => {
                return (
                  <StaggerItem key={relatedProduct.id}>
                    <Link
                      href={`/product/${relatedProduct.slug}`}
                      className="group block"
                    >
                      <div className="product-media relative mb-3 aspect-[4/5] transition-shadow duration-300 group-hover:shadow-[0_18px_40px_rgba(196,167,100,0.16)]">
                        {relatedProduct.images[0] ? (
                          <Image
                            src={getOptimizedImageUrl(
                              relatedProduct.images[0],
                              700,
                              875,
                              82
                            )}
                            alt={`${relatedProduct.name} – 925 silver ${relatedProduct.category}`}
                            fill
                            className="object-cover object-center transition-transform duration-600 ease-out group-hover:scale-[1.04]"
                            sizes="(max-width: 768px) 45vw, 20vw"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-charcoal-400">
                            Photo soon
                          </div>
                        )}
                      </div>
                      <h3 className="mb-1 line-clamp-2 font-heading text-sm font-medium text-charcoal-900 transition-colors group-hover:text-champagne-700 md:text-base">
                        {relatedProduct.name}
                      </h3>
                      <p className="text-sm font-semibold text-charcoal-900">
                        {formatPrice(relatedProduct.price)}{" "}
                        <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-champagne-700">
                          {priceTypeLabel(relatedProduct.fixedPrice)}
                        </span>
                      </p>
                    </Link>
                  </StaggerItem>
                );
              })}
            </StaggerReveal>
          </section>
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

