"use client";

import { motion } from "framer-motion";

export default function PageHeader({
  eyebrow,
  title,
  highlight,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  highlight: string;
  subtitle: string;
}) {
  return (
    <section className="relative mx-auto max-w-7xl px-5 pb-6 pt-16 text-center sm:px-8 md:pt-24">
      <motion.span
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="eyebrow"
      >
        {eyebrow}
      </motion.span>
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.7 }}
        className="mx-auto mt-6 max-w-3xl font-display text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl"
      >
        {title} <span className="text-gradient">{highlight}</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.7 }}
        className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg"
      >
        {subtitle}
      </motion.p>
    </section>
  );
}
