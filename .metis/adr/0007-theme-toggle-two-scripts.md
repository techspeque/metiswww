---
type: adr
id: 0007
title: Manual theme toggle; exactly two inline scripts
status: accepted
date: 2026-07-26
phase: 2
supersedes: ADR-0005 (script-count clause only)
---

# ADR-0007: Manual theme toggle; exactly two inline scripts

> Phase: 2 | Status: accepted | Date: 2026-07-26
> Decision drivers: product owner wants a visible light/dark switch
> (Amendment A); OVERVIEW §3.2 requires both schemes styled; ADR-0002/0005
> limited the site to one inline script for animation only

## Context

The site is dark-first with a fully styled light scheme, switched purely by
`prefers-color-scheme` (tokens.css). A manual toggle cannot be expressed in
CSS alone: it needs state (the visitor's choice), persistence across
reloads, and a pre-paint read of that state to avoid a flash of the wrong
theme. That is JavaScript, and ADR-0005 allows exactly one script, scoped
to scroll-triggered motion.

## Decision

- **Attribute-driven theming.** Semantic tokens keep their current
  structure: dark on `:root` (default), light inside the existing
  `prefers-color-scheme: light` media query. Two new blocks —
  `:root[data-theme="light"]` and `:root[data-theme="dark"]` — repeat the
  semantic assignments at higher specificity (0,2,0), so a manual choice
  beats the OS preference in both directions. No `data-theme` attribute =
  today's behavior, untouched.
- **A second, pre-paint inline script** in the `<head>` of Base.astro,
  placed before the stylesheet links. It: reads localStorage key `theme`
  (`"light"` | `"dark"`; anything else ignored), sets `data-theme` on
  `<html>`, un-hides the toggle button, wires one delegated click listener
  on `[data-theme-toggle]` that flips the attribute, persists the choice,
  and syncs the button's `aria-pressed`/label. Budget: **≤ 768 bytes**.
- The ADR-0005 observer is unchanged (≤ 1024 bytes). The site's total
  script policy becomes: **exactly two inline scripts, no others, no
  libraries, combined ≤ 1792 bytes**.
- **Progressive enhancement.** The button ships with the `hidden`
  attribute; only the script reveals it. With JS disabled the control is
  absent and the page behaves exactly as before this ADR.
- **Privacy unchanged.** One localStorage key on the visitor's device;
  no cookies, no tracking, nothing transmitted (OVERVIEW §3.3, §5).

## Consequences

- The gate grep changes from "exactly one inline script ≤ 1KB" to
  "exactly two inline scripts: theme ≤ 768 B in head before stylesheets,
  observer ≤ 1024 B".
- The `<meta name="theme-color">` pair stays media-query-driven: when a
  manual override is active, browser chrome may follow the OS scheme
  rather than the chosen one. Accepted — syncing it would spend script
  budget on cosmetics. Revisit only if Lighthouse (ws-2.2) objects.
- The light-scheme token block is duplicated (media query + attribute
  block). tokens.css must carry a comment binding the two copies: editing
  one without the other is a review finding.

## Rules this decision implies

- Any third script tag, external script, or inline handler attribute is a
  review finding (severity P2, category scope).
- The toggle must never gate content: it changes tokens only. Pre-theme
  state must not hide or shift page content (no layout shift when the
  button un-hides — reserve its box).
- localStorage access is wrapped so a thrown exception (private mode,
  disabled storage) degrades to OS-preference behavior, never a broken
  page.
