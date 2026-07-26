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

## Test plan

- npm run verify (astro check + build)
- grep transcript lines against dist/index.html
- grep -c '<script' dist/index.html → 0
- Manual: both schemes render; reduced-motion static state complete
