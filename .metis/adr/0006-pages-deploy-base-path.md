---
type: adr
id: 0006
title: GitHub Pages deploy with explicit base path handling
status: accepted
date: 2026-07-26
phase: 2
---

# ADR-0006: GitHub Pages deploy with explicit base path handling

> Phase: 2 | Status: accepted | Date: 2026-07-26
> Decision drivers: ship target is techspeque.github.io/metiswww (project
> pages → served under /metiswww/); ws-0.2's brief explicitly deferred the
> base-path question

## Context

The site currently builds with no `base`. Under project pages every
root-absolute URL (font preloads `/fonts/…`, favicons, the canonical)
breaks. ws-0.2 documented this as a deferred item; Phase 2 pays the debt.

## Decision

- `astro.config.mjs` sets `site: "https://techspeque.github.io"` and
  `base: "/metiswww"`.
- No hand-built URLs: all internal hrefs/asset references go through
  `import.meta.env.BASE_URL` (or Astro's asset handling); `SITE.url` in
  consts.ts derives from site+base and remains the single mirror.
- Deploy: `.github/workflows/deploy.yml` — on push to `main`:
  checkout → Node 22 → npm ci → withastro/action (or npm run build +
  actions/upload-pages-artifact + actions/deploy-pages), environment
  github-pages. `dev` never deploys; human merges dev → main to release
  (OVERVIEW §8).
- 404: `src/pages/404.astro` using Base layout and docs/copy.md §NotFound
  (GitHub Pages serves 404.html automatically).

## Rules this decision implies

- A root-absolute asset URL (leading "/" not derived from BASE_URL) is a
  review finding once base is set.
- The deploy workflow builds with the same `npm run verify` gate the
  protocol uses — a red verify never deploys.
