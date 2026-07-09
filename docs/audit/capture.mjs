// docs/audit/capture.mjs — node docs/audit/capture.mjs [avant|apres]
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const dir = process.argv[2] || 'avant';
const BASE = 'http://127.0.0.1:4321';
const pages = [
  '/', '/tarifs', '/contact', '/realisations', '/methode-9site4',
  '/questions-frequentes', '/trouver-le-site-adapte', '/mentions-legales',
  '/site-internet-restaurant-la-reunion', '/page-inexistante-404',
];
const widths = [375, 768, 1440];
mkdirSync(`docs/audit/${dir}`, { recursive: true });

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on('console', m => m.type() === 'error' && errs.push(m.text()));
  page.on('pageerror', e => errs.push(String(e)));
  page.on('response', r => r.status() === 404 && errs.push(`404 ${r.url()}`));
  for (const p of pages) {
    await page.goto(BASE + p, { waitUntil: 'networkidle', timeout: 45000 }).catch(e => errs.push(String(e)));
    // Scroll progressif pour déclencher les .scroll-reveal avant la capture fullPage
    await page.evaluate(async () => {
      // behavior:'instant' — le site a scroll-behavior:smooth, qui rend les scrollTo successifs inopérants
      const h = document.body.scrollHeight;
      for (let y = 0; y < h; y += 500) { window.scrollTo({ top: y, behavior: 'instant' }); await new Promise(r => setTimeout(r, 90)); }
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
    await page.waitForTimeout(900);
    const name = (p === '/' ? 'home' : p.slice(1).replaceAll('/', '_'));
    await page.screenshot({ path: `docs/audit/${dir}/${name}-${w}.png`, fullPage: true });
    if (errs.length) console.log(`[CONSOLE ${name} @${w}]`, errs.splice(0));
  }
  await ctx.close();
}
await browser.close();
console.log('done', dir);
