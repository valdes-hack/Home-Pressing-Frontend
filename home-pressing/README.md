# Home Pressing — template Next.js

Next.js 14 (App Router) · Tailwind CSS · Framer Motion · Lucide.

## Lancer

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # build de production
```

## Pages

| Route | Contenu |
|---|---|
| `/` | Hero 3D animé, bandeau défilant, services, étapes, compteurs, témoignages, CTA |
| `/services` | Grille des services + parcours d'une commande |
| `/suivi` | Suivi par numéro de bordereau (démo simulée, format `AG-AA-NNNNNN`) |
| `/localisation` | Liste des agences + carte Google Maps interactive + itinéraire |
| `/contact` | Coordonnées + formulaire (envoi simulé) |

## À personnaliser

Tout se règle dans `lib/data.ts` :
- `BRAND` : téléphone, WhatsApp, e-mail, horaires
- `AGENCIES` : vraies adresses des 6 agences (le champ `mapQuery` pilote la carte)
- `SERVICES` : prestations et prix
- `TESTIMONIALS`, `STATS`

Couleurs : `tailwind.config.ts` (`navy` et `brand`, tirées du logo).
Logo : `public/logo.png`.

## À brancher plus tard

- `components/TrackingDemo.tsx` → API réelle des commandes
- `components/ContactForm.tsx` → route API / service d'e-mail
