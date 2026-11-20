'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { fetchApi } from '@/lib/api';
import {
  Banknote,
  Search,
  CheckCircle,
  AlertCircle,
  CreditCard,
  Lock,
  User,
  ShoppingBag,
  Award
} from 'lucide-react';

export default function CaissePage() {
  const [numFacture, setNumFacture] = useState('');
  const [commande, setCommande] = useState<any>(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [paiements, setPaiements] = useState<any[]>([]);
  const [resteAPayer, setResteAPayer] = useState<number>(0);
  const [montantEncaissement, setMontantEncaissement] = useState<string>('');
  const [modePaiement, setModePaiement] = useState<string>('Espèces');

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [succes, setSucces] = useState<string | null>(null);

  const handleRecherche = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!numFacture.trim()) return;

    setLoading(true);
    setErreur(null);
    setSucces(null);

    try {
      const res = await fetchApi(`/commandes/${encodeURIComponent(numFacture.trim().toUpperCase())}`);
      setCommande(res.commande);
      setArticles(res.articles || []);
      setPaiements(res.paiements || []);
      setResteAPayer(res.resteAPayer || 0);
      setMontantEncaissement(String(res.resteAPayer || ''));
    } catch (err: any) {
      setErreur(err.message || 'Commande introuvable');
      setCommande(null);
    } finally {
      setLoading(false);
    }
  };

  const handleEncaisser = async () => {
    if (!montantEncaissement || Number(montantEncaissement) <= 0) return;
    setActionLoading(true);
    setErreur(null);
    setSucces(null);

    try {
      await fetchApi(`/caisse/commandes/${commande.numFacture}/paiements`, {
        method: 'POST',
        body: JSON.stringify({
          montantPaye: Number(montantEncaissement),
          modePaiement,
        }),
      });

      setSucces(`Encaissement de ${montantEncaissement} FCFA enregistré avec succès.`);
      handleRecherche();
    } catch (err: any) {
      setErreur(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleValiderRetrait = async () => {
    setActionLoading(true);
    setErreur(null);
    setSucces(null);

    try {
      const res = await fetchApi(`/caisse/commandes/${commande.numFacture}/retrait`, {
        method: 'POST',
      });

      setSucces(res.message);
      handleRecherche();
    } catch (err: any) {
      setErreur(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const estPret = commande?.statutCmd === 'Prêt';
  const estSolde = resteAPayer === 0;
  const peutRetirer = estPret && estSolde;

  return (
    <AppLayout>
      <div className="space-y-6 animate-fadeIn">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Banknote className="w-7 h-7 text-sky-600" />
              Caisse & Règlements
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Règle stricte BF6 / RG6 / RG16 : acomptes autorisés, retrait validé uniquement si 100% Prêt et solde = 0 FCFA.
            </p>
          </div>
        </div>

        {erreur && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600" />
            <span>{erreur}</span>
          </div>
        )}

        {succes && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex items-center gap-2">
            <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-600" />
            <span>{succes}</span>
          </div>
        )}

        {/* RECHERCHE DU BORDEREAU */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <form onSubmit={handleRecherche} className="flex gap-3">
            <input
              type="text"
              placeholder="Numéro de bordereau client (ex : YA1-26-000001)..."
              value={numFacture}
              onChange={(e) => setNumFacture(e.target.value)}
              className="flex-1 px-4 py-3 border border-slate-300 rounded-xl text-base font-mono uppercase focus:ring-2 focus:ring-sky-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl text-sm flex items-center gap-2 transition"
            >
              <Search className="w-4 h-4" />
              {loading ? 'Recherche...' : 'Consulter le dossier'}
            </button>
          </form>
        </div>

        {/* DOSSIER COMMANDE CHARGÉ */}
        {commande && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Informations Générales & Articles */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                <div className="flex justify-between items-start pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-mono text-slate-500">{commande.numFacture}</span>
                    <h2 className="text-lg font-bold text-slate-900">{commande.client?.nomClient}</h2>
                    <div className="text-xs text-slate-500">{commande.client?.telClient}</div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        commande.statutCmd === 'Prêt'
                          ? 'bg-emerald-100 text-emerald-800'
                          : commande.statutCmd === 'Retiré'
                          ? 'bg-slate-200 text-slate-700'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {commande.statutCmd}
                    </span>
                    <div className="text-xs text-slate-400 mt-1">Dépôt le {commande.dateDepot}</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-slate-700 uppercase mb-2">
                    Articles ({articles.length})
                  </h3>
                  <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                    {articles.map((art) => (
                      <div key={art.idArticle} className="p-3 flex justify-between items-center text-sm">
                        <div>
                          <div className="font-medium text-slate-900">{art.prestation?.libellePrestation}</div>
                          <div className="text-xs text-slate-500">{art.etatReception || 'RAS'}</div>
                        </div>
                        <div className="text-right">
                          <span className="px-2 py-0.5 rounded text-xs bg-slate-100 font-medium">
                            {art.statutArticle}
                          </span>
                          <div className="font-semibold text-slate-900 text-xs mt-0.5">{art.prixArticle} FCFA</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Historique des paiements */}
                <div>
                  <h3 className="text-xs font-semibold text-slate-700 uppercase mb-2">
                    Historique des règlements / acomptes
                  </h3>
                  {paiements.length === 0 ? (
                    <div className="text-xs text-slate-400 p-2 bg-slate-50 rounded-lg">
                      Aucun versement effectué pour le moment.
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {paiements.map((p) => (
                        <div key={p.idPaiement} className="flex justify-between text-xs p-2 bg-slate-50 rounded-lg">
                          <span className="text-slate-600">
                            {new Date(p.datePaiement).toLocaleString('fr-FR')} ({p.modePaiement})
                          </span>
                          <span className="font-semibold text-emerald-700">+{p.montantPaye} FCFA</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Encaissement & Validation Retrait */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
                <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-sky-600" />
                  État Financier
                </h3>

                <div className="space-y-2 text-sm pt-2 border-t border-slate-100">
                  <div className="flex justify-between text-slate-600">
                    <span>Montant total facturé :</span>
                    <span className="font-semibold text-slate-900">{commande.montantTotal} FCFA</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Total déjà versé :</span>
                    <span className="font-semibold text-emerald-600">
                      {commande.montantTotal - resteAPayer} FCFA
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
                    <span>Reste à payer :</span>
                    <span className={resteAPayer > 0 ? 'text-amber-600' : 'text-emerald-600'}>
                      {resteAPayer} FCFA
                    </span>
                  </div>
                </div>

                {/* Formulaire d'encaissement si non soldé */}
                {resteAPayer > 0 && (
                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    <label className="block text-xs font-semibold text-slate-700">
                      Encaisser le solde restant
                    </label>
                    <input
                      type="number"
                      max={resteAPayer}
                      value={montantEncaissement}
                      onChange={(e) => setMontantEncaissement(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                    />
                    <select
                      value={modePaiement}
                      onChange={(e) => setModePaiement(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
                    >
                      <option value="Espèces">Espèces</option>
                      <option value="Mobile Money">Mobile Money (OM / MoMo)</option>
                      <option value="Carte">Carte Bancaire</option>
                    </select>
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={handleEncaisser}
                      className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold transition"
                    >
                      {actionLoading ? 'Traitement...' : 'Encaisser le versement'}
                    </button>
                  </div>
                )}

                {/* Validation Retrait Final (Strict RG6 / RG16) */}
                <div className="pt-4 border-t border-slate-200 space-y-3">
                  <div className="text-xs text-slate-500 space-y-1">
                    <div className="flex items-center gap-1.5">
                      {estPret ? (
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Lock className="w-4 h-4 text-amber-500" />
                      )}
                      <span>100% des articles au statut Prêt</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {estSolde ? (
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Lock className="w-4 h-4 text-amber-500" />
                      )}
                      <span>Commande intégralement soldée (0 FCFA)</span>
                    </div>
                  </div>

                  {commande.statutCmd === 'Retiré' ? (
                    <div className="p-3 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold text-center">
                      Commande déjà retirée et clôturée.
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={!peutRetirer || actionLoading}
                      onClick={handleValiderRetrait}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl text-sm font-semibold shadow-lg transition flex items-center justify-center gap-2"
                    >
                      <Award className="w-4 h-4" />
                      Valider le retrait intégral
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
