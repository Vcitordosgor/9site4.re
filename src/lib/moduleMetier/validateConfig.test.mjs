/**
 * Tests validateConfig + validation des 6 configs réelles.
 * Lancer :  node src/lib/moduleMetier/validateConfig.test.mjs
 */
import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { validateConfig, assertValidConfig } from './validateConfig.ts';

const here = dirname(fileURLToPath(import.meta.url));
const dataDir = join(here, '../../data/moduleMetier');

test('validateConfig : config valide → aucune erreur', () => {
  const ok = {
    id: 'x', label: 'L', tag: 'T', titre: 't', sousTitre: 's', cta: 'c', reponsePro: 'r',
    destination: { whatsapp: '+262692000000', email: 'a@b.re' },
    champs: [{ type: 'text', id: 'nom', label: 'Nom', requis: true }],
  };
  assert.deepEqual(validateConfig(ok), []);
});

test('validateConfig : champ requis manquant → message clair', () => {
  const errs = validateConfig({ id: 'x' });
  assert.ok(errs.some((e) => e.includes('label')));
  assert.ok(errs.some((e) => e.includes('destination')));
  assert.ok(errs.some((e) => e.includes('champs')));
});

test('validateConfig : type de champ inconnu → signalé', () => {
  const errs = validateConfig({
    id: 'x', label: 'L', tag: 'T', titre: 't', sousTitre: 's', cta: 'c', reponsePro: 'r',
    destination: { whatsapp: 'w', email: 'e' },
    champs: [{ type: 'range', id: 'a', label: 'A' }],
  });
  assert.ok(errs.some((e) => e.includes('inconnu')));
});

test('validateConfig : select sans options → signalé', () => {
  const errs = validateConfig({
    id: 'x', label: 'L', tag: 'T', titre: 't', sousTitre: 's', cta: 'c', reponsePro: 'r',
    destination: { whatsapp: 'w', email: 'e' },
    champs: [{ type: 'select', id: 'a', label: 'A' }],
  });
  assert.ok(errs.some((e) => e.includes('options')));
});

test('validateConfig : ids en double → signalé', () => {
  const errs = validateConfig({
    id: 'x', label: 'L', tag: 'T', titre: 't', sousTitre: 's', cta: 'c', reponsePro: 'r',
    destination: { whatsapp: 'w', email: 'e' },
    champs: [
      { type: 'text', id: 'nom', label: 'A' },
      { type: 'text', id: 'nom', label: 'B' },
    ],
  });
  assert.ok(errs.some((e) => e.includes('double')));
});

test('assertValidConfig : lève une erreur lisible', () => {
  assert.throws(() => assertValidConfig({ id: 'x' }), /Config métier invalide/);
});

test('les 6 configs métier réelles sont toutes valides', () => {
  const files = readdirSync(dataDir).filter((f) => f.endsWith('.json'));
  assert.equal(files.length, 6, 'attendu 6 configs métier');
  for (const f of files) {
    const cfg = JSON.parse(readFileSync(join(dataDir, f), 'utf8'));
    assert.deepEqual(validateConfig(cfg), [], `${f} devrait être valide`);
  }
});
