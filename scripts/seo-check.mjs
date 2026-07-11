#!/usr/bin/env node
/**
 * QA SEO sur le build (dist/) — mandat SEO fondations.
 * Vérifie sur chaque page HTML :
 *  - <title> présent, unique (hors noindex), longueur ≤ 60 (indexables)
 *  - meta description présente, unique (hors noindex), longueur ≤ 155 (indexables)
 *  - canonical absolu présent
 *  - OG (title/description/type/url/image) + twitter:card
 *  - JSON-LD : JSON.parse valide sur tous les blocs
 *  - 1 seul <h1>
 * Usage : node scripts/seo-check.mjs [--strict-lengths]
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
const strictLengths = process.argv.includes('--strict-lengths');

function* htmlFiles(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* htmlFiles(p);
    else if (name.endsWith('.html')) yield p;
  }
}

const get = (html, re) => (html.match(re) || [])[1];
const decode = (s) =>
  s == null ? s : s.replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

const pages = [];
let errors = 0;
const err = (page, msg) => { errors++; console.error(`  ✗ ${page}: ${msg}`); };

for (const file of htmlFiles(DIST)) {
  const rel = '/' + file.slice(DIST.length + 1).replace(/index\.html$/, '').replace(/\.html$/, '').replace(/\/$/, '');
  const html = readFileSync(file, 'utf8');
  // fragments HTML (panneaux démo) : pas des pages
  if (rel.startsWith('/fragments')) continue;

  const title = decode(get(html, /<title>([^<]*)<\/title>/));
  const desc = decode(get(html, /<meta name="description" content="([^"]*)"/));
  const canonical = get(html, /<link rel="canonical" href="([^"]*)"/);
  const noindex = /<meta name="robots" content="noindex/.test(html);
  const h1Count = (html.match(/<h1[\s>]/g) || []).length;

  if (!title) err(rel, 'title manquant');
  if (!desc) err(rel, 'meta description manquante');
  if (!canonical) err(rel, 'canonical manquant');
  else if (!/^https:\/\//.test(canonical)) err(rel, `canonical non absolu: ${canonical}`);
  for (const og of ['og:title', 'og:description', 'og:type', 'og:url', 'og:image']) {
    if (!html.includes(`property="${og}"`)) err(rel, `${og} manquant`);
  }
  if (!html.includes('name="twitter:card" content="summary_large_image"')) err(rel, 'twitter:card manquant');
  if (h1Count !== 1) err(rel, `${h1Count} balises <h1> (attendu: 1)`);

  // JSON-LD parse
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch (e) { err(rel, `JSON-LD invalide: ${e.message}`); }
  }

  if (!noindex) {
    if (title && title.length > 60 && strictLengths) err(rel, `title ${title.length} car. (>60)`);
    if (desc && desc.length > 155 && strictLengths) err(rel, `description ${desc.length} car. (>155)`);
  }
  pages.push({ rel, title, desc, noindex });
}

// Unicité (pages indexables uniquement)
const idx = pages.filter((p) => !p.noindex);
for (const key of ['title', 'desc']) {
  const seen = new Map();
  for (const p of idx) {
    if (!p[key]) continue;
    if (seen.has(p[key])) err(p.rel, `${key} dupliqué avec ${seen.get(p[key])}`);
    else seen.set(p[key], p.rel);
  }
}

// Fichiers attendus dans le build
for (const f of ['dist/sitemap-index.xml', 'dist/robots.txt', 'dist/llms.txt']) {
  if (!existsSync(f)) { errors++; console.error(`  ✗ ${f} absent du build`); }
}

console.log(`\n${pages.length} pages vérifiées (${idx.length} indexables), ${errors} erreur(s).`);
// Tableau récapitulatif longueurs (indexables)
for (const p of idx.sort((a, b) => a.rel.localeCompare(b.rel))) {
  const flag = (p.title?.length > 60 ? ' T!' : '') + (p.desc?.length > 155 ? ' D!' : '');
  console.log(`${p.rel || '/'}\t[${p.title?.length}/${p.desc?.length}]${flag}\t${p.title}`);
}
process.exit(errors ? 1 : 0);
