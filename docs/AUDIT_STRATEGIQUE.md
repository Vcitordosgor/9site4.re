# Audit 9site4.re — Avis stratégique

> Audit consultant senior, opinionné, à T-0 du lancement public. Lecture critique d'acheteur, de concurrent et de Google bot — pas un audit de conformité.

## TL;DR

Le site est **techniquement et visuellement très au-dessus** de la moyenne du marché agence 974, avec un produit éditorial cohérent et une promesse claire. Mais le projet a deux trous structurels qui peuvent tuer le lancement : **aucune preuve sociale réelle** (40 réalisations sont des templates fictifs, le site le dit lui-même dans les mentions légales) et **des incohérences de confiance** (numéro WhatsApp métropole +33, mentions légales avec « [À compléter] », contradiction analytics vs. cookie policy). La proposition de valeur "partenaire web à 97,4€/mois tout inclus" est différenciante mais frôle le "too good to be true" tant qu'on n'a pas une vraie raison sociale, un SIRET, et 2-3 vrais clients visibles. **Go conditionnel** : ne pas ouvrir au public tant que les 5 priorités P1 ci-dessous ne sont pas closes.

## Ce qui est excellent

1. **Direction artistique** — palette bleu nuit / bleu mauve / blanc cassé, typographie Sora italique, cards sombres premium : c'est cohérent, lisible, et ça **se distingue radicalement** des sites Wix/Elementor que les TPE locales voient habituellement. Le hero (`src/components/sections/Hero.astro`) est sobre et confiant.
2. **Architecture technique propre** — Astro static + Cloudflare Pages, vidéo hero différée en `requestIdleCallback` et désactivée sur mobile (gain ~4,7 MB), bundles JS lean (le plus gros = SiteRecommender à 60 KB). Performance LCP attendue excellente.
3. **Promesse éditoriale tenue** — "Le partenaire web des pros qui font vivre La Réunion" est répété sans dérive sur 70+ URLs. Pas de drift de positionnement entre pages métiers/villes/piliers.
4. **Mécanique de qualification** — le triptyque ContactForm / DiagnosticForm / SiteRecommender est plus ambitieux que 90% des concurrents. Le scoring de lead côté serveur est un vrai atout commercial.
5. **Maillage SEO méthodique** — page pilier `/creation-site-internet-la-reunion` + 11 pages métiers + 8 pages villes, tous reliés. JSON-LD `Service` propre, sitemap auto, canonical centralisé via `src/lib/seo.ts` : c'est de l'orfèvrerie côté SEO architectural.

## Ce qui est bien mais peut mieux faire

1. **Trop de portes d'entrée conversion** — Hero CTA "Créer mon site" + bandeau "Réalisations" + section sectors → "Contact" / "Diagnostic" / "Trouver le site adapté" : 3 funnels de qualification distincts visibles dès la home. Pour un visiteur tiède, c'est de la décision fatigue. **Hiérarchiser** : 1 CTA primaire (Contact), 1 secondaire (Diagnostic), et basculer le Recommender en outil contextuel (footer / pages métiers seulement).
2. **Hero compte 6 CTAs implicites** (2 boutons + 4 badges) — c'est dense. Les badges "Création incluse / Gestion continue / Sans frais de création / Accompagnement local" répètent ce que dit déjà la baseline. Garder 2-3 badges max.
3. **Incohérence Méthode** — home affiche **3 étapes** (`Methode9site4.astro`), `/methode-9site4` en affiche **5**. Choisir et aligner. Le visiteur qui clique pour "découvrir la méthode" voit un message différent.
4. **Section "secteurs" sur la home** — bonne intention SEO mais 8 mailings internes + 4 liens textuels en bas (pilier, méthode, diagnostic, recommender) = c'est lourd. Réduire à 6 secteurs et 1 lien sortant max.
5. **Promesse "7 jours"** — citée plusieurs fois mais jamais expliquée *en quoi* c'est crédible (méthode, équipe, capacité). Sur la home : ajouter un micro-bullet "Comment on tient ce délai" plutôt qu'asserter.
6. **Titres SEO descriptifs mais non-CTR** — ex. `Tarifs 9site4 — Formule claire à 97,4€/mois pour votre site professionnel` est correct mais plat. Tester des variants émotionnels : "97,4€/mois tout compris — site pro La Réunion sans surprise". Le chiffre `97,4` est l'angle distinctif, à pousser plus fort en SERP.
7. **Pages métiers redondantes** — `site-internet-institut-beaute-la-reunion` et `site-internet-bien-etre-sante-la-reunion` couvrent partiellement les mêmes personas (esthéticiennes, soin). FAQ et structure proches → vrai risque de cannibalisation Google. Soit fusionner, soit différencier radicalement le contenu et le ciblage (ex: santé = ostéo/psy/naturo / institut = beauté/coiffure/spa, **sans recouvrement**).
8. **Footer ne montre PAS l'offre / le prix** — bizarre pour un site mono-tarif. Le footer mentionne "Voir les tarifs" sans afficher 97,4€. Petite occasion ratée d'ancrage prix.

