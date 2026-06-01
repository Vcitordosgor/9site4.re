# Tracking conversion — 9site4

Système d'analytics minimal, privacy-friendly, branchable sur GA4 et/ou Meta Pixel
sans toucher au code une fois configuré.

## Activation

Toutes les variables sont des `PUBLIC_*` (exposées au client par Astro).

| Variable                       | Description                                                 |
| ------------------------------ | ----------------------------------------------------------- |
| `PUBLIC_ENABLE_ANALYTICS`      | Master switch. Doit valoir `true` pour charger quoi que ce soit. |
| `PUBLIC_GA_MEASUREMENT_ID`     | ID GA4 (format `G-XXXXXXXXXX`). Vide → GA4 désactivé.        |
| `PUBLIC_META_PIXEL_ID`         | ID Pixel Meta (numérique). Vide → Pixel désactivé.           |

Voir `.env.example`. Si `PUBLIC_ENABLE_ANALYTICS != 'true'` ou si aucun ID :
**0 script externe chargé, 0 event envoyé, 0 erreur console**.

## Architecture

- `src/lib/tracking.ts` — utilitaire client : `trackEvent()` + `bindAutoTracking()`.
- `src/components/Analytics.astro` — chargement conditionnel GA4 + Meta Pixel +
  import dynamique de `tracking.ts`. Inclus dans `BaseLayout.astro`.

Le binding global est activé via **délégation d'événements** sur `document`,
au capture, idempotent (flag `window.__9s4TrackingBound`). Re-bind safe après
chaque navigation View Transitions.

## Confidentialité

- `anonymize_ip: true` côté GA4.
- **Aucune PII envoyée** : pas de nom, email, téléphone, message, ni contenu
  de formulaire. Seuls le type d'action, la page, la source/target, le secteur
  (catégorie métier, non-PII) et le canal sont transmis.
- `try/catch` silencieux dans tout le code de tracking : aucune exception
  ne remonte au site.

## Ajouter un event sur un CTA existant

Posez simplement des attributs HTML sur l'élément cliquable. Le composant
`Button.astro` propage tout `data-*` via `...rest`, donc ça marche aussi pour
les `<Button>`.

```astro
<a
  href="/contact"
  data-track-event="cta_create_site_click"
  data-track-category="conversion"
  data-track-source="homepage_hero"
  data-track-target="/contact"
>
  Créer mon site
</a>
```

Attributs reconnus :

| Attribut                  | Param `trackEvent` | Exemple                |
| ------------------------- | ------------------ | ---------------------- |
| `data-track-event`        | `name`             | `cta_create_site_click`|
| `data-track-category`     | `category`         | `conversion`           |
| `data-track-label`        | `label`            | `restaurant-x`         |
| `data-track-source`       | `source`           | `homepage_hero`        |
| `data-track-target`       | `target`           | `/contact`             |
| `data-track-sector`       | `sector`           | `restaurant`           |
| `data-track-page-type`    | `page_type`        | `seo_sector_page`      |

## Ajouter un event programmatique

```ts
import { trackEvent } from '../../lib/tracking';

trackEvent({
  name: 'contact_form_submit',
  category: 'conversion',
  label: 'whatsapp',
  source: 'contact_form',
  page_type: 'contact',
});
```

## Auto-détection des liens universels

Tous les `<a>` dont le `href` matche WhatsApp / mailto / tel sont trackés
**automatiquement** sans aucun attribut, partout dans le site (y compris les
templates de démo) :

- `wa.me/*` et `whatsapp.com/*` → `whatsapp_click` (`conversion`)
- `mailto:*` → `email_click` (`conversion`)
- `tel:*` → `phone_click` (`conversion`)

Si l'élément est tagué via `data-track-event`, c'est cet event qui prime.

## Catalogue des events instrumentés

| Event                              | Source                                                       | Catégorie    |
| ---------------------------------- | ------------------------------------------------------------ | ------------ |
| `cta_create_site_click`            | Hero homepage, CTABand (toutes pages), MobileStickyCTA       | conversion   |
| `cta_view_realisations_click`      | Hero homepage, CTABand                                       | navigation   |
| `cta_view_realisation_click`       | RealisationCard (preview + bouton)                           | navigation   |
| `cta_create_in_this_style_click`   | RealisationCard (lien tertiaire)                             | conversion   |
| `cta_pricing_click`                | TarifsBref (home), bouton principal page `/tarifs`           | navigation / conversion |
| `contact_form_submit`              | `ContactForm` (succès WhatsApp ou email)                     | conversion   |
| `whatsapp_click`                   | Tout lien `wa.me` / `whatsapp.com` (auto)                    | conversion   |
| `email_click`                      | Tout lien `mailto:` (auto)                                   | conversion   |
| `phone_click`                      | Tout lien `tel:` (auto)                                      | conversion   |

Sur les 14 pages SEO et la home, le `CTABand` propage `trackingSource` /
`trackingSector` / `trackingPageType`, ce qui permet ensuite de filtrer GA4
par secteur d'activité (`restaurant`, `artisan`, `coiffeur`, etc.).

## À considérer hors scope

- Cookie consent (CNIL/RGPD) — actuellement les scripts se chargent dès lors
  que `PUBLIC_ENABLE_ANALYTICS=true`. À brancher avant la mise en production
  réelle si l'on veut une bannière de consentement (Axeptio, tarteaucitron…).
- Server-side conversion API (Meta CAPI, GA4 Measurement Protocol) — non requis
  pour la collecte de base actuelle.
