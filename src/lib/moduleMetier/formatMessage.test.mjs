/**
 * Tests natifs Node (node:assert) — aucune dépendance.
 * Lancer :  node src/lib/moduleMetier/formatMessage.test.mjs
 * (Node ≥ 22.18 : type-stripping des .ts activé par défaut.)
 */
import assert from 'node:assert/strict';
import test from 'node:test';
import { formatMessage, interpolate, whatsappUrl } from './formatMessage.ts';

/** @type {import('./types.ts').ModuleMetierConfig} */
const config = {
  id: 'yoga',
  label: 'Inscription cours collectif',
  tag: 'TAG',
  titre: 'T',
  sousTitre: 'S',
  cta: 'Envoyer',
  reponsePro: 'Bonjour {nom} 🙏',
  destination: { whatsapp: '+262 692 00 00 00', email: 'a@b.re' },
  champs: [
    { type: 'text', id: 'nom', label: 'Prénom', requis: true },
    { type: 'chips', id: 'cours', label: 'Cours souhaité', requis: true },
    { type: 'textarea', id: 'message', label: 'Message', requis: false },
  ],
};

test('formatMessage : structure texte exacte (en-tête, corps, pied)', () => {
  const { texte } = formatMessage(config, {
    nom: 'Emma',
    cours: 'Vinyasa (6 places)',
    message: '',
  });
  const attendu = [
    '📋 9SITE4 · NOUVEAU FORMULAIRE',
    'Nouvelle demande — Inscription cours collectif',
    '',
    'Prénom : Emma',
    'Cours souhaité : Vinyasa (6 places)',
    '',
    '✅ Demande prête à traiter',
  ].join('\n');
  assert.equal(texte, attendu);
});

test('formatMessage : champ facultatif vide → omis', () => {
  const { texte } = formatMessage(config, { nom: 'Emma', cours: 'Yin', message: '' });
  assert.ok(!texte.includes('Message :'));
});

test('formatMessage : champ facultatif rempli → présent', () => {
  const { texte } = formatMessage(config, { nom: 'Emma', cours: 'Yin', message: 'Merci' });
  assert.ok(texte.includes('Message : Merci'));
});

test('formatMessage : accents et émojis conservés dans le texte', () => {
  const { texte } = formatMessage(config, { nom: 'Éléa 🌺', cours: 'Hatha doux' });
  assert.ok(texte.includes('Éléa 🌺'));
});

test('formatMessage : HTML échappe les caractères dangereux', () => {
  const { html } = formatMessage(config, { nom: '<script>', cours: 'A & B' });
  assert.ok(html.includes('&lt;script&gt;'));
  assert.ok(html.includes('A &amp; B'));
  assert.ok(!html.includes('<script>'));
});

test('interpolate : {nom} remplacé, {inconnu} laissé tel quel', () => {
  assert.equal(interpolate('Bonjour {nom} 🙏', { nom: 'Emma' }), 'Bonjour Emma 🙏');
  assert.equal(interpolate('Salut {absent}', {}), 'Salut {absent}');
});

test('whatsappUrl : numéro normalisé (chiffres only) + texte encodé', () => {
  const texte = 'Ligne 1\nÉté 🌴';
  const url = whatsappUrl(config, texte);
  assert.ok(url.startsWith('https://wa.me/262692000000?text='));
  assert.ok(url.includes(encodeURIComponent(texte)));
  assert.ok(!url.includes(' '));
});
