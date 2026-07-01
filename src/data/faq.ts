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
  { id: 'objections', label: 'Vos questions honnêtes', slug: 'objections' },
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
  // OBJECTIONS HONNÊTES (TPE/PME 974)
  // Réponses directes aux vraies questions qu'on entend sur le terrain.
  // Ton : franc, sans bullshit commercial, sans surpromesse.
  // ============================================================
  {
    id: 'obj-prix-cher',
    category: 'objections',
    question: "97,4€/mois c'est cher pour un site, non ?",
    answer:
      "C'est légitime de se poser la question. Comparé à un site Wix gratuit, oui c'est plus cher. Comparé à une agence qui facture 2 500€ de création + 30€/mois de maintenance, c'est moins cher la première année et équivalent ensuite. Le 97,4€/mois couvre tout : création, design, domaine, hébergement, maintenance, modifications. Sans engagement, vous arrêtez quand vous voulez. À comparer aussi à un encart presse, une pub radio ou un flyer : un site travaille pour vous 24h/24 toute l'année.",
    showOnPages: ['tarifs', 'contact'],
  },
  {
    id: 'obj-wix-gratuit',
    category: 'objections',
    question: "Je peux faire un site gratuit avec Wix, pourquoi payer ?",
    answer:
      "Vous pouvez, c'est vrai. La question n'est pas « gratuit ou payant », c'est « combien de temps allez-vous y passer et est-ce que le résultat va vraiment ressembler à votre métier ». Wix gratuit affiche de la pub, le nom de domaine est en wix.com/votre-nom, et vous gérez tout vous-même : structure, textes, SEO, mises à jour, sécurité. Avec 9site4, vous n'écrivez pas une ligne de code, vous n'avez pas à apprendre un outil, et le site a l'air d'un vrai site pro. Si vous avez le temps et l'envie d'apprendre, Wix peut suffire. Si vous voulez vous concentrer sur votre métier, 9site4 a plus de sens.",
    showOnPages: ['tarifs'],
  },
  {
    id: 'obj-cousin',
    category: 'objections',
    question: "Mon cousin / un ami va me faire un site, ça suffit non ?",
    answer:
      "Souvent oui, au début. Le problème arrive 6 mois après : le cousin n'a plus le temps, le site n'est plus à jour, le formulaire ne marche plus, l'hébergement expire, plus personne ne sait où sont les accès. Et vous n'osez pas relancer. Avec 9site4 vous avez un interlocuteur professionnel, joignable, qui s'en occupe dans la durée. Si votre cousin est développeur pro et qu'il s'engage à maintenir votre site 3 ans, foncez. Sinon, vous gagnez en sérénité.",
    showOnPages: ['tarifs'],
  },
  {
    id: 'obj-pas-besoin',
    category: 'objections',
    question: "Je n'ai pas besoin de site, mes clients me connaissent déjà.",
    answer:
      "Vos clients actuels oui. Mais les nouveaux ? Quand quelqu'un entend parler de vous, le premier réflexe à La Réunion comme ailleurs, c'est de taper votre nom sur Google. S'il ne trouve rien, ou juste une fiche vide, vous passez pour quelqu'un qui n'existe plus. Un site clair sert aussi à rassurer ceux qui hésitent à vous appeler : horaires, prestations, tarifs, photos. Ce n'est pas pour vous, c'est pour eux.",
  },
  {
    id: 'obj-facebook',
    category: 'objections',
    question: "J'ai déjà une page Facebook / Instagram, c'est suffisant non ?",
    answer:
      "Les réseaux sociaux servent à entretenir le lien et montrer votre quotidien. Un site sert à structurer votre offre : prestations, tarifs, zone d'intervention, prise de contact, mentions légales. Les deux sont complémentaires, pas concurrents. Et surtout : Facebook ne vous appartient pas. Si demain Meta change ses règles ou suspend votre page, vous perdez tout. Votre site et votre nom de domaine sont à vous.",
  },
  {
    id: 'obj-pas-le-temps',
    category: 'objections',
    question: "Je n'ai pas le temps de m'occuper d'un site.",
    answer:
      "C'est précisément pour ça que 9site4 existe. Vous nous transmettez les informations essentielles (activité, prestations, horaires, photos si vous en avez), le reste est notre travail : structure, design, contenu, mise en ligne, suivi. Comptez 30 minutes au démarrage, puis quelques minutes par modification quand votre activité bouge. Vous ne touchez à rien de technique.",
    showOnPages: ['contact'],
  },
  {
    id: 'obj-comprends-rien-web',
    category: 'objections',
    question: "Je ne comprends rien au web, ça va être trop compliqué pour moi.",
    answer:
      "Pas besoin de comprendre le web. Pas de panneau d'administration à apprendre, pas de mot de passe à retenir, pas d'outil à installer. Vous parlez français, nous comprenons votre métier. Pour modifier un horaire, un tarif, une photo : vous envoyez un message WhatsApp ou un mail, nous le faisons. C'est volontairement simple.",
  },
  {
    id: 'obj-site-mappartient',
    category: 'objections',
    question: "Est-ce que le site m'appartient vraiment ?",
    answer:
      "Le contenu (textes, photos, prestations) vous appartient à 100%, c'est votre matière. Le nom de domaine est à votre nom et peut être transféré si vous partez. La structure technique du site est conçue par 9site4 : si vous résiliez, vous récupérez votre domaine et vos contenus, mais le site lui-même cesse d'être hébergé par nous. C'est le même fonctionnement que la plupart des offres en abonnement. Si vous voulez la pleine propriété du code source, il faut une formule différente — parlons-en.",
    showOnPages: ['tarifs'],
  },
  {
    id: 'obj-peux-arreter',
    category: 'objections',
    question: "Si ça ne me convient pas, je peux arrêter ?",
    answer:
      "Oui, à tout moment, sans frais ni justification. Un email ou un message WhatsApp suffit. Le prélèvement s'arrête le mois suivant. Vous repartez avec votre nom de domaine et vos contenus. C'est sans engagement parce qu'on préfère que vous restiez parce que ça vous sert, pas parce que vous êtes coincé.",
    showOnPages: ['tarifs', 'contact'],
  },
  {
    id: 'obj-ramener-clients',
    category: 'objections',
    question: "Est-ce que ça va vraiment me ramener des clients ?",
    answer:
      "Honnêtement : non, aucun prestataire sérieux ne peut le promettre. Un site ne fait pas le travail de votre fiche Google, de vos avis, de votre bouche-à-oreille ou de votre métier. Ce qu'un site clair fait, c'est : rassurer les gens qui hésitent, leur donner les bonnes informations au bon moment, et faciliter la prise de contact. Sur 100 personnes qui entendent parler de vous, un site bien structuré transforme plus de curieux en demandes. C'est un levier parmi d'autres, pas une baguette magique.",
    showOnPages: ['tarifs', 'diagnostic'],
  },
  {
    id: 'obj-pourquoi-vous',
    category: 'objections',
    question: "Pourquoi vous et pas une agence web classique ?",
    answer:
      "Une agence classique facture une création (souvent 2 000 à 5 000€), puis vous laisse gérer la suite ou facture une maintenance à part. C'est un bon modèle pour des projets complexes. 9site4 est pensé pour les TPE/PME de La Réunion qui veulent une présence web pro sans gros budget initial et sans avoir à gérer la suite : tout est inclus dans un abonnement clair. Si votre besoin est complexe (e-commerce avec 500 références, application sur mesure, marketplace), une agence sera plus adaptée. Pour un site vitrine professionnel qui présente votre activité et capte des demandes, 9site4 est plus simple.",
    showOnPages: ['tarifs'],
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
