# AUDIT COMPLET — 9site4.re

> Audit en lecture seule · build du 2026-07-01 (commit `c09c530`) · 112 pages HTML crawlées · 9 auditeurs spécialisés (bugs, crawl, UX/CRO, UI, responsive, perf, a11y, SEO, qualité FR).
> **Aucune modification appliquée.** Chaque item attend validation explicite avant correction.

---

## Résumé exécutif

Le socle technique est solide (0 lien 404 interne, sitemap propre, formulaires exemplaires côté a11y, canonicals cohérents, aucun secret exposé) mais **le site n'est pas lançable en l'état** : les 2 CTA de paiement Stripe pointent vers des placeholders, le WhatsApp est un faux numéro diffusé sur ~30 pages, le contraste du bouton primaire échoue franchement le WCAG AA (2,31:1), et les templates fictifs sont présentés comme « Nos réalisations » (risque confiance/DGCCRF). Corriger les 4 P0 + les quick wins ≈ 1 journée de travail ; le reste est de l'optimisation par lots.

### Notes par axe

| Axe | Note /10 |
|---|---|
| État bugs (P0/P1 confirmés) | **5,5** |
| Crawl liens & placeholders | 6 |
| A — UX / Conversion | 6 |
| B — UI / Design system | 6 |
| C — Responsive | **7,5** |
| D — Performance | 6,5 |
| E — Accessibilité | 7 |
| F — SEO technique | **7,5** |
| G — Qualité éditoriale & code | 6,5 |
| **Moyenne** | **6,5** |

---

## 🔴 P0 — Bloquants lancement

### P0-1 · CTA de paiement Stripe = placeholders → conversion cassée à 100 %
- **Où** : `src/pages/tarifs.astro:15-16` (constantes `STRIPE_LINK_OFFRE_MENSUELLE` / `STRIPE_LINK_OFFRE_ANNUELLE`), usages lignes **126** et **166**. Rendu dans `dist/tarifs/index.html`.
- **Fix** : déplacer les 2 URLs dans `src/data/siteConfig.json` sous `pricing` (`stripeMonthlyUrl`, `stripeYearlyUrl`, à côté de `monthly`/`yearly` lignes 19-24) et les consommer via `siteConfig.pricing.*` dans tarifs.astro → les vrais Payment Links s'insèrent en **une seule édition**. **Garde-fou en attendant** : si l'URL contient `REMPLACER`, faire pointer le CTA vers `/contact` (pas de 404 Stripe).
- **Effort** : S

### P0-2 · WhatsApp placeholder `262692000000` sur ~30 pages (liens wa.me, tel:, JSON-LD)
- **Où** : `src/data/siteConfig.json:8` (`contact.whatsapp`). Consommé par `Footer.astro:17`, `contact.astro:11`, `ContactForm.tsx:16`, `DiagnosticForm.tsx:7`, `SiteRecommender.tsx:25`, `BaseLayout.astro:60` (JSON-LD `telephone`).
- **Fix** : **une seule édition suffit** — grep confirme que `262692000000` n'existe que dans siteConfig.json (les `0692 00 00 00` restants sont des placeholders d'input et des données démo templates, sans impact). Remplacer par le vrai numéro au format `262692XXXXXX`, supprimer `_whatsappTodo` ligne 10, rebuild. Tant que le numéro n'est pas réel, **retirer le champ `telephone` du JSON-LD** (une donnée structurée fausse est pire qu'absente).
- **Effort** : S

### P0-3 · Templates fictifs présentés comme « Nos réalisations » — risque confiance + pratique trompeuse
- **Où** : `src/pages/realisations.astro:59` (H1 « Nos réalisations »), `Header.astro:8`, `Footer.astro:8`, `VitrineExemples.astro:64`, `realisations/[slug].astro:151-155` — alors que `mentions-legales.astro:96` admet des « templates fictifs ».
- **Fix** : renommer partout en vocabulaire honnête : nav → « Exemples », H1 → « Des exemples de sites, métier par métier », badge → « {n} exemples de sites », eyebrow détail → « Exemple 9site4 · {secteur} ». Ajouter une ligne visible sur /realisations : « Sites de démonstration conçus par 9site4 — les noms d'entreprises sont fictifs. » **Garder l'URL `/realisations`** (SEO) avec le nouveau wording.
- **Effort** : M

