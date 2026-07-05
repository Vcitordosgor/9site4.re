# DERIVATIONS.md — choix juridiques (conformité LCEN + RGPD + CNIL)

Mise en conformité légale de 9site4.re — révision du 2026-07-02.
Ce document trace les décisions non triviales et les points restant à la charge de l'éditeur.

## Décisions appliquées

### Mentions légales (LCEN art. 6-III)
- **Éditeur** : Victor Lagane, entrepreneur individuel (EI), SIRET 987 641 917 00016. Données fournies par l'éditeur.
- **Adresse** : « Saint-Denis, La Réunion (974) » sur instruction de l'éditeur.
  ⚠️ Une **adresse postale complète** (numéro + rue + code postal) est légalement exigée pour l'éditeur d'un site édité par un EI. La ville seule ne suffit pas au sens strict de la LCEN — voir « À ta charge ».
- **Directeur de la publication** : Victor Lagane (représentant légal de l'EI). Standard.
- **Hébergeur** : Cloudflare Pages (Cloudflare, Inc.). Cohérent avec le déploiement réel.
- **TVA** : mention « TVA non applicable, article 293 B du CGI » ajoutée — l'éditeur a confirmé ne pas être assujetti (franchise en base). Aucun numéro de TVA intracommunautaire à afficher.

### Politique de confidentialité
- **Sous-traitants déclarés** (auparavant vagues « Cloudflare + fournisseur d'e-mail ») : la liste réelle a été établie d'après le code (`src/pages/api/contact.ts`, `src/lib/notionLead.ts`) :
  - **Cloudflare, Inc.** — hébergement + acheminement e-mail (Email Routing).
  - **Google (Gmail)** — réception des notifications de lead sur `9site4@gmail.com` (`siteConfig.contact.notifyEmail`).
  - **Notion Labs, Inc.** — enregistrement du lead dans la base CRM « Deals » (actif si `NOTION_TOKEN` défini côté Cloudflare — confirmé actif par l'éditeur).
- **Transferts hors UE** : section ajoutée. Google, Notion et une partie de Cloudflare sont aux États-Unis → mention des **clauses contractuelles types** (CCT/SCC) et du **Data Privacy Framework UE–US**. C'est la base de conformité standard ; la signature effective d'accords de sous-traitance (DPA) reste à vérifier (voir « À ta charge »).
- **Discord** : le code peut poster un webhook Discord **uniquement si** une variable d'env webhook est configurée. L'éditeur n'a pas confirmé son usage → **non déclaré** pour l'instant. Si tu actives Discord, il devra être ajouté à la liste des sous-traitants (également hors UE).

### Cookies & consentement (doctrine CNIL) — Option B retenue
L'éditeur prévoit d'installer un **pixel Meta (Facebook)**. Conséquences appliquées :
- La section Cookies distingue désormais **traceurs strictement nécessaires** (stockage fonctionnel, sans bannière) et **traceurs soumis à consentement** (pixel Meta).
- Suppression de l'affirmation **fausse** « aucune donnée personnelle » à propos de GA4/Pixel : au sens CNIL, ces traceurs traitent bien des données personnelles (identifiants, IP).
- **Bannière de consentement auto-hébergée** (`src/components/CookieConsent.astro`) : pas de SaaS.
  - Deux boutons de **poids égal** : « Accepter » / « Refuser » (refus aussi simple que l'acceptation — exigence CNIL).
  - **Aucun traceur avant consentement** : `Analytics.astro` ne charge plus le pixel/GA au load ; il expose `window.__loadTrackers()` que la bannière n'appelle **qu'après un « Accepter »**.
  - Choix **mémorisé** dans `localStorage` (`cookie-consent` = `granted`/`denied`).
  - Lien **« Gérer mes cookies »** ajouté au footer (rouvre la bannière pour changer d'avis).
- **Comportement actuel (aucun traceur configuré)** : `PUBLIC_ENABLE_ANALYTICS` n'est pas à `true` → la bannière **ne s'affiche pas** et aucun traceur n'est chargé. Elle s'activera automatiquement le jour où tu renseignes `PUBLIC_ENABLE_ANALYTICS=true` + `PUBLIC_META_PIXEL_ID` côté Cloudflare.

### Divers
- **Date de dernière mise à jour** : figée dans `siteConfig.legal.lastUpdated` (2026-07-02) au lieu de `new Date()` qui affichait « aujourd'hui » à chaque build (trompeur).
- **Mentions sous formulaires** : renforcées avec la **finalité explicite** (« servent uniquement à traiter votre demande ») + durée + lien politique, sur les 3 formulaires (Contact, Diagnostic, SiteRecommender).

## ⚠️ À ta charge (arbitrages / vérifications humaines)

1. **Adresse postale complète** — remplacer « Saint-Denis, La Réunion (974) » par l'adresse exacte (n° + rue + CP) dans `siteConfig.legal.address`. Légalement requis pour un éditeur EI. Si tu ne veux pas publier ton domicile, une solution est une adresse de domiciliation commerciale.
2. **Activation du pixel Meta** — quand prêt : côté Cloudflare Pages, `PUBLIC_ENABLE_ANALYTICS=true` + `PUBLIC_META_PIXEL_ID=<ton_id>`. La bannière + le blocage-avant-consentement s'activent alors automatiquement. **Tester** : la 1ʳᵉ visite doit montrer la bannière, « Refuser » ne doit charger AUCUN script `connect.facebook.net`.
3. **DPA / accords de sous-traitance** — vérifier/signer les accords de traitement des données avec Notion, Google Workspace et Cloudflare (proposés en ligne par ces éditeurs). La mention CCT/DPF dans la politique suppose que ces accords existent.
4. **Discord** — si tu utilises le webhook Discord pour les notifications, me le dire pour l'ajouter à la liste des sous-traitants (hors UE).
5. **Numéro WhatsApp** + **liens Stripe** — placeholders inchangés (hors périmètre de cette mission conformité).
