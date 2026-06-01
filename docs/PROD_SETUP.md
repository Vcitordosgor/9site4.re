# 9site4 — Setup production

Guide opérationnel pour mettre le site en production sur **Cloudflare Pages**.
À suivre dans l'ordre. Conçu pour quelqu'un qui sait utiliser Cloudflare mais ne code pas.

---

## Vue d'ensemble — 4 choses à configurer

| # | Quoi | Où | Bloquant ? |
| --- | --- | --- | --- |
| 1 | **Binding `SEB`** (envoi email) | Cloudflare Pages → Settings → Functions → Bindings | ✅ Oui — sans ça, les formulaires renvoient une erreur (mais fallback WhatsApp dispo) |
| 2 | **Sender `contact@9site4.re`** vérifié | Service email (Cloudflare Email Routing ou autre) | ✅ Oui — sans ça, les emails partent en spam ou échouent |
| 3 | **Mentions légales** | `src/data/siteConfig.json` (`legal.editor`, `legal.publisher`) | ⚠️ Recommandé avant trafic large (obligation légale) |
| 4 | **GA4 + Meta Pixel** | Cloudflare Pages → Settings → Environment Variables | ⏸️ Optionnel (le site fonctionne sans) |

---

## 1. Binding `SEB` — envoi email

### Rôle
Le binding `SEB` permet à l'endpoint `/api/contact` et `/api/diagnostic` d'envoyer un email à l'équipe 9site4 (`9site4@gmail.com` par défaut) quand un prospect soumet un formulaire.

**Sans `SEB`** : les soumissions de formulaire renvoient une erreur `binding_missing` côté client. Le prospect voit le message d'erreur **avec un fallback WhatsApp** automatique → la conversion n'est pas perdue, mais le flow email est cassé.

### Configuration Cloudflare Pages

1. **Cloudflare Dashboard** → ton projet Pages `9site4-re`
2. **Settings** → **Functions** → **Bindings**
3. Ajouter un binding de type **Send Email** :
   - **Variable name** : `SEB` (exactement, sensible à la casse)
   - **Destination email** : `contact@9site4.re` (ou autre email vérifié dans Email Routing)
4. **Save and Deploy**

### Nom du binding
Le code recherche **`env.SEB`** dans `src/pages/api/contact.ts` et `src/pages/api/diagnostic.ts`. Si tu nommes différemment, le binding ne sera pas trouvé.

### Tester
Après config + redéploiement :
- Aller sur `/contact` ou `/diagnostic-site-internet-la-reunion`
- Remplir avec des données fictives (pas un vrai prospect)
- Cliquer "Envoyer"
- ✅ Vérifier que l'email arrive sur `9site4@gmail.com`
- ❌ Si erreur `binding_missing` : le binding n'est pas reconnu → revérifier le nom exact

### Comportement de fallback
Le client React/Preact réagit aux erreurs serveur en affichant :
> « Une erreur est survenue. Vous pouvez aussi nous joindre directement par WhatsApp [lien]. »

---

## 2. Sender email `contact@9site4.re`

### Configuration

L'email envoyé a comme expéditeur :
```
9site4 Contact <contact@9site4.re>
```
ou
```
9site4 Diagnostic <contact@9site4.re>
```

### Points à vérifier côté service email
- ✅ L'adresse `contact@9site4.re` doit être **validée comme sender** dans Cloudflare Email Routing (ou ton autre service)
- ✅ Configurer **SPF** sur le domaine `9site4.re` (TXT record `v=spf1 include:_spf.mx.cloudflare.net ~all`)
- ✅ Configurer **DKIM** (Cloudflare le fait automatiquement pour Email Routing)
- ✅ Configurer **DMARC** (TXT record `v=DMARC1; p=none; rua=mailto:9site4@gmail.com`)

### Risque si sender non vérifié
- Emails marqués **spam** par Gmail / Outlook
- Erreur 5XX côté binding SEB → message d'erreur au prospect
- Réputation domaine dégradée à long terme

### Test de livraison à faire avant trafic réel
1. Envoyer 1 formulaire de contact + 1 formulaire diagnostic via le site déployé
2. Vérifier la **boîte de réception** Gmail (pas spam !)
3. Vérifier que l'expéditeur affiché est `9site4 Contact <contact@9site4.re>`
4. Vérifier que `Reply-To` = email du prospect (pour que tu puisses répondre directement)

### Adresse destinataire
La destination est configurée dans `src/data/siteConfig.json` :
```json
"contact": {
  "email": "contact@9site4.re",
  "notifyEmail": "9site4@gmail.com"
}
```
Si tu changes `notifyEmail`, redéployer pour effet immédiat.

