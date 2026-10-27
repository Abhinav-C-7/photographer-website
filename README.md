# bijith.now: wedding photographer website

Static site built with [Astro](https://astro.build): zero JavaScript framework, optimised AVIF/WebP images,
self-hosted fonts, sitemap, canonical and Open Graph tags, and JSON-LD structured data.

Design is based on Mobbin references: ETERNO (hero, about, ghost "Gallery." heading), Amy and Pierre
(framed full-bleed band, thin tracked serif) and Vucko (horizontal scrolling gallery with captions).

## Commands

| Command | What it does |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Dev server at http://localhost:4321/ |
| `npm run build` | Production build into `dist/` |
| `npm run placeholders:silhouettes` | Draw silhouette placeholders for any missing photo (`-- --force` overwrites) |

## Replace placeholder content

1. **Photos:** the current photos are CC0 stand-ins (see `CREDITS.md`). Overwrite the files in `src/assets/photos/`
   with bijith.now's own JPGs using the same names, then delete `CREDITS.md`.
2. **Names, email, Instagram, albums:** edit `src/data/site.ts`.
3. **Contact form:** create a free form at formspree.io and put its URL in `formAction` in `src/data/site.ts`.
4. **Alt text:** update the descriptions in `src/data/site.ts`, `About.astro` and `Hero.astro` to describe the real photos.

## Deploy (Vercel)

1. Go to https://vercel.com/new, sign in with GitHub and import `Abhinav-C-7/photographer-website`.
2. Vercel detects Astro automatically. Keep the defaults and click **Deploy**.
3. Every push to `main` redeploys the site.

Custom domain: in the Vercel project open **Settings > Domains**, add `bijithphotography.in`, follow the DNS
instructions, then add the environment variable `SITE_URL=https://bijithphotography.in` and redeploy so canonical
links, the sitemap and `robots.txt` use the domain.
