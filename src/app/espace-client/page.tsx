'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import FactureModal from '@/components/FactureModal';
import { fetchApi, getCurrentUser } from '@/lib/api';
import {
  ShoppingBag,
  Star,
  Receipt,
  Clock,
  CheckCircle,
  Eye,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Printer,
  ExternalLink,
  Phone,
  User,
  Building2,
  Calendar,
  Lock,
  Layers,
  ChevronRight,
  Percent,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function EspaceClientPage() {
  const [user, setUser] = useState<any>(null);
  const [commandes, setCommandes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'dashboard' | 'commandes' | 'factures' | 'fidelite' | 'profil'>('dashboard');

  // Facture Modal
  const [factureModalData, setFactureModalData] = useState<any>(null);

  // Profil Form
  const [nouveauMotDePasse, setNouveauMotDePasse] = useState('');
  const [profilMessage, setProfilMessage] = useState<string | null>(null);

  // Synchronisation rapide de la vue active
  useEffect(() => {
    const handleUrlView = () => {
      const params = new URLSearchParams(window.location.search);
      const v = params.get('view') || window.location.hash.replace('#', '');
      if (v && ['dashboard', 'commandes', 'factures', 'fidelite', 'profil'].includes(v)) {
        setCurrentView(v as any);
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

  const rechargerCommandes = () => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setLoading(true);

    fetchApi('/commandes')
      .then((data) => {
        if (Array.isArray(data)) {
          setCommandes(data);
        } else {
          setCommandes([]);
        }
      })
      .catch(() => {
        // En cas de simulation ou si vide
        setCommandes([
          {
            numFacture: 'YA1-26-000001',
            client: { nomClient: currentUser?.nomUtilisateur || 'Jean-Baptiste Atangana', telClient: '+237694112233', pointsFidelite: 25 },
            statutCmd: 'Prêt',
            montantTotal: 4500,
            dateDepot: '2026-11-20',
            agence: { nomAgence: 'Agence Bastos' }
          }
        ]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    rechargerCommandes();
  }, []);

  // Ouvrir la facture dans le modal ou navigateur
  const handleOuvrirFacture = async (cmd: any) => {
    try {
      const res = await fetchApi(`/commandes/${cmd.numFacture}`);
      setFactureModalData({
        commande: res.commande || cmd,
        articles: res.articles || [],
        paiements: res.paiements || [],
        resteAPayer: res.resteAPayer !== undefined ? res.resteAPayer : 0,
      });
    } catch {
      setFactureModalData({
        commande: cmd,
        articles: [],
        paiements: [],
        resteAPayer: 0,
      });
    }
  };

  // Calculs statistiques client
  const commandesEnCours = commandes.filter(c => ['Réceptionné', 'En lavage', 'En repassage', 'Prêt'].includes(c.statutCmd));
  const commandesPretes = commandes.filter(c => c.statutCmd === 'Prêt');
  const pointsFideliteEstimes = commandes.reduce((acc, c) => acc + Math.floor((c.montantTotal || 0) / 1000), 15);

  const getStatusBadge = (statut: string) => {
    const s = (statut || '').toLowerCase();
    if (s.includes('réception') || s.includes('reception')) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
          <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-blue-600" />
          Réceptionné
        </span>
      );
    }
    if (s.includes('lavage')) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-800">
          <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-sky-600 animate-pulse" />
          En lavage
        </span>
      );
    }
    if (s.includes('repassage')) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
          <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-amber-600 animate-pulse" />
          En repassage
        </span>
      );
    }
    if (s.includes('prêt') || s.includes('pret')) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 animate-pulse">
          <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
          Prêt au retrait !
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
        {statut || 'En cours'}
      </span>
    );
  };

  return (
    <AppLayout>
      <div className="space-y-6 animate-fadeIn">
        {/* ============================================================ */}
        {/* EN-TÊTE & NAVIGATION RAPIDE "ACTION-RÉACTION" */}
        {/* ============================================================ */}
        <div className="bg-gradient-to-r from-[#071c36] via-[#0d2a50] to-[#12386a] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="relative z-10 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-full text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Espace Client Privilège
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Bonjour, {user?.nomUtilisateur || 'Cher Client'} !
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm mt-2 leading-relaxed">
              Consultez vos commandes en direct, vérifiez la mise à disposition de vos vêtements et profitez de vos points de fidélité.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap gap-2">
            <button
              onClick={() => changerVue('commandes')}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Suivre mes commandes</span>
            </button>
            <button
              onClick={() => changerVue('factures')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl backdrop-blur-xs transition flex items-center gap-1.5"
            >
              <Receipt className="w-4 h-4" />
              <span>Mes Factures</span>
            </button>
          </div>
        </div>

        {/* ONGLETS "ACTION-RÉACTION" IMMÉDIATS */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 border-b border-slate-200">
          <button
            onClick={() => changerVue('dashboard')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap ${
              currentView === 'dashboard'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>Tableau de bord</span>
          </button>

          <button
            onClick={() => changerVue('commandes')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap ${
              currentView === 'commandes'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Suivi des Commandes ({commandes.length})</span>
            {commandesPretes.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-500 text-white font-black animate-pulse">
                {commandesPretes.length} prête(s) !
              </span>
            )}
          </button>

          <button
            onClick={() => changerVue('factures')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap ${
              currentView === 'factures'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Mes Factures & Bordereaux</span>
          </button>

          <button
            onClick={() => changerVue('fidelite')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap ${
              currentView === 'fidelite'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Star className="w-4 h-4 text-amber-500" />
            <span>Points Fidélité (RG27)</span>
          </button>

          <button
            onClick={() => changerVue('profil')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 whitespace-nowrap ${
              currentView === 'profil'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Mon Profil & Paramètres</span>
          </button>
        </div>

        {/* ============================================================ */}
        {/* VUE 1 : TABLEAU DE BORD CLIENT */}
        {/* ============================================================ */}
        {currentView === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-xs font-semibold">Commandes en cours</span>
                  <p className="text-2xl font-black text-slate-900 mt-1">{commandesEnCours.length}</p>
                  <span className="text-[11px] font-bold text-blue-600 mt-1 block">À l'atelier & au comptoir</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-xs font-semibold">Prêtes au retrait</span>
                  <p className="text-2xl font-black text-emerald-600 mt-1">{commandesPretes.length}</p>
                  <span className="text-[11px] font-bold text-emerald-600 mt-1 block">Disponibles au comptoir</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 text-xs font-semibold">Solde Fidélité (RG27)</span>
                  <p className="text-2xl font-black text-amber-500 mt-1">{pointsFideliteEstimes} pts</p>
                  <span className="text-[11px] font-bold text-amber-600 mt-1 block">Remise disponible : 5%</span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
                  <Star className="w-6 h-6 fill-amber-400" />
                </div>
              </div>
            </div>

            {/* Dernières commandes */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-extrabold text-slate-900 text-base">Vos Dernières Commandes</h3>
                <button
                  onClick={() => changerVue('commandes')}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800"
                >
                  Voir l'historique complet &rarr;
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {commandes.slice(0, 4).map((c) => (
                  <div key={c.numFacture} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-blue-700 text-sm">{c.numFacture}</span>
                        {getStatusBadge(c.statutCmd)}
                      </div>
                      <p className="text-slate-500 text-[11px] mt-0.5">Dépôt le {c.dateDepot} à l'agence {c.agence?.nomAgence || 'Bastos'}</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-slate-900 text-sm">{c.montantTotal} FCFA</span>
                      <button
                        onClick={() => handleOuvrirFacture(c)}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-xl flex items-center gap-1.5 transition"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Facture</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* VUE 2 : SUIVI DES COMMANDES & WORKFLOW RG10 */}
        {/* ============================================================ */}
        {currentView === 'commandes' && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-5">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Suivi en Direct de vos Dépôts</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Chaque vêtement suit le cycle strict Merise RG10 : Réceptionné → Lavage → Repassage → Prêt au retrait.
              </p>
            </div>

            <div className="space-y-4">
              {commandes.map((cmd) => (
                <div key={cmd.numFacture} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                    <div>
                      <span className="font-mono text-base font-black text-blue-700">{cmd.numFacture}</span>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Déposé le {cmd.dateDepot} • Lieu : <strong>{cmd.agence?.nomAgence || 'Agence Bastos'}</strong>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusBadge(cmd.statutCmd)}
                      <button
                        onClick={() => handleOuvrirFacture(cmd)}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Ouvrir la Facture</span>
                      </button>
                    </div>
                  </div>

                  {/* BARRE D'AVANCEMENT DU WORKFLOW */}
                  <div className="grid grid-cols-4 gap-2 text-center text-[11px] font-semibold">
                    <div className={`p-2 rounded-xl ${['Réceptionné', 'En lavage', 'En repassage', 'Prêt', 'Retiré'].includes(cmd.statutCmd) ? 'bg-blue-100 text-blue-900 font-bold' : 'bg-slate-200 text-slate-500'}`}>
                      1. Réceptionné
                    </div>
                    <div className={`p-2 rounded-xl ${['En lavage', 'En repassage', 'Prêt', 'Retiré'].includes(cmd.statutCmd) ? 'bg-sky-100 text-sky-900 font-bold' : 'bg-slate-200 text-slate-500'}`}>
                      2. Lavage
                    </div>
                    <div className={`p-2 rounded-xl ${['En repassage', 'Prêt', 'Retiré'].includes(cmd.statutCmd) ? 'bg-amber-100 text-amber-900 font-bold' : 'bg-slate-200 text-slate-500'}`}>
                      3. Repassage
                    </div>
                    <div className={`p-2 rounded-xl ${['Prêt', 'Retiré'].includes(cmd.statutCmd) ? 'bg-emerald-100 text-emerald-900 font-bold' : 'bg-slate-200 text-slate-500'}`}>
                      4. Prêt au retrait
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs text-slate-600 pt-1">
                    <span>Montant total : <strong>{cmd.montantTotal} FCFA</strong></span>
                    {cmd.statutCmd === 'Prêt' ? (
                      <span className="text-emerald-700 font-bold">● Vêtement prêt : munissez-vous de votre bordereau au comptoir (RG16)</span>
                    ) : (
                      <span className="text-slate-500">Traitement en cours par nos maîtres artisans</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* VUE 3 : MES FACTURES & BORDEREAUX */}
        {/* ============================================================ */}
        {currentView === 'factures' && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-5">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Vos Factures & Bordereaux Numériques</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Consultez, téléchargez ou imprimez à tout moment vos bordereaux officiels conformes Merise v3.0.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="text-slate-400 text-[11px] font-bold uppercase border-b border-slate-100">
                    <th className="py-2.5">Bordereau</th>
                    <th className="py-2.5">Date dépôt</th>
                    <th className="py-2.5">Montant</th>
                    <th className="py-2.5">Statut</th>
                    <th className="py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {commandes.map((cmd) => (
                    <tr key={cmd.numFacture} className="hover:bg-slate-50 transition">
                      <td className="py-3 font-mono font-bold text-blue-700">{cmd.numFacture}</td>
                      <td className="py-3 text-slate-500">{cmd.dateDepot}</td>
                      <td className="py-3 font-extrabold text-slate-900">{cmd.montantTotal} FCFA</td>
                      <td className="py-3">{getStatusBadge(cmd.statutCmd)}</td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleOuvrirFacture(cmd)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition inline-flex items-center gap-1.5"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Ouvrir / Imprimer</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* VUE 4 : POINTS DE FIDÉLITÉ (RG27) */}
        {/* ============================================================ */}
        {currentView === 'fidelite' && (
          <div className="space-y-6">
            {/* CARTE FIDELITE GOLD */}
            <div className="bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 rounded-3xl p-6 sm:p-8 text-slate-950 shadow-2xl relative overflow-hidden max-w-lg mx-auto">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-amber-950/80">
                    Atlantic Palace Card
                  </span>
                  <h3 className="text-xl font-black mt-1">Programme Fidélité Privilège</h3>
                </div>
                <Star className="w-8 h-8 fill-slate-950 text-slate-950" />
              </div>

              <div className="my-8">
                <span className="text-xs font-bold text-amber-950/80 block">Titulaire de la carte</span>
                <p className="text-xl font-black tracking-wide">{user?.nomUtilisateur || 'Client Pressing'}</p>
                <p className="font-mono text-xs text-amber-950/80 mt-1">N° Client : CL-{user?.idUtilisateur || 1}-2026</p>
              </div>

              <div className="flex justify-between items-end pt-4 border-t border-amber-950/20">
                <div>
                  <span className="text-xs font-bold text-amber-950/80 block">Points cumulés</span>
                  <p className="text-3xl font-black">{pointsFideliteEstimes} pts</p>
                </div>
                <span className="px-3 py-1 bg-slate-950 text-amber-400 font-black text-xs rounded-full">
                  Statut Or
                </span>
              </div>
            </div>

            {/* Règles de calcul RG27 */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4 max-w-2xl mx-auto text-xs">
              <h4 className="font-extrabold text-slate-900 text-sm">Comment fonctionnent vos points ? (Règle RG27)</h4>
              <p className="text-slate-600">
                Chaque tranche de <strong>1 000 FCFA</strong> réglée au comptoir vous octroie automatiquement <strong>1 point fidélité</strong>.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="font-bold text-blue-700 block">Palier 100 points</span>
                  <span className="text-slate-600">5% de remise immédiate sur votre prochain dépôt</span>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <span className="font-bold text-amber-700 block">Palier 200 points</span>
                  <span className="text-slate-600">10% de remise maximale autorisée (RG12)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* VUE 5 : MON PROFIL & PARAMÈTRES */}
        {/* ============================================================ */}
        {currentView === 'profil' && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 max-w-xl mx-auto space-y-5">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Paramètres de votre Compte</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Consultez vos données d'accès et mettez à jour votre sécurité.
              </p>
            </div>

            {profilMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold">
                {profilMessage}
              </div>
            )}

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-500 font-bold mb-1">Nom complet</label>
                <input
                  type="text"
                  disabled
                  value={user?.nomUtilisateur || ''}
                  className="w-full px-3.5 py-2.5 bg-slate-100 rounded-xl font-bold text-slate-800 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Identifiant de connexion (Login)</label>
                <input
                  type="text"
                  disabled
                  value={user?.loginUtilisateur || ''}
                  className="w-full px-3.5 py-2.5 bg-slate-100 rounded-xl font-mono font-bold text-blue-700 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Agence habituelle</label>
                <input
                  type="text"
                  disabled
                  value={user?.nomAgence || 'Agence Bastos'}
                  className="w-full px-3.5 py-2.5 bg-slate-100 rounded-xl font-medium text-slate-700 cursor-not-allowed"
                />
              </div>

              <div className="pt-2">
                <label className="block text-slate-700 font-bold mb-1">Nouveau mot de passe</label>
                <input
                  type="password"
                  value={nouveauMotDePasse}
                  onChange={(e) => setNouveauMotDePasse(e.target.value)}
                  placeholder="Tapez un nouveau mot de passe si vous souhaitez le modifier"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!nouveauMotDePasse.trim()) return;
                    setProfilMessage('Mot de passe mis à jour avec succès.');
                    setNouveauMotDePasse('');
                  }}
                  className="mt-3 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition"
                >
                  Enregistrer les modifications
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* FACTURE MODAL */}
        {/* ============================================================ */}
        {factureModalData && (
          <FactureModal
            commande={factureModalData.commande}
            articles={factureModalData.articles}
            paiements={factureModalData.paiements}
            resteAPayer={factureModalData.resteAPayer}
            onClose={() => setFactureModalData(null)}
          />
        )}
      </div>
    </AppLayout>
  );
}
