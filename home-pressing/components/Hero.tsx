"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, BellRing, MapPin, ShieldCheck, Sparkles } from "lucide-react";

const words = ["Votre", "linge", "mérite", "le", "meilleur", "soin."];

export default function Hero() {
  // Effet parallaxe 3D du logo suivant la souris
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 16 });
  const sy = useSpring(my, { stiffness: 80, damping: 16 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [-14, 14]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [12, -12]);

  return (
    <section
      className="relative mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-10 px-5 py-14 sm:px-8 lg:grid-cols-2"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      <div>
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="eyebrow"
        >
          <Sparkles className="h-3.5 w-3.5" /> Pressing professionnel · Yaoundé
        </motion.span>

        <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.05] sm:text-6xl xl:text-7xl">
          {words.map((w, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 40, rotateX: -60 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ delay: 0.15 + i * 0.09, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className={`mr-3 inline-block ${i >= 4 ? "text-gradient" : ""}`}
            >
              {w}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-6 max-w-xl text-lg leading-relaxed text-white/70"
        >
          Lavage à sec, lavage à l&apos;eau et repassage dans nos 6 agences.
          Déposez, suivez, récupérez : vous recevez un SMS dès que votre
          commande est prête.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.05 }}
          className="mt-9 flex flex-wrap gap-4"
        >
          <Link href="/localisation" className="btn-primary group">
            Trouver une agence
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link href="/services" className="btn-ghost">
            Découvrir nos services
          </Link>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm text-white/60"
        >
          {[
            { i: ShieldCheck, t: "État des vêtements constaté" },
            { i: BellRing, t: "SMS automatique" },
            { i: MapPin, t: "6 agences" },
          ].map(({ i: Icon, t }) => (
            <li key={t} className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-brand-500" /> {t}
            </li>
          ))}
        </motion.ul>
      </div>

      {/* Visuel logo */}
      <div className="relative flex items-center justify-center [perspective:1200px]">
        <div className="absolute h-[420px] w-[420px] rounded-full bg-brand-500/20 blur-[100px]" />
        <div className="absolute h-[360px] w-[360px] animate-spinSlow rounded-full border border-dashed border-white/15" />
        <div className="absolute h-[470px] w-[470px] animate-spinSlow rounded-full border border-white/5 [animation-direction:reverse]" />

        <motion.div
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          initial={{ opacity: 0, scale: 0.6, rotate: -12 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, duration: 1, type: "spring", bounce: 0.35 }}
          className="relative"
        >
          <div className="animate-float">
            <div className="relative h-72 w-72 overflow-hidden rounded-[3rem] shadow-[0_30px_90px_-10px_rgba(36,89,196,0.7)] ring-1 ring-white/20 sm:h-96 sm:w-96">
              <Image
                src="/logo.png"
                alt="Logo Home Pressing"
                fill
                sizes="384px"
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Cartes flottantes */}
          <motion.div
            style={{ translateZ: 60 }}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 }}
            className="glass-strong absolute -left-6 top-10 hidden items-center gap-3 rounded-2xl px-4 py-3 sm:flex"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
              <BellRing className="h-4 w-4" />
            </span>
            <div className="text-xs">
              <p className="font-semibold">Commande prête !</p>
              <p className="text-white/50">SMS envoyé à l&apos;instant</p>
            </div>
          </motion.div>

          <motion.div
            style={{ translateZ: 80 }}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.4 }}
            className="glass-strong absolute -right-4 bottom-12 hidden items-center gap-3 rounded-2xl px-4 py-3 sm:flex"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-500/20 text-brand-400">
              <Sparkles className="h-4 w-4" />
            </span>
            <div className="text-xs">
              <p className="font-semibold">Repassage impeccable</p>
              <p className="text-white/50">Fini professionnel</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
