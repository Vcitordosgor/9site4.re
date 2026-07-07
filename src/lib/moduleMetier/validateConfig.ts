/**
 * validateConfig — vérifie qu'un fichier de config métier est bien formé.
 * Renvoie la liste des erreurs (langage clair). Config valide → [].
 * Utilisé au build (garde-fou) et dans les tests.
 */

import type { ModuleMetierConfig, FieldType } from './types';

const FIELD_TYPES: FieldType[] = [
  'text',
  'tel',
  'email',
  'select',
  'chips',
  'textarea',
  'date',
  'time',
];

export function validateConfig(config: unknown): string[] {
  const errors: string[] = [];
  const c = config as Partial<ModuleMetierConfig>;

  if (!c || typeof c !== 'object') {
    return ['La configuration doit être un objet.'];
  }

  const req = ['id', 'label', 'tag', 'titre', 'sousTitre', 'cta', 'reponsePro'] as const;
  for (const k of req) {
    if (!c[k] || typeof c[k] !== 'string') {
      errors.push(`Le champ "${k}" est requis et doit être une chaîne.`);
    }
  }

  if (!c.destination || typeof c.destination !== 'object') {
    errors.push('"destination" est requis (whatsapp + email).');
  } else {
    if (!c.destination.whatsapp) errors.push('"destination.whatsapp" est requis.');
    if (!c.destination.email) errors.push('"destination.email" est requis.');
  }

  if (!Array.isArray(c.champs) || c.champs.length === 0) {
    errors.push('"champs" doit contenir au moins un champ.');
  } else {
    const ids = new Set<string>();
    c.champs.forEach((champ, i) => {
      if (!champ || typeof champ !== 'object') {
        errors.push(`Champ #${i + 1} : doit être un objet.`);
        return;
      }
      if (!champ.id) errors.push(`Champ #${i + 1} : "id" manquant.`);
      else if (ids.has(champ.id)) errors.push(`Champ "${champ.id}" : id en double.`);
      else ids.add(champ.id);

      if (!champ.label) errors.push(`Champ "${champ.id ?? i + 1}" : "label" manquant.`);

      if (!FIELD_TYPES.includes(champ.type)) {
        errors.push(
          `Champ "${champ.id ?? i + 1}" : type "${champ.type}" inconnu (attendu : ${FIELD_TYPES.join(
            ', '
          )}).`
        );
      }

      if (
        (champ.type === 'select' || champ.type === 'chips') &&
        (!Array.isArray(champ.options) || champ.options.length === 0)
      ) {
        errors.push(`Champ "${champ.id ?? i + 1}" : "${champ.type}" exige des "options".`);
      }
    });
  }

  return errors;
}

export function assertValidConfig(config: unknown): asserts config is ModuleMetierConfig {
  const errs = validateConfig(config);
  if (errs.length) {
    throw new Error('Config métier invalide :\n- ' + errs.join('\n- '));
  }
}