### P0-4 · Contraste bouton primaire : blanc sur `#91a6ff` = **2,31:1** (échec AA franc, seuil 3:1 même en texte large)
- **Où** : `src/components/ui/Button.astro:46,49,51` ; `Badge.astro:26` ; `VitrineExemples.astro:98,130,159` ; `SiteRecommender.tsx:543,736` ; `MobileMenu.astro:53` ; `MobileStickyCTA.astro:37`.
- **Fix** : remplacer `text-white`/`text-blanc-casse` par `text-bleu-nuit` sur toutes les surfaces `bg-bleu` (noir sur #91a6ff = **8,58:1**, vérifié), OU foncer le bleu de marque (~#4a5fd9) si le texte blanc doit rester. Centraliser dans Button.astro + Badge.astro puis corriger les instances inline.
- **Effort** : M

---

## 🟠 P1 — Fort impact

### Bugs & structure

| # | Problème | Où | Fix | Effort |
|---|---|---|---|---|
| P1-1 | **Titres 2 lignes sans espace avant `<span class="block">`** → texte accessible/copié/SEO rendu « prosqui », « penséepour », « intégréà », « questionsqu'on » (le saut de ligne source est avalé à la minification) | Pattern dans **42 fichiers** : `Hero.astro:34-35`, `PourquoiChoisir.astro:39-40`, `Methode9site4.astro:37`, `FormulairesIntegres.astro:462`, `TarifsBref.astro:28`, `VitrineExemples.astro:64-65`, `Vision.astro:19`, `VillePageSections.astro:50/66/92/118/148/191`, `tarifs.astro:303-304` (cassure **visible**), `404.astro:20`, `contact.astro:56/125`, toutes pages métiers/villes | Fix unique : insérer `{' '}` explicite entre le texte et le `<span>`. Idéalement créer un composant partagé `SectionTitle.astro` ; a minima sed sur le pattern | M |
| P1-2 | Duplicata lecteur d'écran restant : chiffres clés VitrineExemples annoncés 2× (`dt.sr-only` + span visible même label). *Note : les marquees badges ×3 et cartes ×2 sont **déjà** corrigés avec aria-hidden — vérifié dans dist.* | `VitrineExemples.astro:146` et `:150` | `aria-hidden="true"` sur le span visible ligne 150 | S |
| P1-3 | 5 ancres mortes dans les navs de templates démo : plomberie `#realisations`→id réel `chantiers`, pâtisserie `#saisons` (×2), gîte `#tarifs`, comptable `#temoignages`, psychologue `#publics` | `PlomberieHeader.astro:14`, `VanilleHeader.astro:6`+`VanilleFooter.astro:28`, `CapHeader.astro:29`, `AubervalHeader.astro:21`, `AubryHeader.astro:19` | Corriger chaque href ou ajouter l'id manquant | S |
| P1-4 | Mentions légales incomplètes (SIRET, éditeur, adresse, directeur de publication) — placeholder volontaire mais **obligation légale** avant mise en ligne | `siteConfig.json:34` (`_todo`) | À renseigner par l'éditeur (humain) | M |
| P1-5 | Mentions légales **contradictoires** : « hébergé sur la plateforme OVH exploitée par : Cloudflare, Inc. » | `mentions-legales.astro:73-77` + `siteConfig.json:36` (`legal.host='OVH'`) | `legal.host='Cloudflare Pages'` (cohérent avec le déploiement réel et les sections RGPD) | S |

### UX / Conversion

| # | Problème | Où | Fix | Effort |
|---|---|---|---|---|
| P1-6 | **7+ variantes de CTA primaire** diluent le message : « Créer mon site avec 9site4 », « Créer mon site », « Demander mon site », « Demandez votre site », « Demander », « Choisir »… (styleguide.astro:78 décrète « Demander mon site » officiel et est contredit partout) | `Hero.astro:60`, `Header.astro:58`, `Etapes7Jours.astro:78`, `MobileMenu.astro:59`, `MobileStickyCTA.astro:29+43`, `CTABand.astro:51`, `tarifs.astro:136+176` | **Formulation maîtresse : « Créer mon site »** (court, actif, tient sur mobile ; « avec 9site4 » est redondant sur le site 9site4). Exception /tarifs : « Choisir la formule mensuelle / annuelle » (plus explicite que « Choisir » nu). Secondaire : « Voir les exemples » / « Demander un diagnostic gratuit ». Mettre à jour styleguide.astro:78 | M |
| P1-7 | **« À partir de 97,4€/mois » contredit le prix unique** — l'annuel est une remise, pas un palier : le « À partir de » est factuellement faux et fait suspecter des coûts cachés | `siteConfig.json:23` (`pricing.highlight` → Footer), `MobileStickyCTA.astro:32`, `TarifsBref.astro:46`, `styleguide.astro:155` | **Trancher : supprimer « À partir de » partout.** `highlight` → « 97,4€/mois — Tout inclus, sans engagement ». TarifsBref eyebrow → « Prix unique » | S |
| P1-8 | Hero home : proposition de valeur floue en 5 s — le H1 ne dit ni quoi (site web), ni combien, ni quand ; **le prix n'apparaît pas above the fold** | `Hero.astro:33-43` | H1 concret ex. « Votre site professionnel, créé et géré pour vous » + badge prix « Prêt en 7 jours · 97,4€/mois tout compris » dans la rangée de badges | S |
| P1-9 | Objections décisionnelles absentes au point de bascule /tarifs : pas de **HT/TTC**, pas de garantie, propriété du site non rappelée près du CTA Stripe | `tarifs.astro:109-120` et `:139-154`, `faq.ts:161-166` | 1) Préciser « TTC » (ou HT selon statut) à côté de /mois. 2) Micro-copy sous le CTA : « Sans engagement · Résiliation en un email · Vous restez propriétaire de votre domaine ». 3) Ajouter `tarifs` aux `showOnPages` de `obj-site-mappartient`. 4) Envisager « 1er mois satisfait ou remboursé » | M |

