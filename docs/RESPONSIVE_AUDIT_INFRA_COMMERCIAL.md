# Audit responsive 320 → 1920 px — Infrastructure + 13 pages commerciales

Date : 2026-06-23
Branche : `worktree-agent-a1a31d1355a9be449`
Base : `ffff685`

## Périmètre audité

### Infrastructure partagée
- `src/layouts/BaseLayout.astro`
- `src/components/layout/Header.astro`
- `src/components/layout/Footer.astro`
- `src/components/layout/MobileMenu.astro`
- `src/components/layout/MobileStickyCTA.astro`
- `src/components/layout/BackToSiteBubble.astro`
- `tailwind.config.mjs`

### Pages commerciales (13)
`index, realisations, tarifs, contact, diagnostic-site-internet-la-reunion,
trouver-le-site-adapte, methode-9site4, questions-frequentes,
creation-site-internet-la-reunion, agence-web-la-reunion,
site-vitrine-la-reunion, mentions-legales, 404`.

## Constat global

Le code est déjà **responsive-mature**. Audit P0/P1/P2 :

- ✅ Tous les H1 (12 pages sur 13) utilisent déjà `text-[clamp(2.25rem,4vw+1rem,4rem)]`
  ou variante équivalente — pas de débordement à 320 px.
- ✅ Aucun `<table>` ni `overflow-x-auto` dans les 13 pages commerciales.
- ✅ Aucun `min-w-[XXXpx]` problématique, aucun `whitespace-nowrap` en dehors
  des marquees `<template>/pizzeria|resto` (hors périmètre).
- ✅ Header mobile : burger 44×44 px, sticky `top-16` avec hauteur garantie.
- ✅ MobileMenu : panneau plein écran avec `top-16 bottom-0`, fermeture `inert`,
  liens 44 px min via `py-4 text-3xl`.
- ✅ MobileStickyCTA : `safe-area-inset-bottom` respecté, masqué hors scroll,
  ne s'affiche pas sur `/contact` (CTA déjà présent).
- ✅ Footer mobile : `pb-28 md:pb-8` → padding inférieur de 7 rem laisse la
  place au MobileStickyCTA (~64 px + safe-area) sans recouvrement.
- ✅ Footer email : `break-all` déjà présent.
- ✅ Grids commerciales : pattern `grid-cols-2 md:grid-cols-3/4`
  (jamais de saut brutal 1 → 4).
- ✅ Tap targets desktop nav header : `h-11 px-5`.

## Corrections P1 appliquées

### 1. `src/pages/404.astro` — H "404" overflow potentiel à 320 px
- Avant : `text-[8rem] md:text-[12rem]` → 128 px sur mobile, "404" mesuré
  ~210 px de large dans 272 px de zone utile (px-6 sur 320 px). Tight, et 12rem desktop figé.
- Après : `text-[clamp(5rem,18vw,12rem)]` → fluide 80 → 192 px, marge sûre.

### 2. `src/components/layout/Footer.astro` — Liste "Pages métiers"
- Ajout `[overflow-wrap:anywhere]` sur le `<ul>` du maillage métier
  (libellé long "Site internet pour praticien bien-être & santé" → garantit
  cassure propre si conteneur encore plus étroit).

## QA Playwright

**Statut** : ❌ Playwright bloqué (sandbox sans accès réseau pour télécharger
le binaire chromium — `npx playwright install chromium` échoue avec
`Download failure, code=1`).

**Fallback** : QA STATIQUE Node.js sur le HTML buildé via
`scripts/qa-responsive.mjs`. Vérifie :
- widths fixes en px ≥ 300 px sans protection
- balises `<table>` hors wrappers
- `overflow-x-auto/scroll` sans variante `md:`
- présence viewport meta
- cohabitation MobileStickyCTA + footer `pb-28`

### Résultats (après corrections)

| Page                                        | Statut |
|---------------------------------------------|--------|
| /                                           | ⚠ FP (1) |
| /realisations                               | ✅ |
| /tarifs                                     | ✅ |
| /contact                                    | ✅ |
| /diagnostic-site-internet-la-reunion        | ✅ |
| /trouver-le-site-adapte                     | ✅ |
| /methode-9site4                             | ✅ |
| /questions-frequentes                       | ✅ |
| /creation-site-internet-la-reunion          | ✅ |
| /agence-web-la-reunion                      | ✅ |
| /site-vitrine-la-reunion                    | ✅ |
| /mentions-legales                           | ✅ |

**Faux positif `/`** : `FormulairesIntegres.astro:723` utilise
`w-[280px] sm:w-[300px] lg:w-[340px] max-w-full` — le `max-w-full` neutralise
tout débordement potentiel. Aucun fix nécessaire.

Rapport JSON : `docs/qa-static-report.json`.

## Stratégie navigation mobile (confirmée OK)

1. Header mobile : burger 44 px → ouvre menu plein écran `fixed inset-x-0 top-16 bottom-0`.
2. MobileStickyCTA : bandeau bas après 250 px de scroll, `safe-area-inset-bottom`.
3. Footer : padding `pb-28` mobile pour éviter chevauchement du sticky CTA.
4. Sur `/templates/*` : `BackToSiteBubble` bottom-left au lieu du sticky CTA, safe-area aware.

## Captures

❌ Indisponibles (chromium non installable). À refaire en environnement
non-sandboxé via `npx playwright install chromium && node scripts/qa-responsive.mjs`
(le script peut être étendu vers Playwright dynamique une fois le binaire dispo).

## Résiduels & recommandations

- **À vérifier manuellement** sur device réel : tarif `97,4€` à
  `text-6xl md:text-7xl` (TarifsBref.astro:48) sur iPhone SE 320 px — calcul
  estime 60 px × ≈ 200 px de large, OK dans 272 px utiles, mais à confirmer.
- Playwright dynamique à activer en CI (Cloudflare Pages preview) quand
  l'environnement permet le download chromium.

## Fichiers modifiés

- `/home/user/9site4.re/.claude/worktrees/agent-a1a31d1355a9be449/src/pages/404.astro`
- `/home/user/9site4.re/.claude/worktrees/agent-a1a31d1355a9be449/src/components/layout/Footer.astro`
- `/home/user/9site4.re/.claude/worktrees/agent-a1a31d1355a9be449/scripts/qa-responsive.mjs` (nouveau)
- `/home/user/9site4.re/.claude/worktrees/agent-a1a31d1355a9be449/docs/RESPONSIVE_AUDIT_INFRA_COMMERCIAL.md` (nouveau)

## Build

✅ `npm run build` passe (12,43 s).
