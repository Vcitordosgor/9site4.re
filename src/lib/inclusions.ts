/**
 * Liste partagée des 8 inclusions de l'abonnement.
 * Source unique pour la home (sections/Offre.astro) et la page tarifs.
 */
export interface Inclusion {
  icon: string;
  titre: string;
  texte: string;
}

export const inclusions: Inclusion[] = [
  {
    icon: 'monitor',
    titre: 'Site vitrine personnalisé',
    texte: 'Une présence en ligne pro qui reflète votre activité.',
  },
  {
    icon: 'palette',
    titre: 'Design adapté à votre activité',
    texte: 'Couleurs, typographies et mise en page choisies pour vous.',
  },
  {
    icon: 'smartphone',
    titre: 'Responsive',
    texte: 'Lisible sur mobile, tablette et ordinateur, sans réglage de votre côté.',
  },
  {
    icon: 'mail',
    titre: 'Module de contact métier',
    texte: 'Réservation, devis, rendez-vous ou intervention selon votre besoin.',
  },
  {
    icon: 'globe',
    titre: 'Domaine + hébergement',
    texte: "Votre nom de domaine et l'hébergement inclus, gérés par nous.",
  },
  {
    icon: 'shield-check',
    titre: 'Sécurité + maintenance',
    texte: 'Mises à jour, sauvegardes et certificat HTTPS pris en charge.',
  },
  {
    icon: 'wand',
    titre: 'Modifications simples incluses',
    texte: "Horaires, photos, textes courts : on s'en occupe pour vous.",
  },
  {
    icon: 'headphones',
    titre: 'Un seul interlocuteur',
    texte: 'Une seule personne à qui parler pour tout ce qui touche à votre site.',
  },
];
