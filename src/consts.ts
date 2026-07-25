/* =============================================================================
 * metiswww — site-wide constants
 *
 * Values that HTML <meta> needs as literals and cannot express as a CSS
 * custom property. Keeping them here (a .ts module, not a .astro file or
 * global.css) is what lets Base.astro stay free of raw hex — an acceptance
 * criterion for slice phase-0-ws-0.2 and the Phase 0 gate.
 * ============================================================================= */

/**
 * Canonical origin for absolute canonical / Open Graph URLs.
 * Default GitHub Pages project URL for v1 (OVERVIEW.md §8); a custom domain
 * lands in a later phase.
 */
export const SITE = {
  url: "https://techspeque.github.io/metiswww",
} as const;

/**
 * `theme-color` values for the mobile browser UI, one per color scheme.
 * These two hex literals intentionally MIRROR `--ink` / `--parchment` in
 * src/styles/tokens.css; <meta> content cannot reference a CSS var(), so the
 * canonical source stays in tokens.css and these are documented duplicates.
 */
export const THEME_COLOR = {
  dark: "#0E1116", // mirrors --ink       (tokens.css)
  light: "#FAF7F0", // mirrors --parchment (tokens.css)
} as const;
