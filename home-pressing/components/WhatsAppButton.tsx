"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { BRAND } from "@/lib/data";

/** Bouton flottant WhatsApp avec halo pulsant. */
export default function WhatsAppButton() {
  return (
    <motion.a
      href={`https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(
        "Bonjour Home Pressing, j'aimerais avoir des informations."
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Écrire sur WhatsApp"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.2, type: "spring", stiffness: 260, damping: 18 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.92 }}
      className="fixed bottom-6 right-6 z-[60] flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xl shadow-emerald-500/40"
    >
      <span className="absolute inset-0 animate-pulseRing rounded-full bg-emerald-400/60" />
      <MessageCircle className="relative h-6 w-6" />
    </motion.a>
  );
}
