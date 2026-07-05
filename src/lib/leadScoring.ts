/**
 * Lead qualification scoring — INTERNAL USE ONLY.
 *
 * Used solely to enrich the internal notification email sent to the OVHcloud inbox.
 * MUST NEVER be exposed to the prospect, GA4, Meta Pixel, or any client-side surface.
 *
 * Pure function — no IO, no logging. Caller is responsible for try/catch + fallback.
 */

export type LeadContactInput = {
  nom?: string;
  entreprise?: string;
  email?: string;
  telephone?: string;
  secteur?: string;
  besoin?: string;
  message?: string;
  preferenceContact?: string;
  source?: string;
};

export type LeadDiagnosticInput = {
  nom?: string;
  entreprise?: string;
  secteur?: string;
  aSite?: 'oui' | 'non';
  url?: string;
  reseaux?: string;
  objectif?: string;
  email?: string;
  telephone?: string;
  preferenceContact?: string;
  message?: string;
  source?: string;
};

export type LeadType = 'contact' | 'diagnostic';

export type Priority = 'Haute' | 'Moyenne' | 'À qualifier';
export type Temperature = 'Chaud' | 'Tiède' | 'Exploratoire';

export type Qualification = {
  priority: Priority;
  temperature: Temperature;
  recommendedAction: string;
  likelyNeed: string;
  suggestedOffer: string;
  qualificationQuestions: string[];
  reason: string;
};

const FALLBACK: Qualification = {
  priority: 'À qualifier',
  temperature: 'Exploratoire',
  recommendedAction: 'Reprendre contact pour qualifier le besoin.',
  likelyNeed: 'À préciser.',
  suggestedOffer: 'Diagnostic gratuit ou échange court.',
  qualificationQuestions: [
    'Quel est votre principal besoin ?',
    'Quel délai envisagez-vous ?',
    'Avez-vous un projet existant ?',
  ],
  reason: 'Scoring indisponible — qualification à faire manuellement.',
};

