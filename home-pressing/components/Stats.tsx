"use client";

import { motion } from "framer-motion";
import Counter from "./Counter";
import { STATS } from "@/lib/data";

export default function Stats() {
  return (
    <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
      {STATS.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.12, type: "spring", stiffness: 140 }}
          whileHover={{ y: -6 }}
          className="glass rounded-3xl p-6 text-center"
        >
          <p className="font-display text-4xl font-extrabold text-gradient sm:text-5xl">
            <Counter value={s.value} suffix={s.suffix} />
          </p>
          <p className="mt-2 text-sm text-white/60">{s.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
