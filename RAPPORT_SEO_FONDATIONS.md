# Rapport — SEO Fondations techniques (9site4.re)

Branche : `feat/seo-fondations` (depuis `main` @ `210cfb9`). Aucun merge effectué — validation visuelle Vic puis merge `--no-ff`.

## État des lieux (Phase 0)

Le repo disposait déjà d'un socle SEO solide, factorisé et conservé tel quel :

- `src/lib/seo.ts` : source unique title/description/canonical/OG par page (équivalent du composant `SEO.astro` demandé, consommé par `BaseLayout.astro`).
- `astro.config.mjs` : `site: 'https://9site4.re'`, `trailingSlash: 'never'` (uniforme), `@astrojs/sitemap` configuré (404, styleguide, templates noindex et fragments exclus).
- `BaseLayout.astro` : canonical absolu, hreflang, OG complet (+dimensions/alt), Twitter `summary_large_image`, JSON-LD `Organization` + `WebSite` + `ProfessionalService` (LocalBusiness) avec `Service` + `Offer` 97.4 EUR/mois + `WebPage`.
- `public/robots.txt` : `Allow: /` pour tous les agents (aucun blocage GPTBot/OAI-SearchBot/ClaudeBot/PerplexityBot/Bingbot) + sitemap.
- `FAQPage` JSON-LD uniquement sur les pages avec FAQ visible (/questions-frequentes, pages villes, méthode) — questions/réponses reprises du contenu.
- 404 personnalisée stylée DA, noindex ; OG image de marque 1200×630 (79 KB PNG).

Inventaire : **112 pages** dans le build, dont **70 indexables** (30 pages marketing + 40 détails /realisations/<slug> ; 42 pages noindex : 40 templates démo, styleguide, 404).

## Modifications apportées

### Phase 1 — On-page `<head>` (`affee06`)

- **~65 pages indexables** avaient un title >60 car. et/ou une description >155 car. Toutes réécrites dans `src/lib/seo.ts` (mot-clé + bénéfice conservés, format `{Sujet} | 9site4`). Aucun texte visible modifié.
- **H1 corrigé** : `/templates/danse` rendait 3 `<h1>` (mots rotatifs du hero). Le premier mot reste `<h1>`, les deux autres deviennent `<p>` avec classes identiques → zéro diff visuel (CSS 100 % par classe).

Avant → après (pages indexables, longueurs title/description en caractères) :

| Page | Avant | Après |
|---|---|---|
| / | 51/229 | 51/147 |
| /tarifs | 73/243 | 55/152 |
| /contact | 50/180 | 50/142 |
| /realisations | 67/227 | 50/154 |
| /questions-frequentes | 75/193 | 53/152 |
| /methode-9site4 | 58/174 | 58/150 |
| /trouver-le-site-adapte | 62/174 | 50/152 |
| /diagnostic-site-internet-la-reunion | 57/179 | 57/146 |
| /agence-web-la-reunion | 45/170 | 45/140 |
| /site-vitrine-la-reunion | 54/175 | 54/152 |
| /creation-site-internet-la-reunion | 60/153 | 60/153 (inchangé) |
| 8 pages villes (saint-denis … saint-joseph) | 86–101/154–176 | 52–55/139–151 |
| 12 pages métiers (site-internet-…-la-reunion) | 77–94/136–203 | 43–60/135–155 |
| 40 pages /realisations/<slug> | 64–80/162–178 | 37–59/126–151 |
| /mentions-legales | 25/93 | inchangé |

(Détail exhaustif par URL : sortie de `node scripts/seo-check.mjs` sur `dist/`.)

### Phase 2 — Données structurées (`9791812`)

- Ajout **`BreadcrumbList`** (Accueil → page) sur toutes les pages internes via `BaseLayout.astro`. Exclusion de `/realisations/<slug>` qui possédait déjà un breadcrumb 3 niveaux plus riche.
- Déjà en place et conservés : `Organization`, `WebSite`, `ProfessionalService` (schéma métier LocalBusiness) avec `areaServed` La Réunion + 7 villes, `address` (région/pays/974 uniquement — rien au-delà des mentions légales), `Service` « Création de site vitrine clé en main » et `Offer` **97.40 EUR/mois** (dérivé de `siteConfig.pricing.monthly`, wording affiché intact), `FAQPage` sur pages à FAQ visible.

### Phase 3 — Sitemap, robots.txt, llms.txt (`5e001c1`)

- Sitemap et robots.txt : déjà conformes, non modifiés.
- **`public/llms.txt` créé** : pitch + 11 pages clés en liens absolus.

### Phase 4 — Images OG

- Image de marque **1200×630, PNG 79 KB** déjà présente (`/og-image.png`), branchée sur toutes les pages avec `og:image:alt`. **Conservée telle quelle** (DA verrouillée).
- Variante par page avec title en overlay : **non retenue pour v1** (le pipeline d'images OG dynamiques via satori/og-canvas ajouterait une dépendance build ; l'image de marque unique suffit). → v2.

### Phase 5 — Hygiène crawl (vérifiée, rien à changer)

- 404 personnalisée stylée : présente.
- Contenu critique : rendu statique Astro (aucun contenu clé client-only ; les îlots Preact sont des enrichissements).
- Liens internes : header + footer sur toutes les pages marketing → largement ≥2 liens/page.
- Images : **0 `<img>` sans `alt`**, **0 image lazy-loadable sans `loading`** sur les 112 pages du build.

### Phase 6 — QA (`scripts/seo-check.mjs`, nouveau)

`node scripts/seo-check.mjs --strict-lengths` sur `dist/` vérifie : title/description présents, uniques (pages indexables) et dans les longueurs ; canonical absolu ; OG 5 propriétés + twitter:card ; H1 unique ; JSON-LD parsable ; présence de sitemap-index.xml, robots.txt, llms.txt.

## Definition of Done

- [x] `npm run build` sans erreur ni warning nouveau ; `npm test` vert (16 tests).
- [x] QA `dist/` : **112 pages, 0 erreur** (unicité + longueurs strictes).
- [x] JSON-LD valide sur toutes les pages, types conformes (LocalBusiness/ProfessionalService + Service + Offer 97.40 EUR).
- [x] `sitemap-index.xml`, `robots.txt`, `llms.txt` présents dans le build.
- [x] Lighthouse (build servi en local) : **/ → SEO 100, Perf 96** · **/tarifs → SEO 100, Perf 98**.
- [x] Zéro diff visuel : modifications limitées au `<head>` + substitution de balise à classes identiques sur /templates/danse.

## Champs omis faute de donnée fiable

- **`telephone`** (LocalBusiness) : le numéro WhatsApp de `siteConfig.json` (`262692000000`) est **factice** (P0 connu). Le code existant l'omet déjà tant que le placeholder n'est pas remplacé — conservé tel quel, jamais injecté dans le schéma.
- **`sameAs`** (Organization) : instagram/facebook/linkedin vides dans `siteConfig.json` → omis.
- **`streetAddress`** : non présent dans les mentions légales → seuls région/pays/CP 974 figurent au schéma.

## Laissé pour v2

- Images OG par page (title en overlay) via satori + fonts locales du repo.
- `width`/`height` explicites sur les images des templates démo (noindex — dimensionnées via CSS aspect-ratio, sans impact CLS mesuré).
- Trailing slash de la home dans le sitemap (`https://9site4.re` sans slash — limitation `@astrojs/sitemap`, déjà documentée dans `astro.config.mjs`, sans impact).
- Liens Stripe placeholder (`REMPLACER_MENSUEL/ANNUEL`) : P0 séparé, non touché.
