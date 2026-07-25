---
type: plan
phase: 0
title: Foundation
overview_ref: OVERVIEW.md §4
status: draft
created: 2026-07-25
---

# Phase 0 — Foundation

> Derived from: OVERVIEW.md §4
> Produces: slices phase-0-ws-0.1 … phase-0-ws-0.3 in .metis/slices.yaml
> ADRs: .metis/adr/NNNN-*.md (created alongside this plan)

## Context

Phase 0 establishes the visual language every later slice consumes: the
design-token system (ink/owl/aegean palette, type scale, 8px spacing rhythm),
a base layout with theme handling, self-hosted fonts and OG/meta tags, and a
single-page skeleton with placeholder section components. It builds on the
existing bare Astro scaffold (src/pages/index.astro, `npm run verify` =
`astro check && astro build`) — no re-scaffolding. After this phase the site
renders a fully-themed, both-color-scheme, zero-JS page skeleton whose five
sections Phase 1 can fill in one slice at a time; before it, only the default
Astro starter page exists.

## Dependencies

- Requires: none (first phase; Astro scaffold already committed)
- External: two font families (one display, one mono) as self-hostable woff2
  files with licenses permitting redistribution — no third-party font CDN

---

## Workstream 0.1: Design token system and global styles

- **Risk:** medium
- **Coder:** claude-code/opus
- **Reviewer:** claude-code/sonnet
- **Stage:** foundation

Tasks:
- Create `src/styles/tokens.css` defining CSS custom properties for the full
  palette: deep ink base `#0E1116`, parchment `#FAF7F0`, owl-gold accent
  `#D4A24E`, aegean teal `#2E8C83`, plus derived surface/text/border/muted
  variants for each scheme
- Define dark-first defaults on `:root` and a light-mode override block under
  `@media (prefers-color-scheme: light)` — every color exposed only through
  semantic custom properties (e.g. `--color-bg`, `--color-text`,
  `--color-accent`), never raw hex at point of use
- Define a modular type scale (`--text-*` sizes, line heights, weights) and an
  8px-based spacing scale (`--space-*`) as custom properties
- Create `src/styles/global.css` with a minimal reset, base element styles
  (body, headings, links, code) consuming only token custom properties, and a
  `@media (prefers-reduced-motion: reduce)` block that zeroes transition and
  animation durations globally
- Document each foreground/background pairing's WCAG contrast ratio in a
  comment block inside `tokens.css` (both schemes)

Suggested packages:
- `src/styles/tokens.css`
- `src/styles/global.css`

Acceptance criteria:
- [ ] `npm run verify` exits 0
- [ ] `src/styles/tokens.css` contains the exact hex values `#0E1116`,
      `#FAF7F0`, `#D4A24E`, and `#2E8C83`, each assigned only to a custom
      property
- [ ] `tokens.css` contains both a `:root` block (dark defaults) and a
      `@media (prefers-color-scheme: light)` block overriding the same
      semantic properties
- [ ] `global.css` contains a `@media (prefers-reduced-motion: reduce)` block
- [ ] `grep -rEn '#[0-9a-fA-F]{3,8}' src/styles/global.css` returns no
      matches — global.css uses only `var(--…)` colors
- [ ] Every documented text/background pairing meets WCAG AA (≥ 4.5:1 normal
      text, ≥ 3:1 large text); ratios listed in the tokens.css comment block
      and spot-checked by the reviewer with a contrast calculator

---

## Workstream 0.2: Base layout, fonts, and metadata

- **Risk:** medium
- **Coder:** claude-code/opus
- **Reviewer:** claude-code/sonnet
- **Stage:** foundation
- **Blocked by:** 0.1

Tasks:
- Add exactly two self-hosted font families as woff2 files under
  `public/fonts/` (one display face, one mono face) with their license files
  alongside
- Create `src/styles/fonts.css` with `@font-face` rules (`font-display:
  swap`) and `--font-display` / `--font-mono` custom properties consumed from
  the token layer
- Create `src/layouts/Base.astro`: HTML shell with `lang`, charset, viewport,
  `<title>` and meta description driven by props, canonical URL, OG tags
  (`og:title`, `og:description`, `og:type`, `og:url`) and
  `twitter:card`, `theme-color` meta for both schemes, favicon links, and
  imports of `tokens.css`, `fonts.css`, `global.css`
- Rewrite `src/pages/index.astro` to render through `Base.astro` (temporary
  minimal body content; real skeleton lands in 0.3)

