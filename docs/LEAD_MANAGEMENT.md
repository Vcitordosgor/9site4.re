# Gestion des leads — 9site4

Ce document décrit le parcours d'un lead entre le formulaire 9site4.re et la boîte mail interne, ainsi que le format des emails et le comportement attendu en cas d'échec partiel.

## 1. Parcours d'un lead Contact

Source : `POST /api/contact` — implémenté dans `src/pages/api/contact.ts`.

1. Le client envoie le payload JSON depuis le formulaire de contact.
2. Honeypot (`website`) rempli → réponse `200 { ok: true }` silencieuse, **aucun email envoyé**.
3. Validation des champs requis (nom, secteur, téléphone, email, besoin, préférence).
4. Si binding `SEB` absent → `500 { error: 'binding_missing' }` (le client bascule sur fallback WhatsApp).
5. Construction de l'email interne via `internalContactEmail(lead)` (`src/lib/emailTemplates.ts`).
6. Envoi via `env.SEB.send({...})` vers `siteConfig.contact.notifyEmail`. Échec → `502 { error: 'send_failed' }`.
7. **En parallèle (best-effort, `Promise.allSettled`)** :
   - Webhook Discord si une variable d'env correspond à `/discord.*webhook/i`.
   - Auto-réponse au prospect via `autoReplyContactEmail(lead)`.
8. Réponse finale `200 { ok: true }`.

## 2. Parcours d'un lead Diagnostic

Source : `POST /api/diagnostic` — `src/pages/api/diagnostic.ts`.
Flow identique au contact, avec validation supplémentaire (`entreprise`, `aSite`, `objectif`), et utilisation de `internalDiagnosticEmail` / `autoReplyDiagnosticEmail`.

## 3. Format des emails

Tous les templates HTML/Text sont définis dans `src/lib/emailTemplates.ts`. CSS inline uniquement (Gmail mobile + desktop).

### Email interne — Contact

- **Sujet** : `[Nouveau lead 9site4] Contact — {entreprise || nom}`
- **Pré-header** : `Nouvelle demande depuis le formulaire contact 9site4.`
- **Contenu** : header (badge "Nouveau lead"), date en heure 974 (`Indian/Reunion`), résumé tabulaire (Nom, Entreprise, Secteur, Besoin, Email, Téléphone, Préférence), boutons d'action `tel:` / `mailto:` / `wa.me/`, message du prospect dans un encadré, action recommandée, footer.
- **Boutons WhatsApp** : message pré-rempli `Bonjour {nom}, merci pour votre demande sur 9site4. Je reviens vers vous concernant votre projet de site internet.`

### Email interne — Diagnostic

- **Sujet** : `[Nouveau diagnostic 9site4] {entreprise || nom} — {secteur}`
- **Pré-header** : `Nouvelle demande de diagnostic gratuit depuis 9site4.`
- **Contenu** : résumé (Nom, Entreprise, Secteur, A déjà un site Oui/Non, Objectif, Email, Téléphone, Préférence), section "Présence actuelle" affichée uniquement si `url`, `reseaux` ou `message` est renseigné (liens cliquables), boutons contact rapide, action recommandée orientée diagnostic.

### Auto-réponses prospect

Design simplifié (header + paragraphes + footer). Versions HTML + texte.

- Contact : sujet `Votre demande a bien été reçue — 9site4`.
- Diagnostic : sujet `Votre demande de diagnostic gratuit a bien été reçue — 9site4`.

## 4. Sujets

| Email | Sujet |
| --- | --- |
| Interne Contact | `[Nouveau lead 9site4] Contact — {entreprise || nom}` |
| Interne Diagnostic | `[Nouveau diagnostic 9site4] {entreprise || nom} — {secteur}` |
| Auto-reply Contact | `Votre demande a bien été reçue — 9site4` |
| Auto-reply Diagnostic | `Votre demande de diagnostic gratuit a bien été reçue — 9site4` |

## 5. Comportement `replyTo`

