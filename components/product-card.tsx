"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { formatPrice, priceTypeLabel } from "@/lib/pricing";
import { useToast } from "@/components/toast";
import { getOptimizedImageUrl } from "@/lib/cloudinary";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  badge?: string;
  fixedPrice?: number | null;
  /** When 0 or omitted with badge Sold Out, cart add is blocked. */
  stock?: number;
}

export function ProductCard({
  id,
  name,
  slug,
  price,
  image,
  badge,
  fixedPrice = null,
  stock,
}: ProductCardProps) {
  const addItem = useCart((state) => state.addItem);
  const { showToast } = useToast();
  const prefersReducedMotion = useReducedMotion();
  const soldOut = badge === "Sold Out" || (typeof stock === "number" && stock <= 0);
  const displayImage = image ? getOptimizedImageUrl(image, 800, 1000, 82) : "";

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (soldOut) {
      showToast("warning", "This piece is sold out.");
      return;
    }
    addItem({ id, name, slug, price, image: image || "" });
    showToast("success", `${name} added to cart`);
  };

  return (
    <motion.div
      className="group relative"
      whileHover={prefersReducedMotion ? undefined : { y: -4 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/product/${slug}`} className="block">
        <div className="product-media relative mb-3.5 aspect-[4/5] transition-shadow duration-500 group-hover:shadow-[0_22px_55px_rgba(196,167,100,0.18)]">
          {displayImage ? (
            <Image
              src={displayImage}
              alt={`${name} – 925 silver jewellery`}
              fill
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 45vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-4 text-center text-xs uppercase tracking-[0.18em] text-charcoal-400">
              Photo soon
            </div>
          )}

          {badge && (
            <span className="absolute left-3 top-3 rounded-full bg-champagne-500/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal-900 shadow-sm backdrop-blur-sm">
              {badge}
            </span>
          )}

          <div className="absolute inset-x-0 bottom-0 translate-y-1 opacity-0 transition-all duration-300 can-hover:group-hover:translate-y-0 can-hover:group-hover:opacity-100">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={soldOut}
              className="flex w-full items-center justify-center gap-2 bg-charcoal-950/88 py-3.5 text-xs font-medium uppercase tracking-[0.16em] text-ivory-50 backdrop-blur-md transition-colors hover:bg-charcoal-900 disabled:cursor-not-allowed disabled:bg-charcoal-500/70"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              {soldOut ? "Sold Out" : "Add to Cart"}
            </button>
          </div>
        </div>

        <div className="space-y-1 px-0.5">
          <h3 className="line-clamp-2 font-heading text-[0.95rem] font-medium leading-snug text-charcoal-900 transition-colors group-hover:text-champagne-700">
            {name}
          </h3>
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <p className="text-[1.05rem] font-semibold tracking-tight text-charcoal-950">
              {formatPrice(price)}
            </p>
            <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-champagne-700">
              {priceTypeLabel(fixedPrice)}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
