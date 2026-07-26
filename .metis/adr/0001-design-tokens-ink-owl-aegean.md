---
type: adr
id: 0001
title: Design tokens — ink/owl/aegean palette, two-font system
status: accepted
date: 2026-07-26
phase: 0
---

# ADR-0001: Design tokens — ink/owl/aegean palette, two-font system

> Phase: 0 | Status: accepted | Date: 2026-07-26
> Decision drivers: "quirky but professional, never vibe-coded" (OVERVIEW §3.2)

## Context

The site needs an authored visual identity. Metis is the Greek titaness of
wise counsel; the identity derives from that: ink (depth), owl-gold
(Athena's owl — wisdom, used sparingly), aegean teal (the sea — secondary).

## Decision

- Brand constants: ink `#0E1116`, parchment `#FAF7F0`, owl-gold `#D4A24E`,
  aegean `#2E8C83`. Assigned ONLY to custom properties in
  `src/styles/tokens.css`; components consume semantic tokens exclusively.
- Dark-first; full `prefers-color-scheme: light` override. Where a brand hex
  fails WCAG AA in a scheme, a derived variant is defined next to it (e.g.
  light-mode gold `#8A5A12`, 5.53:1 on parchment) — never ship a failing pair.
- Two fonts maximum: Space Grotesk (display), JetBrains Mono (code/terminal),
  self-hosted variable woff2 with committed OFL licenses.
- 8px spacing rhythm (`--space-*`), 1.25 modular type scale (`--text-*`).

## Consequences

Palette changes are single-file. The `src/consts.ts` theme-color hex pair
mirrors ink/parchment (meta tags cannot read CSS vars) — update both when
the palette changes.

## Rules this decision implies

- Raw color values outside `tokens.css` (and the documented `consts.ts`
  mirror) are a review finding.
- Every rendered color pairing meets WCAG AA in both schemes, documented in
  the tokens contrast table.
