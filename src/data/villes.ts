/**
 * Référentiel des principales villes de La Réunion couvertes par 9site4
 * pour la longue traîne SEO locale ("création site internet [ville]").
 * Données factuelles : populations indicatives (ordres de grandeur INSEE),
 * micro-régions et codes postaux officiels.
 */

export interface VilleInfo {
  slug: string;
  nom: string;
  nomComplet: string;
  code: string;
  microRegion: 'Nord' | 'Ouest' | 'Sud' | 'Est';
  habitants: number;
  activitesDominantes: string[];
  /** slugs des pages SEO métiers qui résonnent localement (sans le préfixe /site-internet-…-la-reunion) */
  secteursPertinents: SecteurSlug[];
  /** slugs d'autres villes (clé `slug` du même fichier) pour maillage géographique */
  villesProches: string[];
  descriptionCourte: string;
  contextEconomique: string;
}

export type SecteurSlug =
  | 'restaurant'
  | 'artisan'
  | 'coiffeur'
  | 'institut-beaute'
  | 'gite-location'
  | 'profession-liberale'
  | 'coach-independant'
  | 'commerce-local'
  | 'tpe-pme'
  | 'bien-etre-sante';

export const SECTEURS_LABELS: Record<SecteurSlug, { label: string; desc: string }> = {
  restaurant: { label: 'Restaurants, snacks et bars', desc: 'Carte, horaires, réservation ou commande WhatsApp.' },
  artisan: { label: 'Artisans et entreprises locales', desc: 'Prestations, zones, demandes de devis, photos chantiers.' },
  coiffeur: { label: 'Salons de coiffure et barbiers', desc: 'Prestations, équipe, prise de rendez-vous.' },
  'institut-beaute': { label: 'Instituts, spas et bien-être', desc: 'Soins, cartes cadeaux, réservation en ligne.' },
  'gite-location': { label: 'Gîtes et locations saisonnières', desc: 'Présentation, calendrier, demande de séjour.' },
  'profession-liberale': { label: 'Professions libérales', desc: 'Avocats, notaires, comptables, consultants, architectes.' },
  'coach-independant': { label: 'Coachs et indépendants', desc: 'Offres, programmes, premier échange.' },
  'commerce-local': { label: 'Commerces locaux', desc: "Présentation de l'activité, horaires, contact, infos pratiques." },
  'tpe-pme': { label: 'TPE et PME', desc: 'Site clair, fiable, adapté à votre métier.' },
  'bien-etre-sante': { label: 'Bien-être et santé', desc: 'Ostéo, naturo, diététicien, yoga, sport, RDV en ligne.' },
};

