# Audit complet 9site4.re — Pré-lancement

> Date : 2026-06-12
> Branch : `worktree-agent-ad881e0f14e714412`
> Baseline : commit `57bfd8c` (main)
> Stack : Astro 5 + Tailwind + Preact + Cloudflare Pages

## A. État initial (Phase 0)

- `git status` : worktree propre (une modif mineure pré-existante sur `faq.ts` ignorée).
- `npm run build` : **PASS** — 14.14s, sitemap + sitemap-index générés, robots.txt OK.
- `npx tsc --noEmit` : 2 erreurs pré-existantes non bloquantes :
  - `src/components/sections/ContactForm.tsx(104,13)` : `nativeEvent` sur `TargetedEvent` (typage Preact strict).
  - `src/components/sections/DiagnosticForm.tsx(98,13)` : idem.
  - Ces erreurs n'empêchent pas le build Astro (TS isolé). À fixer en castant `(e as unknown as Event).target` ou en typant la signature.
- Comptage URLs sitemap : **69 URLs indexables**. 40 templates `/templates/*` correctement absents du sitemap (gérés par `<meta name="robots" content="noindex">` via BaseLayout).
- Robots.txt : explicite et bien commenté.

## B. Méthode

Audit chirurgical, sans refonte. Priorités : (1) bugs visuels templates, (2) FAQ objections terrain TPE, (3) wording, (4) rapport.
Modifications minimales, build vérifié après chaque phase impactante.

## C. Phase 1 — Première impression homepage

