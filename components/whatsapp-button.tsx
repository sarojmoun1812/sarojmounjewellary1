"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);

  // WhatsApp number
  const whatsappNumber = "918168790171"; // Format: country code + number without + or spaces
  const defaultMessage = "Hi! I'm interested in your silver jewellery collection.";

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(defaultMessage);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <>
      {/* Floating Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5, type: "spring" }}
        className="fixed bottom-6 right-6 z-50"
      >
        <button
          onClick={handleWhatsAppClick}
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          className="group relative bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center overflow-hidden"
          aria-label="Chat on WhatsApp"
        >
          {/* Button with Icon */}
          <div className="flex items-center gap-3 px-5 py-4">
            <MessageCircle className="h-6 w-6 animate-bounce" />
            <AnimatePresence>
              {isOpen && (
                <motion.span
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="font-semibold text-sm whitespace-nowrap overflow-hidden"
                >
                  Chat with us
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Ripple Effect */}
          <span className="absolute inset-0 rounded-full bg-green-400 opacity-0 group-hover:opacity-30 group-hover:animate-ping"></span>
        </button>

        {/* Tooltip/Popup */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-full right-0 mb-4 bg-white rounded-2xl shadow-2xl p-4 w-64"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">Saroj Moun</h4>
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      Online now
                    </p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Hi! 👋 Need help choosing the perfect piece? Chat with us now!
              </p>
              <button
                onClick={handleWhatsAppClick}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold text-sm transition-colors"
              >
                Start Chat
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Pulsing Ring Effect */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="fixed bottom-6 right-6 w-[68px] h-[68px] bg-green-400 rounded-full z-40 pointer-events-none"
      />
    </>
  );
}
