# Page institutionnelle — La méthode 9site4

URL : `/methode-9site4`
Fichier : `src/pages/methode-9site4.astro`
Clé SEO : `methode` (cf. `src/lib/seo.ts`)

## Objectif

Présenter la méthode 9site4 de façon institutionnelle, claire et rassurante.
Cette page joue un rôle commercial indirect : elle structure la confiance des
visiteurs avant qu'ils passent au contact, au diagnostic ou aux tarifs. Elle
n'a pas vocation à promettre des résultats, mais à montrer comment 9site4
construit, structure et gère un site professionnel à La Réunion.

## Rôle commercial

- Page de référence à linker depuis les pages SEO métiers et la home.
- Point d'appui pour les démarches commerciales (réponse type "comment vous
  travaillez ?").
- Convertit en redirigeant vers `/contact`, `/diagnostic-...`, `/tarifs`.

## Structure (10 sections)

1. Hero — H1 + sous-titre + badges + 2 CTA (créer / réalisations)
2. Pourquoi une méthode — sens et utilité d'une méthode structurée
3. Les 5 étapes — comprendre, structurer, concevoir, intégrer module, mettre en ligne
4. Ce que 9site4 prend en charge — grille de 12 items
5. Une méthode adaptée aux métiers locaux — 8 secteurs avec lien SEO + 1-2 réalisations
6. Pourquoi cette méthode rassure vos clients — 6 bénéfices clients (sans promesse abusive)
7. La différence avec une création classique — comparatif sobre 2 colonnes
8. Nos réalisations illustrent cette méthode — 8 cartes + CTAs
9. FAQ courte — 7 Q/R via `<details>/<summary>` natif
10. CTA final — créer mon site / demander un diagnostic

## Maillage interne

Liens sortants depuis la page :
- `/contact`, `/realisations`, `/tarifs`, `/diagnostic-site-internet-la-reunion`,
  `/creation-site-internet-la-reunion`
- 8 pages SEO métiers (restaurant, artisan, institut, gîte, profession libérale,
  coach, commerce local, TPE/PME)
- Pages détail de réalisations (`/realisations/<slug>`)

Liens entrants ajoutés :
- `src/components/layout/Footer.astro` (navigation + maillage SEO)
- `src/pages/index.astro` (sous le bloc secteurs)
- `src/pages/tarifs.astro` (avant CTABand)
- `src/pages/contact.astro` (sous la FAQ)
- `src/pages/diagnostic-site-internet-la-reunion.astro` (sous le CTA final)
- `src/pages/creation-site-internet-la-reunion.astro` (voir aussi)
- `src/pages/site-internet-restaurant-la-reunion.astro` (voir aussi)
- `src/pages/site-internet-artisan-la-reunion.astro` (voir aussi)
- `src/pages/site-internet-tpe-pme-la-reunion.astro` (voir aussi)

## FAQ

7 questions/réponses sur : durée, fourniture des textes, adaptation métier,
réalisation comme point de départ, après mise en ligne, modifications,
démarrage sans tous les contenus. Inclus dans le JSON-LD `FAQPage`.

## SEO

- `<title>` : "La méthode 9site4 — Création de site internet à La Réunion"
- `<meta description>` : 220 caractères, axée méthode + livrables
- Canonical self, indexable
- JSON-LD : `WebPage` + `Service` (méthode) + `FAQPage` (7 Q/R), injecté en
  slot `head` du `BaseLayout`

## Règles de ton

- Pro, sobre, clair, rassurant, local
- Pas familier, pas startup, pas créatif/agence
- Pas de promesse "plus de clients" / "première position Google"
- Formulations privilégiées : "faciliter la prise de contact", "rendre les
  informations plus accessibles", "rassurer les visiteurs"
- Vouvoiement systématique

## Tracking

Events `data-track-*` (pas de PII) :
- `cta_create_site_click` — source : `methode_hero`, `methode_cta_final`, `methode_realisations`
- `cta_view_realisations_click` — source : `methode_hero`, `methode_realisations`
- `cta_diagnostic_click` — source : `methode_cta_final`
- `methode_sector_link_click` — source : `methode_secteurs`, `methode_secteurs_realisation`
