# 9site4 — Checklist de lancement production

Checklist à cocher avant et après le déploiement public sur `https://9site4.re/`.

À utiliser conjointement avec :
- `docs/PROD_SETUP.md` — guide de configuration Cloudflare
- `docs/SEO_POST_DEPLOY_CHECKLIST.md` — Search Console + indexation
- `docs/tracking.md` — système de tracking

---

## A. Avant déploiement

### Code / build
- [ ] `npm install` propre, lockfile à jour
- [ ] `npm run build` : PASS sans erreur ni warning bloquant
- [ ] `npx tsc --noEmit` : 0 erreur bloquante (2 warnings Preact `nativeEvent` connus = OK)
- [ ] Git : aucun fichier non-committé sur main

### Configuration Cloudflare Pages

#### Bindings (Functions)
- [ ] Binding **`SEB`** (Send Email) configuré
- [ ] Destination email : `contact@9site4.re` (ou autre validée)

#### Environment Variables (Production)
- [ ] `PUBLIC_ENABLE_ANALYTICS` = `true` (si tracking voulu)
- [ ] `PUBLIC_GA_MEASUREMENT_ID` = `G-XXXXXXXXXX` (si GA4)
- [ ] `PUBLIC_META_PIXEL_ID` (optionnel)
- [ ] `DISCORD_WEBHOOK_URL` ou équivalent (optionnel)

### DNS / email

- [ ] Domaine `9site4.re` pointe vers Cloudflare Pages
- [ ] Email Routing actif sur `9site4.re`
- [ ] Sender `contact@9site4.re` vérifié dans Email Routing
- [ ] DNS **SPF** sur `9site4.re` : `v=spf1 include:_spf.mx.cloudflare.net ~all`
- [ ] DNS **DKIM** : record automatique Cloudflare Email Routing
- [ ] DNS **DMARC** : `v=DMARC1; p=none; rua=mailto:9site4@gmail.com`

### Contenu / mentions légales

- [ ] `src/data/siteConfig.json` → `legal.editor` complété (raison sociale)
- [ ] `legal.publisher` complété (directeur de publication)
- [ ] `legal.host` validé (OVH ou Cloudflare selon déploiement réel)
- [ ] Page `/mentions-legales` : adresse complète à La Réunion remplie (actuellement `[À compléter — adresse complète à La Réunion]`)
- [ ] SIRET ajouté dans la page mentions-legales si entité existante

### Tests pré-déploiement (en local ou preview)

- [ ] Home affiche correctement desktop + mobile
- [ ] `/realisations` : 40 cards visibles, tri OK
- [ ] `/realisations/snack-pizzeria` (ou autre) : page détail OK
- [ ] `/diagnostic-site-internet-la-reunion` : page + formulaire OK
- [ ] `/contact` : formulaire OK
- [ ] `/tarifs` : carte prix + CTA OK
- [ ] `/creation-site-internet-la-reunion` : page pilier OK
- [ ] Une page SEO métier (ex: `/site-internet-restaurant-la-reunion`) OK
- [ ] Une page template (ex: `/templates/pizzeria`) : `<meta name="robots" content="noindex,nofollow">` présent

### Tests formulaires (en preview, données fictives)

- [ ] ContactForm soumission canal **WhatsApp** → ouvre WhatsApp avec message pré-rempli
- [ ] ContactForm soumission canal **Email** → endpoint répond OK (ou `binding_missing` si SEB pas encore configuré)
- [ ] DiagnosticForm avec `aSite=oui` → champ URL apparaît
- [ ] DiagnosticForm avec `aSite=non` → champ URL caché
- [ ] DiagnosticForm soumission → endpoint OK + état succès affiché
- [ ] Honeypot ne déclenche pas d'erreur visible
- [ ] Time-trap (1500ms) : soumission immédiate après chargement = silently rejected

---

## B. Pendant le déploiement

- [ ] Vérifier que `_redirects` est bien dans le bundle final (`dist/_redirects`)
- [ ] Vérifier que `sitemap-index.xml` est généré (`dist/sitemap-index.xml`)
- [ ] Vérifier que `robots.txt` est généré (`dist/robots.txt`)

---

## C. Après déploiement (en prod sur 9site4.re)

### Tests fonctionnels rapides

- [ ] Home `/` charge en < 2s sur 4G mobile
- [ ] `/contact` : formulaire ouvert, validation marche
- [ ] `/diagnostic-site-internet-la-reunion` : formulaire ouvert
- [ ] `/realisations` : 40 cards affichées, hover OK
- [ ] `/tarifs` : carte 97,4€ visible, CTA actif
- [ ] Templates `/templates/*` accessibles mais `noindex` dans le HTML
- [ ] Mobile : nav burger + MobileStickyCTA fonctionnels
- [ ] Pas de console errors

### Tests d'envoi end-to-end (données fictives)

- [ ] **Test contact email** : soumettre `ContactForm` channel=email → ✅ email arrive sur `9site4@gmail.com`
- [ ] **Test contact WhatsApp** : soumettre `ContactForm` channel=whatsapp → ✅ ouvre WhatsApp avec message OK
- [ ] **Test diagnostic email** : soumettre `DiagnosticForm` → ✅ email arrive sur `9site4@gmail.com`
- [ ] **Test diagnostic WhatsApp** : soumettre `DiagnosticForm` channel=whatsapp → ✅ ouvre WhatsApp OK
- [ ] **Test sender visible** : l'email reçu affiche `9site4 Contact <contact@9site4.re>` (pas spam, pas adresse Cloudflare générique)
- [ ] **Test Reply-To** : répondre à l'email arrive vers le prospect, pas vers `9site4@gmail.com`
- [ ] **Test Discord** (si configuré) : notification arrive dans le channel

