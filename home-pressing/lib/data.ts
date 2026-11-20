import {
  Shirt,
  Sparkles,
  Droplets,
  Wind,
  BedDouble,
  Gem,
  type LucideIcon,
} from "lucide-react";

export const BRAND = {
  name: "Home Pressing",
  short: "HP",
  tagline: "Le soin de votre linge, comme à la maison.",
  phone: "+237 6 00 00 00 00", // TODO : remplacer par le vrai numéro
  whatsapp: "237600000000", // TODO : remplacer par le vrai numéro WhatsApp
  email: "contact@homepressing.cm", // TODO
  hours: "Lun – Sam : 7h30 – 19h30 · Dim : 9h – 14h",
};

export const NAV_LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/services", label: "Services" },
  { href: "/suivi", label: "Suivi de commande" },
  { href: "/localisation", label: "Localisation" },
  { href: "/contact", label: "Contact" },
];

export type Service = {
  icon: LucideIcon;
  title: string;
  desc: string;
  price: string;
};

export const SERVICES: Service[] = [
  {
    icon: Sparkles,
    title: "Lavage à sec",
    desc: "Costumes, robes, manteaux et tissus délicats traités avec précision, sans les abîmer.",
    price: "dès 1 500 FCFA",
  },
  {
    icon: Droplets,
    title: "Lavage à l'eau",
    desc: "Un lavage soigné pour le linge du quotidien : chemises, pantalons, tenues de travail.",
    price: "dès 500 FCFA",
  },
  {
    icon: Wind,
    title: "Repassage",
    desc: "Un fini impeccable, plis nets et tissus parfaitement lissés, prêt à porter.",
    price: "dès 300 FCFA",
  },
  {
    icon: BedDouble,
    title: "Literie & couettes",
    desc: "Draps, couettes, rideaux et grandes pièces nettoyés en profondeur et désinfectés.",
    price: "dès 2 500 FCFA",
  },
  {
    icon: Shirt,
    title: "Chemises & uniformes",
    desc: "Formules pour professionnels, écoles et entreprises avec tarifs préférentiels.",
    price: "sur devis",
  },
  {
    icon: Gem,
    title: "Tenues de cérémonie",
    desc: "Robes de soirée, boubous, costumes et pièces précieuses : un soin d'exception.",
    price: "dès 3 000 FCFA",
  },
];

export const STEPS = [
  {
    n: "01",
    title: "Dépôt en agence",
    desc: "On constate ensemble l'état de chaque article. Un bordereau numérique vous est remis.",
  },
  {
    n: "02",
    title: "Prise en charge atelier",
    desc: "Votre linge est lavé et repassé à l'atelier central, étape par étape.",
  },
  {
    n: "03",
    title: "SMS automatique",
    desc: "Dès que tout est prêt, vous recevez un SMS : plus besoin d'appeler.",
  },
  {
    n: "04",
    title: "Retrait serein",
    desc: "Vous récupérez la commande complète, propre, repassée et soldée.",
  },
];

export const STATS = [
  { value: 6, suffix: "", label: "Agences à Yaoundé" },
  { value: 120, suffix: "+", label: "Clients servis par jour" },
  { value: 100, suffix: "%", label: "Commandes tracées" },
  { value: 24, suffix: "h", label: "Délai express possible" },
];

export const TESTIMONIALS = [
  {
    name: "Aïcha N.",
    role: "Cliente à Bastos",
    text: "Mon boubou est revenu comme neuf et j'ai reçu le SMS au moment exact où il était prêt. Un vrai gain de temps !",
  },
  {
    name: "Jean-Marc E.",
    role: "Cadre, Mvan",
    text: "Mes chemises sont impeccables chaque semaine. Le suivi par bordereau me rassure vraiment.",
  },
  {
    name: "Carine T.",
    role: "Gérante d'hôtel",
    text: "Pour notre literie, Home Pressing est devenu indispensable. Sérieux, ponctuel, soigné.",
  },
  {
    name: "Patrick B.",
    role: "Client à Biyem-Assi",
    text: "Fini les appels dans tous les sens. Je dépose, je reçois mon SMS, je viens récupérer. Simple.",
  },
];