| Email envoyé | `from` | `to` | `replyTo` |
| --- | --- | --- | --- |
| Notification interne | `9site4 <contact@9site4.re>` | `siteConfig.contact.notifyEmail` (9site4@gmail.com) | email du prospect — un simple "Répondre" depuis Gmail répond au prospect |
| Auto-réponse | `9site4 <contact@9site4.re>` | email du prospect | `contact@9site4.re` — toute réponse du prospect arrive sur la boîte équipe |

## 6. Variables d'environnement

- `SEB` (binding Cloudflare Send Email Worker) — **obligatoire**. Absent → `500 binding_missing`.
- Discord webhook — **optionnel**. Détecté automatiquement via regex `/discord.*webhook/i` sur les clés `env`.

## 7. Comportement si SEB absent

L'endpoint retourne immédiatement `500 { error: 'binding_missing' }`. Le code client doit alors présenter le fallback WhatsApp (déjà en place côté formulaire).

## 8. Comportement si Discord absent

Le webhook n'est tout simplement pas appelé (`Promise.resolve()`), aucun impact sur le retour `200 OK`.

## 9. Comportement si l'auto-réponse échoue

L'auto-réponse est lancée via `Promise.allSettled` en parallèle du webhook Discord, après le succès de l'email interne. Un échec est seulement loggé (`console.error`) sans modifier le code de réponse — le prospect ne reçoit pas d'accusé, mais l'équipe reçoit bien sa notification.

Si l'email prospect est invalide à la validation (format), l'endpoint renvoie `400 validation` et aucun email (ni interne ni auto-reply) n'est envoyé.

## 10. Tester en production

1. **Contact fictif** : remplir le formulaire `/contact` avec un email réel pour vérifier que :
   - L'email interne arrive sur `9site4@gmail.com` avec sujet `[Nouveau lead 9site4] Contact — …`
   - En 10 secondes sur Gmail mobile : qui (nom), quelle entreprise, son besoin, comment le contacter (3 boutons), action à faire.
   - "Répondre" sur Gmail pointe bien vers l'email du prospect (replyTo).
   - L'adresse prospect reçoit l'auto-réponse `Votre demande a bien été reçue — 9site4`.
2. **Diagnostic fictif** : idem sur `/diagnostic`, avec et sans URL renseignée, pour vérifier la section "Présence actuelle".
3. **Honeypot** : remplir manuellement le champ `website` caché → réponse 200 mais aucun email reçu.
4. **Discord** (si configuré) : un embed apparaît sur le canal.

## 11. Qualification commerciale automatique (INTERNE)

Depuis cette itération, chaque email **interne** (envoyé à `9site4@gmail.com`) est enrichi d'une **lecture commerciale** produite par `src/lib/leadScoring.ts`. Objectif : qu'à l'ouverture de Gmail, le commercial sache en 5 secondes si rappeler tout de suite, quel besoin probable, quelle offre proposer, quelles questions poser.

