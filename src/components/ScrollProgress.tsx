"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Barre de progression de lecture en haut de page. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed left-0 right-0 top-0 z-[70] h-1 origin-left bg-gradient-to-r from-navy-400 via-brand-500 to-brand-400"
    />
  );
}