---

## 3. Webhook Discord (optionnel)

### Rôle
Notification temps réel sur Discord pour chaque soumission de formulaire (utile pour réactivité < 24h).

### Configuration
1. Créer un webhook Discord dans le serveur cible (Settings → Integrations → Webhooks → New Webhook)
2. Copier l'URL du webhook
3. Cloudflare Pages → Settings → Environment Variables
4. Ajouter une variable d'environnement avec :
   - **Name** : peu importe, tant qu'elle contient `discord` ET `webhook` (ex: `DISCORD_WEBHOOK_URL` ou `DISCORD_WEBHOOK`)
   - **Value** : l'URL complète du webhook Discord
   - **Environment** : Production

### Comportement
- **Si configuré** : notification Discord envoyée en parallèle de l'email (best-effort, via `Promise.allSettled`)
- **Si absent** : skippé silencieusement, **n'empêche jamais la réception email**
- **Si webhook invalide** : log côté serveur, n'empêche pas l'email

### Test
1. Ajouter le webhook
2. Redéployer
3. Soumettre 1 formulaire test
4. Vérifier réception Discord ET email

---

## 4. Variables d'environnement — récap

À ajouter dans **Cloudflare Pages → Settings → Environment Variables → Production** :

| Variable | Type | Rôle | Si absente |
| --- | --- | --- | --- |
| `PUBLIC_ENABLE_ANALYTICS` | `Plaintext` | Master switch tracking. Doit valoir `true`. | Tracking désactivé (no-op) |
| `PUBLIC_GA_MEASUREMENT_ID` | `Plaintext` | ID GA4 (`G-XXXXXXXXXX`) | GA4 non chargé |
| `PUBLIC_META_PIXEL_ID` | `Plaintext` | ID Meta Pixel (numérique) | Pixel non chargé |
| `DISCORD_WEBHOOK_URL` | `Secret` | URL webhook Discord | Notification skippée |

**À ajouter dans Bindings** :

| Binding | Type | Nom exact | Rôle |
| --- | --- | --- | --- |
| `SEB` | Send Email | `SEB` (cf. ci-dessus) | Envoi email serveur |

### ⚠️ Ne jamais committer ces valeurs dans `.env`
Le fichier `.env.example` à la racine documente la structure attendue. **Aucune vraie valeur n'est jamais dans le repo**.

---

## 5. Mentions légales — TODO humain

Le fichier `src/data/siteConfig.json` contient :
```json
"legal": {
  "_todo": "À COMPLÉTER PAR L'HUMAIN avant lancement…",
  "editor": "[À compléter]",
  "host": "OVH",
  "publisher": "[À compléter]"
}
```

