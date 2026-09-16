"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Search, ShoppingCart, Sparkles } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { formatPrice, priceTypeLabel } from "@/lib/pricing";
import { Reveal } from "@/components/reveal";
import { revealLeft } from "@/lib/motion";
import { useToast } from "@/components/toast";
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
  stock: number;
  featured: boolean;
  bestseller: boolean;
  /** Added in the last two weeks. */
  isNew?: boolean;
  /** Already priced on the server, in paise. */
  price: number;
}

interface ShopPageClientProps {
  products: Product[];
  categories: string[];
  /** Shown in the hero banner only; prices arrive already calculated. */
  silverRate: number;
  selectedCategory?: string;
  initialSort?: string;
}

export function ShopPageClient({
  products,
  categories,
  silverRate,
  selectedCategory,
  initialSort,
}: ShopPageClientProps) {
  const [activeCategory, setActiveCategory] = useState(selectedCategory || "all");
  const [sortBy, setSortBy] = useState(initialSort || "featured");
  const [query, setQuery] = useState("");
  const addItem = useCart((state) => state.addItem);
  const { showToast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const heroRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(
    scrollYProgress,
    [0, 1],
    prefersReducedMotion ? ["0%", "0%"] : ["0%", "18%"]
  );

  useEffect(() => {
    setActiveCategory(selectedCategory || "all");
  }, [selectedCategory]);

  useEffect(() => {
    if (initialSort) setSortBy(initialSort);
  }, [initialSort]);

  const syncUrl = (category: string, sort: string) => {
    const params = new URLSearchParams();
    if (category && category !== "all") params.set("category", category);
    if (sort && sort !== "featured") params.set("sort", sort);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    const needle = query.trim().toLowerCase();

    if (activeCategory && activeCategory !== "all") {
      filtered = filtered.filter(
        (p) => p.category.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    if (needle) {
      filtered = filtered.filter((p) => {
        const haystack = [
          p.name,
          p.description,
          p.category,
          `${p.silverWeight}g`,
          `${p.silverWeight}`,
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(needle);
      });
    }

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "newest":
      case "featured":
      default:
        break;
    }

    return filtered;
  }, [products, activeCategory, sortBy, query]);

  const handleCategory = (category: string) => {
    setActiveCategory(category);
    syncUrl(category, sortBy);
  };

  const handleSort = (sort: string) => {
    setSortBy(sort);
    syncUrl(activeCategory, sort);
  };

  const handleAddToCart = (product: Product) => {
    if (product.stock <= 0) {
      showToast("warning", "This piece is sold out.");
      return;
    }
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images[0] || "",
    });
    showToast("success", `${product.name} added to cart`);
  };

  const heroImageRaw =
    products.find((product) => product.images[0])?.images[0] ?? null;
  const heroImage = heroImageRaw
    ? getOptimizedImageUrl(heroImageRaw, 1920, 1080, 82)
    : null;

  return (
    <div className="min-h-screen bg-ivory-50">
      <section
        ref={heroRef}
        className="relative isolate min-h-[min(34vh,260px)] overflow-hidden border-b border-ivory-200/60 sm:min-h-[min(48vh,420px)] md:min-h-[min(62vh,600px)]"
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
        <div className="pt-below-header relative z-10 flex min-h-[min(34vh,260px)] items-center px-4 pb-8 sm:min-h-[min(48vh,420px)] sm:px-6 sm:pb-12 md:min-h-[min(62vh,600px)] md:pb-16">
          <div className="container-luxury w-full">
            <Reveal variants={revealLeft} className="mx-auto max-w-3xl text-center md:text-left">
              <div className="glass-dark gradient-border inline-block rounded-2xl px-5 py-6 sm:rounded-[2rem] sm:px-8 sm:py-10 md:px-12 md:py-12">
                <p className="section-kicker text-champagne-300">Our Collection</p>
                <h1 className="mt-2 font-heading text-2xl font-light text-ivory-50 sm:mt-4 sm:text-4xl md:text-5xl lg:text-6xl">
                  Shop Silver Jewellery
                </h1>
                <p className="mx-auto mt-3 hidden max-w-xl text-sm text-ivory-100/75 sm:mt-5 sm:block md:mx-0 md:text-base">
                  Handcrafted 925 sterling silver — hallmark-certified, thoughtfully priced, and styled for everyday
                  shine.
                </p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-champagne-400/30 bg-charcoal-950/40 px-3 py-1.5 text-xs text-champagne-200 backdrop-blur-md sm:mt-8 sm:px-5 sm:py-2.5 sm:text-sm">
                  <Sparkles className="h-3.5 w-3.5 text-champagne-300 sm:h-4 sm:w-4" />
                  <span>
                    Silver:{" "}
                    <strong className="text-champagne-200">₹{silverRate.toFixed(2)}/g</strong>
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <div className="container-luxury py-6 md:py-16">
        <div className="z-20 mb-5 space-y-2.5 rounded-2xl border border-ivory-200/70 bg-white/80 p-3 shadow-[0_12px_40px_rgba(37,33,23,0.05)] backdrop-blur-xl md:sticky md:top-20 md:mb-9 md:space-y-3.5 md:rounded-[1.35rem] md:p-5">
          <div className="flex items-center gap-2.5">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-charcoal-400 md:left-3.5 md:h-4 md:w-4" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, category, weight…"
                className="w-full rounded-xl border border-ivory-200/90 bg-ivory-50/80 py-2.5 pl-9 pr-3 text-sm text-charcoal-900 placeholder:text-charcoal-400 transition focus:border-champagne-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-champagne-500/40 md:py-3 md:pl-11 md:pr-4"
                aria-label="Search jewellery"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => handleSort(e.target.value)}
              className="shrink-0 rounded-xl border border-ivory-200/90 bg-ivory-50/80 px-2.5 py-2.5 text-xs text-charcoal-800 transition focus:border-champagne-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-champagne-500/40 md:px-4 md:py-3 md:text-sm"
              aria-label="Sort products"
            >
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price ↑</option>
              <option value="price-high">Price ↓</option>
            </select>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <button
                type="button"
                onClick={() => handleCategory("all")}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium tracking-wide transition-all duration-200 md:px-4 md:py-2 md:text-sm ${
                  activeCategory === "all"
                    ? "bg-charcoal-950 text-ivory-50 shadow-sm"
                    : "bg-ivory-100/90 text-charcoal-700 hover:bg-ivory-200"
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  type="button"
                  key={category}
                  onClick={() => handleCategory(category.toLowerCase())}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium capitalize tracking-wide transition-all duration-200 md:px-4 md:py-2 md:text-sm ${
                    activeCategory === category.toLowerCase()
                      ? "bg-charcoal-950 text-ivory-50 shadow-sm"
                      : "bg-ivory-100/90 text-charcoal-700 hover:bg-ivory-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <span className="shrink-0 rounded-full bg-ivory-100 px-2.5 py-1 text-[11px] font-medium tabular-nums text-charcoal-500 md:text-xs">
              {filteredProducts.length}
            </span>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center">
            <Sparkles className="mx-auto mb-4 h-16 w-16 text-charcoal-300" />
            <h3 className="mb-2 font-heading text-xl text-charcoal-700">
              No products found
            </h3>
            <p className="mx-auto max-w-md text-charcoal-500">
              {query.trim()
                ? `No matches for “${query.trim()}”. Try another name or category.`
                : "Nothing in this category yet — tap All to see the full collection."}
            </p>
            {(query.trim() || activeCategory !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  handleCategory("all");
                }}
                className="mt-6 inline-flex rounded-full bg-charcoal-900 px-6 py-3 text-sm uppercase tracking-[0.18em] text-ivory-50"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-7">
            {filteredProducts.map((product) => {
              const thumb = product.images[0]
                ? getOptimizedImageUrl(product.images[0], 800, 1000, 82)
                : "";
              const soldOut = product.stock <= 0;

              return (
                <article key={product.id} className="group">
                  <Link href={`/product/${product.slug}`} className="block">
                    <div className="product-media relative mb-3 aspect-[4/5] transition-shadow duration-500 group-hover:shadow-[0_22px_55px_rgba(196,167,100,0.16)]">
                      {thumb ? (
                        <Image
                          src={thumb}
                          alt={product.name}
                          fill
                          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                          sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center px-4 text-center text-sm text-charcoal-400">
                          Photo coming soon
                        </div>
                      )}

                      <div className="absolute left-2.5 top-2.5 flex flex-col gap-1.5 sm:left-3 sm:top-3">
                        {soldOut ? (
                          <span className="rounded-full bg-charcoal-950/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-ivory-50 backdrop-blur-sm">
                            Sold Out
                          </span>
                        ) : product.isNew ? (
                          <span className="rounded-full bg-champagne-500 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-charcoal-900 shadow-sm">
                            New
                          </span>
                        ) : null}
                        {product.bestseller && !soldOut && !product.isNew && (
                          <span className="rounded-full bg-champagne-500/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-charcoal-900 shadow-sm">
                            Bestseller
                          </span>
                        )}
                        {product.featured &&
                          !product.bestseller &&
                          !product.isNew &&
                          !soldOut && (
                            <span className="rounded-full bg-charcoal-950/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-ivory-50 backdrop-blur-sm">
                              Featured
                            </span>
                          )}
                      </div>

                      <div className="absolute bottom-2.5 right-2.5 opacity-100 transition-opacity duration-300 can-hover:opacity-0 can-hover:group-hover:opacity-100 sm:bottom-3 sm:right-3">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            handleAddToCart(product);
                          }}
                          disabled={soldOut}
                          className="flex h-10 w-10 items-center justify-center rounded-full border border-ivory-200/80 bg-ivory-50/95 text-charcoal-900 shadow-md backdrop-blur-md transition-colors hover:bg-champagne-500 disabled:cursor-not-allowed disabled:bg-charcoal-200 disabled:opacity-70"
                          aria-label={
                            soldOut
                              ? `${product.name} is sold out`
                              : `Add ${product.name} to cart`
                          }
                        >
                          <ShoppingCart className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </Link>

                  <div className="px-0.5">
                    <p className="mb-1 text-[10px] uppercase tracking-[0.16em] text-champagne-700">
                      {product.category}
                    </p>
                    <Link href={`/product/${product.slug}`}>
                      <h3 className="mb-1.5 line-clamp-2 font-heading text-sm font-medium leading-snug text-charcoal-950 transition-colors group-hover:text-champagne-700 sm:text-base">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                      <p className="text-base font-semibold tracking-tight text-charcoal-950 sm:text-lg">
                        {formatPrice(product.price)}
                      </p>
                      <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-champagne-700 sm:text-xs">
                        {priceTypeLabel(product.fixedPrice)}
                      </p>
                      <p className="text-xs text-charcoal-400">
                        · {product.silverWeight}g
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

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
