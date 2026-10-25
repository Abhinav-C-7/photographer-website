# bijith.now: wedding photographer website

Static site built with [Astro](https://astro.build): zero JavaScript framework, optimised AVIF/WebP images,
self-hosted fonts, sitemap, canonical and Open Graph tags, and JSON-LD structured data.

Design is based on Mobbin references: ETERNO (hero, about, ghost "Gallery." heading), Amy and Pierre
(framed full-bleed band, thin tracked serif) and Vucko (horizontal scrolling gallery with captions).

## Commands

| Command | What it does |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Dev server at http://localhost:4321/photographer-website/ |
| `npm run build` | Production build into `dist/` |
| `npm run placeholders` | Regenerate the placeholder images |

## Replace placeholder content

1. **Photos:** overwrite the files in `src/assets/photos/` with real JPGs using the same names.
2. **Names, email, Instagram, albums:** edit `src/data/site.ts`.
3. **Contact form:** create a free form at formspree.io and put its URL in `formAction` in `src/data/site.ts`.
4. **Alt text:** update the descriptions in `src/data/site.ts`, `About.astro` and `Hero.astro` to describe the real photos.

## Deploy (GitHub Pages)

Repo Settings > Pages > Source: **GitHub Actions**. Every push to `main` deploys via `.github/workflows/deploy.yml`.

With a custom domain, set `SITE_URL=https://yourdomain.com` and `SITE_BASE=/` for the build, and update the
`Sitemap:` line in `public/robots.txt`.
