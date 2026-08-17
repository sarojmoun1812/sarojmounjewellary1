"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ShoppingCart, Heart } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { formatPrice, priceTypeLabel } from "@/lib/pricing";
import { useState } from "react";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  badge?: string;
  fixedPrice?: number | null;
}

export function ProductCard({
  id,
  name,
  slug,
  price,
  image,
  badge,
  fixedPrice = null,
}: ProductCardProps) {
  const addItem = useCart((state) => state.addItem);
  const [liked, setLiked] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ id, name, slug, price, image: image || "" });
  };

  return (
    <motion.div
      className="group relative rounded-[1.75rem] elevated-card gradient-border p-[1px]"
      whileHover={prefersReducedMotion ? undefined : { y: -5 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/product/${slug}`} className="block rounded-[1.7rem] bg-ivory-50/90 p-3">
        <div className="relative mb-4 aspect-square overflow-hidden rounded-[1.25rem] border border-ivory-200/70 bg-ivory-100 transition-shadow duration-500 group-hover:shadow-[0_22px_55px_rgba(196,167,100,0.22)]">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-contain p-4 transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 45vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-ivory-100 via-ivory-50 to-champagne-100/50 px-4 text-center text-xs uppercase tracking-[0.18em] text-charcoal-400">
              Photo soon
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/15 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {badge && (
            <span className="absolute left-3 top-3 bg-champagne-500 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-charcoal-900 shadow-sm">
              {badge}
            </span>
          )}

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setLiked(!liked);
            }}
            className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm transition-all duration-300 hover:bg-white can-hover:opacity-0 can-hover:group-hover:opacity-100"
            aria-label={liked ? `Remove ${name} from wishlist` : `Add ${name} to wishlist`}
          >
            <Heart
              className={`h-4 w-4 transition-colors ${liked ? "fill-champagne-600 text-champagne-600" : "text-charcoal-600"}`}
            />
          </button>

          <div className="absolute bottom-0 left-0 right-0 transition-transform duration-300 can-hover:translate-y-full can-hover:group-hover:translate-y-0">
            <button
              onClick={handleAddToCart}
              className="flex w-full items-center justify-center gap-2 bg-charcoal-900/90 py-3.5 text-xs font-medium uppercase tracking-wider text-ivory-50 backdrop-blur-sm transition-colors hover:bg-charcoal-900"
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </button>
          </div>
        </div>

        <div className="space-y-1.5 px-0.5">
          <h3 className="line-clamp-2 text-sm font-medium leading-snug text-charcoal-800 transition-colors group-hover:text-champagne-700">
            {name}
          </h3>
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <p className="text-base font-semibold text-charcoal-900">
              {formatPrice(price)}
            </p>
            <p className="text-xs font-medium text-champagne-700">
              {priceTypeLabel(fixedPrice)}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
