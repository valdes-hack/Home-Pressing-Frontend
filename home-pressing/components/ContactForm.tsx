"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Send, AlertCircle } from "lucide-react";
import { envoyerContact } from "@/lib/api";

/** Formulaire de contact connecté à l'API backend. */
export default function ContactForm() {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    telephone: "",
    sujet: "",
    message: "",
  });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await envoyerContact(formData);
      setSent(true);
      // Réinitialiser le formulaire
      setFormData({
        nom: "",
        email: "",
        telephone: "",
        sujet: "",
        message: "",
      });
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const field =
    "w-full rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-3.5 text-sm outline-none transition-all placeholder:text-white/35 focus:border-brand-500 focus:bg-white/[0.08] focus:ring-2 focus:ring-brand-500/30";

  return (
    <div className="glass-strong relative overflow-hidden rounded-[2rem] p-6 sm:p-10">
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="ok"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex min-h-[340px] flex-col items-center justify-center text-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <CheckCircle2 className="h-20 w-20 text-emerald-400" />
            </motion.div>
            <h3 className="mt-5 font-display text-2xl font-bold">Message envoyé !</h3>
            <p className="mt-2 max-w-sm text-sm text-white/60">
              Merci, nous vous répondons dans les plus brefs délais.
            </p>
            <button onClick={() => setSent(false)} className="btn-ghost mt-6">
              Envoyer un autre message
            </button>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={submit} exit={{ opacity: 0 }} className="grid gap-4">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-300"
              >
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <input 
                required 
                name="nom" 
                value={formData.nom}
                onChange={handleChange}
                placeholder="Votre nom *" 
                className={field} 
              />
              <input 
                name="telephone" 
                type="tel" 
                value={formData.telephone}
                onChange={handleChange}
                placeholder="Téléphone" 
                pattern="[0-9 +]{9,16}" 
                className={field} 
              />
            </div>

            <input 
              required
              name="email" 
              type="email" 
              value={formData.email}
              onChange={handleChange}
              placeholder="E-mail *" 
              className={field} 
            />

            <select 
              required
              name="sujet" 
              value={formData.sujet}
              onChange={handleChange}
              className={`${field} appearance-none`}
            >
              <option value="">Sujet de votre message *</option>
              <option className="text-navy-950">Renseignement sur un service</option>
              <option className="text-navy-950">Suivi d&apos;une commande</option>
              <option className="text-navy-950">Réclamation</option>
              <option className="text-navy-950">Partenariat / entreprise</option>
              <option className="text-navy-950">Autre</option>
            </select>

            <textarea 
              required 
              name="message" 
              value={formData.message}
              onChange={handleChange}
              rows={5} 
              placeholder="Votre message… *" 
              minLength={10}
              maxLength={1000}
              className={`${field} resize-none`} 
            />

            <p className="text-xs text-white/40">* Champs obligatoires</p>

            <button type="submit" disabled={loading} className="btn-primary disabled:opacity-70">
              {loading ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-navy-950 border-t-transparent" />
              ) : (
                <>
                  <Send className="h-4 w-4" /> Envoyer le message
                </>
              )}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
