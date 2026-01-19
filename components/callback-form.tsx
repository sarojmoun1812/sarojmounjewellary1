"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, User, Clock, Loader2, CheckCircle, X } from "lucide-react";

interface CallbackFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CallbackForm({ isOpen, onClose }: CallbackFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    preferredTime: "morning",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          source: "CALLBACK_REQUEST",
          message: `Callback requested for ${formData.preferredTime}`,
        }),
      });

      if (!res.ok) throw new Error("Failed");

      setStatus("success");
      setTimeout(() => {
        onClose();
        setStatus("idle");
        setFormData({ name: "", phone: "", preferredTime: "morning" });
      }, 3000);
    } catch {
      setStatus("error");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-charcoal-900/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-charcoal-400 hover:text-charcoal-600 rounded-full transition-colors z-10"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="bg-gradient-to-br from-champagne-500 to-champagne-600 px-6 pt-8 pb-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4">
            <Phone className="h-8 w-8 text-charcoal-900" />
          </div>
          <h3 className="text-2xl font-heading font-light text-charcoal-900 mb-1">
            Request a Callback
          </h3>
          <p className="text-charcoal-700 text-sm">
            We&apos;ll call you back within 2 hours
          </p>
        </div>

        <div className="p-6">
          {status === "success" ? (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 rounded-full mb-4">
                <CheckCircle className="h-7 w-7 text-green-600" />
              </div>
              <h4 className="text-lg font-bold text-charcoal-900 mb-2">
                Request Received!
              </h4>
              <p className="text-charcoal-600">
                Our team will call you shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-2">
                  Your Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-charcoal-400" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 border border-charcoal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-champagne-500"
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-charcoal-400" />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 border border-charcoal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-champagne-500"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal-700 mb-2">
                  Preferred Time
                </label>
                <div className="relative">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-charcoal-400" />
                  <select
                    value={formData.preferredTime}
                    onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 border border-charcoal-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-champagne-500 appearance-none bg-white"
                  >
                    <option value="morning">Morning (10 AM - 12 PM)</option>
                    <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                    <option value="evening">Evening (4 PM - 6 PM)</option>
                    <option value="asap">Call me ASAP</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-charcoal-900 text-ivory-50 rounded-xl font-semibold hover:bg-charcoal-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Phone className="h-5 w-5" />
                    Request Callback
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}

