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

## 11. Politique 0 PII analytics

Le tracking client (`src/lib/tracking.ts`) ne reçoit **jamais** de données nominatives ni de coordonnées. Seuls des events de conversion abstraits sont envoyés. Aucun changement n'a été apporté à cette stratégie dans le cadre de ce refactor email.
