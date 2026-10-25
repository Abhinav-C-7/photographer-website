const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** Prefix a site-relative path with the configured base (e.g. GitHub Pages sub-path). */
export const url = (path = '/') => `${base}/${path.replace(/^\//, '')}`;

/** Absolute URL for canonical links, Open Graph and structured data. */
export const absolute = (path: string, site: URL | undefined) =>
  new URL(url(path), site).toString();
