import siteConfig from '../data/siteConfig.json';

/**
 * Helper SEO centralisé (brief §11).
 * Source unique de vérité pour title/description/canonical/ogImage par page.
 * Chaque page importe getSeo() avec sa clé et passe le résultat au BaseLayout.
 */

export interface PageSeo {
  title: string;
  description: string;
  /** chemin relatif (ex: "/contact"), résolu en absolu pour canonical/og:url */
  canonical: string;
  /** chemin relatif vers l'OG image (1200×630) */
  ogImage: string;
  /** alt de l'OG image */
  ogImageAlt: string;
  noindex: boolean;
}

const DEFAULT_OG_IMAGE = '/og-image.png';
const DEFAULT_OG_ALT = `${siteConfig.siteName} — ${siteConfig.baseline}`;

type PageKey =
  | 'home'
  | 'realisations'
  | 'tarifs'
  | 'contact'
  | 'legal'
  | 'notFound'
  | 'styleguide'
  | 'templatePizzeria'
  | 'templateSalon'
  | 'templateSpa'
  | 'templateResto'
  | 'templatePlomberie'
  | 'templatePaysagiste'
  | 'templateElectricien';

const PAGES: Record<PageKey, Omit<PageSeo, 'ogImage' | 'ogImageAlt' | 'noindex'> & { noindex?: boolean; ogImage?: string; ogImageAlt?: string }> = {
  home: {
    title: `${siteConfig.siteName} — Création de site vitrine à La Réunion (974)`,
    description:
      'Sites vitrines clé en main pour TPE/PME réunionnaises. Tout inclus : domaine, hébergement, maintenance. À partir de 97,4€/mois.',
    canonical: '/',
  },
  realisations: {
    title: `Réalisations — Exemples de sites par métier | ${siteConfig.siteName}`,
    description:
      'Exemples de sites vitrines pour restaurants, artisans, beauté, santé, tourisme et services à La Réunion.',
    canonical: '/realisations',
  },
  tarifs: {
    title: `Tarifs — 97,4€/mois ou 974€/an, tout inclus | ${siteConfig.siteName}`,
    description:
      'Une offre simple et tout compris. Site, domaine, hébergement, maintenance et modifications inclus.',
    canonical: '/tarifs',
  },
  contact: {
    title: `Contact — Demandez votre site vitrine | ${siteConfig.siteName}`,
    description:
      'Parlons de votre projet. Formulaire ou WhatsApp. Réponse rapide, sans cahier des charges compliqué.',
    canonical: '/contact',
  },
  legal: {
    title: `Mentions légales | ${siteConfig.siteName}`,
    description: `Mentions légales du site ${siteConfig.siteName}.`,
    canonical: '/mentions-legales',
    noindex: true,
  },
  notFound: {
    title: `Page non trouvée | ${siteConfig.siteName}`,
    description: "La page que vous cherchez n'existe pas.",
    canonical: '/404',
    noindex: true,
  },
  styleguide: {
    title: `Styleguide | ${siteConfig.siteName}`,
    description: 'Bibliothèque de composants UI.',
    canonical: '/styleguide',
    noindex: true,
  },
  templatePizzeria: {
    title: 'Pizza Lé O — Pizzeria à Saint-Paul (Réunion) | Template 9site4',
    description:
      'Aperçu du template "Pizzeria" proposé par 9site4 : menu, panier, commande WhatsApp. Site fictif de démonstration.',
    canonical: '/templates/pizzeria',
    noindex: true,
  },
  templateSalon: {
    title: 'Meg & Dan — Salon de coiffure à Saint-Gilles (Réunion) | Template 9site4',
    description:
      'Aperçu du template "Salon de coiffure" proposé par 9site4 : prestations, prise de rendez-vous, infos pratiques. Site fictif de démonstration.',
    canonical: '/templates/salon',
    noindex: true,
  },
  templateSpa: {
    title: 'Elio spa — Spa & massages à Saint-Pierre (Réunion) | Template 9site4',
    description:
      'Aperçu du template "Spa massage" proposé par 9site4 : rituels signature, soins du visage et du corps, réservation directe. Site fictif de démonstration.',
    canonical: '/templates/spa',
    noindex: true,
  },
  templateResto: {
    title: 'Le jardin perdu — Restaurant gastronomique à Saint-Denis (Réunion) | Template 9site4',
    description:
      'Aperçu du template "Restaurant" proposé par 9site4 : carte du chef, menus, cave à vins, réservation en ligne. Site fictif de démonstration.',
    canonical: '/templates/resto',
    noindex: true,
  },
  templatePlomberie: {
    title: 'Bernard Plomberie — Plombier au Tampon (Réunion) | Template 9site4',
    description:
      'Aperçu du template "Plomberie" proposé par 9site4 : services, tarifs transparents, demande d\'intervention en ligne. Site fictif de démonstration.',
    canonical: '/templates/plomberie',
    noindex: true,
  },
  templatePaysagiste: {
    title: 'Les agapanthes — Paysagiste à Saint-Leu (Réunion) | Template 9site4',
    description:
      'Aperçu du template "Paysagiste" proposé par 9site4 : création de jardins, entretien, plantes locales, devis en ligne. Site fictif de démonstration.',
    canonical: '/templates/paysagiste',
    noindex: true,
  },
  templateElectricien: {
    title: 'Volta — Électricien à Saint-André (Réunion) | Template 9site4',
    description:
      'Aperçu du template "Électricité générale" proposé par 9site4 : services, dépannage 24h/24, borne IRVE, devis en ligne. Site fictif de démonstration.',
    canonical: '/templates/electricien',
    noindex: true,
  },
};

export function getSeo(page: PageKey): PageSeo {
  const p = PAGES[page];
  return {
    title: p.title,
    description: p.description,
    canonical: p.canonical,
    ogImage: p.ogImage ?? DEFAULT_OG_IMAGE,
    ogImageAlt: p.ogImageAlt ?? DEFAULT_OG_ALT,
    noindex: p.noindex ?? false,
  };
}

/** Convertit un chemin relatif en URL absolue basée sur siteConfig.siteUrl. */
export function absoluteUrl(path: string): string {
  return new URL(path, siteConfig.siteUrl).toString();
}
