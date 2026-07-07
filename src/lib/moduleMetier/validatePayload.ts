/**
 * Validation PURE du payload reçu par le Worker Module Métier.
 * Isolée ici (sans import Astro/JSON) pour être testable en Node natif.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export interface ModuleMetierPayload {
  metier?: string;
  label?: string;
  texte?: string;
  html?: string;
  destination?: { whatsapp?: string; email?: string };
  turnstileToken?: string;
  website?: string;
}

/** Renvoie la liste des erreurs ; payload valide → []. */
export function validateModuleMetierPayload(payload: unknown): string[] {
  const errors: string[] = [];
  const p = payload as ModuleMetierPayload;
  if (!p || typeof p !== 'object') return ['payload_invalide'];

  if (!p.metier || typeof p.metier !== 'string') errors.push('metier');
  if (!p.label || typeof p.label !== 'string') errors.push('label');
  if (!p.texte || typeof p.texte !== 'string') errors.push('texte');
  if (!p.destination || typeof p.destination !== 'object') {
    errors.push('destination');
  } else if (!p.destination.email || !EMAIL_REGEX.test(p.destination.email)) {
    errors.push('destination.email');
  }
  return errors;
}
