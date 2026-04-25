# 9site4

Site vitrine de **9site4** — offre de création de sites vitrines en abonnement tout compris pour les TPE/PME réunionnaises (974).

> Promesse : *Votre site tout-en-un, la gestion en moins.*

---

## Stack

- **Framework** : [Astro](https://astro.build) 5 (output statique)
- **CSS** : [Tailwind CSS](https://tailwindcss.com) 3 via `@astrojs/tailwind`
- **Polices** : Sora + Inter, auto-hébergées via `@fontsource/*` (pas de Google Fonts CDN, RGPD)
- **JS interactif** : Astro Islands uniquement quand nécessaire
- **Sitemap** : `@astrojs/sitemap`
- **Node** : 20+
- **Package manager** : npm

## Prérequis

- Node.js **20** ou supérieur
- npm **10** ou supérieur

## Installation

```bash
npm install
```

## Scripts

| Commande          | Action                                    |
| ----------------- | ----------------------------------------- |
| `npm run dev`     | Lance le serveur de dev sur `:4321`       |
| `npm run build`   | Build statique dans `./dist/`             |
| `npm run preview` | Sert le build local pour vérification     |
| `npm run astro`   | Accès direct à la CLI Astro               |

## Structure du projet

```
/
├── public/                  # Assets statiques (favicon, images, logo)
├── src/
│   ├── components/
│   │   ├── layout/          # Header, Footer, Nav, MobileMenu
│   │   ├── ui/              # Button, Card, Badge, Input, Select, Textarea
│   │   ├── sections/        # Hero, Offre, FAQ…
│   │   └── realisations/    # RealisationCard, FiltersBar
│   ├── data/                # Données : siteConfig, realisations, faq…
│   ├── layouts/             # BaseLayout.astro
│   ├── lib/                 # Helpers (seo.ts à venir)
│   ├── pages/               # Routes Astro (.astro)
│   └── styles/              # globals.css (tokens & base)
├── astro.config.mjs
├── tailwind.config.mjs
└── tsconfig.json
```

## Configuration du site — `src/data/siteConfig.json`

Toutes les valeurs visibles par l'utilisateur (email, WhatsApp, baseline, prix, mentions légales…) sont centralisées dans **un seul fichier** : `src/data/siteConfig.json`.

> ⚠️ **Aucune valeur ne doit être en dur ailleurs dans le code.** Le footer, la page contact, les métadonnées SEO, les liens WhatsApp/mailto, le Schema.org LocalBusiness… tout lit depuis ce fichier.

### Valeurs à remplacer impérativement avant la mise en production

| Clé                     | Valeur actuelle                | Action requise                         |
| ----------------------- | ------------------------------ | -------------------------------------- |
| `contact.email`         | `contact@9site4.re`            | Confirmer l'adresse définitive         |
| `contact.whatsapp`      | `262692000000`                 | Numéro réel (format international)     |
| `contact.whatsappDisplay` | `+262 692 00 00 00`          | Format affiché correspondant           |
| `social.instagram`      | (vide)                         | URL ou laisser vide pour masquer       |
| `social.facebook`       | (vide)                         | URL ou laisser vide pour masquer       |
| `social.linkedin`       | (vide)                         | URL ou laisser vide pour masquer       |
| `legal.editor`          | `[À compléter]`                | Mentions légales définitives           |
| `legal.publisher`       | `[À compléter]`                | Directeur de la publication            |

### Format

```json
{
  "siteName": "9site4",
  "baseline": "Votre site tout-en-un, la gestion en moins.",
  "siteUrl": "https://9site4.re",
  "contact": {
    "email": "...",
    "whatsapp": "...",
    "whatsappDisplay": "...",
    "whatsappMessage": "..."
  },
  "location": { "region": "La Réunion", "country": "FR", "areaCode": "974" },
  "pricing": { "monthly": "97,4€", "yearly": "974€", "highlight": "..." },
  "social": { "instagram": "", "facebook": "", "linkedin": "" },
  "legal": { "editor": "...", "host": "OVH", "publisher": "..." }
}
```

## Charte graphique

| Token         | Valeur     | Usage principal                          |
| ------------- | ---------- | ---------------------------------------- |
| `bleu`        | `#91A6FF`  | Accents, liens, éléments secondaires     |
| `orange`      | `#FF8F00`  | CTA principaux, accents forts            |
| `blanc-casse` | `#FEFEFA`  | Fond principal des sections claires      |
| `bleu-nuit`   | `#0B1437`  | Texte principal, fonds sombres, footer   |

Les tokens sont déclarés à deux endroits, à garder synchronisés :
- `tailwind.config.mjs` → utilitaires (`bg-bleu-nuit`, `text-orange`, etc.)
- `src/styles/globals.css` → variables CSS (`--color-bleu`, etc.)

## Déploiement OVH (placeholder)

Le site est prévu pour un hébergement **OVH mutualisé**. Le build (`npm run build`) génère un dossier `dist/` 100% statique à téléverser. La procédure détaillée (FTP, configuration domaine, certificat SSL) sera ajoutée dans un second temps.

## Hors scope actuel

- Pas d'e-commerce sur le site (mentionné uniquement dans la FAQ comme possibilité sur demande)
- Pas de backend / envoi réel du formulaire (validation front + `console.log` uniquement à ce stade)
- Pas d'analytics ni de tracking
- Mentions légales en page provisoire jusqu'à validation
- Multilingue non prévu (français uniquement)
