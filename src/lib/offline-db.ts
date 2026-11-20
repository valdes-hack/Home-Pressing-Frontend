import Dexie, { type EntityTable } from 'dexie';

// Schéma du cache local pour la continuité de service hors-ligne (BNF3, BNF11, §7.5)
export interface OfflineClient {
  idClient?: number;
  nomClient: string;
  telClient: string;
}

export interface OfflineTarif {
  idTarif: number;
  prixUnitaire: number;
  idPrestation: number;
  libellePrestation: string;
}

export interface OfflinePendingOrder {
  id?: number;
  numFacture: string;
  idClient: number;
  idAgence: number;
  articles: Array<{ idPrestation: number; etatReception: string; prix: number }>;
  tauxRemise: number;
  acompteInitial: number;
  modePaiement: string;
  dateDepot: string;
  synced: number; // 0 = en attente de synchronisation, 1 = synchronisé
}

class PressingOfflineDatabase extends Dexie {
  clients!: EntityTable<OfflineClient, 'idClient'>;
  tarifs!: EntityTable<OfflineTarif, 'idTarif'>;
  pendingOrders!: EntityTable<OfflinePendingOrder, 'id'>;

  constructor() {
    super('AtlanticPalaceOfflineDB');
    this.version(1).stores({
      clients: '++idClient, nomClient, telClient',
      tarifs: 'idTarif, idPrestation, libellePrestation',
      pendingOrders: '++id, numFacture, synced, dateDepot',
    });
  }
}

export const offlineDb = new PressingOfflineDatabase();

/**
 * Générateur local sans collision de numéro de bordereau hors-ligne (RG26, BNF11).
 * Format : AG-AA-NNNNNN (ex : YA1-26-000101)
 */
export async function genererNumeroBordereauHorsLigne(codeAgence: string): Promise<string> {
  const annee = new Date().getFullYear().toString().slice(-2);
  const count = await offlineDb.pendingOrders.count();
  const sequence = String(count + 1).padStart(6, '0');
  return `${codeAgence.toUpperCase()}-${annee}-${sequence}`;
}