### Tests SEO / indexabilité

- [ ] `https://9site4.re/sitemap-index.xml` accessible
- [ ] `https://9site4.re/robots.txt` accessible
- [ ] `robots.txt` ne bloque pas `/templates/` (pour que Google lise le noindex)
- [ ] `robots.txt` ne bloque pas `/realisations/` ni les pages SEO
- [ ] Vérifier 5 templates noindex via `view-source:` ou DevTools
- [ ] Vérifier canonical sur 5 pages aléatoires : doit pointer vers self
- [ ] Vérifier JSON-LD sur `/diagnostic-site-internet-la-reunion` : Service présent
- [ ] Vérifier JSON-LD sur `/realisations/<slug>` : BreadcrumbList + CreativeWork

### Tests GA4 (si activé)

- [ ] Ouvrir GA4 → Admin → **DebugView**
- [ ] Naviguer sur le site live
- [ ] Cliquer "Créer mon site" → vérifier event `cta_create_site_click` reçu avec bon `source`
- [ ] Cliquer "Voir nos réalisations" → `cta_view_realisations_click`
- [ ] Cliquer un lien WhatsApp → `whatsapp_click`
- [ ] Soumettre un formulaire test → `contact_form_submit` ou `diagnostic_form_submit`
- [ ] ✅ Vérifier **AUCUN champ PII** dans les events (pas de nom, email, tel, message, URL saisie)

### Tests mobile réels (iOS + Android)

- [ ] Test Safari iPhone (iOS 17+)
- [ ] Test Chrome Android
- [ ] Hero responsive OK
- [ ] MobileStickyCTA n'écrase pas le footer (safe-area iOS)
- [ ] Formulaires : labels lisibles, champs assez grands (tap target ≥ 44px)
- [ ] Lien WhatsApp ouvre bien l'app WhatsApp (pas web)
- [ ] Marquee `/realisations` fluide (pas de jank)

---

## D. Search Console

### Configuration

- [ ] Ajouter propriété **Domaine** `9site4.re` (recommandé) ou propriété URL `https://9site4.re/`
- [ ] Valider via DNS TXT record chez le registrar
- [ ] **Sitemaps** : soumettre `https://9site4.re/sitemap-index.xml`
- [ ] Vérifier : "Sitemap traité, 58 URLs détectées"

### Indexation manuelle prioritaire (max 10/jour)

Outil **Inspection de l'URL** → Demander l'indexation :

- [ ] `/`
- [ ] `/creation-site-internet-la-reunion`
- [ ] `/realisations`
- [ ] `/diagnostic-site-internet-la-reunion`
- [ ] `/agence-web-la-reunion`
- [ ] `/site-vitrine-la-reunion`
- [ ] `/site-internet-restaurant-la-reunion`
- [ ] `/site-internet-artisan-la-reunion`
- [ ] `/tarifs`
- [ ] `/contact`

### Vérifications après 1-2 semaines

- [ ] Couverture : ≥ 50 / 58 pages indexées
- [ ] Pages exclues — noindex : les 40 `/templates/<slug>` doivent apparaître ici
- [ ] Pages exclues — bloquées robots : **vide** (aucune page importante)
- [ ] Pages découvertes non indexées : à surveiller
- [ ] Erreurs : 0 attendu

---

## E. Surveillance continue (semaines 2-12)

- [ ] Couverture Search Console : pages indexées en hausse
- [ ] Impressions / clics : croissance régulière
- [ ] Position moyenne sur "création site internet la réunion" et requêtes métiers
- [ ] CTR > 3% sur requêtes pertinentes
- [ ] GA4 : `contact_form_submit` + `diagnostic_form_submit` reçus
- [ ] GA4 : sources de conversion (page_type, sector) cohérentes
- [ ] Pas de spike de spam sur les formulaires (honeypot + time-trap suffisants)

---

## F. Verdict final — ce qui reste à compléter par un humain

### 🔴 Bloquant (à faire avant ouverture)

1. **Binding Cloudflare `SEB`** — configurer dans Pages → Functions → Bindings
2. **Sender `contact@9site4.re`** — vérifier dans Email Routing
3. **DNS** : SPF + DKIM + DMARC sur `9site4.re`
4. **Mentions légales** : `legal.editor` et `legal.publisher` dans `siteConfig.json` + adresse dans `/mentions-legales`

### 🟡 Recommandé (avant trafic large)

5. **GA4** : créer propriété + récupérer ID + configurer vars env + activer `PUBLIC_ENABLE_ANALYTICS=true`
6. **Discord webhook** (optionnel) : pour réactivité < 24h
7. **Test envoi end-to-end** : 1 contact + 1 diagnostic, vérifier réception Gmail (pas spam) + Reply-To OK

### 🟢 Optionnel (post-lancement)

8. Compression vidéo hero (4.7 MB → < 1.5 MB) avec ffmpeg local
9. Meta Pixel si tu fais de la pub Meta
10. Cookie consent banner (RGPD/CNIL) si tu actives analytics

---

## 🚦 Critère de validation

Le site est **PRÊT pour ouverture publique** dès que les 4 points 🔴 sont cochés.

Les 3 points 🟡 sont fortement recommandés mais pas bloquants pour recevoir des prospects (le fallback WhatsApp continue de fonctionner sans GA4 ni Discord).

Tout le reste (architecture SEO 58 URLs, 14 pages commerciales, 40 pages réalisations détail, tracking 13 events, formulaires honeypot+time-trap, JSON-LD complet, sitemap propre, redirections 301) est **opérationnel**.
