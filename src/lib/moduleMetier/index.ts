/**
 * Point d'entrée du moteur Module Métier.
 * Réexporte le schéma, la fonction pure formatMessage et la validation.
 */
export type {
  FieldType,
  Field,
  Destination,
  ModuleMetierConfig,
  FieldValues,
} from './types';
export { formatMessage, interpolate, whatsappUrl } from './formatMessage';
export type { FormattedMessage } from './formatMessage';
export { validateConfig, assertValidConfig } from './validateConfig';
