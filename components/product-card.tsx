"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Heart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({ id, name, slug, price, image });
  };

  return (
    <motion.div
      className="group relative"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/product/${slug}`}>
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-powder-50 to-powder-100 shadow-xl group-hover:shadow-2xl group-hover:shadow-powder-400/50 transition-all duration-500 border-2 border-powder-300">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Overlay on Hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-powder-600/60 via-powder-500/30 to-transparent flex items-center justify-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.button
              className="p-4 bg-white/95 backdrop-blur-sm rounded-full hover:bg-powder-100 transition-colors shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Heart className="h-6 w-6 text-powder-600" />
            </motion.button>
            <motion.button
              className="p-4 bg-white/95 backdrop-blur-sm rounded-full hover:bg-powder-100 transition-colors shadow-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Eye className="h-6 w-6 text-powder-600" />
            </motion.button>
          </motion.div>

          {badge && (
            <motion.span
              className="absolute top-5 left-5 bg-gradient-to-r from-powder-500 to-powder-600 text-white px-5 py-2 text-xs font-bold rounded-full shadow-lg z-10"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              {badge}
            </motion.span>
          )}

          {/* Shine Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: isHovered ? "100%" : "-100%" }}
            transition={{ duration: 0.8 }}
          />
        </div>
        
        <div className="mt-6 space-y-3">
          <h3 className="text-base font-semibold text-gray-800 line-clamp-2 group-hover:text-powder-600 transition-colors">
            {name}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold bg-gradient-to-r from-powder-600 to-powder-700 bg-clip-text text-transparent">
              {formatPrice(price)}
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(price * 1.3)}
              </span>
            </motion.div>
          </div>
        </div>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Button
          onClick={handleAddToCart}
          className="mt-5 w-full bg-gradient-to-r from-powder-500 to-powder-600 hover:from-powder-600 hover:to-powder-700 text-white transition-all duration-300 font-semibold shadow-lg hover:shadow-xl rounded-full py-6"
          size="lg"
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          Add to Cart
        </Button>
      </motion.div>
    </motion.div>
  );
}
