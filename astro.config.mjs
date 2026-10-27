import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Vercel sets VERCEL=1 and VERCEL_PROJECT_PRODUCTION_URL during builds.
// Set SITE_URL (e.g. https://bijithphotography.in) once the custom domain is connected.
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const site = process.env.SITE_URL ?? (vercelUrl ? `https://${vercelUrl}` : 'http://localhost:4321');
const base = process.env.SITE_BASE ?? '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  integrations: [sitemap()],
  build: { inlineStylesheets: 'auto' },
});
