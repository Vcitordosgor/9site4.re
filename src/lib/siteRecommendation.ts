import realisations from '../data/realisations.json';

export type SectorKey =
  | 'restaurant'
  | 'artisan'
  | 'institut'
  | 'gite'
  | 'profession-liberale'
  | 'coach'
  | 'commerce'
  | 'autre';

export type ContactKey =
  | 'devis'
  | 'reservation'
  | 'rendez-vous'
  | 'information'
  | 'appel-whatsapp'
  | 'inscription';

export type PriorityKey = 'premier-site' | 'refaire' | 'plus-demandes' | 'mieux-presenter' | 'reservation-rdv' | 'inconnu';

export type PresenceKey = 'aucune' | 'reseaux' | 'google' | 'site' | 'plusieurs';

export type ElementKey =
  | 'prestations'
  | 'tarifs'
  | 'horaires'
  | 'photos'
  | 'zone'
  | 'equipe'
  | 'avis'
  | 'formulaire';

export type UrgencyKey = 'asap' | 'semaines' | 'plus-tard';

export type NextStepKey = 'proposition' | 'diagnostic' | 'realisations' | 'rappel';

export interface Answers {
  secteur: SectorKey;
  priorite: PriorityKey;
  contact: ContactKey;
  presence: PresenceKey;
  elements: ElementKey[];
  urgence: UrgencyKey;
  suite: NextStepKey;
}

export interface Recommendation {
  profile: string;
  recommendedSiteType: string;
  recommendedModule: string;
  priority: 'Haute' | 'Moyenne' | 'Basse';
  explanation: string;
  suggestedPages: string[];
  suggestedCTAs: string[];
  matchingRealisationSlugs: string[];
  recommendedNextStep: string;
}

export const SECTEUR_LABELS: Record<SectorKey, string> = {
  restaurant: 'Restaurant / snack / café',
  artisan: 'Artisan / BTP',
  institut: 'Institut / beauté / bien-être',
  gite: 'Gîte / location / tourisme',
  'profession-liberale': 'Profession libérale',
  coach: 'Coach / indépendant',
  commerce: 'Commerce local',
  autre: 'Autre activité',
};

export const PRIORITE_LABELS: Record<PriorityKey, string> = {
  'premier-site': 'Créer mon premier site',
  refaire: 'Refaire un site existant',
  'plus-demandes': 'Recevoir plus de demandes',
  'mieux-presenter': 'Mieux présenter mes prestations',
  'reservation-rdv': 'Faciliter les réservations ou rendez-vous',
  inconnu: 'Je ne sais pas encore',
};

export const CONTACT_LABELS: Record<ContactKey, string> = {
  devis: 'Demande de devis',
  reservation: 'Réservation',
  'rendez-vous': 'Prise de rendez-vous',
  information: "Demande d'information",
  'appel-whatsapp': 'Appel / WhatsApp',
  inscription: 'Inscription / premier échange',
};

export const PRESENCE_LABELS: Record<PresenceKey, string> = {
  aucune: 'Non, pas encore',
  reseaux: 'Oui, Instagram / Facebook',
  google: 'Oui, fiche Google',
  site: 'Oui, site internet',
  plusieurs: 'Oui, plusieurs supports',
};

export const ELEMENT_LABELS: Record<ElementKey, string> = {
  prestations: 'Prestations',
  tarifs: 'Tarifs',
  horaires: 'Horaires',
  photos: 'Photos',
  zone: "Zone d'intervention",
  equipe: 'Équipe / parcours',
  avis: 'Avis / preuves',
  formulaire: 'Formulaire de contact',
};

export const URGENCE_LABELS: Record<UrgencyKey, string> = {
  asap: 'Dès que possible',
  semaines: 'Dans les prochaines semaines',
  'plus-tard': 'Je me renseigne pour plus tard',
};

export const SUITE_LABELS: Record<NextStepKey, string> = {
  proposition: 'Recevoir une proposition',
  diagnostic: 'Demander un diagnostic gratuit',
  realisations: 'Voir des réalisations proches',
  rappel: 'Être rappelé',
};

const SECTOR_TO_REALISATION_SECTORS: Record<SectorKey, string[]> = {
  restaurant: ['Restauration & alimentation'],
  artisan: ['Artisans & BTP'],
  institut: ['Beauté & bien-être'],
  gite: ['Tourisme & loisirs'],
  'profession-liberale': ['Services aux professionnels'],
  coach: ['Sport & coaching', 'Santé & paramédical'],
  commerce: ['Services aux particuliers', 'Restauration & alimentation'],
  autre: [],
};

const PROFILES: Record<
  SectorKey,
  {
    profile: string;
    recommendedSiteType: string;
    recommendedModule: string;
    explanation: string;
    suggestedPages: string[];
    suggestedCTAs: string[];
  }
