"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { TESTIMONIALS } from "@/lib/data";

/** Carrousel de témoignages (défilement automatique + points cliquables). */
export default function Testimonials() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % TESTIMONIALS.length), 5500);
    return () => clearInterval(t);
  }, []);

  const t = TESTIMONIALS[i];

  return (
    <div className="mx-auto max-w-3xl">
      <div className="glass-strong relative min-h-[260px] overflow-hidden rounded-[2rem] p-8 sm:p-12">
        <Quote className="absolute right-6 top-6 h-14 w-14 text-brand-500/20" />
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.45 }}
          >
            <div className="flex gap-1 text-brand-500">
              {Array.from({ length: 5 }).map((_, k) => (
                <Star key={k} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="mt-5 text-lg leading-relaxed sm:text-xl">&ldquo;{t.text}&rdquo;</p>
            <div className="mt-6 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 font-bold text-navy-950">
                {t.name[0]}
              </span>
              <div>
                <p className="font-semibold">{t.name}</p>
                <p className="text-sm text-white/50">{t.role}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mt-6 flex justify-center gap-2">
        {TESTIMONIALS.map((_, k) => (
          <button
            key={k}
            aria-label={`Témoignage ${k + 1}`}
            onClick={() => setI(k)}
            className={`h-2 rounded-full transition-all duration-300 ${
              k === i ? "w-8 bg-brand-500" : "w-2 bg-white/25 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
