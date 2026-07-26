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
> Produces: slices phase-2-ws-2.1..2.6 + phase-2-gate (2.4–2.6 via Amendment A)
> ADRs: 0005 (shared observer), 0006 (Pages deploy + base path),
>       0007 (theme toggle, two-script policy), 0008 (ledger-derived stats)
> Copy source: docs/copy.md (§NotFound added for 2.3; §Proof, §Workflow,
>              §ThemeToggle added by Amendment A)

## Context

Phase 1 delivers a content-complete page. Phase 2 makes it shippable:
section reveals under the one-script policy, an accessibility/performance
pass to Lighthouse ≥95, and the GitHub Pages pipeline with correct base-path
handling (the debt ws-0.2 deferred). After the gate, the human merges
dev → main and the site is live.

**Amendment A (2026-07-26, human planning cycle).** Three workstreams are
inserted between 2.1 and 2.2 so the a11y/perf pass and the gate audit the
finished UI: 2.4 (hero proof strip, ADR-0008), 2.5 (two-terminal workflow
section), 2.6 (manual theme toggle, ADR-0007). Ids 2.2/2.3 keep their
pre-seeded numbers; execution order is enforced by `blocked_by`:
2.1 → 2.4 → 2.5 → 2.6 → 2.2 → 2.3 → gate. Note on the script policy:
§2.1's "exactly one inline script" criterion is correct *at 2.1's
execution time*; from 2.6 onward ADR-0007's two-script grep supersedes it
(the Phase Gate below checks the two-script form).

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

## Workstream 2.4: Ledger proof strip in the hero

> Amendment A. Runs after 2.1.

- **Risk:** low
- **Coder:** claude-code/opus
- **Reviewer:** opencode/gpt-5.6-sol
- **Stage:** polish
- **Blocked by:** 2.1

Tasks:
- Render the docs/copy.md §Proof strip in Hero.astro, beneath the terminal
  caption: three stats + the audit-trail caption, verbatim
- Semantic markup (a list or `dl`, not bare `div`s); numbers styled display,
  labels styled muted; tokens only; mobile-first (stacks below ~640px)
- No new JS, no new reveal wiring beyond what the hero already has (the
  hero renders immediately per §2.1 — the strip must too)

Acceptance criteria:
- [ ] Strip renders the three §Proof stats and the caption verbatim from docs/copy.md, caption links to the metiswww repo
- [ ] Reviewer recomputes every number via the §Proof verification notes and they match (ADR-0008 — a mismatch is a P2 finding)
- [ ] No new script tags; token discipline holds (no raw values); AA contrast in both schemes
- [ ] npm run verify exits 0

---

## Workstream 2.5: Workflow section — run it from two terminals

> Amendment A. Runs after 2.4.

- **Risk:** medium
- **Coder:** claude-code/opus
- **Reviewer:** opencode/gpt-5.6-sol
- **Stage:** polish
- **Blocked by:** 2.4

Tasks:
- New src/components/Workflow.astro rendering docs/copy.md §Workflow
  verbatim: heading, lead, the four-step two-terminal loop, footer line
- Register it in index.astro between Protocol and Install
- Visual language: the two terminals echo the hero terminal's mono styling
  (surface, border, prompt glyph) without duplicating its animation; the
  alternating coder/reviewer steps read as a loop (ADR-0004 landmark and
  heading-order rules apply; h2 section heading)
- Participate in section reveals: `data-reveal` per ADR-0005 with the same
  no-JS/reduced-motion completeness guarantees

Acceptance criteria:
- [ ] Section renders §Workflow copy verbatim, between Protocol and Install in source and visual order
- [ ] Prompts are visually distinct from CLI output (prompts are human words to an agent, not shell commands); any CLI text in the section exists in metis with the shown semantics
- [ ] Still exactly one inline script at this workstream's execution time (theme script lands in 2.6); no-JS and reduced-motion render the section complete
- [ ] Heading hierarchy and landmarks unchanged (one h1, sections under main); token discipline; AA both schemes
- [ ] npm run verify exits 0

---

## Workstream 2.6: Manual theme toggle (ADR-0007)

> Amendment A. Runs after 2.5, immediately before the a11y/perf pass.

- **Risk:** high
- **Coder:** claude-code/opus
- **Reviewer:** opencode/gpt-5.6-sol
- **Stage:** polish
- **Blocked by:** 2.5

Tasks:
- Restructure tokens.css per ADR-0007: dark stays the `:root` default,
  the existing `prefers-color-scheme: light` block keeps OS-driven
  behavior, and new `:root[data-theme="light"]` / `:root[data-theme="dark"]`
  blocks (higher specificity) express the manual override
- Add the pre-paint theme script inline in Base.astro `<head>` before the
  stylesheets: reads localStorage `theme`, sets `data-theme` on
  `<html>`, wires a delegated click handler for `[data-theme-toggle]`,
  persists the choice, syncs the button's pressed state/label; ≤ 768 bytes
- Add the toggle button (top-right, rendered by Base.astro before the
  slot) with `hidden` set; the script removes `hidden` — no-JS visitors
  never see a dead control
- Labels/ARIA verbatim from docs/copy.md §ThemeToggle; keyboard operable;
  visible focus ring; no layout shift when it appears

Acceptance criteria:
- [ ] Exactly two inline scripts in dist/index.html — theme (head, before stylesheets, ≤ 768 bytes) + observer (unchanged, ≤ 1024 bytes); no others (ADR-0007 gate grep)
- [ ] Toggle overrides the OS preference in BOTH directions (OS-dark + choose light; OS-light + choose dark); choice survives reload with no flash of the wrong theme
- [ ] JS disabled: no visible toggle; rendering identical to pre-2.6 `prefers-color-scheme` behavior
- [ ] Button meets AA contrast and focus-visible rules in both schemes; aria state and labels match §ThemeToggle verbatim
- [ ] localStorage use is exactly one key (`theme`); no cookies (OVERVIEW §5)
- [ ] npm run verify exits 0

---

## Workstream 2.2: Accessibility and performance pass

- **Risk:** medium
- **Coder:** claude-code/opus
- **Reviewer:** opencode/gpt-5.6-sol
- **Stage:** polish
- **Blocked by:** 2.6 (Amendment A; was 2.1 — the pass must audit the
  proof strip, workflow section, and theme toggle too, including the
  sub-375px overflow deferred from f-006)

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
      the filesystem (now includes 404.astro, Workflow.astro, the proof
      strip, and the toggle labels); every CLI claim verified against
      installed metis; terminal transcripts byte-checked
- [ ] Proof-strip audit (ADR-0008): every rendered number independently
      recomputed via the docs/copy.md §Proof verification notes; the
      as-of date still labels the strip; no unlabeled estimates anywhere
      on the page
- [ ] Script policy (ADR-0007 supersedes the one-script grep): exactly two
      inline scripts — theme (head, before stylesheets, ≤ 768 bytes) and
      observer (contains "IntersectionObserver", ≤ 1024 bytes); no others
- [ ] Theme toggle end-to-end on the served build: overrides the emulated
      OS preference in both directions, persists across reload without a
      wrong-theme flash, is absent with JS disabled (page falls back to
      prefers-color-scheme), operable by keyboard alone
- [ ] Deploy readiness: workflow YAML validates (actionlint or careful
      review), triggers restricted to main, verify gate precedes build
- [ ] The colophon's audit-trail link resolves (repo public)

Performance / resource checks:
- [ ] Built CSS ≤ 50KB; fonts unchanged (2 files); total transfer < 150KB
      excluding fonts