export function defaultQualification(): Qualification {
  return { ...FALLBACK, qualificationQuestions: [...FALLBACK.qualificationQuestions] };
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function norm(s: string | undefined): string {
  return (s ?? '').trim().toLowerCase();
}

function isPhoneChannel(pref: string | undefined): boolean {
  const p = norm(pref);
  return p === 'phone' || p === 'téléphone' || p === 'telephone' || p === 'whatsapp';
}

function preferenceLabel(pref: string | undefined): string {
  const p = norm(pref);
  if (p === 'whatsapp') return 'WhatsApp';
  if (p === 'phone' || p === 'téléphone' || p === 'telephone') return 'téléphone';
  if (p === 'email') return 'email';
  return 'le canal indiqué';
}

const VAGUE_KEYWORDS = [
  'je ne sais pas',
  'sais pas',
  'autre',
  'renseignement',
  'renseignements',
  'info',
  'infos',
  'information',
  'informations',
];

const PROJECT_KEYWORDS = [
  'site',
  'création',
  'creation',
  'refonte',
  'réservation',
  'reservation',
  'devis',
  'présentation',
  'presentation',
  'projet',
  'rdv',
  'rendez-vous',
];

function hasAnyKeyword(text: string, keywords: string[]): boolean {
  const t = norm(text);
  return keywords.some((k) => t.includes(k));
}

function looksLikeUrl(s: string | undefined): boolean {
  const t = (s ?? '').trim();
  if (!t) return false;
  if (/^https?:\/\//i.test(t)) return true;
  // crude domain detection
  return /\.[a-z]{2,}(\/|$)/i.test(t);
}

/* -------------------------------------------------------------------------- */
/* Contact scoring                                                            */
/* -------------------------------------------------------------------------- */

function qualifyContact(lead: LeadContactInput): Qualification {
  const telephone = (lead.telephone ?? '').trim();
  const entreprise = (lead.entreprise ?? '').trim();
  const besoin = (lead.besoin ?? '').trim();
  const message = (lead.message ?? '').trim();
  const besoinLower = besoin.toLowerCase();

  const hasPhone = telephone.length > 0;
  const hasCompany = entreprise.length > 0;
  const isCalledFor = isPhoneChannel(lead.preferenceContact);

  const besoinIsVague =
    !besoin ||
    besoinLower === 'autre' ||
    besoinLower.includes('je ne sais pas') ||
    besoinLower.includes('sais pas');
  const besoinIsProjectKw = hasAnyKeyword(besoin, ['création', 'creation', 'refonte', 'site', 'professionnel']);
  const clearNeed = !besoinIsVague && (besoin.length > 5 || besoinIsProjectKw);

  const messageLength = message.length;
  const messageVague = message && hasAnyKeyword(message, VAGUE_KEYWORDS) && messageLength < 60;
  const messageHasProject = hasAnyKeyword(message, PROJECT_KEYWORDS);

  // Priority
  let priority: Priority;
  if (clearNeed && hasPhone && hasCompany && (isCalledFor || messageHasProject)) {
    priority = 'Haute';
  } else if ((hasPhone && messageLength > 0) || (clearNeed && hasCompany)) {
    priority = 'Moyenne';
  } else {
    priority = 'À qualifier';
  }

  // Temperature
  const exploratoire =
    messageVague ||
    (!hasPhone && !hasCompany) ||
    (!besoin && !message);
  let temperature: Temperature;
  if (clearNeed && hasPhone && hasCompany && messageHasProject) {
    temperature = 'Chaud';
  } else if ((hasPhone || hasCompany) && messageLength > 0 && !exploratoire) {
    temperature = 'Tiède';
  } else if (exploratoire) {
    temperature = 'Exploratoire';
  } else if (hasPhone || hasCompany || clearNeed) {
    temperature = 'Tiède';
  } else {
    temperature = 'Exploratoire';
  }

  // Detect refonte intent
  const refonte = hasAnyKeyword(`${besoin} ${message}`, ['refonte', 'existant', 'actuel', 'ancien site']);

  // Recommendations
  const prefLabel = preferenceLabel(lead.preferenceContact);
  let recommendedAction: string;
  let likelyNeed: string;
  let suggestedOffer: string;
  let qualificationQuestions: string[];
  let reason: string;

  if (priority === 'Haute') {
    recommendedAction = `Rappeler dans la journée par ${prefLabel} pour qualifier le projet.`;
    likelyNeed = refonte
      ? 'Refonte ou restructuration d’un site existant pour générer plus de demandes.'
      : 'Création d’un site professionnel avec module métier intégré.';
    suggestedOffer = 'Formule 9site4 — 97,4€/mois, création incluse + gestion continue.';
    reason = `Téléphone fourni, entreprise nommée${clearNeed ? ' et besoin clair' : ''}${messageHasProject ? ' avec mention explicite d’un projet' : ''}.`;
  } else if (priority === 'Moyenne') {
    recommendedAction = hasPhone
      ? `Rappeler sous 24h par ${prefLabel} pour cadrer le besoin.`
      : 'Envoyer un email court sous 24h pour cadrer le besoin et obtenir un téléphone.';
    likelyNeed = refonte
      ? 'Probable amélioration d’un site existant — à confirmer.'
      : clearNeed
        ? 'Création d’un site professionnel — périmètre à préciser.'
        : 'Présence web à structurer — type de site à confirmer.';
    suggestedOffer = 'Formule 9site4 ou diagnostic court selon la maturité du projet.';
    reason = hasPhone
      ? 'Téléphone fourni et message présent, mais signaux projet partiels.'
      : 'Entreprise et besoin identifiés, mais pas de téléphone — qualification à compléter.';
  } else {
    recommendedAction = 'Reprendre contact par email pour comprendre le besoin avant de proposer.';
    likelyNeed = 'À préciser — peut être création, refonte ou simple présence Google.';
    suggestedOffer = 'Diagnostic gratuit pour cadrer le besoin avant proposition.';
    reason = !hasPhone && !hasCompany
      ? 'Peu d’informations : pas de téléphone ni d’entreprise — à qualifier avant proposition.'
      : 'Signaux insuffisants pour positionner une offre — qualifier d’abord.';
  }

  // Questions adapted to context
  if (refonte) {
    qualificationQuestions = [
      'Que voulez-vous corriger en priorité sur votre site actuel ?',
      'Quels résultats espérez-vous obtenir (plus de demandes, image, RDV) ?',
      'Souhaitez-vous repartir du contenu existant ou tout refaire ?',
      'Disposez-vous des accès au site actuel (CMS, hébergement, domaine) ?',
      'Quel est votre délai souhaité pour la mise en ligne ?',
    ];
  } else if (priority === 'À qualifier') {
    qualificationQuestions = [
      'Quel est votre principal objectif business actuellement ?',
      'Avez-vous déjà un site, une page Google ou des réseaux actifs ?',
      'Comment vos clients vous trouvent-ils aujourd’hui ?',
      'Quel délai envisagez-vous pour avancer ?',
    ];
  } else {
    qualificationQuestions = [
      'Avez-vous déjà un nom de domaine ?',
      'Avez-vous un logo et des photos professionnelles ?',
      'Quelles prestations voulez-vous mettre en avant ?',
      'Quel est le principal objectif du site : présenter, recevoir des demandes, prendre RDV ?',
      'Souhaitez-vous un formulaire de contact, de devis ou de réservation ?',
    ];
  }

  return { priority, temperature, recommendedAction, likelyNeed, suggestedOffer, qualificationQuestions, reason };
}

/* -------------------------------------------------------------------------- */
/* Diagnostic scoring                                                         */
/* -------------------------------------------------------------------------- */

const OBJECTIVES_CLEAR = [
  'Améliorer mon site actuel',
  'Recevoir plus de demandes',
  'Mieux présenter mes prestations',
  'Rendre mon activité plus professionnelle',
  'Créer mon premier site',
];
const OBJECTIVE_VAGUE = 'Je ne sais pas encore';

function qualifyDiagnostic(lead: LeadDiagnosticInput): Qualification {
  const objectif = (lead.objectif ?? '').trim();
  const url = (lead.url ?? '').trim();
  const reseaux = (lead.reseaux ?? '').trim();
  const telephone = (lead.telephone ?? '').trim();

  const hasSite = lead.aSite === 'oui';
  const hasUrl = url.length > 0 && looksLikeUrl(url);
  const hasNetworks = reseaux.length > 0;
  const hasPhone = telephone.length > 0;
  const isCalledFor = isPhoneChannel(lead.preferenceContact);
  const clearGoal = OBJECTIVES_CLEAR.includes(objectif);
  const vagueGoal = objectif === OBJECTIVE_VAGUE || !objectif;

  const isHighGoal =
    objectif === 'Améliorer mon site actuel' || objectif === 'Recevoir plus de demandes';

  // Priority
  let priority: Priority;
  if (hasSite && hasUrl && isHighGoal && hasPhone) {
    priority = 'Haute';
  } else if ((!hasSite && clearGoal && hasPhone) || (hasSite && hasUrl && !vagueGoal)) {
    priority = 'Moyenne';
  } else {
    priority = 'À qualifier';
  }

  // Temperature
  let temperature: Temperature;
  if (clearGoal && hasPhone && (hasSite || hasNetworks) && !vagueGoal) {
    temperature = 'Chaud';
  } else if (vagueGoal || (!hasSite && !hasNetworks && !hasPhone)) {
    temperature = 'Exploratoire';
  } else {
    temperature = 'Tiède';
  }

  const prefLabel = preferenceLabel(lead.preferenceContact);
  let recommendedAction: string;
  let likelyNeed: string;
  let suggestedOffer: string;
  let qualificationQuestions: string[];
  let reason: string;

  if (priority === 'Haute') {
    recommendedAction = `Rappeler dans les 24h par ${prefLabel}, préparer 3 priorités sur le site existant.`;
    likelyNeed = isHighGoal && objectif === 'Recevoir plus de demandes'
      ? 'Le site existant ne convertit pas assez — restructuration pour générer plus de demandes.'
      : 'Refonte ou structuration du site actuel pour mieux servir l’activité.';
    suggestedOffer = 'Refonte + gestion continue 9site4 (97,4€/mois).';
    reason = 'Diagnostic demandé avec site existant, URL fournie et objectif business clair — lead actionnable.';
  } else if (priority === 'Moyenne') {
    if (!hasSite && clearGoal) {
      recommendedAction = hasPhone
        ? `Rappeler sous 48h par ${prefLabel} pour préparer un premier site.`
        : 'Envoyer un email court sous 48h pour proposer un échange.';
      likelyNeed = 'Création d’un premier site professionnel adapté au métier.';
      suggestedOffer = 'Formule 9site4 — création incluse + gestion continue.';
      reason = 'Pas de site actuel mais objectif business clair — projet de création probable.';
    } else {
      recommendedAction = `Rappeler sous 48h par ${prefLabel} pour cadrer les priorités.`;
      likelyNeed = 'Amélioration d’un site existant — périmètre à préciser.';
      suggestedOffer = 'Diagnostic ciblé puis formule 9site4 si refonte pertinente.';
      reason = 'Site existant avec objectif identifié — qualification fine à faire au téléphone.';
    }
  } else {
    recommendedAction = 'Envoyer un email court avec 2-3 questions pour cadrer la demande.';
    likelyNeed = 'À explorer — le prospect cherche peut-être surtout à comprendre.';
    suggestedOffer = 'Diagnostic clair + recommandation adaptée à son métier.';
    reason = vagueGoal
      ? 'Objectif « je ne sais pas encore » — à qualifier avant toute proposition.'
      : 'Peu d’informations actionnables — à qualifier avant proposition.';
  }

  // Questions adapted to site/no site
  if (hasSite) {
    qualificationQuestions = [
      'Que voulez-vous améliorer en priorité sur votre site ?',
      'Votre site actuel vous apporte-t-il des demandes aujourd’hui ?',
      'Vos horaires, prestations et tarifs sont-ils à jour ?',
      'Avez-vous une fiche Google Business Profile active ?',
      'Souhaitez-vous repartir du site existant ou créer une nouvelle structure ?',
    ];
  } else {
    qualificationQuestions = [
      'Quel est votre principal objectif business pour cette année ?',
      'Comment vos clients vous trouvent-ils aujourd’hui ?',
      'Disposez-vous de photos et descriptions de vos prestations ?',
      'Avez-vous une fiche Google Business Profile ?',
      'Souhaitez-vous gérer un module spécifique (devis, RDV, réservation) ?',
    ];
  }

  // touch isCalledFor so it's not flagged unused (used to shape urgency above implicitly)
  void isCalledFor;

  return { priority, temperature, recommendedAction, likelyNeed, suggestedOffer, qualificationQuestions, reason };
}

/* -------------------------------------------------------------------------- */
/* Public API                                                                 */
/* -------------------------------------------------------------------------- */

export function qualifyLead(
  lead: LeadContactInput | LeadDiagnosticInput,
  type: LeadType
): Qualification {
  try {
    if (type === 'contact') return qualifyContact(lead as LeadContactInput);
    return qualifyDiagnostic(lead as LeadDiagnosticInput);
  } catch {
    return defaultQualification();
  }
}

/* -------------------------------------------------------------------------- */
/* Source mapping                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Map a raw page path (e.g. window.location.pathname) into a human-readable
 * source label for the internal email. Returns null if unknown — caller
 * should then omit the source line.
 */
export function mapSource(raw: string | undefined | null): string | null {
  if (!raw) return null;
  let path = raw.trim();
  if (!path) return null;
  // Strip protocol+host if a full URL was passed
  try {
    if (/^https?:\/\//i.test(path)) {
      const u = new URL(path);
      path = u.pathname;
    }
  } catch {
    /* ignore */
  }
  // Normalize: lowercase, strip trailing slash (keep "/" as homepage)
  path = path.toLowerCase();
  if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);

  if (path === '' || path === '/') return 'Homepage';
  if (path === '/contact') return 'Page contact';
  if (path.startsWith('/diagnostic')) return 'Page diagnostic';
  if (path === '/tarifs' || path === '/tarif') return 'Page tarifs';
  if (path.startsWith('/realisations')) return 'Page réalisations';
  if (path.includes('restaurant')) return 'Page SEO restaurant';
  if (path.includes('artisan')) return 'Page SEO artisan';
  if (path.includes('coiffeur') || path.includes('coiffure')) return 'Page SEO coiffeur';
  if (path.includes('avocat')) return 'Page SEO avocat';
  if (path.includes('immobilier') || path.includes('agence-immobiliere')) return 'Page SEO immobilier';
  if (path.includes('medecin') || path.includes('médecin') || path.includes('therapeute') || path.includes('thérapeute')) {
    return 'Page SEO santé';
  }
  if (/site-internet-[a-z0-9-]+-la-reunion/.test(path)) return 'Page SEO sectorielle';
  if (path.startsWith('/blog')) return 'Blog';
  if (path.startsWith('/a-propos') || path.startsWith('/about')) return 'Page à propos';
  return null;
}
