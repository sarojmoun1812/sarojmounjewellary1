"use client";

import { Truck } from "lucide-react";
import { PolicyLayout, PolicySection } from "@/components/policy-layout";
import { CONTACT_EMAIL, PHONE_DISPLAY, STORE_HOURS } from "@/lib/constants";

const DELIVERY_ZONES = [
  {
    zone: "Metro cities",
    time: "5–7 business days",
    detail:
      "Delhi NCR, Mumbai, Bangalore, Chennai, Kolkata, Hyderabad, Pune, Ahmedabad",
  },
  {
    zone: "Other cities",
    time: "7–10 business days",
    detail: "All other locations across India",
  },
  {
    zone: "Remote areas",
    time: "10–14 business days",
    detail:
      "Northeastern states, Jammu & Kashmir, Ladakh, Andaman & Nicobar Islands",
  },
];

export default function ShippingPolicyPage() {
  return (
    <PolicyLayout
      kicker="Nationwide Delivery"
      icon={Truck}
      title="Shipping Policy"
      updated="December 24, 2025"
    >
      <PolicySection title="Where we ship">
        <p>
          We currently ship to all locations within India. International shipping
          is not available at this time.
        </p>
      </PolicySection>

      <PolicySection title="Processing time">
        <p>
          All orders are processed within <strong>1–2 business days</strong>{" "}
          (Monday to Saturday, excluding public holidays).
        </p>
        <p>
          Orders placed after 3:00 PM IST are processed the next business day.
        </p>
      </PolicySection>

      <PolicySection title="Delivery timeline">
        <div className="grid gap-3 sm:grid-cols-3">
          {DELIVERY_ZONES.map(({ zone, time, detail }) => (
            <div key={zone} className="border border-ivory-200 bg-ivory-50 p-5">
              <p className="text-xs uppercase tracking-[0.16em] text-champagne-700">
                {zone}
              </p>
              <p className="mt-2 font-medium text-charcoal-900">{time}</p>
              <p className="mt-2 text-sm text-charcoal-500">{detail}</p>
            </div>
          ))}
        </div>
        <p className="text-sm italic text-charcoal-500">
          Delivery times are estimates and may vary with courier delays, weather
          or other circumstances outside our control.
        </p>
      </PolicySection>

      <PolicySection title="Shipping charges">
        <div className="border border-ivory-200">
          <div className="flex items-center justify-between border-b border-ivory-200 px-5 py-4">
            <span>Orders below ₹2,999</span>
            <span className="font-medium text-charcoal-900">₹99</span>
          </div>
          <div className="flex items-center justify-between bg-ivory-50 px-5 py-4">
            <span>Orders of ₹2,999 and above</span>
            <span className="font-medium text-green-700">Free</span>
          </div>
        </div>
      </PolicySection>

      <PolicySection title="Tracking your order">
        <p>Once your order is dispatched, you will receive:</p>
        <ul>
          <li>A WhatsApp message with your courier and tracking number</li>
          <li>A tracking link so you can follow the delivery</li>
        </ul>
        <p>
          If you have not heard from us within two working days of placing your
          order, message us on WhatsApp at {PHONE_DISPLAY} and we will check on it
          for you.
        </p>
      </PolicySection>

      <PolicySection title="Packaging">
        <p>Every piece is packed to arrive safely:</p>
        <ul>
          <li>Gift box packaging</li>
          <li>Bubble wrap protection</li>
          <li>Tamper-proof seal</li>
          <li>Insured in transit</li>
        </ul>
      </PolicySection>

      <PolicySection title="Delivery partners">
        <p>We work with trusted courier partners including:</p>
        <ul>
          <li>Blue Dart</li>
          <li>DTDC</li>
          <li>Delhivery</li>
          <li>FedEx</li>
        </ul>
      </PolicySection>

      <PolicySection title="At the time of delivery">
        <ul>
          <li>Please make sure someone is available to receive the parcel</li>
          <li>Valid ID proof may be required</li>
          <li>Check the package for damage before accepting it</li>
          <li>If it is damaged, refuse delivery and contact us straight away</li>
        </ul>
      </PolicySection>

      <PolicySection title="Undelivered packages">
        <p>
          If delivery attempts fail because of an incorrect address or because
          nobody was available:
        </p>
        <ul>
          <li>The courier will attempt delivery three times</li>
          <li>The parcel is returned to us if delivery fails</li>
          <li>Return shipping charges apply if you would like it resent</li>
          <li>Any refund is processed after deducting return charges</li>
        </ul>
      </PolicySection>

      <PolicySection title="Need help?" divider>
        <p>For anything to do with shipping, reach us at:</p>
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
