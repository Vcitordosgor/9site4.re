# Audit responsive — Pages SEO métiers + villes (320 → 1920px)

Branch : `worktree-agent-a52533ed6b958b094`
Périmètre : 10 pages métiers `site-internet-*` + 8 pages villes `creation-site-internet-*` (composant partagé `VillePageSections.astro`).

DA préservée : fond noir, bleu mauve `#91a6ff`, Sora/Roboto Mono, cards sombres premium. Tarif 97,4 €/mois intouché.

---

## 1. Audit P0/P1/P2

| Zone | Problème | Gravité | Correction |
|---|---|---|---|
| Hero pill `<p class="inline-flex ...">` métiers + villes | Texte long (ex. `Création incluse · Module métier · Gestion continue · Sud sauvage 974`) tient sur 1 ligne `whitespace-nowrap` implicite → débordement visuel ≤ 375 px | P1 | Ajout `flex-wrap items-center justify-center text-center` sur le pill `hero-rise-1` (22 pages impactées) |
| Bloc « Voir aussi : a · b · c · … » en pied de FAQ (10 métiers) | Liste inline dense avec `&nbsp;` non-cassable, dépasse à 320 px | P1 | Classe `seo-links-row` + CSS `overflow-wrap: anywhere; word-break: break-word;` |
| `villes-mesh-mention` (mention villes en pied, 10 métiers) | Même risque — liens longs côte à côte | P1 | Couvert par la règle CSS `.villes-mesh-mention { overflow-wrap: anywhere; word-break: break-word; }` |
| `VillePageSections.astro` « Villes proches » (8 villes) | Liste inline `9site4 accompagne aussi … à X, Y et Z.` | P1 | Ajout classe `seo-links-row` sur le `<p>` (1 fix → 8 pages) |
| Grilles cards `grid sm:grid-cols-2 lg:grid-cols-3 gap-5` | OK — déjà mobile-first `grid-cols-1` implicite | OK | — |
| Méthode `grid md:grid-cols-2 lg:grid-cols-5` (VillePageSections) | 5 items en `md:2` → orphelin esthétique, pas de débordement | P2 | Laissé — purement cosmétique |
| Hero h1 `text-[clamp(2.25rem,4vw+1rem,4rem)]` | Déjà fluide | OK | — |
| Body `overflow-x: clip` global (`globals.css`) | Déjà en place, ceinture-bretelles vs débordement | OK | — |

Aucun P0 (rien ne casse le rendu desktop validé).

## 2. Composants partagés fixés (impact multi-pages)

| Fix | Fichier | Pages impactées |
|---|---|---|
| Règles CSS `.seo-links-row` + `.villes-mesh-mention` + `.hero-badge-wrap` + `.seo-grid > *` | `src/styles/globals.css` | **18+ pages** (toutes les SEO/villes, + agence-web, site-vitrine, etc.) |
| Classe `seo-links-row` ajoutée sur « Villes proches » | `src/components/sections/VillePageSections.astro` | **8 villes** (1 fix → 8 pages) |
| Hero pill : `inline-flex` → `inline-flex flex-wrap … text-center` | 22 pages `.astro` (sed global) | **10 métiers + 8 villes + 4 autres** |
| Classe `seo-links-row` sur « Voir aussi » | 10 pages métiers (sed global) | **10 métiers** |

## 3. Fichiers modifiés

- `src/styles/globals.css` — règles guardrails responsive (append)
- `src/components/sections/VillePageSections.astro` — classe `seo-links-row` sur ligne « Villes proches »
- `src/pages/site-internet-*.astro` (×10) — classe `seo-links-row` sur ligne « Voir aussi », hero pill `flex-wrap`
- `src/pages/creation-site-internet-*.astro` (×8) — hero pill `flex-wrap`
- `src/pages/agence-web-la-reunion.astro`, `creation-site-internet-la-reunion.astro`, `site-vitrine-la-reunion.astro`, `realisations.astro` — hero pill `flex-wrap` (cohérence)

## 4. QA Playwright

Échantillon : 4 pages × 6 largeurs = 24 mesures. Critère : `max(body.scrollWidth, doc.scrollWidth) - innerWidth ≤ 1`.

| Page | 320 | 375 | 430 | 768 | 1024 | 1440 |
|---|---|---|---|---|---|---|
| `/site-internet-restaurant-la-reunion` | OK (0) | OK (0) | OK (0) | OK (0) | OK (0) | OK (0) |
| `/site-internet-artisan-la-reunion` | OK (0) | OK (0) | OK (0) | OK (0) | OK (0) | OK (0) |
| `/creation-site-internet-saint-denis` | OK (0) | OK (0) | OK (0) | OK (0) | OK (0) | OK (0) |
| `/creation-site-internet-saint-joseph` | OK (0) | OK (0) | OK (0) | OK (0) | OK (0) | OK (0) |

**Aucun débordement horizontal détecté.**

Captures (scratchpad) :
- `_site-internet-restaurant-la-reunion_375.png`, `_1024.png`, `_1440.png`
- `_creation-site-internet-saint-denis_375.png`, `_1024.png`, `_1440.png`

## 5. Build

`npm run build` → PASS (13 s, sitemap OK, aucune erreur).