### UI / Design system

| # | Problème | Où | Fix | Effort |
|---|---|---|---|---|
| P1-10 | **`font-roboto-mono` utilisée sur ~139 eyebrows mais la police n'est jamais chargée** (aucun @font-face Roboto Mono en prod — seuls Sora et Inter) → rendu monospace système variable selon l'OS | 138 occurrences hors templates ; preuve : le CSS de prod ne contient que Sora/Inter | Importer `@fontsource/roboto-mono` (400+600) dans globals.css, OU remplacer par un style eyebrow Inter via classe utilitaire partagée | S |
| P1-11 | Variants Button `primary`, `primary-on-dark` et `secondary` **strictement identiques** → aucune hiérarchie possible entre 2 CTA côte à côte | `Button.astro:44-51` | `secondary` → outline/ghost (`bg-transparent ring-1 ring-bleu text-bleu hover:bg-bleu/10`) ; supprimer `primary-on-dark` (doublon exact) | M |
| P1-12 | Token `orange` = `#91A6FF` (bleu !) : 2 noms pour la même couleur, 53 usages actifs | `tailwind.config.mjs:21-22`, `globals.css:16-17,87` | Migrer les 53 usages vers `bleu` (sed), supprimer le token ; idéalement alias sémantique `accent` | M |
| P1-13 | Hover CTA `#7e95ff` codé en dur dans 5 fichiers (l'état interactif principal du site n'est pas tokenisé) | `Button.astro:46,49,51`, `VitrineExemples.astro:159`, `FormulairesIntegres.astro:709,834`, `Etapes7Jours.astro:76` | Ajouter `'bleu-fonce': '#7E95FF'` au config, remplacer les valeurs arbitraires | S |
| P1-14 | Gradient de surface `#14161F→#0A0B12` dupliqué en dur **~100+ fois** (cards pages SEO/sections) | `TarifsBref.astro:69,94`, `VillePageSections.astro:40`, `FAQAccordion.astro:57,97`, ~15 pages SEO | Tokens `surface`/`surface-deep` + classe `.card-dark` dans globals.css | M |

### Responsive / Performance / A11y

