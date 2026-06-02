# Centre d'aide / FAQ 9site4

Source unique : `src/data/faq.ts`.
Page dédiée : `/questions-frequentes/` (`src/pages/questions-frequentes.astro`).
Composant : `src/components/sections/FAQAccordion.astro`.

## Catégories (12)

Ordre défini dans `faqCategories` :

| ID | Label | Nombre de questions |
| --- | --- | --- |
| offre | Offre 9site4 | 5 |
| prix | Prix et engagement | 7 |
| creation | Création du site | 5 |
| gestion | Gestion continue | 4 |
| domaine | Domaine, hébergement et sécurité | 4 |
| modifications | Modifications | 4 |
| realisations | Réalisations | 3 |
| seo | Visibilité et SEO | 5 |
| formulaires | Formulaires et modules métier | 3 |
| diagnostic | Diagnostic gratuit | 4 |
| technique | Technique et accompagnement | 4 |
| demarrage | Démarrage | 1 |
| **Total** | | **49** |

## Règles de ton

- Professionnel, sobre, concret, rassurant.
- Pas de blog, pas de jargon technique.
- **Pas de promesse abusive** — notamment jamais « première place Google ».
- Pas de chiffres ni d'avis inventés.
- Référencer le marché local (974, La Réunion) quand c'est pertinent.
- Phrases courtes à moyennes ; un seul paragraphe par réponse en général.

## Pages réutilisant des FAQ (snippets)

Chaque page snippet utilise `FAQAccordion` avec un sous-ensemble filtré via
`getFaqForPage(page)` ou le champ `showOnPages` des items.

| Page | Clé `showOnPages` | Nb. questions |
| --- | --- | --- |
| `/tarifs` | `tarifs` | 6 |
| `/diagnostic-site-internet-la-reunion` | `diagnostic` | 4 |
| `/creation-site-internet-la-reunion` | `creation` | 6 |
| `/contact` | `contact` | 3 |

Chaque snippet renvoie vers `/questions-frequentes/` via un lien
« Voir toutes les questions fréquentes → ».

## JSON-LD FAQPage

Le schéma `FAQPage` est généré **uniquement** sur `/questions-frequentes/`,
avec l'intégralité des 49 questions visibles sur la page.

Les pages snippets n'ajoutent **pas** de JSON-LD FAQPage afin d'éviter les
doublons dans Google Search Console. Les pages SEO (création, diagnostic)
conservent en revanche leurs autres schémas (`Service`).

## Ajouter une question

1. Ouvrir `src/data/faq.ts`.
2. Ajouter un objet dans `faqItems` :
   - `id` unique (kebab-case),
   - `category` correspondant à un id de `faqCategories`,
   - `question` (texte simple),
   - `answer` (un seul paragraphe, ton pro),
   - optionnel : `relatedLinks` (label + href interne),
   - optionnel : `showOnPages` (pour faire apparaître l'item sur un snippet).
3. La page `/questions-frequentes/` et le JSON-LD se mettent à jour
   automatiquement. Si `showOnPages` est rempli, la page snippet aussi.

## Maillage interne vers `/questions-frequentes/`

- Footer (`src/components/layout/Footer.astro`) — lien dans la navigation.
- `/tarifs` — lien sous le snippet FAQ.
- `/contact` — lien sous le snippet FAQ.
- `/diagnostic-site-internet-la-reunion` — lien sous le snippet FAQ.
- `/creation-site-internet-la-reunion` — lien sous le snippet FAQ.

La page **n'est pas** ajoutée à la navigation principale (header).

## Limites

- Pas de promesse de classement Google (la question dédiée explique pourquoi).
- Pas de chiffres clients inventés (volumes de demandes, taux de conversion…).
- Les FAQ snippets ne dupliquent pas le schéma FAQPage.
- Les réponses restent dans la limite du périmètre de l'offre (site vitrine
  professionnel + gestion continue). Les besoins hors périmètre (e-commerce,
  applications sur-mesure) sont mentionnés honnêtement quand utile.
