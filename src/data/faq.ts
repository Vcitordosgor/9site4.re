/**
 * Centre d'aide 9site4 — source unique de vérité pour les questions fréquentes.
 *
 * - `faqCategories` : catégories ordonnées, utilisées pour la nav d'ancres et le regroupement.
 * - `faqItems` : questions/réponses. Le champ `showOnPages` indique sur quelles pages
 *   stratégiques l'item peut être réutilisé via un snippet (FAQAccordion filtré).
 *
 * Règles de ton : professionnel, sobre, concret, rassurant, sans jargon,
 * sans promesse abusive (jamais "première place Google"), pas de chiffres inventés.
 *
 * Le schéma JSON-LD FAQPage n'est généré que sur /questions-frequentes/
 * (page dédiée) pour éviter les doublons sur les pages snippets.
 */

export interface FaqCategory {
  id: string;
  label: string;
  slug: string;
}

export interface FaqRelatedLink {
  label: string;
  href: string;
}

export type FaqPageKey =
  | 'tarifs'
  | 'diagnostic'
  | 'creation'
  | 'contact'
  | 'trouverSiteAdapte';

export interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  relatedLinks?: FaqRelatedLink[];
  showOnPages?: FaqPageKey[];
}

export const faqCategories: FaqCategory[] = [
  { id: 'offre', label: 'Offre 9site4', slug: 'offre' },
  { id: 'prix', label: 'Prix et engagement', slug: 'prix' },
  { id: 'creation', label: 'Création du site', slug: 'creation' },
  { id: 'gestion', label: 'Gestion continue', slug: 'gestion' },
  { id: 'domaine', label: 'Domaine, hébergement et sécurité', slug: 'domaine' },
  { id: 'modifications', label: 'Modifications', slug: 'modifications' },
  { id: 'realisations', label: 'Réalisations', slug: 'realisations' },
  { id: 'seo', label: 'Visibilité et SEO', slug: 'seo' },
  { id: 'formulaires', label: 'Formulaires et modules métier', slug: 'formulaires' },
  { id: 'diagnostic', label: 'Diagnostic gratuit', slug: 'diagnostic' },
  { id: 'technique', label: 'Technique et accompagnement', slug: 'technique' },
  { id: 'demarrage', label: 'Démarrage', slug: 'demarrage' },
];

