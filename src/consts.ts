/* =============================================================================
 * metiswww — site-wide constants
 *
 * Values that HTML <meta> needs as literals and cannot express as a CSS
 * custom property. Keeping them here (a .ts module, not a .astro file or
 * global.css) is what lets Base.astro stay free of raw hex — an acceptance
 * criterion for slice phase-0-ws-0.2 and the Phase 0 gate.
 * ============================================================================= */

/**
 * Canonical site URL — the base that absolute canonical / Open Graph URLs
 * resolve against. Default GitHub Pages project URL for v1 (OVERVIEW.md §8);
 * a custom domain lands in a later phase.
 *
 * This string intentionally MIRRORS `site` + `base` in astro.config.mjs —
 * the same documented-duplicate arrangement as THEME_COLOR below, and for
 * the same reason: astro.config.mjs is not importable from component
 * frontmatter, so ADR-0006 keeps this export as the single mirror.
 *
 * Only the **origin** is load-bearing. Base.astro resolves
 * `Astro.url.pathname` — which already carries the base — against this
 * value, so the path segment here is replaced rather than concatenated onto
 * and cannot reach the output twice.
 */
export const SITE = {
  url: "https://techspeque.github.io/metiswww",
} as const;

/**
 * Join a path in public/ onto the configured base path (phase-2-ws-2.3,
 * ADR-0006). Astro rebases root-absolute `url()` in CSS during the build but
 * passes template attribute values through verbatim, so every hand-written
 * internal href on the site goes through here.
 *
 * `import.meta.env.BASE_URL` is "/metiswww" for the current config and "/"
 * with no base, but Astro normalizes it against `trailingSlash` — so this
 * trims and re-adds exactly one slash rather than assuming either form.
 * Passing "" yields the site root, which is what the 404 page's CTA wants.
 *
 * It lives here rather than in a layout because two files need it and Astro
 * frontmatter cannot export: a second copy is a second thing to keep correct.
 */
export const withBase = (path: string) =>
  `${import.meta.env.BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;

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
