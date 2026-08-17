"use client";

import { FileText } from "lucide-react";
import Link from "next/link";
import { PolicyLayout, PolicySection } from "@/components/policy-layout";
import { CONTACT_EMAIL, PHONE_DISPLAY } from "@/lib/constants";

export default function TermsPage() {
  return (
    <PolicyLayout
      kicker="Legal Terms"
      icon={FileText}
      title="Terms & Conditions"
      updated="December 24, 2025"
    >
      <PolicySection title="1. Acceptance of Terms">
        <p>
          By accessing and using the Saroj Moun Jewellery website, you accept and
          agree to be bound by these Terms and Conditions. If you do not agree to
          these terms, please do not use our website or services.
        </p>
      </PolicySection>

      <PolicySection title="2. Products and Pricing">
        <ul>
          <li>
            All jewellery is handcrafted 925 silver with hallmark certification
          </li>
          <li>Prices follow the current silver rate and may change daily</li>
          <li>
            Product images are for reference; actual pieces may vary slightly
          </li>
          <li>We reserve the right to modify prices without prior notice</li>
          <li>
            The final price is confirmed when we accept your order on WhatsApp
          </li>
        </ul>
      </PolicySection>

      <PolicySection title="3. Orders and Payment">
        <p>
          <strong>Order acceptance:</strong>
        </p>
        <ul>
          <li>All orders are subject to availability and confirmation</li>
          <li>We reserve the right to refuse or cancel any order</li>
          <li>Orders are placed and confirmed over WhatsApp</li>
        </ul>
        <p>
          <strong>Payment:</strong>
        </p>
        <ul>
          <li>No payment is taken on this website</li>
          <li>
            Once we confirm your order on WhatsApp, we will agree the payment
            method and amount with you directly
          </li>
          <li>
            Prices shown are based on the current silver rate and are confirmed
            at the time we accept your order
          </li>
        </ul>
      </PolicySection>

      <PolicySection title="4. Shipping and Delivery">
        <ul>
          <li>We ship across India via trusted courier partners</li>
          <li>
            Delivery timeline: 5–7 business days to metro cities, 7–10 days
            elsewhere
          </li>
          <li>Shipping is ₹99, free on orders of ₹2,999 and above</li>
          <li>Orders are insured during transit</li>
        </ul>
      </PolicySection>

      <PolicySection title="5. Returns and Exchanges">
        <p>
          Please see our{" "}
          <Link href="/return-policy">Return &amp; Refund Policy</Link> for full
          details.
        </p>
        <ul>
          <li>Faulty, damaged or wrong pieces can be returned after WhatsApp approval</li>
          <li>Pieces must be unused and in their original packaging</li>
          <li>Customised or engraved items cannot be returned</li>
        </ul>
      </PolicySection>

      <PolicySection title="6. Product Care and Warranty">
        <ul>
          <li>6-month warranty against manufacturing defects</li>
          <li>Store in a cool, dry place when not in use</li>
          <li>Avoid contact with water, perfumes and chemicals</li>
          <li>Clean with a soft cloth regularly</li>
        </ul>
      </PolicySection>

      <PolicySection title="7. Intellectual Property">
        <p>
          All content on this website, including text, images, logos and designs,
          is the property of Saroj Moun Jewellery and protected by copyright law.
          Unauthorised use is prohibited.
        </p>
      </PolicySection>

      <PolicySection title="8. Limitation of Liability">
        <p>
          Saroj Moun Jewellery shall not be liable for any indirect, incidental
          or consequential damages arising from the use of our website or
          products.
        </p>
      </PolicySection>

      <PolicySection title="9. Governing Law">
        <p>
          These Terms and Conditions are governed by the laws of India. Any
          disputes shall be subject to the exclusive jurisdiction of the courts
          in Jind, Haryana.
        </p>
      </PolicySection>

      <PolicySection title="Contact Us" divider>
        <p>For any questions regarding these Terms &amp; Conditions:</p>
        <div className="space-y-1">
          <p>
            <strong>Email:</strong> {CONTACT_EMAIL}
          </p>
          <p>
            <strong>Phone / WhatsApp:</strong> {PHONE_DISPLAY}
          </p>
        </div>
      </PolicySection>
    </PolicyLayout>
  );
}
