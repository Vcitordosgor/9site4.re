# New Templates Batch 1 — wiring TODO

Cinq nouveaux templates ont été créés en autonomie. Tous les fichiers de chaque template (JSON, page, composants, preview) sont en place et le build passe. Reste à wirer dans les fichiers partagés (tailwind, realisations, seo) — listes ci-dessous.

---

## Palette tokens à ajouter dans `tailwind.config.mjs`

### 1. boulangerie (Le Pain Levé)
```
'pain-mie':     '#F5EBD5',  // crème mie/papier kraft — fond principal
'pain-croute':  '#7A4A2A',  // brun croûte — accents, sous-titres
'pain-charbon': '#1A1614',  // charbon four — fonds dark, texte AAA
'pain-or':      '#C89B3C',  // doré céréale — accents, manuscrit
```

### 2. glacier (Sorbet Péi)
```
'sorbet-mangue':  '#FFB347',  // jaune mangue — accent dominant
'sorbet-letchi':  '#FF6F91',  // rose letchi — accent CTA / secondaire
'sorbet-vert':    '#A8D5BA',  // vert pistache pastel — section alt
'sorbet-creme':   '#FFF8E7',  // crème vanille — fond principal
'sorbet-cacao':   '#3D2817',  // brun cacao — texte AAA, fond dark
'sorbet-jaune':   '#FFD93D',  // jaune ananas Victoria — accents stickers
'sorbet-mangue-clair': '#FFE4B8',  // fond carte mangue
'sorbet-letchi-clair': '#FFD9E1',  // fond carte letchi
```

### 3. cafe-torref (Brûlerie d'altitude)
```
'torref-creme':   '#E8DDC7',  // crème sac kraft — fond principal
'torref-cafe':    '#3E2A1F',  // brun café torréfié — texte secondaire
'torref-charbon': '#1A0F0A',  // charbon presque noir — fond dark, texte AAA
'torref-cuivre':  '#B57A4A',  // cuivre chaud — accents, métadonnées
```

### 4. surf (Bord d'eau)
```
'surf-azur':  '#3CACAE',  // azur lagon — accent CTA / dominant
'surf-ecume': '#F4F8F7',  // blanc écume — fond principal
'surf-sable': '#E5C99A',  // sable doré — micro-accent chaud
'surf-nuit':  '#0F2A36',  // nuit océan — texte AAA, fond dark
```

### 5. fleuriste (Frangipane)
```
'flora-poudre':  '#F4E6E0',  // rose poudre — fond principal
'flora-feuille': '#5C7448',  // vert feuille — accents secondaires
'flora-charbon': '#2A2520',  // charbon doux — texte AAA, fond dark
'flora-ocre':    '#C49B62',  // ocre doré — accents, italics
```

---

## Entries pour `src/data/realisations.json`

```json
[
  {
    "id": 31,
    "nom": "Boulangerie artisanale",
    "sousTitre": "Levain naturel et viennoiseries maison",
    "slug": "boulangerie-artisanale",
    "categorie": "restaurants-et-snacks",
    "previewUrl": "/templates/boulangerie",
    "thumbnail": "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=900&auto=format&fit=crop",
    "moduleInclus": "Commande"
  },
  {
    "id": 32,
    "nom": "Glacier artisanal",
    "sousTitre": "Sorbets fruits péi et crèmes glacées",
    "slug": "glacier-artisanal",
    "categorie": "restaurants-et-snacks",
    "previewUrl": "/templates/glacier",
    "thumbnail": "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?q=80&w=900&auto=format&fit=crop",
    "moduleInclus": "Commande"
  },
  {
    "id": 33,
    "nom": "Café & torréfaction",
    "sousTitre": "Brûlerie artisanale, abonnement grains",
    "slug": "cafe-torrefaction",
    "categorie": "restaurants-et-snacks",
    "previewUrl": "/templates/cafe-torref",
    "thumbnail": "https://images.unsplash.com/photo-1559525839-d9acfd03c2f7?q=80&w=900&auto=format&fit=crop",
    "moduleInclus": "Commande"
  },
  {
    "id": 34,
    "nom": "École de surf",
    "sousTitre": "Initiation, perfectionnement, stages",
    "slug": "ecole-de-surf",
    "categorie": "tourisme-et-loisirs",
    "previewUrl": "/templates/surf",
    "thumbnail": "https://images.unsplash.com/photo-1502680390469-be75c86b636f?q=80&w=900&auto=format&fit=crop",
    "moduleInclus": "Réservation"
  },
  {
    "id": 35,
    "nom": "Fleuriste atelier",
    "sousTitre": "Bouquets, mariages, événementiel floral",
    "slug": "fleuriste-atelier",
    "categorie": "commerces-et-services",
    "previewUrl": "/templates/fleuriste",
    "thumbnail": "https://images.unsplash.com/photo-1494973367193-3f1f0a4cdcbe?q=80&w=900&auto=format&fit=crop",
    "moduleInclus": "Devis"
  }
]
```

