# Rapport d'audit visuel — 9site4.re

Branche `chore/polish-visuel-20260709` · 2026-07-09 · Base : `main` (14e7f6f)
Méthode : captures fullPage Playwright (375 / 768 / 1440 px) de 10 pages → `docs/audit/avant/`,
console + réseau par page, Lighthouse (`lighthouse-avant.json`), inspection croisée par 3 reviewers,
vérification de chaque finding dans le code source.

## Notes par page

| Page | Note | Verdict |
|---|---|---|
| / (home) | 8,5/10 | Cohérente, riche, rythme maîtrisé — la vitrine tient le test des 5 secondes. |
| /tarifs | 8,5/10 | Carte offre très soignée, garde-fou Stripe déjà en place. |
| /contact | 9/10 | La meilleure page : formulaire propre, réassurance claire. |
| /realisations | 8/10 | Grille maîtrisée, mais état actif des filtres invisible et badge qui masque les mockups. |
| /methode-9site4 | 8,5/10 | Rythme éditorial impeccable ; carte orpheline en 768. |
| /questions-frequentes | 7/10 | Contenu excellent, mur d'accordéons sans navigation persistante. |
| /trouver-le-site-adapte | 8/10 | Quiz lisible, hiérarchie claire. |
| /site-internet-restaurant-la-reunion | 7,5/10 | Solide ; petits contrastes secondaires à surveiller. |
| /mentions-legales | 2/10 | **Illisible : texte noir sur fond noir sur toute la page.** |
| /404 | 5/10 | Titre et watermark quasi invisibles (même bug). |

## Cause racine du P0 principal

Le token Tailwind `bleu-nuit` a été **remappé sur `#000000`** lors du passage au fond noir
(`tailwind.config.mjs:29`, « token conservé par compat mais remappé »). Toute page qui utilise
encore `text-bleu-nuit` directement sur le fond noir du body affiche du noir sur noir.
Pages touchées : `/mentions-legales` (43 occurrences, page entière) et `/404` (titre, watermark,
paragraphe). Les autres usages de `text-bleu-nuit` posent sur des cartes claires : corrects.

## Findings priorisés

