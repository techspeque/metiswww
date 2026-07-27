---
type: overview
project: metiswww
status: living
last_updated: 2026-07-27
---

# metiswww — Full Specification

> The website for metis (github.com/techspeque/metis) — simple, developer-focused,
> quirky but professional. Built by AI agents governed by metis itself.

---

## 1. Purpose

metiswww is the public face of metis, the meta-harness that orchestrates AI
coding agents. Its job: make a developer understand *what metis is* and *why
it exists* within 30 seconds, get them to a working install within 2 minutes,
and route them to deeper documentation without duplicating it. Two claims
must land in that first screen: metis is **vendor-neutral** (Claude Code,
opencode, Codex, or any surface that reads AGENTS.md — no lock-in) and it
**demonstrably works** (the ledger-derived proof strip).

Secondary purpose: this site is metis's first real dogfooded project — every
slice of it is planned, coded, and reviewed by agents under the metis
protocol. The site may say so; it is the best possible proof of the product.

Audience: developers who run AI coding agents (Claude Code, opencode, Codex)
and are frustrated by scope creep, self-review, and lost context.

---

## 2. Architecture

Static site. No backend, no runtime, no client-side data fetching.

### 2.1 System Boundaries

- Astro static build → GitHub Pages
- Links out to: github.com/techspeque/metis (repo, docs, releases)
- Ingests at build time: nothing external for v1 (docs remain in the metis
  repo; the site links to them rather than mirroring — single source of truth)

### 2.2 Data Model

None. Content lives as Astro components and (if needed) local markdown.
The install command string and current version badge are the only "data",
and the version badge links to GitHub releases rather than being fetched.

### 2.3 Component Structure

```
src/
├── pages/          # index.astro (v1 is a single page)
├── components/     # Hero (+ proof strip), Persona split, Protocol diagram,
│                   # Workflow loop, Install, Footer
├── layouts/        # Base layout: head, fonts, theme (+ manual toggle), OG tags
└── styles/         # design tokens (colors, spacing, type scale), global css
```

Section components compose the single page. Each component is independently
reviewable — one component (or one tightly-related group) per slice.

---

## 3. Constraints

### 3.1 Technology

- **Language:** TypeScript (strict), Astro `.astro` components
- **Build system:** npm; `npm run verify` = `astro check && astro build`
- **Styling:** vanilla CSS with custom properties (design tokens). No
  Tailwind, no CSS framework — the design must feel authored, not assembled.
- **Runtime:** static output only; zero client-side JS except the two
  sanctioned inline scripts — the shared IntersectionObserver for
  scroll-triggered motion (ADR-0005) and the pre-paint theme script for the
  manual scheme toggle (ADR-0007). No framework hydration.

### 3.2 Design Constraints (binding — from the product owner)

- **Simple and developer-focused.** One page for v1. Code and terminal
  output are first-class design elements, not screenshots.
- **Quirky but professional; must NOT look vibe-coded.** Concretely: a real
  design-token system (single source for colors/spacing/type), consistent
  8px spacing rhythm, one display font + one mono font maximum, no gradient
  soup, no glassmorphism, no emoji in headings, no stock illustrations.
- **Palette — "ink, owl, aegean":** deep ink base `#0E1116` (dark-first),
  parchment light mode `#FAF7F0`, owl-gold accent `#D4A24E` (Metis's owl —
  used sparingly: links, key highlights, the prompt caret), aegean teal
  `#2E8C83` secondary (success states, diagram accents). All pairings must
  meet WCAG AA contrast. Both light and dark modes via
  `prefers-color-scheme`.
- **Animations only where they explain something:** the hero types
  `metis kickoff` and prints real protocol output; the slice lifecycle
  diagram animates pending → coded → reviewed → done on scroll; section
  reveals are subtle (opacity/translate, 200-300ms, ease-out). Everything
  respects `prefers-reduced-motion`. Nothing loops forever, nothing bounces.
- **Proof over promises.** The hero carries a small strip of statistics
  measured from this repository's own ledger (slices reviewed, findings
  caught, scope audits). Every number is ledger-derived and recomputable
  per ADR-0008 — no invented percentages; anything not measured is visibly
  labeled an estimate (the token-spend figure is one: `est.`, best
  observed, basis recorded in docs/copy.md §Proof).
- **Vendor neutrality is a headline claim.** The hero states it outright
  (copy: §Hero vendor line) and the site demonstrates it: this repo's own
  ledger pairs an Anthropic coder with an OpenAI reviewer, and the
  workflow section shows the two-terminal, two-vendor loop. Never imply a
  preferred vendor.
- **Manual scheme toggle.** Both schemes remain fully styled and
  `prefers-color-scheme` stays the default. A small top-of-page toggle
  (ADR-0007) lets the visitor override the OS preference, persisted in one
  localStorage key. With JS disabled the toggle is absent and behavior is
  identical to today.
