// docs/responsive-1/capture-complement.mjs — node docs/responsive-1/capture-complement.mjs [avant|apres]
// Hero de l'accueil à 390×844 (vidéo en cours de lecture) + /questions-frequentes à 360 px, réponses dépliées.
import { chromium } from 'playwright-core';
import { mkdirSync } from 'node:fs';

const dir = process.argv[2] || 'avant';
const BASE = process.env.BASE || 'http://127.0.0.1:4321';
mkdirSync(`docs/responsive-1/complement-${dir}`, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium' });

const hero = await (await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })).newPage();
await hero.goto(`${BASE}/`, { waitUntil: 'networkidle' });
await hero.waitForTimeout(3500);
const video = await hero.evaluate(() => {
  const v = document.querySelector('.hero-video');
  return v ? { src: v.currentSrc || '(aucune)', poster: v.poster || '(aucun)', paused: v.paused, time: +v.currentTime.toFixed(2), display: getComputedStyle(v).display } : null;
});
console.log('hero 390 :', JSON.stringify(video));
await hero.screenshot({ path: `docs/responsive-1/complement-${dir}/accueil-hero-390.png` });

const faq = await (await browser.newContext({ viewport: { width: 360, height: 780 }, isMobile: true, hasTouch: true })).newPage();
await faq.goto(`${BASE}/questions-frequentes`, { waitUntil: 'networkidle' });
await faq.evaluate(() => {
  document.querySelectorAll('details').forEach((d) => { d.open = true; });
  document.querySelectorAll('.scroll-reveal').forEach((e) => e.classList.add('is-visible'));
});
await faq.waitForTimeout(800);
await faq.screenshot({ path: `docs/responsive-1/complement-${dir}/questions-frequentes-360.png`, fullPage: true });
await browser.close();
console.log('done', dir);