Suggested packages:
- `public/fonts/`
- `src/styles/fonts.css`
- `src/layouts/Base.astro`
- `src/pages/index.astro`

Acceptance criteria:
- [ ] `npm run verify` exits 0
- [ ] `public/fonts/` contains woff2 files for exactly two font families,
      each with a redistribution-permitting license file present
- [ ] Built `dist/index.html` contains `og:title`, `og:description`,
      `og:type`, `og:url`, `twitter:card`, a meta description, and a
      non-default `<title>` (not "Astro")
- [ ] Built `dist/index.html` references no external origins for scripts,
      stylesheets, or fonts (`grep -En '<(script|link)[^>]*(src|href)="http'
      dist/index.html` returns no matches)
- [ ] Built `dist/index.html` contains no `<script` tag
- [ ] `Base.astro` contains no raw hex colors
      (`grep -En '#[0-9a-fA-F]{3,8}' src/layouts/Base.astro` returns no
      matches)

---

## Workstream 0.3: Page skeleton with placeholder sections

- **Risk:** low
- **Coder:** claude-code/opus
- **Reviewer:** claude-code/sonnet
- **Stage:** foundation
- **Blocked by:** 0.2

Tasks:
- Create placeholder section components `src/components/Hero.astro`,
  `Problem.astro`, `Personas.astro`, `Protocol.astro`, `Install.astro`, and
  `Footer.astro`, each a semantic `<section>` (Footer a `<footer>`) with a
  heading, one short placeholder sentence, and a stable `id` for anchor
  navigation (`hero`, `problem`, `personas`, `protocol`, `install`)
- Compose all six components in order inside `src/pages/index.astro` via
  `Base.astro`, wrapped in a `<main>` landmark
- Style the skeleton exclusively with token custom properties: page max-width
  container, 8px-rhythm section spacing, visible dark/light theming
- Add real site `<title>` and meta description copy for metiswww to the
  index page props (what metis is, one sentence, no aspirational CLI claims)

Suggested packages:
- `src/components/`
- `src/pages/index.astro`

Acceptance criteria:
- [ ] `npm run verify` exits 0
- [ ] `src/components/` contains exactly the six components listed above and
      `dist/index.html` renders their headings inside one `<main>` element in
      the declared order
- [ ] `dist/index.html` contains the section ids `hero`, `problem`,
      `personas`, `protocol`, `install`
- [ ] `grep -rEn '#[0-9a-fA-F]{3,8}' src/components src/pages` returns no
      matches — components consume tokens only
- [ ] Built `dist/index.html` contains no `<script` tag
- [ ] Placeholder copy makes no claims about metis CLI behavior (no command
      output, no flags) — reviewer checks against OVERVIEW.md §3.4

---

## Phase Gate

> This section defines how Phase 0 is validated as a composed system.
> It becomes a `gate` slice automatically.

Composition scenarios to validate:
- [ ] `npm run verify` exits 0 on a clean checkout of `dev` (tokens, fonts,
      layout, and skeleton compose without check or build errors)
- [ ] Token contract holds at every seam:
      `grep -rEn '#[0-9a-fA-F]{3,8}' src --include='*.astro'` returns no
      matches, and every component/layout color resolves to a `tokens.css`
      custom property
- [ ] End-to-end render: `dist/index.html` serves one page containing
      `<main>` with all five section ids plus footer, valid OG/meta tags, and
      both color schemes styled (built CSS contains a
      `prefers-color-scheme: light` block); page renders legibly with dark
      and light schemes toggled in a browser
- [ ] `prefers-reduced-motion: reduce` block present in built CSS and no
      animation runs when it is enabled

Performance / resource checks:
- [ ] Zero client-side JavaScript in `dist/` output (`grep -rn '<script'
      dist/*.html` returns no matches)
- [ ] Total built CSS ≤ 50 KB and total font payload ≤ 300 KB (woff2 only);
      no request to any external origin on page load

---

## Sizing Guidance (for the planning agent)

Each workstream should be:
- ONE reviewable unit of work (a few hundred lines of diff, not thousands)
- Independently testable (has its own acceptance criteria)
- Completable in a single agent session
- Small enough that scope creep is immediately visible in review

If a workstream feels too large, split it. If it feels trivial, merge with adjacent.

## Ordering Guidance

- Declaration order = execution order within same priority
- Use "Blocked by" for hard dependencies
- Foundation/interface slices come before implementation slices
- Each workstream should be able to point its brief at real interfaces from prior slices
