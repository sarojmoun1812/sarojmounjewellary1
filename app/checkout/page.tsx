"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Check,
  Loader2,
  MapPin,
  MessageCircle,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { useCart } from "@/lib/cart-store";
import { formatPrice } from "@/lib/pricing";

type QuoteLine = {
  productId: string;
  name: string;
  slug: string;
  image: string | null;
  silverWeight: number;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

type Quote = {
  lines: QuoteLine[];
  subtotal: number;
  shipping: number;
  gst: { rate: number; amount: number; inclusive: boolean };
  total: number;
  unavailable: { productId: string; name: string | null; reason: string }[];
};

type PlacedOrder = {
  orderNumber: string;
  total: number;
  whatsappUrl: string;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, removeItem, clearCart } = useCart();

  const [quote, setQuote] = useState<Quote | null>(null);
  const [isQuoting, setIsQuoting] = useState(true);
  const [quoteError, setQuoteError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [placedOrder, setPlacedOrder] = useState<PlacedOrder | null>(null);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
    notes: "",
  });

  // Only product IDs and quantities are sent; the server decides the prices.
  const cartKey = useMemo(
    () => items.map((item) => `${item.id}:${item.quantity}`).join(","),
    [items]
  );

  const loadQuote = useCallback(async () => {
    if (items.length === 0) {
      setQuote(null);
      setIsQuoting(false);
      return;
    }

    setIsQuoting(true);
    setQuoteError("");

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

      // Drop anything the shop can no longer supply so the cart matches reality.
      for (const gone of data.unavailable ?? []) {
        removeItem(gone.productId);
      }
    } catch (err) {
      setQuoteError(
        err instanceof Error ? err.message : "Could not price your cart"
      );
    } finally {
      setIsQuoting(false);
    }
    // removeItem is stable (zustand), and cartKey captures the cart contents.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartKey]);

  useEffect(() => {
    if (placedOrder) return;
    loadQuote();
  }, [loadQuote, placedOrder]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const hasAddress =
        form.address && form.city && form.state && form.pincode;

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: form.fullName,
            phone: form.phone,
            ...(form.email ? { email: form.email } : {}),
          },
          items: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
          ...(hasAddress
            ? {
                shippingAddress: {
                  address: form.address,
                  city: form.city,
                  state: form.state,
                  pincode: form.pincode,
                  ...(form.landmark ? { landmark: form.landmark } : {}),
                },
              }
            : {}),
          ...(form.notes ? { notes: form.notes } : {}),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not place your order");

      setPlacedOrder({
        orderNumber: data.orderNumber,
        total: data.total,
        whatsappUrl: data.whatsappUrl,
      });
      clearCart();

      // Open WhatsApp straight away; the confirmation screen keeps a manual link.
      window.open(data.whatsappUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Could not place your order"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (placedOrder) {
    return (
      <div className="min-h-screen bg-powder-50 py-16">
        <div className="max-w-xl mx-auto px-4">
          <div className="bg-white rounded-3xl p-10 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Almost done — send us the message
            </h1>
            <p className="text-gray-600 mb-8">
              We&apos;ve saved your order as{" "}
              <span className="font-semibold text-gray-900">
                {placedOrder.orderNumber}
              </span>
              . WhatsApp should have opened in a new tab. Send the message and
              we&apos;ll confirm your order and delivery details there.
            </p>

            <a
              href={placedOrder.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full bg-green-600 text-white py-4 rounded-xl font-semibold hover:bg-green-700 transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
              Open WhatsApp
            </a>

            <button
              onClick={() => router.push("/shop")}
              className="w-full mt-3 bg-white text-powder-700 border-2 border-powder-600 py-4 rounded-xl font-semibold hover:bg-powder-50 transition-colors"
            >
              Continue shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isQuoting && (items.length === 0 || !quote || quote.lines.length === 0)) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-heading font-bold mb-2">
          Your cart is empty
        </h1>
        <p className="text-gray-600 mb-8">
          Add a piece you love and we&apos;ll take it from there.
        </p>
        <Link
          href="/shop"
          className="inline-block bg-powder-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-powder-700 transition-colors"
        >
          Browse the collection
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-powder-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-heading font-bold text-gray-900 mb-3">
            Complete your order
          </h1>
          <p className="text-gray-600">
            Fill in your details and we&apos;ll continue on WhatsApp — no online
            payment needed.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl p-6 sm:p-8 space-y-6"
            >
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <Truck className="h-6 w-6 text-powder-600" />
                Your details
              </h2>

              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Full name *
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={form.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-powder-500 focus:border-transparent"
                  placeholder="Your name"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Mobile number *
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    required
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-powder-500 focus:border-transparent"
                    placeholder="10-digit mobile number"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Email (optional)
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-powder-500 focus:border-transparent"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="pt-2">
                <h3 className="text-sm font-semibold text-gray-900 mb-1 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-powder-600" />
                  Delivery address
                </h3>
                <p className="text-xs text-gray-500 mb-4">
                  Optional — you can also share this on WhatsApp.
                </p>

                <div className="space-y-4">
                  <textarea
                    name="address"
                    rows={2}
                    value={form.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-powder-500 focus:border-transparent resize-none"
                    placeholder="House no., street, area"
                    aria-label="Street address"
                  />

                  <div className="grid md:grid-cols-3 gap-4">
                    <input
                      name="city"
                      type="text"
                      value={form.city}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-powder-500 focus:border-transparent"
                      placeholder="City"
                      aria-label="City"
                    />
                    <input
                      name="state"
                      type="text"
                      value={form.state}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-powder-500 focus:border-transparent"
                      placeholder="State"
                      aria-label="State"
                    />
                    <input
                      name="pincode"
                      type="text"
                      inputMode="numeric"
                      value={form.pincode}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-powder-500 focus:border-transparent"
                      placeholder="PIN code"
                      aria-label="PIN code"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="notes"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Anything you&apos;d like us to know? (optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={2}
                  value={form.notes}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-powder-500 focus:border-transparent resize-none"
                  placeholder="Sizing, gift wrap, delivery timing…"
                />
              </div>

              {submitError && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span>{submitError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || isQuoting}
                className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Placing your order…
                  </>
                ) : (
                  <>
                    <MessageCircle className="h-5 w-5" />
                    Place order on WhatsApp
                  </>
                )}
              </button>

              <p className="text-xs text-center text-gray-500">
                We&apos;ll save your order and open WhatsApp so you can send it
                to us. Nothing is charged online.
              </p>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 sticky top-8">
              <h2 className="text-lg font-bold text-gray-900 mb-5">
                Order summary
              </h2>

              {isQuoting ? (
                <div className="flex items-center gap-2 text-gray-500 text-sm py-6">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Checking today&apos;s prices…
                </div>
              ) : quoteError ? (
                <div className="text-sm text-red-600">{quoteError}</div>
              ) : quote ? (
                <>
                  {quote.unavailable.length > 0 && (
                    <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-3 text-xs">
                      {quote.unavailable
                        .map((u) => `${u.name ?? "An item"} is ${u.reason}`)
                        .join(". ")}
                      . It has been removed from your cart.
                    </div>
                  )}

                  <div className="space-y-4 mb-5 pb-5 border-b">
                    {quote.lines.map((line) => (
                      <div key={line.productId} className="flex gap-3">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-powder-100 flex-shrink-0">
                          {line.image && (
                            <Image
                              src={line.image}
                              alt={line.name}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm line-clamp-2">
                            {line.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {line.silverWeight}g · Qty {line.quantity}
                          </p>
                          <p className="text-sm font-semibold text-powder-700 mt-1">
                            {formatPrice(line.lineTotal)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 mb-5 pb-5 border-b text-sm">
                    <div className="flex justify-between text-gray-700">
                      <span>Subtotal</span>
                      <span className="font-semibold">
                        {formatPrice(quote.subtotal)}
                      </span>
                    </div>
                    {quote.gst.amount > 0 && !quote.gst.inclusive && (
                      <div className="flex justify-between text-gray-700">
                        <span>GST ({quote.gst.rate}%)</span>
                        <span className="font-semibold">
                          {formatPrice(quote.gst.amount)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-gray-700">
                      <span>Shipping</span>
                      <span className="font-semibold">
                        {quote.shipping === 0
                          ? "Free"
                          : formatPrice(quote.shipping)}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-powder-700">
                      {formatPrice(quote.total)}
                    </span>
                  </div>
                  {quote.gst.amount > 0 && quote.gst.inclusive && (
                    <p className="mt-2 text-xs text-gray-500">
                      Includes {quote.gst.rate}% GST ({formatPrice(quote.gst.amount)})
                    </p>
                  )}

                  <p className="text-xs text-gray-500 mt-4">
                    Priced at today&apos;s silver rate. We&apos;ll confirm the
                    final amount with you on WhatsApp.
                  </p>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
