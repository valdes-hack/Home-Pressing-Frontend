"use client";

import { motion } from "framer-motion";
import { SERVICES } from "@/lib/data";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function ServicesGrid() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {SERVICES.map((s) => {
        const Icon = s.icon;
        return (
          <motion.article
            key={s.title}
            variants={item}
            whileHover={{ y: -10 }}
            className="glass group relative overflow-hidden rounded-3xl p-7"
          >
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-500/10 blur-2xl transition-all duration-500 group-hover:bg-brand-500/30" />
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.8 }}
              className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-400 to-brand-600 text-navy-950 shadow-lg shadow-brand-500/30"
            >
              <Icon className="h-7 w-7" />
            </motion.div>
            <h3 className="relative mt-6 font-display text-xl font-bold">{s.title}</h3>
            <p className="relative mt-2 text-sm leading-relaxed text-white/60">{s.desc}</p>
            <div className="relative mt-6 flex items-center justify-between border-t border-white/10 pt-4">
              <span className="text-sm font-semibold text-brand-400">{s.price}</span>
              <span className="text-xs text-white/40 transition-all group-hover:translate-x-1 group-hover:text-brand-400">
                En savoir plus →
              </span>
            </div>
          </motion.article>
        );
      })}
    </motion.div>
  );
}
