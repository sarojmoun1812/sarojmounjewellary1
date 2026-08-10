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

const fieldClass =
  "w-full border border-ivory-300 bg-white px-4 py-3 text-charcoal-900 placeholder:text-charcoal-300 focus:border-charcoal-900 focus:outline-none focus:ring-1 focus:ring-charcoal-900";

const labelClass =
  "mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-charcoal-600";

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
      <div className="container-luxury py-20">
        <div className="mx-auto max-w-xl border border-ivory-200 bg-white p-10 text-center">
          <div className="mx-auto mb-7 flex h-16 w-16 items-center justify-center rounded-full bg-champagne-100">
            <Check className="h-8 w-8 text-champagne-600" strokeWidth={1.5} />
          </div>
          <h1 className="font-heading text-3xl font-light text-charcoal-900">
            Bas ek kadam aur — message bhej dijiye
          </h1>
          <p className="mt-4 text-charcoal-500">
            Aapka order{" "}
            <span className="font-medium text-charcoal-900">
              {placedOrder.orderNumber}
            </span>{" "}
            save ho gaya hai. WhatsApp naye tab mein khul gaya hoga — message
            bhejiye aur hum wahin order aur delivery confirm kar denge.
          </p>

          {/* Green only at the literal handoff, where the WhatsApp cue helps. */}
          <a
            href={placedOrder.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 flex w-full items-center justify-center gap-2 bg-[#128C7E] px-6 py-4 text-sm font-medium uppercase tracking-[0.18em] text-white transition-colors can-hover:hover:bg-[#0e6f64]"
          >
            <MessageCircle className="h-5 w-5" />
            WhatsApp Kholein
          </a>

          <button
            onClick={() => router.push("/shop")}
            className="mt-3 w-full border border-charcoal-900 px-6 py-3.5 text-sm font-medium uppercase tracking-[0.18em] text-charcoal-900 transition-colors can-hover:hover:bg-charcoal-900 can-hover:hover:text-ivory-50"
          >
            Aur Dekhein
          </button>
        </div>
      </div>
    );
  }

  if (!isQuoting && (items.length === 0 || !quote || quote.lines.length === 0)) {
    return (
      <div className="container-luxury py-24 text-center">
        <ShoppingBag className="mx-auto mb-6 h-14 w-14 text-champagne-400" strokeWidth={1} />
        <h1 className="font-heading text-3xl font-light text-charcoal-900">
          Aapka cart khaali hai
        </h1>
        <p className="mx-auto mt-3 max-w-md text-charcoal-500">
          Apni pasand ka piece chuniye, baaki hum sambhaal lenge.
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
      <div className="text-center">
        <p className="section-kicker text-champagne-600">Almost There</p>
        <h1 className="mt-3 font-heading text-4xl font-light text-charcoal-900">
          Complete your order
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-charcoal-500">
          Apni details bhariye — baaki baat WhatsApp par hogi. Koi online
          payment nahi.
        </p>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="space-y-6 border border-ivory-200 bg-white p-6 sm:p-8"
          >
            <h2 className="flex items-center gap-3 font-heading text-xl font-light text-charcoal-900">
              <Truck className="h-5 w-5 text-champagne-600" strokeWidth={1.5} />
              Your details
            </h2>

            <div>
              <label htmlFor="fullName" className={labelClass}>
                Poora naam *
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={form.fullName}
                onChange={handleChange}
                className={fieldClass}
                placeholder="Aapka naam"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="phone" className={labelClass}>
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
                  className={fieldClass}
                  placeholder="10 digit mobile number"
                />
              </div>

              <div>
                <label htmlFor="email" className={labelClass}>
                  Email (optional)
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className={fieldClass}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="pt-2">
              <h3 className="flex items-center gap-2 text-sm font-medium text-charcoal-900">
                <MapPin className="h-4 w-4 text-champagne-600" strokeWidth={1.5} />
                Delivery address
              </h3>
              <p className="mb-4 mt-1 text-xs text-charcoal-500">
                Optional — WhatsApp par bhi bata sakte hain.
              </p>

              <div className="space-y-4">
                <textarea
                  name="address"
                  rows={2}
                  value={form.address}
                  onChange={handleChange}
                  className={`${fieldClass} resize-none`}
                  placeholder="Ghar no., gali, area"
                  aria-label="Street address"
                />

                <div className="grid gap-4 md:grid-cols-3">
                  <input
                    name="city"
                    type="text"
                    value={form.city}
                    onChange={handleChange}
                    className={fieldClass}
                    placeholder="Sheher"
                    aria-label="City"
                  />
                  <input
                    name="state"
                    type="text"
                    value={form.state}
                    onChange={handleChange}
                    className={fieldClass}
                    placeholder="Rajya"
                    aria-label="State"
                  />
                  <input
                    name="pincode"
                    type="text"
                    inputMode="numeric"
                    value={form.pincode}
                    onChange={handleChange}
                    className={fieldClass}
                    placeholder="PIN code"
                    aria-label="PIN code"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="notes" className={labelClass}>
                Kuch aur batana chahte hain? (optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={2}
                value={form.notes}
                onChange={handleChange}
                className={`${fieldClass} resize-none`}
                placeholder="Size, gift wrap, delivery ka time…"
              />
            </div>

            {submitError && (
              <div className="flex items-start gap-2 border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
                <span>{submitError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || isQuoting}
              className="flex w-full items-center justify-center gap-2 bg-charcoal-900 px-6 py-4 text-sm font-medium uppercase tracking-[0.18em] text-ivory-50 transition-colors can-hover:hover:bg-charcoal-800 disabled:cursor-not-allowed disabled:bg-charcoal-300"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Order bheja ja raha hai…
                </>
              ) : (
                <>
                  <MessageCircle className="h-5 w-5" />
                  WhatsApp Par Order Karein
                </>
              )}
            </button>

            <p className="text-center text-xs text-charcoal-500">
              Hum aapka order save karke WhatsApp khol denge taaki aap message
              bhej sakein. Online kuch charge nahi hoga.
            </p>
          </form>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-36 border border-ivory-200 bg-ivory-100/60 p-7">
            <h2 className="font-heading text-xl font-light text-charcoal-900">
              Order summary
            </h2>

            {isQuoting ? (
              <div className="flex items-center gap-2 py-8 text-sm text-charcoal-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Aaj ke daam check kar rahe hain…
              </div>
            ) : quoteError ? (
              <div className="mt-5 text-sm text-red-600">{quoteError}</div>
            ) : quote ? (
              <>
                {quote.unavailable.length > 0 && (
                  <div className="mt-5 border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                    {quote.unavailable
                      .map((u) => `${u.name ?? "An item"} is ${u.reason}`)
                      .join(". ")}
                    . It has been removed from your cart.
                  </div>
                )}

                <div className="mt-6 space-y-4 border-b border-ivory-300 pb-6">
                  {quote.lines.map((line) => (
                    <div key={line.productId} className="flex gap-3">
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden bg-ivory-200">
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
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 text-sm text-charcoal-900">
                          {line.name}
                        </p>
                        <p className="mt-0.5 text-xs text-charcoal-500">
                          {line.silverWeight}g · Qty {line.quantity}
                        </p>
                        <p className="mt-1 text-sm font-medium text-charcoal-900">
                          {formatPrice(line.lineTotal)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 border-b border-ivory-300 py-6 text-sm">
                  <div className="flex justify-between">
                    <span className="text-charcoal-500">Subtotal</span>
                    <span className="text-charcoal-900">
                      {formatPrice(quote.subtotal)}
                    </span>
                  </div>
                  {quote.gst.amount > 0 && !quote.gst.inclusive && (
                    <div className="flex justify-between">
                      <span className="text-charcoal-500">
                        GST ({quote.gst.rate}%)
                      </span>
                      <span className="text-charcoal-900">
                        {formatPrice(quote.gst.amount)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-charcoal-500">Shipping</span>
                    <span
                      className={
                        quote.shipping === 0
                          ? "font-medium text-champagne-600"
                          : "text-charcoal-900"
                      }
                    >
                      {quote.shipping === 0
                        ? "Free"
                        : formatPrice(quote.shipping)}
                    </span>
                  </div>
                </div>

                <div className="flex items-baseline justify-between pt-6">
                  <span className="text-sm uppercase tracking-[0.18em] text-charcoal-700">
                    Total
                  </span>
                  <span className="font-heading text-2xl text-charcoal-900">
                    {formatPrice(quote.total)}
                  </span>
                </div>
                {quote.gst.amount > 0 && quote.gst.inclusive && (
                  <p className="mt-2 text-xs text-charcoal-500">
                    Includes {quote.gst.rate}% GST ({formatPrice(quote.gst.amount)})
                  </p>
                )}

                <p className="mt-4 text-xs text-charcoal-500">
                  Aaj ke chaandi bhaav par. Final amount hum WhatsApp par confirm
                  karenge.
                </p>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
