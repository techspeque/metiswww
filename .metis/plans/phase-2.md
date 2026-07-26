---
type: plan
phase: 2
title: Polish & Ship
overview_ref: OVERVIEW.md §4 Phase 2
status: approved
created: 2026-07-26
---

# Phase 2 — Polish & Ship

> Derived from: OVERVIEW.md §4 (Phase 2), §3.2, §8
> Produces: slices phase-2-ws-2.1..2.3 + phase-2-gate
> ADRs: 0005 (shared observer), 0006 (Pages deploy + base path)
> Copy source: docs/copy.md (§NotFound added for 2.3)

## Context

Phase 1 delivers a content-complete page. Phase 2 makes it shippable:
section reveals under the one-script policy, an accessibility/performance
pass to Lighthouse ≥95, and the GitHub Pages pipeline with correct base-path
handling (the debt ws-0.2 deferred). After the gate, the human merges
dev → main and the site is live.

## Dependencies

- Requires: Phase 1 complete (enforced via blocked_by on 2.1)
- External: GitHub Pages enabled for the repo (Settings → Pages → GitHub
  Actions source) — human step, note in gate report if missing

---

## Workstream 2.1: Section reveals via the shared observer

- **Risk:** medium
- **Coder:** claude-code/opus
- **Reviewer:** opencode/gpt-5.6-sol
- **Stage:** polish
- **Blocked by:** phase-1-gate

Tasks:
- Generalize the Phase 1 observer per ADR-0005: one inline script watching
  [data-reveal], adding is-revealed once, then unobserving
- Add subtle reveals (opacity/translateY ≤ 16px, 200-300ms ease-out, with
  --reveal-delay stagger) to Problem, Personas, Protocol, Install sections;
  Hero renders immediately (no reveal on the first viewport)
- Rework the protocol diagram staging to key off is-revealed classes
- Verify no-JS and reduced-motion render complete content statically

Acceptance criteria:
- [ ] Exactly one inline script in dist/index.html, contains "IntersectionObserver", ≤ 1024 bytes (ADR-0005 gate)
- [ ] Sections carry data-reveal; pre-reveal state never hides content (no visibility:hidden/display:none; page complete with JS disabled)
- [ ] prefers-reduced-motion: no motion, complete content
- [ ] npm run verify exits 0

---

## Workstream 2.2: Accessibility and performance pass

- **Risk:** medium
- **Coder:** claude-code/opus
- **Reviewer:** opencode/gpt-5.6-sol
- **Stage:** polish
- **Blocked by:** 2.1

Tasks:
- Run Lighthouse (npx lighthouse or equivalent) against the built site
  served locally; fix findings until all four categories ≥ 95
- Expected fix areas: meta theme-color pair, image/favicon sizes, font
  preload correctness, heading/landmark integrity, link names, color
  contrast regressions from Phase 1 UI
- Add robots.txt (allow all) and a meta generator removal if flagged
- Record the four scores with the Lighthouse version in the brief

Acceptance criteria:
- [ ] Lighthouse ≥ 95 on performance, accessibility, best-practices, SEO against the production build (scores + version recorded in brief)
- [ ] No regressions: existing greps (script budget, hex, landmarks) still pass
- [ ] npm run verify exits 0

---

## Workstream 2.3: GitHub Pages pipeline, base path, and 404

- **Risk:** high
- **Coder:** claude-code/opus
- **Reviewer:** opencode/gpt-5.6-sol
- **Stage:** ship
- **Blocked by:** 2.2

Tasks:
- ADR-0006 in full: astro.config site+base; sweep every root-absolute
  asset/href (Base.astro font preloads, favicons, canonical, consts.ts
  SITE.url) onto BASE_URL-derived paths
- .github/workflows/deploy.yml: push to main → npm ci → npm run verify →
  build → deploy-pages (verify gate red = no deploy)
- src/pages/404.astro from docs/copy.md §NotFound via Base layout
- Confirm dist output under base: all asset URLs carry /metiswww/ prefix

Acceptance criteria:
- [ ] astro.config.mjs sets site and base per ADR-0006
- [ ] grep dist/index.html for href/src root-absolute paths not starting with /metiswww/ → none (fonts, favicons, canonical all based)
- [ ] dist/404.html exists with §NotFound copy verbatim
- [ ] deploy.yml runs verify before build and uses the github-pages environment; triggers only on main
- [ ] npm run verify exits 0

---

## Phase Gate

> This section defines how Phase 2 is validated as a composed system.
> It becomes a `gate` slice automatically (phase-2-gate, risk high,
> blocked by every workstream in the phase).

Composition scenarios to validate:
- [ ] Full production build served locally under the /metiswww/ base path:
      every asset loads (zero 404s in the network log), both schemes render,
      all animations play once, reduced-motion complete
- [ ] Lighthouse re-run at gate time: all four categories ≥ 95 (record
      scores; this is the OVERVIEW §7 phase-2 gate)
- [ ] Copy audit per accuracy rule #1: enumerate copy-carrying files from
      the filesystem (now includes 404.astro); every CLI claim verified
      against installed metis; terminal transcripts byte-checked
- [ ] Script policy: exactly one inline script ≤ 1KB (ADR-0005)
- [ ] Deploy readiness: workflow YAML validates (actionlint or careful
      review), triggers restricted to main, verify gate precedes build
- [ ] The colophon's audit-trail link resolves (repo public)

Performance / resource checks:
- [ ] Built CSS ≤ 50KB; fonts unchanged (2 files); total transfer < 150KB
      excluding fonts