**Avant ouverture au trafic large**, compléter :
- `editor` : raison sociale exacte de l'entité juridique (ex: `Vincent Lagané EI`, `9site4 SAS`, etc.)
- `publisher` : nom du directeur de la publication
- `host` : hébergeur exact (actuellement `OVH`, à valider — Cloudflare Pages est un proxy/CDN ; l'origin reste OVH ou Cloudflare Workers selon le déploiement effectif)

La page `/mentions-legales` lit automatiquement ces valeurs. Elle affiche aussi `[À compléter — adresse complète à La Réunion]` qui doit être remplacé.

**Ne pas inventer** de SIRET, adresse, statut juridique. Demander les vraies informations à l'éditeur.

---

## 6. Activation GA4 (optionnel mais recommandé)

### Étapes

1. **Créer une propriété GA4**
   - [analytics.google.com](https://analytics.google.com) → **Admin** → **+ Créer une propriété**
   - Nom : `9site4.re`
   - Fuseau horaire : `Indian/Reunion (GMT+4)` ou `Europe/Paris`
   - Devise : `EUR`
   - Industrie : `Computers & Electronics > Other`
   - Taille : `Small`

2. **Créer un flux web**
   - Plateforme : Web
   - URL : `https://9site4.re`
   - Nom du flux : `9site4 Production`
   - Activer "Enhanced measurement" (par défaut OK)

3. **Récupérer le Measurement ID**
   - Format : `G-XXXXXXXXXX`
   - Le copier

4. **Configurer dans Cloudflare Pages**
   - Settings → Environment Variables
   - Ajouter `PUBLIC_GA_MEASUREMENT_ID` = `G-XXXXXXXXXX`
   - Ajouter `PUBLIC_ENABLE_ANALYTICS` = `true`
   - Redéployer

5. **Tester avec DebugView**
   - GA4 → **Admin** → **DebugView**
   - Sur le site en prod, ouvrir la console Chrome
   - Naviguer + cliquer sur quelques CTA + soumettre un formulaire fictif
   - Vérifier que les events apparaissent dans DebugView avec les bonnes valeurs `source`, `label`, `sector`

### Liste des 13 events trackés

| Event | Catégorie | Déclencheur |
| --- | --- | --- |
| `cta_create_site_click` | conversion | "Créer mon site" (Hero, CTABand, MobileStickyCTA, pages SEO) |
| `cta_view_realisations_click` | navigation | "Voir nos réalisations" |
| `cta_view_realisation_click` | navigation | Card grille `/realisations` (avec `label=slug`) |
| `cta_create_in_this_style_click` | conversion | "Créer un site dans cet esprit" |
| `cta_view_template_preview_click` | navigation | "Voir l'aperçu complet" |
| `cta_pricing_click` | navigation | "Voir les détails" / page tarifs |
| `cta_contact_click` | conversion | Header CTA / MobileMenu CTA / Diagnostic CTA final |
| `whatsapp_click` | conversion | Auto sur `wa.me/*` |
| `email_click` | conversion | Auto sur `mailto:` |
| `phone_click` | conversion | Auto sur `tel:` |
| `contact_form_submit` | conversion | Soumission ContactForm (avec `label=channel`, `sector`) |
| `diagnostic_cta_click` | conversion | CTA vers `/diagnostic-site-internet-la-reunion` (6 emplacements distincts) |
| `diagnostic_form_submit` | conversion | Soumission DiagnosticForm |

**Confidentialité** : aucun event n'envoie de PII (nom, email, tel, message, URL saisie). Seulement `category`, `label`, `sector`, `source`, `page_type`, `target`. `anonymize_ip: true` sur GA4.

---

## 7. Sécurité — confirmé

- ✅ Aucune clé secrète, aucun webhook, aucun ID analytics commité dans le repo
- ✅ `.env.example` documente uniquement les noms de variables
- ✅ Endpoints API : validation serveur stricte (regex tél/email, champs obligatoires)
- ✅ Honeypot (champ caché `website`) + time-trap 1500ms sur les 2 formulaires
- ✅ Erreurs serveur : pas de fuite de secret dans la réponse JSON (juste un code d'erreur)
- ✅ Discord webhook : best-effort via `Promise.allSettled`, échec = log only
- ✅ SEB binding manquant : retour 500 explicite + fallback WhatsApp côté client

---

## 8. Que faire si les emails n'arrivent pas

| Symptôme | Cause probable | Action |
| --- | --- | --- |
| Réponse `binding_missing` | Binding `SEB` non configuré ou mal nommé | Vérifier nom exact `SEB` dans Cloudflare Pages → Functions → Bindings |
| Réponse `send_failed` avec détail | Sender non vérifié, SPF/DKIM cassé, quota Cloudflare atteint | Vérifier Email Routing → Senders / quota mensuel |
| Email arrive en spam | SPF/DKIM/DMARC manquants ou mal configurés | Configurer les 3 records DNS sur `9site4.re` |
| Aucun email, aucune erreur | Email envoyé vers une adresse inactive | Vérifier `notifyEmail` dans `siteConfig.json` |
| Discord notification absente | Webhook non configuré ou URL invalide | Vérifier env var contient `discord` + `webhook` dans le nom |

---

## 9. Architecture déployée — récap final

```
Cloudflare Pages (static build Astro)
├── Static HTML : 67+ pages (sitemap 58 URLs)
├── /api/contact   (POST → SEB binding → email)
├── /api/diagnostic (POST → SEB binding → email)
├── _redirects     (301 anciens slugs)
└── _worker.js     (Astro adapter Cloudflare)

Bindings / Env vars (Cloudflare Pages Settings)
├── SEB                       (Send Email binding)
├── DISCORD_WEBHOOK_URL       (secret, optionnel)
├── PUBLIC_ENABLE_ANALYTICS   (`true` pour activer)
├── PUBLIC_GA_MEASUREMENT_ID  (G-XXXXXXXXXX)
└── PUBLIC_META_PIXEL_ID      (optionnel)

Email Routing (Cloudflare)
└── Sender vérifié : contact@9site4.re
└── DNS : SPF + DKIM + DMARC sur 9site4.re
```

Voir aussi :
- `docs/SEO_POST_DEPLOY_CHECKLIST.md` — procédure Search Console + indexation
- `docs/PROD_LAUNCH_CHECKLIST.md` — checklist exhaustive avant/après déploiement
- `docs/tracking.md` — référence technique du système de tracking
- `.env.example` — variables d'environnement
