---
type: plan
phase: 1
title: Sections
overview_ref: OVERVIEW.md §4 Phase 1
status: approved
created: 2026-07-26
---

# Phase 1 — Sections

> Derived from: OVERVIEW.md §4 (Phase 1), §3.2 design constraints
> Produces: slices phase-1-ws-1.1..1.4 + phase-1-gate in .metis/slices.yaml
> ADRs: 0002 (animation policy), 0003 (link-don't-mirror), 0004 (footer landmark)
> Copy source: docs/copy.md — components render this copy verbatim (ADR-0003)

## Context

Phase 0 delivered tokens, fonts, layout, and the section skeleton. Phase 1
replaces placeholders with the real site: copy from docs/copy.md, the two
mandated animations (typed-terminal hero, protocol lifecycle diagram), and
the footer landmark amendment (ADR-0004). After this phase the page is
content-complete; Phase 2 is polish and deploy.

## Dependencies

- Requires: Phase 0 complete (it is; slices archived)
- External: none

---

## Workstream 1.1: Hero with typed-terminal animation

- **Risk:** medium
- **Coder:** claude-code/opus
- **Reviewer:** opencode/gpt-5.6-sol
- **Stage:** sections

Tasks:
- Implement Hero.astro per docs/copy.md §Hero: headline, subline, install
  one-liner (mono, copyable text), primary CTA (GitHub) + secondary (docs)
- Typed-terminal block: renders the exact terminal transcript from
  docs/copy.md §Hero-terminal; typing effect in pure CSS (steps() keyframes
  per line reveal), plays once, 2-4s total; owl-gold caret
- Reduced-motion: transcript fully visible statically, no typing

Acceptance criteria:
- [ ] Hero copy matches docs/copy.md §Hero verbatim
- [ ] Terminal transcript matches docs/copy.md §Hero-terminal byte-for-byte
- [ ] grep -c '<script' dist/index.html → 0 (typing is CSS-only, ADR-0002)
- [ ] @media (prefers-reduced-motion: reduce) shows the full transcript with animations disabled
- [ ] No raw hex/color values in Hero.astro (tokens only, ADR-0001)
- [ ] npm run verify exits 0

---

## Workstream 1.2: Problem, Insight, and Personas sections

- **Risk:** low
- **Coder:** claude-code/opus
- **Reviewer:** opencode/gpt-5.6-sol
- **Stage:** sections
- **Blocked by:** 1.1

Tasks:
- Problem.astro: render docs/copy.md §Problem (drift list) with the failure
  modes as a styled list; Insight pull-quote (§Insight) inside this section
- Personas.astro: two-column human/agent split per §Personas (stacks on
  narrow viewports via container/media query)

Acceptance criteria:
- [ ] Section copy matches docs/copy.md §Problem, §Insight, §Personas verbatim
- [ ] Two-column persona layout at ≥768px, single column below
- [ ] No raw color values in touched components; spacing via --space-* only
- [ ] Zero <script> tags in dist (still, ADR-0002)
- [ ] npm run verify exits 0

---

## Workstream 1.3: Protocol lifecycle diagram with scroll animation

- **Risk:** high
- **Coder:** claude-code/opus
- **Reviewer:** opencode/gpt-5.6-sol
- **Stage:** sections
- **Blocked by:** 1.2

Tasks:
- Protocol.astro: the slice lifecycle as an inline-SVG/HTML diagram —
  pending → coded → reviewed → done, with block→rework loop; labels and
  caption copy from docs/copy.md §Protocol
- Staged reveal on scroll via ONE inline IntersectionObserver script
  (<600 bytes, ADR-0002); states light up in sequence, aegean accents,
  plays once
- Reduced-motion: full diagram rendered statically in its final state

Acceptance criteria:
- [ ] Diagram states and copy match docs/copy.md §Protocol verbatim
- [ ] Exactly one <script> in dist/index.html, inline, containing "IntersectionObserver", under 600 bytes (ADR-0002's amended gate)
- [ ] Reduced-motion shows the complete final state
- [ ] Diagram colors are tokens only; readable in both schemes
- [ ] npm run verify exits 0

---

## Workstream 1.4: Install, Footer, and landmark amendment

- **Risk:** low
- **Coder:** claude-code/opus
- **Reviewer:** opencode/gpt-5.6-sol
- **Stage:** sections
- **Blocked by:** 1.3

Tasks:
- Install.astro: install one-liner (mono block, docs/copy.md §Install),
  alternatives (go install, releases link), verification line
- Footer.astro: links + colophon per §Footer (includes the "governed by
  metis" line — ADR-0003 verified claim)
- ADR-0004: move Footer out of <main> in index.astro (body-level sibling)

Acceptance criteria:
- [ ] Install/Footer copy matches docs/copy.md §Install, §Footer verbatim
- [ ] dist/index.html: <footer> is NOT inside <main> (grep the built output)
- [ ] Exactly one <main>, one <footer>, one <h1> in dist/index.html
- [ ] External links carry rel="noopener"
- [ ] npm run verify exits 0

---

## Phase Gate

> This section defines how Phase 1 is validated as a composed system.
> It becomes a `gate` slice automatically (phase-1-gate, risk high,
> blocked by every workstream in the phase).

Composition scenarios to validate:
- [ ] Full-page render in both color schemes (live browser check): all
      sections content-complete, no placeholder text remains anywhere
- [ ] Copy audit: every rendered string traceable to docs/copy.md; every
      CLI claim/command verified against metis v0.0.6+ (accuracy rule #1:
      enumerate the copy-carrying file set from the filesystem)
- [ ] Animation policy: exactly one inline script (ADR-0002 gate); both
      animations play once; reduced-motion renders complete final states
- [ ] Landmarks: one main, body-level footer (contentinfo), one h1,
      heading levels unbroken
- [ ] All WCAG AA pairings still documented and true for new UI (diagram
      states, terminal block)

Performance / resource checks:
- [ ] Built CSS ≤ 50KB; single inline script ≤ 600 bytes; no new fonts
