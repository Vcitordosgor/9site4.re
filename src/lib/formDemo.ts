/**
 * Données de la démo "Formulaires intégrés" (home) — partagées entre la
 * section FormulairesIntegres.astro (panneau 1 inline) et les fragments
 * HTML /fragments/form-panel/[id] chargés au clic sur les onglets.
 */

export type FieldType =
  // Anciens types (rendu visuel) — encore utilisés en attendant 2b.3
  | 'text'
  | 'date'
  | 'time'
  | 'counter'
  | 'tel'
  | 'chips'
  | 'select'
  | 'cards'
  // Nouveaux types (vrais HTML inputs interactifs) — utilisés à partir de 2b.3
  | 'input-text'
  | 'input-tel'
  | 'input-email'
  | 'input-date'
  | 'input-time'
  | 'input-number'
  | 'input-file'
  | 'select-real'
  | 'textarea'
  | 'radios-cards'
  | 'radios-chips'
  | 'checkbox';

export interface FieldOption {
  value: string;
  label: string;
}

export interface Field {
  type: FieldType;
  label: string;
  // Anciens props (rendu visuel statique)
  value?: string;
  options?: string[] | FieldOption[];
  active?: number;
  hint?: string;
  icon?: string;
  // Nouveaux props (vrais HTML inputs)
  name?: string;
  placeholder?: string;
  defaultValue?: string;
  defaultChecked?: boolean;
  min?: string | number;
  max?: string | number;
  rows?: number;
  span?: 1 | 2;
}

export interface Metier {
  id: string;
  label: string;
  shortLabel?: string;
  icon: string;
  color: 'bleu' | 'orange';
  formKicker: string;
  formTitle: string;
  fields: Field[];
  cta: string;
  example: string;
  // Conversation WhatsApp (étape 5b) — message d'intro client + réponse pro
  clientIntro: string;
  proReply: string;
}

/**
 * 6 métiers de la démo, avec champs inspirés des formulaires réels des
 * templates clients (yoga/Reservation, resto/Reservation, paysagiste/Devis,
 * institut/Reservation, gite/Reservation, coach/Essai). Chaque métier garde
 * la logique propre à son activité — étape 2b transformera ces fields en
 * vrais HTML inputs cliquables.
 */
