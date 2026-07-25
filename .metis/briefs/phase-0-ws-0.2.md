# phase-0-ws-0.2 — Base layout, fonts, and metadata

- **Type:** feat | **Risk:** medium | **Priority:** p2
- **Coder:** claude-code/opus | **Date:** 2026-07-25
- **Plan:** .metis/plans/phase-0.md §0.2

## Goal

Add the base HTML layout (theme handling, OG/meta tags, favicon), two
self-hosted OFL fonts, and route the index page through the layout — so every
Phase 1 section renders inside a fully-themed, zero-JS, metadata-complete
shell.

## Architectural context

- No `metis interfaces` configured (skipped) — consistent with slice 0.1.
- Consumes 0.1's token layer (`src/styles/tokens.css`): semantic color tokens
  (`--color-bg`, `--color-text`, `--color-accent`, …), the `--text-*` /
  `--space-*` scales, and — per the **font-family seam** documented in
  0.1's brief — the fallback `--font-display` / `--font-mono` stacks. This
  slice's `fonts.css` layers real `@font-face` faces and **enriches those same
  two tokens via the cascade** (redefines them on `:root`, prepending the real
  family name ahead of the existing system fallback stack). `fonts.css` is
  imported **after** `tokens.css` so the enriched values win; `global.css`
  (imported last) consumes them by name. The 0.1 reviewer noted these tokens
  already exist and expects exactly this layering.
- Fonts (both **SIL OFL 1.1**, redistribution permitted, latin-subset
  variable woff2, ~62 KB total, well under the 300 KB budget):
  - Display/text: **Space Grotesk** (sans; matches the sans fallback so no
    category mismatch on swap). Variable wght axis 300–700.
  - Mono: **JetBrains Mono** (terminal/code is a first-class design element).
    Variable wght axis 100–800.
- `src/consts.ts` (new, minimal): holds site-wide constants that HTML `<meta>`
  cannot express as CSS `var()` — the two `theme-color` hex values and
  `SITE.url` (canonical/OG base). The two hex literals intentionally **mirror
  `--ink` / `--parchment` in tokens.css**; `<meta>` content cannot reference a
  CSS custom property, so the layout title-criterion ("no raw hex in
  Base.astro") and the phase-gate `.astro` grep are met by keeping the only
  required literals in a `.ts` module. Title/description remain **props**
  passed from `index.astro` (task says "driven by props"), not constants.
- `og:image` intentionally omitted — no image asset exists yet; adding a
  broken reference is out of scope (later phase). `twitter:card` = `summary`.
- `astro.config.mjs` left untouched — the GitHub Pages project-path `base`
  concern is an explicit later-phase item, not this slice.

## Declared file scope

- **owned_paths:**
  - public/fonts/space-grotesk-variable.woff2
  - public/fonts/jetbrains-mono-variable.woff2
  - public/fonts/SpaceGrotesk-OFL.txt
  - public/fonts/JetBrainsMono-OFL.txt
  - src/styles/fonts.css
  - src/layouts/Base.astro
  - src/consts.ts
  - src/pages/index.astro
- **read_only_paths:**
  - OVERVIEW.md (design constraints §3.2, invariants §3.4)
  - .metis/plans/phase-0.md (§0.2 acceptance criteria)
  - src/styles/tokens.css (consumed; not modified — 0.1 owns it)
  - src/styles/global.css (consumed; not modified — 0.1 owns it)

## Definition of Done

From plan §0.2 acceptance criteria:

- [ ] `npm run verify` exits 0.
- [ ] `public/fonts/` holds woff2 for exactly two families, each with a
      redistribution-permitting (OFL 1.1) license file alongside.
- [ ] Built `dist/index.html` contains `og:title`, `og:description`,
      `og:type`, `og:url`, `twitter:card`, a meta description, and a
      non-default `<title>` (not "Astro") — each with real content, verified
      against `dist/index.html` directly (not source).
- [ ] `grep -En '<(script|link)[^>]*(src|href)="http' dist/index.html` → no
      matches (no external origins for scripts/styles/fonts).
- [ ] `dist/index.html` contains no `<script` tag.
- [ ] `grep -En '#[0-9a-fA-F]{3,8}' src/layouts/Base.astro` → no matches.

## Test plan

No unit-test framework configured (Testing Rules: none); the verify gate is
`astro check && astro build`. Verification for this slice:

1. `npm run verify` exits 0 (via `metis verify --post`).
2. Mechanical gates run by hand against the **built** `dist/index.html` and
   cited in the report:
   - Each of `og:title`, `og:description`, `og:type`, `og:url`,
     `twitter:card`, `name="description"` present with non-empty content;
     `<title>` ≠ "Astro".
   - `grep -En '<(script|link)[^>]*(src|href)="http' dist/index.html` → empty.
   - `grep -c '<script' dist/index.html` → 0.
   - `grep -En '#[0-9a-fA-F]{3,8}' src/layouts/Base.astro` → empty.
3. Font payload/licence: `ls public/fonts` shows two woff2 + two OFL files;
   `du` confirms total ≪ 300 KB; woff2 magic bytes (`wOF2`) spot-checked.

## Out-of-scope touches

None. (`src/consts.ts` is declared in owned_paths above, with rationale in
Architectural context — it is in-scope for this slice, not an out-of-scope
touch.)
