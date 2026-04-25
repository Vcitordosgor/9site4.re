# 9site4

Site vitrine de **9site4** — offre de création de sites vitrines en abonnement tout compris pour les TPE/PME réunionnaises (974).

> Promesse : *Votre site tout-en-un, la gestion en moins.*

---

## Stack

- **Framework** : [Astro](https://astro.build) 5 (output statique)
- **CSS** : [Tailwind CSS](https://tailwindcss.com) 3 via `@astrojs/tailwind`
- **Polices** : Sora + Inter, auto-hébergées via `@fontsource/*` (pas de Google Fonts CDN, RGPD)
- **Interactivité** : 3 Astro Islands hydratés via [Preact](https://preactjs.com) (filtres, FAQ accordéon, formulaire)
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

| Commande          | Action                                |
| ----------------- | ------------------------------------- |
| `npm run dev`     | Lance le serveur de dev sur `:4321`   |
| `npm run build`   | Build statique dans `./dist/`         |
| `npm run preview` | Sert le build local pour vérification |
| `npm run astro`   | Accès direct à la CLI Astro           |

## Pages

| Route               | Statut    | Notes                                                 |
| ------------------- | --------- | ----------------------------------------------------- |
| `/`                 | publique  | Accueil — hero, offre, modules métier, tarifs, CTA    |
| `/realisations`     | publique  | 24 cartes filtrables par catégorie (Astro Island)     |
| `/tarifs`           | publique  | 2 formules + FAQ accordéon (Astro Island)             |
| `/contact`          | publique  | Formulaire 8 champs + WhatsApp (Astro Island)         |
| `/mentions-legales` | `noindex` | **Provisoire** — à compléter avant la mise en ligne   |
| `/404`              | `noindex` | Page d'erreur basique                                 |
| `/styleguide`       | `noindex` | Bibliothèque interne des composants UI (dev only)     |

Les 3 pages `noindex` sont également exclues du sitemap et bloquées dans `robots.txt`.

## Structure du projet

```
/
├── public/                    # Assets statiques
│   ├── favicon.svg            # Favicon vectoriel
│   ├── favicon-16x16.png      # Fallback navigateurs anciens
│   ├── favicon-32x32.png
│   ├── apple-touch-icon.png   # Icône iOS (180×180)
│   ├── og-image.svg           # OG image source vectorielle
│   ├── og-image.png           # OG image rendue (1200×630)
│   ├── robots.txt
│   ├── images/                # Images bitmap (à venir)
│   └── logo/                  # Logo définitif (à venir)
├── src/
│   ├── components/
│   │   ├── layout/            # Header, Footer, MobileMenu, Wordmark
│   │   ├── ui/                # Button, Card, Badge, Input, Select, Textarea, Icon
│   │   ├── sections/          # Hero, Offre, FAQ, ContactForm, CTABand…
│   │   └── realisations/      # RealisationCard, FiltersBar
│   ├── data/                  # JSON : siteConfig, realisations, categories, faq
│   ├── layouts/               # BaseLayout.astro
│   ├── lib/                   # seo.ts, inclusions.ts
│   ├── pages/                 # Routes Astro (.astro)
│   └── styles/                # globals.css (tokens & base)
├── astro.config.mjs
├── tailwind.config.mjs
└── tsconfig.json
```

## Configuration du site — `src/data/siteConfig.json`

Toutes les valeurs visibles par l'utilisateur (email, WhatsApp, baseline, prix, mentions légales…) sont centralisées dans **un seul fichier** : `src/data/siteConfig.json`.

> **Aucune valeur ne doit être en dur ailleurs dans le code.** Le footer, la page contact, les métadonnées SEO, les liens WhatsApp/mailto, le Schema.org LocalBusiness… tout lit depuis ce fichier.

### Valeurs à remplacer impérativement avant la mise en production

| Clé                       | Valeur actuelle                | Action requise                                  |
| ------------------------- | ------------------------------ | ----------------------------------------------- |
| `siteUrl`                 | `https://9site4.re`            | Confirmer le domaine définitif                  |
| `contact.email`           | `contact@9site4.re`            | Confirmer l'adresse définitive                  |
| `contact.whatsapp`        | `262692000000`                 | Numéro réel (format international, sans `+`)    |
| `contact.whatsappDisplay` | `+262 692 00 00 00`            | Format affiché correspondant                    |
| `contact.whatsappMessage` | `Bonjour, je suis intéressé(e)…` | Message pré-rempli WhatsApp si à ajuster      |
| `social.instagram`        | (vide)                         | URL ou laisser vide pour masquer dans le footer |
| `social.facebook`         | (vide)                         | URL ou laisser vide pour masquer dans le footer |
| `social.linkedin`         | (vide)                         | URL ou laisser vide pour masquer dans le footer |
| `legal.editor`            | `[À compléter]`                | Mentions légales — éditeur du site              |
| `legal.publisher`         | `[À compléter]`                | Mentions légales — directeur de la publication  |
| `legal.host`              | `OVH`                          | Compléter avec l'adresse postale OVH            |

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

## SEO

Toutes les métadonnées sont centralisées dans `src/lib/seo.ts` (helper `getSeo(page)`).

- `<title>`, `<meta description>`, `<link canonical>` (URL absolue)
- Open Graph complet + Twitter Card `summary_large_image`
- Schema.org LocalBusiness en JSON-LD (depuis `siteConfig`), injecté **uniquement** sur les pages publiques
- Sitemap auto via `@astrojs/sitemap` (4 URLs publiques uniquement)
- `robots.txt` avec `Disallow` sur `/404`, `/mentions-legales`, `/styleguide`
- `noindex,nofollow` propagé via le helper sur les 3 pages internes

### Régénérer l'OG image

L'OG image PNG (1200×630) est générée depuis `public/og-image.svg` via `sharp` (déjà inclus comme transitive d'Astro). Si tu modifies le SVG :

```bash
node -e "require('sharp')('public/og-image.svg').png().toFile('public/og-image.png')"
```

## Audit Lighthouse (build de production)

| Page          | Mobile (P/A/B/S)         | Desktop (P/A/B/S)        |
| ------------- | ------------------------ | ------------------------ |
| `/`           | 97 / 100 / 100 / 100     | 100 / 100 / 100 / 100    |
| `/realisations` | 96 / 100 / 100 / 100   | 100 / 100 / 100 / 100    |
| `/tarifs`     | 100 / 100 / 100 / 100    | 100 / 100 / 100 / 100    |
| `/contact`    | 97 / 100 / 100 / 100     | 98 / 100 / 100 / 100     |

## Déploiement OVH (placeholder)

Le site est prévu pour un hébergement **OVH mutualisé**. Le build (`npm run build`) génère un dossier `dist/` 100% statique.

**Procédure résumée** (à compléter et tester le moment venu) :

1. `npm run build`
2. Téléverser le contenu de `dist/` à la racine de l'espace mutualisé OVH (FTP / SFTP)
3. Vérifier que `index.html` répond bien à `/`
4. Configurer le domaine `9site4.re` côté OVH et activer le certificat SSL gratuit (Let's Encrypt)
5. Vérifier la redirection HTTP → HTTPS
6. Vérifier le `robots.txt` et la résolution du `sitemap-index.xml` à la racine

La procédure complète (chemin FTP exact, .htaccess pour redirections, configuration mail) sera ajoutée après la première mise en ligne.

## Notes

### Page `/styleguide`
Bibliothèque interne des composants UI (Button, Card, Badge, Input, Select, Textarea, etc.) avec exemples d'usage. **Dev only** : la page est en `noindex`, exclue du sitemap et de `robots.txt`. Pas accessible depuis la navigation publique.

### Page `/mentions-legales`
Page **provisoire** marquée par un bandeau d'avertissement orange en haut. En `noindex` jusqu'à finalisation. Chaque section indique `[À compléter]` et propose une ligne d'aide *« À renseigner : … »* qui décrit ce qu'il faut insérer (raison sociale, finalités RGPD, durée des cookies, etc.).

### Formulaire de contact
Le formulaire est **front-only** à ce stade : à la soumission, les données sont validées puis envoyées dans `console.log()` (et un message de succès s'affiche). Voir `src/components/sections/ContactForm.tsx` ligne 107 — un commentaire `TODO` marque clairement où brancher l'envoi réel (backend, Formspree, EmailJS, etc.).

## Hors scope actuel

- Pas d'e-commerce sur le site (mentionné uniquement dans la FAQ comme possibilité sur demande via le formulaire)
- Pas de backend / envoi réel du formulaire (validation front + `console.log` à ce stade)
- Pas d'analytics ni de tracking
- Mentions légales en page provisoire jusqu'à validation
- Multilingue non prévu (français uniquement)
- Logo définitif à fournir et déposer dans `public/logo/` (le site utilise actuellement un wordmark "9site4" en Sora 700 avec le "4" en orange)
