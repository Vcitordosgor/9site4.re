/**
 * Tests du validateur de payload du Worker Module Métier.
 * Lancer :  node --test src/pages/api/module-metier.test.mjs
 */
import assert from 'node:assert/strict';
import test from 'node:test';
import { validateModuleMetierPayload } from '../../lib/moduleMetier/validatePayload.ts';

const valide = {
  metier: 'yoga',
  label: 'Inscription cours collectif',
  texte: '📋 9SITE4 · NOUVEAU FORMULAIRE\n…',
  html: '<div>…</div>',
  destination: { whatsapp: '+262692000000', email: 'studio@exemple.re' },
};

test('payload valide → aucune erreur', () => {
  assert.deepEqual(validateModuleMetierPayload(valide), []);
});

test('metier / label / texte manquants → signalés', () => {
  const errs = validateModuleMetierPayload({ destination: { email: 'a@b.re' } });
  assert.ok(errs.includes('metier'));
  assert.ok(errs.includes('label'));
  assert.ok(errs.includes('texte'));
});

test('destination.email invalide → signalé', () => {
  const errs = validateModuleMetierPayload({ ...valide, destination: { email: 'pas-un-email' } });
  assert.ok(errs.includes('destination.email'));
});

test('destination absente → signalée', () => {
  const { destination, ...sansDest } = valide;
  assert.ok(validateModuleMetierPayload(sansDest).includes('destination'));
});

test('payload non-objet → payload_invalide', () => {
  assert.deepEqual(validateModuleMetierPayload(null), ['payload_invalide']);
});