export const metiers: Metier[] = [
  {
    id: 'yoga',
    label: 'Prof de yoga',
    shortLabel: 'Yoga',
    icon: 'sparkle',
    color: 'orange',
    formKicker: 'Formulaire · Inscription cours collectif',
    formTitle: 'Inscrivez-vous à un cours',
    fields: [
      { type: 'select-real', name: 'cours', label: 'Cours choisi',
        options: [
          { value: 'doux', label: 'Yoga doux — mardi 18h30 — Saint-Denis (6 places)' },
          { value: 'vinyasa', label: 'Vinyasa — jeudi 19h — Saint-Pierre (3 places)' },
          { value: 'prenatal', label: 'Yoga prénatal — samedi 9h30 — Saint-Gilles (4 places)' },
        ],
        defaultValue: 'doux', span: 2 },
      { type: 'input-text', name: 'nom', label: 'Nom',
        placeholder: 'Emma', defaultValue: 'Emma', span: 1 },
      { type: 'input-tel', name: 'telephone', label: 'Téléphone',
        placeholder: '0692 •• •• ••', span: 1 },
      { type: 'input-email', name: 'email', label: 'E-mail',
        placeholder: 'emma@exemple.fr', span: 2 },
      { type: 'radios-chips', name: 'niveau', label: 'Niveau',
        options: [
          { value: 'debutant', label: 'Débutant' },
          { value: 'intermediaire', label: 'Intermédiaire' },
          { value: 'avance', label: 'Avancé' },
        ],
        defaultValue: 'debutant', span: 2 },
      { type: 'textarea', name: 'message', label: 'Message ou précision (facultatif)',
        placeholder: 'Je viens pour un premier cours…',
        rows: 2, span: 2 },
    ],
    cta: 'Je réserve ma place',
    example: 'Le client choisit son cours et son niveau — vous savez immédiatement à quel créneau il s\'inscrit.',
    clientIntro: 'Bonjour, je voudrais m\'inscrire à un cours.',
    proReply: 'Bonjour Emma, merci pour votre demande. Je vous confirme votre place rapidement.',
  },
  {
    id: 'resto',
    label: 'Restaurant',
    shortLabel: 'Resto',
    icon: 'calendar-clock',
    color: 'orange',
    formKicker: 'Formulaire · Réservation table',
    formTitle: 'Réservez votre table',
    fields: [
      { type: 'input-text', name: 'nom', label: 'Nom',
        placeholder: 'Emma', defaultValue: 'Emma', span: 1 },
      { type: 'input-tel', name: 'telephone', label: 'Téléphone',
        placeholder: '0692 •• •• ••', span: 1 },
      { type: 'select-real', name: 'creneau', label: 'Créneau disponible',
        options: [
          { value: 'ven-1930', label: 'Ven. 14 nov · 19h30 — 3 tables restantes' },
          { value: 'ven-2100', label: 'Ven. 14 nov · 21h00 — 1 table restante' },
          { value: 'sam-1230', label: 'Sam. 15 nov · 12h30 — 5 tables restantes' },
          { value: 'sam-2000', label: 'Sam. 15 nov · 20h00 — 2 tables restantes' },
          { value: 'dim-1230', label: 'Dim. 16 nov · 12h30 — 4 tables restantes' },
        ],
        defaultValue: 'sam-2000', span: 2 },
      { type: 'input-number', name: 'personnes', label: 'Nombre de personnes',
        defaultValue: '4', min: 1, max: 12, span: 1 },
      { type: 'select-real', name: 'demande', label: 'Demande spéciale',
        options: [
          { value: 'aucune', label: 'Aucune' },
          { value: 'terrasse', label: 'Terrasse si possible' },
          { value: 'chaise-bebe', label: 'Chaise bébé' },
          { value: 'anniversaire', label: 'Anniversaire' },
          { value: 'allergie', label: 'Allergie alimentaire' },
          { value: 'table-calme', label: 'Table au calme' },
        ],
        defaultValue: 'terrasse', span: 1 },
    ],
    cta: 'Réserver ma table',
    example: 'Le client choisit un créneau réellement disponible (avec les tables restantes) — fini les réservations sur des horaires déjà complets.',
    clientIntro: 'Bonjour, je voudrais réserver une table.',
    proReply: 'Bonjour Emma, merci. Je vérifie la disponibilité et je reviens vers vous tout de suite.',
  },
  {
    id: 'artisan',
    label: 'Artisan / BTP',
    shortLabel: 'Artisan',
    icon: 'wrench',
    color: 'bleu',
    formKicker: 'Formulaire · Demande de devis',
    formTitle: 'Demandez votre devis',
    fields: [
      { type: 'input-text', name: 'nom', label: 'Nom',
        placeholder: 'Emma', defaultValue: 'Emma', span: 1 },
      { type: 'input-tel', name: 'telephone', label: 'Téléphone',
        placeholder: '0692 •• •• ••', span: 1 },
      { type: 'select-real', name: 'commune', label: 'Commune du chantier',
        options: [
          { value: 'st-denis', label: 'Saint-Denis' },
          { value: 'st-paul', label: 'Saint-Paul' },
          { value: 'st-pierre', label: 'Saint-Pierre' },
          { value: 'st-andre', label: 'Saint-André' },
          { value: 'le-tampon', label: 'Le Tampon' },
          { value: 'st-gilles', label: 'Saint-Gilles' },
          { value: 'autre', label: 'Autre commune' },
        ],
        defaultValue: 'st-denis', span: 1 },
      { type: 'select-real', name: 'travaux', label: 'Type de travaux',
        options: [
          { value: 'renovation', label: 'Rénovation' },
          { value: 'depannage', label: 'Dépannage' },
          { value: 'installation', label: 'Installation' },
          { value: 'entretien', label: 'Entretien' },
          { value: 'extension', label: 'Extension' },
          { value: 'autre', label: 'Autre' },
        ],
        defaultValue: 'renovation', span: 1 },
      { type: 'radios-chips', name: 'urgence', label: 'Niveau d\'urgence',
        options: [
          { value: 'urgent', label: 'Urgent — intervention rapide' },
          { value: 'semaine', label: 'Dans la semaine' },
          { value: 'mois', label: 'Dans le mois' },
          { value: 'projet', label: 'Projet à venir' },
        ],
        defaultValue: 'mois', span: 2 },
      { type: 'select-real', name: 'budget', label: 'Budget estimé',
        options: [
          { value: 'a-definir', label: 'À définir' },
          { value: 'moins-500', label: 'Moins de 500 €' },
          { value: '500-2000', label: '500 € à 2 000 €' },
          { value: '2000-5000', label: '2 000 € à 5 000 €' },
          { value: 'plus-5000', label: 'Plus de 5 000 €' },
        ],
        defaultValue: 'a-definir', span: 1 },
      { type: 'input-file', name: 'photo', label: 'Photo du problème / chantier',
        hint: 'JPG ou PNG · 5 Mo max', span: 1 },
      { type: 'textarea', name: 'description', label: 'Description du besoin',
        placeholder: 'Je souhaite refaire une petite salle de bain…',
        defaultValue: 'Je souhaite refaire une petite salle de bain.',
        rows: 2, span: 2 },
    ],
    cta: 'Demander un devis',
    example: 'Le client qualifie son besoin et joint une photo — vous gagnez du temps et vous chiffrez plus juste dès le 1er échange.',
    clientIntro: 'Bonjour, j\'aurais besoin d\'un devis.',
    proReply: 'Bonjour Emma, merci pour votre demande. Je regarde cela et je vous recontacte rapidement.',
  },
  {
    id: 'institut',
    label: 'Institut de beauté / spa',
    shortLabel: 'Institut',
    icon: 'palette',
    color: 'orange',
    formKicker: 'Formulaire · Pré-demande de rendez-vous',
    formTitle: 'Demandez un rendez-vous',
    fields: [
      { type: 'input-text', name: 'nom', label: 'Nom',
        placeholder: 'Emma', defaultValue: 'Emma', span: 1 },
      { type: 'input-tel', name: 'telephone', label: 'Téléphone',
        placeholder: '0692 •• •• ••', span: 1 },
      { type: 'select-real', name: 'soin', label: 'Soin souhaité',
        options: [
          { value: 'massage', label: 'Massage relaxant' },
          { value: 'visage', label: 'Soin du visage' },
          { value: 'epilation', label: 'Épilation' },
          { value: 'manucure', label: 'Manucure' },
          { value: 'rituel', label: 'Rituel spa' },
          { value: 'cadeau', label: 'Carte cadeau' },
        ],
        defaultValue: 'massage', span: 2 },
      { type: 'radios-chips', name: 'pour-qui', label: 'Pour qui ?',
        options: [
          { value: 'moi', label: 'Pour moi' },
          { value: 'offrir', label: 'Pour offrir' },
          { value: 'duo', label: 'Pour un duo' },
        ],
        defaultValue: 'moi', span: 2 },
      { type: 'select-real', name: 'creneau', label: 'Créneau disponible',
        options: [
          { value: 'jeu-10', label: 'Jeu. 20 nov · 10h00 — disponible' },
          { value: 'jeu-1430', label: 'Jeu. 20 nov · 14h30 — disponible' },
          { value: 'ven-16', label: 'Ven. 21 nov · 16h00 — dernière place' },
          { value: 'sam-9', label: 'Sam. 22 nov · 9h00 — disponible' },
          { value: 'sam-1130', label: 'Sam. 22 nov · 11h30 — disponible' },
        ],
        defaultValue: 'ven-16', span: 2 },
      { type: 'textarea', name: 'message', label: 'Message / précision (facultatif)',
        placeholder: 'Je préfère une praticienne si possible…',
        rows: 2, span: 2 },
    ],
    cta: 'Demander un rendez-vous',
    example: 'Le client choisit un créneau réellement libre dans votre planning — vous ne recevez que des demandes sur des horaires disponibles.',
    clientIntro: 'Bonjour, je souhaite réserver un soin.',
    proReply: 'Bonjour Emma, merci. Je vous propose un créneau au plus vite.',
  },
  {
    id: 'gite',
    label: 'Gîte / Location',
    shortLabel: 'Gîte',
    icon: 'globe',
    color: 'bleu',
    formKicker: 'Formulaire · Demande de séjour',
    formTitle: 'Vérifiez les disponibilités',
    fields: [
      { type: 'input-text', name: 'nom', label: 'Nom',
        placeholder: 'Emma', defaultValue: 'Emma', span: 1 },
      { type: 'input-tel', name: 'telephone', label: 'Téléphone',
        placeholder: '0692 •• •• ••', span: 1 },
      { type: 'input-email', name: 'email', label: 'E-mail',
        placeholder: 'emma@exemple.fr', span: 2 },
      { type: 'select-real', name: 'periode', label: 'Période disponible',
        options: [
          { value: 'nov-22-24', label: '22 → 24 nov · 2 nuits — disponible' },
          { value: 'nov-28-30', label: '28 → 30 nov · 2 nuits — disponible' },
          { value: 'dec-05-08', label: '5 → 8 déc · 3 nuits — dernières dispos' },
          { value: 'dec-19-26', label: '19 → 26 déc · semaine — disponible' },
        ],
        defaultValue: 'nov-22-24', span: 2 },
      { type: 'input-number', name: 'voyageurs', label: 'Nombre de voyageurs',
        defaultValue: '2', min: 1, max: 12, span: 1 },
      { type: 'select-real', name: 'sejour', label: 'Type de séjour',
        options: [
          { value: 'weekend', label: 'Week-end' },
          { value: 'famille', label: 'Vacances en famille' },
          { value: 'couple', label: 'Séjour en couple' },
          { value: 'long', label: 'Télétravail / long séjour' },
          { value: 'amis', label: 'Groupe d\'amis' },
        ],
        defaultValue: 'couple', span: 1 },
      { type: 'textarea', name: 'demande', label: 'Demande particulière (facultatif)',
        placeholder: 'Arrivée tardive, lit bébé, vue / terrasse, parking, animaux acceptés ?',
        rows: 2, span: 2 },
    ],
    cta: 'Réserver ces dates',
    example: 'Le client choisit parmi vos périodes réellement disponibles — plus de demandes sur des dates déjà réservées.',
    clientIntro: 'Bonjour, je voudrais connaître vos disponibilités.',
    proReply: 'Bonjour Emma, merci pour votre demande. Je vérifie les disponibilités et je reviens vers vous rapidement.',
  },
  {
    id: 'coach',
    label: 'Coach sportif',
    shortLabel: 'Coach',
    icon: 'calendar-check',
    color: 'bleu',
    formKicker: 'Formulaire · Premier bilan',
    formTitle: 'Demandez un premier échange',
    fields: [
      { type: 'input-text', name: 'nom', label: 'Nom',
        placeholder: 'Emma', defaultValue: 'Emma', span: 1 },
      { type: 'input-tel', name: 'telephone', label: 'Téléphone',
        placeholder: '0692 •• •• ••', span: 1 },
      { type: 'select-real', name: 'objectif', label: 'Objectif principal',
        options: [
          { value: 'poids', label: 'Perte de poids' },
          { value: 'forme', label: 'Remise en forme' },
          { value: 'muscle', label: 'Prise de muscle' },
          { value: 'preparation', label: 'Préparation sportive' },
          { value: 'mobilite', label: 'Bien-être / mobilité' },
          { value: 'reprise', label: 'Reprise après pause' },
        ],
        defaultValue: 'forme', span: 2 },
      { type: 'radios-chips', name: 'niveau', label: 'Niveau actuel',
        options: [
          { value: 'debutant', label: 'Débutant' },
          { value: 'intermediaire', label: 'Intermédiaire' },
          { value: 'avance', label: 'Avancé' },
          { value: 'reprise', label: 'Reprise après arrêt' },
        ],
        defaultValue: 'reprise', span: 2 },
      { type: 'select-real', name: 'format', label: 'Format souhaité',
        options: [
          { value: 'individuel', label: 'Coaching individuel' },
          { value: 'duo', label: 'Coaching en duo' },
          { value: 'groupe', label: 'Petit groupe' },
          { value: 'distance', label: 'Programme à distance' },
          { value: 'indecis', label: 'Je ne sais pas encore' },
        ],
        defaultValue: 'individuel', span: 1 },
      { type: 'select-real', name: 'frequence', label: 'Fréquence souhaitée',
        options: [
          { value: '1', label: '1 fois par semaine' },
          { value: '2', label: '2 fois par semaine' },
          { value: '3', label: '3 fois par semaine' },
          { value: 'ponctuel', label: 'Ponctuellement' },
          { value: 'a-definir', label: 'À définir ensemble' },
        ],
        defaultValue: '2', span: 1 },
      { type: 'input-text', name: 'contraintes', label: 'Contraintes / blessures',
        placeholder: 'Douleur au genou droit…',
        defaultValue: 'Douleur au genou droit', span: 2 },
      { type: 'select-real', name: 'creneau', label: 'Créneau disponible pour le 1er bilan',
        options: [
          { value: 'lun-18', label: 'Lun. 17 nov · 18h00 — disponible' },
          { value: 'mer-12', label: 'Mer. 19 nov · 12h00 — disponible' },
          { value: 'jeu-19', label: 'Jeu. 20 nov · 19h00 — dernière place' },
          { value: 'sam-10', label: 'Sam. 22 nov · 10h00 — disponible' },
        ],
        defaultValue: 'mer-12', span: 2 },
      { type: 'textarea', name: 'message', label: 'Message',
        placeholder: 'Je veux reprendre progressivement…',
        rows: 2, span: 2 },
    ],
    cta: 'Réserver mon premier bilan',
    example: 'Le client réserve directement un créneau libre pour le premier bilan — vous ne gérez que des rendez-vous réellement disponibles.',
    clientIntro: 'Bonjour, je cherche un accompagnement sportif.',
    proReply: 'Bonjour Emma, merci pour votre message. Je vous propose un premier échange pour en parler.',
  },
];