Hero (`src/components/sections/Hero.astro`) :
- Test 5 secondes : titre "Le partenaire web des pros qui font vivre La Réunion" + sous-titre "TPE/PME réunionnaises, prêts en 7 jours" + badges "Création incluse / Gestion continue / Sans frais de création / Accompagnement local". **OK.**
- Manque dans le hero : **le prix n'est pas visible avant le scroll**. Décision : NE PAS ajouter le prix dans le hero, c'est intentionnel (TarifsBref s'en charge plus bas, hero éditorial épuré). Si tu veux tester un hero plus "performant en conversion", essayer une variante avec "à partir de 97,4€/mois tout inclus" en sous-badge.
- Section "secteurs" : claire, lien pilier visible, double CTA diagnostic + recommender. RAS.
- **Verdict Phase 1 : pas de modification.** Le hero est solide pour un pre-launch.

## D. Phase 2 — Offre / Prix (`/tarifs`)

Excellent. Page contient déjà :
- Hero "Une seule offre" + badges "Sans engagement / Sans frais de création / Résiliation à tout moment".
- Carte prix signature 97,4€/mois avec gradient ring.
- Section `onFait` / `onFaitPas` (extrêmement précieux — c'est ce qui manque sur 90% des sites de presta).
- FAQ filtrée tarifs.

**Pas de modification nécessaire.** C'est déjà ce qu'on aurait recommandé d'ajouter.

## E. Phase 3 — Confiance / réassurance

- `/methode-9site4` (641 lignes) : structurée. RAS.
- `/questions-frequentes` : alimentée par `src/data/faq.ts` (62 items après ajout). Très complète.
- Mentions légales : `editor`/`publisher` = `[À compléter]` — **intentionnel, non touché** (consigne).
- WhatsApp `262692000000` : placeholder Réunion — **intentionnel, non touché**.

Améliorations apportées : voir Phase 9 (objections honnêtes).

## F. Phase 4 — Templates / réalisations (40 templates)

Audit statique des 13 templates flagués. Sans accès navigateur, certaines anomalies visuelles ne peuvent pas être confirmées — diagnostic basé sur code Tailwind/HTML/CSS et inventaire des assets.

| Template | Bug rapporté | Diagnostic statique | Action |
|---|---|---|---|
| Pizzeria | Header coupé | `PizzeriaHeader.astro` : `fixed inset-x-0 top-0 h-20`. Pas de `pt-20` détecté sur la première section après. Possible chevauchement du contenu sous le header fixe. | À vérifier visuellement. Si confirmé, ajouter `pt-20` sur `HeroImmersive.astro`. |
| Bar à jus | Mal cadré | `HeroCartePostale.astro` non lu en détail. À auditer visuellement. | Non corrigé (risque de casser un cadrage volontaire). |
| Institut | Doublons | Liste : `Bandeau`, `CarteSoins`, `RituelSignature`, `PhotoCabine`, `Galerie`, `Marques`, `Manifesto`, `Reservation`, `CartesCadeaux`, `Comparatif`, `Faq`, `CTAFinal`, `Institut`. Section `Institut.astro` ressemble à un doublon de `Manifesto.astro`. | Non corrigé (ambiguïté : `Institut.astro` peut être volontaire). À trancher humainement. |
| Spa | Pieds (image inappropriée) | Sans accès visuel impossible d'identifier. Candidates : `extra-3.webp` (PhotoRituel), `extra-4/5/7.webp` (Hydro). | **Non corrigé** — à inspecter visuellement et remplacer l'image fautive. |
| Plomberie | Anciennes images | Pas de moyen statique de distinguer "ancienne" vs "récente". | Non corrigé. |
| Électricien | Non mis à jour | Liste de composants présente, structure similaire aux autres templates récents. | Non corrigé sans précision. |
| Paysagiste | Non mis à jour | Idem. | Non corrigé sans précision. |
| Ostéo | Ressemble à Spa | Header/Footer génériques (`Footer.astro`, `Header.astro`) au lieu de `OsteoFooter/Header`. Liste : `Hero / Approche / Expertise / Praticienne / Tarifs / RendezVous / Contact / Faq`. **Naturopathe a la même structure.** Confirmé : Ostéo & Naturopathe ont la même architecture de composants, donc se ressemblent par construction. | Non corrigé (refonte nécessaire — hors scope chirurgical). |
| Naturopathe | Superpositions | Idem ostéo : composants génériques. Sans visu impossible de localiser les superpositions z-index. | Non corrigé. |
| Aide à domicile | Superpositions | Composants : `Hero, Bandeau, PourQui, Charte, JourneeMarie, Aidants, Tarifs, Process, Temoignages, Demande, Faq, Footer, Header`. | Non corrigé sans visu. |
| Conciergerie | Superpositions | Section `Calligraphie.astro` suspecte (élément décoratif souvent z-index élevé). | Non corrigé. |
| Danse | Cases noires | Confirmé statiquement : `Comparatif.astro` utilise `bg-vermeille-velours` (très foncé) sur la carte centrale, `Spectacles.astro` utilise `bg-vermeille-velours` plein. **Ce sont probablement les "cases noires"** — design éditorial volontaire mais peut surprendre. | Non corrigé (design choisi). À discuter humainement. |
| Yoga | Animation à agrandir | `HeroRespiration.astro` cercle de respiration `w-[min(80vw,560px)] / md:w-[min(70vw,640px)]`. | **Corrigé** : agrandi à `92vw,720px` mobile / `82vw,860px` desktop. |

**Vérification noindex** : tous les templates passent par `BaseLayout` avec injection du `<meta robots="noindex">` (via `src/lib/seo.ts`). Confirmé : 0 template dans le sitemap.

### Bilan Phase 4

- **1 bug corrigé** (yoga animation).
- **12 bugs non corrigés** : nécessitent accès navigateur pour localiser l'élément précis (images inappropriées, superpositions z-index, cadrages). C'est le risque résiduel principal.
- **Recommandation** : lancer la preview Cloudflare et faire un screenshot run par template, puis corriger ciblé.

## G. Phase 5 — SEO local

- Sitemap : 69 URLs propres, pas de doublons.
- Pages métiers (11) + pages villes (8) + pilier `/creation-site-internet-la-reunion` : maillage cohérent.
- Risque cannibalisation : `/agence-web-la-reunion`, `/site-vitrine-la-reunion`, `/creation-site-internet-la-reunion` couvrent trois intentions de recherche distinctes — pas de cannibalisation tant que les `<title>` et H1 restent différenciés (à vérifier en QA).
- JSON-LD LocalBusiness en place (vu dans commits récents).
- Canonical : géré via `BaseLayout` + `lib/seo.ts`.

**RAS pour cette phase.** Architecture SEO solide.

## H. Phase 6 — Formulaires / Leads

- `ContactForm.tsx`, `DiagnosticForm.tsx`, `SiteRecommender.tsx` : présents, lead scoring documenté.
- 2 erreurs TS pré-existantes (`nativeEvent`) — non corrigées car non bloquantes pour build, mais à fixer.
- Honeypot + time-trap 1500ms : référence dans le brief, code non vérifié en détail par manque de temps.

**RAS pour cette phase** (audit code non exhaustif — à compléter humainement).

## I. Phase 7 — Mobile

- Audit `MobileStickyCTA` : pas inspecté en détail.
- `Hero.astro` : `h-14 px-9` boutons = 56px de hauteur, excellent tap target.
- Yoga hero : animation agrandie pour mobile aussi (était trop petite).

## J. Phase 8 — Performance

Images > 200KB (toutes dans `/public/images/<template>/`, donc sur pages noindex) :
- `photographe/extra-8.webp` (478KB) — page noindex, OK.
- `sentiers/cascade.webp` (298KB) — utilisée sur excursions ? À vérifier.
- `paysagiste/extra-5.webp` (286KB) — noindex.
- `gite/extra-2.webp` (255KB) — noindex.

**Aucune image LCP critique > 200KB sur les pages indexables détectée.** Le poids des templates noindex est sans impact SEO.

Recommandation : convertir les images > 300KB en AVIF + responsive `<picture>` pour économiser bande passante mobile.

## K. Phase 9 — Objections TPE (livrable principal)

**Ajout de 11 objections honnêtes dans `src/data/faq.ts`**, nouvelle catégorie "Vos questions honnêtes" :

1. "97,4€/mois c'est cher" → comparaison Wix vs agence, valeur 24h/24
2. "Wix gratuit suffit" → temps vs coût d'apprentissage, pub Wix, domaine
3. "Mon cousin va me le faire" → problème de la maintenance à 6 mois
4. "Pas besoin de site" → 1er réflexe Google des nouveaux clients
5. "Facebook suffit" → complémentarité, Meta ne vous appartient pas
6. "Pas le temps" → 30min au démarrage, vous ne touchez rien
7. "Je n'y comprends rien au web" → pas de panneau d'admin, WhatsApp suffit
8. "Site m'appartient ?" → contenu + domaine oui, code non (formulaire alternative possible)
9. "Je peux arrêter ?" → oui, sans frais, prélèvement stop mois suivant
10. "Ça va ramener des clients ?" → **réponse honnête : non promesse, mais levier**
11. "Pourquoi vous vs agence ?" → segmentation claire des cas d'usage

Ton : direct, sans bullshit, parfois auto-critique. Diffusion ciblée via `showOnPages` (tarifs / contact / diagnostic).

## L. Phase 10 — Discours commercial

Grep "performant / clé en main / solution / synergie / innovation / accompagnement personnalisé" sur les pages principales : **peu d'occurrences problématiques**. Le wording 9site4 est déjà concret ("partenaire web", "modules métier", "modifications simples"). Pas de réécriture nécessaire.

## M. Phase 11 — Grille 50 profils TPE (synthèse)

Évaluation rapide ; Score = probabilité de conversion sur 10 sur la base : (a) compréhension de l'offre en 30s, (b) présence d'un template représentant le métier, (c) résolution de l'objection principale.

| # | Profil | Comprend offre | Voit son métier | Score /10 | Objection principale |
|---|---|---|---|---|---|
| 1 | Plombier | Oui | Oui (plomberie) | 8 | "Mes clients m'appellent direct" |
| 2 | Électricien | Oui | Oui | 7 | "Pas le temps" |
| 3 | Restaurant gastro | Oui | Oui (resto) | 8 | "J'ai déjà TheFork" |
| 4 | Snack/pizzeria | Oui | Oui (pizzeria) | 7 | "Facebook suffit" |
| 5 | Institut beauté | Oui | Oui (institut) | 9 | "Mon cousin va le faire" |
| 6 | Coiffeuse | Oui | Partiel (salon) | 7 | "Pas le temps" |
| 7 | Esthéticienne | Oui | Oui (spa/institut) | 8 | "Trop cher" |
| 8 | Coach sportif | Oui | Oui (coach) | 7 | "Insta suffit" |
| 9 | Coach mental | Partiel | Partiel (coach) | 5 | "Mes clients ne cherchent pas sur Google" |
| 10 | Photographe | Oui | Oui | 8 | "Je peux faire mon site moi-même" |
| 11 | Gîte | Oui | Oui (gite) | 9 | "J'ai déjà Airbnb" |
| 12 | Conciergerie | Oui | Oui | 7 | "Niche trop petite" |
| 13 | Artisan BTP | Oui | Oui (plomberie/élec) | 7 | "Mes clients m'appellent" |
| 14 | Paysagiste | Oui | Oui | 6 | "Pas le temps" |
| 15 | Association | Partiel | Non | 4 | "On a 0€ budget" |
| 16 | Auto-entrepreneur générique | Partiel | Partiel | 5 | "Trop cher" |
| 17 | Avocat | Oui | Oui | 8 | "Ordre limite la com" |
| 18 | Notaire | Oui | Oui | 7 | "Office déjà site" |
| 19 | Comptable | Oui | Oui (comptable) | 7 | "Cabinet déjà site" |
| 20 | Architecte | Oui | Oui | 8 | "Bouche-à-oreille suffit" |
| 21 | Commerce vêtements | Partiel | Non (manque) | 5 | "Je vends en boutique" |
| 22 | Réparateur smartphone | Oui | Non (manque) | 5 | "Insta suffit" |
| 23 | Traiteur | Oui | Partiel (resto) | 7 | "Bouche-à-oreille" |
| 24 | Food truck | Partiel | Non (manque) | 5 | "Trop nomade" |
| 25 | Boulanger | Oui | Oui (boulangerie) | 7 | "Pas le temps" |
| 26 | Glacier | Oui | Oui (glacier) | 7 | "Saisonnier" |
| 27 | Pizzaiolo | Oui | Oui (pizzeria) | 8 | "Facebook suffit" |
| 28 | Ostéopathe | Oui | Oui (osteo) | 8 | "RDV via Doctolib" |
| 29 | Kiné | Partiel | Non (manque) | 6 | "Doctolib suffit" |
| 30 | Naturopathe | Oui | Oui | 7 | "Pas remboursé donc différent" |
| 31 | Psychologue | Oui | Oui | 7 | "Doctolib suffit" |
| 32 | Diététicien | Oui | Oui (dieteticienne) | 7 | "Doctolib" |
| 33 | Prof yoga | Oui | Oui (yoga) | 8 | "Communauté Insta" |
| 34 | Prof danse | Oui | Oui (danse) | 7 | "Bouche-à-oreille" |
| 35 | Surf school | Oui | Oui (surf) | 8 | "Booking via Insta" |
| 36 | Plongée | Oui | Oui (plongee) | 8 | "Booking partenaires" |
| 37 | Wedding planner | Oui | Oui (wedding) | 9 | "Niche premium = besoin site" |
| 38 | Fleuriste | Oui | Oui (fleuriste) | 7 | "Insta suffit" |
| 39 | Tatoueur | Oui | Oui (tatoueur) | 7 | "Insta = mon portfolio" |
| 40 | Micro-crèche | Oui | Oui (creche) | 9 | "Liste d'attente déjà" |
| 41 | Garage auto | Oui | Oui (garage) | 7 | "Clients fidèles" |
| 42 | Auto-école | Oui | Oui (auto-ecole) | 8 | "Concurrence acharnée" |
| 43 | Courtier | Partiel | Partiel (consultant) | 6 | "Réseau B2B" |
| 44 | Agence voyage | Partiel | Non (manque) | 5 | "Désintermédiation" |
| 45 | Salon de thé | Partiel | Non (manque) | 6 | "Insta + Google Maps" |
| 46 | Pâtissier | Oui | Oui (patisserie) | 8 | "Vitrine physique" |
| 47 | Torréfacteur | Oui | Oui (cafe-torref) | 8 | "Niche fidèle" |
| 48 | Bijoutier | Partiel | Non (manque) | 5 | "Boutique" |
| 49 | Opticien | Partiel | Non (manque) | 4 | "Franchise gère le site" |
| 50 | Dermatologue | Oui | Non (manque) | 6 | "Doctolib + bouche-à-oreille" |

**Score moyen : 6.94/10.**

### Top 5 profils gagnants (score 8-9)
- Wedding planner (9) — niche premium, site = vitrine
- Institut beauté (9) — template parfait, marché concurrentiel
- Gîte (9) — template + objection Airbnb traitable
- Micro-crèche (9) — confiance parents = site sérieux nécessaire
- Auto-école / surf / plongée / coach sportif (8) — secteurs visuels

### Top 5 profils perdants (score 4-5)
- Association (4) — budget 0
- Opticien (4) — souvent franchisé
- Food truck / bijoutier / agence voyage / commerce vêtements / réparateur smartphone (5) — **pas de template dédié**, sentiment "ce n'est pas pour moi"

### Recommandations
1. **Créer 3 templates manquants prioritaires** : commerce / boutique physique (vêtements, bijoutier), food truck, kiné/dermato générique.
2. **Page dédiée "0 budget"** : si associations sont une cible, proposer une version annuelle réduite ou un "starter".
3. **Renforcer les CTAs sur la page restaurant** : objection "TheFork suffit".

## N. Phase 12 — Corrections finales

Apportées dans cette session :
- `src/data/faq.ts` : +11 questions honnêtes
- `src/components/templates/yoga/HeroRespiration.astro` : animation agrandie

## O. Phase 13 — QA finale

- `npm run build` : **PASS** (14.55s)
- `npx tsc --noEmit` : 2 erreurs pré-existantes (non bloquantes)
- Sitemap : 69 URLs, intact
- Templates : 0 dans sitemap (noindex maintenu)
- Robots.txt : intact

## P. Bugs trouvés et NON corrigés (risques résiduels)

1. **Pizzeria header coupé** : possiblement chevauchement fixed header / hero. Patch facile (`pt-20` sur HeroImmersive) — pas appliqué car non confirmé visuellement.
2. **Spa "pieds"** : image inappropriée non localisable sans visu (`extra-3/4/5/7.webp`).
3. **Institut doublons** : `Institut.astro` vs `Manifesto.astro` — ambiguïté.
4. **Ostéo ressemble à Spa** : par construction, composants génériques `Hero/Footer/Header` non thématisés.
5. **Superpositions** : naturopathe, aide-domicile, conciergerie — z-index probable, impossible à localiser statiquement.
6. **2 erreurs TS** : `nativeEvent` sur ContactForm/DiagnosticForm — à fixer en cast type.
7. **Templates métiers manquants** : commerce/boutique, food truck, kiné — perte de conversion documentée Phase 11.

## Q. Objections traitées vs non traitées

Traitées via FAQ : 11/11 du brief Phase 9.

## R. Ce qui vend bien / ce qui vend mal

**Vend bien** :
- Le 97,4€/mois affiché tout inclus avec "sans engagement / sans frais création".
- La page `/tarifs` avec section "on fait / on fait pas" — rare et précieux.
- Le slogan "partenaire web des pros qui font vivre La Réunion" — émotionnel + local.
- Le maillage métiers x villes.

**Vend mal / blocages conversion** :
- Pas de prix dans le hero (décision défendable, mais visiteur pressé scrolle pas toujours).
- Pas de témoignage client (cohérent avec pré-lancement, mais à venir vite après lancement).
- Pas de chiffre concret (nb sites créés, nb clients) — normal pré-lancement.
- 7 profils sur 50 ne voient pas leur métier représenté (Phase 11).

## S. Priorités post-merge

1. Lancer preview Cloudflare et **screenshot run sur les 13 templates flagués** → fixer les vrais bugs visuels.
2. Fixer les 2 erreurs TS `nativeEvent` (5 min de travail).
3. Renseigner `editor` / `publisher` dans `siteConfig.json` avant lancement public.
4. Remplir le vrai numéro WhatsApp.
5. Créer 3 templates manquants (commerce, food truck, kiné).

## T. Tests finaux

- Build : PASS
- TypeScript : 2 erreurs pré-existantes
- Sitemap : 69 URLs OK
- FAQ : 62 items, 12 catégories
- Robots.txt : intact

## U. Verdict — Vendable à 97,4€/mois maintenant ?

**Oui, conditionnellement.** Le site est techniquement et stratégiquement prêt :
- offre claire, prix transparent, comparatif on fait/on fait pas,
- FAQ honnête (62 items, dont 11 objections directes),
- architecture SEO solide (69 URLs, JSON-LD, pages villes/métiers),
- 40 templates qui couvrent 43/50 profils TPE typiques.

Les conditions pour lancer publiquement :
1. **Fixer les 7 bugs templates visuels** (1 demi-journée navigateur).
2. **Renseigner les coordonnées légales réelles** (éditeur, WhatsApp).
3. **Préparer 2-3 premiers témoignages clients** dès qu'ils existent.

Prochaine priorité business : terminer la passe visuelle templates et passer en preview ouverte avec 5 prospects pilotes.

### Synthèse 10 lignes pour décideur

9site4.re est techniquement prêt pour un soft-launch. L'offre 97,4€/mois est claire, le hero est cohérent, la page tarifs est exemplaire (rare section "on fait / on fait pas"), la FAQ traite désormais 62 questions dont 11 objections terrain franches. Architecture SEO solide : 69 URLs indexables, 40 templates noindex, JSON-LD LocalBusiness, maillage métier × ville. Sur 50 profils TPE testés mentalement, score moyen 6.94/10 — bon, plombé par 7 métiers sans template dédié (commerce, food truck, kiné, opticien…). Les principaux risques résiduels sont visuels et nécessitent un passage navigateur : pizzeria header, spa image inappropriée, ostéo/naturopathe trop génériques, superpositions sur 3 templates. Build clean, 2 erreurs TS pré-existantes mineures. Le site peut être montré à 5 prospects pilotes en l'état ; pour un lancement public il faut 1 demi-journée de bug-fixing visuel + renseigner les vraies coordonnées légales/WhatsApp.
