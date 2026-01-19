"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, Phone, User, Loader2, CheckCircle, Percent } from "lucide-react";

export function ExitIntentPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  useEffect(() => {
    // Check if already shown
    const hasShown = localStorage.getItem("exit_popup_shown");
    if (hasShown) return;

    let triggered = false;

    const handleMouseLeave = (e: MouseEvent) => {
      // Detect exit intent (mouse leaving viewport from top)
      if (e.clientY <= 0 && !triggered) {
        triggered = true;
        setIsOpen(true);
        localStorage.setItem("exit_popup_shown", "true");
      }
    };

    // Also trigger on mobile after 30 seconds
    const mobileTimer = setTimeout(() => {
      if (window.innerWidth < 768 && !triggered) {
        triggered = true;
        setIsOpen(true);
        localStorage.setItem("exit_popup_shown", "true");
      }
    }, 30000);

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      clearTimeout(mobileTimer);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          source: "EXIT_INTENT",
          message: "User was about to leave - captured via exit intent popup",
        }),
      });

      if (!res.ok) throw new Error("Failed");

      setStatus("success");
      localStorage.setItem("lead_captured", "true");

      setTimeout(() => {
        setIsOpen(false);
      }, 3000);
    } catch {
      setStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-charcoal-900/70 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-2 text-charcoal-400 hover:text-charcoal-600 hover:bg-charcoal-100 rounded-full transition-colors z-10"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Header with gradient */}
          <div className="bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-900 px-8 pt-10 pb-8 text-center relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-champagne-500/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-champagne-500/10 rounded-full translate-x-1/2 translate-y-1/2" />
            
            <div className="relative">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-champagne-400 to-champagne-600 rounded-2xl mb-4 shadow-lg">
                <Percent className="h-10 w-10 text-charcoal-900" />
              </div>
              <h3 className="text-3xl font-heading font-light text-ivory-50 mb-2">
                Wait! Don&apos;t Go!
              </h3>
              <p className="text-champagne-400 text-lg font-medium">
                Get ₹500 OFF your first order
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {status === "success" ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-4"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="text-xl font-bold text-charcoal-900 mb-2">
                  Your Coupon is Ready!
                </h4>
                <p className="text-charcoal-600 mb-4">
                  We&apos;ve sent your exclusive discount code via WhatsApp.
                </p>
                <div className="bg-champagne-100 rounded-xl p-4">
                  <p className="text-sm text-charcoal-600 mb-1">Your coupon code:</p>
                  <p className="text-2xl font-bold text-champagne-600">WELCOME500</p>
                </div>
              </motion.div>
            ) : (
              <>
                <p className="text-charcoal-600 text-center mb-6">
                  Share your details and get an exclusive discount on handcrafted silver jewellery!
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-charcoal-400" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 border border-charcoal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-champagne-500 focus:border-transparent"
                      placeholder="Your Name"
                    />
                  </div>

                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-charcoal-400" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-12 pr-4 py-4 border border-charcoal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-champagne-500 focus:border-transparent"
                      placeholder="WhatsApp Number"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-gradient-to-r from-champagne-500 to-champagne-600 text-charcoal-900 rounded-xl font-bold text-lg hover:from-champagne-600 hover:to-champagne-700 transition-all shadow-lg shadow-champagne-500/30 flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Gift className="h-5 w-5" />
                        Claim My ₹500 OFF
                      </>
                    )}
                  </button>
                </form>

                <p className="text-xs text-charcoal-400 text-center mt-4">
                  By continuing, you agree to receive updates via WhatsApp. No spam, promise!
                </p>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

