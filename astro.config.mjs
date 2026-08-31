import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://rdinkar.github.io',
  base: '/portfolio',
  trailingSlash: 'ignore',
  integrations: [tailwind(), sitemap()],
});
