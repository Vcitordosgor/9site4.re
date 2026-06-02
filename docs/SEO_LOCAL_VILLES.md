# SEO local — pages géographiques par ville

## Objectif

Capter la longue traîne locale "création site internet [ville] La Réunion" sur les 8 principales communes du 974. Requêtes peu concurrentielles, intention locale forte = ranking rapide et renforcement de la perception "acteur local".

## Villes couvertes (8)

| Ville          | URL                                              | Code   | Micro-région |
|----------------|--------------------------------------------------|--------|--------------|
| Saint-Denis    | `/creation-site-internet-saint-denis`            | 97400  | Nord         |
| Saint-Paul     | `/creation-site-internet-saint-paul`             | 97460  | Ouest        |
| Saint-Pierre   | `/creation-site-internet-saint-pierre`           | 97410  | Sud          |
| Le Tampon      | `/creation-site-internet-le-tampon`              | 97430  | Sud          |
| Saint-André    | `/creation-site-internet-saint-andre`            | 97440  | Est          |
| Saint-Louis    | `/creation-site-internet-saint-louis`            | 97450  | Sud          |
| Saint-Benoît   | `/creation-site-internet-saint-benoit`           | 97470  | Est          |
| Saint-Joseph   | `/creation-site-internet-saint-joseph`           | 97480  | Sud          |

## Structure d'une page

1. Hero — H1 unique "Création de site internet à {Ville} (La Réunion)"
2. Contexte local — `descriptionCourte` + `contextEconomique` propres à la ville
3. Pourquoi un site pro — 5 raisons reformulées par ville
4. Activités locales — cards vers les pages SEO métiers (sélection ordonnée par `secteursPertinents`)
5. Méthode 9site4 résumée — 5 étapes + lien `/methode-9site4`
6. Tarif clair — `<TarifsBref />`
7. Réalisations — 6 cards, rotation par `variantSeed`
8. Villes proches — liens géographiques
9. FAQ locale 4 questions — `<details>/<summary>` + JSON-LD FAQPage
10. CTA final — `/contact` + `/diagnostic-site-internet-la-reunion`

Sections 2-9 sont mutualisées dans `src/components/sections/VillePageSections.astro`. Hero + CTA final restent dans chaque page pour personnalisation.

## Anti-duplicate content

- `descriptionCourte` + `contextEconomique` factuels et différents par ville (source : `src/data/villes.ts`)
- `raisons` (5 cards) reformulées spécifiquement par ville
- Title + meta description varient ville à ville
- Rotation des réalisations affichées via `variantSeed`
- Mentions de micro-région, code postal, voisines = signaux locaux variés

## JSON-LD

- **`Service`** avec `areaServed: Place` (`addressLocality`, `postalCode`, `addressRegion`)
- **`FAQPage`** par page (4 Q/R locales)
- Pas de LocalBusiness avec adresse physique (9site4 travaille à distance, pas d'adresse à inventer)

## Maillage interne

- **Footer** : section "Villes desservies à La Réunion" avec les 8 liens, présente sur tout le site
- **Page pilier** `/creation-site-internet-la-reunion` : grille "Par ville" en bas
- **Page pilier** `/agence-web-la-reunion` : grille "Par ville" en bas
- **10 pages SEO métiers** : mention discrète "9site4 accompagne aussi les [métier] à {3-4 villes}" — villes variées par page pour éviter pattern uniforme
- **Pages ville** : section "Villes proches" + liens vers pages métiers pertinentes

## Sitemap

`@astrojs/sitemap` détecte automatiquement les nouvelles routes. Build local pour vérifier `dist/sitemap-index.xml`.

## Ajouter une nouvelle ville

1. Ajouter une entrée `VilleInfo` dans `src/data/villes.ts` (slug, code, micro-région, données factuelles)
2. Ajouter une clé `villeNomVille` dans `PageKey` + entrée `PAGES` (`src/lib/seo.ts`)
3. Créer `src/pages/creation-site-internet-<slug>.astro` à partir du gabarit d'une ville existante (hero + `<VillePageSections>` + CTA)
4. Adapter le tableau `raisons` (5 entrées) et la FAQ (4 questions) au contexte de la ville
5. Mettre à jour `villesProches` des villes voisines pour intégrer la nouvelle au maillage

## Limites

- Au-delà de 12-15 villes, risque de thin content : les communes plus petites manquent de spécificités économiques distinctes
- Ne pas créer de pages géo × métier (ex: "site internet coiffeur Saint-Denis") tant que les pages ville et métier ne ranking pas — risque fort de duplication et de dilution du jus interne
- Données factuelles uniquement : pas d'invention d'adresse physique, pas de témoignages, pas de chiffres clients par ville