| N° | Page | Problème | Preuve | Prio | Fix prévu |
|---|---|---|---|---|---|
| 1 | /mentions-legales | Page entière illisible (texte `bleu-nuit`=#000 sur body noir) : titres, sommaire, corps invisibles ; seuls puces et liens soulignés émergent. Page légale illisible = risque LCEN + confiance. | avant/mentions-legales-*.png | **P0** | Remapper les classes de couleur de la page vers `blanc-casse` (mise en forme uniquement, contenu juridique intouché). |
| 2 | /404 | Titre « Cette page », watermark 404 et paragraphe en `bleu-nuit` sur noir : quasi invisibles. | avant/page-inexistante-404-1440.png | **P0** | Basculer les couleurs vers `blanc-casse` comme les heros des autres pages. |
| 3 | /tarifs | Liens Stripe placeholder (`buy.stripe.com/REMPLACER_*`, siteConfig.json:24-25). **Garde-fou déjà en place** : `tarifs.astro:16` détecte le placeholder et rabat les CTA sur `/contact` — pas de lien mort en prod. | code | **P0 — BLOQUÉ, donnée Vic requise** | Remplacer les 2 URLs dans `src/data/siteConfig.json` (`pricing.stripeMonthlyUrl` / `stripeYearlyUrl`) : bascule automatique en 1 commit, aucun autre fichier à toucher. |
| 4 | global | Numéro WhatsApp placeholder `262692000000` (`siteConfig.json:8`, champ `contact.whatsapp`). Utilisé par /contact, footer, module métier (configs `src/data/moduleMetier/*.json` : `+262692000000`). Schema.org l'omet déjà tant que placeholder (BaseLayout.astro:64). | code | **P0 — BLOQUÉ, donnée Vic requise** | Remplacer `contact.whatsapp` dans siteConfig.json + les 6 `destination.whatsapp` des configs module métier. |
| 5 | toutes (mobile) | Sticky CTA : « Créer mon site » écrit 2× (label + bouton) et sous-texte tronqué « …tout compris — sa… » (ellipsis sur un argument de vente). | avant/home-375.png | **P1** | Label = bénéfice, bouton = action, sous-texte court sans ellipsis. |
| 6 | /realisations | Filtres : l'état **actif** (`bg-bleu-nuit`=#000 sur fond noir) est le moins visible de la rangée — affordance inversée. | avant/realisations-1440.png, FiltersBar.tsx:69 | **P1** | Actif = pill `bg-bleu` (lavande), cohérent avec les badges de la DA. |
| 7 | /realisations | Badge « Réalisation » posé sur le header des mockups : masque le logo du mini-site sur la moitié des cartes. | avant/realisations-1440.png | **P1** | Déplacer le badge en bas-gauche du frame. |
| 8 | /methode-9site4 | Grille des 5 étapes en 768 px : étape 5 orpheline à gauche, symétrie cassée. | avant/methode-9site4-768.png | **P2** | Étape 5 en pleine largeur à ce breakpoint. |
| 9 | /questions-frequentes | Icône accordéon « → » (sémantique navigation) ; rotation 45° à l'ouverture. | avant/questions-frequentes-1440.png | **P2** | Voir Propositions (choix DA : chevron vs flèche signature). |
| 10 | toutes (mobile) | ~250 px de noir sous le © en bas de page (padding réservé sticky bar généreux). | avant/*-375.png | **P2** | Non corrigé (marge de sécurité safe-area ; gain faible vs risque). |
| 11 | /trouver-le-site-adapte | Carte quiz blanche sur section blanc cassé : délimitation faible. | avant/trouver-le-site-adapte-1440.png | **P2** | Voir Propositions. |
| 12 | /realisations | 40 vignettes hotlinkées sur images.unsplash.com : dépendance externe (poids, dispo, RGPD hors bannière). | realisations.json | **P2** | Voir Propositions (auto-héberger en WebP). |

Console : zéro erreur JS propre au site (seuls échecs : images Unsplash bloquées par le proxy du
sandbox d'audit + le 404 attendu de la page de test). Zéro scroll horizontal sur les 3 viewports.
Zéro lorem ipsum ; les noms fictifs des réalisations sont assumés par un disclaimer visible (bon réflexe).
Favicons complets, title/meta/OG/twitter uniques par page, `::selection` stylé, `prefers-reduced-motion`
respecté, skip-link présent, CLS = 0.

## Lighthouse (avant)

Mesuré **contre le serveur de dev Astro** (non minifié, non représentatif de la prod Cloudflare) :
performance 59 (LCP 8,9 s en dev), accessibilité 94, best-practices 96, SEO 100, CLS 0.
À re-mesurer en prod pour une base honnête ; les scores a11y/SEO restent significatifs.

## Propositions DA (aucune action sans accord de Vic)

1. **Icône des accordéons FAQ** : la flèche « → » qui pivote en « ↗ » est une signature, mais lit
   comme un lien. Proposition : chevron bas pivotant, ou « + / − ». Choix de DA.
2. **Auto-héberger les images** (réalisations + section Approche) en WebP/AVIF dans `public/` :
   supprime la dépendance Unsplash (perf, fiabilité, RGPD). Volumineux : à planifier.
3. **Carte quiz** (/trouver-le-site-adapte) : ombre portée douce ou bordure 1 px plus marquée
   pour la détacher du fond blanc cassé.
4. **/questions-frequentes** : sommaire sticky latéral en desktop (90 questions, la nav par
   catégories disparaît au scroll).
5. **Tableau comparatif méthode** : teinter la colonne « avec 9site4 » (lavande 5-8 %) pour que
   l'avantage se voie en scan rapide.
6. **Fallback no-JS** : sans JavaScript, tout le contenu `.scroll-reveal` reste invisible
   (opacity:0). Ajouter une gate `html.js` ou un `<noscript>` style. Faible impact réel, mais
   robustesse (et crawlers headless prudents).

## Points BLOQUÉS — données Vic requises

- **Vrais liens Stripe** → `src/data/siteConfig.json` lignes 24-25. Bascule automatique (garde-fou déjà codé).
- **Vrai numéro WhatsApp** (0692/0693) → `src/data/siteConfig.json` ligne 8 (`contact.whatsapp`,
  format international sans « + » : `262692XXXXXX`) + `destination.whatsapp` dans
  `src/data/moduleMetier/{artisan,coach,gite,institut,restaurant,yoga}.json` (format `+262692XXXXXX`).