> NB : `categorie` à adapter selon les valeurs déjà existantes dans `realisations.json` (vérifier le slug exact). Les previews à wirer dans le component qui rend les cards.

---

## Preview imports à wirer dans le composant card des réalisations

Les fichiers de preview existent (`src/components/realisations/previews/`):
- `PreviewBoulangerie.astro`
- `PreviewGlacier.astro`
- `PreviewCafeTorref.astro`
- `PreviewSurf.astro`
- `PreviewFleuriste.astro`

À ajouter dans le mapping slug → preview du composant card des réalisations.

---

## SEO entries pour `src/lib/seo.ts`

À ajouter à la fois dans le type `PageKey` et dans l'objet `PAGES`.

### Type additions
```ts
| 'templateBoulangerie'
| 'templateGlacier'
| 'templateCafeTorref'
| 'templateSurf'
| 'templateFleuriste'
```

### PAGES entries
```ts
templateBoulangerie: {
  title: "Le Pain Levé — Boulangerie au levain à La Réunion | Template 9site4",
  description:
    "Aperçu du template \"Boulangerie artisanale\" proposé par 9site4 : carte de pains au levain, calendrier de cuisson, processus du fournil, viennoiseries pur beurre. Site fictif de démonstration.",
  canonical: '/templates/boulangerie',
  noindex: true,
},
templateGlacier: {
  title: "Sorbet Péi — Glacier artisanal à La Réunion | Template 9site4",
  description:
    "Aperçu du template \"Glacier artisanal\" proposé par 9site4 : sorbets fruits péi, tournée du camion glacé, privatisation événementiel. Site fictif de démonstration.",
  canonical: '/templates/glacier',
  noindex: true,
},
templateCafeTorref: {
  title: "Brûlerie d'altitude — Café torréfié à La Réunion | Template 9site4",
  description:
    "Aperçu du template \"Café et torréfaction\" proposé par 9site4 : origines péi, méthodes d'extraction, abonnement grains frais. Site fictif de démonstration.",
  canonical: '/templates/cafe-torref',
  noindex: true,
},
templateSurf: {
  title: "Bord d'eau — École de surf à La Réunion | Template 9site4",
  description:
    "Aperçu du template \"École de surf\" proposé par 9site4 : formules initiation et perfectionnement, spots étudiés, lecture marée et matériel sécurité. Site fictif de démonstration.",
  canonical: '/templates/surf',
  noindex: true,
},
templateFleuriste: {
  title: "Frangipane — Atelier floral à La Réunion | Template 9site4",
  description:
    "Aperçu du template \"Atelier floral\" proposé par 9site4 : compositions de saison, mariages et événementiel, abonnement bureau. Site fictif de démonstration.",
  canonical: '/templates/fleuriste',
  noindex: true,
},
```

Une fois ces entrées ajoutées, remplacer dans les 5 pages le `getSeo('templatePatisserie' as any)` ou `getSeo('templatePlongee' as any)` par la bonne clé :

- `src/pages/templates/boulangerie.astro` → `getSeo('templateBoulangerie')`
- `src/pages/templates/glacier.astro` → `getSeo('templateGlacier')`
- `src/pages/templates/cafe-torref.astro` → `getSeo('templateCafeTorref')`
- `src/pages/templates/surf.astro` → `getSeo('templateSurf')`
- `src/pages/templates/fleuriste.astro` → `getSeo('templateFleuriste')`

---

## Fonts utilisées par template

- **boulangerie** : Caveat + Crimson Pro (via @fontsource — déjà installés)
- **glacier** : Fraunces + DM Sans (via @fontsource — déjà installés)
- **cafe-torref** : DM Mono (@fontsource) + IBM Plex Serif (Google Fonts `<link>` dans page head)
- **surf** : Inter (@fontsource) + Anton (Google Fonts `<link>` dans page head)
- **fleuriste** : Cormorant Garamond + Plus Jakarta Sans (via @fontsource — déjà installés)

Aucune dépendance NPM ajoutée. Les fonts via `<link>` (IBM Plex Serif, Anton) ne nécessitent rien de plus.

---

## Récapitulatif build

Tous les templates passent `npm run build` sans erreur. URLs générées :
- `/templates/boulangerie/`
- `/templates/glacier/`
- `/templates/cafe-torref/`
- `/templates/surf/`
- `/templates/fleuriste/`
