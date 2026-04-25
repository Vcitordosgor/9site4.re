import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import preact from '@astrojs/preact';

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
        !page.includes('/styleguide'),
    }),
  ],
});
