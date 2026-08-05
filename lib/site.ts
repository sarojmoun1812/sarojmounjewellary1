/**
 * The public origin the site is served from.
 *
 * Canonical URLs, the sitemap, robots.txt and every WhatsApp or social share
 * preview are built from this one value. It used to be written out by hand in
 * app/layout.tsx, app/sitemap.ts and public/robots.txt, so moving to a new
 * domain would have silently left two of the three pointing at the old one —
 * and a wrong URL in a share preview is invisible until a customer taps it.
 *
 * Set NEXT_PUBLIC_BASE_URL in the host's environment. Client-safe: it must stay
 * a NEXT_PUBLIC_ variable, because components render this on the browser too.
 */

/** Used when nothing is configured. Only correct if she keeps this domain. */
const FALLBACK_ORIGIN = "https://sarojmoun.com";

function normalize(value: string): string {
  const trimmed = value.trim().replace(/\/+$/, "");
  if (!trimmed) return FALLBACK_ORIGIN;
  return /^https?:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export const SITE_URL = normalize(
  process.env.NEXT_PUBLIC_BASE_URL || FALLBACK_ORIGIN
);

/** Absolute URL for a path, e.g. absoluteUrl("/shop"). */
export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