**Confidentialité — règles strictes** :
- La qualification apparaît **uniquement** dans l'email interne.
- **Jamais** envoyée au prospect (l'auto-reply reste neutre).
- **Jamais** envoyée dans GA4, Meta Pixel, Discord, ni dans aucun log côté client.
- Si le scoring échoue, un fallback générique est utilisé — l'envoi de l'email interne n'est **jamais** bloqué.

### Règles de scoring — Contact

Variables-clés : `hasPhone`, `hasCompany`, `isCalledFor` (préférence téléphone/whatsapp), `clearNeed` (besoin renseigné et non vague), `messageHasProject` (mots-clés "site", "création", "refonte", "réservation", "devis", "présentation", "projet"…).

**Priorité** :
- `Haute` : besoin clair + téléphone + entreprise + (préférence téléphone OU mention projet dans message).
- `Moyenne` : téléphone + message présent, ou besoin clair + entreprise.
- `À qualifier` : tout le reste.

**Température** :
- `Chaud` : besoin clair + téléphone + entreprise + mention projet dans message.
- `Tiède` : téléphone ou entreprise + message présent (non vague).
- `Exploratoire` : message vague ("je ne sais pas", "renseignements") ou ni téléphone ni entreprise.

### Règles de scoring — Diagnostic

Variables-clés : `hasSite`, `hasUrl`, `hasNetworks`, `hasPhone`, `clearGoal` (un des 5 objectifs business définis), `vagueGoal` ("Je ne sais pas encore").

**Priorité** :
- `Haute` : site existant + URL + objectif "Améliorer mon site actuel" ou "Recevoir plus de demandes" + téléphone.
- `Moyenne` : pas de site + objectif clair + téléphone, OU site + URL + objectif non vague.
- `À qualifier` : peu d'infos, objectif vague, pas de téléphone.

**Température** :
- `Chaud` : objectif clair + téléphone + (site OU réseaux) + objectif non vague.
- `Tiède` : diagnostic demandé mais besoin imprécis ou pas de téléphone.
- `Exploratoire` : objectif vague, ou ni site ni réseaux ni téléphone.

### Signification opérationnelle

| Priorité | Action commerciale |
|---|---|
| Haute | Rappeler **dans la journée** (canal indiqué) |
| Moyenne | Rappel ou email **sous 24-48h** |
| À qualifier | **Email court** avec 2-3 questions avant proposition |

| Température | Sens |
|---|---|
| Chaud | Projet identifié, intention d'achat élevée |
| Tiède | Intéressé mais flou — qualification à faire |
| Exploratoire | Cherche surtout à comprendre — nourrir |

### Exemples concrets

**Exemple 1 — Contact `Haute` / `Chaud`** :
> Marie (Snack Cocotier), tél +262692…, besoin "Création de site", message "Je veux un site pour mon restaurant avec réservation et présentation du menu". Préférence : téléphone.
>
> → **Haute / Chaud**. Action : rappeler dans la journée par téléphone. Offre : Formule 9site4 — 97,4€/mois. Questions sur domaine, logo, prestations à mettre en avant.

**Exemple 2 — Diagnostic `Haute` / `Chaud`** :
> Léa (Coiffure Léa), site existant `https://coiffure-lea.re`, objectif "Recevoir plus de demandes", téléphone fourni, préférence WhatsApp.
>
> → **Haute / Chaud**. Action : rappeler sous 24h par WhatsApp avec 3 priorités sur le site existant. Offre : refonte + gestion continue.

**Exemple 3 — Contact `À qualifier` / `Exploratoire`** :
> Paul, pas d'entreprise, pas de téléphone, besoin "autre", message "je ne sais pas, juste des infos".
>
> → **À qualifier / Exploratoire**. Action : email court pour comprendre le besoin. Offre : diagnostic gratuit.

### Source du lead

Le champ `source` (mappé via `mapSource()` depuis `window.location.pathname` envoyé par le formulaire) ajoute une ligne discrète dans l'email interne : "Source du lead : Page contact / Page diagnostic / Page SEO restaurant / …". Si la page n'est pas reconnue, la ligne est omise.

### Limites

- Le scoring est **indicatif** : il s'appuie sur des heuristiques simples (présence de champs, mots-clés). Il ne remplace pas la qualification humaine au téléphone.
- Toujours vérifier les signaux avant de positionner une offre.
- En cas de doute (signaux contradictoires), traiter comme `À qualifier`.

### Fichiers source

- Logique pure : `src/lib/leadScoring.ts` (`qualifyLead`, `mapSource`, `defaultQualification`).
- Rendu HTML/text : bloc "Lecture commerciale 9site4" dans `src/lib/emailTemplates.ts`.
- Intégration : `src/pages/api/contact.ts` et `src/pages/api/diagnostic.ts` (try/catch + fallback).

## 12. Politique 0 PII analytics

Le tracking client (`src/lib/tracking.ts`) ne reçoit **jamais** de données nominatives ni de coordonnées. Seuls des events de conversion abstraits sont envoyés. Aucun changement n'a été apporté à cette stratégie dans le cadre de ce refactor email. Le scoring de qualification reste **strictement côté serveur** et ne fuite pas dans le tracking.