> = {
  restaurant: {
    profile: 'Restaurant, snack ou café',
    recommendedSiteType: 'Site vitrine avec module de réservation',
    recommendedModule: 'Réservation en ligne',
    explanation:
      'Un site clair qui met en avant votre carte, vos horaires et votre ambiance, avec une réservation directe pour faciliter la venue de vos clients.',
    suggestedPages: ['Accueil', 'Carte', 'Réservation', 'Accès', 'Contact'],
    suggestedCTAs: ['Réserver une table', 'Voir la carte', 'Nous appeler'],
  },
  artisan: {
    profile: 'Artisan ou entreprise du BTP',
    recommendedSiteType: 'Site vitrine avec module de demande de devis',
    recommendedModule: 'Demande de devis',
    explanation:
      "Un site qui présente vos prestations, vos zones d'intervention et vos réalisations, avec un formulaire de devis clair pour qualifier les demandes.",
    suggestedPages: ['Accueil', 'Prestations', 'Réalisations', "Zone d'intervention", 'Contact'],
    suggestedCTAs: ['Demander un devis', 'Voir mes réalisations', 'Nous appeler'],
  },
  institut: {
    profile: 'Institut, salon ou praticien bien-être',
    recommendedSiteType: 'Site vitrine avec module de prise de rendez-vous',
    recommendedModule: 'Prise de rendez-vous',
    explanation:
      'Un site qui valorise vos soins, votre univers et vos tarifs, avec une prise de rendez-vous fluide depuis le téléphone.',
    suggestedPages: ['Accueil', 'Soins', 'Tarifs', 'Rendez-vous', 'Contact'],
    suggestedCTAs: ['Prendre rendez-vous', 'Voir les soins', 'Carte cadeau'],
  },
  gite: {
    profile: 'Gîte, location saisonnière ou activité touristique',
    recommendedSiteType: 'Site vitrine avec module de demande de séjour',
    recommendedModule: 'Demande de séjour',
    explanation:
      "Un site qui met en valeur votre hébergement, son cadre et ses équipements, avec une demande de séjour simple et un calendrier de disponibilités lisible.",
    suggestedPages: ['Accueil', 'Hébergement', 'Équipements', 'Disponibilités', 'Contact'],
    suggestedCTAs: ['Demander un séjour', 'Voir les disponibilités', 'Nous écrire'],
  },
  'profession-liberale': {
    profile: 'Profession libérale',
    recommendedSiteType: 'Site vitrine avec module de prise de rendez-vous',
    recommendedModule: 'Prise de rendez-vous',
    explanation:
      "Un site sobre et rassurant qui présente votre cabinet, vos domaines d'intervention et facilite la prise de rendez-vous.",
    suggestedPages: ['Accueil', 'Cabinet', "Domaines d'intervention", 'Infos pratiques', 'Contact'],
    suggestedCTAs: ['Prendre rendez-vous', 'Découvrir le cabinet', 'Nous contacter'],
  },
  coach: {
    profile: 'Coach ou indépendant',
    recommendedSiteType: 'Site vitrine avec module de premier échange',
    recommendedModule: 'Premier échange',
    explanation:
      'Un site qui présente votre approche, vos offres et votre parcours, avec un point de contact direct pour un premier échange qualifié.',
    suggestedPages: ['Accueil', 'Accompagnement', 'Programmes', 'Parcours', 'Contact'],
    suggestedCTAs: ['Réserver un premier échange', 'Voir les programmes', 'En savoir plus'],
  },
  commerce: {
    profile: 'Commerce local',
    recommendedSiteType: 'Site vitrine avec module de contact',
    recommendedModule: 'Contact / demande d\'information',
    explanation:
      "Un site qui valorise votre activité, vos produits, vos horaires et votre localisation, avec un module de contact simple pour les demandes d'information.",
    suggestedPages: ['Accueil', 'Produits', 'Horaires', 'Localisation', 'Contact'],
    suggestedCTAs: ['Nous contacter', 'Voir les produits', "S'y rendre"],
  },
  autre: {
    profile: 'Activité professionnelle',
    recommendedSiteType: 'Site vitrine professionnel avec module de contact adaptable',
    recommendedModule: 'Contact adapté à votre activité',
    explanation:
      'Un site vitrine professionnel structuré autour de votre activité, avec un module de contact adapté à votre besoin réel (devis, RDV, information).',
    suggestedPages: ['Accueil', 'Activité', 'Prestations', 'Infos pratiques', 'Contact'],
    suggestedCTAs: ['Nous contacter', 'En savoir plus', 'Demander une proposition'],
  },
};

function urgencyToPriority(urg: UrgencyKey): 'Haute' | 'Moyenne' | 'Basse' {
  if (urg === 'asap') return 'Haute';
  if (urg === 'semaines') return 'Moyenne';
  return 'Basse';
}

function pickRealisationSlugs(secteur: SectorKey): string[] {
  const sectors = SECTOR_TO_REALISATION_SECTORS[secteur] ?? [];
  const matched = (realisations as Array<{ slug: string; sector: string }>)
    .filter((r) => sectors.includes(r.sector))
    .map((r) => r.slug);
  if (matched.length >= 3) return matched.slice(0, 3);
  const fallback = (realisations as Array<{ slug: string }>)
    .map((r) => r.slug)
    .filter((s) => !matched.includes(s));
  return [...matched, ...fallback].slice(0, 3);
}

export function getRecommendation(answers: Answers): Recommendation {
  const base = PROFILES[answers.secteur] ?? PROFILES.autre;
  const priority = urgencyToPriority(answers.urgence);
  const nextStep = SUITE_LABELS[answers.suite] ?? SUITE_LABELS.proposition;

  return {
    profile: base.profile,
    recommendedSiteType: base.recommendedSiteType,
    recommendedModule: base.recommendedModule,
    priority,
    explanation: base.explanation,
    suggestedPages: base.suggestedPages,
    suggestedCTAs: base.suggestedCTAs,
    matchingRealisationSlugs: pickRealisationSlugs(answers.secteur),
    recommendedNextStep: nextStep,
  };
}
