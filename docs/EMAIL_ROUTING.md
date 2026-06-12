# 9site4 — Email Routing & DNS (5 étapes copy-paste)

Objectif : faire fonctionner `/api/contact`, `/api/diagnostic` et `/api/site-recommendation` en production.

Sans cette config, les endpoints renvoient `500 binding_missing` et aucun lead n'arrive.

---

## Étape 1 — Activer Email Routing sur `9site4.re`

1. Cloudflare dashboard → **Email** → **Email Routing** → sélectionner le domaine `9site4.re`
2. Cliquer **Enable Email Routing**
3. Cloudflare propose d'ajouter automatiquement 3 records MX. **Accepter**.

Records MX qui apparaissent (auto) :
```
9site4.re  MX  10  route1.mx.cloudflare.net
9site4.re  MX  20  route2.mx.cloudflare.net
9site4.re  MX  30  route3.mx.cloudflare.net
```

---

## Étape 2 — Créer une adresse de destination

1. **Email Routing** → **Destination addresses** → **Add destination address**
2. Saisir : `9site4@gmail.com`
3. Cliquer le lien de vérification reçu sur Gmail.

---

## Étape 3 — Créer un sender vérifié `contact@9site4.re`

Le code envoie depuis `contact@9site4.re` (cf. `src/pages/api/contact.ts`, `src/pages/api/diagnostic.ts`).

1. **Email Routing** → **Routes** → **Create address**
2. Custom address : `contact@9site4.re`
3. Action : **Send to an email** → `9site4@gmail.com`
4. **Save**

Cette route sert deux choses : router les emails entrants `contact@9site4.re` vers Gmail, ET permettre au Worker SEB d'utiliser ce sender pour les envois sortants (notifications de leads).

---

## Étape 4 — Ajouter SPF / DKIM / DMARC

Sans ces records, Gmail / Outlook mettront les notifs de leads en spam.

Dans **DNS** du domaine `9site4.re`, ajouter 3 records TXT :

### SPF
```
Type   : TXT
Name   : @
Content: v=spf1 include:_spf.mx.cloudflare.net ~all
TTL    : Auto
```

### DKIM
Cloudflare Email Routing gère DKIM automatiquement dès que MX est configuré. **Rien à faire manuellement.**

Pour vérifier : Email Routing → Settings → DKIM doit indiquer "Active".

### DMARC
```
Type   : TXT
Name   : _dmarc
Content: v=DMARC1; p=none; rua=mailto:9site4@gmail.com
TTL    : Auto
```

---

## Étape 5 — Lier le binding SEB à Cloudflare Pages

Le binding est déjà déclaré dans `wrangler.jsonc` :
```jsonc
"send_email": [
  { "name": "SEB", "destination_address": "9site4@gmail.com" }
]
```

Côté **Cloudflare Pages** → projet `9site4` → **Settings** → **Functions** → **Bindings** → **Add binding** :
- Type : **Send Email**
- Variable name : `SEB`
- Destination address : `9site4@gmail.com`

Faire ça pour **Production** ET **Preview**.

---

## Vérification finale

Une fois les 5 étapes faites, déclencher un test end-to-end :

1. Aller sur `https://9site4.re/contact`
2. Soumettre le formulaire avec un vrai email canal "Email"
3. Vérifier dans Gmail (`9site4@gmail.com`) :
   - L'email arrive (pas en spam)
   - Le sender affiché est `9site4 Contact <contact@9site4.re>`
   - Le bloc "Lecture commerciale 9site4" (lead scoring) est présent
   - Le bouton "Répondre" répond au prospect (pas à Gmail)

Si l'email arrive en spam : vérifier que les 3 records DNS sont propagés (`dig TXT 9site4.re`, `dig TXT _dmarc.9site4.re`).

---

## Variables d'environnement Pages (optionnelles)

À configurer dans **Pages → Settings → Environment variables** (Production) :

| Variable | Valeur | Usage |
|---|---|---|
| `PUBLIC_ENABLE_ANALYTICS` | `true` | Active GA4 + Pixel |
| `PUBLIC_GA_MEASUREMENT_ID` | `G-XXXXXXXXXX` | ID GA4 |
| `PUBLIC_META_PIXEL_ID` | `XXXXXXXXX` | (optionnel) |
| `DISCORD_WEBHOOK_URL` | `https://discord.com/api/webhooks/...` | (optionnel) notifs lead en + de l'email |

---

## En cas d'erreur 500 `binding_missing`

Cause : le binding SEB n'est pas lié au déploiement actuel. Solution : refaire l'étape 5, puis redéployer (un nouveau commit ou bouton "Retry deployment" dans Pages).
