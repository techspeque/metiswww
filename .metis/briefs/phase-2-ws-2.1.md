# phase-2-ws-2.1 — Section reveals via the shared observer

- **Type:** feat | **Risk:** medium | **Priority:** p2
- **Coder:** claude-code/opus | **Date:** 2026-07-26
- **Plan:** .metis/plans/phase-2.md §2.1

## Goal

Generalize the site's single script per ADR-0005 (one observer, [data-reveal],
is-revealed) and add the OVERVIEW-mandated subtle section reveals — without
ever hiding content from no-JS or reduced-motion users.

## Architectural context

- ADR-0005 supersedes ADR-0002's script-purpose clause: budget 1KB, one
  inline script total; diagram staging re-keys off is-revealed
- Progressive enhancement is the hard rule: pre-reveal styling may fade or
  translate but never visibility/display-hide; page complete with JS off
- Hero excluded (first viewport renders instantly)

## Declared file scope

- **owned_paths:** src/components/Problem.astro, src/components/Personas.astro, src/components/Protocol.astro, src/components/Install.astro, src/pages/index.astro
- **read_only_paths:** .metis/adr/0005-shared-observer.md, src/styles/tokens.css

## Definition of Done

- One inline script in dist, contains IntersectionObserver, ≤ 1024 bytes
- Reveals 200-300ms ease-out, ≤16px translate, staggered, play once
- No-JS and reduced-motion: complete content, no motion
- npm run verify green

## Test plan

- Script count/size/content greps on dist
- Build with the script manually stripped from a dist copy → content visible
- Manual reduced-motion + both schemes
