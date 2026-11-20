"use client";

import { motion } from "framer-motion";
import { STEPS } from "@/lib/data";

export default function ProcessSteps() {
  return (
    <div className="relative grid gap-6 md:grid-cols-4">
      {/* Ligne de connexion animée */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: "easeInOut" }}
        className="absolute left-[12%] right-[12%] top-9 hidden h-px origin-left bg-gradient-to-r from-navy-400 via-brand-500 to-navy-400 md:block"
      />
      {STEPS.map((s, i) => (
        <motion.div
          key={s.n}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ delay: i * 0.18, duration: 0.7 }}
          className="relative text-center"
        >
          <motion.div
            whileHover={{ scale: 1.15, rotate: 6 }}
            className="relative mx-auto flex h-[72px] w-[72px] items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 font-display text-xl font-extrabold text-navy-950 shadow-xl shadow-brand-500/30"
          >
            <span className="absolute inset-0 animate-pulseRing rounded-full bg-brand-500/30" />
            <span className="relative">{s.n}</span>
          </motion.div>
          <h3 className="mt-5 font-display text-lg font-bold">{s.title}</h3>
          <p className="mx-auto mt-2 max-w-[240px] text-sm leading-relaxed text-white/60">
            {s.desc}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
