"use client";

import { useState, useMemo, useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Sparkles } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { formatPrice, priceTypeLabel } from "@/lib/pricing";
import { Reveal } from "@/components/reveal";
import { revealLeft } from "@/lib/motion";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  silverWeight: number;
  fixedPrice: number | null;
  category: string;
  images: string[];
  stock: number;
  featured: boolean;
  bestseller: boolean;
  /** Already priced on the server, in paise. */
  price: number;
}

interface ShopPageClientProps {
  products: Product[];
  categories: string[];
  /** Shown in the hero banner only; prices arrive already calculated. */
  silverRate: number;
  selectedCategory?: string;
}

export function ShopPageClient({
  products,
  categories,
  silverRate,
  selectedCategory,
}: ShopPageClientProps) {
  const [activeCategory, setActiveCategory] = useState(selectedCategory || "all");
  const [sortBy, setSortBy] = useState("featured");
  const addItem = useCart((state) => state.addItem);
  const heroRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? ["0%", "0%"] : ["0%", "18%"]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filter by category
    if (activeCategory && activeCategory !== "all") {
      filtered = filtered.filter(
        (p) => p.category.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        // Already sorted by createdAt desc from server
        break;
      case "featured":
      default:
        // Already sorted by featured from server
        break;
    }

    return filtered;
  }, [products, activeCategory, sortBy]);

  const handleAddToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images[0] || "",
    });
  };

  const heroImage =
    products.find((product) => product.images[0])?.images[0] ?? null;

  return (
    <div className="min-h-screen bg-ivory-50">
      {/* The wrapper used to carry pt-24, which put an ivory band behind the
          header and pushed this hero below it — so the bar sat transparent over
          cream and vanished. The hero now runs to the top of the viewport and
          its content clears the header instead. */}
      <section
        ref={heroRef}
        className="relative isolate min-h-[min(62vh,600px)] overflow-hidden border-b border-ivory-200/60"
      >
        <motion.div className="absolute inset-0 h-[115%] w-full" style={{ y: heroY }}>
          {heroImage ? (
            <Image
              src={heroImage}
              alt="Handcrafted silver jewellery by Saroj Moun"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(196,167,100,0.35),transparent_55%),linear-gradient(160deg,#1a1712_0%,#0f1014_55%,#1c1812_100%)]" />
          )}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(17,18,22,0.15),rgba(17,18,22,0.78)),linear-gradient(110deg,rgba(17,18,22,0.88)_0%,rgba(17,18,22,0.5)_50%,rgba(17,18,22,0.85)_100%)]" />
          <div className="noise-overlay absolute inset-0" />
        </motion.div>
        <div className="pt-below-header relative z-10 flex min-h-[min(62vh,600px)] items-center px-6 pb-16">
          <div className="container-luxury w-full">
            <Reveal variants={revealLeft} className="mx-auto max-w-3xl text-center md:text-left">
              <div className="glass-dark gradient-border inline-block rounded-[2rem] px-8 py-10 md:px-12 md:py-12">
                <p className="section-kicker text-champagne-300">Our Collection</p>
                <h1 className="mt-4 font-heading text-4xl font-light text-ivory-50 md:text-5xl lg:text-6xl">
                  Shop Silver Jewellery
                </h1>
                <p className="mx-auto mt-5 max-w-xl text-ivory-100/75 md:mx-0">
                  Handcrafted 925 sterling silver — hallmark-certified, thoughtfully priced, and styled for everyday
                  shine.
                </p>
                <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-champagne-400/30 bg-charcoal-950/40 px-5 py-2.5 text-sm text-champagne-200 backdrop-blur-md">
                  <Sparkles className="h-4 w-4 text-champagne-300" />
                  <span>
                    Today&apos;s Silver Rate:{" "}
                    <strong className="text-champagne-200">₹{silverRate.toFixed(2)}/g</strong>
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <div className="container-luxury py-12 md:py-16">
        {/* Filters Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                activeCategory === "all"
                  ? "bg-charcoal-900 text-ivory-50"
                  : "bg-ivory-100 text-charcoal-700 hover:bg-ivory-200"
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category.toLowerCase())}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-all capitalize ${
                  activeCategory === category.toLowerCase()
                    ? "bg-charcoal-900 text-ivory-50"
                    : "bg-ivory-100 text-charcoal-700 hover:bg-ivory-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Sort & Filter */}
          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-white border border-ivory-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-champagne-500"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>

            <span className="text-sm text-charcoal-500">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Products Grid — no scroll-reveal wrapper.
            StaggerReveal left these cards at opacity:0 on mobile because the
            tall catalogue never met the old whileInView threshold, so the
            count said "9 products" while the grid looked empty. */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <Sparkles className="h-16 w-16 text-charcoal-300 mx-auto mb-4" />
            <h3 className="text-xl font-heading text-charcoal-700 mb-2">
              No products found
            </h3>
            <p className="text-charcoal-500">
              Try selecting a different category or check back soon for new arrivals.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <article key={product.id} className="group">
                <Link href={`/product/${product.slug}`} className="block">
                  <div className="relative mb-4 aspect-square overflow-hidden rounded-[1.25rem] border border-ivory-200/80 bg-ivory-100 shadow-[0_16px_45px_rgba(37,33,23,0.06)] transition-shadow duration-500 group-hover:shadow-[0_24px_60px_rgba(196,167,100,0.15)]">
                    {product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-contain p-4 transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 40vw, 25vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-ivory-100 via-ivory-50 to-champagne-100/40 px-4 text-center text-sm text-charcoal-400">
                        Photo jaldi add hogi
                      </div>
                    )}

                    <div className="absolute inset-0 bg-charcoal-900/0 transition-colors duration-300 group-hover:bg-charcoal-900/10" />

                    <div className="absolute left-3 top-3 flex flex-col gap-2">
                      {product.bestseller && (
                        <span className="bg-champagne-500 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-charcoal-900">
                          Bestseller
                        </span>
                      )}
                      {product.featured && !product.bestseller && (
                        <span className="bg-charcoal-900 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-ivory-50">
                          Featured
                        </span>
                      )}
                      {product.stock < 5 && product.stock > 0 && (
                        <span className="bg-red-500 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-white">
                          Low Stock
                        </span>
                      )}
                    </div>

                    <div className="absolute bottom-3 right-3 flex gap-2 transition-opacity duration-300 can-hover:opacity-0 can-hover:group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToCart(product);
                        }}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-ivory-50 shadow-lg transition-colors hover:bg-champagne-500"
                        aria-label={`Add ${product.name} to cart`}
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </Link>

                <div>
                  <p className="mb-1 text-[10px] uppercase tracking-wider text-champagne-600">
                    {product.category}
                  </p>
                  <Link href={`/product/${product.slug}`}>
                    <h3 className="mb-2 font-heading font-medium text-charcoal-900 transition-colors line-clamp-2 group-hover:text-champagne-600">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <p className="text-lg font-medium text-charcoal-900">
                      {formatPrice(product.price)}
                    </p>
                    <p className="text-xs font-medium text-champagne-700">
                      {priceTypeLabel(product.fixedPrice)}
                    </p>
                    <p className="text-xs text-charcoal-400">
                      · {product.silverWeight}g Silver
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* SEO Content */}
        <section className="section-padding luxury-mesh mt-12 border-t border-ivory-200/80">
          <div className="max-w-3xl">
            <Reveal>
              <p className="section-kicker text-champagne-700">Why shop here</p>
              <h2 className="mt-4 text-2xl font-heading font-light text-charcoal-950 md:text-3xl">
                Premium Silver Jewellery Online
              </h2>
              <p className="mt-6 leading-relaxed text-charcoal-600">
                At Saroj Moun Jewellery, we offer an exquisite collection of handcrafted 92.5 sterling silver jewellery,
                hallmarked for purity. Every piece is made by karigars in Jaipur and Udaipur, whose families have worked
                in silver for generations. Our collection includes traditional and contemporary designs in necklaces,
                earrings, kadas, and rings.
              </p>
              <p className="mt-4 leading-relaxed text-charcoal-600">
                With transparent wholesale pricing based on current silver rates and weight — or a fixed price on special pieces — you always know exactly what you&apos;re paying for. Enjoy free shipping on orders above ₹2,999.
              </p>
            </Reveal>
          </div>
        </section>
      </div>
    </div>
  );
}

