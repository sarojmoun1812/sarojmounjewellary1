"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, Loader2 } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-heading font-bold mb-2">
          Your cart is empty
        </h1>
        <p className="text-gray-600 mb-8">
          Add some beautiful pieces to get started
        </p>
        <Link href="/shop">
          <Button size="lg">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-heading font-bold text-primary mb-8">
        Shopping Cart
      </h1>

      {quote && quote.unavailable.length > 0 && (
        <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-4 text-sm">
          {quote.unavailable
            .map((u) => `${u.name ?? "An item"} is ${u.reason}`)
            .join(". ")}
          . It has been removed from your cart.
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {(quote?.lines ?? []).map((line) => (
            <div
              key={line.productId}
              className="flex gap-4 bg-white p-4 rounded-lg border"
            >
              <div className="relative h-24 w-24 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                {line.image && (
                  <Image
                    src={line.image}
                    alt={line.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <Link href={`/product/${line.slug}`}>
                  <h2 className="font-medium hover:text-primary">{line.name}</h2>
                </Link>
                <p className="text-sm text-gray-600 mt-1">
                  {formatPrice(line.unitPrice)} · {line.silverWeight}g
                </p>

                <div className="flex items-center gap-2 mt-3">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8"
                    aria-label={`Reduce quantity of ${line.name}`}
                    onClick={() =>
                      updateQuantity(line.productId, line.quantity - 1)
                    }
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center">{line.quantity}</span>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8"
                    disabled={line.quantity >= line.availableStock}
                    aria-label={`Increase quantity of ${line.name}`}
                    onClick={() =>
                      updateQuantity(line.productId, line.quantity + 1)
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {line.quantity >= line.availableStock && (
                  <p className="text-xs text-amber-700 mt-2">
                    Only {line.availableStock} left in stock.
                  </p>
                )}
              </div>

              <div className="flex flex-col items-end justify-between">
                <p className="font-semibold">{formatPrice(line.lineTotal)}</p>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-red-500 hover:text-red-700"
                  aria-label={`Remove ${line.name} from cart`}
                  onClick={() => removeItem(line.productId)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            {isLoading || !quote ? (
              <div className="flex items-center gap-2 text-gray-500 text-sm py-6">
                <Loader2 className="h-4 w-4 animate-spin" />
                Checking today&apos;s prices…
              </div>
            ) : (
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    {formatPrice(quote.subtotal)}
                  </span>
                </div>
                {quote.gst.amount > 0 && !quote.gst.inclusive && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">GST ({quote.gst.rate}%)</span>
                    <span className="font-medium">{formatPrice(quote.gst.amount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {quote.shipping === 0 ? "FREE" : formatPrice(quote.shipping)}
                  </span>
                </div>
                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatPrice(quote.total)}</span>
                </div>
                {quote.gst.amount > 0 && quote.gst.inclusive && (
                  <p className="text-xs text-gray-500">
                    Includes {quote.gst.rate}% GST ({formatPrice(quote.gst.amount)})
                  </p>
                )}
              </div>
            )}

            <Link href="/checkout">
              <Button className="w-full" size="lg" disabled={isLoading}>
                Proceed to Checkout
              </Button>
            </Link>

            <Link href="/shop">
              <Button variant="outline" className="w-full mt-3">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