export type Agency = {
  id: string;
  code: string;
  name: string;
  quartier: string;
  address: string;
  phone: string;
  hours: string;
  kind: "Agence commerciale" | "Atelier central";
  /** Requête envoyée à Google Maps. Remplacez par l'adresse exacte ou des coordonnées. */
  mapQuery: string;
};

/**
 * ⚠️ Adresses fictives (quartiers réels de Yaoundé, rues à compléter).
 * Remplacez-les par les vraies adresses de vos agences.
 */
export const AGENCIES: Agency[] = [
  {
    id: "bastos",
    code: "YA1",
    name: "Home Pressing Bastos",
    quartier: "Bastos",
    address: "Avenue Bastos, près de l'ambassade — Yaoundé",
    phone: "+237 6 00 00 00 01",
    hours: "Lun – Sam : 7h30 – 19h30",
    kind: "Agence commerciale",
    mapQuery: "Bastos, Yaoundé, Cameroun",
  },
  {
    id: "mvan",
    code: "YA2",
    name: "Home Pressing Mvan",
    quartier: "Mvan",
    address: "Carrefour Mvan, route de Mbalmayo — Yaoundé",
    phone: "+237 6 00 00 00 02",
    hours: "Lun – Sam : 7h30 – 19h30",
    kind: "Agence commerciale",
    mapQuery: "Mvan, Yaoundé, Cameroun",
  },
  {
    id: "biyem-assi",
    code: "YA3",
    name: "Home Pressing Biyem-Assi",
    quartier: "Biyem-Assi",
    address: "Carrefour Biyem-Assi — Yaoundé",
    phone: "+237 6 00 00 00 03",
    hours: "Lun – Sam : 7h30 – 19h30",
    kind: "Agence commerciale",
    mapQuery: "Biyem-Assi, Yaoundé, Cameroun",
  },
  {
    id: "mendong",
    code: "YA4",
    name: "Home Pressing Mendong",
    quartier: "Mendong",
    address: "Mendong, face au marché — Yaoundé",
    phone: "+237 6 00 00 00 04",
    hours: "Lun – Sam : 8h – 19h",
    kind: "Agence commerciale",
    mapQuery: "Mendong, Yaoundé, Cameroun",
  },
  {
    id: "essos",
    code: "YA5",
    name: "Home Pressing Essos",
    quartier: "Essos",
    address: "Essos, près de l'hôpital — Yaoundé",
    phone: "+237 6 00 00 00 05",
    hours: "Lun – Sam : 8h – 19h",
    kind: "Agence commerciale",
    mapQuery: "Essos, Yaoundé, Cameroun",
  },
  {
    id: "melen",
    code: "YA6",
    name: "Home Pressing Melen",
    quartier: "Melen",
    address: "Melen, près de l'université — Yaoundé",
    phone: "+237 6 00 00 00 06",
    hours: "Lun – Sam : 8h – 19h",
    kind: "Agence commerciale",
    mapQuery: "Melen, Yaoundé, Cameroun",
  },
  {
    id: "atelier",
    code: "ATC",
    name: "Atelier central",
    quartier: "Yaoundé",
    address: "Zone industrielle — Yaoundé (production, non ouvert au public)",
    phone: "+237 6 00 00 00 00",
    hours: "Lun – Sam : 7h – 18h",
    kind: "Atelier central",
    mapQuery: "Yaoundé, Cameroun",
  },
];

/** Statuts du workflow (RG10 du CDCF) */
export const STATUTS = [
  "Réceptionné",
  "En lavage",
  "En repassage",
  "Prêt",
  "Retiré",
] as const;
