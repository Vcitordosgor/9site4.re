// Aucune page clé ne doit défiler horizontalement sur téléphone (360 / 390 / 430 px).
import { test, expect } from '@playwright/test';

const PAGES = [
  '/', '/realisations', '/tarifs', '/contact', '/methode-9site4', '/questions-frequentes',
  '/site-internet-restaurant-la-reunion', '/creation-site-internet-saint-denis', '/mentions-legales',
];
const WIDTHS = [360, 390, 430];

for (const width of WIDTHS) {
  test.describe(`${width}px`, () => {
    test.use({ viewport: { width, height: 844 }, isMobile: true, hasTouch: true });

    for (const path of PAGES) {
      test(`pas de défilement horizontal sur ${path}`, async ({ page }) => {
        await page.goto(path, { waitUntil: 'networkidle' });
        // Affiche les blocs animés au scroll pour mesurer la page dans son état final.
        await page.evaluate(() => document.querySelectorAll('.scroll-reveal').forEach((el) => el.classList.add('is-visible')));
        const scrollWidth = await page.evaluate(() =>
          Math.max(document.documentElement.scrollWidth, document.body.scrollWidth)
        );
        expect(scrollWidth, `largeur de document sur ${path} à ${width}px`).toBeLessThanOrEqual(width);
      });
    }
  });
}
