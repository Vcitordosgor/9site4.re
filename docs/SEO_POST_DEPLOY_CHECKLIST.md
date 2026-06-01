# 9site4 — Checklist post-déploiement SEO

Documentation opérationnelle à suivre une fois le site déployé en production
sur `https://9site4.re/` pour faire indexer le site par Google Search Console,
brancher le tracking et surveiller la qualité technique.

**Date de référence** : architecture validée pour soumission Search Console.

---

## 1. Architecture déployée — récapitulatif

| Élément | Valeur |
| --- | --- |
| Pages indexables (sitemap) | **57 URLs** |
| Pages SEO commerciales | **13** (1 pilier + 12 sectorielles/génériques) |
| Pages réalisations détail | **40** (`/realisations/<slug>/`) |
| Pages institutionnelles | home, `/realisations`, `/tarifs`, `/contact` |
| Templates noindex | 40 (`/templates/<slug>`) — hors sitemap, crawlables pour respect du noindex |
| Sitemap | `https://9site4.re/sitemap-index.xml` |
| Redirections 301 | `/exemples` → `/realisations` · `/site-internet-institut-beaute-spa-la-reunion` → `/site-internet-institut-beaute-la-reunion` |

---

## 2. Variables d'environnement

Renseigner en production (Cloudflare Pages → Settings → Environment Variables).
Voir `.env.example` à la racine du repo.

| Variable | Rôle |
| --- | --- |
| `PUBLIC_ENABLE_ANALYTICS` | Master switch. Doit valoir `true` pour activer tout tracking. Sinon **aucun script chargé**. |
| `PUBLIC_GA_MEASUREMENT_ID` | ID GA4 (`G-XXXXXXXXXX`). Vide = GA4 désactivé. |
| `PUBLIC_META_PIXEL_ID` | ID Pixel Meta (numérique). Vide = Pixel désactivé. |

**Comportement par défaut sans configuration** :
- 0 script externe chargé (pas de googletagmanager, pas de fbevents)
- 0 event envoyé
- 0 erreur console
- Le site fonctionne normalement

---

## 3. Checklist Search Console

