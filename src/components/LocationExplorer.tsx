"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, MapPin, Navigation, Phone, Search, Factory, Store } from "lucide-react";
import { AGENCIES } from "@/lib/data";

/** Onglet Localisation : liste des agences + carte interactive. */
export default function LocationExplorer() {
  const [selectedId, setSelectedId] = useState(AGENCIES[0].id);
  const [query, setQuery] = useState("");

  const selected = AGENCIES.find((a) => a.id === selectedId) ?? AGENCIES[0];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return AGENCIES;
    return AGENCIES.filter((a) =>
      `${a.name} ${a.quartier} ${a.address}`.toLowerCase().includes(q)
    );
  }, [query]);

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    selected.mapQuery
  )}&z=15&output=embed`;
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    selected.mapQuery
  )}`;

  return (
    <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
      {/* Liste */}
      <div className="flex flex-col gap-4">
        <div className="glass flex items-center gap-3 rounded-2xl px-4 py-3">
          <Search className="h-4 w-4 text-white/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un quartier (Bastos, Mvan…)"
            className="w-full bg-transparent text-sm outline-none placeholder:text-white/35"
          />
        </div>

        <div className="flex max-h-[560px] flex-col gap-3 overflow-y-auto pr-1">
          <AnimatePresence initial={false}>
            {filtered.map((a, i) => {
              const active = a.id === selectedId;
              const Icon = a.kind === "Atelier central" ? Factory : Store;
              return (
                <motion.button
                  key={a.id}
                  layout
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ x: 6 }}
                  onClick={() => setSelectedId(a.id)}
                  className={`relative overflow-hidden rounded-2xl border p-4 text-left transition-colors ${
                    active
                      ? "border-brand-500/60 bg-brand-500/10"
                      : "border-white/10 bg-white/[0.04] hover:border-white/25"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="agency-bar"
                      className="absolute left-0 top-0 h-full w-1 bg-brand-500"
                    />
                  )}
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        active
                          ? "bg-brand-500 text-navy-950"
                          : "bg-white/10 text-brand-400"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-display font-bold">{a.name}</p>
                      <p className="mt-0.5 flex items-center gap-1.5 text-xs text-white/55">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate">{a.address}</span>
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-white/45">
                        <Clock className="h-3 w-3 shrink-0" /> {a.hours}
                      </p>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>

          {filtered.length === 0 && (
            <p className="rounded-2xl border border-dashed border-white/15 p-6 text-center text-sm text-white/50">
              Aucune agence ne correspond à votre recherche.
            </p>
          )}
        </div>
      </div>

      {/* Carte + détails */}
      <div className="glass overflow-hidden rounded-[2rem]">
        <div className="relative h-[360px] w-full sm:h-[440px]">
          <AnimatePresence mode="wait">
            <motion.iframe
              key={selected.id}
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              src={mapSrc}
              title={`Carte — ${selected.name}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0 [filter:invert(0.92)_hue-rotate(180deg)_saturate(0.9)_brightness(0.95)]"
            />
          </AnimatePresence>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-navy-950/70 to-transparent" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <span className="eyebrow !py-1">{selected.kind} · {selected.code}</span>
              <h3 className="mt-3 font-display text-2xl font-bold">{selected.name}</h3>
              <p className="mt-1 flex items-center gap-2 text-sm text-white/60">
                <MapPin className="h-4 w-4 text-brand-500" /> {selected.address}
              </p>
              <p className="mt-1 flex items-center gap-2 text-sm text-white/60">
                <Clock className="h-4 w-4 text-brand-500" /> {selected.hours}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={directions}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <Navigation className="h-4 w-4" /> Itinéraire
              </a>
              <a href={`tel:${selected.phone.replace(/\s/g, "")}`} className="btn-ghost">
                <Phone className="h-4 w-4" /> Appeler
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
