'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Logo from '@/components/Logo';
import { fetchApi, setSession } from '@/lib/api';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Building2,
  Clock,
  Bell,
  ShieldCheck,
  LogIn,
  AlertCircle,
  UserPlus,
  Phone,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

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

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-100 font-sans">
      {/* ============================================================ */}
      {/* PANNEAU GAUCHE : HERO BRANDING & VALEUR AJOUTÉE (Bleu Marine & Or) */}
      {/* ============================================================ */}
      <div className="relative lg:w-[48%] w-full min-h-[440px] lg:min-h-screen bg-[#071c36] text-white flex flex-col justify-between p-8 sm:p-12 lg:p-16 overflow-hidden">
        {/* Dégradé sophistiqué bleu nuit */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#051427] via-[#092548]/95 to-[#0c3160]/85" />

        <div className="relative z-10 flex items-center justify-between">
          <Logo theme="dark" size="md" />
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-amber-300 border border-amber-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            Portail Officiel Yaoundé
          </span>
        </div>

        <div className="relative z-10 my-auto py-8 max-w-lg">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 mb-4">
            Plateforme Unifiée Atlantic Palace
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black leading-tight tracking-tight">
            L'Excellence du Pressing & Soin Textile
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm mt-4 leading-relaxed font-normal">
            Clients : suivez vos commandes en direct, téléchargez vos factures et cumulez vos points de fidélité (RG27).
            Personnel : accédez à votre comptoir d'agence ou à l'atelier central en toute sécurité.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <span className="text-amber-400 font-bold block text-sm">6 Agences</span>
              <span className="text-slate-300">Réseau commercial Yaoundé</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <span className="text-amber-400 font-bold block text-sm">Alertes Directes</span>
              <span className="text-slate-300">WhatsApp & SMS en temps réel</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 pt-4 border-t border-white/10 flex justify-between text-[11px] text-slate-400">
          <span>Direction & Comptoirs</span>
          <span>© 2026 Atlantic Palace Pressing</span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* PANNEAU DROIT : FORMULAIRE DE CONNEXION & INSCRIPTION */}
      {/* ============================================================ */}
      <div className="relative lg:w-[52%] w-full flex flex-col justify-between items-center bg-white p-6 sm:p-12 lg:p-16 min-h-screen">
        <div className="w-full max-w-[440px] my-auto relative z-10 py-4">
          {/* Logo mobile */}
          <div className="flex justify-center mb-4 lg:hidden">
            <Logo theme="light" size="md" />
          </div>

          {/* SÉLECTEUR D'ONGLET : CONNEXION vs INSCRIPTION CLIENT */}
          <div className="flex p-1 bg-slate-100 rounded-2xl mb-6 border border-slate-200">
            <button
              type="button"
              onClick={() => { setMode('login'); setErreur(null); setSuccesMsg(null); }}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                mode === 'login'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
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
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Créer un compte Client</span>
            </button>
          </div>

          {/* Titre et Sous-titre */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {mode === 'login' ? 'Bon retour parmi nous' : 'Créer votre compte Client'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              {mode === 'login'
                ? 'Accédez à votre espace dédié en quelques secondes'
                : 'Suivez vos dépôts et bénéficiez de vos réductions de fidélité'}
            </p>
          </div>

          {/* Messages d'alerte */}
          {erreur && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-600" />
              <span>{erreur}</span>
            </div>
          )}

          {succesMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
              <span>{succesMsg}</span>
            </div>
          )}

          {/* ============================================================ */}
          {/* MODE 1 : FORMULAIRE DE CONNEXION */}
          {/* ============================================================ */}
          {mode === 'login' && (
            <form onSubmit={handleConnexion} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-slate-600" />
                  Identifiant ou Login
                </label>
                <input
                  type="text"
                  required
                  value={identifiant}
                  onChange={(e) => setIdentifiant(e.target.value)}
                  placeholder="Ex : dg.admin, recep.bastos ou votre login client"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-slate-600" />
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={motDePasse}
                    onChange={(e) => setMotDePasse(e.target.value)}
                    placeholder="Entrez votre mot de passe"
                    className="w-full pl-4 pr-11 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={seSouvenir}
                    onChange={(e) => setSeSouvenir(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-slate-600">Se souvenir de moi</span>
                </label>

                <button
                  type="button"
                  onClick={() => alert("Pour réinitialiser votre accès, contactez l'administration.")}
                  className="font-semibold text-blue-600 hover:underline"
                >
                  Mot de passe oublié ?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <LogIn className="w-4 h-4" />
                <span>{loading ? 'Connexion en cours...' : 'Se connecter'}</span>
              </button>
            </form>
          )}

          {/* ============================================================ */}
          {/* MODE 2 : FORMULAIRE D'INSCRIPTION CLIENT (RÔLE PAR DÉFAUT) */}
          {/* ============================================================ */}
          {mode === 'register' && (
            <form onSubmit={handleInscription} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Nom et Prénom complets
                </label>
                <input
                  type="text"
                  required
                  value={regNom}
                  onChange={(e) => setRegNom(e.target.value)}
                  placeholder="Ex : Alain Fogue"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    Téléphone (+237)
                  </label>
                  <input
                    type="tel"
                    required
                    value={regTel}
                    onChange={(e) => setRegTel(e.target.value)}
                    placeholder="694 11 22 33"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-500" />
                    Identifiant login
                  </label>
                  <input
                    type="text"
                    required
                    value={regLogin}
                    onChange={(e) => setRegLogin(e.target.value)}
                    placeholder="alain.fogue"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  Mot de passe
                </label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Créez votre mot de passe sécurisé"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-500" />
                  Votre agence la plus proche
                </label>
                <select
                  value={regAgence}
                  onChange={(e) => setRegAgence(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800 outline-none cursor-pointer"
                >
                  <option value={1}>Agence Bastos (YA1)</option>
                  <option value={2}>Agence Kennedy (YA2)</option>
                  <option value={3}>Agence Biyem-Assi (YA3)</option>
                  <option value={4}>Agence Omnisports (YA4)</option>
                  <option value={5}>Agence Mendong (YA5)</option>
                  <option value={6}>Agence Etoa-Meki (YA6)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>{loading ? 'Création de votre compte...' : 'Créer mon compte Client'}</span>
              </button>
            </form>
          )}

          {/* Connexion rapide pour tests */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-400 block mb-2 font-medium">Comptes de démonstration :</span>
            <div className="inline-flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => { setMode('login'); setIdentifiant('recep.bastos'); setMotDePasse('Pressing@2026'); }}
                className="px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium transition"
              >
                Réceptionniste
              </button>
              <button
                type="button"
                onClick={() => { setMode('login'); setIdentifiant('agent.kamga'); setMotDePasse('Pressing@2026'); }}
                className="px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium transition"
              >
                Agent Atelier
              </button>
              <button
                type="button"
                onClick={() => { setMode('login'); setIdentifiant('dg.admin'); setMotDePasse('Pressing@2026'); }}
                className="px-2.5 py-1 text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium transition"
              >
                Directeur (DG)
              </button>
            </div>
          </div>
        </div>

        <div className="w-full text-center py-2 border-t border-slate-100 text-[11px] text-slate-400">
          © 2026 Atlantic Palace Pressing · Système de Gestion Sécurisé
        </div>
      </div>
    </div>
  );
}
