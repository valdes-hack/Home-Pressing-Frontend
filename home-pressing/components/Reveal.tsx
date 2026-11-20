"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  className?: string;
  once?: boolean;
};

const offsets = {
  up: { y: 40, x: 0 },
  down: { y: -40, x: 0 },
  left: { x: 50, y: 0 },
  right: { x: -50, y: 0 },
  none: { x: 0, y: 0 },
};

/** Fait apparaître son contenu en douceur à l'entrée dans l'écran. */
export default function Reveal({
  children,
  delay = 0,
  direction = "up",
  className,
  once = true,
}: Props) {
  const variants: Variants = {
    hidden: { opacity: 0, ...offsets[direction], filter: "blur(6px)" },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-80px" }}
    >
      {children}
    </motion.div>
  );
}
