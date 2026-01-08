"use client";

import { useState } from "react";
import { Mail, Send, CheckCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to subscribe");
      }

      setStatus("success");
      setMessage("Thanks for subscribing! 🎉");
      setEmail("");
      
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 5000);
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong");
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 5000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-powder-600 to-powder-700 rounded-2xl p-8 md:p-12">
      <div className="max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
          <Mail className="h-8 w-8 text-white" />
        </div>
        <h3 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4">
          Stay Updated with Our Latest Collections
        </h3>
        <p className="text-powder-100 mb-8">
          Subscribe to get exclusive offers, new product launches, and silver rate updates.
        </p>

        <AnimatePresence mode="wait">
          {status === "success" ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-2 text-white"
            >
              <CheckCircle className="h-6 w-6" />
              <span className="text-lg font-medium">{message}</span>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder:text-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 bg-white text-powder-700 rounded-xl font-semibold hover:bg-powder-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    Subscribe
                  </>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {status === "error" && message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-200 mt-3"
          >
            {message}
          </motion.p>
        )}

        <p className="text-powder-200 text-sm mt-4">
          No spam, ever. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}
