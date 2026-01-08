"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone, User, Send, Loader2, CheckCircle, Gift } from "lucide-react";

interface LeadCapturePopupProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  source?: string;
}

export function LeadCapturePopup({
  isOpen,
  onClose,
  title = "Get Exclusive Offers",
  description = "Leave your details and get 10% off on your first purchase!",
  source = "POPUP",
}: LeadCapturePopupProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          source,
          message: `Lead from ${source} popup`,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit");
      }

      setStatus("success");
      
      // Store in localStorage to not show again
      localStorage.setItem("lead_captured", "true");

      setTimeout(() => {
        onClose();
        setStatus("idle");
        setFormData({ name: "", phone: "" });
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
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors z-10"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header with gradient */}
          <div className="bg-gradient-to-br from-powder-600 to-powder-700 px-6 pt-10 pb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4">
              <Gift className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
            <p className="text-powder-100">{description}</p>
          </div>

          {/* Form */}
          <div className="p-6">
            {status === "success" ? (
              <div className="text-center py-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-1">
                  Thank You!
                </h4>
                <p className="text-gray-600 text-sm">
                  We'll send you exclusive offers soon!
                </p>
              </div>
            ) : (
              <>
                {errorMessage && (
                  <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg mb-4 text-sm">
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-powder-500"
                        placeholder="Your Name"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-powder-500"
                        placeholder="Phone Number"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-gradient-to-r from-powder-600 to-powder-700 text-white rounded-xl font-semibold hover:from-powder-700 hover:to-powder-800 transition-all shadow-lg shadow-powder-500/30 flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Gift className="h-5 w-5" />
                        Get My Offer
                      </>
                    )}
                  </button>
                </form>

                <p className="text-xs text-gray-500 text-center mt-4">
                  No spam, we promise. Unsubscribe anytime.
                </p>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