/**
 * Formate la valeur initiale d'un field pour l'affichage dans la carte
 * "Message reçu". Le JS côté client (étape 2c.2) appliquera la même logique
 * en live quand l'utilisateur modifie un champ.
 */
export function fieldDisplay(f: Field): string {
  const placeholder = '—';
  switch (f.type) {
    case 'input-text':
    case 'input-tel':
    case 'input-email':
    case 'input-number':
      return f.defaultValue || f.placeholder || placeholder;
    case 'input-file':
      return f.defaultValue || 'Aucune photo jointe';
    case 'input-date': {
      if (!f.defaultValue) return placeholder;
      const d = new Date(f.defaultValue);
      if (isNaN(d.getTime())) return f.defaultValue;
      return d.toLocaleDateString('fr-FR', {
        weekday: 'long', day: 'numeric', month: 'long',
      });
    }
    case 'input-time':
      return f.defaultValue ? f.defaultValue.replace(':', 'h') : placeholder;
    case 'select-real':
    case 'radios-cards':
    case 'radios-chips': {
      const opts = (f.options as FieldOption[]) ?? [];
      const opt = opts.find((o) => o.value === f.defaultValue);
      return opt?.label ?? placeholder;
    }
    case 'textarea':
      return f.defaultValue || f.placeholder || placeholder;
    case 'checkbox':
      return f.defaultChecked ? 'Oui' : 'Non';
    default:
      return placeholder;
  }
}
