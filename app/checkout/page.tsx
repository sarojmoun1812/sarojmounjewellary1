"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Check,
  Copy,
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
  orderId: string;
  orderNumber: string;
  total: number;
  upi: {
    upiId: string;
    payeeName: string;
    qrUrl: string;
  };
  helpWhatsAppUrl: string;
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
  const [paymentClaimed, setPaymentClaimed] = useState(false);
  const [isClaimingPayment, setIsClaimingPayment] = useState(false);
  const [upiCopied, setUpiCopied] = useState(false);

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
    setSubmitError("");

    // Mirror the server's rule (lib is z.string → last 10 digits, /^[6-9]\d{9}$/)
    // so a mistyped number is caught before a network round-trip.
    const phoneDigits = form.phone.replace(/\D/g, "").slice(-10);
    if (!/^[6-9]\d{9}$/.test(phoneDigits)) {
      setSubmitError(
        "Please enter a valid 10-digit mobile number (starting with 6, 7, 8 or 9)."
      );
      return;
    }

    setIsSubmitting(true);

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
        orderId: data.orderId,
        orderNumber: data.orderNumber,
        total: data.total,
        upi: data.upi,
        helpWhatsAppUrl: data.helpWhatsAppUrl,
      });
      clearCart();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Could not place your order"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyUpi = async () => {
    if (!placedOrder) return;
    try {
      await navigator.clipboard.writeText(placedOrder.upi.upiId);
      setUpiCopied(true);
      setTimeout(() => setUpiCopied(false), 2000);
    } catch {
      setSubmitError("Could not copy UPI ID — please select it manually.");
    }
  };

  const handleClaimPayment = async () => {
    if (!placedOrder || paymentClaimed) return;
    setIsClaimingPayment(true);
    try {
      const res = await fetch(
        `/api/orders/${placedOrder.orderId}/payment-claimed`,
        { method: "POST" }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not update");
      setPaymentClaimed(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Could not update. Please try again."
      );
    } finally {
      setIsClaimingPayment(false);
    }
  };

  if (placedOrder) {
    return (
      <div className="container-luxury py-12 sm:py-20">
        <div className="mx-auto max-w-xl border border-ivory-200 bg-white p-6 text-center sm:p-10">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-champagne-100 sm:mb-7 sm:h-16 sm:w-16">
            <Check className="h-7 w-7 text-champagne-600 sm:h-8 sm:w-8" strokeWidth={1.5} />
          </div>
          <h1 className="font-heading text-2xl font-light text-charcoal-900 sm:text-3xl">
            Order saved — please pay by scanning the QR
          </h1>
          <p className="mt-3 text-sm text-charcoal-500 sm:mt-4 sm:text-base">
            Order{" "}
            <span className="font-medium text-charcoal-900">
              {placedOrder.orderNumber}
            </span>
            . Open GPay / PhonePe / Paytm, tap <strong>Scan QR</strong>, and pay
            the exact amount below.
          </p>

          <p className="mt-6 font-heading text-3xl text-charcoal-900">
            {formatPrice(placedOrder.total)}
          </p>
          <p className="mt-1 text-xs uppercase tracking-[0.14em] text-charcoal-500">
            Pay to {placedOrder.upi.payeeName}
          </p>

          <div className="mx-auto mt-6 w-full max-w-[280px] rounded-2xl border border-ivory-200 bg-ivory-50 p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={placedOrder.upi.qrUrl}
              alt={`${placedOrder.upi.payeeName} UPI QR — scan with any UPI app`}
              className="mx-auto h-auto w-full object-contain"
            />
          </div>
          <p className="mt-3 text-xs text-charcoal-500">
            Tip: Use <strong>Scan QR</strong> in your UPI app. Avoid “Pay to UPI
            ID / contact” links — banks sometimes block those.
          </p>

          <div className="mt-5 flex items-center justify-center gap-2 rounded-lg border border-ivory-200 bg-ivory-50 px-3 py-2.5 text-sm text-charcoal-800">
            <span className="truncate font-medium">{placedOrder.upi.upiId}</span>
            <button
              type="button"
              onClick={handleCopyUpi}
              className="inline-flex shrink-0 items-center gap-1 rounded-md border border-ivory-300 bg-white px-2 py-1 text-xs text-charcoal-700"
            >
              <Copy className="h-3.5 w-3.5" />
              {upiCopied ? "Copied" : "Copy UPI ID"}
            </button>
          </div>
          <p className="mt-2 text-xs text-charcoal-400">
            Or paste this UPI ID in your app and enter{" "}
            <strong>{formatPrice(placedOrder.total)}</strong> yourself.
          </p>

          <button
            type="button"
            onClick={handleClaimPayment}
            disabled={paymentClaimed || isClaimingPayment}
            className="mt-6 flex w-full items-center justify-center gap-2 bg-charcoal-900 px-6 py-4 text-sm font-medium uppercase tracking-[0.14em] text-ivory-50 transition-colors can-hover:hover:bg-charcoal-800 disabled:cursor-default disabled:opacity-80"
          >
            {isClaimingPayment ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : paymentClaimed ? (
              <>
                <Check className="h-4 w-4 text-champagne-300" />
                Got it — we&apos;ll verify your payment
              </>
            ) : (
              "I've paid"
            )}
          </button>

          {paymentClaimed && (
            <p className="mt-3 text-xs text-charcoal-500">
              Once we see the payment, you&apos;ll get the invoice / confirmation
              on WhatsApp.
            </p>
          )}

          <a
            href={placedOrder.helpWhatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-sm text-charcoal-600 underline-offset-4 can-hover:hover:underline"
          >
            <MessageCircle className="h-4 w-4" />
            Questions? WhatsApp us
          </a>

          <button
            type="button"
            onClick={() => router.push("/shop")}
            className="mt-4 w-full border border-charcoal-900 px-6 py-3.5 text-sm font-medium uppercase tracking-[0.18em] text-charcoal-900 transition-colors can-hover:hover:bg-charcoal-900 can-hover:hover:text-ivory-50"
          >
            Keep shopping
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
          Your cart is empty
        </h1>
        <p className="mx-auto mt-3 max-w-md text-charcoal-500">
          Pick a piece you love — we&apos;ll take care of the rest.
        </p>
        <Link href="/shop" className="mt-10 inline-block">
          <span className="inline-flex items-center justify-center bg-charcoal-900 px-10 py-4 text-sm font-medium uppercase tracking-[0.18em] text-ivory-50 transition-colors can-hover:hover:bg-charcoal-800">
            Browse collection
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
          Enter your details, confirm the order, then pay by scanning our UPI QR.
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
                Full name *
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={form.fullName}
                onChange={handleChange}
                className={fieldClass}
                placeholder="Your name"
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
                Optional — you can also share this later on WhatsApp.
              </p>

              <div className="space-y-4">
                <textarea
                  name="address"
                  rows={2}
                  value={form.address}
                  onChange={handleChange}
                  className={`${fieldClass} resize-none`}
                  placeholder="House no., street, area"
                  aria-label="Street address"
                />

                <div className="grid gap-4 md:grid-cols-3">
                  <input
                    name="city"
                    type="text"
                    value={form.city}
                    onChange={handleChange}
                    className={fieldClass}
                    placeholder="City"
                    aria-label="City"
                  />
                  <input
                    name="state"
                    type="text"
                    value={form.state}
                    onChange={handleChange}
                    className={fieldClass}
                    placeholder="State"
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
                Anything else to tell us? (optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={2}
                value={form.notes}
                onChange={handleChange}
                className={`${fieldClass} resize-none`}
                placeholder="Size, gift wrap, preferred delivery time…"
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
                  Confirming your order…
                </>
              ) : (
                <>
                  <Check className="h-5 w-5" />
                  Confirm order
                </>
              )}
            </button>

            <p className="text-center text-xs text-charcoal-500">
              Next: scan our UPI QR and pay the exact amount. After payment is
              received, you&apos;ll get confirmation on WhatsApp.
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
                Checking today&apos;s prices…
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
                  Priced on today&apos;s silver rate. Pay by scanning the UPI QR;
                  confirmation comes on WhatsApp.
                </p>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
