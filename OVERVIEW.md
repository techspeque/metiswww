---
type: overview
project: metiswww
status: living
last_updated: 2026-07-25
---

# metiswww — Full Specification

> The website for metis (github.com/techspeque/metis) — simple, developer-focused,
> quirky but professional. Built by AI agents governed by metis itself.

---

## 1. Purpose

metiswww is the public face of metis, the meta-harness that orchestrates AI
coding agents. Its job: make a developer understand *what metis is* and *why
it exists* within 30 seconds, get them to a working install within 2 minutes,
and route them to deeper documentation without duplicating it.

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
├── components/     # Hero, Persona split, Protocol diagram, Install, Footer
├── layouts/        # Base layout: head, fonts, theme, OG tags
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
- **Runtime:** static output only; zero client-side JS except where an
  animation genuinely requires it (IntersectionObserver for scroll reveals
  is acceptable; no framework hydration)

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

### 3.3 Non-Goals (do NOT build)

- No backend, serverless functions, or forms
- No analytics or cookies
- No CMS, no blog for v1
- No mirrored copies of the metis docs (link to GitHub instead)
- No JS framework (React/Vue/etc.) — Astro components only
- No Tailwind or CSS frameworks

### 3.4 Invariants (must ALWAYS hold)

- `npm run verify` (astro check + build) passes on every commit
- Zero client-side JS beyond what animations strictly require
- All color pairings meet WCAG AA; both color schemes fully styled
- All copy about metis behavior must match the real CLI (commands shown on
  the site must exist with the shown flags — no aspirational output)
- `prefers-reduced-motion` disables all non-essential animation

---

## 4. Phases (High-Level Roadmap)

### Phase 0 — Foundation
Design token system (colors, type scale, spacing), base layout with theme
handling and OG/meta tags, fonts, and the page skeleton with placeholder
sections. Establishes the visual language every later slice consumes.

### Phase 1 — Sections
The real content, one component-group per slice: Hero (typed terminal
animation + install one-liner), The Problem/Insight (from the metis README,
condensed), Two Personas split, Protocol/lifecycle animated diagram,
Install + links footer.

### Phase 2 — Polish & Ship
Scroll-reveal pass, reduced-motion audit, Lighthouse pass (≥95 on
performance/accessibility/best-practices/SEO), GitHub Pages deploy workflow,
custom 404.

---

## 5. Security Model

Static site; no user data, no auth. Only concern: external links use
`rel="noopener"`; no third-party scripts at all.

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
