# phase-2-ws-2.3 — GitHub Pages pipeline, base path, and 404

- **Type:** feat | **Risk:** high | **Priority:** p2
- **Coder:** claude-code/opus | **Date:** 2026-07-26
- **Plan:** .metis/plans/phase-2.md §2.3

## Goal

ADR-0006 in full: correct base-path handling for project pages, the deploy
workflow gated on verify, and the 404 page.

## Architectural context

- This pays ws-0.2's documented debt: font preloads/favicons/canonical in
  Base.astro are root-absolute today and WILL break under /metiswww/ —
  derive everything from import.meta.env.BASE_URL; consts.ts SITE.url is
  the only allowed absolute (og:url needs it)
- Workflow: verify → build → upload-pages-artifact → deploy-pages,
  main-only, github-pages environment; dev never deploys
- 404.astro renders docs/copy.md §NotFound verbatim; its terminal garnish
  is real CLI output — do not alter it

## Declared file scope

- **owned_paths:** astro.config.mjs, src/layouts/Base.astro, src/consts.ts, src/pages/404.astro, .github/workflows/deploy.yml
- **read_only_paths:** docs/copy.md, .metis/adr/0006-pages-deploy-base-path.md

## Definition of Done

- site+base set; zero non-based root-absolute asset URLs in dist
- dist/404.html with §NotFound copy verbatim
- deploy.yml: main-only trigger, verify precedes build, pages environment
- npm run verify green

## Test plan

- Build; grep dist for href/src="/" not followed by metiswww
- Serve dist under a /metiswww prefix locally; zero 404s loading the page
- actionlint or line-by-line workflow review
