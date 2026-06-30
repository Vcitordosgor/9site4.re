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
    sitemap({
      filter: (page) =>
        !page.includes('/mentions-legales') &&
        !page.includes('/404') &&
        !page.includes('/styleguide') &&
        !page.includes('/abonnement') &&
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