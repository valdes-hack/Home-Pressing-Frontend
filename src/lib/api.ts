// Client HTTP avec injection du Token JWT et gestion des erreurs (RG15, RG24)
export const API_BASE = '/api/v1';

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('app_token');
}

export function getCurrentUser() {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('app_user');
  return raw ? JSON.parse(raw) : null;
}

export function setSession(token: string, user: any) {
  localStorage.setItem('app_token', token);
  localStorage.setItem('app_user', JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem('app_token');
  localStorage.removeItem('app_user');
}

export async function fetchApi<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    clearSession();
    if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
    throw new Error('Session expirée ou identifiants incorrects.');
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || `Erreur serveur (${response.status})`);
  }

  return data as T;
}

// Interfaces & Endpoints publics pour le suivi, agences et formulaires de contact

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

export interface ContactForm {
  nom: string;
  email: string;
  telephone?: string;
  sujet: string;
  message: string;
}

export async function trackCommande(numeroFacture: string): Promise<CommandeTracking> {
  return fetchApi<CommandeTracking>(`/commandes/${numeroFacture.trim().toUpperCase()}/tracking`);
}

export async function fetchAgences(): Promise<Agence[]> {
  return fetchApi<Agence[]>('/referentiel/agences');
}

export async function fetchTarifsActifs(): Promise<Tarif[]> {
  return fetchApi<Tarif[]>('/referentiel/tarifs-actifs');
}

export async function envoyerContact(data: ContactForm): Promise<{ message: string; id: string }> {
  return fetchApi<{ message: string; id: string }>('/public/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