export const villes: VilleInfo[] = [
  {
    slug: 'saint-denis',
    nom: 'Saint-Denis',
    nomComplet: 'Saint-Denis de La Réunion',
    code: '97400',
    microRegion: 'Nord',
    habitants: 150000,
    activitesDominantes: ['administration', 'services', 'commerce', 'professions libérales'],
    secteursPertinents: ['profession-liberale', 'tpe-pme', 'commerce-local', 'restaurant', 'coiffeur', 'bien-etre-sante', 'coach-independant', 'institut-beaute'],
    villesProches: ['saint-paul', 'saint-andre', 'saint-benoit'],
    descriptionCourte: 'Préfecture de La Réunion et principal pôle administratif et tertiaire de l\'île.',
    contextEconomique:
      "Préfecture du département, Saint-Denis concentre l'administration, les sièges d'entreprises, les cabinets libéraux et un tissu dense de commerces de centre-ville. La demande locale est forte sur les services aux professionnels, la restauration, les soins et les métiers de conseil.",
  },
  {
    slug: 'saint-paul',
    nom: 'Saint-Paul',
    nomComplet: 'Saint-Paul (Ouest)',
    code: '97460',
    microRegion: 'Ouest',
    habitants: 105000,
    activitesDominantes: ['tourisme', 'commerce', 'services', 'restauration'],
    secteursPertinents: ['gite-location', 'restaurant', 'institut-beaute', 'commerce-local', 'tpe-pme', 'artisan', 'coiffeur', 'bien-etre-sante'],
    villesProches: ['saint-denis', 'saint-louis', 'saint-pierre'],
    descriptionCourte: 'Plus grande commune de l\'île en superficie, deuxième ville côté Ouest, à dominante touristique et résidentielle.',
    contextEconomique:
      "Saint-Paul couvre la côte Ouest, de Saint-Gilles à la Possession. L'économie locale est portée par le tourisme balnéaire, les hébergements, la restauration, les commerces de proximité et un fort tissu d'artisans installés sur les quartiers résidentiels.",
  },
  {
    slug: 'saint-pierre',
    nom: 'Saint-Pierre',
    nomComplet: 'Saint-Pierre (Sud)',
    code: '97410',
    microRegion: 'Sud',
    habitants: 85000,
    activitesDominantes: ['commerce', 'services', 'tourisme', 'restauration'],
    secteursPertinents: ['restaurant', 'commerce-local', 'institut-beaute', 'tpe-pme', 'profession-liberale', 'coiffeur', 'coach-independant', 'bien-etre-sante'],
    villesProches: ['le-tampon', 'saint-louis', 'saint-joseph'],
    descriptionCourte: 'Sous-préfecture du Sud et principale ville de la côte sud de La Réunion.',
    contextEconomique:
      "Sous-préfecture, Saint-Pierre joue le rôle de capitale économique du Sud. Centre-ville commerçant, front de mer animé, marché forain, restauration dense et services aux professionnels structurent l'activité, avec une clientèle qui draine tout le bassin sud.",
  },
  {
    slug: 'le-tampon',
    nom: 'Le Tampon',
    nomComplet: 'Le Tampon (Sud, Hauts)',
    code: '97430',
    microRegion: 'Sud',
    habitants: 80000,
    activitesDominantes: ['agriculture', 'artisanat', 'services', 'commerce'],
    secteursPertinents: ['artisan', 'tpe-pme', 'commerce-local', 'restaurant', 'bien-etre-sante', 'coach-independant', 'coiffeur', 'profession-liberale'],
    villesProches: ['saint-pierre', 'saint-joseph', 'saint-louis'],
    descriptionCourte: 'Ville étendue des Hauts du Sud, avec un fort ancrage agricole et artisanal.',
    contextEconomique:
      "Le Tampon s'étire des plaines aux Hauts. L'activité y est portée par l'agriculture, l'élevage, un tissu dense d'artisans du bâtiment et de services à la personne, ainsi que des commerces de proximité répartis sur les nombreux quartiers de la commune.",
  },
  {
    slug: 'saint-andre',
    nom: 'Saint-André',
    nomComplet: 'Saint-André (Est)',
    code: '97440',
    microRegion: 'Est',
    habitants: 58000,
    activitesDominantes: ['agriculture', 'commerce', 'industrie', 'artisanat'],
    secteursPertinents: ['artisan', 'commerce-local', 'tpe-pme', 'restaurant', 'coiffeur', 'institut-beaute', 'coach-independant', 'bien-etre-sante'],
    villesProches: ['saint-benoit', 'saint-denis'],
    descriptionCourte: 'Principale ville de l\'Est, marquée par la canne à sucre et une forte tradition artisanale.',
    contextEconomique:
      "Saint-André reste un pôle agricole majeur (canne, fruits) doublé d'une zone d'activité industrielle et artisanale. Le centre-ville et les quartiers concentrent commerces de proximité, restauration locale et services aux habitants.",
  },
  {
    slug: 'saint-louis',
    nom: 'Saint-Louis',
    nomComplet: 'Saint-Louis (Sud)',
    code: '97450',
    microRegion: 'Sud',
    habitants: 53000,
    activitesDominantes: ['commerce', 'services', 'agriculture', 'artisanat'],
    secteursPertinents: ['commerce-local', 'artisan', 'tpe-pme', 'restaurant', 'coiffeur', 'profession-liberale', 'bien-etre-sante', 'coach-independant'],
    villesProches: ['saint-pierre', 'le-tampon', 'saint-paul'],
    descriptionCourte: 'Carrefour entre l\'Ouest et le Sud, ancrée sur la canne à sucre et le commerce local.',
    contextEconomique:
      "Saint-Louis articule le Sud et l'Ouest. L'économie repose sur l'agriculture (canne, sucrerie du Gol), les commerces, les services et un réseau d'artisans actifs sur la commune et les bassins voisins.",
  },
  {
    slug: 'saint-benoit',
    nom: 'Saint-Benoît',
    nomComplet: 'Saint-Benoît (Est)',
    code: '97470',
    microRegion: 'Est',
    habitants: 37000,
    activitesDominantes: ['services', 'tourisme', 'agriculture', 'administration'],
    secteursPertinents: ['tpe-pme', 'restaurant', 'gite-location', 'artisan', 'commerce-local', 'profession-liberale', 'coiffeur', 'bien-etre-sante'],
    villesProches: ['saint-andre', 'saint-denis'],
    descriptionCourte: 'Sous-préfecture de l\'Est, porte d\'entrée vers les cirques et le volcan côté est.',
    contextEconomique:
      "Sous-préfecture de l'Est, Saint-Benoît concentre services administratifs, un tissu artisanal local et une économie touristique liée aux cascades, à la nature et aux activités outdoor de la côte au vent.",
  },
  {
    slug: 'saint-joseph',
    nom: 'Saint-Joseph',
    nomComplet: 'Saint-Joseph (Sud sauvage)',
    code: '97480',
    microRegion: 'Sud',
    habitants: 38000,
    activitesDominantes: ['agriculture', 'pêche', 'tourisme', 'artisanat'],
    secteursPertinents: ['artisan', 'gite-location', 'restaurant', 'tpe-pme', 'commerce-local', 'coach-independant', 'bien-etre-sante', 'coiffeur'],
    villesProches: ['saint-pierre', 'le-tampon'],
    descriptionCourte: 'Ville principale du Sud sauvage, entre océan, ravines et plantations.',
    contextEconomique:
      "Saint-Joseph couvre le Sud sauvage. L'activité économique mêle agriculture (vanille, fruits, élevage), pêche, tourisme nature et artisans installés sur des quartiers étendus, avec un commerce local de proximité.",
  },
];

export function getVille(slug: string): VilleInfo | undefined {
  return villes.find((v) => v.slug === slug);
}