| # | Problème | Où | Fix | Effort |
|---|---|---|---|---|
| P1-15 | **Conflit z-index** : MobileStickyCTA (z-40, rendu après dans le DOM) recouvre le drawer MobileMenu ouvert (z-40) — la barre sticky masque le bas du menu si l'utilisateur a scrollé >250px | `MobileMenu.astro:25` + `MobileStickyCTA.astro:22` | MobileMenu → `z-[45]`, ou masquer le sticky quand le menu est ouvert | S |
| P1-16 | **Aucune image responsive** : 0 srcset, pas d'AVIF, 38 Mo de webp servis bruts (~30 fichiers >150 Ko, max 468 Ko) | `public/images/` + tous les `<img>` | Migrer les images de contenu vers `astro:assets` `<Image>` (avif+webp, widths+sizes) ; a minima recompresser les >150 Ko (cible <120 Ko) | L |
| P1-17 | CSS global monolithique **288 Ko** (43 Ko gzip) render-blocking sur toutes les pages — inclut les styles des templates | `dist/_astro/*.css` (généré depuis globals.css + Tailwind) | Scoper les styles templates par page ; cible <100 Ko raw pour la home | M |
| P1-18 | DOM home excessif : **4 187 tags**, index.html 268 Ko — FormulairesIntegres rend les 6 panneaux d'onglets entiers dans le HTML initial | `dist/index.html` + `FormulairesIntegres.astro` (~1000 lignes rendues) | Ne rendre que le panneau actif + `<template>` clonés au clic ; sprite pour les SVG répétés | L |
| P1-19 | Aucun preload de police : les 6 woff2 ne sont découverts qu'après le CSS de 288 Ko → FOUT tardif | `globals.css:2-7` + `BaseLayout.astro` head | `<link rel="preload" as="font">` pour sora-700 (H1) et inter-400 (body) ; évaluer suppression inter-500/sora-600 | S |
| P1-20 | **Pas de skip link** « Aller au contenu » (WCAG 2.4.1) | `BaseLayout.astro:247` | `<a href="#contenu" class="sr-only focus:not-sr-only …">` en premier enfant du body + `id="contenu"` sur le main | S |
| P1-21 | Placeholders de formulaires `text-bleu-nuit/40` = **2,86:1** (échec AA 4,5:1) | `Input.astro:43`, `Textarea.astro:37`, `ContactForm.tsx:256`, `DiagnosticForm.tsx:262`, `SiteRecommender.tsx:557` | Passer à `/55` minimum (4,77:1) | S |
| P1-22 | Saut de hiérarchie h2→h4 sur la home | `FormulairesIntegres.astro:518` | `<h4>` → `<h3>` (classes visuelles inchangées) | S |

### SEO

| # | Problème | Où | Fix | Effort |
|---|---|---|---|---|
| P1-23 | Titles/H1 des **8 pages villes quasi identiques** (similarité 0,87-0,93 — seul le nom de ville change) | `src/lib/seo.ts:523+` (8 clés villeXxx) | Différencier avec l'angle local déjà dispo dans `villes.ts` (microRegion, activitesDominantes) : ex. « Création de site internet à Saint-Paul — Gîtes, restaurants et commerces de l'Ouest (974) » | S |
| P1-24 | **Soft-duplicate villes : 45-62 % du corps textuel strictement identique** entre 2 villes (VillePageSections partagé) → risque de canonicalisation Google d'office sur une seule ville | `VillePageSections.astro` + les 8 pages | Ajouter 300-400 mots réellement uniques par ville (exploiter contextEconomique, secteursPertinents, quartiers) ; varier les 4 FAQ (actuellement même gabarit interpolé) | M |
| P1-25 | Faute FR : « une horaire » (horaire est masculin) | `faq.ts:158` | « un horaire » | S |
| P1-26 | Incohérence délai : « sous 7 jours **ouvrés** » sur /methode vs « 7 jours » partout ailleurs | `methode-9site4.astro:154` | Harmoniser (« environ 7 jours ») et interpoler `siteConfig.delivery.leadTime` | S |

---

## 🟡 P2 — Polish (sélection, liste complète conservée par axe)

