/**
 * Config Tailwind dédiée aux templates de démonstration (/templates/*).
 *
 * P1-17 : le CSS global était un bundle monolithique de ~288 Ko car Tailwind
 * scannait TOUT src/ (dont les 40 templates métier, chacun avec sa propre DA)
 * et émettait l'union des classes dans une seule feuille chargée sur toutes
 * les pages du site.
 *
 * Découpage :
 * - tailwind.config.mjs (globals.css)   → pages du site 9site4 uniquement
 * - ce fichier                          → classes utilisées par les templates,
 *   compilées en amont par `npm run css:templates` (CLI Tailwind, voir
 *   src/styles/templates.source.css) vers src/styles/templates.css
 *   (gitignoré), importé uniquement par les pages src/pages/templates/*.
 *
 * Le thème (palettes pizza-, salon-, spa-, fonts…) est partagé : on réutilise
 * la config principale et on ne change que le `content` scanné.
 */
import base from './tailwind.config.mjs';

/** @type {import('tailwindcss').Config} */
export default {
  ...base,
  content: [
    './src/pages/templates/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './src/components/templates/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './src/data/templates/**/*.json',
  ],
  // Pas de safelist ici : la charte 9site4 (lagon-, boost-) reste couverte
  // par la config principale, chargée sur toutes les pages.
  safelist: [],
  // Le preflight (@tailwind base) est déjà fourni par globals.css.
  corePlugins: { preflight: false },
};
