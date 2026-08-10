"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, Loader2 } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";

type QuoteLine = {
  productId: string;
  name: string;
  slug: string;
  image: string | null;
  silverWeight: number;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  availableStock: number;
};

type Quote = {
  lines: QuoteLine[];
  subtotal: number;
  shipping: number;
  gst: { rate: number; amount: number; inclusive: boolean };
  total: number;
  unavailable: { productId: string; name: string | null; reason: string }[];
};

export default function CartPage() {
  const { items, updateQuantity, removeItem } = useCart();

  const [quote, setQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const cartKey = useMemo(
    () => items.map((item) => `${item.id}:${item.quantity}`).join(","),
    [items]
  );

  // Prices are recalculated by the server on every change, so the cart always
  // reflects today's silver rate rather than whatever was cached at add time.
  const loadQuote = useCallback(async () => {
    if (items.length === 0) {
      setQuote(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/cart/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          items.map((item) => ({ productId: item.id, quantity: item.quantity }))
        ),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not price your cart");

      setQuote(data);

      for (const gone of data.unavailable ?? []) {
        removeItem(gone.productId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not price your cart");
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartKey]);

  useEffect(() => {
    loadQuote();
  }, [loadQuote]);

  if (items.length === 0) {
    return (
      <div className="container-luxury py-24 text-center">
        <ShoppingBag className="mx-auto mb-6 h-14 w-14 text-champagne-400" strokeWidth={1} />
        <h1 className="font-heading text-3xl font-light text-charcoal-900">
          Aapka cart khaali hai
        </h1>
        <p className="mx-auto mt-3 max-w-md text-charcoal-500">
          Hamari handcrafted 925 silver collection dekhiye aur apni pasand ka
          piece chuniye.
        </p>
        <Link href="/shop" className="mt-10 inline-block">
          <span className="inline-flex items-center justify-center bg-charcoal-900 px-10 py-4 text-sm font-medium uppercase tracking-[0.18em] text-ivory-50 transition-colors can-hover:hover:bg-charcoal-800">
            Collection Dekhein
          </span>
        </Link>
      </div>
    );
  }

  return (
    <div className="container-luxury py-14">
      <p className="section-kicker text-champagne-600">Your Selection</p>
      <h1 className="mt-3 font-heading text-4xl font-light text-charcoal-900">
        Shopping Cart
      </h1>

      {quote && quote.unavailable.length > 0 && (
        <div className="mt-8 border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          {quote.unavailable
            .map((u) => `${u.name ?? "An item"} is ${u.reason}`)
            .join(". ")}
          . It has been removed from your cart.
        </div>
      )}

      {error && (
        <div className="mt-8 border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {(quote?.lines ?? []).map((line) => (
            <div
              key={line.productId}
              className="flex gap-5 border border-ivory-200 bg-white p-5 transition-shadow can-hover:hover:shadow-[0_12px_40px_rgba(17,18,22,0.06)]"
            >
              <Link
                href={`/product/${line.slug}`}
                className="relative h-28 w-28 flex-shrink-0 overflow-hidden bg-ivory-100"
              >
                {line.image && (
                  <Image
                    src={line.image}
                    alt={line.name}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                )}
              </Link>

              <div className="min-w-0 flex-1">
                <Link href={`/product/${line.slug}`}>
                  <h2 className="font-heading text-lg font-normal text-charcoal-900 transition-colors can-hover:hover:text-champagne-600">
                    {line.name}
                  </h2>
                </Link>
                <p className="mt-1 text-sm text-charcoal-500">
                  {formatPrice(line.unitPrice)} · {line.silverWeight}g silver
                </p>

                <div className="mt-4 flex items-center">
                  <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center border border-ivory-300 text-charcoal-700 transition-colors can-hover:hover:border-charcoal-900 disabled:cursor-not-allowed disabled:text-charcoal-300"
                    aria-label={`Reduce quantity of ${line.name}`}
                    onClick={() =>
                      updateQuantity(line.productId, line.quantity - 1)
                    }
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center text-sm text-charcoal-900">
                    {line.quantity}
                  </span>
                  <button
                    type="button"
                    className="flex h-9 w-9 items-center justify-center border border-ivory-300 text-charcoal-700 transition-colors can-hover:hover:border-charcoal-900 disabled:cursor-not-allowed disabled:text-charcoal-300"
                    disabled={line.quantity >= line.availableStock}
                    aria-label={`Increase quantity of ${line.name}`}
                    onClick={() =>
                      updateQuantity(line.productId, line.quantity + 1)
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                {line.quantity >= line.availableStock && (
                  <p className="mt-2 text-xs text-amber-700">
                    Sirf {line.availableStock} bache hain.
                  </p>
                )}
              </div>

              <div className="flex flex-col items-end justify-between">
                <p className="font-heading text-lg text-charcoal-900">
                  {formatPrice(line.lineTotal)}
                </p>
                <button
                  type="button"
                  className="p-2 text-charcoal-400 transition-colors can-hover:hover:text-red-600"
                  aria-label={`Remove ${line.name} from cart`}
                  onClick={() => removeItem(line.productId)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-36 border border-ivory-200 bg-ivory-100/60 p-7">
            <h2 className="font-heading text-xl font-light text-charcoal-900">
              Order Summary
            </h2>

            {isLoading || !quote ? (
              <div className="flex items-center gap-2 py-8 text-sm text-charcoal-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Aaj ke daam check kar rahe hain…
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal-500">Subtotal</span>
                  <span className="text-charcoal-900">
                    {formatPrice(quote.subtotal)}
                  </span>
                </div>
                {quote.gst.amount > 0 && !quote.gst.inclusive && (
                  <div className="flex justify-between text-sm">
                    <span className="text-charcoal-500">
                      GST ({quote.gst.rate}%)
                    </span>
                    <span className="text-charcoal-900">
                      {formatPrice(quote.gst.amount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-charcoal-500">Shipping</span>
                  <span
                    className={
                      quote.shipping === 0
                        ? "font-medium text-champagne-600"
                        : "text-charcoal-900"
                    }
                  >
                    {quote.shipping === 0 ? "FREE" : formatPrice(quote.shipping)}
                  </span>
                </div>
                <div className="flex items-baseline justify-between border-t border-ivory-300 pt-4">
                  <span className="text-sm uppercase tracking-[0.18em] text-charcoal-700">
                    Total
                  </span>
                  <span className="font-heading text-2xl text-charcoal-900">
                    {formatPrice(quote.total)}
                  </span>
                </div>
                {quote.gst.amount > 0 && quote.gst.inclusive && (
                  <p className="text-xs text-charcoal-500">
                    Includes {quote.gst.rate}% GST ({formatPrice(quote.gst.amount)})
                  </p>
                )}
              </div>
            )}

            <Link href="/checkout" className="mt-7 block">
              <span
                className={`flex w-full items-center justify-center px-6 py-4 text-sm font-medium uppercase tracking-[0.18em] transition-colors ${
                  isLoading
                    ? "cursor-not-allowed bg-charcoal-300 text-ivory-50"
                    : "bg-charcoal-900 text-ivory-50 can-hover:hover:bg-charcoal-800"
                }`}
              >
                Proceed to Checkout
              </span>
            </Link>

            {/* Set the expectation here rather than at the last step, where a
                customer looking for a card form would simply leave. */}
            <p className="mt-3 text-center text-xs text-charcoal-500">
              Koi online payment nahi — order WhatsApp par confirm hoga.
            </p>

            <Link href="/shop" className="mt-4 block">
              <span className="flex w-full items-center justify-center border border-charcoal-900 px-6 py-3.5 text-sm font-medium uppercase tracking-[0.18em] text-charcoal-900 transition-colors can-hover:hover:bg-charcoal-900 can-hover:hover:text-ivory-50">
                Continue Shopping
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
