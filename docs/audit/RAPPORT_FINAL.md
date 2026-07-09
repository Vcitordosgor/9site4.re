# Rapport final — polish visuel 9site4.re

Branche `chore/polish-visuel-20260709` · 2026-07-09 · **Aucun merge effectué — validation Vic requise.**
Tests : 19/19 verts après chaque commit. `npm run build` : OK. Captures après : `docs/audit/apres/`.

## Correctifs appliqués (avant → après)

| Fix | Commit | Preuve avant | Preuve après |
|---|---|---|---|
| **P0 — Mentions légales illisibles** (texte `bleu-nuit`=#000 sur fond noir, page entière). Remap mécanique des couleurs vers `blanc-casse` — mise en forme uniquement, contenu juridique intouché. | `52a3477` | avant/mentions-legales-1440.png | apres/mentions-legales-1440.png |
| **P0 — 404 quasi invisible** (titre, watermark, paragraphe en `bleu-nuit`). | `52a3477` | avant/page-inexistante-404-1440.png | apres/page-inexistante-404-1440.png |
| **P1 — Sticky CTA mobile** : « Créer mon site » en double + sous-texte tronqué « — sa… ». Label = « Site pro en 7 jours », sous-texte « 97,4 €/mois · sans engagement », zéro ellipsis à 375px (vérifié). | `2a73962` | avant/home-375.png (bas de viewport) | apres/home-375.png |
| **P1 — Filtres /realisations** : état actif `bg-bleu-nuit` (#000) invisible sur fond noir. Actif = pill lavande `bg-bleu`. | `f7ab1c6` | avant/realisations-1440.png | apres/realisations-1440.png |
| **P1 — Badge « Réalisation »** masquait le logo des mini-sites mockés. Déplacé en bas-gauche du frame. | `f7ab1c6` | avant/realisations-1440.png | apres/realisations-1440.png |
| **P2 — Étape 5 orpheline** (méthode, 768px) : pleine largeur à ce breakpoint. | `eec9443` | avant/methode-9site4-768.png | apres/methode-9site4-768.png |

## Lighthouse

Mesuré contre le **serveur de dev Astro** (non minifié — non représentatif de la prod Cloudflare).
Avant : perf 59 · a11y 94 · best-practices 96 · SEO 100 · CLS 0.
Après : perf 58 · a11y 94 · best-practices 96 · SEO 100 (variance de mesure, aucune régression).
À re-mesurer en prod après déploiement pour une base honnête.

## Points BLOQUÉS — données Vic requises

1. **Liens Stripe** : `src/data/siteConfig.json` lignes 24-25 (`pricing.stripeMonthlyUrl` / `stripeYearlyUrl`).
   Garde-fou déjà codé (`tarifs.astro:16`) : tant que l'URL contient « REMPLACER », les CTA pointent
   vers `/contact` — pas de lien mort en prod. Remplacer les 2 URLs suffit, bascule automatique.
2. **Numéro WhatsApp** : `src/data/siteConfig.json` ligne 8 (`contact.whatsapp`, format `262692XXXXXX`
   sans « + ») + `destination.whatsapp` (format `+262692XXXXXX`) dans les 6 fichiers
   `src/data/moduleMetier/*.json`. Schema.org omet déjà le numéro tant que c'est le placeholder.

## P2 restants (non corrigés, faible enjeu)

- ~250 px de noir sous le © en mobile (padding sticky bar généreux — gardé pour la safe-area).
- « Gérer mes cookies » qui wrappe seul en 375px dans le footer.
- Contraste limite des labels footer « PAGES MÉTIERS » et du bloc « Voir aussi » des pages SEO.

## Propositions DA en attente (go / no-go Vic)

1. Icône accordéons FAQ : flèche « → » pivotante → chevron bas ou « + / − ».
2. Auto-héberger les ~45 images Unsplash hotlinkées (réalisations + Approche) en WebP local.
3. Carte quiz (/trouver-le-site-adapte) : ombre/bordure pour la détacher du fond clair.
4. Sommaire sticky sur /questions-frequentes (90 questions).
5. Tableau comparatif méthode : teinter la colonne « avec 9site4 ».
6. Fallback no-JS pour `.scroll-reveal` (contenu invisible sans JavaScript).

## Pour merger (Vic)

```
git fetch origin chore/polish-visuel-20260709
git checkout main && git merge --no-ff chore/polish-visuel-20260709
```
