"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import { BRAND, NAV_LINKS } from "@/lib/data";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-1 z-[65] mx-auto w-[calc(100%-1.5rem)] max-w-7xl rounded-2xl transition-all duration-500 ${
        scrolled
          ? "glass-strong shadow-2xl shadow-black/30"
          : "border border-transparent bg-transparent"
      }`}
    >
      <nav className="flex items-center justify-between px-4 py-2.5 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <motion.span
            whileHover={{ rotate: [0, -8, 8, 0], scale: 1.08 }}
            transition={{ duration: 0.6 }}
            className="relative block h-11 w-11 overflow-hidden rounded-xl"
          >
            <Image
              src="/logo.png"
              alt="Logo Home Pressing"
              fill
              sizes="44px"
              className="object-cover"
              priority
            />
          </motion.span>
          <span className="font-display text-lg font-bold tracking-tight">
            Home <span className="text-brand-500">Pressing</span>
          </span>
        </Link>

        {/* Desktop */}
        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => {
            const active = pathname === l.href;
            return (
              <li key={l.href} className="relative">
                <Link
                  href={l.href}
                  className={`relative block rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    active ? "text-white" : "text-white/70 hover:text-white"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-white/10 ring-1 ring-white/15"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative">{l.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <a href={`tel:${BRAND.phone.replace(/\s/g, "")}`} className="btn-primary !px-5 !py-2.5">
            <Phone className="h-4 w-4" /> Appeler
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/5 lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="overflow-hidden lg:hidden"
          >
            <ul className="flex flex-col gap-1 px-4 pb-4">
              {NAV_LINKS.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    href={l.href}
                    className={`block rounded-xl px-4 py-3 text-base font-medium ${
                      pathname === l.href
                        ? "bg-white/10 text-brand-400"
                        : "text-white/80 hover:bg-white/5"
                    }`}
                  >
                    {l.label}
                  </Link>
                </motion.li>
              ))}
              <li className="pt-2">
                <a
                  href={`tel:${BRAND.phone.replace(/\s/g, "")}`}
                  className="btn-primary w-full"
                >
                  <Phone className="h-4 w-4" /> Appeler maintenant
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
