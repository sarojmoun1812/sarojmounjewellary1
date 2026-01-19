"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, MessageCircle, X, ChevronUp, Sparkles } from "lucide-react";

export function FloatingCTA() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // WhatsApp config
  const whatsappNumber = "918168790171";
  const defaultMessage = "Hi! I'm interested in your silver jewellery collection.";

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleWhatsApp = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(defaultMessage)}`;
    window.open(url, "_blank");
  };

  const handleCall = () => {
    window.location.href = "tel:+918168790171";
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Scroll to top */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={scrollToTop}
              className="w-12 h-12 bg-charcoal-800 hover:bg-charcoal-900 text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
              aria-label="Scroll to top"
            >
              <ChevronUp className="h-5 w-5" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Expanded Menu */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              className="flex flex-col gap-3"
            >
              {/* Call Button */}
              <motion.button
                initial={{ x: 50 }}
                animate={{ x: 0 }}
                transition={{ delay: 0.1 }}
                onClick={handleCall}
                className="flex items-center gap-3 bg-champagne-500 hover:bg-champagne-600 text-charcoal-900 px-5 py-3 rounded-full shadow-lg transition-colors"
              >
                <Phone className="h-5 w-5" />
                <span className="font-semibold text-sm">Call Now</span>
              </motion.button>

              {/* WhatsApp Button */}
              <motion.button
                initial={{ x: 50 }}
                animate={{ x: 0 }}
                onClick={handleWhatsApp}
                className="flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-full shadow-lg transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                <span className="font-semibold text-sm">WhatsApp</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Toggle Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${
            isExpanded
              ? "bg-charcoal-800 text-white"
              : "bg-gradient-to-br from-champagne-500 to-champagne-600 text-charcoal-900"
          }`}
          aria-label={isExpanded ? "Close menu" : "Contact options"}
        >
          <AnimatePresence mode="wait">
            {isExpanded ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
              >
                <X className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div
                key="sparkle"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
              >
                <Sparkles className="h-6 w-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Pulse effect when closed */}
        {!isExpanded && (
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-0 right-0 w-14 h-14 bg-champagne-400 rounded-full pointer-events-none"
          />
        )}
      </div>

      {/* Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg md:hidden">
        <div className="grid grid-cols-2 gap-0">
          <button
            onClick={handleCall}
            className="flex items-center justify-center gap-2 py-4 bg-champagne-500 text-charcoal-900 font-semibold"
          >
            <Phone className="h-5 w-5" />
            Call Now
          </button>
          <button
            onClick={handleWhatsApp}
            className="flex items-center justify-center gap-2 py-4 bg-green-500 text-white font-semibold"
          >
            <MessageCircle className="h-5 w-5" />
            WhatsApp
          </button>
        </div>
      </div>
    </>
  );
}

