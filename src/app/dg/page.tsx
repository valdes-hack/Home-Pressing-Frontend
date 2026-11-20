'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { fetchApi, getCurrentUser } from '@/lib/api';
import {
  ShoppingBag,
  Coins,
  Users,
  Building2,
  TrendingUp,
  ArrowUpRight,
  PieChart as PieIcon,
  Shirt,
  Calendar,
  ChevronDown,
  Layers,
  Sparkles,
  Settings,
  ShieldCheck,
  Check,
  AlertCircle,
  Save,
  Tag,
  BarChart3,
  RefreshCw,
  LayoutDashboard,
  Lock,
  Unlock,
  MessageSquare,
  Mail,
  Globe,
  Sliders,
  Filter
} from 'lucide-react';

export default function DgDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [rapportAgences, setRapportAgences] = useState<any[]>([]);
  const [parametres, setParametres] = useState<any[]>([]);
  const [utilisateurs, setUtilisateurs] = useState<any[]>([]);
  const [agences, setAgences] = useState<any[]>([]);
  const [currentView, setCurrentView] = useState<'dashboard' | 'parametres' | 'utilisateurs' | 'agences' | 'stats'>('dashboard');

  // Filtre catégorie paramètres (menu déroulant)
  const [selectedCategorie, setSelectedCategorie] = useState<string>('Toutes');
  const [rechercheParam, setRechercheParam] = useState<string>('');

  // Identité du site (Nom & Slogan)
  const [nomSiteInput, setNomSiteInput] = useState<string>('Atlantic Palace Pressing');
  const [sloganInput, setSloganInput] = useState<string>('Excellence & Soin Haute Couture du Textile');
  const [savingSiteIdentity, setSavingSiteIdentity] = useState(false);

  // Édition de paramètre générique
  const [editParamCode, setEditParamCode] = useState<string | null>(null);
  const [editParamVal, setEditParamVal] = useState<string>('');
  const [paramSaveMessage, setParamSaveMessage] = useState<string | null>(null);
  const [savingParam, setSavingParam] = useState(false);

  // Action utilisateur (bloquer / débloquer)
  const [userActionLoading, setUserActionLoading] = useState<number | null>(null);
  const [userActionMessage, setUserActionMessage] = useState<string | null>(null);

  // Synchronisation de l'URL avec la vue active
  useEffect(() => {
    const handleUrlView = () => {
      const params = new URLSearchParams(window.location.search);
      const v = params.get('view');
      const hash = window.location.hash.replace('#', '');
      const candidate = v || hash;
      if (candidate && ['dashboard', 'parametres', 'utilisateurs', 'agences', 'stats'].includes(candidate)) {
        setCurrentView(candidate as any);
      }
    };
    handleUrlView();
    window.addEventListener('popstate', handleUrlView);
    return () => window.removeEventListener('popstate', handleUrlView);
  }, []);

  const changerVue = (v: typeof currentView) => {
    setCurrentView(v);
    const url = new URL(window.location.href);
    url.searchParams.set('view', v);
    window.history.pushState({}, '', url.toString());
  };

  const rechargerTout = () => {
    setUser(getCurrentUser());

    // Rapport consolidé DG
    fetchApi('/pilotage/dg/rapport-consolide')
      .then((data) => {
        if (data && data.length > 0) setRapportAgences(data);
      })
      .catch(() => {});

    // Paramètres système
    fetchApi('/referentiel/parametres')
      .then((data) => {
        if (Array.isArray(data)) {
          setParametres(data);
          const nom = data.find((p: any) => p.codeParam === 'nom_pressing')?.valeurParam;
          const slogan = data.find((p: any) => p.codeParam === 'slogan_pressing')?.valeurParam;
          if (nom) setNomSiteInput(nom);
          if (slogan) setSloganInput(slogan);
        }
      })
      .catch(() => {});

    // Utilisateurs
    fetchApi('/referentiel/utilisateurs')
      .then((data) => setUtilisateurs(data || []))
      .catch(() => {});

    // Agences
    fetchApi('/referentiel/agences')
      .then((data) => setAgences(data || []))
      .catch(() => {});
  };

  useEffect(() => {
    rechargerTout();
  }, []);

  // Sauvegarder l'identité générale du site (Nom & Slogan)
  const handleSaveIdentiteSite = async () => {
    setSavingSiteIdentity(true);
    setParamSaveMessage(null);
    try {
      await Promise.all([
        fetchApi('/referentiel/parametres/nom_pressing', {
          method: 'PUT',
          body: JSON.stringify({
            valeurParam: nomSiteInput.trim(),
            libelleParam: 'Nom de l\'établissement / site',
            categorieParam: 'Général'
          }),
        }),
        fetchApi('/referentiel/parametres/slogan_pressing', {
          method: 'PUT',
          body: JSON.stringify({
            valeurParam: sloganInput.trim(),
            libelleParam: 'Slogan officiel du pressing',
            categorieParam: 'Général'
          }),
        })
      ]);
      setParamSaveMessage('Identité du site enregistrée avec succès !');
      rechargerTout();
    } catch (err: any) {
      setParamSaveMessage(`Erreur : ${err.message}`);
    } finally {
      setSavingSiteIdentity(false);
    }
  };

  // Sauvegarder un paramètre unique
  const handleSaveParametre = async (codeParam: string) => {
    if (!editParamVal.trim()) return;
    setSavingParam(true);
    setParamSaveMessage(null);
    try {
      await fetchApi(`/referentiel/parametres/${codeParam}`, {
        method: 'PUT',
        body: JSON.stringify({ valeurParam: editParamVal.trim() }),
      });
      setParamSaveMessage(`Paramètre "${codeParam}" mis à jour avec succès.`);
      setEditParamCode(null);
      fetchApi('/referentiel/parametres').then((data) => setParametres(data || []));
    } catch (err: any) {
      setParamSaveMessage(`Erreur: ${err.message}`);
    } finally {
      setSavingParam(false);
    }
  };

  // Bloquer / Débloquer un compte utilisateur (CI17 / RG24)
  const handleToggleStatutUser = async (u: any) => {
    const nouveauStatut = u.statutCompte === 'Actif' ? 'Désactivé' : 'Actif';
    setUserActionLoading(u.idUtilisateur);
    setUserActionMessage(null);

    try {
      await fetchApi(`/referentiel/utilisateurs/${u.idUtilisateur}/statut`, {
        method: 'PATCH',
        body: JSON.stringify({ statutCompte: nouveauStatut }),
      });

      setUserActionMessage(`Compte ${u.loginUtilisateur} (${u.nomUtilisateur}) passé à : ${nouveauStatut}`);
      // Recharger la liste des utilisateurs
      const data = await fetchApi('/referentiel/utilisateurs');
      setUtilisateurs(data || []);
    } catch (err: any) {
      setUserActionMessage(`Erreur : ${err.message}`);
    } finally {
      setUserActionLoading(null);
    }
  };

  // Sommes calculées du rapport
  const totalFacture = rapportAgences.reduce((acc, r) => acc + Number(r.chiffre_affaires_facture || r.montantTotal || 0), 0);
  const totalEncaisse = rapportAgences.reduce((acc, r) => acc + Number(r.chiffre_affaires_encaisse || r.montantPaye || 0), 0);
  const totalArticles = rapportAgences.reduce((acc, r) => acc + Number(r.nb_articles || 0), 0);
  const totalCommandes = rapportAgences.reduce((acc, r) => acc + Number(r.nb_commandes || 0), 0);

  // Catégories uniques de paramètres
  const categoriesDisponibles = ['Toutes', ...Array.from(new Set(parametres.map(p => p.categorieParam || 'Général')))];

  // Paramètres filtrés
  const parametresFiltres = parametres.filter(p => {
    const matchCat = selectedCategorie === 'Toutes' || p.categorieParam === selectedCategorie;
    const term = rechercheParam.toLowerCase();
    const matchSearch = !term || p.codeParam.toLowerCase().includes(term) || p.libelleParam.toLowerCase().includes(term) || p.valeurParam.toLowerCase().includes(term);
    return matchCat && matchSearch;
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* ============================================================ */}
        {/* EN-TÊTE DIRECTEUR GÉNÉRAL AVEC VUES PAR ONGLETS */}
        {/* ============================================================ */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Direction Générale — Pilotage & Réglages
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                Vue Globale Réseau (RG15)
              </span>
            </div>
            <p className="text-slate-500 text-sm mt-1">
              Supervision des 6 agences de Yaoundé, de l'Atelier Central Mvan et gouvernance complète du système.
            </p>
          </div>

          <button
            onClick={rechargerTout}
            className="px-3.5 py-2 bg-white rounded-xl border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition flex items-center space-x-1.5 self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
            <span>Actualiser les données</span>
          </button>
        </div>

        {/* Onglets de Navigation DG */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 border-b border-slate-200">
          <button
            onClick={() => changerVue('dashboard')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
              currentView === 'dashboard'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Tableau de bord</span>
          </button>

          <button
            onClick={() => changerVue('parametres')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
              currentView === 'parametres'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Paramètres du Site & Métier</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-black bg-amber-400 text-slate-950">
              {parametres.length}
            </span>
          </button>

          <button
            onClick={() => changerVue('utilisateurs')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
              currentView === 'utilisateurs'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Gestion Utilisateurs & Sécurité</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-black bg-slate-100 text-slate-600">
              {utilisateurs.length}
            </span>
          </button>

          <button
            onClick={() => changerVue('agences')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition whitespace-nowrap ${
              currentView === 'agences'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Agences Réseau (6 + Atelier)</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-black bg-slate-100 text-slate-600">
              {agences.length}
            </span>
          </button>
        </div>

        {/* ============================================================ */}
        {/* VUE 1 : PILOTAGE CONSOLIDÉ & KPI */}
        {/* ============================================================ */}
        {currentView === 'dashboard' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-xs font-semibold">Chiffre d'affaires facturé</span>
                  <p className="text-2xl font-black text-slate-900 mt-1">
                    {(totalFacture || 1545000).toLocaleString('fr-FR')} FCFA
                  </p>
                  <span className="text-[11px] font-bold text-blue-600 mt-1 inline-flex items-center">
                    Réseau consolidé
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <Coins className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-xs font-semibold">Chiffre d'affaires encaissé</span>
                  <p className="text-2xl font-black text-emerald-600 mt-1">
                    {(totalEncaisse || 1250000).toLocaleString('fr-FR')} FCFA
                  </p>
                  <span className="text-[11px] font-bold text-emerald-600 mt-1 inline-flex items-center">
                    En caisse réelle (RG16)
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-xs font-semibold">Volume d'articles traités</span>
                  <p className="text-2xl font-black text-slate-900 mt-1">
                    {(totalArticles || 342).toLocaleString('fr-FR')} pièces
                  </p>
                  <span className="text-[11px] font-bold text-purple-600 mt-1 inline-flex items-center">
                    Flux atelier Mvan
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600">
                  <Shirt className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-xs font-semibold">Bordereaux de commande</span>
                  <p className="text-2xl font-black text-slate-900 mt-1">
                    {(totalCommandes || 48).toLocaleString('fr-FR')}
                  </p>
                  <span className="text-[11px] font-bold text-amber-600 mt-1 inline-flex items-center">
                    Toutes agences
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
                  <ShoppingBag className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Rapport d'activité par Agence */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Rapport consolidé d'activité par Agence</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="text-slate-400 text-[11px] font-bold uppercase border-b border-slate-100">
                      <th className="py-2.5">Agence</th>
                      <th className="py-2.5 text-right">CA Facturé</th>
                      <th className="py-2.5 text-right">CA Encaissé</th>
                      <th className="py-2.5 text-right">Articles</th>
                      <th className="py-2.5 text-right">Commandes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rapportAgences.map((r, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition">
                        <td className="py-3 font-bold text-slate-900">{r.nom_agence || r.nomAgence}</td>
                        <td className="py-3 text-right font-semibold text-slate-900">
                          {Number(r.chiffre_affaires_facture || r.montantTotal || 0).toLocaleString('fr-FR')} FCFA
                        </td>
                        <td className="py-3 text-right font-semibold text-emerald-600">
                          {Number(r.chiffre_affaires_encaisse || r.montantPaye || 0).toLocaleString('fr-FR')} FCFA
                        </td>
                        <td className="py-3 text-right text-slate-600">{r.nb_articles || 0}</td>
                        <td className="py-3 text-right text-slate-600">{r.nb_commandes || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* VUE 2 : PARAMÈTRES DU SITE & DU SYSTÈME (STRUCTURÉS) */}
        {/* ============================================================ */}
        {currentView === 'parametres' && (
          <div className="space-y-6 animate-fadeIn">
            {/* CARTE 1 : CHANGER LE NOM DU SITE & SLOGAN */}
            <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl space-y-4">
              <div className="flex items-center gap-2">
                <Globe className="w-6 h-6 text-amber-400" />
                <h2 className="text-lg font-bold">Identité de l'Établissement & Nom du Site</h2>
              </div>
              <p className="text-xs text-blue-200">
                Modifiez en direct le nom de l'enseigne visible sur toutes les factures, bordereaux et interfaces utilisateurs.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Nom officiel de l'établissement / site
                  </label>
                  <input
                    type="text"
                    value={nomSiteInput}
                    onChange={(e) => setNomSiteInput(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-bold text-sm focus:ring-2 focus:ring-amber-400 outline-none"
                    placeholder="Ex: Atlantic Palace Pressing..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Slogan commercial
                  </label>
                  <input
                    type="text"
                    value={sloganInput}
                    onChange={(e) => setSloganInput(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-medium text-sm focus:ring-2 focus:ring-amber-400 outline-none"
                    placeholder="Ex: Excellence & Soin du Textile..."
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  disabled={savingSiteIdentity}
                  onClick={handleSaveIdentiteSite}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {savingSiteIdentity ? 'Enregistrement...' : 'Enregistrer le nom du site'}
                </button>
              </div>
            </div>

            {/* CARTE 2 : FILTRE ET GESTION DES AUTRES PARAMÈTRES */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-5">
              <div className="pb-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-blue-600" />
                    Réglages Métier & Modèles de Messages ({parametresFiltres.length})
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Filtrer par catégorie ou mot-clé pour configurer WhatsApp, les remises, les alertes et les workflows.
                  </p>
                </div>

                {/* Filtre par Catégorie (MENU DÉROULANT DEMANDÉ) */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                    <Filter className="w-4 h-4 text-slate-500" />
                    <span className="text-xs font-semibold text-slate-600">Catégorie :</span>
                    <select
                      value={selectedCategorie}
                      onChange={(e) => setSelectedCategorie(e.target.value)}
                      className="bg-transparent text-xs font-bold text-slate-900 outline-none cursor-pointer"
                    >
                      {categoriesDisponibles.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <input
                    type="text"
                    value={rechercheParam}
                    onChange={(e) => setRechercheParam(e.target.value)}
                    placeholder="Filtrer un paramètre..."
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none w-44"
                  />
                </div>
              </div>

              {paramSaveMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>{paramSaveMessage}</span>
                </div>
              )}

              {/* LISTE DES PARAMÈTRES FILTRÉS */}
              <div className="divide-y divide-slate-100">
                {parametresFiltres.map((p) => {
                  const isEditing = editParamCode === p.codeParam;
                  return (
                    <div key={p.codeParam} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-1 sm:max-w-md">
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 font-mono text-[10px] text-blue-700 font-bold border border-slate-200">
                            {p.categorieParam || 'Général'}
                          </span>
                          <span className="font-mono font-bold text-slate-900">{p.codeParam}</span>
                        </div>
                        <p className="text-slate-600 font-medium">{p.libelleParam}</p>
                      </div>

                      <div className="flex items-center space-x-3 sm:justify-end">
                        {isEditing ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={editParamVal}
                              onChange={(e) => setEditParamVal(e.target.value)}
                              className="px-3 py-1.5 bg-slate-50 border border-blue-400 rounded-xl text-xs font-bold text-slate-800 outline-none w-64"
                            />
                            <button
                              disabled={savingParam}
                              onClick={() => handleSaveParametre(p.codeParam)}
                              className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditParamCode(null)}
                              className="p-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl transition"
                            >
                              Annuler
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-3">
                            <span className="font-mono font-black text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200 max-w-sm truncate">
                              {p.valeurParam}
                            </span>
                            <button
                              onClick={() => {
                                setEditParamCode(p.codeParam);
                                setEditParamVal(p.valeurParam);
                              }}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-xl font-bold transition"
                            >
                              Modifier
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* VUE 3 : GESTION DES UTILISATEURS & BLOCAGE (BLOQUER UN UTILISATEUR) */}
        {/* ============================================================ */}
        {currentView === 'utilisateurs' && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-5 animate-fadeIn">
            <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-blue-600" />
                  Gestion des Comptes & Sécurité d'Accès (RG24 / CI17)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Contrôle des accès, affectations d'agences et blocage/déblocage immédiat des comptes utilisateurs.
                </p>
              </div>

              {userActionMessage && (
                <div className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 text-xs font-bold animate-fadeIn">
                  {userActionMessage}
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="text-slate-400 text-[11px] font-bold uppercase border-b border-slate-100">
                    <th className="py-2.5">Nom complet</th>
                    <th className="py-2.5">Identifiant (Login)</th>
                    <th className="py-2.5">Rôle / Profil</th>
                    <th className="py-2.5">Site d'affectation</th>
                    <th className="py-2.5">Statut actuel</th>
                    <th className="py-2.5 text-right">Action Blocage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {utilisateurs.map((u) => {
                    const estActif = u.statutCompte === 'Actif';
                    const isLoading = userActionLoading === u.idUtilisateur;
                    const estDgAdmin = u.loginUtilisateur === 'dg.admin';

                    return (
                      <tr key={u.idUtilisateur} className="hover:bg-slate-50 transition">
                        <td className="py-3 font-bold text-slate-900">{u.nomUtilisateur}</td>
                        <td className="py-3 font-mono font-bold text-blue-700">{u.loginUtilisateur}</td>
                        <td className="py-3">
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-800">
                            {u.profil}
                          </span>
                        </td>
                        <td className="py-3 text-slate-600">
                          {u.agence ? `${u.agence.nomAgence} (${u.agence.codeAgence})` : 'Siège (Vue Réseau)'}
                        </td>
                        <td className="py-3">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1 ${
                            estActif ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${estActif ? 'bg-emerald-600' : 'bg-red-600'}`} />
                            {u.statutCompte}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          {estDgAdmin ? (
                            <span className="text-slate-400 text-[11px] italic">Compte Principal DG</span>
                          ) : (
                            <button
                              disabled={isLoading}
                              onClick={() => handleToggleStatutUser(u)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ml-auto ${
                                estActif
                                  ? 'bg-red-50 text-red-700 hover:bg-red-600 hover:text-white border border-red-200'
                                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200'
                              }`}
                            >
                              {estActif ? (
                                <>
                                  <Lock className="w-3.5 h-3.5" />
                                  {isLoading ? 'Blocage...' : 'Bloquer le compte'}
                                </>
                              ) : (
                                <>
                                  <Unlock className="w-3.5 h-3.5" />
                                  {isLoading ? 'Déblocage...' : 'Débloquer le compte'}
                                </>
                              )}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* VUE 4 : AGENCES DU RÉSEAU YAOUNDÉ */}
        {/* ============================================================ */}
        {currentView === 'agences' && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-5 animate-fadeIn">
            <div className="pb-4 border-b border-slate-100">
              <h2 className="text-xl font-extrabold text-slate-900">
                Sites du Réseau : 6 Agences Commerciales + 1 Atelier Central
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Chaque agence dispose d'un préfixe unique pour la numérotation des bordereaux en mode hors-ligne (RG26 / BNF11).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {agences.map((ag) => (
                <div key={ag.idAgence} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-black text-sm text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                      {ag.codeAgence}
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      ag.typeAgence === 'Atelier central' ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {ag.typeAgence}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-base">{ag.nomAgence}</h3>
                  <p className="text-xs text-slate-500">{ag.adresseAgence || 'Yaoundé'}</p>
                  <p className="font-mono text-xs text-blue-600 font-bold">{ag.telAgence}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
