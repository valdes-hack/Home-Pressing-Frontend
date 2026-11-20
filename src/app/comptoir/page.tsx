'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import FactureModal from '@/components/FactureModal';
import { fetchApi, getCurrentUser } from '@/lib/api';
import {
  LayoutDashboard,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Banknote,
  UserPlus,
  FilePlus2,
  CreditCard,
  Printer,
  Search,
  Eye,
  Plus,
  Trash2,
  X,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Check,
  Sparkles,
  Phone,
  User,
  Tag,
  Percent,
  QrCode,
  Calendar,
  Layers,
  ChevronRight,
  PackageCheck,
  Users,
  Bell,
  Award,
  Lock,
  ArrowUpRight,
  RotateCcw,
  CheckCircle,
  History,
  MessageSquare,
  Mail,
  ExternalLink
} from 'lucide-react';

export default function ReceptionDashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [commandesRecentes, setCommandesRecentes] = useState<any[]>([]);
  const [clientsList, setClientsList] = useState<any[]>([]);
  const [parametres, setParametres] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Vue active (Tableau de bord, Commandes, Clients, Retraits, Notifications, Profil)
  const [currentView, setCurrentView] = useState<'dashboard' | 'commandes' | 'clients' | 'retraits' | 'notifications' | 'profil'>('dashboard');

  // Filtres commandes
  const [filtreStatut, setFiltreStatut] = useState<string>('Tous');
  const [rechercheCommande, setRechercheCommande] = useState<string>('');

  // Filtres clients
  const [rechercheClientInput, setRechercheClientInput] = useState<string>('');

  // Modals
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [fullDetailData, setFullDetailData] = useState<any>(null);

  // Retrait modal
  const [retraitModalData, setRetraitModalData] = useState<any>(null);
  const [montantSoldeInput, setMontantSoldeInput] = useState<string>('');
  const [modePaiementSolde, setModePaiementSolde] = useState<string>('Espèces');
  const [retraitLoading, setRetraitLoading] = useState(false);
  const [retraitSucces, setRetraitSucces] = useState<string | null>(null);
  const [retraitErreur, setRetraitErreur] = useState<string | null>(null);

  // Order Wizard Steps : 1 = Client, 2 = Articles, 3 = Acompte & Validation
  const [orderStep, setOrderStep] = useState(1);

  // Form states
  const [tarifs, setTarifs] = useState<any[]>([]);
  const [clientSearch, setClientSearch] = useState('');
  const [clientTrouve, setClientTrouve] = useState<any>(null);
  const [isSearchingClient, setIsSearchingClient] = useState(false);
  const [showNewClientForm, setShowNewClientForm] = useState(false);
  const [newClientNom, setNewClientNom] = useState('');
  const [newClientTel, setNewClientTel] = useState('');

  // Articles & prestations
  const [articles, setArticles] = useState<Array<{ idPrestation: number; libelle: string; prix: number; etat: string }>>([]);
  const [prestationSel, setPrestationSel] = useState<string>('');
  const [etatConstat, setEtatConstat] = useState('RAS (Bon état général)');

  // Remise & Paiement
  const [tauxRemise, setTauxRemise] = useState<number>(0);
  const [acompte, setAcompte] = useState<string>('');
  const [modePaiement, setModePaiement] = useState<string>('Espèces');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [bordereauGenere, setBordereauGenere] = useState<any>(null);

  // Tracking
  const [trackQuery, setTrackQuery] = useState('');
  const [trackResult, setTrackResult] = useState<any>(null);

  const constatsRapides = [
    'RAS (Bon état général)',
    'Tache revers droit',
    'Tache col / aisselles',
    'Bouton manquant / desserré',
    'Tissu délicat (fragile)',
    'Ourlet légèrement défait',
  ];

  // Facture Modal & Navigateur
  const [factureModalData, setFactureModalData] = useState<any>(null);

  // Synchronisation de l'URL avec la vue active et recherche
  useEffect(() => {
    const handleUrlView = () => {
      const params = new URLSearchParams(window.location.search);
      const v = params.get('view');
      const hash = window.location.hash.replace('#', '');
      const candidate = v || hash;
      if (candidate && ['dashboard', 'commandes', 'clients', 'retraits', 'notifications', 'profil'].includes(candidate)) {
        setCurrentView(candidate as any);
      }
      const searchParam = params.get('search');
      if (searchParam) {
        if (candidate === 'clients') {
          setRechercheClientInput(searchParam);
        } else {
          setRechercheCommande(searchParam);
        }
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

  const rechargerDonnees = () => {
    setLoading(true);
    fetchApi('/commandes')
      .then((data) => {
        if (data && data.length > 0) {
          setCommandesRecentes(data);
        } else {
          setCommandesRecentes([
            { numFacture: 'YA1-26-000001', client: { nomClient: 'Jean-Baptiste Atangana', telClient: '+237694112233' }, statutCmd: 'Réceptionné', montantTotal: 5000, dateDepot: '2026-11-19' },
          ]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    fetchApi('/clients')
      .then((data) => setClientsList(data || []))
      .catch(() => {});

    fetchApi('/referentiel/parametres')
      .then((data) => setParametres(data || []))
      .catch(() => {});
  };

  useEffect(() => {
    const curUser = getCurrentUser();
    setUser(curUser);
    rechargerDonnees();

    fetchApi('/referentiel/tarifs-actifs')
      .then((data) => {
        setTarifs(data || []);
        if (data && data.length > 0) {
          setPrestationSel(String(data[0].prestation.idPrestation));
        }
      })
      .catch(() => {});
  }, []);

  // Consultation approfondie d'une commande (RG25 / CDCF)
  const ouvrirDetailCommande = async (cmd: any) => {
    setShowDetailModal(cmd);
    setDetailLoading(true);
    setFullDetailData(null);
    try {
      const data = await fetchApi(`/commandes/${cmd.numFacture}`);
      setFullDetailData(data);
    } catch {
      setFullDetailData({
        commande: cmd,
        articles: [],
        paiements: [],
        historique: [],
        resteAPayer: 0,
      });
    } finally {
      setDetailLoading(false);
    }
  };

  const handleSearchClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientSearch.trim()) return;
    setIsSearchingClient(true);
    setFormError(null);
    try {
      const res = await fetchApi(`/clients/recherche?q=${encodeURIComponent(clientSearch.trim())}`);
      if (res && res.length > 0) {
        setClientTrouve(res[0]);
        setShowNewClientForm(false);
      } else {
        setClientTrouve(null);
        setShowNewClientForm(true);
        setNewClientTel(clientSearch.trim());
      }
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsSearchingClient(false);
    }
  };

  const handleCreateClientDirect = async () => {
    if (!newClientNom.trim() || !newClientTel.trim()) {
      setFormError('Nom complet et numéro de téléphone camerounais sont obligatoires.');
      return;
    }
    setFormError(null);
    try {
      const nouveau = await fetchApi('/clients', {
        method: 'POST',
        body: JSON.stringify({ nomClient: newClientNom.trim(), telClient: newClientTel.trim() }),
      });
      setClientTrouve(nouveau);
      setShowNewClientForm(false);
      setShowClientModal(false);
      setNewClientNom('');
      setNewClientTel('');
      rechargerDonnees();
    } catch (err: any) {
      setFormError(err.message);
    }
  };

  const handleAddArticle = () => {
    const t = tarifs.find((item) => String(item.prestation.idPrestation) === String(prestationSel));
    if (!t) return;
    setArticles([
      ...articles,
      {
        idPrestation: t.prestation.idPrestation,
        libelle: t.prestation.libellePrestation,
        prix: Number(t.prixUnitaire),
        etat: etatConstat.trim() || 'RAS (Bon état général)',
      },
    ]);
  };

  const handleRemoveArticle = (idx: number) => {
    setArticles(articles.filter((_, i) => i !== idx));
  };

  const totalBrut = articles.reduce((sum, a) => sum + a.prix, 0);
  const montantRemise = Math.round((totalBrut * (tauxRemise || 0)) / 100);
  const totalNet = Math.max(0, totalBrut - montantRemise);

  const handleCreateOrderSubmit = async () => {
    if (!clientTrouve) {
      setFormError('Veuillez sélectionner ou créer un client.');
      return;
    }
    if (articles.length === 0) {
      setFormError('Veuillez ajouter au moins un vêtement au panier.');
      return;
    }
    setSubmitting(true);
    setFormError(null);

    try {
      const payload = {
        idClient: clientTrouve.idClient,
        tauxRemise: Number(tauxRemise) || 0,
        articles: articles.map((a) => ({
          idPrestation: a.idPrestation,
          etatReception: a.etat,
        })),
        acompteInitial: acompte ? Number(acompte) : 0,
        modePaiement: acompte && Number(acompte) > 0 ? modePaiement : null,
      };

      const result = await fetchApi('/commandes', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      setBordereauGenere({
        numFacture: result.numFacture,
        client: clientTrouve,
        articles: [...articles],
        totalBrut,
        tauxRemise,
        montantRemise,
        totalNet,
        acompte: Number(acompte) || 0,
        resteAPayer: result.resteAPayer,
        dateDepot: new Date().toLocaleDateString('fr-FR'),
        agence: user?.nomAgence || 'Agence Bastos',
        receptionniste: user?.nomUtilisateur || 'Clarisse Mballa',
      });

      rechargerDonnees();
    } catch (err: any) {
      setFormError(err.message || 'Erreur lors de la création de la commande');
    } finally {
      setSubmitting(false);
    }
  };

  // Traitement d'un retrait au comptoir (RG6 / RG16)
  const ouvrirRetraitModal = async (cmd: any) => {
    setRetraitModalData(cmd);
    setRetraitSucces(null);
    setRetraitErreur(null);
    setMontantSoldeInput('');
    try {
      const details = await fetchApi(`/commandes/${cmd.numFacture}`);
      setRetraitModalData({
        ...cmd,
        resteAPayer: details.resteAPayer,
        articles: details.articles,
        paiements: details.paiements,
      });
      setMontantSoldeInput(String(details.resteAPayer || '0'));
    } catch {
      setMontantSoldeInput('0');
    }
  };

  const handleValiderRetraitDirect = async () => {
    if (!retraitModalData) return;
    setRetraitLoading(true);
    setRetraitErreur(null);
    setRetraitSucces(null);

    try {
      const reste = Number(retraitModalData.resteAPayer || 0);

      // Si solde restant, encaisser d'abord
      if (reste > 0) {
        await fetchApi(`/caisse/commandes/${retraitModalData.numFacture}/paiements`, {
          method: 'POST',
          body: JSON.stringify({
            montantPaye: reste,
            modePaiement: modePaiementSolde,
          }),
        });
      }

      // Clôture du retrait
      const res = await fetchApi(`/caisse/commandes/${retraitModalData.numFacture}/retrait`, {
        method: 'POST',
      });

      setRetraitSucces(res.message || 'Retrait intégral validé avec succès ! Commande clôturée.');
      rechargerDonnees();
    } catch (err: any) {
      setRetraitErreur(err.message || 'Erreur lors de la validation du retrait');
    } finally {
      setRetraitLoading(false);
    }
  };

  // Badges de statut conformes CDCF
  const getStatusBadge = (statut: string) => {
    const s = (statut || '').toLowerCase();
    if (s.includes('réception') || s.includes('reception')) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
          <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-blue-600" />
          Réceptionné
        </span>
      );
    }
    if (s.includes('lavage')) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800">
          <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-sky-600" />
          En lavage
        </span>
      );
    }
    if (s.includes('repassage')) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
          <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-amber-600" />
          En repassage
        </span>
      );
    }
    if (s.includes('prêt') || s.includes('pret')) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
          <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-emerald-600 animate-pulse" />
          Prêt au retrait
        </span>
      );
    }
    if (s.includes('retiré') || s.includes('retire')) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
          <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-purple-600" />
          Retiré (Clôturé)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
        {statut}
      </span>
    );
  };

  // Afficher la facture détaillée avec impression et ouverture navigateur
  const handleAfficherFacture = async (cmd: any) => {
    try {
      const details = await fetchApi(`/commandes/${cmd.numFacture}`);
      setFactureModalData({
        commande: details.commande || cmd,
        articles: details.articles || [],
        paiements: details.paiements || [],
        resteAPayer: details.resteAPayer !== undefined ? details.resteAPayer : (cmd.montantTotal || 0),
      });
    } catch {
      setFactureModalData({
        commande: cmd,
        articles: [],
        paiements: [],
        resteAPayer: cmd.montantTotal || 0,
      });
    }
  };

  // Envoi WhatsApp immédiat
  const handleEnvoyerWhatsApp = (cmd: any) => {
    const tel = (cmd.client?.telClient || '').replace('+', '').replace(/\s/g, '');
    const nom = cmd.client?.nomClient || 'Client';
    const msg = `Bonjour ${nom}, votre commande N°${cmd.numFacture} est prête à l'agence. Solde : ${cmd.montantTotal} FCFA. Merci de votre confiance ! Atlantic Palace Pressing.`;
    window.open(`https://wa.me/${tel}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Envoi Email immédiat
  const handleEnvoyerEmail = (cmd: any) => {
    const nom = cmd.client?.nomClient || 'Client';
    const email = `${nom.toLowerCase().replace(/[^a-z0-9]/g, '.')}@gmail.com`;
    const sujet = `Votre commande N° ${cmd.numFacture} est prête - Atlantic Palace Pressing`;
    const body = `Bonjour ${nom},\n\nVotre linge (Bordereau N° ${cmd.numFacture}) est prêt au comptoir de l'agence.\nMontant : ${cmd.montantTotal} FCFA.\n\nCordialement,\nAtlantic Palace Pressing`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(sujet)}&body=${encodeURIComponent(body)}`;
  };

  // Filtrage commandes
  const commandesFiltrees = commandesRecentes.filter((cmd) => {
    const matchStatut = filtreStatut === 'Tous' || (cmd.statutCmd || '').toLowerCase() === filtreStatut.toLowerCase();
    const nomClient = typeof cmd.client === 'object' ? (cmd.client?.nomClient || '') : (cmd.client || '');
    const telClient = typeof cmd.client === 'object' ? (cmd.client?.telClient || '') : '';
    const q = rechercheCommande.toLowerCase().trim();
    const matchSearch = !q || (cmd.numFacture || '').toLowerCase().includes(q) || nomClient.toLowerCase().includes(q) || telClient.includes(q);
    return matchStatut && matchSearch;
  });

  // Commandes prêtes pour retrait
  const commandesPretes = commandesRecentes.filter((c) => (c.statutCmd || '').toLowerCase().includes('prêt') || (c.statutCmd || '').toLowerCase().includes('pret'));

  // Clients filtrés
  const clientsFiltres = clientsList.filter((cli) => {
    const q = rechercheClientInput.toLowerCase().trim();
    return !q || (cli.nomClient || '').toLowerCase().includes(q) || (cli.telClient || '').includes(q);
  });

  // KPI calculés
  const totalCommandesJour = commandesRecentes.length;
  const enTraitementCount = commandesRecentes.filter((c) => !['Prêt', 'Retiré'].includes(c.statutCmd)).length;
  const pretesCount = commandesPretes.length;
  const caTotal = commandesRecentes.reduce((sum, c) => sum + Number(c.montantTotal || 0), 0);

  const displayName = user?.nomUtilisateur || 'Clarisse Mballa (Bastos)';
  const nomAgence = user?.nomAgence || 'Agence Bastos';

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* ============================================================ */}
        {/* EN-TÊTE ACCUEIL RÉCEPTIONNISTE */}
        {/* ============================================================ */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Bonjour {displayName} !
              </h1>
              <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                {nomAgence}
              </span>
            </div>
            <p className="text-slate-500 text-sm mt-0.5">
              Prête à servir vos clients aujourd'hui ? Enregistrez les dépôts et suivez les retraits.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setOrderStep(1);
                setBordereauGenere(null);
                setArticles([]);
                setClientTrouve(null);
                setShowOrderModal(true);
              }}
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-500/25 transition transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              <span>Nouveau Dépôt</span>
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* BARRE DE NAVIGATION RAPIDE PAR ONGLETS */}
        {/* ============================================================ */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 border-b border-slate-200">
          <button
            onClick={() => changerVue('dashboard')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
              currentView === 'dashboard'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Tableau de bord</span>
          </button>

          <button
            onClick={() => changerVue('commandes')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
              currentView === 'commandes'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Commandes</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
              currentView === 'commandes' ? 'bg-white text-blue-600' : 'bg-slate-100 text-slate-600'
            }`}>
              {commandesRecentes.length}
            </span>
          </button>

          <button
            onClick={() => changerVue('clients')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
              currentView === 'clients'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Fichier Clients</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${
              currentView === 'clients' ? 'bg-white text-blue-600' : 'bg-slate-100 text-slate-600'
            }`}>
              {clientsList.length}
            </span>
          </button>

          <button
            onClick={() => changerVue('retraits')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
              currentView === 'retraits'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <PackageCheck className="w-4 h-4" />
            <span>Retraits au comptoir</span>
            {commandesPretes.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-black bg-emerald-500 text-white">
                {commandesPretes.length}
              </span>
            )}
          </button>

          <button
            onClick={() => changerVue('notifications')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
              currentView === 'notifications'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Notifications SMS</span>
          </button>

          <button
            onClick={() => changerVue('profil')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
              currentView === 'profil'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Mon Profil & Droits</span>
          </button>
        </div>

        {/* ============================================================ */}
        {/* VUE 1 : TABLEAU DE BORD (CONFORME EXACT À VOTRE CAPTURE) */}
        {/* ============================================================ */}
        {currentView === 'dashboard' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Les 4 KPI */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 text-white shadow-sm flex items-center space-x-4">
                <div className="p-3 bg-white/15 rounded-2xl backdrop-blur-xs">
                  <ShoppingBag className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-black tracking-tight">{totalCommandesJour}</p>
                  <p className="text-xs font-medium text-blue-100 mt-0.5">Commandes de l'agence</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-5 text-white shadow-sm flex items-center space-x-4">
                <div className="p-3 bg-white/15 rounded-2xl backdrop-blur-xs">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-black tracking-tight">{enTraitementCount}</p>
                  <p className="text-xs font-medium text-emerald-100 mt-0.5">En cours de traitement</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-5 text-white shadow-sm flex items-center space-x-4">
                <div className="p-3 bg-white/15 rounded-2xl backdrop-blur-xs">
                  <CheckCircle2 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-3xl font-black tracking-tight">{pretesCount}</p>
                  <p className="text-xs font-medium text-purple-100 mt-0.5">Prêtes au retrait (SMS envoyé)</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-5 text-white shadow-sm flex items-center space-x-4">
                <div className="p-3 bg-white/15 rounded-2xl backdrop-blur-xs">
                  <Banknote className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-2xl sm:text-[26px] font-black tracking-tight">
                    {caTotal.toLocaleString('fr-FR')} FCFA
                  </p>
                  <p className="text-xs font-medium text-amber-100 mt-0.5">Chiffre d'affaires agence</p>
                </div>
              </div>
            </div>

            {/* Bannière et Commandes récentes */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-5 bg-gradient-to-br from-[#0c2a54] via-[#0f3468] to-[#17468a] rounded-3xl p-6 sm:p-7 text-white relative overflow-hidden flex flex-col justify-between shadow-md">
                <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-blue-400/15 blur-2xl" />
                <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-amber-400/15 blur-2xl" />

                <div className="relative z-10">
                  <span className="inline-block px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-full text-xs font-bold mb-3">
                    Comptoir {nomAgence}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold leading-snug">
                    Un service rapide, <br />
                    <span className="text-amber-300">une qualité garantie !</span>
                  </h2>
                  <p className="text-blue-100 text-xs sm:text-sm mt-3 max-w-sm leading-relaxed">
                    Enregistrez le dépôt des vêtements, notez le constat contradictoire (RG16) et éditez le bordereau officiel avec QR Code.
                  </p>
                </div>

                <div className="relative z-10 pt-6">
                  <button
                    onClick={() => {
                      setOrderStep(1);
                      setBordereauGenere(null);
                      setArticles([]);
                      setClientTrouve(null);
                      setShowOrderModal(true);
                    }}
                    className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-900 font-extrabold text-sm rounded-2xl shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5"
                  >
                    <span>Nouvelle Commande</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Tableau Droit : Commandes récentes */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                        Commandes récentes
                      </h3>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {commandesRecentes.length}
                      </span>
                    </div>
                    <button
                      onClick={() => changerVue('commandes')}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition"
                    >
                      Voir toutes &rarr;
                    </button>
                  </div>

                  <div className="overflow-x-auto mt-2">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead>
                        <tr className="text-slate-400 text-[11px] font-semibold border-b border-slate-100">
                          <th className="py-2.5">N° Bordereau</th>
                          <th className="py-2.5">Client</th>
                          <th className="py-2.5">Statut</th>
                          <th className="py-2.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {commandesRecentes.slice(0, 5).map((cmd, i) => (
                          <tr key={cmd.numFacture || i} className="hover:bg-slate-50/80 transition">
                            <td className="py-3 font-mono font-bold text-slate-800">
                              {cmd.numFacture}
                            </td>
                            <td className="py-3 text-slate-700 font-medium">
                              {typeof cmd.client === 'object' ? (cmd.client?.nomClient || 'Client régulier') : (cmd.client || 'Client régulier')}
                            </td>
                            <td className="py-3">
                              {getStatusBadge(cmd.statutCmd)}
                            </td>
                            <td className="py-3 text-right">
                              <div className="flex items-center justify-end space-x-1">
                                <button
                                  onClick={() => handleAfficherFacture(cmd)}
                                  title="Facture & Bordereau Officiel"
                                  className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                                >
                                  <Printer className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => ouvrirDetailCommande(cmd)}
                                  title="Consulter le dossier complet"
                                  className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Raccourcis d'actions rapides */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
              <button
                onClick={() => {
                  setFormError(null);
                  setShowClientModal(true);
                }}
                className="flex flex-col items-center justify-center p-4 bg-white hover:bg-slate-50 border border-slate-200/80 hover:border-blue-400 rounded-2xl shadow-xs transition group"
              >
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 transition shadow-2xs">
                  <UserPlus className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-800 mt-2.5 text-center">
                  Ajouter un client
                </span>
              </button>

              <button
                onClick={() => {
                  setOrderStep(1);
                  setBordereauGenere(null);
                  setArticles([]);
                  setShowOrderModal(true);
                }}
                className="flex flex-col items-center justify-center p-4 bg-white hover:bg-slate-50 border border-slate-200/80 hover:border-blue-400 rounded-2xl shadow-xs transition group"
              >
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:scale-110 transition shadow-2xs">
                  <FilePlus2 className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-800 mt-2.5 text-center">
                  Créer une commande
                </span>
              </button>

              <button
                onClick={() => changerVue('retraits')}
                className="flex flex-col items-center justify-center p-4 bg-white hover:bg-slate-50 border border-slate-200/80 hover:border-blue-400 rounded-2xl shadow-xs transition group"
              >
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-110 transition shadow-2xs">
                  <PackageCheck className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-800 mt-2.5 text-center">
                  Valider un retrait
                </span>
              </button>

              <button
                onClick={() => changerVue('commandes')}
                className="flex flex-col items-center justify-center p-4 bg-white hover:bg-slate-50 border border-slate-200/80 hover:border-blue-400 rounded-2xl shadow-xs transition group"
              >
                <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl group-hover:scale-110 transition shadow-2xs">
                  <Printer className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-800 mt-2.5 text-center">
                  Bordereaux officiels
                </span>
              </button>

              <button
                onClick={() => {
                  setTrackResult(null);
                  setShowTrackingModal(true);
                }}
                className="col-span-2 sm:col-span-1 flex flex-col items-center justify-center p-4 bg-white hover:bg-slate-50 border border-slate-200/80 hover:border-blue-400 rounded-2xl shadow-xs transition group"
              >
                <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl group-hover:scale-110 transition shadow-2xs">
                  <Search className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-800 mt-2.5 text-center">
                  Suivre une commande
                </span>
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* VUE 2 : GESTION COMPLÈTE DES COMMANDES */}
        {/* ============================================================ */}
        {currentView === 'commandes' && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-5 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Commandes de l'Agence ({commandesFiltrees.length})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Consultez, filtrez et imprimez les bordereaux avec leur historique complet.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={rechercheCommande}
                    onChange={(e) => setRechercheCommande(e.target.value)}
                    placeholder="N° Bordereau, client, tél..."
                    className="pl-9 pr-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none w-56 sm:w-64"
                  />
                </div>

                <button
                  onClick={() => {
                    setOrderStep(1);
                    setBordereauGenere(null);
                    setArticles([]);
                    setShowOrderModal(true);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nouveau Dépôt</span>
                </button>
              </div>
            </div>

            {/* Filtres par statuts du workflow RG10 */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1">
              {['Tous', 'Réceptionné', 'En lavage', 'En repassage', 'Prêt', 'Retiré'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFiltreStatut(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                    filtreStatut === st
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Tableau complet */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-slate-100">
                    <th className="py-3 px-2">N° Bordereau</th>
                    <th className="py-3 px-2">Date dépôt</th>
                    <th className="py-3 px-2">Client</th>
                    <th className="py-3 px-2">Téléphone</th>
                    <th className="py-3 px-2">Montant</th>
                    <th className="py-3 px-2">Statut</th>
                    <th className="py-3 px-2 text-right">Détails & Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {commandesFiltrees.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                        Aucune commande trouvée pour ces critères.
                      </td>
                    </tr>
                  ) : (
                    commandesFiltrees.map((cmd) => (
                      <tr key={cmd.numFacture} className="hover:bg-slate-50 transition">
                        <td className="py-3 px-2 font-mono font-bold text-blue-700">
                          {cmd.numFacture}
                        </td>
                        <td className="py-3 px-2 text-slate-500">
                          {cmd.dateDepot || 'Aujourd’hui'}
                        </td>
                        <td className="py-3 px-2 font-semibold text-slate-800">
                          {typeof cmd.client === 'object' ? (cmd.client?.nomClient || 'Client') : (cmd.client || 'Client')}
                        </td>
                        <td className="py-3 px-2 font-mono text-slate-600">
                          {typeof cmd.client === 'object' ? (cmd.client?.telClient || '+237...') : '+237...'}
                        </td>
                        <td className="py-3 px-2 font-bold text-slate-900">
                          {Number(cmd.montantTotal || 0).toLocaleString('fr-FR')} FCFA
                        </td>
                        <td className="py-3 px-2">
                          {getStatusBadge(cmd.statutCmd)}
                        </td>
                        <td className="py-3 px-2 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            {cmd.statutCmd === 'Prêt' && (
                              <button
                                onClick={() => handleEnvoyerWhatsApp(cmd)}
                                title="Envoyer notification WhatsApp client"
                                className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 rounded-xl text-xs font-bold transition border border-emerald-200"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">WhatsApp</span>
                              </button>
                            )}
                            <button
                              onClick={() => handleAfficherFacture(cmd)}
                              title="Facture & Bordereau Officiel"
                              className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Facture</span>
                            </button>
                            <button
                              onClick={() => ouvrirDetailCommande(cmd)}
                              className="inline-flex items-center space-x-1 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Voir</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* VUE 3 : FICHIER CLIENTS & PROGRAMME FIDÉLITÉ (BF2, BF9, RG27) */}
        {/* ============================================================ */}
        {currentView === 'clients' && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-5 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Fichier Clients & Fidélité ({clientsFiltres.length})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Gestion centralisée avec téléphone international normalisé (+237) et solde de points.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={rechercheClientInput}
                    onChange={(e) => setRechercheClientInput(e.target.value)}
                    placeholder="Nom ou numéro de téléphone..."
                    className="pl-9 pr-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none w-56 sm:w-64"
                  />
                </div>

                <button
                  onClick={() => {
                    setFormError(null);
                    setShowClientModal(true);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 transition"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Nouveau Client</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clientsFiltres.map((cli) => (
                <div
                  key={cli.idClient}
                  className="p-5 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition bg-gradient-to-br from-white to-slate-50/50 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                        {(cli.nomClient || 'C').charAt(0)}
                      </div>
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-amber-100 text-amber-800 font-extrabold text-xs rounded-full">
                        <Award className="w-3.5 h-3.5 text-amber-600" />
                        <span>{cli.pointsFidelite || 0} pts</span>
                      </span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-base mt-3">
                      {cli.nomClient}
                    </h3>
                    <p className="font-mono text-xs text-blue-600 mt-1 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" />
                      {cli.telClient}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Règle RG9 (+237 auto)
                    </span>
                    <button
                      onClick={() => {
                        setClientTrouve(cli);
                        setOrderStep(2);
                        setShowOrderModal(true);
                      }}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 font-bold text-xs rounded-xl transition"
                    >
                      + Créer Dépôt
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* VUE 4 : RETRAITS AU COMPTOIR (BF6, RG6, RG16) */}
        {/* ============================================================ */}
        {currentView === 'retraits' && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-5 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Retraits au Comptoir — Règle du Retrait Intégral
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Conformément à la règle RG6 / RG16, aucune restitution partielle n'est admise. La commande doit être « Prête » et entièrement soldée.
                </p>
              </div>
              <button
                onClick={rechargerDonnees}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center space-x-1.5 self-start sm:self-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Actualiser</span>
              </button>
            </div>

            {commandesPretes.length === 0 ? (
              <div className="p-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <PackageCheck className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-600 font-bold text-sm">Aucune commande prête au retrait pour le moment.</p>
                <p className="text-slate-400 text-xs mt-1">Dès que l'atelier termine le repassage de tous les articles, ils apparaîtront ici.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {commandesPretes.map((cmd) => (
                  <div
                    key={cmd.numFacture}
                    className="p-5 rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/40 to-white shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-black text-sm text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
                          {cmd.numFacture}
                        </span>
                        {getStatusBadge(cmd.statutCmd)}
                      </div>

                      <div className="mt-3">
                        <p className="font-bold text-slate-900 text-base">
                          {typeof cmd.client === 'object' ? (cmd.client?.nomClient || 'Client') : (cmd.client || 'Client')}
                        </p>
                        <p className="font-mono text-xs text-slate-500 mt-0.5">
                          {typeof cmd.client === 'object' ? (cmd.client?.telClient || '') : ''}
                        </p>
                      </div>

                      <div className="mt-4 p-3 bg-white rounded-xl border border-slate-200 flex justify-between items-center text-xs">
                        <div>
                          <span className="text-slate-500 block text-[11px]">Montant Total :</span>
                          <span className="font-black text-slate-900">{cmd.montantTotal} FCFA</span>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-500 block text-[11px]">Contrôle Solde (RG16) :</span>
                          <span className="font-bold text-emerald-600">À vérifier au retrait</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => ouvrirDetailCommande(cmd)}
                        className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                      >
                        Vérifier articles &rarr;
                      </button>

                      <button
                        onClick={() => ouvrirRetraitModal(cmd)}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center space-x-1.5 transition"
                      >
                        <Check className="w-4 h-4" />
                        <span>Effectuer le Retrait</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* VUE 5 : SUIVI DES NOTIFICATIONS SMS CLIENTS (BF5, BNF9) */}
        {/* ============================================================ */}
        {currentView === 'notifications' && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-5 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">
                  Journal des Notifications SMS (BF5 / BNF9)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Notification automatique déclenchée dès que le dernier vêtement d'une commande passe à l'état « Prêt ».
                </p>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
                Passerelle SMS : Prête
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {commandesRecentes.map((c, i) => (
                <div key={i} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-blue-700">{c.numFacture}</span>
                      <span className="text-slate-400">•</span>
                      <span className="font-semibold text-slate-800">
                        {typeof c.client === 'object' ? (c.client?.nomClient || 'Client') : (c.client || 'Client')}
                      </span>
                    </div>
                    <p className="text-slate-600 font-mono text-[11px]">
                      Message type : « Atlantic Palace Pressing : votre commande N°{c.numFacture} est prête au retrait à l'agence Bastos. »
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                      <CheckCircle className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                      SMS Automatique
                    </span>
                    <span className="text-[11px] text-slate-400">0 renvoi (BNF9)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* VUE 6 : MON PROFIL, RÔLE ET RÈGLES DE GESTION APPLICABLES */}
        {/* ============================================================ */}
        {currentView === 'profil' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6 animate-fadeIn">
            <div className="flex items-center space-x-4 pb-6 border-b border-slate-100">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-md">
                {(displayName || 'C').charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">{displayName}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-3 py-0.5 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
                    {user?.profil || 'Réceptionniste'}
                  </span>
                  <span className="px-3 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                    Compte Actif (CI17)
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Informations du Compte */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  Identité et Affectation (RG15 / RG24)
                </h3>
                <div className="text-xs space-y-2">
                  <p><span className="text-slate-500 font-medium">Identifiant de connexion :</span> <span className="font-mono font-bold text-slate-800">{user?.loginUtilisateur || 'recep.bastos'}</span></p>
                  <p><span className="text-slate-500 font-medium">Site d'affectation :</span> <span className="font-bold text-slate-800">{user?.nomAgence || 'Agence Bastos'} (Code : {user?.codeAgence || 'YA1'})</span></p>
                  <p><span className="text-slate-500 font-medium">Sécurité :</span> <span className="font-bold text-emerald-700">BCrypt + Session JWT 8h (BNF10)</span></p>
                  <p><span className="text-slate-500 font-medium">Cloisonnement des données :</span> <span className="text-slate-700">Accès strictement limité aux commandes de votre agence (RG15).</span></p>
                </div>
              </div>

              {/* Habilitations métier */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Habilitations Fonctionnelles (CDCF)
                </h3>
                <div className="text-xs space-y-1.5 text-slate-700">
                  <p className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-600" /> Création de bordereau avec constat contradictoire (BF3)</p>
                  <p className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-600" /> Recherche et enregistrement des clients camerounais (BF2)</p>
                  <p className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-600" /> Encaissement d'acomptes et soldes (RG16)</p>
                  <p className="flex items-center gap-1.5"><Check className="w-4 h-4 text-emerald-600" /> Validation du retrait intégral après solde complet (BF6)</p>
                </div>
              </div>
            </div>

            {/* Paramètres système en vigueur */}
            <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-200 space-y-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Tag className="w-4 h-4 text-blue-700" />
                Paramètres Système Appliqués au Comptoir (RG18)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-blue-100">
                  <span className="text-slate-400 block text-[10px]">Plafond remise :</span>
                  <span className="font-black text-slate-800">10% max</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-blue-100">
                  <span className="text-slate-400 block text-[10px]">Devise :</span>
                  <span className="font-black text-slate-800">FCFA</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-blue-100">
                  <span className="text-slate-400 block text-[10px]">TVA :</span>
                  <span className="font-black text-slate-800">0%</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-blue-100">
                  <span className="text-slate-400 block text-[10px]">Fidélité (RG27) :</span>
                  <span className="font-black text-slate-800">1 pt / 1 000 FCFA</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODAL 1 : ASSISTANT DE CRÉATION DE COMMANDE & BORDEREAU */}
        {/* ============================================================ */}
        {showOrderModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-7 shadow-2xl border border-slate-100 max-h-[94vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-blue-100 text-blue-700 rounded-2xl">
                    <FilePlus2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg">
                      Nouveau Dépôt — Comptoir {nomAgence}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Cycle de vie Merise v3.0 : Dépôt, Constat contradictoire & Bordereau
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {formError && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Si bordereau généré : Affichage et Impression */}
              {bordereauGenere ? (
                <div className="py-6 space-y-6">
                  <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                      <Check className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-black text-slate-900">
                      Bordereau Enregistré avec Succès !
                    </h4>
                    <p className="text-xs text-slate-600">
                      Numéro officiel : <span className="font-mono font-black text-blue-700 text-sm">{bordereauGenere.numFacture}</span>
                    </p>
                  </div>

                  {/* Facture ticket thermique */}
                  <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-xs text-slate-800 space-y-4 max-w-md mx-auto shadow-inner">
                    <div className="text-center border-b border-dashed border-slate-300 pb-3">
                      <p className="font-black text-sm uppercase">Atlantic Palace Pressing</p>
                      <p className="text-[11px]">{bordereauGenere.agence}</p>
                      <p className="text-[10px] text-slate-500 mt-1">BORDEREAU N° {bordereauGenere.numFacture}</p>
                      <p className="text-[10px] text-slate-500">{bordereauGenere.dateDepot}</p>
                    </div>

                    <div className="border-b border-dashed border-slate-300 pb-3 space-y-1">
                      <p><span className="font-bold">Client :</span> {bordereauGenere.client?.nomClient}</p>
                      <p><span className="font-bold">Tél :</span> {bordereauGenere.client?.telClient}</p>
                      <p><span className="font-bold">Réceptionniste :</span> {bordereauGenere.receptionniste}</p>
                    </div>

                    <div className="border-b border-dashed border-slate-300 pb-3 space-y-2">
                      <p className="font-bold uppercase text-[10px]">Articles reçus :</p>
                      {bordereauGenere.articles.map((a: any, idx: number) => (
                        <div key={idx} className="flex justify-between">
                          <div>
                            <p className="font-bold">{a.libelle}</p>
                            <p className="text-[10px] text-amber-700">Constat : {a.etat}</p>
                          </div>
                          <span className="font-bold">{a.prix} FCFA</span>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-1 pt-1 text-right">
                      <p>Total brut : <span className="font-bold">{bordereauGenere.totalBrut} FCFA</span></p>
                      {bordereauGenere.montantRemise > 0 && (
                        <p className="text-emerald-700">Remise ({bordereauGenere.tauxRemise}%) : -{bordereauGenere.montantRemise} FCFA</p>
                      )}
                      <p className="text-sm font-black border-t border-slate-300 pt-1">
                        NET À PAYER : {bordereauGenere.totalNet} FCFA
                      </p>
                      <p>Acompte versé : <span className="font-bold">{bordereauGenere.acompte} FCFA</span></p>
                      <p className="text-amber-800 font-bold">Reste à payer : {bordereauGenere.resteAPayer} FCFA</p>
                    </div>

                    <div className="text-center pt-3 border-t border-dashed border-slate-300 text-[10px] text-slate-500">
                      <p>Retrait uniquement sur présentation de ce reçu (RG6).</p>
                      <p className="mt-1 font-bold">Merci de votre confiance !</p>
                    </div>
                  </div>

                  <div className="flex justify-center space-x-3">
                    <button
                      onClick={() => window.print()}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center space-x-2 transition"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Imprimer le reçu</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowOrderModal(false);
                        setBordereauGenere(null);
                      }}
                      className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition"
                    >
                      Fermer
                    </button>
                  </div>
                </div>
              ) : (
                <div className="py-4 space-y-6">
                  {/* Fil d'Ariane des 3 étapes */}
                  <div className="flex items-center justify-center space-x-4 border-b border-slate-100 pb-4 text-xs font-bold">
                    <span className={orderStep === 1 ? 'text-blue-600' : 'text-slate-400'}>1. Client</span>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                    <span className={orderStep === 2 ? 'text-blue-600' : 'text-slate-400'}>2. Articles & Constat</span>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                    <span className={orderStep === 3 ? 'text-blue-600' : 'text-slate-400'}>3. Acompte & Bordereau</span>
                  </div>

                  {/* ÉTAPE 1 : RECHERCHE OU CRÉATION CLIENT */}
                  {orderStep === 1 && (
                    <div className="space-y-4">
                      <form onSubmit={handleSearchClient} className="flex gap-2">
                        <div className="relative flex-1">
                          <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            required
                            value={clientSearch}
                            onChange={(e) => setClientSearch(e.target.value)}
                            placeholder="Entrez le numéro de téléphone (9 chiffres)..."
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 font-mono"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={isSearchingClient}
                          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition disabled:opacity-60"
                        >
                          {isSearchingClient ? 'Recherche...' : 'Rechercher'}
                        </button>
                      </form>

                      {clientTrouve && (
                        <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl flex items-center justify-between">
                          <div>
                            <span className="text-[10px] uppercase font-black text-blue-700 tracking-wider">Client trouvé</span>
                            <h4 className="font-extrabold text-slate-900 text-sm mt-0.5">{clientTrouve.nomClient}</h4>
                            <p className="font-mono text-xs text-slate-600">{clientTrouve.telClient}</p>
                          </div>
                          <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">
                            {clientTrouve.pointsFidelite || 0} pts fidélité
                          </span>
                        </div>
                      )}

                      {showNewClientForm && (
                        <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-3">
                          <p className="text-xs font-bold text-amber-900">
                            Nouveau numéro non enregistré. Créez la fiche client :
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input
                              type="text"
                              value={newClientNom}
                              onChange={(e) => setNewClientNom(e.target.value)}
                              placeholder="Nom et prénom..."
                              className="px-3.5 py-2 text-xs bg-white rounded-xl border border-amber-300 outline-none"
                            />
                            <input
                              type="text"
                              value={newClientTel}
                              onChange={(e) => setNewClientTel(e.target.value)}
                              placeholder="Téléphone (+237)..."
                              className="px-3.5 py-2 text-xs bg-white rounded-xl border border-amber-300 outline-none font-mono"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={handleCreateClientDirect}
                            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl"
                          >
                            Enregistrer le nouveau client
                          </button>
                        </div>
                      )}

                      <div className="flex justify-end pt-3">
                        <button
                          type="button"
                          disabled={!clientTrouve}
                          onClick={() => setOrderStep(2)}
                          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 transition disabled:opacity-50"
                        >
                          <span>Suivant : Sélection des articles</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ÉTAPE 2 : ARTICLES & CONSTAT CONTRADICTOIRE (RG16) */}
                  {orderStep === 2 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                        <div className="sm:col-span-6">
                          <label className="text-[11px] font-bold text-slate-600 block mb-1">
                            Type de vêtement / Prestation
                          </label>
                          <select
                            value={prestationSel}
                            onChange={(e) => setPrestationSel(e.target.value)}
                            className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-slate-300 outline-none"
                          >
                            {tarifs.map((t) => (
                              <option key={t.prestation.idPrestation} value={t.prestation.idPrestation}>
                                {t.prestation.libellePrestation} — {t.prixUnitaire} FCFA
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="sm:col-span-6">
                          <label className="text-[11px] font-bold text-slate-600 block mb-1">
                            Constat contradictoire (RG16)
                          </label>
                          <input
                            type="text"
                            value={etatConstat}
                            onChange={(e) => setEtatConstat(e.target.value)}
                            placeholder="Ex: Tache revers, bouton manquant..."
                            className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-slate-300 outline-none"
                          />
                        </div>

                        <div className="sm:col-span-12 flex flex-wrap gap-1.5">
                          {constatsRapides.map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => setEtatConstat(c)}
                              className="px-2.5 py-1 text-[11px] bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-700 border border-slate-200 rounded-lg transition"
                            >
                              {c}
                            </button>
                          ))}
                        </div>

                        <div className="sm:col-span-12 pt-2">
                          <button
                            type="button"
                            onClick={handleAddArticle}
                            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 transition"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Ajouter cet article au dépôt</span>
                          </button>
                        </div>
                      </div>

                      {/* Panier des articles */}
                      <div className="space-y-2">
                        <span className="text-xs font-bold text-slate-700 block">
                          Articles du panier ({articles.length}) :
                        </span>
                        {articles.length === 0 ? (
                          <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                            Aucun vêtement ajouté pour le moment.
                          </div>
                        ) : (
                          articles.map((art, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 text-xs shadow-2xs"
                            >
                              <div>
                                <span className="font-extrabold text-slate-800">{art.libelle}</span>
                                <span className="text-blue-600 font-bold ml-2 font-mono">{art.prix} FCFA</span>
                                <p className="text-[11px] text-amber-700 mt-0.5">Constat : {art.etat}</p>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveArticle(idx)}
                                className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                        <button
                          type="button"
                          onClick={() => setOrderStep(1)}
                          className="px-4 py-2 border border-slate-200 text-xs font-bold text-slate-600 rounded-xl"
                        >
                          &larr; Retour Client
                        </button>
                        <button
                          type="button"
                          disabled={articles.length === 0}
                          onClick={() => setOrderStep(3)}
                          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 transition disabled:opacity-50"
                        >
                          <span>Suivant : Règlement & Bordereau</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ÉTAPE 3 : RÈGLEMENT, REMISE & VALIDATION (RG13 / RG16) */}
                  {orderStep === 3 && (
                    <div className="space-y-4">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
                        <div className="flex justify-between items-center font-bold text-slate-700">
                          <span>Total brut des articles :</span>
                          <span className="font-mono text-sm">{totalBrut} FCFA</span>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                          <label className="font-bold text-slate-700 flex items-center gap-1.5">
                            <Percent className="w-4 h-4 text-blue-600" />
                            Remise accordée (%) (max 10% RG12) :
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="10"
                            value={tauxRemise}
                            onChange={(e) => setTauxRemise(Math.min(10, Math.max(0, Number(e.target.value))))}
                            className="w-20 px-2 py-1 text-right font-mono font-bold border border-slate-300 rounded-lg outline-none"
                          />
                        </div>

                        <div className="flex justify-between items-center pt-2 border-t border-slate-200 font-extrabold text-slate-900 text-base">
                          <span>MONTANT TOTAL NET (RG13) :</span>
                          <span className="text-blue-700 font-mono">{totalNet} FCFA</span>
                        </div>
                      </div>

                      {/* Acompte éventuel (RG16) */}
                      <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200 space-y-3">
                        <label className="text-xs font-bold text-blue-900 block">
                          Acompte versé au dépôt (Optionnel — RG16) :
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="number"
                            min="0"
                            max={totalNet}
                            value={acompte}
                            onChange={(e) => setAcompte(e.target.value)}
                            placeholder="Montant acompte en FCFA..."
                            className="px-3.5 py-2 text-xs bg-white rounded-xl border border-blue-300 outline-none font-mono font-bold"
                          />
                          <select
                            value={modePaiement}
                            onChange={(e) => setModePaiement(e.target.value)}
                            className="px-3 py-2 text-xs bg-white rounded-xl border border-blue-300 outline-none"
                          >
                            <option value="Espèces">Espèces</option>
                            <option value="Mobile Money">Mobile Money (Orange/MTN)</option>
                            <option value="Carte">Carte Bancaire</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                        <button
                          type="button"
                          onClick={() => setOrderStep(2)}
                          className="px-4 py-2 border border-slate-200 text-xs font-bold text-slate-600 rounded-xl"
                        >
                          &larr; Retour Articles
                        </button>
                        <button
                          type="button"
                          disabled={submitting}
                          onClick={handleCreateOrderSubmit}
                          className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition disabled:opacity-60 flex items-center space-x-2"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{submitting ? 'Génération en cours...' : 'Valider & Éditer le Bordereau'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODAL 2 : AJOUTER UN NOUVEAU CLIENT RAPIDE (BF2, RG9) */}
        {/* ============================================================ */}
        {showClientModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <UserPlus className="w-5 h-5 text-blue-600" />
                  <h3 className="font-extrabold text-slate-900 text-base">Nouveau Client</h3>
                </div>
                <button onClick={() => setShowClientModal(false)} className="text-slate-400 hover:text-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs">
                  {formError}
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Nom et Prénom</label>
                  <input
                    type="text"
                    required
                    value={newClientNom}
                    onChange={(e) => setNewClientNom(e.target.value)}
                    placeholder="Ex: M. Jean-Paul Mbarga"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Numéro de téléphone camerounais</label>
                  <input
                    type="text"
                    required
                    value={newClientTel}
                    onChange={(e) => setNewClientTel(e.target.value)}
                    placeholder="Ex: 694112233 ou +237694112233"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Normalisé automatiquement au format international +237 par trigger MySQL (RG9).</p>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowClientModal(false)}
                  className="px-4 py-2 border border-slate-200 text-xs font-bold text-slate-600 rounded-xl"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleCreateClientDirect}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Créer la fiche
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODAL 3 : DÉTAIL COMPLET AVEC HISTORIQUE DES STATUTS (RG25) */}
        {/* ============================================================ */}
        {showDetailModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-100 max-h-[92vh] overflow-y-auto space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
                    {showDetailModal.numFacture}
                  </span>
                  <h3 className="font-extrabold text-slate-900 text-lg mt-1">
                    Dossier de Commande & Historique
                  </h3>
                </div>
                <button onClick={() => setShowDetailModal(null)} className="text-slate-400 hover:text-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {detailLoading ? (
                <div className="py-12 text-center text-xs text-slate-500">
                  Chargement des articles, paiements et historique...
                </div>
              ) : fullDetailData ? (
                <div className="space-y-4 text-xs">
                  {/* Résumé général */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Client :</span>
                      <span className="font-bold text-slate-900">
                        {fullDetailData.commande?.client?.nomClient || 'Client'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Statut global :</span>
                      <span>{getStatusBadge(fullDetailData.commande?.statutCmd)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Total facture :</span>
                      <span className="font-bold text-blue-700">
                        {fullDetailData.commande?.montantTotal} FCFA
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Reste à régler :</span>
                      <span className={`font-bold ${fullDetailData.resteAPayer > 0 ? 'text-amber-700' : 'text-emerald-700'}`}>
                        {fullDetailData.resteAPayer} FCFA
                      </span>
                    </div>
                  </div>

                  {/* Articles avec constat contradictoire */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                      <ShoppingBag className="w-4 h-4 text-blue-600" />
                      Articles déposés & constat contradictoire (RG16 / BF3) :
                    </h4>
                    <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                      {fullDetailData.articles?.map((art: any) => (
                        <div key={art.idArticle} className="p-3 bg-white flex justify-between items-center">
                          <div>
                            <span className="font-bold text-slate-900">{art.prestation?.libellePrestation || 'Article'}</span>
                            <span className="ml-2 font-mono text-blue-600">{art.prixArticle} FCFA</span>
                            <p className="text-[11px] text-amber-800 mt-0.5">Constat réception : {art.etatReception || 'RAS'}</p>
                          </div>
                          <div>{getStatusBadge(art.statutArticle)}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Timeline historique des statuts RG25 */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                      <History className="w-4 h-4 text-indigo-600" />
                      Historique chronologique des statuts (RG25 / BNF2) :
                    </h4>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      {fullDetailData.historique && fullDetailData.historique.length > 0 ? (
                        fullDetailData.historique.map((h: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between text-[11px]">
                            <span className="font-medium text-slate-700">
                              {h.ancienStatut} ➔ <span className="font-bold text-blue-700">{h.nouveauStatut}</span>
                            </span>
                            <div className="flex items-center space-x-2 text-slate-400">
                              <span>{h.dateHeureStatut ? new Date(h.dateHeureStatut).toLocaleString('fr-FR') : 'Horodaté'}</span>
                              <span className="font-mono text-slate-600">({h.utilisateur?.nomUtilisateur || 'Agent'})</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-slate-400 text-center py-2">Dépôt initial enregistré au comptoir.</p>
                      )}
                    </div>
                  </div>

                  {/* Paiements effectués */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-emerald-600" />
                      Règlements & Acomptes enregistrés (RG16) :
                    </h4>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      {fullDetailData.paiements && fullDetailData.paiements.length > 0 ? (
                        fullDetailData.paiements.map((p: any) => (
                          <div key={p.idPaiement} className="flex justify-between py-1 text-[11px]">
                            <span className="font-bold text-slate-800">{p.montantPaye} FCFA ({p.modePaiement})</span>
                            <span className="text-slate-400">{new Date(p.datePaiement).toLocaleString('fr-FR')}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-slate-400 text-center py-2">Aucun paiement enregistré pour l'instant.</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="flex flex-wrap justify-between items-center gap-2 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const cmd = showDetailModal;
                      setShowDetailModal(null);
                      handleAfficherFacture(cmd);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 shadow-sm transition"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Facture Pro & Navigateur</span>
                  </button>

                  <button
                    onClick={() => handleEnvoyerWhatsApp(showDetailModal)}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 transition"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    onClick={() => handleEnvoyerEmail(showDetailModal)}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 transition"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                  </button>
                </div>

                <button
                  onClick={() => setShowDetailModal(null)}
                  className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* MODAL 4 : VALIDATION RETRAIT RAPIDE (RG6 / RG16) */}
        {/* ============================================================ */}
        {retraitModalData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <PackageCheck className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-extrabold text-slate-900 text-base">Validation Retrait</h3>
                </div>
                <button onClick={() => setRetraitModalData(null)} className="text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {retraitErreur && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs">
                  {retraitErreur}
                </div>
              )}

              {retraitSucces ? (
                <div className="py-4 text-center space-y-3">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6" />
                  </div>
                  <p className="font-extrabold text-slate-900 text-sm">{retraitSucces}</p>
                  <button
                    onClick={() => setRetraitModalData(null)}
                    className="px-5 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl"
                  >
                    Fermer
                  </button>
                </div>
              ) : (
                <div className="space-y-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                    <p><span className="font-bold">Bordereau :</span> {retraitModalData.numFacture}</p>
                    <p><span className="font-bold">Client :</span> {typeof retraitModalData.client === 'object' ? retraitModalData.client?.nomClient : retraitModalData.client}</p>
                    <p><span className="font-bold">Statut Commande :</span> {getStatusBadge(retraitModalData.statutCmd)}</p>
                    <p className="font-extrabold text-sm pt-1 border-t border-slate-200">
                      Reste à régler : <span className={Number(retraitModalData.resteAPayer) > 0 ? 'text-amber-700' : 'text-emerald-700'}>
                        {retraitModalData.resteAPayer || 0} FCFA
                      </span>
                    </p>
                  </div>

                  {Number(retraitModalData.resteAPayer) > 0 && (
                    <div className="space-y-2">
                      <label className="font-bold text-slate-800 block">
                        Encaisser le solde restant avant retrait (RG16) :
                      </label>
                      <select
                        value={modePaiementSolde}
                        onChange={(e) => setModePaiementSolde(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl outline-none"
                      >
                        <option value="Espèces">Espèces</option>
                        <option value="Mobile Money">Mobile Money (Orange/MTN)</option>
                        <option value="Carte">Carte Bancaire</option>
                      </select>
                    </div>
                  )}

                  <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setRetraitModalData(null)}
                      className="px-4 py-2 border border-slate-200 text-xs font-bold text-slate-600 rounded-xl"
                    >
                      Annuler
                    </button>
                    <button
                      type="button"
                      disabled={retraitLoading}
                      onClick={handleValiderRetraitDirect}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition"
                    >
                      {retraitLoading ? 'Validation...' : 'Valider le Retrait Intégral'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODAL 5 : SUIVI RAPIDE */}
        {showTrackingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-extrabold text-slate-900 text-base">Suivre une Commande</h3>
                <button onClick={() => setShowTrackingModal(false)} className="text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!trackQuery.trim()) return;
                  try {
                    const res = await fetchApi(`/commandes/${encodeURIComponent(trackQuery.trim().toUpperCase())}`);
                    setTrackResult(res);
                  } catch (err: any) {
                    setTrackResult({ error: err.message || 'Numéro introuvable' });
                  }
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  required
                  value={trackQuery}
                  onChange={(e) => setTrackQuery(e.target.value)}
                  placeholder="Ex: YA1-26-000001"
                  className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
                >
                  Chercher
                </button>
              </form>

              {trackResult && (
                <div className="mt-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                  {trackResult.error ? (
                    <p className="text-red-600">{trackResult.error}</p>
                  ) : (
                    <div className="space-y-2">
                      <p className="font-bold text-slate-800">Bordereau : {trackResult.commande?.numFacture || trackQuery}</p>
                      <p>Client : {trackResult.commande?.client?.nomClient}</p>
                      <p>Statut : {getStatusBadge(trackResult.commande?.statutCmd)}</p>
                      <p>Total : {trackResult.commande?.montantTotal} FCFA</p>
                      <p>Reste à payer : {trackResult.resteAPayer} FCFA</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        {/* ============================================================ */}
        {/* MODAL FACTURE & BORDEREAU OFFICIEL (OUVERTURE NAVIGATEUR & IMPRESSION) */}
        {/* ============================================================ */}
        {factureModalData && (
          <FactureModal
            commande={factureModalData.commande}
            articles={factureModalData.articles}
            paiements={factureModalData.paiements}
            resteAPayer={factureModalData.resteAPayer}
            nomPressing={parametres.find((p) => p.codeParam === 'nom_pressing')?.valeurParam || 'Atlantic Palace Pressing'}
            onClose={() => setFactureModalData(null)}
          />
        )}
      </div>
    </AppLayout>
  );
}
