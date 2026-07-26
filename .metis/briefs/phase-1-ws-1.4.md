# phase-1-ws-1.4 — Install, Footer, and landmark amendment

- **Type:** feat | **Risk:** low | **Priority:** p2
- **Coder:** claude-code/opus | **Date:** 2026-07-26
- **Plan:** .metis/plans/phase-1.md §1.4

## Goal

Content-complete Install and Footer sections, and the ADR-0004 landmark
amendment: Footer moves out of <main> to body level.

## Architectural context

- Copy: docs/copy.md §Install, §Footer verbatim; the colophon's "built by
  agents, governed by metis" claim is true and links the audit trail
- ADR-0004: index.astro renders <main>…5 sections…</main><Footer/>; this
  deliberately supersedes phase-0's all-in-main criterion
- Install one-liner must match the real install script URL (verify the
  path exists in techspeque/metis before shipping)

## Declared file scope

- **owned_paths:** src/components/Install.astro, src/components/Footer.astro, src/pages/index.astro
- **read_only_paths:** docs/copy.md, .metis/adr/0004-footer-landmark.md

## Definition of Done

- Copy verbatim; footer is a body-level sibling of main in dist
- One main, one footer, one h1; external links rel="noopener"
- npm run verify green

## Test plan

- npm run verify; landmark greps on dist/index.html; link attribute grep
