# phase-1-ws-1.3 — Protocol lifecycle diagram with scroll animation

- **Type:** feat | **Risk:** high | **Priority:** p2
- **Coder:** claude-code/opus | **Date:** 2026-07-26
- **Plan:** .metis/plans/phase-1.md §1.3

## Goal

The slice lifecycle (pending → coded → reviewed → done, with the
blocked → rework loop) as an accessible inline diagram with a staged
scroll-triggered reveal — the site's one permitted piece of JavaScript.

## Architectural context

- ADR-0002 governs strictly: ONE inline IntersectionObserver script,
  <600 bytes, no libraries; stages reveal once, aegean accents
- Copy/state labels: docs/copy.md §Protocol verbatim
- Diagram must be readable with CSS disabled (semantic HTML order) and
  complete under reduced-motion
- This changes the gate's zero-JS grep to the ADR-0002 amended form —
  the reviewer will check the script's size and content, not just count

## Declared file scope

- **owned_paths:** src/components/Protocol.astro
- **read_only_paths:** docs/copy.md, src/styles/tokens.css, .metis/adr/0002-zero-js-animation-policy.md

## Definition of Done

- States/captions verbatim; staged reveal on scroll, once
- Exactly one inline script in dist, contains "IntersectionObserver", <600 bytes
- Reduced-motion: full final state; both schemes AA-readable
- npm run verify green

## Test plan

- npm run verify; script count/size/content greps on dist
- Manual: scroll trigger, reduced-motion, both schemes
