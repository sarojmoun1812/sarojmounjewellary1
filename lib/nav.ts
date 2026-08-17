/**
 * Routes that open with a full-bleed dark hero.
 *
 * On these the header floats over the artwork with light text and no background
 * of its own; the hero reaches the very top of the viewport. Everywhere else the
 * header needs an opaque background and the page content has to start below it.
 *
 * Defaulting to "not a dark hero" is deliberate. A page added later without
 * touching this file gets a readable header and correctly offset content, which
 * is the harmless outcome. The other way round it would silently render white
 * text on white and hide its first hundred pixels behind the bar.
 */
const DARK_HERO_ROUTES = new Set(["/", "/shop", "/connect"]);

export function hasDarkHero(pathname: string): boolean {
  return DARK_HERO_ROUTES.has(pathname);
}
