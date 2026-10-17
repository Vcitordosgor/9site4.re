// docs/retouches-1/capture.mjs — node docs/retouches-1/capture.mjs [avant|apres]
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const dir = process.argv[2] || 'avant';
const BASE = process.env.BASE || 'http://127.0.0.1:4321';
const pages = ['/', '/realisations', '/tarifs', '/contact'];
const widths = [390, 1440];
mkdirSync(`docs/retouches-1/${dir}`, { recursive: true });

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium' });
for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, reducedMotion: 'no-preference' });
  const page = await ctx.newPage();
  for (const p of pages) {
    await page.goto(BASE + p, { waitUntil: 'networkidle', timeout: 45000 }).catch(e => console.log(String(e)));
    await page.evaluate(async () => {
      const h = document.body.scrollHeight;
      for (let y = 0; y < h; y += 500) { window.scrollTo({ top: y, behavior: 'instant' }); await new Promise(r => setTimeout(r, 90)); }
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
    await page.waitForTimeout(1200);
    const name = p === '/' ? 'accueil' : p.slice(1);
    await page.screenshot({ path: `docs/retouches-1/${dir}/${name}-${w}.png`, fullPage: true });
  }
  await ctx.close();
}
await browser.close();
console.log('done', dir);