## Ce qui m'inquiète

1. **Aucune preuve sociale réelle** — 40 "réalisations" mais les mentions légales disent explicitement « *des templates fictifs de démonstration. Les noms d'entreprises, photos et coordonnées qui y figurent ne correspondent à aucune entreprise réelle.* » (`mentions-legales.astro:96`). Un acheteur attentif qui lit ça perd toute confiance. Et un prospect qui demande "vous travaillez avec qui ?" n'a aucune réponse vérifiable. **C'est le problème n°1 du projet.**
2. **Contradiction analytics ↔ cookie policy** — la page mentions-légales affirme **"Pas de Google Analytics, pas de Facebook Pixel"** (`:139-141`) alors que `Analytics.astro`, `src/lib/tracking.ts`, GA4 + Meta Pixel sont **présents et documentés** dans le repo. À l'activation prod, c'est un risque CNIL + perte totale de crédibilité si un visiteur regarde le source. **À résoudre AVANT le lancement** : soit retirer le tracking, soit ajouter un consent banner et corriger la page.
3. **WhatsApp +33 6 48 34 57 07 (métropole)** sur un site qui dit "Fait à La Réunion 🌴" — c'est **incohérent au signal**. Un client réunionnais qui voit un 06 métropole pour un partenaire "local" doute. Idéal : un 0692/0693 local OU au minimum afficher l'argument ("équipe basée à...") explicitement.
4. **Mentions légales avec `[À compléter]`** sur éditeur, SIRET, adresse, directeur de publication — bloquant pour le lancement public. **Aucun acheteur B2B sérieux ne signe sans SIRET visible.** Pas d'adresse = pas de mandat ad-words possible, pas de page Google Business, pas de crédibilité B2B.
5. **Risque d'unit economics** — "Sans engagement + sans frais de création + 97,4€/mois" = LTV très dépendante de la rétention. Un churn à 3 mois = perte sèche (création non-amortie). Le modèle n'est viable qu'avec ≥ 18 mois de rétention moyenne. Aucun frein contractuel : il faut compenser par produit/relation. **Pas testé en réel**.

## Détail par axe

### 1. Positionnement
La promesse "**partenaire web** (pas prestataire) des pros qui font vivre La Réunion" est claire et différenciante face aux freelances et agences. Le ton est tenu partout (sobre, pro, pas de superlatifs creux). Le distinguo vs Wix (DIY, support 0) et vs agence classique (devis à 3-8 k€, abandon post-livraison) est implicite mais jamais énoncé frontalement. **Recommandation** : un encart "Pourquoi pas Wix / pas une agence classique" assumé, court, factuel.

### 2. Funnel conversion
**Trop de chemins**. Home → 5 destinations possibles (Contact, Réalisations, Diagnostic, Recommender, Tarifs). Sur mobile, le visiteur défile et tombe sur la même décision 4 fois. Mobile sticky CTA présent (`MobileStickyCTA.astro`) — bien. Tunnel `ContactForm` à 8 champs est long pour mobile ; le découper en 2 étapes (besoin/contact) augmenterait probablement la complétion de 20-30%.

### 3. SEO & architecture
70+ URLs sur un marché de ~860k habitants : **agressif mais défendable** car la longue traîne "[métier] + La Réunion" est peu disputée. Risques :
- **Cannibalisation** entre `/creation-site-internet-la-reunion` (pilier), `/agence-web-la-reunion` et `/site-vitrine-la-reunion` — les trois targettent le même intent commercial, avec des `Service` JSON-LD quasi-identiques (mêmes 6 slugs de réalisations sélectionnés). Le pilier doit avoir l'ascendant ; `/agence-web` et `/site-vitrine` doivent ajouter un angle distinct (Q&A différentes, contenu différent), pas être des clones.
- **Cannibalisation métiers** : `institut-beaute` ∩ `bien-etre-sante` ∩ `coiffeur`. À nettoyer.
- **Titles** : descriptifs et longs (souvent > 65 caractères tronqués en SERP). À retravailler pour CTR.

