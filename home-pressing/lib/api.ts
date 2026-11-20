/**
 * Client HTTP pour l'application client (home-pressing).
 * Connexion aux endpoints publics du backend Spring Boot.
 * Aucune authentification JWT requise.
 */

// Base URL de l'API backend (configurable via variable d'environnement)
export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

/**
 * Interface pour le suivi de commande
 */
export interface CommandeTracking {
  numFacture: string;
  statutCmd: string;
  dateDepot: string;
  nomAgence: string;
  codeAgence: string;
  nbArticles: number;
  progression: number; // 0-100%
  message: string;
}

/**
 * Interface pour une agence
 */
export interface Agence {
  idAgence: number;
  codeAgence: string;
  nomAgence: string;
  typeAgence: string;
  adresseAgence: string;
  telAgence: string;
  latitude?: number;
  longitude?: number;
  horaires?: string;
  emailAgence?: string;
}

/**
 * Interface pour un tarif
 */
export interface Tarif {
  idTarif: number;
  prixUnitaire: number;
  dateDebutValidite: string;
  dateFinValidite: string | null;
  prestation: {
    idPrestation: number;
    libellePrestation: string;
    dureeEstimee: number | null;
  };
}

/**
 * Interface pour le formulaire de contact
 */
export interface ContactForm {
  nom: string;
  email: string;
  telephone?: string;
  sujet: string;
  message: string;
}

/**
 * Fonction générique pour effectuer des requêtes HTTP
 */
async function fetchApi<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Ressource non trouvée');
      }
      if (response.status >= 500) {
        throw new Error('Erreur serveur. Veuillez réessayer plus tard.');
      }
      
      // Tenter de lire le message d'erreur du backend
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || `Erreur ${response.status}`);
      } catch {
        throw new Error(`Erreur ${response.status}`);
      }
    }

    return response.json();
  } catch (error: any) {
    // Erreur réseau ou timeout
    if (error.message.includes('fetch')) {
      throw new Error('Impossible de contacter le serveur. Vérifiez votre connexion internet.');
    }
    throw error;
  }
}

/**
 * Suivi de commande en temps réel.
 * 
 * @param numeroFacture Numéro de bordereau au format AG-AA-NNNNNN (ex: YA1-26-000001)
 * @returns Informations publiques de suivi
 */
export async function trackCommande(numeroFacture: string): Promise<CommandeTracking> {
  return fetchApi<CommandeTracking>(`/commandes/${numeroFacture.trim().toUpperCase()}/tracking`);
}

/**
 * Récupération de la liste des agences.
 * 
 * @returns Liste de toutes les agences (6 commerciales + 1 atelier)
 */
export async function fetchAgences(): Promise<Agence[]> {
  return fetchApi<Agence[]>('/referentiel/agences');
}

/**
 * Récupération des tarifs actifs.
 * 
 * @returns Liste des tarifs en vigueur
 */
export async function fetchTarifsActifs(): Promise<Tarif[]> {
  return fetchApi<Tarif[]>('/referentiel/tarifs-actifs');
}

/**
 * Soumission du formulaire de contact.
 * 
 * @param data Données du formulaire (nom, email, téléphone, sujet, message)
 * @returns Message de confirmation
 */
export async function envoyerContact(data: ContactForm): Promise<{ message: string; id: string }> {
  return fetchApi<{ message: string; id: string }>('/public/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Test de connectivité avec le backend.
 * 
 * @returns true si le backend est accessible, false sinon
 */
export async function testConnexion(): Promise<boolean> {
  try {
    await fetch(`${API_BASE}/referentiel/agences`);
    return true;
  } catch {
    return false;
  }
}
