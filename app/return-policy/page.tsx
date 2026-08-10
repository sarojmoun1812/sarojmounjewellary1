"use client";

import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react";
import { PolicyLayout, PolicySection } from "@/components/policy-layout";
import { CONTACT_EMAIL, PHONE_DISPLAY, STORE_HOURS } from "@/lib/constants";

const RETURN_STEPS = [
  {
    title: "Tell us",
    detail: `WhatsApp us on ${PHONE_DISPLAY} or email ${CONTACT_EMAIL} with your order number and what went wrong.`,
  },
  {
    title: "We approve it",
    detail: "We review and confirm your return request within 24 hours.",
  },
  {
    title: "Pack it up",
    detail:
      "Pack the piece in its original packaging with all tags and certificates.",
  },
  {
    title: "Send it back",
    detail:
      "We arrange a reverse pickup, or you can post it to us. Shipping charges apply unless the piece was faulty.",
  },
  {
    title: "We check it",
    detail: "We inspect the piece within 2–3 business days of receiving it.",
  },
  {
    title: "Refund or exchange",
    detail:
      "Your refund is sent, or the exchange is dispatched, within 5–7 business days.",
  },
];

export default function ReturnPolicyPage() {
  return (
    <PolicyLayout
      kicker="Hassle-Free Returns"
      icon={RefreshCw}
      title="Return & Refund Policy"
      updated="December 24, 2025"
    >
      <PolicySection title="7-day returns">
        <p>
          We want you to be completely happy with your purchase. If you are not,
          you can return or exchange your order within <strong>7 days</strong> of
          delivery.
        </p>
      </PolicySection>

      <PolicySection title="What we can take back">
        <div className="border border-green-200 bg-green-50/60 p-6">
          <p className="mb-3 flex items-center gap-2 font-medium text-green-800">
            <CheckCircle className="h-5 w-5" strokeWidth={1.5} />
            Eligible for return
          </p>
          <ul>
            <li>The piece is unused and in original condition</li>
            <li>Original packaging, tags and certificate are intact</li>
            <li>No scratches, stains or damage</li>
            <li>Returned within 7 days of delivery</li>
            <li>The piece arrived faulty or damaged</li>
            <li>The wrong piece was delivered</li>
          </ul>
        </div>
      </PolicySection>

      <PolicySection title="What we cannot take back">
        <div className="border border-red-200 bg-red-50/60 p-6">
          <p className="mb-3 flex items-center gap-2 font-medium text-red-800">
            <AlertCircle className="h-5 w-5" strokeWidth={1.5} />
            Not eligible for return
          </p>
          <ul>
            <li>Customised or engraved jewellery</li>
            <li>Pieces bought during a special sale, unless faulty</li>
            <li>Items without their original packaging or tags</li>
            <li>Pieces showing signs of wear or damage</li>
            <li>Returns requested more than 7 days after delivery</li>
          </ul>
        </div>
      </PolicySection>

      <PolicySection title="How to return something">
        <ol className="space-y-4">
          {RETURN_STEPS.map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center border border-champagne-300 text-sm text-champagne-700">
                {index + 1}
              </span>
              <span>
                <span className="block font-medium text-charcoal-900">
                  {step.title}
                </span>
                <span className="mt-1 block text-sm text-charcoal-500">
                  {step.detail}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </PolicySection>

      <PolicySection title="How refunds are made">
        <p>
          Once the returned piece passes our quality check, the refund is sent
          back the same way you paid — by UPI or bank transfer (NEFT/IMPS) —
          within 7–10 business days. We confirm the details with you on WhatsApp.
        </p>
        <p className="text-sm italic text-charcoal-500">
          Shipping charges are not refundable unless the piece was faulty or the
          wrong item was delivered.
        </p>
      </PolicySection>

      <PolicySection title="Exchanges">
        <p>You can exchange a piece for:</p>
        <ul>
          <li>The same piece in a different size or design</li>
          <li>A different piece of equal or higher value</li>
        </ul>
        <p>
          If the new piece costs more, you pay the difference; if it costs less,
          we refund the difference. Exchange shipping is ₹99, and free if the
          original piece was faulty or wrong.
        </p>
      </PolicySection>

      <PolicySection title="Damaged or faulty pieces">
        <p>If your order arrives damaged or faulty:</p>
        <ul>
          <li>Contact us within 24 hours of delivery</li>
          <li>Send us photos or a short video of the problem</li>
          <li>We arrange a replacement or a full refund</li>
          <li>We cover all shipping charges in this case</li>
        </ul>
      </PolicySection>

      <PolicySection title="Cancelling an order">
        <ul>
          <li>
            <strong>Before dispatch:</strong> full refund, including shipping
          </li>
          <li>
            <strong>After dispatch:</strong> cancellation is not possible, so
            please use the return process instead
          </li>
        </ul>
        <p>Refunds are processed within 5–7 business days.</p>
      </PolicySection>

      <PolicySection title="Contact Us" divider>
        <p>For returns, refunds or exchanges:</p>
        <div className="space-y-1">
          <p>
            <strong>Email:</strong> {CONTACT_EMAIL}
          </p>
          <p>
            <strong>Phone / WhatsApp:</strong> {PHONE_DISPLAY}
          </p>
          {STORE_HOURS.map(({ days, hours }) => (
            <p key={days}>
              <strong>{days}:</strong> {hours}
            </p>
          ))}
        </div>
      </PolicySection>
    </PolicyLayout>
  );
}