### 4. Contenu éditorial
Qualité d'écriture **au-dessus de la moyenne**. Phrases courtes, ton pro et humain. Quelques tics LLM ("clairs, fiables, adaptés", triades à 3 adjectifs récurrentes — Hero, pilier, méthode). Ancrage local = **vernis** : "974", "Saint-Denis", "Saint-Pierre" cités, mais aucune référence culturelle réelle (zoreil/créole, particularités économiques type "saisonnalité tourisme", "marchés forains", "TVA spécifique DOM"). Un Réunionnais sentira la généricité. **Recommandation** : injecter 1 référence locale concrète par page (vraies villes desservies, vrais cas d'usage).

FAQ : utile, factuelle. La méthode 5 étapes est crédible mais générique — n'importe quelle agence pourrait la signer. La différenciation tient à l'exécution, pas au discours.

### 5. Design & UX
Cohérence visuelle **forte**. Palette restreinte, typographie unifiée (Sora + mono accents), composants UI propres. Cards sombres premium = tendance 2024-2025 ; **risque de vieillissement** dans 3 ans, mais pertinent maintenant. Hero vidéo bien gérée (chargement différé, mobile-off). Densité homepage = correcte sur desktop, **lourde sur mobile** (10 sections + 3 CTAs textuels en queue de section secteurs). Accessibilité : `aria-label`, `aria-hidden` présents — niveau réel à valider avec axe-core mais base saine.

### 6. Tarification
**97,4€/mois est crédible** si et seulement si :
- LTV ≥ 18 mois (sinon pas rentable création + gestion)
- volume opérationnel < ~30 sites par dev/mois (capacité)
- modifs simples bornées (sinon le "tout inclus" devient piège)

L'absence d'offre entry (49€) et premium (199€ avec e-com) prive 9site4 de levier prix et de signaux d'ancrage. **Une seule offre = facile à comprendre, mais facile à comparer pixel à pixel**. Ajouter une variante annuelle est un bon début (présent : 974€/an, -17%) ; manque une option "setup + main d'œuvre supplémentaire" pour les cas hors-périmètre.

### 7. Crédibilité
Le **plus gros chantier**. À faire avant ouverture publique :
- compléter raison sociale + SIRET + adresse + directeur de publication (`siteConfig.json` legal champs)
- numéro local 0692/0693 ou justification ancrage
- 2-3 vrais témoignages clients (même beta)
- statut clair des "réalisations" (templates vs cas réels) — actuellement caché en mentions légales, sera lu comme tromperie si découvert
- supprimer ou activer/déclarer correctement GA4 + Meta Pixel

### 8. Performance
Stack Astro static = base optimale. Vidéo hero = bien gérée. **Petits points** :
- `client:load` sur 3 formulaires : justifié pour ContactForm + DiagnosticForm (interaction prévisible), mais SiteRecommender (60 KB) en `client:visible` suffirait sur `/trouver-le-site-adapte` puisqu'il est sous le hero.
- 38 MB d'images dans `public/images` : audit WebP/AVIF + dimensions à confirmer.
- 4,7 MB de vidéo hero — chargé en différé desktop only, OK.

### 9. Tracking
Implémentation propre et bien designée (`src/lib/tracking.ts`, no-PII, no-op safe). Events `data-track-*` cohérents. **Manques** :
- pas d'event `form_submit_success` distinct par formulaire visible dans le code parcouru
- pas de `scroll_depth` (25/50/75/100%) — utile pour comprendre l'engagement long sur les pages métiers
- pas de `time_to_first_interaction`
- Lead scoring serveur : à vérifier que les leads "froids" ne sont pas filtrés par excès de zèle.

### 10. Risques production
- Bindings Cloudflare SEB **pas en place** → formulaires ne livreront pas d'email à la mise en prod publique. **Bloquant**.
- SPF/DKIM/DMARC du domaine `9site4.re` → à vérifier (sinon emails internes en spam).
- Sender `contact@9site4.re` : routing Email Routing Cloudflare à câbler.
- Capacité opérationnelle : si 50 leads/mois, 9site4 (solo ou petite équipe ?) peut-il livrer 7 sites en 7 jours en parallèle ? **Inconnu et critique** — la promesse délai casse vite.

