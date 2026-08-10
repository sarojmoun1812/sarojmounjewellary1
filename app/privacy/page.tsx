"use client";

import { Shield } from "lucide-react";
import { PolicyLayout, PolicySection } from "@/components/policy-layout";
import { ADDRESS_ONE_LINE, CONTACT_EMAIL, PHONE_DISPLAY } from "@/lib/constants";

export default function PrivacyPolicyPage() {
  return (
    <PolicyLayout
      kicker="Your Privacy Matters"
      icon={Shield}
      title="Privacy Policy"
      updated="December 24, 2025"
    >
      <PolicySection title="1. Information We Collect">
        <p>
          At Saroj Moun Jewellery, we collect information that you provide
          directly to us when you:
        </p>
        <ul>
          <li>Place an order or send an enquiry over WhatsApp</li>
          <li>Contact us for customer support</li>
          <li>Subscribe to our newsletter</li>
        </ul>
        <p>
          <strong>Personal Information:</strong> Name, email address, phone
          number and shipping address. We do not take card or online payments
          through this website, so we never collect or store your card, UPI or
          bank details.
        </p>
      </PolicySection>

      <PolicySection title="2. How We Use Your Information">
        <p>We use the information we collect to:</p>
        <ul>
          <li>Process and fulfil your orders</li>
          <li>
            Communicate with you about your orders and provide customer support
          </li>
          <li>Send you promotional emails (with your consent)</li>
          <li>Improve our website and services</li>
          <li>Detect and prevent fraud or abuse</li>
        </ul>
      </PolicySection>

      <PolicySection title="3. Information Sharing">
        <p>
          We do not sell or rent your personal information to third parties. We
          may share your information with:
        </p>
        <ul>
          <li>
            <strong>WhatsApp:</strong> Orders are placed and confirmed over
            WhatsApp, which is operated by Meta
          </li>
          <li>
            <strong>Shipping partners:</strong> Courier services for order
            delivery
          </li>
          <li>
            <strong>Service providers:</strong> Companies that help us operate
            our business
          </li>
          <li>
            <strong>Legal requirements:</strong> When required by law or to
            protect our rights
          </li>
        </ul>
      </PolicySection>

      <PolicySection title="4. Data Security">
        <p>
          We implement appropriate security measures to protect your personal
          information from unauthorised access, alteration, disclosure or
          destruction. This website is served over HTTPS, and we do not collect
          or store card or bank details at any point.
        </p>
      </PolicySection>

      <PolicySection title="5. Cookies">
        <p>
          We use cookies and similar technologies to enhance your browsing
          experience, analyse site traffic and personalise content. You can
          control cookies through your browser settings.
        </p>
      </PolicySection>

      <PolicySection title="6. Your Rights">
        <p>You have the right to:</p>
        <ul>
          <li>Access your personal information</li>
          <li>Correct inaccurate information</li>
          <li>Request deletion of your information</li>
          <li>Opt out of marketing communications</li>
          <li>Object to processing of your information</li>
        </ul>
      </PolicySection>

      <PolicySection title="7. Children's Privacy">
        <p>
          Our services are not directed to children under 18. We do not
          knowingly collect personal information from children.
        </p>
      </PolicySection>

      <PolicySection title="8. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. We will notify
          you of any changes by posting the new policy on this page and updating
          the &quot;Last updated&quot; date.
        </p>
      </PolicySection>

      <PolicySection title="Contact Us" divider>
        <p>
          If you have any questions about this Privacy Policy, please contact us:
        </p>
        <div className="space-y-1">
          <p>
            <strong>Email:</strong> {CONTACT_EMAIL}
          </p>
          <p>
            <strong>Phone / WhatsApp:</strong> {PHONE_DISPLAY}
          </p>
          <p>
            <strong>Address:</strong> {ADDRESS_ONE_LINE}
          </p>
        </div>
      </PolicySection>
    </PolicyLayout>
  );
}
