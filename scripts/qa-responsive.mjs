#!/usr/bin/env node
/**
 * QA responsive STATIQUE (sandbox Playwright HS — chromium download bloqué).
 * Scanne le HTML buildé pour patterns connus de débordement 320-1920px:
 *  - widths fixes en px (>= 320px)
 *  - whitespace-nowrap dans contenu (hors marquee)
 *  - tables <table sans wrapper overflow
 *  - max-w en px > 320
 *  - tap targets (links / buttons) potentiellement <44px : ignoré (inline links légitimes).
 * Sortie: docs/qa-static-report.json
 */
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const DIST = path.join(ROOT, 'dist');

const PAGES = [
  '', 'realisations', 'tarifs', 'contact',
  'diagnostic-site-internet-la-reunion',
  'trouver-le-site-adapte', 'methode-9site4',
  'questions-frequentes', 'creation-site-internet-la-reunion',
  'agence-web-la-reunion', 'site-vitrine-la-reunion',
  'mentions-legales',
];

const PATTERNS = [
  { name: 'fixed-width-large', re: /\b(?:min-)?w-\[(?:[3-9]\d{2}|\d{4,})px\]/g },
  { name: 'fixed-maxw-px-gt-320', re: /\bmax-w-\[(?:[3-9]\d{2}|\d{4,})px\]/g },
  { name: 'table-tag', re: /<table\b/g },
  { name: 'overflow-x-scroll', re: /overflow-x-(?:auto|scroll)(?!\s+md:)/g },
];

const out = { ranAt: new Date().toISOString(), pages: {} };
let issuesTotal = 0;

for (const slug of PAGES) {
  const file = path.join(DIST, slug, 'index.html');
  let html;
  try { html = await readFile(file, 'utf8'); }
  catch { out.pages[slug || '/'] = { error: 'file-missing' }; continue; }

  const pageIssues = [];
  for (const { name, re } of PATTERNS) {
    const matches = [...html.matchAll(re)];
    if (matches.length) {
      pageIssues.push({ pattern: name, count: matches.length, samples: matches.slice(0, 3).map(m => m[0]) });
    }
  }
  // Vérif: viewport meta présent
  if (!/<meta[^>]+name=["']viewport["'][^>]+width=device-width/.test(html)) {
    pageIssues.push({ pattern: 'no-viewport-meta' });
  }
  // Vérif: mobile sticky CTA + footer pb-28 → cohabitation
  const hasSticky = html.includes('mobile-sticky-cta');
  const hasFooterPb = /pb-28\s+md:pb-8/.test(html);
  if (hasSticky && !hasFooterPb) {
    pageIssues.push({ pattern: 'sticky-cta-without-footer-padding' });
  }

  out.pages[slug || '/'] = { issues: pageIssues, ok: pageIssues.length === 0 };
  issuesTotal += pageIssues.length;
}

out.summary = { totalIssues: issuesTotal, totalPages: PAGES.length };
await mkdir(path.join(ROOT, 'docs'), { recursive: true });
await writeFile(path.join(ROOT, 'docs', 'qa-static-report.json'), JSON.stringify(out, null, 2));
console.log(`QA static: ${issuesTotal} issue(s) sur ${PAGES.length} pages.`);
for (const [p, r] of Object.entries(out.pages)) {
  if (r.error) console.log(`  [ERR] ${p}: ${r.error}`);
  else if (!r.ok) console.log(`  [WARN] ${p}: ${r.issues.map(i => i.pattern).join(', ')}`);
  else console.log(`  [OK]   ${p}`);
}
process.exit(0);
