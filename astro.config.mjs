import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import preact from '@astrojs/preact';

import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: 'https://9site4.re',
  output: 'static',
  trailingSlash: 'never',

  integrations: [
    tailwind({ applyBaseStyles: false }),
    preact(),
    // NOTE (P2-13) : l'URL de la home apparaît sans slash final dans le sitemap
    // (https://9site4.re). @astrojs/sitemap ne permet pas simplement de forcer le
    // slash final ; sans impact SEO notable, documenté ici volontairement.
    sitemap({
      filter: (page) =>
        !page.includes('/404') &&
        !page.includes('/styleguide') &&
        !page.includes('/templates/'),
    }),
  ],

  // Prefetch des liens du nav au hover (perf navigation entre pages 9site4)
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },

  // Bundle CSS plus agressif :
  // - inline les très petites feuilles dans le HTML pour éviter une requête bloquante
  // - minification via lightningcss
  build: {
    inlineStylesheets: 'auto',
  },

  vite: {
    build: {
      cssMinify: 'esbuild',
    },
  },

  adapter: cloudflare()
});