- **Workflow section.** Between Protocol and Install, a section shows how
  metis is actually driven: two terminals — a coder agent and a reviewer
  agent — trading four short prompts while the protocol carries the
  context (copy: docs/copy.md §Workflow).

### 3.3 Non-Goals (do NOT build)

- No backend, serverless functions, or forms
- No analytics or cookies
- No CMS, no blog for v1
- No mirrored copies of the metis docs (link to GitHub instead)
- No JS framework (React/Vue/etc.) — Astro components only
- No Tailwind or CSS frameworks

### 3.4 Invariants (must ALWAYS hold)

- `npm run verify` (astro check + build) passes on every commit
- Zero client-side JS beyond the two sanctioned inline scripts
  (ADR-0005 observer, ADR-0007 theme)
- All color pairings meet WCAG AA; both color schemes fully styled
- Every statistic rendered on the site is recomputable from this
  repository's public ledger via the method recorded in docs/copy.md;
  estimates must be visibly labeled (ADR-0008)
- All copy about metis behavior must match the real CLI (commands shown on
  the site must exist with the shown flags — no aspirational output)
- `prefers-reduced-motion` disables all non-essential animation

---

## 4. Phases (High-Level Roadmap)

### Phase 0 — Foundation — COMPLETE (2026-07-26)
Design tokens, base layout/fonts/meta, page skeleton. Four slices, all
reviewed and archived; gate passed on review cycle 3. Decisions recorded in
ADR-0001; the footer-landmark trade-off is amended by ADR-0004 in Phase 1.

### Phase 1 — Sections — COMPLETE (2026-07-26)
The real content, one component-group per slice: Hero (typed terminal +
install one-liner), Problem/Insight, Personas split, Protocol lifecycle
diagram (the one permitted script, ADR-0002), Install + Footer with the
ADR-0004 landmark amendment. All copy renders verbatim from docs/copy.md
(ADR-0003); briefs are pre-authored in .metis/briefs/. Coder:
claude-code/opus; reviewer: opencode/gpt-5.6-sol (genuinely cross-vendor).

### Phase 2 — Polish & Ship — COMPLETE (2026-07-27)
Section reveals under the one-script policy (ADR-0005), Lighthouse ≥95
across all categories, GitHub Pages pipeline with base-path handling
(ADR-0006), and the 404 page (copy: docs/copy.md §NotFound). Briefs
pre-authored; blocked on phase-1-gate. After the phase-2 gate passes, the
human merges dev → main and the site ships.

**Amendment A (2026-07-26):** three workstreams inserted between the
reveals (2.1) and the accessibility/performance pass (2.2) — the hero
proof strip (2.4, ADR-0008), the two-terminal workflow section (2.5), and
the manual theme toggle (2.6, ADR-0007) — so 2.2 and the gate audit the
finished UI, not a moving target. Execution order:
2.1 → 2.4 → 2.5 → 2.6 → 2.2 → 2.3 → gate (ids 2.2/2.3 predate the
amendment; ordering is enforced by `blocked_by`, not numbering).
Gate passed; dev merged to main (PR #1) and the site is live.

### Phase 3 — Copy corrections — PLANNED (.metis/plans/phase-3.md)
Product-owner-directed fixes to the live page, deliberately ONE slice
(four tightly-coupled copy edits; splitting them would be ledger overhead
without review value): the hero terminal caption and proof kicker compact
into a single sentence introducing the stats strip; the hero's duplicate
install one-liner is removed (it repeats §Install verbatim); and both
audit-trail links — "audit the ledger" (§Proof caption) and "Read the
audit trail" (colophon) — retarget to the ledger directory itself,
github.com/techspeque/metiswww/tree/main/.metis. Deck amended at planning
per ADR-0003; stat values untouched per ADR-0009.

---

## 5. Security Model

Static site; no user data, no auth. Only concern: external links use
`rel="noopener"`; no third-party scripts at all. The theme toggle persists
a single localStorage key (`theme`) on the visitor's own device — no
cookies, no tracking, nothing transmitted (ADR-0007).

---

## 6. API / Interface Contracts

None exposed. Internal contract: every component consumes design tokens from
`src/styles/tokens.css` — hardcoded colors/sizes in components are a review
finding.

---

## 7. Testing Strategy

- `astro check` (strict TS) + `astro build` as the verify gate
- Reviewer checklist emphasis: token discipline (no hardcoded values),
  contrast, reduced-motion behavior, copy accuracy against the real CLI
- Phase 2 gate: Lighthouse ≥95 across categories on the built output

---

## 8. Operational Concerns

- Deploy: GitHub Pages via Actions on push to `main` (Phase 2 slice)
- `dev` is the integration branch; human merges dev → main to release
- Custom domain later (not v1); default github.io URL is fine
