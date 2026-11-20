"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";

export default function CTA() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-navy-600 via-navy-700 to-navy-900 p-10 text-center ring-1 ring-white/15 sm:p-16"
    >
      <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-brand-500/30 blur-[90px]" />
      <div className="absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-navy-400/40 blur-[90px]" />
      <div className="relative">
        <h2 className="mx-auto max-w-2xl font-display text-3xl font-extrabold sm:text-5xl">
          Prêt à confier votre linge à <span className="text-gradient">Home Pressing</span> ?
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-white/70">
          Passez dans l&apos;une de nos 6 agences à Yaoundé. Votre première
          commande est enregistrée en moins d&apos;une minute.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Link href="/localisation" className="btn-primary group">
            <MapPin className="h-4 w-4" /> Voir les agences
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link href="/contact" className="btn-ghost">
            Nous écrire
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
