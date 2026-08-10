"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, Mail, Send, Loader2, CheckCircle, MessageSquare } from "lucide-react";

interface ProductInquiryFormProps {
  productId: string;
  productName: string;
  isOpen: boolean;
  onClose: () => void;
}

const inquiryFieldClass =
  "w-full border border-ivory-300 bg-white px-4 py-3 text-charcoal-900 placeholder:text-charcoal-300 focus:border-charcoal-900 focus:outline-none focus:ring-1 focus:ring-charcoal-900";

const inquiryLabelClass =
  "mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-charcoal-600";

export function ProductInquiryForm({
  productId,
  productName,
  isOpen,
  onClose,
}: ProductInquiryFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/product-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          ...formData,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit inquiry");
      }

      setStatus("success");
      setFormData({ name: "", email: "", phone: "", message: "" });

      setTimeout(() => {
        onClose();
        setStatus("idle");
      }, 3000);
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white p-7 shadow-2xl"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 p-2 text-charcoal-400 transition-colors can-hover:hover:text-charcoal-900"
          >
            <X className="h-5 w-5" />
          </button>

          {status === "success" ? (
            <div className="py-8 text-center">
              <div className="mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center rounded-full bg-champagne-100">
                <CheckCircle className="h-7 w-7 text-champagne-600" strokeWidth={1.5} />
              </div>
              <h3 className="font-heading text-xl font-light text-charcoal-900">
                Aapka sawaal mil gaya
              </h3>
              <p className="mt-2 text-charcoal-500">
                &quot;{productName}&quot; ke baare mein hum aapse jaldi baat
                karenge.
              </p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="mb-6">
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center bg-champagne-100">
                  <MessageSquare className="h-5 w-5 text-champagne-600" strokeWidth={1.5} />
                </div>
                <h3 className="font-heading text-xl font-light text-charcoal-900">
                  Is piece ke baare mein poochhein
                </h3>
                <p className="mt-1 text-sm text-charcoal-500">{productName}</p>
              </div>

              {errorMessage && (
                <div className="mb-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="inquiry-name" className={inquiryLabelClass}>
                    Aapka naam *
                  </label>
                  <input
                    id="inquiry-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={inquiryFieldClass}
                    placeholder="Aapka naam"
                  />
                </div>

                <div>
                  <label htmlFor="inquiry-phone" className={inquiryLabelClass}>
                    Phone number *
                  </label>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" strokeWidth={1.5} />
                    <input
                      id="inquiry-phone"
                      type="tel"
                      inputMode="numeric"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className={`${inquiryFieldClass} pl-10`}
                      placeholder="10 digit mobile number"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="inquiry-email" className={inquiryLabelClass}>
                    Email (optional)
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400" strokeWidth={1.5} />
                    <input
                      id="inquiry-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className={`${inquiryFieldClass} pl-10`}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="inquiry-message" className={inquiryLabelClass}>
                    Message (optional)
                  </label>
                  <textarea
                    id="inquiry-message"
                    rows={3}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className={`${inquiryFieldClass} resize-none`}
                    placeholder="Size, design ya koi aur sawaal?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full items-center justify-center gap-2 bg-charcoal-900 px-6 py-3.5 text-sm font-medium uppercase tracking-[0.18em] text-ivory-50 transition-colors can-hover:hover:bg-charcoal-800 disabled:cursor-not-allowed disabled:bg-charcoal-300"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Bheja ja raha hai…
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Sawaal Bhejein
                    </>
                  )}
                </button>
              </form>

              {/* Says "soon" rather than a fixed window: this is a one-person
                  shop and nothing here enforces a 24-hour reply. */}
              <p className="mt-4 text-center text-xs text-charcoal-500">
                Hum aapse WhatsApp par jaldi sampark karenge.
              </p>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