### 3.1 Ajouter la propriété
1. Aller sur [Google Search Console](https://search.google.com/search-console)
2. Ajouter la propriété **Domaine** : `9site4.re` (recommandé, couvre HTTP/HTTPS/www)
3. Valider via DNS (TXT record chez le registrar)

### 3.2 Soumettre le sitemap
4. Menu **Sitemaps** → ajouter : `https://9site4.re/sitemap-index.xml`
5. Vérifier que Google récupère 57 URLs sans erreur

### 3.3 Demander indexation manuelle — pages prioritaires
Outil **Inspection de l'URL** → Demander l'indexation, dans cet ordre :

1. `/` (homepage)
2. `/creation-site-internet-la-reunion` (pilier SEO)
3. `/realisations` (grille principale)
4. `/agence-web-la-reunion` (capter requête "agence web")
5. `/site-vitrine-la-reunion` (capter requête "site vitrine")
6. `/site-internet-restaurant-la-reunion`
7. `/site-internet-artisan-la-reunion`
8. `/tarifs`
9. `/contact`

Le quota d'indexation manuelle est limité (~10/jour). Pour les autres pages,
laisser le crawl naturel suivre le sitemap.

### 3.4 Vérifications à faire après 1-2 semaines

| Section | Quoi vérifier |
| --- | --- |
| **Couverture / Indexation** | Toutes les pages SEO commerciales doivent passer en "Indexée". Les 40 `/realisations/<slug>` doivent suivre progressivement. |
| **Pages exclues — noindex** | Les 40 `/templates/<slug>` doivent apparaître ici (signe que Google les voit + respecte le noindex). |
| **Pages exclues — bloquée par robots.txt** | Ne doit contenir **AUCUNE** page SEO ou `/realisations/`. Si oui → bug, à corriger d'urgence. |
| **Pages découvertes non indexées** | Surveiller : si des pages SEO restent là après 2 semaines, qualité de contenu à renforcer. |
| **Couverture / Erreur** | 0 attendu. Si erreurs → vérifier les URLs concernées. |

### 3.5 Vérifs spécifiques
- ✅ `/templates/<slug>` apparaissent **noindex** dans la couverture (pas en "Bloquée")
- ✅ Aucune page importante bloquée par robots.txt
- ✅ Sitemap accepté sans erreur de parsing
- ✅ Aucune page indexée avec un `<title>` ou meta description manquant

---

## 4. Checklist Tracking (GA4 / Meta Pixel)

### 4.1 Avant activation

| À faire | Statut |
| --- | --- |
| Créer une propriété GA4 pour `9site4.re` | À faire |
| Récupérer le Measurement ID `G-XXXXXXXXXX` | À faire |
| (Optionnel) Créer un Pixel Meta Business | À faire |
| Renseigner les 3 vars env dans Cloudflare Pages | À faire |
| `PUBLIC_ENABLE_ANALYTICS=true` | À faire |
| Re-déployer | À faire |

### 4.2 Events implémentés (auto-déclenchés)

| Event | Catégorie | Déclencheur |
| --- | --- | --- |
| `cta_create_site_click` | conversion | CTA "Créer mon site avec 9site4" (Hero, CTABand toutes pages, MobileStickyCTA) |
| `cta_view_realisations_click` | navigation | CTA "Voir nos réalisations" (Hero, CTABand) |
| `cta_view_realisation_click` | navigation | Click sur card `/realisations` (image + bouton) — `label=slug` |
| `cta_create_in_this_style_click` | conversion | "Créer un site dans cet esprit" (RealisationCard) |
| `cta_view_template_preview_click` | navigation | "Voir l'aperçu complet" sur pages détail `/realisations/<slug>` |
| `cta_pricing_click` | navigation | "Voir les détails" tarifs / CTA page `/tarifs` |
| `contact_form_submit` | conversion | Soumission ContactForm (WhatsApp ou Email) |
| `whatsapp_click` | conversion | Auto-détection de tous les `wa.me/*` et `whatsapp.com/*` |
| `email_click` | conversion | Auto-détection de tous les `mailto:` |
| `phone_click` | conversion | Auto-détection de tous les `tel:` |

### 4.3 Contexte transmis (non-PII)

Chaque event peut transmettre :
- `category` : conversion / navigation
- `label` : context du CTA (slug, page_context)
- `page` : path actuel
- `source` : origine du click (`homepage_hero`, `realisation_card`, etc.)
- `target` : destination (`/contact`, `/realisations`, etc.)
- `sector` : pour pages SEO métiers (`restaurant`, `artisan`, etc.)
- `page_type` : `seo_sector_page` / `home` / `pricing` / etc.

### 4.4 Confidentialité — règles strictes

❌ **JAMAIS envoyé** : nom, email, téléphone, message, contenu de formulaire, IP non-anonymisée.
✅ **anonymize_ip: true** activé sur GA4.
✅ Tracker uniquement : type d'action, page, bouton, contexte, secteur.

### 4.5 Tests post-activation

1. Activer `PUBLIC_ENABLE_ANALYTICS=true` + ID en prod
2. Ouvrir GA4 → **DebugView** (Admin → DebugView)
3. Naviguer sur le site en mode normal
4. Cliquer "Créer mon site" → vérifier `cta_create_site_click` dans DebugView
5. Cliquer un lien WhatsApp → vérifier `whatsapp_click`
6. Envoyer un formulaire de test → vérifier `contact_form_submit` (sans PII)

---

## 5. Performance — points connus à surveiller

Lighthouse réel à passer une fois en prod (mobile + desktop) sur :
- `/`
- `/realisations`
- `/creation-site-internet-la-reunion`
- `/site-internet-restaurant-la-reunion`
- `/contact`
- `/tarifs`

### Points à améliorer plus tard (non bloquants)

| Sujet | Impact | Action recommandée |
| --- | --- | --- |
| **Vidéo hero `public/videos/hero.mp4` (4.7 MB)** | LCP mobile | Compresser à <1.5 MB avec ffmpeg (libx264 CRF 28, scale 1280x720) ou servir une version 720p mobile + 1080p desktop |
| **CSS bundle ~268 KB raw / ~41 KB gzip** | TBT marginal | Tailwind partagé avec les 40 templates. Acceptable en gzip. Refonte build pour split per-route possible mais hors scope. |
| **Préchargement fonts** | Render | Fonts Sora/Inter en woff2 self-hosted, `font-display: swap` déjà actif. |
| **Images templates** | Pas critique | Toutes en WebP, lazy par défaut. |

### CLS / LCP attendus
- **CLS** : ~0 (images avec aspect-ratio, vidéo avec dimensions)
- **LCP** : home limitée par la vidéo hero — viser <2.5s sur 4G après compression
- **FID/INP** : <100ms (peu de JS, marquee + tracking légers)

---

## 6. Validation des templates noindex

Après 1 semaine en prod, dans Search Console :

1. Inspecter `/templates/restaurant` (par exemple)
2. Vérifier dans le rapport : **"Indexabilité : Page non indexée — Exclue par la balise noindex"**
3. Faire de même sur 2-3 autres templates

Si une page `/templates/<slug>` apparaît comme indexée :
- Vérifier le `noindex` dans `seo.ts` (clé `template<X>`)
- Forcer re-crawl via Inspection URL
- Si persistant : demander suppression dans Search Console (outil Suppressions)

---

## 7. Pages SEO — vérifier indexabilité

Pour chacune des 13 pages SEO, dans Search Console :
- `/creation-site-internet-la-reunion`
- `/agence-web-la-reunion`
- `/site-vitrine-la-reunion`
- `/site-internet-tpe-pme-la-reunion`
- `/site-internet-restaurant-la-reunion`
- `/site-internet-artisan-la-reunion`
- `/site-internet-coiffeur-la-reunion`
- `/site-internet-institut-beaute-la-reunion`
- `/site-internet-gite-location-la-reunion`
- `/site-internet-profession-liberale-la-reunion`
- `/site-internet-coach-independant-la-reunion`
- `/site-internet-commerce-local-la-reunion`
- `/site-internet-bien-etre-sante-la-reunion`

Vérifier :
- ✅ Indexable
- ✅ Canonical = self
- ✅ Title et meta description renvoyés
- ✅ JSON-LD FAQPage + Service détectés (test via [Schema.org Validator](https://validator.schema.org/))

---

## 8. Pages réalisations détail — vérifier

Échantillonner 5 sur 40 dans Search Console :
- `/realisations/snack-pizzeria`
- `/realisations/plomberie`
- `/realisations/institut-de-beaute`
- `/realisations/avocat-cabinet`
- `/realisations/coach-sportif`

Vérifier :
- ✅ Indexable
- ✅ Canonical = self
- ✅ JSON-LD BreadcrumbList + CreativeWork détectés
- ✅ Lien "Voir l'aperçu complet" pointe vers `/templates/<slug>` (qui sera noindex)

---

## 9. Surveillance continue (mensuelle)

Une fois indexé, suivre dans GSC :

| KPI | Cible 3 mois |
| --- | --- |
| Pages indexées | ≥ 50 / 57 |
| Impressions | Croissance régulière |
| Requêtes principales | "création site internet la réunion", "site internet [métier] la réunion" |
| Position moyenne | <30 sur requêtes ciblées |
| CTR | >3% sur requêtes pertinentes |

Cross-référencer avec GA4 :
- `cta_create_site_click` provenant de pages SEO (`page_type=seo_sector_page`)
- `contact_form_submit` rate par source

---

## 10. Points à valider manuellement avant déploiement

- [ ] Renseigner les vars env Cloudflare Pages
- [ ] Vérifier que `public/_redirects` est bien copié dans le bundle final
- [ ] Test mobile réel (iPhone / Android) — hero, formulaire, MobileStickyCTA
- [ ] Compresser la vidéo hero si possible (4.7 MB → <1.5 MB)
- [ ] Configurer la propriété Search Console + DNS
- [ ] Créer la propriété GA4 + récupérer le Measurement ID
- [ ] Tester un envoi de formulaire de contact end-to-end
- [ ] Vérifier que les liens WhatsApp ouvrent bien WhatsApp (mobile)
- [ ] Optionnel : cookie consent banner (CNIL) si analytics activés

---

## Annexes

- Architecture SEO complète : voir commits `seo phase 1`, `seo phase 2`, `seo phase 3`, `seo consolidation`, `qa`
- Tracking : voir `docs/tracking.md`
- Composants : `src/lib/tracking.ts`, `src/components/Analytics.astro`
- Données : `src/data/realisations.json` (40 entrées enrichies)