| # | Problème | Où | Fix | Effort |
|---|---|---|---|---|
| P2-1 | Sticky CTA mobile non masqué sur /tarifs → concurrence le CTA Stripe | `MobileStickyCTA.astro:15` (`hideOnPaths=['/contact']`) | Ajouter `/tarifs` | S |
| P2-2 | Zones tactiles <44px : chips radio h-8 (32px), ancres FAQ h-9 (36px), inputs démo h-10 | `FormulairesIntegres.astro:680,664,574`, `FAQAccordion.astro:32` | h-11 partout sur l'interactif | S |
| P2-3 | Marquee BandeauReassurance : en `prefers-reduced-motion`, contenu tronqué inaccessible (overflow-hidden sans scroll) | `BandeauReassurance.astro:19,43` | Ajouter `overflow-x:auto` dans le bloc reduced-motion (comme VitrineExemples:186) | S |
| P2-4 | Hero `min-h-[92vh]` : la barre d'URL mobile pousse les CTA sous le pli | `Hero.astro:10` | `min-h-[92svh]` avec fallback | S |
| P2-5 | MobileStickyCTA masqué mais lien focusable (focus sur élément aria-hidden hors écran) | `MobileStickyCTA.astro:22,55-63` | Toggler `inert` en miroir d'aria-hidden | S |
| P2-6 | 6 islands `client:load` sous la ligne de flottaison (~25-35 Ko JS évitables/page) : formulaires templates spa/resto/plomberie/salon + DiagnosticForm + pizzeria shop | `spa/Reservation.astro:29`, `resto/Reservation.astro:29`, `plomberie/Intervention.astro:31`, `salon/RendezVous.astro:30`, `diagnostic-…astro:344`, `templates/pizzeria.astro:236` | `client:visible` (garder client:load pour ContactForm above-fold et SiteRecommender) | S |
| P2-7 | Vidéo hero 4,9 Mo MP4 unique (déjà différée desktop-only — bien) | `public/videos/hero.mp4` | Réencoder WebM VP9 (~1,5-2 Mo) + MP4 CRF28 fallback | M |
| P2-8 | 20 `<img>` home sans width/height ni aspect-ratio (CLS résiduel) | `VitrineExemples.astro` etc. | Dimensions intrinsèques (auto si migration astro:assets) | S |
| P2-9 | Overlay hover des cartes marquee inaccessible clavier/tactile (info seulement au :hover) | `VitrineExemples.astro:96-101,128-133` | `group-focus-visible:opacity-100` + `@media (hover:none){opacity-100}` | S |
| P2-10 | Titles des 16 pages métiers sur pattern unique (similarité 0,88) ; descriptions coiffeur/institut à 0,91 | `seo.ts:147-201` | Injecter le bénéfice métier dans le title (« — Carte, réservation, WhatsApp ») | S |
| P2-11 | /mentions-legales : indexable mais exclue du sitemap (contredit le commentaire robots.txt « indexables ») | `astro.config.mjs:18` vs `robots.txt` | Retirer l'exclusion du sitemap (recommandé) | S |
| P2-12 | robots.txt : `Disallow: /styleguide` empêche Google de lire le noindex (contradiction avec la logique /templates/) ; `Disallow: /404` inutile | `robots.txt:3-4` | Retirer les deux Disallow | S |
| P2-13 | Home : sitemap `https://9site4.re` (sans slash) vs canonical `https://9site4.re/` | `sitemap-0.xml` vs `dist/index.html` | Normaliser | S |
| P2-14 | ~13 composants morts jamais importés (dont PenseePour qui contient des **témoignages factices « ZONE À REMPLACER »** — danger de publication accidentelle) + 6 classes CSS custom inutilisées | `sections/{PourQui,Douleur,Approche,Offre,PenseePour,Promesse,CeQuOnVousDemande,Manifeste,ApercuRealisations,Etapes7Jours,ModuleMetier,ReassuranceFinale}.astro`, 7 composants templates orphelins, `globals.css:149,175-183,213-234,293,300` | Supprimer ou déplacer en `_archive` ; **priorité à PenseePour** | M |
| P2-15 | 10 composants morts stylés thème clair (text-bleu-nuit = noir) → noir sur noir si réutilisés | Idem P2-14 | Couvert par la suppression | — |
| P2-16 | Rythme vertical : 3 échelles concurrentes de padding sections (py-16 md:py-24 ×91, py-20 md:py-28 ×21, outliers) | `methode`, `contact:205`, `index:28`… | Utilitaires `.section`/`.section-lg` documentés | M |
| P2-17 | Radius arbitraires hors échelle (1.75/1.93/2/2.1/2.5/2.6rem) — le `[1.93rem]` de tarifs est un rayon interne calculé à la main | `tarifs.astro:89-93`, `FormulairesIntegres.astro:724,733` | Ajouter `4xl: 2rem` ; interne → `rounded-[calc(2rem-1.5px)]` (intention explicite) | S |
| P2-18 | Eyebrows non normalisés : 7 valeurs de tracking, 2 styles concurrents (pill vs label mono) | Sections + pages SEO | Composant `Eyebrow.astro` à 2 variants, tracking unique 0.3em | M |
| P2-19 | Badge/Button `tertiary` conçus pour fond clair → illisibles sur le site sombre | `Button.astro:52-53`, `Badge.astro:23-29` | Variants thème sombre ou prop tone | S |
| P2-20 | Token `bleu-nuit` = #000000 (nom trompeur), ~130 usages, cohabite avec `black` natif | `tailwind.config.mjs:24` | Renommer `noir` ou standardiser sur black | M |
| P2-21 | CTA header/hero dupliquent le style bouton en `<a>` inline (dérive déjà visible) | `Header.astro:50-59`, `Hero.astro:53-56` | Variant `inverse` dans Button.astro | S |
| P2-22 | href="#" focusables : calendrier excursions (dates complètes) + 3 dans /styleguide | `CalendrierProchaines.astro:27`, `styleguide.astro:240-241,288` | `<span>` pour l'inactif | S |
| P2-23 | Micro-textes 9-9,5px à 2,86-3,4:1 dans les mockups de formulaires | `FormulairesIntegres.astro:552,608,614,763,801,810` | `aria-hidden` sur les mockups décoratifs ou opacités /60 | S |
| P2-24 | JSDoc obsolète et trompeur : ContactForm annonce « aucun envoi réel (front uniquement) » alors qu'il POST vers /api/contact | `ContactForm.tsx:53-59` | Mettre à jour le commentaire | S |
| P2-25 | Typographie FR : guillemets droits `'…'` dans faq.ts:120, pas d'espaces insécables avant « : » dans les réponses longues | `faq.ts:120`, réponses FAQ | « … » + espaces insécables | M |
| P2-26 | KPI contact ambigu : « 7 jours pour **démarrer** votre site » (démarrer ≠ livrer) | `contact.astro:217-218` | « 7 jours pour mettre votre site en ligne » | S |
| P2-27 | /styleguide buildée et servie en prod (noindex + orpheline, mais présente) | `styleguide.astro` | Exclure du build prod ou préfixer `_` | S |
| P2-28 | FiltersBar `client:load` sur /realisations | `realisations.astro:76` | `client:idle` | S |

