// docs/responsive-1/capture.mjs — node docs/responsive-1/capture.mjs [avant|apres]
// Captures pleine page des pages clés à 360 / 390 / 430 px (serveur sur BASE, défaut 127.0.0.1:4321).
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const dir = process.argv[2] || 'avant';
const BASE = process.env.BASE || 'http://127.0.0.1:4321';
export const PAGES = [
  '/', '/realisations', '/tarifs', '/contact', '/methode-9site4', '/questions-frequentes',
  '/site-internet-restaurant-la-reunion', '/creation-site-internet-saint-denis', '/mentions-legales',
];
const widths = [360, 390, 430];
mkdirSync(`docs/responsive-1/${dir}`, { recursive: true });

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium' });
for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  for (const p of PAGES) {
    await page.goto(BASE + p, { waitUntil: 'networkidle', timeout: 45000 }).catch(e => console.log(String(e)));
    await page.evaluate(async () => {
      const h = document.body.scrollHeight;
      for (let y = 0; y < h; y += 500) { window.scrollTo({ top: y, behavior: 'instant' }); await new Promise(r => setTimeout(r, 80)); }
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
    await page.waitForTimeout(1500);
    const name = p === '/' ? 'accueil' : p.slice(1);
    await page.screenshot({ path: `docs/responsive-1/${dir}/${name}-${w}.png`, fullPage: true });
  }
  await ctx.close();
}
await browser.close();
console.log('done', dir);
