# phase-1-ws-1.1 — Hero with typed-terminal animation

- **Type:** feat | **Risk:** medium | **Priority:** p2
- **Coder:** claude-code/opus | **Date:** 2026-07-26
- **Plan:** .metis/plans/phase-1.md §1.1

## Goal

Replace the Hero placeholder with the real hero: copy from docs/copy.md
§Hero rendered verbatim, plus a pure-CSS typed-terminal animation of the
§Hero-terminal transcript.

## Architectural context

- Consumes: tokens from src/styles/tokens.css (ADR-0001); layout from
  Base.astro; copy from docs/copy.md (read-only source of truth, ADR-0003)
- Animation policy: ADR-0002 — typing must be CSS steps()/keyframes, zero
  JS; plays once; owl-gold caret via --color-accent tokens
- The terminal transcript is genuine CLI output — render byte-for-byte,
  do not "improve" it (accuracy rule #1)

## Declared file scope

- **owned_paths:** src/components/Hero.astro
- **read_only_paths:** docs/copy.md, src/styles/tokens.css, src/layouts/Base.astro

## Definition of Done

- Hero copy and terminal transcript match docs/copy.md verbatim
- Typing animation pure CSS, 2-4s total, plays once, owl-gold caret
- prefers-reduced-motion shows the full transcript statically
- Zero <script> in dist; no raw colors; npm run verify green

## Implementation notes (coder)

Three decisions a reviewer would otherwise have to re-derive:

1. **Reduced motion is expressed as `no-preference`, not `reduce`.** All
   animation properties sit inside
   `@media (prefers-reduced-motion: no-preference)`, so the component's base
   rules already *are* the final frame. A `reduce` block would not have been
   enough: global.css collapses `animation-duration` under `reduce` but not
   `animation-delay`, so an `opacity: 0` base would leave the transcript blank
   for ~2.4s for exactly the users who asked for less motion. Verified in
   Chrome by disabling the no-preference block: 0 running animations, command
   line at natural width, all 11 lines at opacity 1.
2. **ADR-0002 (each animation 200-700ms) vs the brief (typing 2-4s total).**
   Read as: per-animation envelope, composed sequence. Longest single
   animation is 650ms; the sequence ends at ~2.63s.
3. **CTA labels carry no arrow.** In docs/copy.md the "→" separates label
   from URL; compare §NotFound, where "← Back to metis" is written inline
   because there the arrow is part of the label.

Hex values appear in Hero.astro only inside contrast-documentation comments,
mirroring the convention tokens.css uses for its own ratio table. No raw
colour, size or spacing value is used at a point of use.

The two brace-only transcript lines are written as `{"{"}` / `{"}"}` — a bare
brace opens an Astro expression, and HTML entities would have put `&#123;`
in the built output and broken the byte-for-byte criterion.

## Test plan

- npm run verify (astro check + build)
- grep transcript lines against dist/index.html
- grep -c '<script' dist/index.html → 0
- Manual: both schemes render; reduced-motion static state complete