### 📌 Promo « 1er mois à 9,74€ » — points d'insertion le jour J (AUCUNE action maintenant)

Quand le coupon Stripe existera, 5 endroits à toucher :
1. `src/pages/tarifs.astro:109-120` — carte prix : « 1er mois : 9,74€ puis 97,4€/mois »
2. `src/data/siteConfig.json:23` — `pricing.highlight` (repris par Footer + styleguide) ; idéalement créer un champ `pricing.promo` centralisé
3. `src/data/faq.ts:201` (prix-combien) et `:218` (prix-engagement) — amender les réponses
4. `MobileStickyCTA.astro:32` — micro-copy prix
5. JSON-LD `Offer price:97.4` **dupliqué en dur sur ~15 pages SEO** (ex. `agence-web-la-reunion.astro:51`, `site-vitrine-la-reunion.astro:50`, pages villes) — ne PAS remplacer `price` (prix récurrent réel), ajouter une Offer promotionnelle avec `validThrough`. ⚠️ **Factoriser d'abord cette Offer dans `lib/seo.ts`** sinon la promo = 15 éditions manuelles.

---

## ⚡ TOP 5 QUICK WINS (≤30 min chacun, impact fort)

1. **WhatsApp réel** — 1 édition `siteConfig.json:8` + rebuild : débloque tous les wa.me/tel/JSON-LD du site d'un coup (P0-2). *Si le numéro n'est pas encore choisi : retirer `telephone` du JSON-LD en attendant.*
2. **Garde-fou Stripe** — dans `tarifs.astro`, si l'URL contient `REMPLACER` → CTA vers `/contact`. Le tunnel de vente ne casse plus même si le site part en ligne avant les Payment Links (P0-1 partiel).
3. **Contraste CTA** — `text-white` → `text-bleu-nuit` dans `Button.astro` + `Badge.astro` : le gros de P0-4 corrigé en 2 fichiers (8,58:1 au lieu de 2,31:1), les instances inline suivront.
4. **« À partir de » supprimé** — `siteConfig.pricing.highlight` + `MobileStickyCTA:32` + `TarifsBref:46` : le message « prix unique » redevient cohérent (P1-7).
5. **Pack micro-fixes FR/a11y** — « une horaire »→« un horaire » (faq.ts:158), « 7 jours ouvrés »→harmonisé (methode:154), OVH→Cloudflare (siteConfig:36), h4→h3 (FormulairesIntegres:518), skip link (BaseLayout), placeholders /40→/55 (5 fichiers).

