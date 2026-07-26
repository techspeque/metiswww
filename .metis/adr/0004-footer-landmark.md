---
type: adr
id: 0004
title: Footer becomes a sibling of main (contentinfo landmark)
status: accepted
date: 2026-07-26
phase: 1
---

# ADR-0004: Footer becomes a sibling of main (contentinfo landmark)

> Phase: 1 | Status: accepted | Date: 2026-07-26
> Decision drivers: ws-0.3 review observation — a footer nested in main
> never maps to the contentinfo ARIA landmark

## Context

Phase 0's acceptance criteria forced all six components (including Footer)
inside one `<main>`, which suppresses the `contentinfo` landmark. The ws-0.3
reviewer flagged it and correctly attributed it to the plan, recommending a
phase-1 amendment.

## Decision

In Phase 1, `Footer.astro` moves out of `<main>` to be a direct child of
`<body>` (rendered as `<main>…</main><Footer/>` in `index.astro`). The
phase-0 "six headings inside one main" criterion is superseded for Footer.

## Rules this decision implies

- Landmark integrity is reviewable: one `<main>`, one `<footer>` as body
  child, exactly one `<h1>`.
