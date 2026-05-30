# Batch 2 — 5 nouveaux templates

Ce fichier liste les ajouts manuels à effectuer dans les fichiers globaux (interdits de modification durant le batch). Pour chaque template, le code est complet (JSON, page, composants, preview) ; il reste à publier dans `tailwind.config.mjs`, `src/data/realisations.json` et `src/lib/seo.ts`.

> Toutes les pages sont buildables aujourd'hui via un SEO inline et des couleurs en `style="..."` directes. Une fois les tokens Tailwind ajoutés, on pourra remplacer les `style="..."` par les classes utilitaires correspondantes pour aligner la base.

---

## 1. Palette tokens à ajouter dans `tailwind.config.mjs`

À ajouter dans `theme.extend.colors` (à la suite des palettes existantes).

### tatoueur — Encre Volcan
```js
// Palette tatoueur (template /templates/tatoueur — Encre Volcan)
// Style "Atelier sombre, gritty" : noir profond, rouge sang, crème papier.
'tatoo-noir':  '#0A0A0A',  // noir profond — fonds dominants
'tatoo-rouge': '#A11920',  // rouge sang — accents, CTA
'tatoo-creme': '#EEE6D8',  // crème papier — texte sur fond noir, sections claires
'tatoo-encre': '#1F1A18',  // brun encre — sections alternées sombres
```

### naturopathe — Source
```js
// Palette naturopathe (template /templates/naturopathe — Source)
// Style "Nature distillée" : vert mousse, eau, amande, charbon doux.
'source-eau':     '#E4F0EE',  // bleu eau très clair — fond principal, sections claires
'source-mousse':  '#5D7C68',  // vert mousse — accents, CTA, titres italiques
'source-charbon': '#1F2926',  // charbon doux — texte AAA, sections sombres
'source-amande':  '#D3C29C',  // amande beige — accents secondaires
```

### creche — Le Nid
```js
// Palette crèche (template /templates/creche — Le Nid)
// Style "Pastels doux 0-3 ans" : jaune oeuf, rose poudre, bleu ciel, crème.
'nid-jaune':   '#F8D77E',  // jaune œuf — accent principal, CTA
'nid-rose':    '#F5C4C4',  // rose poudre — accents secondaires
'nid-bleu':    '#A8C9E4',  // bleu ciel — accents tertiaires
'nid-creme':   '#FFF8EE',  // crème — fond principal
'nid-charbon': '#2E2A26',  // charbon — texte AAA, footer
```

### notaire — Étude Notariale & Associés
```js
// Palette notaire (template /templates/notaire — Étude Notariale & Associés)
// Style "Marbre classique éditorial" : marbre crème, noir profond, or laiton, bordeaux.
'notaire-marbre':   '#F5F1EB',  // marbre crème — fond principal
'notaire-noir':     '#1A1715',  // noir profond — texte AAA, sections sombres
'notaire-or':       '#A28B5C',  // or laiton vieilli — filets ornementaux, accents
'notaire-bordeaux': '#5C2A2A',  // bordeaux Ordre des notaires — section contact
```

### studio-audio — Onde
```js
// Palette studio audio (template /templates/studio-audio — Onde)
// Style "Néon électronique" : noir profond, violet néon, cyan, crème claire.
'onde-noir':   '#0D0D14',  // noir profond bleuté — fond principal
'onde-violet': '#7C3AED',  // violet néon — accent principal
'onde-cyan':   '#22D3EE',  // cyan néon — accent secondaire, CTA hover
'onde-creme':  '#F5F4F8',  // crème très clair — texte sur fond sombre, sections claires
```

---

## 2. Entries à ajouter dans `src/data/realisations.json`

À ajouter à la fin du tableau (max ID actuel : 30 ; le batch 1 commence à 31, le batch 2 commence à 36).

```json
[
  {
    "id": 36,
    "nom": "Studio de tatouage",
    "categorie": "beaute",
    "sousTitre": "Styles signature, flash sheet et réservation de consultation",
    "moduleInclus": "Réservation",
    "slug": "studio-de-tatouage",
    "previewUrl": "/templates/tatoueur",
    "thumbnail": "https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?w=900&q=80"
  },
  {
    "id": 37,
    "nom": "Naturopathe",
    "categorie": "sante",
    "sousTitre": "Méthode, parcours, conseils et rendez-vous en ligne",
    "moduleInclus": "Rendez-vous",
    "slug": "naturopathe",
    "previewUrl": "/templates/naturopathe",
    "thumbnail": "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=900&q=80"
  },
  {
    "id": 38,
    "nom": "Micro-crèche",
    "categorie": "particuliers",
    "sousTitre": "Pédagogie, équipe, journée type et inscription",
    "moduleInclus": "Inscription",
    "slug": "micro-creche",
    "previewUrl": "/templates/creche",
    "thumbnail": "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=900&q=80"
  },
  {
    "id": 39,
    "nom": "Étude notariale",
    "categorie": "pro",
    "sousTitre": "Domaines, notaires, frais transparents et prise de rendez-vous",
    "moduleInclus": "Rendez-vous",
    "slug": "etude-notariale",
    "previewUrl": "/templates/notaire",
    "thumbnail": "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=900&q=80"
  },
  {
    "id": 40,
    "nom": "Studio d'enregistrement",
    "categorie": "pro",
    "sousTitre": "Services, équipement, tarifs et réservation de session",
    "moduleInclus": "Réservation",
    "slug": "studio-audio",
    "previewUrl": "/templates/studio-audio",
    "thumbnail": "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=900&q=80"
  }
]
```