---

## Ce que j'aurais fait différemment

**1. Un vrai design system dès le départ, pas des tokens de façade.** Le site a un `tailwind.config` mais la réalité est à côté : `orange` qui vaut bleu, `bleu-nuit` qui vaut noir, le hover principal (`#7e95ff`) et le gradient de cards (`#14161F→#0A0B12`) codés en dur 100+ fois, 3 variants de bouton identiques, 7 trackings d'eyebrow. J'aurais posé 6 tokens sémantiques (`fond`, `surface`, `surface-deep`, `accent`, `accent-hover`, `texte`) + 3 composants (`Button` à 3 variants réellement distincts, `Eyebrow`, `SectionTitle`) **avant** de générer 70 pages. Le coût de la dérive est maintenant ×100 : chaque retouche de charte = une campagne de sed.

**2. `SectionTitle.astro` obligatoire.** Le bug « prosqui/penséepour » (P1-1) n'existe que parce que le pattern titre-2-lignes a été copié-collé 42 fois à la main. Un composant à 2 props (`ligne1`, `ligne2`) l'aurait rendu impossible par construction — et c'est le fix que je recommande, pas le sed.

**3. Pages villes : moins mais mieux.** 8 pages générées depuis un gabarit partagé avec 45-62 % de contenu identique, c'est la recette du soft-duplicate que Google replie silencieusement. J'aurais lancé **3 villes** (Saint-Denis, Saint-Pierre, Saint-Paul) avec 600+ mots réellement locaux chacune, mesuré l'indexation 6 semaines, puis étendu. La couverture exhaustive sans profondeur est un passif SEO, pas un actif.

**4. Contenu servi = contenu utile.** La home embarque 4 187 nœuds DOM et 268 Ko de HTML parce que les 6 panneaux du module métier sont tous rendus, et le CSS global (288 Ko) transporte les styles de 40 templates sur toutes les pages. J'aurais rendu le panneau actif seul (`<template>` pour les autres) et scoped le CSS des templates. Sur le mobile d'un artisan réunionnais en 4G moyenne, c'est la différence entre 2 s et 5 s.

**5. Images via `astro:assets` dès la première image.** 38 Mo d'images statiques dans `public/` sans srcset ni AVIF, c'est le choix par défaut qui coûte le plus cher à rattraper (P1-16, effort L). `<Image>` d'Astro aurait donné avif+webp+srcset+width/height (donc zéro CLS) gratuitement, à la construction.

**6. L'honnêteté comme positionnement, pas comme mention légale.** Les « réalisations » fictives sont le vrai talon d'Achille commercial : le jour où un prospect découvre que « Le Jardin Perdu » n'existe pas, la confiance est morte — et c'est écrit dans les mentions légales. J'aurais assumé frontalement « 40 exemples métiers, conçus pour montrer ce que votre site peut être » : c'est différenciant, c'est vrai, et ça évite le risque DGCCRF. Puis j'aurais fait 3 vrais sites gratuits/à prix coûtant contre témoignage pour remplacer progressivement.

**7. Un seul CTA, martelé.** 7 formulations concurrentes = 7 micro-décisions imposées au visiteur. La règle aurait dû être dans le styleguide **et appliquée par un composant** (`<CTAPrimary/>`), pas par une convention que personne ne relit.

---

*Fin de l'audit. Aucune correction appliquée — validation item par item attendue.*
