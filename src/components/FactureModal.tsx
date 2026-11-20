'use client';

import React from 'react';
import {
  Printer,
  ExternalLink,
  X,
  Building2,
  CheckCircle,
  Clock,
  ShieldCheck,
  Award,
  Phone,
  Mail,
  QrCode
} from 'lucide-react';

interface FactureModalProps {
  commande: any;
  articles: any[];
  paiements: any[];
  resteAPayer: number;
  nomPressing?: string;
  onClose: () => void;
}

export default function FactureModal({
  commande,
  articles,
  paiements,
  resteAPayer,
  nomPressing = 'Atlantic Palace Pressing',
  onClose,
}: FactureModalProps) {
  if (!commande) return null;

  const totalVerse = commande.montantTotal - resteAPayer;
  const estSolde = resteAPayer === 0;

  // Ouvrir la facture dans un nouvel onglet du navigateur formaté
  const handleOuvrirNavigateur = () => {
    const fenetre = window.open('', '_blank');
    if (!fenetre) {
      alert('Veuillez autoriser les fenêtres pop-up pour afficher la facture.');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <title>Facture / Bordereau Officiel - ${commande.numFacture}</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
          body { background: #f8fafc; padding: 30px; color: #1e293b; }
          .facture-container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 25px; border-bottom: 2px solid #2563eb; }
          .brand-title { font-size: 24px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; }
          .brand-subtitle { font-size: 13px; color: #64748b; font-weight: 500; margin-top: 4px; }
          .badge-num { font-family: monospace; font-size: 16px; font-weight: 700; color: #2563eb; background: #eff6ff; padding: 6px 14px; border-radius: 8px; border: 1px solid #bfdbfe; }
          .grid-info { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 25px 0; }
          .card-info { background: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; }
          .card-info h4 { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; margin-bottom: 8px; }
          .card-info p { font-size: 14px; margin-bottom: 4px; }
          table { width: 100%; border-collapse: collapse; margin: 25px 0; }
          th { background: #0f172a; color: white; text-align: left; padding: 10px 12px; font-size: 12px; text-transform: uppercase; }
          td { padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
          tr:nth-child(even) { background: #f8fafc; }
          .totals-section { display: flex; justify-content: flex-end; margin-top: 20px; }
          .totals-table { width: 320px; border-collapse: collapse; }
          .totals-table td { padding: 8px 12px; font-size: 14px; }
          .total-highlight { font-size: 16px; font-weight: 800; border-top: 2px solid #0f172a; color: #0f172a; }
          .footer-legal { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b; line-height: 1.5; }
          .btn-print { background: #2563eb; color: white; padding: 12px 24px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; margin-bottom: 20px; display: inline-flex; align-items: center; gap: 8px; }
          @media print {
            body { background: white; padding: 0; }
            .facture-container { box-shadow: none; border: none; padding: 0; }
            .btn-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div style="text-align: center;">
          <button class="btn-print" onclick="window.print()">🖨️ Imprimer cette facture / Enregistrer en PDF</button>
        </div>
        <div class="facture-container">
          <div class="header">
            <div>
              <div class="brand-title">${nomPressing}</div>
              <div class="brand-subtitle">Excellence & Soin Haute Couture du Textile</div>
              <div style="font-size: 12px; color: #64748b; margin-top: 6px;">
                Agence : <strong>${commande.agence?.nomAgence || 'Agence Centrale'}</strong> | Tél : +237 694 11 22 33
              </div>
            </div>
            <div style="text-align: right;">
              <div class="badge-num">${commande.numFacture}</div>
              <div style="font-size: 12px; color: #64748b; margin-top: 6px;">
                Date dépôt : ${commande.dateDepot || 'Aujourd\'hui'}
              </div>
            </div>
          </div>

          <div class="grid-info">
            <div class="card-info">
              <h4>Client</h4>
              <p><strong>${commande.client?.nomClient || 'Client Comptoir'}</strong></p>
              <p>Téléphone : ${commande.client?.telClient || 'N/A'}</p>
              <p>Fidélité : <span style="color:#d97706; font-weight:bold;">${commande.client?.pointsFidelite || 0} points</span></p>
            </div>
            <div class="card-info">
              <h4>État de la Commande</h4>
              <p>Statut actuel : <strong>${commande.statutCmd}</strong></p>
              <p>Nombre d'articles : <strong>${articles.length} pièce(s)</strong></p>
              <p>Situation solde : <strong style="color: ${estSolde ? '#16a34a' : '#d97706'};">${estSolde ? 'Soldée (0 FCFA)' : 'Reste à payer'}</strong></p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Article / Prestation</th>
                <th>Constat contradictoire (RG16)</th>
                <th>Statut</th>
                <th style="text-align: right;">Montant</th>
              </tr>
            </thead>
            <tbody>
              ${articles.map(art => `
                <tr>
                  <td><strong>${art.prestation?.libellePrestation || 'Article pressing'}</strong></td>
                  <td style="color: #64748b;">${art.etatReception || 'RAS — Très bon état'}</td>
                  <td><span style="background:#f1f5f9; padding:2px 6px; border-radius:4px; font-size:11px;">${art.statutArticle}</span></td>
                  <td style="text-align: right; font-weight: bold;">${art.prixArticle} FCFA</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="totals-section">
            <table class="totals-table">
              <tr>
                <td>Montant Total Facturé :</td>
                <td style="text-align: right; font-weight: bold;">${commande.montantTotal} FCFA</td>
              </tr>
              <tr>
                <td style="color: #16a34a;">Total Acomptes Versés :</td>
                <td style="text-align: right; font-weight: bold; color: #16a34a;">-${totalVerse} FCFA</td>
              </tr>
              <tr class="total-highlight">
                <td>Reste Net à Payer :</td>
                <td style="text-align: right; color: ${resteAPayer > 0 ? '#dc2626' : '#16a34a'};">${resteAPayer} FCFA</td>
              </tr>
            </table>
          </div>

          ${paiements.length > 0 ? `
            <div style="margin-top: 20px; font-size: 12px; background: #f8fafc; padding: 12px; border-radius: 8px;">
              <strong>Règlements enregistrés :</strong>
              ${paiements.map(p => `
                <div style="display: flex; justify-content: space-between; margin-top: 4px; color: #475569;">
                  <span>${new Date(p.datePaiement).toLocaleString('fr-FR')} (${p.modePaiement})</span>
                  <span style="font-weight: bold; color: #16a34a;">+${p.montantPaye} FCFA</span>
                </div>
              `).join('')}
            </div>
          ` : ''}

          <div class="footer-legal">
            <p><strong>Conditions Générales de Service (CDCF / Merise v3.0) :</strong></p>
            <p>1. Le présent bordereau est obligatoire pour tout retrait de vêtement au comptoir (RG16).</p>
            <p>2. Aucun retrait partiel ou total n'est possible sans le paiement intégral de la commande (RG6).</p>
            <p>3. Les vêtements non réclamés après un délai de 90 jours seront traités conformément aux dispositions légales en vigueur.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    fenetre.document.open();
    fenetre.document.write(htmlContent);
    fenetre.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Barre d'action supérieure */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-bold tracking-tight">Facture & Bordereau Officiel</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOuvrirNavigateur}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Ouvrir dans le navigateur
            </button>
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimer
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Corps de la Facture imprimable */}
        <div id="printable-facture" className="p-8 space-y-6">
          {/* En-tête */}
          <div className="flex justify-between items-start pb-6 border-b-2 border-slate-900">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">{nomPressing}</h2>
              <p className="text-xs text-amber-600 font-bold uppercase tracking-wider mt-0.5">
                Excellence & Soin Haute Couture du Textile
              </p>
              <div className="text-xs text-slate-500 mt-2 space-y-0.5">
                <p className="flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" />
                  {commande.agence?.nomAgence || 'Agence Centrale'}
                </p>
                <p className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  +237 694 11 22 33 / +237 677 00 11 22
                </p>
                <p className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  contact@atlanticpalace.cm
                </p>
              </div>
            </div>

            <div className="text-right space-y-2">
              <div className="inline-block px-3 py-1 rounded-xl bg-blue-50 border border-blue-200 font-mono text-sm font-black text-blue-700">
                {commande.numFacture}
              </div>
              <div className="text-xs text-slate-500">
                Date de dépôt : <strong>{commande.dateDepot}</strong>
              </div>
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800">
                Statut : {commande.statutCmd}
              </div>
            </div>
          </div>

          {/* Informations Client */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
            <div>
              <span className="font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Informations Client
              </span>
              <p className="text-sm font-black text-slate-900">{commande.client?.nomClient}</p>
              <p className="text-slate-600 mt-0.5">Téléphone : {commande.client?.telClient}</p>
              <p className="text-amber-700 font-semibold mt-1">
                Fidélité : {commande.client?.pointsFidelite || 0} points acquis (RG27)
              </p>
            </div>
            <div className="sm:text-right">
              <span className="font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Disponibilité & Retrait
              </span>
              <p className="text-slate-700">
                Lieu de retrait : <strong>{commande.agence?.nomAgence || 'Au comptoir de dépôt'}</strong>
              </p>
              <p className="text-slate-500 mt-0.5">Délai estimé : 24h à 48h ouvrées</p>
            </div>
          </div>

          {/* Tableau des Articles */}
          <div>
            <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-900 text-white uppercase text-[10px]">
                <tr>
                  <th className="p-3">Prestation / Vêtement</th>
                  <th className="p-3">Constat contradictoire (RG16)</th>
                  <th className="p-3">Statut Atelier</th>
                  <th className="p-3 text-right">Prix</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {articles.map((art) => (
                  <tr key={art.idArticle} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">{art.prestation?.libellePrestation}</td>
                    <td className="p-3 text-slate-600">{art.etatReception || 'RAS (Parfait état)'}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 font-medium text-[11px]">
                        {art.statutArticle}
                      </span>
                    </td>
                    <td className="p-3 text-right font-black text-slate-900">{art.prixArticle} FCFA</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Ventilation Financière */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-2">
            <div className="flex-1 text-xs text-slate-500 space-y-1">
              <p className="font-bold text-slate-700">Historique des versements :</p>
              {paiements.length === 0 ? (
                <p className="italic">Aucun acompte versé à ce jour.</p>
              ) : (
                paiements.map((p) => (
                  <div key={p.idPaiement} className="flex justify-between max-w-xs text-slate-700">
                    <span>{new Date(p.datePaiement).toLocaleDateString('fr-FR')} ({p.modePaiement}) :</span>
                    <span className="font-semibold text-emerald-600">+{p.montantPaye} FCFA</span>
                  </div>
                ))
              )}
            </div>

            <div className="w-full sm:w-72 bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Total Facturé :</span>
                <span className="font-bold text-slate-900 text-sm">{commande.montantTotal} FCFA</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Acomptes versés :</span>
                <span className="font-bold text-emerald-600">-{totalVerse} FCFA</span>
              </div>
              <div className="flex justify-between text-sm font-black pt-2 border-t border-slate-200">
                <span>Reste à payer :</span>
                <span className={resteAPayer > 0 ? 'text-amber-600' : 'text-emerald-600'}>
                  {resteAPayer} FCFA
                </span>
              </div>
            </div>
          </div>

          {/* Mentions légales Merise v3.0 */}
          <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-400 space-y-1">
            <p className="font-bold text-slate-600">Règles d'exploitation (Cahier des charges Merise v3.0) :</p>
            <p>• <strong>RG6 / RG16 :</strong> Le retrait des vêtements est subordonné au solde intégral de la facture et à la présentation du présent bordereau.</p>
            <p>• <strong>RG25 / RG30 :</strong> Traçabilité immuable. Les alertes de mise à disposition sont notifiées automatiquement par SMS et WhatsApp.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
