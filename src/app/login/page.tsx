'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchApi, setSession } from '@/lib/api';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Building2,
  LogIn,
  AlertCircle,
  UserPlus,
  Phone,
  Sparkles,
  CheckCircle2,
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';

export default function LoginPage() {
  const router = useRouter();

  // Mode : 'login' ou 'register'
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Formulaire Connexion
  const [identifiant, setIdentifiant] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [seSouvenir, setSeSouvenir] = useState(false);

  // Formulaire Inscription Client
  const [regNom, setRegNom] = useState('');
  const [regTel, setRegTel] = useState('');
  const [regLogin, setRegLogin] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regAgence, setRegAgence] = useState<number>(1);

  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [succesMsg, setSuccesMsg] = useState<string | null>(null);

  // Gestion Connexion
  const handleConnexion = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur(null);
    setSuccesMsg(null);
    setLoading(true);

    try {
      const data = await fetchApi('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          login: identifiant.trim(),
          motDePasse: motDePasse,
        }),
      });

      setSession(data.token, data.utilisateur);

      // Redirection selon le profil
      const profil = (data.utilisateur.profil || '').toUpperCase();
      if (profil === 'DG') {
        router.push('/dg');
      } else if (profil === 'AGENT') {
        router.push('/atelier');
      } else if (profil === 'CLIENT') {
        router.push('/espace-client');
      } else {
        router.push('/comptoir');
      }
    } catch (err: any) {
      setErreur(err.message || 'Identifiant ou mot de passe incorrect.');
    } finally {
      setLoading(false);
    }
  };

  // Gestion Inscription Client
  const handleInscription = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur(null);
    setSuccesMsg(null);
    setLoading(true);

    try {
      const data = await fetchApi('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          nomUtilisateur: regNom.trim(),
          login: regLogin.trim(),
          motDePasse: regPassword,
          telephone: regTel.trim(),
          idAgence: regAgence,
        }),
      });

      setSession(data.token, data.utilisateur);
      setSuccesMsg('Compte client créé avec succès ! Redirection vers votre espace...');
      setTimeout(() => {
        router.push('/espace-client');
      }, 1000);
    } catch (err: any) {
      setErreur(err.message || 'Erreur lors de la création de votre compte client.');
    } finally {
      setLoading(false);
    }
  };

  // Remplissage rapide démo
  const setDemoCreds = (login: string, pass: string) => {
    setIdentifiant(login);
    setMotDePasse(pass);
    setMode('login');
  };

  return (
    <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pb-20">
      <PageHeader
        eyebrow="Espace Utilisateur"
        title="Connexion & Espace"
        highlight="Client"
        subtitle="Accédez à votre suivi personnalisé ou connectez-vous à votre interface d'administration."
      />

      {/* Carte centrale élégante et compacte (ne prend PAS tout l'écran) */}
      <div className="max-w-xl mx-auto mt-6 rounded-3xl border border-white/15 bg-white/[0.06] backdrop-blur-2xl p-6 sm:p-10 shadow-2xl shadow-black/50">
        
        {/* Sélecteur d'onglets Connexion / Inscription */}
        <div className="flex p-1.5 bg-navy-900/80 rounded-2xl mb-8 border border-white/10">
          <button
            type="button"
            onClick={() => { setMode('login'); setErreur(null); setSuccesMsg(null); }}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
              mode === 'login'
                ? 'bg-gradient-to-r from-brand-500 to-amber-500 text-slate-950 shadow-md font-extrabold'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Connexion</span>
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setErreur(null); setSuccesMsg(null); }}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
              mode === 'register'
                ? 'bg-gradient-to-r from-blue-600 to-brand-500 text-white shadow-md font-extrabold'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Créer un compte</span>
          </button>
        </div>

        {/* Message d'erreur */}
        {erreur && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-300 text-xs sm:text-sm flex items-center gap-3 animate-fadeIn">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400" />
            <span>{erreur}</span>
          </div>
        )}

        {/* Message de succès */}
        {succesMsg && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs sm:text-sm flex items-center gap-3 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
            <span>{succesMsg}</span>
          </div>
        )}

        {/* ============================================================ */}
        {/* FORMULAIRE 1 : CONNEXION */}
        {/* ============================================================ */}
        {mode === 'login' && (
          <form onSubmit={handleConnexion} className="space-y-5 animate-fadeIn">
            <div>
              <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-2">
                Identifiant ou Numéro Client
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={identifiant}
                  onChange={(e) => setIdentifiant(e.target.value)}
                  placeholder="ex: dg.admin, recep.bastos, samuel.client"
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider">
                  Mot de passe
                </label>
                <span className="text-[11px] text-brand-400 hover:underline cursor-pointer">
                  Aide mot de passe ?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={motDePasse}
                  onChange={(e) => setMotDePasse(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-white/70 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={seSouvenir}
                  onChange={(e) => setSeSouvenir(e.target.checked)}
                  className="rounded border-white/20 bg-white/5 text-brand-500 focus:ring-brand-500"
                />
                <span>Mémoriser ma session</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-brand-500 to-amber-500 text-slate-950 font-bold rounded-xl text-sm shadow-xl shadow-brand-500/25 hover:brightness-110 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Connexion en cours...</span>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Accéder à mon Espace</span>
                </>
              )}
            </button>

            {/* Raccourcis de test Démo */}
            <div className="pt-4 border-t border-white/10 text-center">
              <span className="text-[11px] text-white/45 block mb-2 font-medium">
                Accès de test rapide (Cliquez pour pré-remplir) :
              </span>
              <div className="flex flex-wrap justify-center gap-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => setDemoCreds('dg.admin', 'Pressing@2026')}
                  className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 hover:border-brand-400 text-white/80 transition"
                >
                  👑 DG (dg.admin)
                </button>
                <button
                  type="button"
                  onClick={() => setDemoCreds('recep.bastos', 'Pressing@2026')}
                  className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 hover:border-brand-400 text-white/80 transition"
                >
                  📋 Comptoir (recep.bastos)
                </button>
                <button
                  type="button"
                  onClick={() => setDemoCreds('agent.kamga', 'Pressing@2026')}
                  className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 hover:border-brand-400 text-white/80 transition"
                >
                  🧺 Atelier (agent.kamga)
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ============================================================ */}
        {/* FORMULAIRE 2 : INSCRIPTION CLIENT LIBRE-SERVICE */}
        {/* ============================================================ */}
        {mode === 'register' && (
          <form onSubmit={handleInscription} className="space-y-4 animate-fadeIn">
            <div>
              <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
                Nom complet
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={regNom}
                  onChange={(e) => setRegNom(e.target.value)}
                  placeholder="ex: Jean-Paul Manga"
                  className="w-full pl-11 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
                  Téléphone (RG9)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={regTel}
                    onChange={(e) => setRegTel(e.target.value)}
                    placeholder="699 00 11 22"
                    className="w-full pl-11 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
                  Identifiant (Login)
                </label>
                <input
                  type="text"
                  required
                  value={regLogin}
                  onChange={(e) => setRegLogin(e.target.value)}
                  placeholder="ex: jp.manga"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Minimum 6 caractères"
                  className="w-full pl-11 pr-11 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/80 uppercase tracking-wider mb-1.5">
                Agence de proximité préférée
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <select
                  value={regAgence}
                  onChange={(e) => setRegAgence(Number(e.target.value))}
                  className="w-full pl-11 pr-4 py-2.5 bg-navy-900 border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:border-brand-500 transition"
                >
                  <option value={1}>Agence Bastos (YA1)</option>
                  <option value={2}>Agence Kennedy (YA2)</option>
                  <option value={3}>Agence Biyem-Assi (YA3)</option>
                  <option value={4}>Agence Essos (YA4)</option>
                  <option value={5}>Agence Omnisports (YA5)</option>
                  <option value={6}>Agence Odza (YA6)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 bg-gradient-to-r from-blue-600 to-brand-500 text-white font-bold rounded-xl text-sm shadow-xl shadow-brand-500/25 hover:brightness-110 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Création en cours...</span>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Créer mon compte Client</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Lien retour boutique */}
        <div className="mt-8 pt-4 border-t border-white/10 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-white/60 hover:text-brand-400 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Retourner à la vitrine d'accueil</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