export const faqItems: FaqItem[] = [
  // ============================================================
  // OFFRE 9SITE4
  // ============================================================
  {
    id: 'offre-quoi',
    category: 'offre',
    question: "Qu'est-ce que 9site4 ?",
    answer:
      "9site4 est un partenaire web dédié aux professionnels de La Réunion. Nous créons, structurons et gérons des sites internet professionnels dans la durée, avec une offre claire à 97,4€/mois tout inclus : création, design, hébergement, domaine, maintenance, modifications simples et accompagnement local.",
    relatedLinks: [
      { label: 'Voir la formule', href: '/tarifs' },
      { label: 'Nos réalisations', href: '/realisations' },
    ],
  },
  {
    id: 'offre-public',
    category: 'offre',
    question: "À qui s'adresse 9site4 ?",
    answer:
      "9site4 s'adresse aux TPE, PME, artisans, commerçants, indépendants et professions libérales basés à La Réunion qui veulent un site clair, fiable et géré dans la durée, sans avoir à s'occuper de la technique.",
  },
  {
    id: 'offre-pros-974',
    category: 'offre',
    question: "Est-ce adapté aux TPE/PME et professionnels à La Réunion ?",
    answer:
      "Oui. L'offre 9site4 est pensée pour les structures réunionnaises qui n'ont ni service marketing ni temps à consacrer à un site. Nous connaissons le marché local, les codes du 974 et les attentes des clients du Sud, du Nord, de l'Ouest et de l'Est. Accompagnement en français, en euros, avec un interlocuteur joignable.",
  },
  {
    id: 'offre-vs-agence',
    category: 'offre',
    question: "Quelle est la différence avec une agence web classique ?",
    answer:
      "Une agence facture généralement un coût de création élevé puis une maintenance à part. 9site4 propose une formule unique mensuelle qui couvre la création, l'hébergement, la maintenance et les modifications simples — sans frais initiaux ni engagement.",
  },
  {
    id: 'offre-vs-diy',
    category: 'offre',
    question: "Quelle est la différence avec Wix ou WordPress fait soi-même ?",
    answer:
      "Faire son site soi-même demande du temps, des compétences et un suivi technique. Avec 9site4, vous n'avez rien à gérer : structure, design, contenu, mise en ligne, sécurité et évolutions sont pris en charge. Vous récupérez du temps pour votre métier.",
  },

  // ============================================================
  // PRIX ET ENGAGEMENT
  // ============================================================
  {
    id: 'prix-combien',
    category: 'prix',
    question: "Combien coûte un site avec 9site4 ?",
    answer:
      "Deux formules sont proposées : 97,4€/mois sans engagement, ou 974€/an (équivalent à environ deux mois offerts). Tout est inclus, sans surprise.",
    showOnPages: ['tarifs', 'creation'],
    relatedLinks: [{ label: 'Voir le détail des tarifs', href: '/tarifs' }],
  },
  {
    id: 'prix-frais-creation',
    category: 'prix',
    question: "Y a-t-il des frais de création ?",
    answer:
      "Non. La création de votre site est incluse dans la formule. Pas de frais de mise en route, pas de devis initial à régler, pas d'option à activer.",
    showOnPages: ['tarifs', 'creation'],
  },
  {
    id: 'prix-engagement',
    category: 'prix',
    question: "Y a-t-il un engagement de durée ?",
    answer:
      "Non. L'abonnement mensuel à 97,4€/mois est sans engagement. Vous pouvez résilier à tout moment, sans frais ni justification. La formule annuelle est payée d'avance pour 12 mois.",
    showOnPages: ['tarifs', 'contact'],
  },
  {
    id: 'prix-resiliation',
    category: 'prix',
    question: "Puis-je résilier mon abonnement ?",
    answer:
      "Oui. Un simple email ou message WhatsApp suffit pour résilier. Le prélèvement s'arrête le mois suivant. Si vous le souhaitez, vous pouvez récupérer votre nom de domaine pour le conserver ailleurs.",
    showOnPages: ['tarifs'],
  },
  {
    id: 'prix-inclus',
    category: 'prix',
    question: "Que comprend exactement le 97,4€/mois ?",
    answer:
      "La création du site, le design, le module métier (formulaire adapté à votre activité), le nom de domaine, l'hébergement, la sécurité, la maintenance technique, les modifications simples (horaires, textes, photos) et un accompagnement local.",
    showOnPages: ['tarifs', 'creation'],
  },
  {
    id: 'prix-pourquoi-974',
    category: 'prix',
    question: "Pourquoi 97,4€/mois ?",
    answer:
      "Le tarif rend hommage au 974, le code de La Réunion. Au-delà du clin d'œil, il correspond à un coût juste pour une présence web professionnelle complète, qui couvre la création et la gestion continue.",
    showOnPages: ['tarifs'],
  },
  {
    id: 'prix-annuel',
    category: 'prix',
    question: "Comment fonctionne la formule annuelle à 974€/an ?",
    answer:
      "Vous réglez 974€ d'avance pour 12 mois, soit l'équivalent d'environ deux mois offerts par rapport au mensuel. Vous recevez une facture professionnelle conforme à la comptabilité (TVA, mentions légales).",
    showOnPages: ['tarifs'],
  },

  // ============================================================
  // CRÉATION
  // ============================================================
  {
    id: 'creation-delai',
    category: 'creation',
    question: "Quel est le délai pour avoir mon site prêt ?",
    answer:
      "Votre site professionnel est prêt en 7 jours environ, à partir du moment où nous disposons des informations essentielles sur votre activité. Vous restez concentré sur votre métier, nous structurons.",
    showOnPages: ['creation', 'contact'],
  },
  {
    id: 'creation-fournir',
    category: 'creation',
    question: "Que dois-je fournir pour démarrer ?",
    answer:
      "L'essentiel : votre activité, vos prestations, vos coordonnées, vos horaires, votre zone d'intervention et quelques photos si vous en avez. Pas besoin de cahier des charges. Nous nous occupons de la structuration et de la mise en forme.",
    showOnPages: ['creation', 'contact'],
  },
  {
    id: 'creation-structurer',
    category: 'creation',
    question: "M'aidez-vous à structurer mes prestations ?",
    answer:
      "Oui, c'est une partie centrale de notre travail. Nous transformons votre activité en pages claires : prestations, offres, modalités, zone d'intervention, contact. L'objectif : que le visiteur comprenne vite et vous écrive facilement.",
    showOnPages: ['creation'],
  },
  {
    id: 'creation-metier',
    category: 'creation',
    question: "Le site sera-t-il adapté à mon métier ?",
    answer:
      "Oui. Chaque site est pensé pour l'activité concernée : un restaurant, un artisan, un institut, un gîte ou une profession libérale n'ont pas les mêmes besoins. Le module métier intégré (réservation, devis, RDV, séjour, commande) est choisi en fonction de votre activité.",
    showOnPages: ['creation'],
    relatedLinks: [{ label: 'Voir nos réalisations', href: '/realisations' }],
  },
  {
    id: 'creation-point-depart',
    category: 'creation',
    question: "Puis-je choisir une réalisation comme point de départ ?",
    answer:
      "Oui. Si une réalisation vous parle, nous partons de cet esprit pour construire votre site, en l'adaptant à votre métier, vos prestations, votre identité et vos contenus. Votre site reste unique.",
    relatedLinks: [{ label: 'Voir nos réalisations', href: '/realisations' }],
  },

  // ============================================================
  // GESTION CONTINUE
  // ============================================================
  {
    id: 'gestion-quoi',
    category: 'gestion',
    question: "Que signifie 'gestion continue' ?",
    answer:
      "Une fois votre site en ligne, 9site4 continue de s'en occuper : hébergement, mises à jour techniques, sécurité, sauvegardes, modifications simples et évolutions au fil du temps. Vous ne gérez rien, vous nous écrivez.",
  },
  {
    id: 'gestion-technique',
    category: 'gestion',
    question: "Dois-je gérer la technique moi-même ?",
    answer:
      "Non. Vous n'avez rien à gérer : pas de panneau d'administration à apprendre, pas de plugin à mettre à jour, pas d'hébergeur à choisir. Vous nous transmettez vos demandes, nous nous en occupons.",
  },
  {
    id: 'gestion-evolution',
    category: 'gestion',
    question: "Le site peut-il évoluer dans le temps ?",
    answer:
      "Oui. Votre activité bouge, votre site doit suivre : nouvelles prestations, nouveaux horaires, nouvelle équipe, nouvelles photos, page ajoutée. Les évolutions simples sont incluses ; les changements plus importants sont discutés ensemble.",
  },
  {
    id: 'gestion-horaires-tarifs',
    category: 'gestion',
    question: "Puis-je modifier mes horaires ou mes tarifs ?",
    answer:
      "Oui, à tout moment. Vous nous envoyez la nouvelle information par email ou WhatsApp, nous mettons à jour votre site rapidement. C'est inclus.",
  },

  // ============================================================
  // DOMAINE / HÉBERGEMENT / SÉCURITÉ
  // ============================================================
  {
    id: 'domaine-inclus',
    category: 'domaine',
    question: "Le nom de domaine est-il inclus ?",
    answer:
      "Oui. Un nom de domaine en .re, .fr ou .com est inclus dans l'abonnement. Si vous possédez déjà un domaine, nous le rattachons à votre nouveau site sans coût supplémentaire.",
  },
  {
    id: 'domaine-hebergement',
    category: 'domaine',
    question: "Qui gère l'hébergement ?",
    answer:
      "9site4 gère l'hébergement. Votre site est hébergé sur une infrastructure professionnelle, rapide et fiable. Vous n'avez aucun contrat à signer, aucun renouvellement à suivre.",
  },
  {
    id: 'domaine-securite',
    category: 'domaine',
    question: "Mon site sera-t-il sécurisé ?",
    answer:
      "Oui. Connexion en HTTPS, sauvegardes, mises à jour de sécurité et supervision sont assurées en continu, sans intervention de votre part.",
  },
  {
    id: 'domaine-email',
    category: 'domaine',
    question: "Un e-mail professionnel est-il fourni ?",
    answer:
      "L'offre de base couvre le site, le domaine et l'hébergement. Pour un e-mail professionnel rattaché à votre domaine (contact@votreentreprise.re), nous vous orientons vers la solution la plus simple selon votre besoin.",
  },

  // ============================================================
  // MODIFICATIONS
  // ============================================================
  {
    id: 'modifs-incluses',
    category: 'modifications',
    question: "Les modifications sont-elles incluses ?",
    answer:
      "Oui. Les modifications simples sont incluses : horaires, photos, textes courts, prestations, tarifs, numéro ou informations pratiques. Vous écrivez, nous mettons à jour.",
  },
  {
    id: 'modifs-prestation',
    category: 'modifications',
    question: "Puis-je ajouter une nouvelle prestation ?",
    answer:
      "Oui. L'ajout d'une prestation ou d'une offre dans la structure existante est inclus. Nous l'intégrons proprement dans votre site et votre formulaire si nécessaire.",
  },
  {
    id: 'modifs-page',
    category: 'modifications',
    question: "Puis-je ajouter une page ?",
    answer:
      "Oui, dans la limite raisonnable d'un site vitrine professionnel. L'ajout d'une page (nouvelle offre, équipe, mentions spécifiques) est généralement inclus.",
  },
  {
    id: 'modifs-transformer',
    category: 'modifications',
    question: "Puis-je transformer mon site plus tard ?",
    answer:
      "Oui. Votre activité peut évoluer : nous adaptons votre site en conséquence. Pour une refonte importante de l'identité visuelle ou de la structure, nous en discutons ensemble pour cadrer ce qui est inclus et ce qui ne l'est pas.",
  },

  // ============================================================
  // RÉALISATIONS
  // ============================================================
  {
    id: 'realisations-quoi',
    category: 'realisations',
    question: "Que sont les réalisations 9site4 ?",
    answer:
      "Les réalisations sont des exemples de sites professionnels conçus par 9site4 pour différents métiers du 974 : restaurants, artisans, instituts, gîtes, professions libérales, coachs, commerces. Elles montrent l'approche, la structure et le niveau de finition.",
    relatedLinks: [{ label: 'Voir les réalisations', href: '/realisations' }],
  },
  {
    id: 'realisations-meme-esprit',
    category: 'realisations',
    question: "Puis-je avoir un site dans le même esprit qu'une réalisation ?",
    answer:
      "Oui. Une réalisation peut servir de point de départ. Nous l'adaptons à votre métier, vos prestations, vos couleurs, vos contenus et votre identité. Votre site reste unique.",
  },
  {
    id: 'realisations-metiers',
    category: 'realisations',
    question: "Les réalisations couvrent-elles différents métiers ?",
    answer:
      "Oui. Les réalisations couvrent une large variété de secteurs présents à La Réunion, pour montrer que 9site4 sait structurer un site selon les codes propres à chaque métier.",
  },

  // ============================================================
  // SEO / VISIBILITÉ
  // ============================================================
  {
    id: 'seo-visible',
    category: 'seo',
    question: "Mon site sera-t-il visible sur Google ?",
    answer:
      "Votre site est conçu pour être indexable par Google : structure propre, titres clairs, contenu adapté à votre activité, vitesse, version mobile, sitemap. La visibilité réelle dépend ensuite de votre marché, de votre fiche Google, de vos avis et de la concurrence locale.",
    showOnPages: ['creation'],
  },
  {
    id: 'seo-premiere-place',
    category: 'seo',
    question: "Garantissez-vous la première place sur Google ?",
    answer:
      "Non. Aucun prestataire sérieux ne peut garantir une première place sur Google. En revanche, 9site4 structure votre site pour qu'il soit clair, indexable et cohérent avec votre activité : titres, contenus, pages adaptées, vitesse, mobile, sitemap et informations importantes. La visibilité dépend ensuite aussi de votre marché, de votre fiche Google, de vos avis, de votre contenu et de la concurrence locale.",
    showOnPages: ['creation', 'diagnostic'],
  },
  {
    id: 'seo-optimise',
    category: 'seo',
    question: "Le site est-il optimisé pour le référencement ?",
    answer:
      "Oui, dans le cadre d'un site vitrine professionnel : structure HTML propre, titres hiérarchisés, descriptions, balises Open Graph, sitemap, vitesse, version mobile et contenu adapté à votre activité locale. Les bases d'un site bien structuré pour Google.",
    showOnPages: ['creation'],
  },
  {
    id: 'seo-google-business',
    category: 'seo',
    question: "Pouvez-vous créer ma fiche Google Business ?",
    answer:
      "Nous vous orientons sur la mise en place ou l'amélioration de votre fiche Google Business, qui reste un levier essentiel à La Réunion. Elle complète votre site et renforce votre visibilité locale.",
  },
  {
    id: 'seo-presenter',
    category: 'seo',
    question: "M'aidez-vous à mieux présenter mon activité en ligne ?",
    answer:
      "Oui, c'est le cœur du métier 9site4 : transformer votre activité en pages claires, cohérentes et compréhensibles pour un client qui ne vous connaît pas encore. C'est ce qui rassure et déclenche la prise de contact.",
  },

  // ============================================================
  // FORMULAIRES / MODULES MÉTIER
  // ============================================================
  {
    id: 'form-module-metier',
    category: 'formulaires',
    question: "Qu'est-ce qu'un module métier intégré ?",
    answer:
      "C'est un formulaire pensé pour votre activité : demande de devis pour un artisan, prise de rendez-vous pour un institut, réservation pour un restaurant, demande de séjour pour un gîte, demande d'intervention pour un dépannage. Il capte les bonnes informations dès la première demande.",
    showOnPages: ['creation'],
  },
  {
    id: 'form-whatsapp',
    category: 'formulaires',
    question: "Les demandes peuvent-elles arriver sur WhatsApp ?",
    answer:
      "Oui. Un bouton WhatsApp ou un envoi des demandes vers WhatsApp peut être mis en place, ce qui correspond aux usages de La Réunion. Vous recevez et répondez depuis votre téléphone, comme d'habitude.",
  },
  {
    id: 'form-adapte',
    category: 'formulaires',
    question: "Le formulaire est-il adapté à mon activité ?",
    answer:
      "Oui. Les champs du formulaire sont choisis en fonction de votre métier : un coiffeur ne demande pas la même chose qu'un plombier ou qu'un gîte. L'objectif est de recevoir des demandes exploitables, sans noyer le visiteur.",
  },

  // ============================================================
  // DIAGNOSTIC
  // ============================================================
  {
    id: 'diag-quoi',
    category: 'diagnostic',
    question: "Qu'est-ce que le diagnostic 9site4 ?",
    answer:
      "Le diagnostic est un retour gratuit et personnalisé sur votre présence en ligne actuelle : clarté de votre activité, structure, informations clés, parcours de contact, cohérence avec votre fiche Google. Un retour utile, pas un audit de 30 pages.",
    showOnPages: ['diagnostic'],
    relatedLinks: [{ label: 'Demander un diagnostic gratuit', href: '/diagnostic-site-internet-la-reunion' }],
  },
  {
    id: 'diag-sert',
    category: 'diagnostic',
    question: "À quoi sert le diagnostic ?",
    answer:
      "Il sert à prendre du recul sur ce que voient réellement vos clients en ligne et à identifier les points concrets qui peuvent être améliorés pour transformer plus de visiteurs en demandes.",
    showOnPages: ['diagnostic'],
  },
  {
    id: 'diag-sans-site',
    category: 'diagnostic',
    question: "Est-ce adapté si je n'ai pas encore de site ?",
    answer:
      "Oui. Le diagnostic regarde aussi votre fiche Google, vos réseaux et la façon dont votre activité est présentée en ligne. Vous repartez avec une recommandation sur le type de site adapté à votre activité.",
    showOnPages: ['diagnostic'],
  },
  {
    id: 'diag-deja-site',
    category: 'diagnostic',
    question: "Est-ce adapté si j'ai déjà un site ?",
    answer:
      "Oui. Le diagnostic identifie ce qui fonctionne déjà sur votre site actuel, les points qui freinent la prise de contact et les priorités d'amélioration. Aucune obligation de refaire votre site avec 9site4 à l'issue du diagnostic.",
    showOnPages: ['diagnostic'],
  },

  // ============================================================
  // TECHNIQUE / ACCOMPAGNEMENT / DÉMARRAGE
  // ============================================================
  {
    id: 'tech-parler',
    category: 'technique',
    question: "Puis-je parler à quelqu'un ?",
    answer:
      "Oui. Vous avez un interlocuteur joignable par e-mail et par WhatsApp. Pour les demandes plus structurantes, un échange téléphonique de 30 minutes peut être organisé.",
    showOnPages: ['contact'],
  },
  {
    id: 'tech-local',
    category: 'technique',
    question: "Êtes-vous basés à La Réunion ?",
    answer:
      "Oui. 9site4 est ancré à La Réunion, en français, en euros, avec un accompagnement local. Pas de décalage horaire, pas de service client à l'autre bout du monde.",
  },
  {
    id: 'tech-premier-echange',
    category: 'technique',
    question: "Comment se passe le premier échange ?",
    answer:
      "Vous nous présentez votre activité, votre besoin et vos objectifs par formulaire, e-mail ou WhatsApp. Nous revenons vers vous avec une proposition claire, adaptée à votre métier. Pas de jargon technique.",
    showOnPages: ['contact'],
  },
  {
    id: 'tech-apres-formulaire',
    category: 'technique',
    question: "Que se passe-t-il après l'envoi du formulaire ?",
    answer:
      "Nous vous répondons en général sous 24h ouvrées. Nous reformulons votre besoin, posons quelques questions si nécessaire et vous proposons les prochaines étapes : démarrage du site, échange téléphonique ou diagnostic préalable selon votre situation.",
    showOnPages: ['contact'],
  },
  {
    id: 'demarrage-comment',
    category: 'demarrage',
    question: "Comment démarrer avec 9site4 ?",
    answer:
      "Vous remplissez le formulaire de contact ou vous nous écrivez sur WhatsApp. Nous revenons vers vous pour comprendre votre activité, puis nous lançons la création de votre site. Délai de mise en ligne : environ 7 jours.",
    showOnPages: ['contact', 'creation'],
    relatedLinks: [
      { label: 'Contacter 9site4', href: '/contact' },
      { label: 'Demander un diagnostic gratuit', href: '/diagnostic-site-internet-la-reunion' },
    ],
  },
];

/**
 * Filtre les questions à afficher sur une page snippet.
 */
export function getFaqForPage(page: FaqPageKey): FaqItem[] {
  return faqItems.filter((item) => item.showOnPages?.includes(page));
}

/**
 * Regroupe les items par catégorie, en respectant l'ordre de `faqCategories`.
 */
export function groupFaqByCategory(items: FaqItem[] = faqItems): Array<{
  category: FaqCategory;
  items: FaqItem[];
}> {
  return faqCategories
    .map((category) => ({
      category,
      items: items.filter((i) => i.category === category.id),
    }))
    .filter((group) => group.items.length > 0);
}
