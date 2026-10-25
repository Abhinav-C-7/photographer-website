import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// For a custom domain set SITE_URL=https://yourdomain.com and SITE_BASE=/ at build time.
// The defaults below suit GitHub Pages at https://abhinav-c-7.github.io/photographer-website/
const site = process.env.SITE_URL ?? 'https://abhinav-c-7.github.io';
const base = process.env.SITE_BASE ?? '/photographer-website';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  integrations: [sitemap()],
  build: { inlineStylesheets: 'auto' },
});
