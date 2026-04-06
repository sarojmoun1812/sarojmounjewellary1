"use client";

import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from "lucide-react";
import { useState } from "react";
import { GoogleMap } from "@/components/google-map";
import { Reveal, StaggerReveal, StaggerItem } from "@/components/reveal";
import { revealLeft, revealRight } from "@/lib/motion";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setSubmitStatus("success");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });

      setTimeout(() => setSubmitStatus("idle"), 5000);
    } catch (err) {
      setSubmitStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong");
      setTimeout(() => setSubmitStatus("idle"), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-ivory-50 pt-24">
      <section className="section-padding luxury-mesh border-b border-ivory-200/70">
        <div className="container-luxury">
          <Reveal className="mx-auto max-w-3xl text-center">
            <div className="glass-light mx-auto mb-8 inline-flex items-center gap-2 rounded-full px-6 py-3">
              <MessageCircle className="h-4 w-4 text-champagne-600" />
              <span className="section-kicker text-champagne-700">Get in touch</span>
            </div>
            <h1 className="text-4xl font-heading font-light text-charcoal-950 md:text-6xl">Contact us</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-charcoal-600">
              Have questions about our jewellery? We&apos;re here to help.
            </p>
          </Reveal>
        </div>
      </section>

      <div className="container-luxury py-14 md:py-20">
        <StaggerReveal className="mb-14 grid gap-8 lg:grid-cols-3">
          <StaggerItem>
            <div className="elevated-card gradient-border h-full rounded-[1.75rem] p-8">
              <div className="glass-dark mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10">
                <Phone className="h-6 w-6 text-champagne-300" />
              </div>
              <h3 className="text-lg font-heading font-medium text-charcoal-900">Phone</h3>
              <p className="mt-2 text-sm text-charcoal-600">Call us for immediate assistance</p>
              <a href="tel:+918168790171" className="mt-4 inline-block font-medium text-champagne-700 hover:text-champagne-600">
                +91 81687 90171
              </a>
              <p className="mt-2 text-xs text-charcoal-500">Mon–Sat, 10 AM – 6 PM IST</p>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="elevated-card gradient-border h-full rounded-[1.75rem] p-8">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-champagne-200/80 bg-champagne-50">
                <Mail className="h-6 w-6 text-champagne-700" />
              </div>
              <h3 className="text-lg font-heading font-medium text-charcoal-900">Email</h3>
              <p className="mt-2 text-sm text-charcoal-600">Send us a detailed message</p>
              <a
                href="mailto:sarojmounjewellary@gmail.com"
                className="mt-4 inline-block font-medium text-champagne-700 hover:text-champagne-600 break-all"
              >
                sarojmounjewellary@gmail.com
              </a>
              <p className="mt-2 text-xs text-charcoal-500">Response within 24 hours</p>
            </div>
          </StaggerItem>
          <StaggerItem>
            <div className="elevated-card gradient-border h-full rounded-[1.75rem] p-8">
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-200/80 bg-emerald-50">
                <MessageCircle className="h-6 w-6 text-emerald-700" />
              </div>
              <h3 className="text-lg font-heading font-medium text-charcoal-900">WhatsApp</h3>
              <p className="mt-2 text-sm text-charcoal-600">Chat with us instantly</p>
              <a
                href="https://wa.me/918168790171"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block font-medium text-emerald-700 hover:text-emerald-600"
              >
                +91 81687 90171
              </a>
              <p className="mt-2 text-xs text-charcoal-500">Available 24/7</p>
            </div>
          </StaggerItem>
        </StaggerReveal>

        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal variants={revealLeft}>
            <div className="elevated-card gradient-border rounded-[2rem] p-8 md:p-12">
              <h2 className="text-2xl font-heading font-light text-charcoal-950">Send us a message</h2>
              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-charcoal-700">
                    Full name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-ivory-200 bg-white px-4 py-3 text-charcoal-900 transition-shadow focus:border-champagne-400 focus:outline-none focus:ring-2 focus:ring-champagne-500/30"
                    placeholder="Your name"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-charcoal-700">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-ivory-200 bg-white px-4 py-3 text-charcoal-900 focus:border-champagne-400 focus:outline-none focus:ring-2 focus:ring-champagne-500/30"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="mb-2 block text-sm font-medium text-charcoal-700">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-ivory-200 bg-white px-4 py-3 text-charcoal-900 focus:border-champagne-400 focus:outline-none focus:ring-2 focus:ring-champagne-500/30"
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="mb-2 block text-sm font-medium text-charcoal-700">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-ivory-200 bg-white px-4 py-3 text-charcoal-900 focus:border-champagne-400 focus:outline-none focus:ring-2 focus:ring-champagne-500/30"
                  >
                    <option value="">Select a subject</option>
                    <option value="product-inquiry">Product inquiry</option>
                    <option value="order-status">Order status</option>
                    <option value="custom-order">Custom order</option>
                    <option value="returns">Returns &amp; refunds</option>
                    <option value="wholesale">Wholesale inquiry</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-medium text-charcoal-700">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full resize-none rounded-xl border border-ivory-200 bg-white px-4 py-3 text-charcoal-900 focus:border-champagne-400 focus:outline-none focus:ring-2 focus:ring-champagne-500/30"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-charcoal-900 py-4 font-medium text-ivory-50 transition-colors hover:bg-charcoal-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send message
                      <Send className="h-5 w-5" />
                    </>
                  )}
                </button>

                {submitStatus === "success" && (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800">
                    Message sent successfully. We&apos;ll get back to you soon.
                  </div>
                )}

                {submitStatus === "error" && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-800">
                    {errorMessage || "Failed to send message. Please try again or contact us directly."}
                  </div>
                )}
              </form>
            </div>
          </Reveal>

          <Reveal variants={revealRight} className="space-y-8">
            <div className="elevated-card rounded-[2rem] p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-champagne-200/80 bg-champagne-50">
                  <MapPin className="h-6 w-6 text-champagne-700" />
                </div>
                <div>
                  <h3 className="text-xl font-heading font-light text-charcoal-950">Visit our studio</h3>
                  <p className="mt-2 text-charcoal-600">
                    B-90, Police Line
                    <br />
                    Jind, Haryana - 126102
                    <br />
                    India
                  </p>
                </div>
              </div>

              <div className="mt-8 flex items-start gap-4 border-t border-ivory-200 pt-8">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-ivory-200 bg-ivory-100">
                  <Clock className="h-6 w-6 text-charcoal-700" />
                </div>
                <div>
                  <h3 className="text-xl font-heading font-light text-charcoal-950">Business hours</h3>
                  <div className="mt-2 space-y-1 text-charcoal-600">
                    <p>
                      <strong className="text-charcoal-800">Monday – Friday:</strong> 10:00 AM – 6:00 PM
                    </p>
                    <p>
                      <strong className="text-charcoal-800">Saturday:</strong> 10:00 AM – 4:00 PM
                    </p>
                    <p>
                      <strong className="text-charcoal-800">Sunday:</strong> Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-ivory-200/80 shadow-lg">
              <GoogleMap
                address="B-90 Police Colony, Jind, Haryana 126102, India"
                latitude={29.3159}
                longitude={76.3234}
                height="300px"
                showInfoCard={false}
              />
            </div>

            <div className="rounded-[2rem] border border-champagne-300/40 bg-gradient-to-br from-charcoal-900 to-charcoal-950 p-8 text-ivory-50 shadow-xl">
              <h3 className="text-2xl font-heading font-light">Quick questions?</h3>
              <p className="mt-3 text-ivory-100/75">
                Check our FAQ for instant answers about orders, shipping, returns, and more.
              </p>
              <a
                href="/faq"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-ivory-50 px-6 py-3 text-sm font-medium text-charcoal-900 transition-colors hover:bg-champagne-200"
              >
                View FAQ
                <Send className="h-4 w-4" />
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
