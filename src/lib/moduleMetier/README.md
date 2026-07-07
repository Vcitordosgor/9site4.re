# Module Métier Intégré

Moteur générique de formulaire piloté par configuration JSON.
**Un métier = un fichier JSON. Zéro code spécifique par métier.**

## Pièces

| Fichier | Rôle |
| --- | --- |
| `types.ts` | Schéma de la config (`ModuleMetierConfig`, `Field`, …). |
| `formatMessage.ts` | Fonction **pure** : `(config, valeurs) → { texte, html }` + `interpolate` + `whatsappUrl`. |
| `validateConfig.ts` | Garde-fou : valide une config, messages d'erreur clairs. |
| `validatePayload.ts` | Validation du payload reçu par le Worker (isolée, testable). |
| `../../components/module-metier/ModuleMetier.tsx` | **Le moteur** : rend le formulaire depuis la config. Modes `demo` / `production`. |
| `../../components/module-metier/PhoneMockup.tsx` | Maquette WhatsApp CSS pure (présentationnel). |
| `../../components/module-metier/ModuleMetierDemo.tsx` | Orchestrateur de la démo (chips + moteur + téléphone + animation). |
| `../../pages/api/module-metier.ts` | Endpoint Worker (e-mail au pro). **Prêt mais non câblé.** |
| `../../data/moduleMetier/*.json` | Les configs métier. |

## Modes du moteur

- **`demo`** — aucun appel réseau. À la soumission validée, appelle `onDemoSubmit`
  avec le message formaté (déclenche l'animation du téléphone). Utilisé sur la
  home 9site4.fr.
- **`production`** — POST vers l'endpoint (**e-mail au pro d'abord**, filet de
  sécurité), **puis** ouverture de `wa.me/{numero}?text={message}` : le visiteur
  envoie depuis SON WhatsApp. Turnstile en production uniquement.

> WhatsApp = lien `wa.me` pré-rempli **uniquement**. Pas d'API WhatsApp Business,
> pas de compte Meta, pas de coût par message.

## Types de champs (v1)

`text` · `tel` · `email` · `select` · `chips` (choix unique) · `textarea` · `date` · `time`

## Règles produit (non négociables)

- Les disponibilités type « (6 places) » sont du **texte statique de config**.
  Aucune logique de stock, de décrément, de calendrier ou de confirmation automatique.
- Vocabulaire **verrouillé** : « demande », « demande prête à traiter »,
  « demande envoyée ». Interdit : « réservation confirmée », « créneau bloqué »,
  ou tout wording promettant une confirmation automatique.

## Ajouter un métier en ~10 min

1. Copier une config existante, ex. `data/moduleMetier/yoga.json` → `data/moduleMetier/<mon-metier>.json`.
2. Adapter :
   - `id` (unique), `label`, `tag`, `titre`, `sousTitre`, `cta`.
   - `champs[]` : choisir les types (voir liste ci-dessus). `select`/`chips`
     exigent `options[]`. `defaut` fait vivre la démo sans saisie.
   - `destination` : `whatsapp` (format international) + `email` du pro.
   - `reponsePro` : réponse simulée, `{nom}` (ou tout id de champ) est interpolé.
   - `bulleVisiteur` : 1re bulle affichée dans la maquette.
3. **Vocabulaire** : rester sur « demande » / « prête à traiter ». Les dispos
   sont du texte figé (« (6 places) »), jamais une promesse de stock.
4. Valider : `validateConfig(config)` doit renvoyer `[]` (les tests le vérifient
   automatiquement pour toutes les configs du dossier).
5. Pour l'afficher dans la démo home : ajouter l'import + l'entrée dans
   `components/sections/ModuleMetierDemo.astro` (`configs` + `pros`).

## Tests

Tests natifs Node (`node:assert`, aucune dépendance) :

```bash
npm test
```

Couvre : `formatMessage` (structure exacte, accents/émojis, champs vides,
échappement HTML), `interpolate`, `whatsappUrl` (encodage), `validateConfig`
(configs invalides + les 6 configs réelles), `validatePayload` (Worker).

## Déploiement par client (hors scope ici)

Au déploiement d'un site client : câbler l'endpoint (mapping métier→adresse
**côté serveur**, vérification Turnstile réelle, rate-limiting), passer le
moteur en `mode="production"` avec la `turnstileSiteKey`.
