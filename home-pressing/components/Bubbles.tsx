"use client";

import { useEffect, useState } from "react";

type Bubble = {
  left: number;
  size: number;
  delay: number;
  duration: number;
  hue: "blue" | "orange";
};

/** Bulles de savon qui montent en arrière-plan (générées côté client pour éviter les erreurs d'hydratation). */
export default function Bubbles() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    setBubbles(
      Array.from({ length: 22 }, (_, i) => ({
        left: Math.random() * 100,
        size: 10 + Math.random() * 42,
        delay: -Math.random() * 20,
        duration: 12 + Math.random() * 16,
        hue: i % 5 === 0 ? "orange" : "blue",
      }))
    );
  }, []);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {bubbles.map((b, i) => (
        <span
          key={i}
          className="absolute bottom-[-60px] animate-rise rounded-full"
          style={{
            left: `${b.left}%`,
            width: b.size,
            height: b.size,
            animationDelay: `${b.delay}s`,
            animationDuration: `${b.duration}s`,
            background:
              b.hue === "orange"
                ? "radial-gradient(circle at 30% 30%, rgba(255,200,120,0.55), rgba(255,154,26,0.08) 60%, transparent 70%)"
                : "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.5), rgba(79,127,224,0.12) 60%, transparent 70%)",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "inset 0 0 12px rgba(255,255,255,0.08)",
          }}
        />
      ))}
    </div>
  );
}
