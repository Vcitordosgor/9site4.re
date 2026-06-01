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
  | 'exemples'
  | 'tarifs'
  | 'contact'
  | 'legal'
  | 'notFound'
  | 'styleguide'
  | 'creationSiteReunion'
  | 'siteRestaurantReunion'
  | 'siteArtisanReunion'
  | 'siteCoiffeurReunion'
  | 'siteInstitutSpaReunion'
  | 'siteGiteLocationReunion'
  | 'siteProfessionLiberaleReunion'
  | 'siteBienEtreSanteReunion'
  | 'siteInstitutBeauteReunion'
  | 'siteCoachIndependantReunion'
  | 'siteCommerceLocalReunion'
  | 'siteTpePmeReunion'
  | 'siteVitrineReunion'
  | 'agenceWebReunion'
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
    title: `${siteConfig.siteName} — Le partenaire web des TPE/PME à La Réunion`,
    description:
      'Partenaire web des professionnels réunionnais. 9site4 crée, structure et gère des sites professionnels pour TPE/PME à La Réunion : création incluse, module métier, hébergement, maintenance et accompagnement local pour 97,4€/mois.',
    canonical: '/',
  },
  exemples: {
    title: `Nos réalisations — Sites professionnels à La Réunion | ${siteConfig.siteName}`,
    description:
      'Découvrez les réalisations 9site4 : sites professionnels conçus pour les TPE/PME réunionnaises — artisans, restaurants, instituts, gîtes, coachs, professions libérales. Chaque site est adapté au métier et géré dans la durée.',
    canonical: '/exemples',
  },
  tarifs: {
    title: `Tarifs 9site4 — Formule claire à 97,4€/mois pour votre site professionnel`,
    description:
      'Une formule claire pour votre site professionnel à La Réunion : 97,4€/mois tout inclus. Création, design, module métier, domaine, hébergement, maintenance, modifications simples et accompagnement local. Sans frais de création, sans engagement.',
    canonical: '/tarifs',
  },
  contact: {
    title: `Contact — Parlez-nous de votre projet web | ${siteConfig.siteName}`,
    description:
      'Présentez votre activité, votre besoin et vos objectifs à 9site4. Notre équipe vous répond avec une proposition claire et adaptée à votre métier. Accompagnement local à La Réunion.',
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
  creationSiteReunion: {
    title: `Création de site internet à La Réunion pour TPE/PME | ${siteConfig.siteName}`,
    description:
      '9site4 crée, structure et gère des sites internet professionnels pour les TPE/PME à La Réunion. Site prêt en 7 jours, création incluse, gestion continue.',
    canonical: '/creation-site-internet-la-reunion',
  },
  siteRestaurantReunion: {
    title: `Site internet pour restaurant à La Réunion | ${siteConfig.siteName}`,
    description:
      '9site4 crée des sites professionnels pour restaurants, snacks, bars, cafés et pizzerias à La Réunion : carte, horaires, photos, réservation et gestion continue.',
    canonical: '/site-internet-restaurant-la-reunion',
  },
  siteArtisanReunion: {
    title: `Site internet pour artisan à La Réunion | ${siteConfig.siteName}`,
    description:
      "9site4 crée des sites professionnels pour artisans et entreprises locales à La Réunion : prestations, zones d'intervention, demande de devis, photos et gestion continue.",
    canonical: '/site-internet-artisan-la-reunion',
  },
  siteCoiffeurReunion: {
    title: `Site internet pour coiffeur à La Réunion | ${siteConfig.siteName}`,
    description:
      '9site4 crée des sites professionnels pour salons de coiffure et coiffeurs à La Réunion : prestations, équipe, prise de rendez-vous et gestion continue.',
    canonical: '/site-internet-coiffeur-la-reunion',
  },
  siteInstitutSpaReunion: {
    title: `Site internet pour institut de beauté et spa à La Réunion | ${siteConfig.siteName}`,
    description:
      '9site4 crée des sites professionnels pour instituts de beauté, spas, esthéticiennes et centres de bien-être à La Réunion : soins, réservation et gestion continue.',
    canonical: '/site-internet-institut-beaute-spa-la-reunion',
  },
  siteGiteLocationReunion: {
    title: `Site internet pour gîte et location à La Réunion | ${siteConfig.siteName}`,
    description:
      '9site4 crée des sites professionnels pour gîtes, locations saisonnières, conciergeries et hébergements touristiques à La Réunion : présentation, calendrier, demande de séjour.',
    canonical: '/site-internet-gite-location-la-reunion',
  },
  siteProfessionLiberaleReunion: {
    title: `Site internet pour profession libérale à La Réunion | ${siteConfig.siteName}`,
    description:
      '9site4 crée des sites professionnels pour avocats, notaires, experts-comptables, consultants et architectes à La Réunion : présentation, méthode et prise de rendez-vous.',
    canonical: '/site-internet-profession-liberale-la-reunion',
  },
  siteBienEtreSanteReunion: {
    title: `Site internet pour praticien bien-être et santé à La Réunion | ${siteConfig.siteName}`,
    description:
      '9site4 crée des sites professionnels pour ostéopathes, naturopathes, diététiciens, coachs sportifs, yoga, danse et professionnels du bien-être à La Réunion : prestations, rendez-vous et gestion continue.',
    canonical: '/site-internet-bien-etre-sante-la-reunion',
  },
  siteInstitutBeauteReunion: {
    title: `Site internet pour institut de beauté à La Réunion | ${siteConfig.siteName}`,
    description:
      '9site4 crée des sites professionnels pour instituts de beauté, salons, spas, coiffeurs et professionnels du bien-être à La Réunion : soins, tarifs, rendez-vous et gestion continue.',
    canonical: '/site-internet-institut-beaute-la-reunion',
  },
  siteCoachIndependantReunion: {
    title: `Site internet pour coach et indépendant à La Réunion | ${siteConfig.siteName}`,
    description:
      '9site4 crée des sites professionnels pour coachs, consultants, formateurs et indépendants à La Réunion : offres, programmes, premier échange et gestion continue.',
    canonical: '/site-internet-coach-independant-la-reunion',
  },
  siteCommerceLocalReunion: {
    title: `Site internet pour commerce local à La Réunion | ${siteConfig.siteName}`,
    description:
      "9site4 crée des sites professionnels pour commerces locaux à La Réunion : présentation de l'activité, horaires, produits, contact, demandes d'information et gestion continue.",
    canonical: '/site-internet-commerce-local-la-reunion',
  },
  siteTpePmeReunion: {
    title: `Site internet pour TPE/PME à La Réunion | ${siteConfig.siteName}`,
    description:
      '9site4 accompagne les TPE/PME réunionnaises avec des sites professionnels clairs, fiables, adaptés à leur métier et gérés dans la durée.',
    canonical: '/site-internet-tpe-pme-la-reunion',
  },
  siteVitrineReunion: {
    title: `Site vitrine à La Réunion pour professionnels | ${siteConfig.siteName}`,
    description:
      '9site4 crée et gère des sites vitrines professionnels à La Réunion pour présenter votre activité, vos prestations, vos informations pratiques et faciliter la prise de contact.',
    canonical: '/site-vitrine-la-reunion',
  },
  agenceWebReunion: {
    title: `Agence web à La Réunion pour TPE/PME | ${siteConfig.siteName}`,
    description:
      ' 9site4 accompagne les professionnels réunionnais dans la création, la structuration et la gestion de leur site internet, avec une offre claire et un accompagnement local.'.trim(),
    canonical: '/agence-web-la-reunion',
  },
  templatePizzeria: {
    title: 'Pizza Lé O — Pizzeria à Saint-Paul (Réunion) | Template 9site4',
    description:
      'Pizza Lé O (fictif) — pâte 72h, feu de bois, commande WhatsApp. Démo 9site4 : votre site pizzeria sera adapté à votre carte et votre identité.',
    canonical: '/templates/pizzeria',
    noindex: true,
  },
  templateSalon: {
    title: 'Meg & Dan — Salon de coiffure à Saint-Gilles (Réunion) | Template 9site4',
    description:
      'Meg & Dan (fictif) — coupes signature, coloration végétale, prise de RDV en ligne. Démo 9site4 : votre site salon sera adapté à votre univers.',
    canonical: '/templates/salon',
    noindex: true,
  },
  templateSpa: {
    title: 'Elio spa — Spa & massages à Saint-Pierre (Réunion) | Template 9site4',
    description:
      'Elio Spa (fictif) — rituels signature, soins visage et corps, réservation directe. Démo 9site4 : votre site spa sera adapté à votre carte de soins.',
    canonical: '/templates/spa',
    noindex: true,
  },
  templateResto: {
    title: 'Le jardin perdu — Restaurant gastronomique à Saint-Denis (Réunion) | Template 9site4',
    description:
      'Le Jardin Perdu (fictif) — cuisine de saison, cave engagée, réservation en ligne. Démo 9site4 : votre site restaurant sera adapté à votre carte.',
    canonical: '/templates/resto',
    noindex: true,
  },
  templatePlomberie: {
    title: 'Bernard Plomberie — Plombier au Tampon (Réunion) | Template 9site4',
    description:
      'Bernard Plomberie (fictif) — dépannage 24h, tarifs transparents, devis en ligne. Démo 9site4 : votre site plomberie sera adapté à vos prestations.',
    canonical: '/templates/plomberie',
    noindex: true,
  },
  templatePaysagiste: {
    title: 'Les agapanthes — Paysagiste à Saint-Leu (Réunion) | Template 9site4',
    description:
      'Les Agapanthes (fictif) — création de jardins, entretien, plantes péi, devis en ligne. Démo 9site4 : votre site paysagiste sera adapté à vos chantiers.',
    canonical: '/templates/paysagiste',
    noindex: true,
  },
  templateElectricien: {
    title: 'Volta — Électricien à Saint-André (Réunion) | Template 9site4',
    description:
      'Volta (fictif) — dépannage 24h/24, mise aux normes, borne IRVE, devis express. Démo 9site4 : votre site électricien sera adapté à votre activité.',
    canonical: '/templates/electricien',
    noindex: true,
  },
  templateCoach: {
    title: 'Foudre Coaching — Coach sportif à Saint-Pierre (Réunion) | Template 9site4',
    description:
      'Foudre Coaching (fictif) — programmes sur-mesure, séance d\'essai offerte, domicile/plage/salle. Démo 9site4 : votre site coach sera adapté à votre méthode.',
    canonical: '/templates/coach',
    noindex: true,
  },
  templateYoga: {
    title: 'Souffle Studio — Studio de yoga à Saint-Gilles (Réunion) | Template 9site4',
    description:
      'Souffle Studio (fictif) — pratiques douces et dynamiques, planning en ligne, cours d\'essai. Démo 9site4 : votre site yoga sera adapté à votre studio.',
    canonical: '/templates/yoga',
    noindex: true,
  },
  templateDanse: {
    title: 'Vermeille — École de danse à Saint-Denis (Réunion) | Template 9site4',
    description:
      'Vermeille (fictif) — toutes disciplines, professeurs diplômés, inscription en ligne. Démo 9site4 : votre site école de danse sera adapté à vos cours.',
    canonical: '/templates/danse',
    noindex: true,
  },
  templateOsteo: {
    title: 'Cabinet Verveine — Ostéopathe à Saint-Pierre (Réunion) | Template 9site4',
    description:
      'Cabinet Verveine (fictif) — approche douce, RDV en ligne, tarifs clairs. Démo 9site4 : votre site ostéopathe sera adapté à votre pratique.',
    canonical: '/templates/osteo',
    noindex: true,
  },
  templateDieteticienne: {
    title: 'Mona Levray — Diététicienne nutritionniste au Tampon (Réunion) | Template 9site4',
    description:
      'Mona Levray (fictif) — bilans personnalisés, programmes sans interdits, RDV en ligne. Démo 9site4 : votre site diététicienne sera adapté à votre approche.',
    canonical: '/templates/dieteticienne',
    noindex: true,
  },
  templatePsy: {
    title: 'Camille Aubry — Psychologue clinicienne à Saint-Denis (Réunion) | Template 9site4',
    description:
      'Camille Aubry (fictif) — écoute confidentielle, cadre déontologique, prise de RDV discrète. Démo 9site4 : votre site psy sera adapté à votre pratique.',
    canonical: '/templates/psychologue',
    noindex: true,
  },
  templateBarJus: {
    title: 'Lagon Pressé — Bar à jus tropical à Saint-Pierre (Réunion) | Template 9site4',
    description:
      'Lagon Pressé (fictif) — jus pressés du jour, smoothie bowls, commande WhatsApp. Démo 9site4 : votre site bar à jus sera adapté à votre carte.',
    canonical: '/templates/bar-jus',
    noindex: true,
  },
  templateInstitut: {
    title: 'Maison Marléne — Institut de beauté à Saint-Gilles (Réunion) | Template 9site4',
    description:
      'Maison Marléne (fictif) — soins signature, marques expertes, cartes cadeaux, réservation. Démo 9site4 : votre site institut sera adapté à vos prestations.',
    canonical: '/templates/institut',
    noindex: true,
  },
  templateGite: {
    title: 'La Crête d\'Aurère — Gîte de cirque à Cilaos (Réunion) | Template 9site4',
    description:
      'La Crête d\'Aurère (fictif) — gîte authentique à Cilaos, calendrier en direct, réservation. Démo 9site4 : votre site gîte sera adapté à votre hébergement.',
    canonical: '/templates/gite',
    noindex: true,
  },
  templateExcursions: {
    title: 'Sentiers Croisés — Guide de randonnée à Mafate (Réunion) | Template 9site4',
    description:
      'Sentiers Croisés (fictif) — sorties guidées Mafate, dates ouvertes, réservation simple. Démo 9site4 : votre site guide sera adapté à vos circuits.',
    canonical: '/templates/excursions',
    noindex: true,
  },
  templateLocation: {
    title: 'Villa Lazuli — Location bord de mer à Saint-Leu (Réunion) | Template 9site4',
    description:
      'Villa Lazuli (fictif) — vue lagon, équipements premium, disponibilités en direct. Démo 9site4 : votre site location sera adapté à votre bien.',
    canonical: '/templates/location',
    noindex: true,
  },
  templateConsultant: {
    title: 'Lucas Ferrier — Consultant stratégie digitale à Saint-Denis (Réunion) | Template 9site4',
    description:
      'Lucas Ferrier (fictif) — case studies, expertise digitale, RDV diagnostic gratuit. Démo 9site4 : votre site consultant sera adapté à votre offre.',
    canonical: '/templates/consultant',
    noindex: true,
  },
  templateComptable: {
    title: 'Cabinet Auberval & Associés — Expertise comptable à Saint-Denis (Réunion) | Template 9site4',
    description:
      'Auberval & Associés (fictif) — expertise comptable, fiscalité, social, honoraires clairs. Démo 9site4 : votre site cabinet sera adapté à vos services.',
    canonical: '/templates/comptable',
    noindex: true,
  },
  templateArchitecte: {
    title: 'Atelier Mahatma — Architecte à Saint-Pierre (Réunion) | Template 9site4',
    description:
      'Atelier Mahatma (fictif) — portfolio de projets, méthode claire, premier RDV. Démo 9site4 : votre site architecte sera adapté à votre style.',
    canonical: '/templates/architecte',
    noindex: true,
  },
  templateAutoEcole: {
    title: 'Boost Conduite — Auto-école à Saint-Denis (Réunion) | Template 9site4',
    description:
      'Boost Conduite (fictif) — forfaits permis B, code en ligne 24/7, moniteurs dédiés. Démo 9site4 : votre site auto-école sera adapté à vos forfaits.',
    canonical: '/templates/auto-ecole',
    noindex: true,
  },
  templateConciergerie: {
    title: 'Concierge & Co — Conciergerie privée à Saint-Gilles (Réunion) | Template 9site4',
    description:
      'Concierge & Co (fictif) — services à la personne, formules d\'abonnement, intervention rapide. Démo 9site4 : votre site conciergerie sera adapté à vos prestations.',
    canonical: '/templates/conciergerie',
    noindex: true,
  },
  templateAideDomicile: {
    title: 'Doudou Service — Aide à domicile à Saint-André (Réunion) | Template 9site4',
    description:
      'Doudou Service (fictif) — aide à domicile, APA/PCH, équipe formée, devis gratuit. Démo 9site4 : votre site aide à domicile sera adapté à votre structure.',
    canonical: '/templates/aide-domicile',
    noindex: true,
  },
  templatePlongee: {
    title: 'Bleu Lagon Plongée — Centre de plongée à Saint-Leu (Réunion) | Template 9site4',
    description:
      'Bleu Lagon (fictif) — baptême, exploration, sortie baleines, sécurité totale. Démo 9site4 : votre site centre de plongée sera adapté à vos sorties.',
    canonical: '/templates/plongee',
    noindex: true,
  },
  templateWedding: {
    title: 'Sève & Sel — Wedding planner à Saint-Gilles-les-Bains (Réunion) | Template 9site4',
    description:
      'Sève & Sel (fictif) — cérémonies plage, lieux iconiques 974, sur-mesure intégral. Démo 9site4 : votre site wedding planner sera adapté à votre univers.',
    canonical: '/templates/wedding',
    noindex: true,
  },
  templatePatisserie: {
    title: 'La Vanille de Bel-Air — Pâtisserie créole à Saint-André (Réunion) | Template 9site4',
    description:
      'La Vanille de Bel-Air (fictif) — pâtisseries créoles, fruits péi, commandes mariages et événements. Démo 9site4 : votre site pâtisserie sera adapté à votre carte.',
    canonical: '/templates/patisserie',
    noindex: true,
  },
  templateGarage: {
    title: 'Atelier Motorpiton — Garage mécanique au Tampon (Réunion) | Template 9site4',
    description:
      'Atelier Motorpiton (fictif) — interventions chiffrées, équipe certifiée, devis 24h. Démo 9site4 : votre site garage sera adapté à vos services.',
    canonical: '/templates/garage',
    noindex: true,
  },
  templatePhotographe: {
    title: 'Studio Latitude — Photographe d\'auteur à Saint-Denis (Réunion) | Template 9site4',
    description:
      'Studio Latitude (fictif) — portraits, mariage éditorial, reportage, tirages numérotés. Démo 9site4 : votre site photographe sera adapté à votre style.',
    canonical: '/templates/photographe',
    noindex: true,
  },
  templateAvocat: {
    title: 'Étude Roussin — Cabinet d\'avocats à La Réunion | Template 9site4',
    description:
      'Étude Roussin (fictif) — famille, affaires, travail, immobilier, honoraires transparents. Démo 9site4 : votre site avocat sera adapté à vos domaines.',
    canonical: '/templates/avocat',
    noindex: true,
  },
  templateBoulangerie: {
    title: 'Le Pain Levé — Boulangerie au levain à La Réunion | Template 9site4',
    description:
      'Le Pain Levé (fictif) — pains au levain, viennoiseries pur beurre, calendrier de cuisson. Démo 9site4 : votre site boulangerie sera adapté à votre fournil.',
    canonical: '/templates/boulangerie',
    noindex: true,
  },
  templateGlacier: {
    title: 'Sorbet Péi — Glacier artisanal à La Réunion | Template 9site4',
    description:
      'Sorbet Péi (fictif) — sorbets fruits péi, tournée du camion glacé, privatisation. Démo 9site4 : votre site glacier sera adapté à vos parfums.',
    canonical: '/templates/glacier',
    noindex: true,
  },
  templateCafeTorref: {
    title: 'Brûlerie d\'altitude — Café torréfié à La Réunion | Template 9site4',
    description:
      'Brûlerie d\'Altitude (fictif) — origines péi, méthodes douces, abonnement grains frais. Démo 9site4 : votre site torréfacteur sera adapté à vos cafés.',
    canonical: '/templates/cafe-torref',
    noindex: true,
  },
  templateSurf: {
    title: 'Bord d\'eau — École de surf à La Réunion | Template 9site4',
    description:
      'Bord d\'Eau (fictif) — initiation et perfectionnement, spots sûrs, matériel inclus. Démo 9site4 : votre site école de surf sera adapté à vos cours.',
    canonical: '/templates/surf',
    noindex: true,
  },
  templateFleuriste: {
    title: 'Frangipane — Atelier floral à La Réunion | Template 9site4',
    description:
      'Frangipane (fictif) — compositions de saison, mariage et événementiel, abonnement bureau. Démo 9site4 : votre site fleuriste sera adapté à votre atelier.',
    canonical: '/templates/fleuriste',
    noindex: true,
  },
  templateTatoueur: {
    title: 'Encre Volcan — Studio de tatouage à La Réunion | Template 9site4',
    description:
      'Encre Volcan (fictif) — blackwork, lettering, floral, old-school, 3 encreurs résidents. Démo 9site4 : votre site studio de tatouage sera adapté à vos styles.',
    canonical: '/templates/tatoueur',
    noindex: true,
  },
  templateNaturopathe: {
    title: 'Source — Naturopathie à La Réunion | Template 9site4',
    description:
      'Source (fictif) — fatigue, sommeil, digestion, stress, méthode FENA en 4 étapes. Démo 9site4 : votre site naturopathe sera adapté à votre approche.',
    canonical: '/templates/naturopathe',
    noindex: true,
  },
  templateCreche: {
    title: 'Le Nid — Micro-crèche à La Réunion | Template 9site4',
    description:
      'Le Nid (fictif) — pédagogie Montessori, équipe diplômée, 7h-19h, jardin sécurisé. Démo 9site4 : votre site micro-crèche sera adapté à votre projet.',
    canonical: '/templates/creche',
    noindex: true,
  },
  templateNotaire: {
    title: 'Étude Notariale & Associés — Notaires à La Réunion | Template 9site4',
    description:
      'Étude Notariale (fictif) — famille, succession, immobilier, sociétés, frais transparents. Démo 9site4 : votre site notaire sera adapté à vos domaines.',
    canonical: '/templates/notaire',
    noindex: true,
  },
  templateStudioAudio: {
    title: 'Onde — Studio d\'enregistrement à La Réunion | Template 9site4',
    description:
      'Onde (fictif) — enregistrement, mixage, mastering streaming, SSL/Pro Tools, ingés résidents. Démo 9site4 : votre site studio sera adapté à vos prestations.',
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