> Note catégories : les 5 templates s'inscrivent dans des catégories existantes. Le studio de tatouage rejoint **beaute** (avec salon/institut/spa). La naturopathie rejoint **sante** (avec ostéo/diététicienne/psy). La micro-crèche rejoint **particuliers** (avec aide-domicile/conciergerie/auto-école). L'étude notariale et le studio audio rejoignent **pro** (avec consultant/comptable/architecte/avocat).

---

## 3. SEO entries à ajouter dans `src/lib/seo.ts`

### 3.a. Étendre le type `PageKey`

Ajouter dans l'union de types :
```ts
| 'templateTatoueur'
| 'templateNaturopathe'
| 'templateCreche'
| 'templateNotaire'
| 'templateStudioAudio';
```

### 3.b. Ajouter les entrées dans `PAGES`

À ajouter à la fin de l'objet `PAGES`, avant la fermeture `};` :

```ts
templateTatoueur: {
  title: 'Encre Volcan — Studio de tatouage à La Réunion | Template 9site4',
  description:
    'Aperçu du template "Studio de tatouage" proposé par 9site4 : quatre styles signature (blackwork, lettering, floral, old-school), équipe de trois encreurs résidents, flash sheet, process et tarification. Site fictif de démonstration.',
  canonical: '/templates/tatoueur',
  noindex: true,
},
templateNaturopathe: {
  title: 'Source — Naturopathie à La Réunion | Template 9site4',
  description:
    'Aperçu du template "Naturopathe" proposé par 9site4 : approche (fatigue, sommeil, digestion, stress), méthode en 4 étapes, parcours certifié FENA, cabinet, tarifs et conseils. Site fictif de démonstration.',
  canonical: '/templates/naturopathe',
  noindex: true,
},
templateCreche: {
  title: 'Le Nid — Micro-crèche à La Réunion | Template 9site4',
  description:
    'Aperçu du template "Micro-crèche" proposé par 9site4 : pédagogie Montessori, équipe diplômée, journée type 7h-19h, locaux et jardin, sécurité PMI et tarifs CAF. Site fictif de démonstration.',
  canonical: '/templates/creche',
  noindex: true,
},
templateNotaire: {
  title: 'Étude Notariale & Associés — Notaires à La Réunion | Template 9site4',
  description:
    'Aperçu du template "Étude notariale" proposé par 9site4 : quatre domaines (famille, succession, immobilier, sociétés), notaires associés, méthode, frais transparents et documents à apporter. Site fictif de démonstration.',
  canonical: '/templates/notaire',
  noindex: true,
},
templateStudioAudio: {
  title: 'Onde — Studio d\'enregistrement à La Réunion | Template 9site4',
  description:
    'Aperçu du template "Studio audio" proposé par 9site4 : enregistrement, mixage, mastering streaming, production musicale, équipement SSL/Pro Tools et ingénieurs résidents. Site fictif de démonstration.',
  canonical: '/templates/studio-audio',
  noindex: true,
},
```

### 3.c. Migration progressive

Une fois les entrées ajoutées, dans chacune des 5 pages templates (`tatoueur.astro`, `naturopathe.astro`, `creche.astro`, `notaire.astro`, `studio-audio.astro`), remplacer le bloc :

```ts
const localSeo = { … };
// puis : seo={localSeo}
```

par :

```ts
import { getSeo } from '../../lib/seo';
// puis : seo={getSeo('templateXxx')}
```

et supprimer le bloc `localSeo` correspondant.

---

## 4. Liens previews

Les previews créées (un fichier par template) sont à brancher dans la page `/realisations` selon la convention existante (mapping slug → component). Fichiers ajoutés :

- `src/components/realisations/previews/PreviewTatoueur.astro`
- `src/components/realisations/previews/PreviewNaturopathe.astro`
- `src/components/realisations/previews/PreviewCreche.astro`
- `src/components/realisations/previews/PreviewNotaire.astro`
- `src/components/realisations/previews/PreviewStudioAudio.astro`

---

## 5. Récapitulatif

| Template            | Slug             | JSON                    | Composants | Page                          | Preview                       |
|---------------------|------------------|-------------------------|-----------:|-------------------------------|-------------------------------|
| Studio de tatouage  | `tatoueur`       | `encrevolcan.json`      | 11         | `pages/templates/tatoueur.astro`     | `PreviewTatoueur.astro`       |
| Naturopathe         | `naturopathe`    | `source.json`           | 11         | `pages/templates/naturopathe.astro`  | `PreviewNaturopathe.astro`    |
| Micro-crèche        | `creche`         | `nid.json`              | 11         | `pages/templates/creche.astro`       | `PreviewCreche.astro`         |
| Étude notariale     | `notaire`        | `notaire.json`          | 10         | `pages/templates/notaire.astro`      | `PreviewNotaire.astro`        |
| Studio audio        | `studio-audio`   | `onde.json`             | 11         | `pages/templates/studio-audio.astro` | `PreviewStudioAudio.astro`    |

Total : 5 templates, 54 composants, 5 pages, 5 previews, 5 JSON.