### 11. Concurrence
- vs **Wix/Squarespace** : 9site4 a l'argument "fait pour vous", "module métier", "support humain local". Mais Wix à 14€/mois reste 7x moins cher. La cible doit être TPE qui valorise temps > argent.
- vs **WordPress/Elementor freelance** : 9site4 a l'argument "no setup fee + gestion continue". Le freelance facture 1500-3500€ + 30€/mois maintenance. 9site4 = moins cher en cash initial, plus cher en total à 24 mois. **Argument court terme.**
- vs **agences locales 974 (Bewedo, Web2Pro, etc.)** : prix divisé par 2-3, mais sans portfolio réel ni équipe identifiée. À court terme, 9site4 perd les leads "qui veulent voir une équipe et un local".

### 12. Stratégie
Marché Réunion = **petit et fragmenté**. ~25 000 TPE/PME potentielles, peut-être 5-10 000 cibles réalistes. Capter 1% = 50-100 clients = MRR 5-10 k€. Plafond visible. **Sans expansion régionale (Mayotte, Maurice ?) ou montée en gamme (e-commerce, retainer), modèle limité à un mono-opérateur.**

Dépendance d'un seul tarif : risque réel. La première remise demandée par un gros prospect ("je te paye 3000€ d'avance et tu me fais à 70€/mois") casse le pricing.

## Priorités d'action recommandées

| # | Action | Impact | Effort |
|---|--------|--------|--------|
| **P1** | Compléter mentions légales : raison sociale, SIRET, adresse, directeur de publication | Bloquant légal + B2B trust | 1 j (humain) |
| **P1** | Résoudre contradiction tracking ↔ cookie policy (soit tout retirer, soit consent banner + page MAJ) | Risque CNIL + crédibilité | 1-2 j |
| **P1** | Numéro WhatsApp local 0692/0693 OU justification visible de l'ancrage | Trust signal local | 0,5 j |
| **P1** | Câbler Email Routing Cloudflare + SPF/DKIM/DMARC + tester chaîne formulaire→email | Bloquant fonctionnel | 0,5-1 j |
| **P1** | Statut explicite des réalisations (badge "Démo / Template" visible) ou remplacer 3-5 cards par de vrais cas clients beta | Anti-tromperie + preuve sociale | 2-3 j |
| **P2** | Aligner Méthode (3 vs 5 étapes) + réduire CTA home (1 primaire, 1 secondaire) | Conversion + cohérence | 1 j |
| **P2** | Réduire cannibalisation : différencier `/agence-web` et `/site-vitrine` vs pilier ; fusionner ou clarifier `institut-beaute` ∩ `bien-etre-sante` | SEO durable | 2-3 j |
| **P2** | Découper ContactForm en 2 étapes (besoin → contact) | +20-30% complétion mobile estimés | 1-2 j |
| **P3** | Ajouter scroll_depth + form_submit_success events GA4 | Pilotage data | 0,5 j |
| **P3** | Tester variantes titles SEO orientées CTR (mettre "97,4€" en avant) | +10-20% CTR SERP estimé | 0,5 j |

## Verdict final

| Axe | Note /10 |
|---|---|
| Positionnement | 8 |
| Funnel conversion | 6 |
| SEO & architecture | 7 |
| Contenu éditorial | 7 |
| Design & UX | 9 |
| Tarification | 6 |
| Crédibilité | **4** |
| Performance technique | 9 |
| Tracking | 7 |
| Risques production | **4** |
| Concurrence | 6 |
| Stratégie | 6 |
| **Global** | **6,5 / 10** |

**Recommandation go/no-go** : **NO-GO public en l'état**. Tu as un produit web **objectivement très solide techniquement et visuellement** — au-dessus de tout ce que je vois à La Réunion. Mais les trous de crédibilité (mentions légales incomplètes, 0 client visible, WhatsApp métropole, contradiction tracking) sont des kill-switches pour un acheteur B2B et un risque réglementaire concret. **Estimation : 3-5 jours de travail ciblé pour passer en GO**, après quoi le site est prêt à encaisser des leads et c'est l'opérationnel qui devient le vrai sujet (capacité de livraison + rétention).
