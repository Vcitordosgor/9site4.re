/**
 * 9site4 — Tracking utility (GA4 + Meta Pixel + dataLayer + auto-binding)
 *
 * Design goals
 * - Zero-config safe : si aucun ID configuré / `PUBLIC_ENABLE_ANALYTICS != 'true'`,
 *   aucun script n'est chargé (côté <Analytics />) et `trackEvent` est un no-op silencieux.
 * - Pas de PII : on n'envoie jamais nom/email/téléphone/message/contenu de formulaire.
 *   On ne tracke que le TYPE d'action et un contexte (page, source, target, secteur).
 * - Robuste : try/catch silencieux partout ; aucune exception ne doit remonter dans
 *   le runtime du site.
 * - Auto-binding via attributs `data-track-*` sur n'importe quel élément cliquable,
 *   plus détection auto des liens WhatsApp / mailto: / tel: qui ne sont pas déjà tagués.
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    __9s4TrackingBound?: boolean;
  }
}

export type TrackEventParams = {
  /** Nom de l'event (snake_case, ex: 'cta_create_site_click'). */
  name: string;
  /** Catégorie (ex: 'conversion', 'navigation'). */
  category?: string;
  /** Label libre (ex: slug, identifiant CTA). */
  label?: string;
  /** Chemin de la page courante (auto si omis). */
  page?: string;
  /** Origine du clic (ex: 'homepage_hero', 'realisation_card'). */
  source?: string;
  /** Destination (ex: '/contact', 'https://wa.me/...'). */
  target?: string;
  /** Secteur métier pour les pages SEO. */
  sector?: string;
  /** Type de page (ex: 'seo_sector_page', 'home', 'pricing'). */
  page_type?: string;
};

function safe<T>(fn: () => T): T | undefined {
  try {
    return fn();
  } catch {
    return undefined;
  }
}

function currentPath(): string {
  if (typeof window === 'undefined') return '';
  return safe(() => window.location.pathname + window.location.search) ?? '';
}

/**
 * Envoie un event vers GA4, Meta Pixel et dataLayer (si présents).
 * No-op silencieux si aucun n'est disponible.
 */
export function trackEvent(params: TrackEventParams): void {
  if (typeof window === 'undefined') return;
  const payload = {
    event_category: params.category,
    event_label: params.label,
    page: params.page ?? currentPath(),
    source: params.source,
    target: params.target,
    sector: params.sector,
    page_type: params.page_type,
  };

  // GA4
  safe(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', params.name, payload);
    }
  });

  // Meta Pixel — on passe par un CustomEvent générique avec le nom comme propriété,
  // pour éviter d'avoir à mapper sur les events standards (Lead, Contact…).
  safe(() => {
    if (typeof window.fbq === 'function') {
      window.fbq('trackCustom', params.name, payload);
    }
  });

  // dataLayer (GTM)
  safe(() => {
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push({ event: params.name, ...payload });
    }
  });

  // Debug en dev (ne s'exécute que sur localhost/preview)
  safe(() => {
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1' || host.endsWith('.local')) {
      // eslint-disable-next-line no-console
      console.debug('[track]', params.name, payload);
    }
  });
}

/**
 * Lit les attributs data-track-* d'un élément pour produire un TrackEventParams.
 * Retourne null si pas d'attribut `data-track-event`.
 */
function readDataAttrs(el: HTMLElement): TrackEventParams | null {
  const name = el.getAttribute('data-track-event');
  if (!name) return null;
  return {
    name,
    category: el.getAttribute('data-track-category') ?? undefined,
    label: el.getAttribute('data-track-label') ?? undefined,
    source: el.getAttribute('data-track-source') ?? undefined,
    target: el.getAttribute('data-track-target') ?? (el as HTMLAnchorElement).href ?? undefined,
    sector: el.getAttribute('data-track-sector') ?? undefined,
    page_type: el.getAttribute('data-track-page-type') ?? undefined,
  };
}

/**
 * Détection automatique des liens universels (WhatsApp / mailto / tel) qui
 * n'auraient pas été tagués manuellement. Évite d'instrumenter chaque template.
 */
function autoDetectUniversal(anchor: HTMLAnchorElement): TrackEventParams | null {
  const href = anchor.getAttribute('href') || '';
  if (!href) return null;
  if (/^https?:\/\/(?:[^/]*\.)?wa\.me\//i.test(href) || /whatsapp\.com/i.test(href)) {
    return { name: 'whatsapp_click', category: 'conversion', target: href };
  }
  if (href.startsWith('mailto:')) {
    return { name: 'email_click', category: 'conversion', target: href };
  }
  if (href.startsWith('tel:')) {
    return { name: 'phone_click', category: 'conversion', target: href };
  }
  return null;
}

/**
 * Délégation globale de clic. Idempotent (peut être appelé plusieurs fois,
 * ex. après navigation View Transitions).
 */
export function bindAutoTracking(): void {
  if (typeof document === 'undefined') return;
  if (window.__9s4TrackingBound) return;
  window.__9s4TrackingBound = true;

  document.addEventListener(
    'click',
    (e) => {
      safe(() => {
        const path = (e.composedPath?.() as EventTarget[]) ?? [];
        const nodes = path.length ? path : [e.target as EventTarget];
        for (const node of nodes) {
          if (!(node instanceof HTMLElement)) continue;
          // 1) Élément explicitement tagué
          const tracked = node.closest<HTMLElement>('[data-track-event]');
          if (tracked) {
            const params = readDataAttrs(tracked);
            if (params) trackEvent(params);
            return;
          }
          // 2) Anchor universel (wa.me / mailto / tel) non tagué
          if (node instanceof HTMLAnchorElement) {
            const auto = autoDetectUniversal(node);
            if (auto) trackEvent(auto);
            return;
          }
          const anchor = node.closest('a');
          if (anchor instanceof HTMLAnchorElement) {
            const auto = autoDetectUniversal(anchor);
            if (auto) trackEvent(auto);
            return;
          }
        }
      });
    },
    { capture: true }
  );
}

// Auto-init côté client
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => bindAutoTracking());
  } else {
    bindAutoTracking();
  }
  // Re-bind safe après View Transitions (idempotent grâce au flag global)
  document.addEventListener('astro:page-load', () => bindAutoTracking());
}
