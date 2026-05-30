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
  | 'templateElectricien'
  | 'templateCoach'
  | 'templateYoga'
  | 'templateDanse'
  | 'templateOsteo'
  | 'templateDieteticienne'
  | 'templatePsy'
  | 'templateBarJus'
  | 'templateInstitut'
  | 'templateGite'
  | 'templateExcursions'
  | 'templateLocation'
  | 'templateConsultant'
  | 'templateComptable'
  | 'templateArchitecte'
  | 'templateAutoEcole'
  | 'templateConciergerie'
  | 'templateAideDomicile'
  | 'templatePlongee'
  | 'templateWedding'
  | 'templatePatisserie'
  | 'templateGarage'
  | 'templatePhotographe'
  | 'templateAvocat'
  | 'templateBoulangerie'
  | 'templateGlacier'
  | 'templateCafeTorref'
  | 'templateSurf'
  | 'templateFleuriste'
  | 'templateTatoueur'
  | 'templateNaturopathe'
  | 'templateCreche'
  | 'templateNotaire'
  | 'templateStudioAudio';

const PAGES: Record<PageKey, Omit<PageSeo, 'ogImage' | 'ogImageAlt' | 'noindex'> & { noindex?: boolean; ogImage?: string; ogImageAlt?: string }> = {
  home: {
    title: `${siteConfig.siteName} — Site pro à La Réunion, prêt en 7 jours`,
    description:
      'Agence web pour TPE et PME à La Réunion. 9site4 crée et gère le site vitrine des entreprises réunionnaises : hébergement, maintenance, modifications simples et formulaire métier inclus, dès 97,4€/mois sans frais de création.',
    canonical: '/',
  },
  realisations: {
    title: `Exemples métiers — Sites vitrines pour TPE à La Réunion | ${siteConfig.siteName}`,
    description:
      'Exemples de sites vitrines par métier à La Réunion (974) : artisans, restaurants, instituts de beauté, gîtes, coachs, professions libérales. Des démonstrations pour vous projeter, ensuite adaptées à votre activité.',
    canonical: '/realisations',
  },
  tarifs: {
    title: `Tarifs 9site4 — Site vitrine tout compris dès 97,4€/mois`,
    description:
      'Site internet à La Réunion dès 97,4€/mois, soit environ 3,24€/jour. Domaine, hébergement, maintenance, modifications simples et formulaire métier inclus. Sans frais de création, sans engagement.',
    canonical: '/tarifs',
  },
  contact: {
    title: `Contact — Devis gratuit site web Réunion | ${siteConfig.siteName}`,
    description:
      'Demandez votre devis gratuit pour la création de votre site internet à La Réunion. Réponse rapide par WhatsApp ou formulaire. Saint-Denis, Saint-Pierre, Saint-Paul et toute l\'île.',
    canonical: '/contact',
  },
  legal: {
    title: `Mentions légales | ${siteConfig.siteName}`,
    description: `Mentions légales et informations sur l'éditeur du site ${siteConfig.siteName}, agence web à La Réunion (974).`,
    canonical: '/mentions-legales',
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
  templateCoach: {
    title: 'Foudre Coaching — Coach sportif à Saint-Pierre (Réunion) | Template 9site4',
    description:
      'Aperçu du template "Coach sportif" proposé par 9site4 : programmes, transformations, séance d\'essai, planning à domicile / plage / salle. Site fictif de démonstration.',
    canonical: '/templates/coach',
    noindex: true,
  },
  templateYoga: {
    title: 'Souffle Studio — Studio de yoga à Saint-Gilles (Réunion) | Template 9site4',
    description:
      'Aperçu du template "Studio de yoga" proposé par 9site4 : pratiques, planning, enseignants, tarifs et réservation en ligne. Site fictif de démonstration.',
    canonical: '/templates/yoga',
    noindex: true,
  },
  templateDanse: {
    title: 'Vermeille — École de danse à Saint-Denis (Réunion) | Template 9site4',
    description:
      'Aperçu du template "École de danse" proposé par 9site4 : disciplines, professeurs, spectacles, planning et inscription en ligne. Site fictif de démonstration.',
    canonical: '/templates/danse',
    noindex: true,
  },
  templateOsteo: {
    title: 'Cabinet Verveine — Ostéopathe à Saint-Pierre (Réunion) | Template 9site4',
    description:
      'Aperçu du template "Cabinet d\'ostéopathie" proposé par 9site4 : approche, motifs de consultation, déroulé d\'une séance, tarifs et prise de rendez-vous. Site fictif de démonstration.',
    canonical: '/templates/osteo',
    noindex: true,
  },
  templateDieteticienne: {
    title: 'Mona Levray — Diététicienne nutritionniste au Tampon (Réunion) | Template 9site4',
    description:
      'Aperçu du template "Diététicienne" proposé par 9site4 : approche, programmes, recettes, témoignages et rendez-vous en ligne. Site fictif de démonstration.',
    canonical: '/templates/dieteticienne',
    noindex: true,
  },
  templatePsy: {
    title: 'Camille Aubry — Psychologue clinicienne à Saint-Denis (Réunion) | Template 9site4',
    description:
      'Aperçu du template "Psychologue" proposé par 9site4 : approche, cadre déontologique, modalités et prise de rendez-vous confidentielle. Site fictif de démonstration.',
    canonical: '/templates/psychologue',
    noindex: true,
  },
  templateBarJus: {
    title: 'Lagon Pressé — Bar à jus tropical à Saint-Pierre (Réunion) | Template 9site4',
    description:
      'Aperçu du template "Bar à jus tropical" proposé par 9site4 : carte des jus pressés, smoothie bowls, événements, commande WhatsApp. Site fictif de démonstration.',
    canonical: '/templates/bar-jus',
    noindex: true,
  },
  templateInstitut: {
    title: 'Maison Marléne — Institut de beauté à Saint-Gilles (Réunion) | Template 9site4',
    description:
      'Aperçu du template "Institut de beauté" proposé par 9site4 : carte des soins, rituel signature, marques partenaires, cartes cadeaux et réservation. Site fictif de démonstration.',
    canonical: '/templates/institut',
    noindex: true,
  },
  templateGite: {
    title: 'Le Cap Anglais — Gîte de cirque à Cilaos (Réunion) | Template 9site4',
    description:
      'Aperçu du template "Gîte de montagne" proposé par 9site4 : fiche gîte, chambres, calendrier de disponibilités, randonnées et réservation en ligne. Site fictif de démonstration.',
    canonical: '/templates/gite',
    noindex: true,
  },
  templateExcursions: {
    title: 'Sentiers Croisés — Guide de randonnée à Mafate (Réunion) | Template 9site4',
    description:
      'Aperçu du template "Excursions randonnée" proposé par 9site4 : sorties guidées, calendrier des prochaines dates, témoignages, galerie et réservation. Site fictif de démonstration.',
    canonical: '/templates/excursions',
    noindex: true,
  },
  templateLocation: {
    title: 'Villa Lazuli — Location bord de mer à Saint-Leu (Réunion) | Template 9site4',
    description:
      'Aperçu du template "Location saisonnière bord de mer" proposé par 9site4 : visite virtuelle, équipements, tarifs par saison, disponibilités et réservation. Site fictif de démonstration.',
    canonical: '/templates/location',
    noindex: true,
  },
  templateConsultant: {
    title: 'Lucas Ferrier — Consultant stratégie digitale à Saint-Denis (Réunion) | Template 9site4',
    description:
      'Aperçu du template "Consultant" proposé par 9site4 : portfolio personnel, missions case studies, compétences, tarifs et prise de rendez-vous. Site fictif de démonstration.',
    canonical: '/templates/consultant',
    noindex: true,
  },
  templateComptable: {
    title: 'Cabinet Auberval & Associés — Expertise comptable à Saint-Denis (Réunion) | Template 9site4',
    description:
      'Aperçu du template "Cabinet comptable" proposé par 9site4 : associés, domaines d\'expertise, honoraires, témoignages clients et rendez-vous. Site fictif de démonstration.',
    canonical: '/templates/comptable',
    noindex: true,
  },
  templateArchitecte: {
    title: 'Atelier Mahatma — Architecte à Saint-Pierre (Réunion) | Template 9site4',
    description:
      'Aperçu du template "Architecte" proposé par 9site4 : portfolio de projets, méthode, honoraires, distinctions et rendez-vous. Site fictif de démonstration.',
    canonical: '/templates/architecte',
    noindex: true,
  },
  templateAutoEcole: {
    title: 'Boost Conduite — Auto-école à Saint-Denis (Réunion) | Template 9site4',
    description:
      'Aperçu du template "Auto-école" proposé par 9site4 : forfaits permis, code en ligne, équipe pédagogique, témoignages et inscription. Site fictif de démonstration.',
    canonical: '/templates/auto-ecole',
    noindex: true,
  },
  templateConciergerie: {
    title: 'Concierge & Co — Conciergerie privée à Saint-Gilles (Réunion) | Template 9site4',
    description:
      'Aperçu du template "Conciergerie" proposé par 9site4 : services à la personne, formules d\'abonnement, témoignages clients et demande de service. Site fictif de démonstration.',
    canonical: '/templates/conciergerie',
    noindex: true,
  },
  templateAideDomicile: {
    title: 'Doudou Service — Aide à domicile à Saint-André (Réunion) | Template 9site4',
    description:
      'Aperçu du template "Aide à domicile" proposé par 9site4 : services à la personne, équipe, tarifs APA/PCH, témoignages familles. Site fictif de démonstration.',
    canonical: '/templates/aide-domicile',
    noindex: true,
  },
  templatePlongee: {
    title: 'Bleu Lagon Plongée — Centre de plongée à Saint-Leu (Réunion) | Template 9site4',
    description:
      'Aperçu du template "Centre de plongée" proposé par 9site4 : formules baptême et exploration, dashboard de plongée, sécurité, sortie baleines. Site fictif de démonstration.',
    canonical: '/templates/plongee',
    noindex: true,
  },
  templateWedding: {
    title: 'Sève & Sel — Wedding planner à Saint-Gilles-les-Bains (Réunion) | Template 9site4',
    description:
      'Aperçu du template "Wedding planner" proposé par 9site4 : cérémonies plage, civiles et intimes, lieux iconiques de La Réunion, démarches sur-mesure. Site fictif de démonstration.',
    canonical: '/templates/wedding',
    noindex: true,
  },
  templatePatisserie: {
    title: 'La Vanille de Bel-Air — Pâtisserie créole à Saint-André (Réunion) | Template 9site4',
    description:
      'Aperçu du template "Pâtisserie créole" proposé par 9site4 : carte du jour, calendrier des fruits de saison, commandes spéciales, mariages et événements. Site fictif de démonstration.',
    canonical: '/templates/patisserie',
    noindex: true,
  },
  templateGarage: {
    title: 'Atelier Motorpiton — Garage mécanique au Tampon (Réunion) | Template 9site4',
    description:
      'Aperçu du template "Garage mécanique" proposé par 9site4 : interventions chiffrées, fiche bordereau atelier, équipe, engagements, devis 24h. Site fictif de démonstration.',
    canonical: '/templates/garage',
    noindex: true,
  },
  templatePhotographe: {
    title: 'Studio Latitude — Photographe d\'auteur à Saint-Denis (Réunion) | Template 9site4',
    description:
      'Aperçu du template "Photographe d\'auteur" proposé par 9site4 : portraits argentiques, mariage éditorial, reportage, tirages d\'art numérotés. Site fictif de démonstration.',
    canonical: '/templates/photographe',
    noindex: true,
  },
  templateAvocat: {
    title: 'Étude Roussin — Cabinet d\'avocats à La Réunion | Template 9site4',
    description:
      'Aperçu du template "Cabinet d\'avocats" proposé par 9site4 : domaines d\'intervention (famille, affaires, travail, immobilier), associés, démarche, honoraires transparents. Site fictif de démonstration.',
    canonical: '/templates/avocat',
    noindex: true,
  },
  templateBoulangerie: {
    title: 'Le Pain Levé — Boulangerie au levain à La Réunion | Template 9site4',
    description:
      'Aperçu du template "Boulangerie artisanale" proposé par 9site4 : carte de pains au levain, calendrier de cuisson, processus du fournil, viennoiseries pur beurre. Site fictif de démonstration.',
    canonical: '/templates/boulangerie',
    noindex: true,
  },
  templateGlacier: {
    title: 'Sorbet Péi — Glacier artisanal à La Réunion | Template 9site4',
    description:
      'Aperçu du template "Glacier artisanal" proposé par 9site4 : sorbets fruits péi, tournée du camion glacé, privatisation événementiel. Site fictif de démonstration.',
    canonical: '/templates/glacier',
    noindex: true,
  },
  templateCafeTorref: {
    title: 'Brûlerie d\'altitude — Café torréfié à La Réunion | Template 9site4',
    description:
      'Aperçu du template "Café et torréfaction" proposé par 9site4 : origines péi, méthodes d\'extraction, abonnement grains frais. Site fictif de démonstration.',
    canonical: '/templates/cafe-torref',
    noindex: true,
  },
  templateSurf: {
    title: 'Bord d\'eau — École de surf à La Réunion | Template 9site4',
    description:
      'Aperçu du template "École de surf" proposé par 9site4 : formules initiation et perfectionnement, spots étudiés, lecture marée et matériel sécurité. Site fictif de démonstration.',
    canonical: '/templates/surf',
    noindex: true,
  },
  templateFleuriste: {
    title: 'Frangipane — Atelier floral à La Réunion | Template 9site4',
    description:
      'Aperçu du template "Atelier floral" proposé par 9site4 : compositions de saison, mariages et événementiel, abonnement bureau. Site fictif de démonstration.',
    canonical: '/templates/fleuriste',
    noindex: true,
  },
  templateTatoueur: {
    title: 'Encre Volcan — Studio de tatouage à La Réunion | Template 9site4',
    description:
      'Aperçu du template "Studio de tatouage" proposé par 9site4 : quatre styles signature (blackwork, lettering, floral, old-school), équipe de trois encreurs résidents, flash sheet, process et tarification. Site fictif de démonstration.',
    canonical: '/templates/tatoueur',
    noindex: true,
  },
  templateNaturopathe: {
    title: 'Source — Naturopathie à La Réunion | Template 9site4',
    description:
      'Aperçu du template "Naturopathe" proposé par 9site4 : approche (fatigue, sommeil, digestion, stress), méthode en 4 étapes, parcours certifié FENA, cabinet, tarifs et conseils. Site fictif de démonstration.',
    canonical: '/templates/naturopathe',
    noindex: true,
  },
  templateCreche: {
    title: 'Le Nid — Micro-crèche à La Réunion | Template 9site4',
    description:
      'Aperçu du template "Micro-crèche" proposé par 9site4 : pédagogie Montessori, équipe diplômée, journée type 7h-19h, locaux et jardin, sécurité PMI et tarifs CAF. Site fictif de démonstration.',
    canonical: '/templates/creche',
    noindex: true,
  },
  templateNotaire: {
    title: 'Étude Notariale & Associés — Notaires à La Réunion | Template 9site4',
    description:
      'Aperçu du template "Étude notariale" proposé par 9site4 : quatre domaines (famille, succession, immobilier, sociétés), notaires associés, méthode, frais transparents et documents à apporter. Site fictif de démonstration.',
    canonical: '/templates/notaire',
    noindex: true,
  },
  templateStudioAudio: {
    title: 'Onde — Studio d\'enregistrement à La Réunion | Template 9site4',
    description:
      'Aperçu du template "Studio audio" proposé par 9site4 : enregistrement, mixage, mastering streaming, production musicale, équipement SSL/Pro Tools et ingénieurs résidents. Site fictif de démonstration.',
    canonical: '/templates/studio-audio',
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
