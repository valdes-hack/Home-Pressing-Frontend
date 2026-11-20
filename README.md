# Atlantic Palace Pressing Frontend 👔✨

Interface web moderne, ultra-rapide et responsive pour la gestion de pressing écologique et l'espace client libre-service. Conforme Merise v3.0 avec support complet PWA (Progressive Web App).

---

## 🚀 Stack Technique
- **Framework** : Next.js 15 (App Router, React 19)
- **Styling** : Tailwind CSS v3 + Lucide Icons + Heroicons
- **PWA** : Service Worker natif (`public/sw.js`), Manifest (`public/manifest.json`), Icônes multi-résolution
- **Facturation** : Facture A4 avec impression thermique/papier et ouverture navigateur (`window.open`)
- **Notifications** : Déclenchement 1-clic WhatsApp (`wa.me`) et Email (`mailto:`) pour les commandes prêtes

---

## ⚙️ Configuration & Variables d'Environnement

Pour le déploiement sur **Vercel** ou en local :

Créez un fichier `.env.local` (ou configurez les variables dans le dashboard Vercel) :

```bash
# URL de l'API Backend (Render en production, local en dev)
BACKEND_URL=https://home-pressing-api.onrender.com
NEXT_PUBLIC_BACKEND_URL=https://home-pressing-api.onrender.com
```

> **Note :** En développement local, si aucune variable n'est définie, le proxy Next.js réécrit automatiquement les requêtes `/api/:path*` vers `http://localhost:8080`.

---

## 📱 Fonctionnalités Clés
- **Espace Client Libre-Service** : Inscription/Connexion, Suivi en temps réel (Cycle Merise RG10), Historique, Fidélité RG27, Paramètres.
- **Tableau de Bord DG / Comptoir** : Gestion commandes, alertes retards, encaissements, recherche universelle instantanée.
- **Paramètres Globaux** : Personnalisation du nom d'établissement, slogan, numéros de contact, blocage/déblocage utilisateurs.
- **PWA Mobile-First** : Installable sur Android, iOS, Windows et macOS avec mise en cache hors-ligne.

---

## 🛠️ Démarrage Local

```bash
# Installation des dépendances
npm install

# Démarrage du serveur de développement
npm run dev
```
Rendez-vous sur [http://localhost:3000](http://localhost:3000).
