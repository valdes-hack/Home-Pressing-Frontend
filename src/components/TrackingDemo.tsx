"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Search, Loader2, AlertCircle } from "lucide-react";
import { STATUTS } from "@/lib/data";
import { trackCommande, type CommandeTracking } from "@/lib/api";

/**
 * Suivi de commande en temps réel connecté à l'API backend.
 * Format de bordereau : AG-AA-NNNNNN (ex: YA1-26-000001).
 */
const FORMAT = /^[A-Z0-9]{2,4}-\d{2}-\d{6}$/i;

export default function TrackingDemo() {
  const [value, setValue] = useState("");
  const [commandeData, setCommandeData] = useState<CommandeTracking | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = value.trim().toUpperCase();
    
    if (!FORMAT.test(code)) {
      setCommandeData(null);
      setError("Format attendu : AG-AA-NNNNNN (ex. YA1-26-000001)");
      return;
    }

    setError("");
    setLoading(true);
    setCommandeData(null);

    try {
      const data = await trackCommande(code);
      setCommandeData(data);
    } catch (err: any) {
      setError(err.message || "Bordereau introuvable. Vérifiez le numéro saisi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl">
      <form onSubmit={submit} className="glass-strong flex flex-col gap-3 rounded-3xl p-3 sm:flex-row">
        <div className="flex flex-1 items-center gap-3 px-4">
          <Search className="h-5 w-5 text-white/40" />
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Numéro de bordereau — ex. YA2-26-000123"
            className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-white/35"
          />
        </div>
        <button 
          type="submit" 
          disabled={loading}
          className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Recherche...
            </>
          ) : (
            'Suivre ma commande'
          )}
        </button>
      </form>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 flex items-center justify-center gap-2 text-center text-sm text-red-300"
          >
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {commandeData && (
          <motion.div
            key={commandeData.numFacture}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="glass mt-8 rounded-3xl p-8"
          >
            {/* En-tête avec infos commande */}
            <div className="mb-6 text-center">
              <p className="text-sm text-white/50">
                Bordereau <span className="font-semibold text-white">{commandeData.numFacture}</span>
              </p>
              <p className="mt-2 text-xs text-white/40">
                {commandeData.nomAgence} · {commandeData.nbArticles} article{commandeData.nbArticles > 1 ? 's' : ''}
              </p>
              <div className="mt-3 flex items-center justify-center gap-2">
                <div className="h-1.5 flex-1 max-w-xs rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${commandeData.progression}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="h-full bg-gradient-to-r from-brand-500 to-brand-400"
                  />
                </div>
                <span className="text-xs font-bold text-brand-400">{commandeData.progression}%</span>
              </div>
            </div>

            {/* Stepper statuts */}
            <div className="mt-8 grid grid-cols-5 gap-2">
              {STATUTS.map((s, i) => {
                const currentIndex = STATUTS.findIndex(st => 
                  st.toLowerCase() === commandeData.statutCmd.toLowerCase()
                );
                const done = i <= currentIndex;
                return (
                  <div key={s} className="relative flex flex-col items-center text-center">
                    {i > 0 && (
                      <motion.span
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: done ? 1 : 0 }}
                        transition={{ delay: i * 0.25, duration: 0.4 }}
                        className="absolute right-1/2 top-5 h-0.5 w-full origin-left bg-brand-500"
                      />
                    )}
                    {i > 0 && <span className="absolute right-1/2 top-5 h-0.5 w-full bg-white/10" />}
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.25, type: "spring" }}
                      className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full ${
                        done ? "bg-brand-500 text-navy-950" : "bg-navy-800 text-white/40 ring-1 ring-white/15"
                      }`}
                    >
                      {done ? <Check className="h-5 w-5" /> : i + 1}
                    </motion.span>
                    <span className={`mt-3 text-[11px] font-medium sm:text-xs ${done ? "text-white" : "text-white/40"}`}>
                      {s}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Message informatif */}
            {commandeData.message && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="mt-6 rounded-2xl bg-brand-500/10 border border-brand-500/30 p-4 text-center"
              >
                <p className="text-sm text-white/90">{commandeData.message}</p>
              </motion.div>
            )}

            {/* Infos supplémentaires */}
            <p className="mt-6 text-center text-xs text-white/30">
              Date de dépôt : {new Date(commandeData.dateDepot).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
