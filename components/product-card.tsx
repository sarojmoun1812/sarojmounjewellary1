"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Heart } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";
import { useState } from "react";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  badge?: string;
}

export function ProductCard({ id, name, slug, price, image, badge }: ProductCardProps) {
  const addItem = useCart((state) => state.addItem);
  const [liked, setLiked] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ id, name, slug, price, image });
  };

  return (
    <div className="group relative">
      <Link href={`/product/${slug}`}>
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-ivory-100 mb-4">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-charcoal-900/0 group-hover:bg-charcoal-900/10 transition-colors duration-300" />

          {/* Badge */}
          {badge && (
            <span className="absolute top-3 left-3 bg-powder-600 text-white text-[10px] font-semibold tracking-wider uppercase px-3 py-1.5">
              {badge}
            </span>
          )}

          {/* Wishlist icon */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setLiked(!liked);
            }}
            className="absolute top-3 right-3 w-9 h-9 bg-white/90 hover:bg-white flex items-center justify-center rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${liked ? "text-powder-600 fill-powder-600" : "text-charcoal-600"}`}
            />
          </button>

          {/* Quick add to cart */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleAddToCart}
              className="w-full bg-charcoal-900/90 backdrop-blur-sm text-ivory-50 text-xs font-medium tracking-wider uppercase py-3.5 flex items-center justify-center gap-2 hover:bg-charcoal-900 transition-colors"
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </button>
          </div>
        </div>

        {/* Product info */}
        <div className="space-y-1.5">
          <h3 className="text-sm font-body font-medium text-charcoal-800 line-clamp-2 group-hover:text-powder-700 transition-colors leading-snug">
            {name}
          </h3>
          <div className="flex items-baseline gap-2">
            <p className="text-base font-semibold text-charcoal-900">
              {formatPrice(price)}
            </p>
            <span className="text-xs text-charcoal-400 line-through">
              {formatPrice(Math.round(price * 1.25))}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
