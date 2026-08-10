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
      setMessage("Shukriya! Aap subscribe ho gaye hain.");
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

  // Form only: the section that hosts this already supplies the heading and the
  // pitch, so anything more here reads as a duplicate.
  return (
    <div className="max-w-xl">
      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-charcoal-900"
          >
            <CheckCircle className="h-5 w-5 text-champagne-600" />
            <span className="font-medium">{message}</span>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <div className="relative flex-1">
              <Mail
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-400"
                strokeWidth={1.5}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="aapka@email.com"
                required
                aria-label="Email address"
                className="w-full border border-ivory-300 bg-white py-3.5 pl-11 pr-4 text-charcoal-900 placeholder:text-charcoal-300 focus:border-charcoal-900 focus:outline-none focus:ring-1 focus:ring-charcoal-900"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center gap-2 bg-charcoal-900 px-8 py-3.5 text-sm font-medium uppercase tracking-[0.18em] text-ivory-50 transition-colors can-hover:hover:bg-charcoal-800 disabled:cursor-not-allowed disabled:bg-charcoal-300"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Send className="h-4 w-4" />
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
          className="mt-3 text-sm text-red-600"
        >
          {message}
        </motion.p>
      )}

      <p className="mt-4 text-xs text-charcoal-500">
        Koi spam nahi. Jab chahein unsubscribe kar sakte hain.
      </p>
    </div>
  );
}
