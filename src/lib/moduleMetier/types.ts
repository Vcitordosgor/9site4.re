/**
 * Module Métier Intégré — schéma de configuration.
 *
 * Un métier = un fichier de config JSON. Aucun code spécifique par métier :
 * le moteur ModuleMetier rend le formulaire, formatMessage produit le message,
 * le Worker envoie l'e-mail. Voir README.md du dossier pour "ajouter un métier".
 */

export type FieldType =
  | 'text'
  | 'tel'
  | 'email'
  | 'select'
  | 'chips'
  | 'textarea'
  | 'date'
  | 'time';

export interface Field {
  type: FieldType;
  id: string;
  label: string;
  /** Requis à la soumission. Défaut : false. */
  requis?: boolean;
  placeholder?: string;
  /** Options pour `select` et `chips`. */
  options?: string[];
  /** Valeur préremplie réaliste (fait vivre la démo sans saisie). */
  defaut?: string;
}

export interface Destination {
  /** Numéro international pour le lien wa.me (ex. "+262692000000"). */
  whatsapp: string;
  /** Adresse e-mail du pro (filet de sécurité en production). */
  email: string;
}

export interface ModuleMetierConfig {
  id: string;
  label: string;
  /** Badge du panneau, ex. "FORMULAIRE · INSCRIPTION COURS COLLECTIF". */
  tag: string;
  titre: string;
  sousTitre: string;
  cta: string;
  champs: Field[];
  destination: Destination;
  /** Réponse simulée du pro. `{nom}` (ou tout id de champ) est interpolé. */
  reponsePro: string;
  /** Icône (nom d'icône du set du site) — facultatif, pour le chip. */
  icon?: string;
  /** Première bulle visiteur affichée dans le mockup (varie par métier). */
  bulleVisiteur?: string;
}

export type FieldValues = Record<string, string>;
