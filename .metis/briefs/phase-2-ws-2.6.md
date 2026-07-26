# phase-2-ws-2.6 — Manual theme toggle (ADR-0007)

- **Type:** feat | **Risk:** high | **Priority:** p2
- **Coder:** claude-code/opus | **Date:** 2026-07-26
- **Plan:** .metis/plans/phase-2.md §2.6 (Amendment A)

## Goal

A top-of-page light/dark toggle that overrides the OS preference in both
directions, persists in one localStorage key, adds a second pre-paint
inline script within ADR-0007's budget, and disappears entirely without
JS.

## Architectural context

Read ADR-0007 in full before coding. Summary of the binding parts:

- tokens.css: dark stays the `:root` default; the existing
  `prefers-color-scheme: light` block is untouched; add
  `:root[data-theme="light"]` and `:root[data-theme="dark"]` blocks
  repeating the semantic assignments (specificity 0,2,0 beats the media
  query's 0,1,0 both ways). Add the comment binding the two light copies —
  they must be edited together.
- Theme script: inline in Base.astro `<head>` BEFORE the stylesheet
  imports' emitted links; ≤ 768 bytes. Reads localStorage `theme`
  (only `"light"`/`"dark"` honored), sets `data-theme` on `<html>`,
  un-hides `[data-theme-toggle]`, delegated click listener flips +
  persists + syncs `aria-pressed` and the accessible label. Wrap storage
  access in try/catch — private mode degrades to OS behavior.
- Button: rendered by Base.astro before the slot, positioned top-right,
  ships with `hidden`; reserve its space so un-hiding causes no layout
  shift. Accessible name verbatim from docs/copy.md §ThemeToggle; in tab
  order; focus-visible ring via --color-focus-ring; AA in both schemes.
- meta theme-color stays media-query-driven (accepted mismatch, see
  ADR-0007 consequences) — do not spend bytes syncing it.
- Astro note: use `is:inline` on the script so the compiler neither
  bundles nor hoists it; verify the built head order (script before CSS).

## Declared file scope

- **owned_paths:**
  - src/layouts/Base.astro
  - src/styles/tokens.css
- **read_only_paths:**
  - docs/copy.md (§ThemeToggle — copy source, do not edit)
  - src/components/ (toggle is layout chrome, not a section component)

## Definition of Done

- Exactly two inline scripts in dist/index.html: theme (head, before
  stylesheets, ≤ 768 B) + observer (unchanged, ≤ 1024 B); no others
- Override works OS-dark→light and OS-light→dark; persists across reload
  with no wrong-theme flash; JS disabled = no toggle, behavior identical
  to pre-2.6
- One localStorage key (`theme`), no cookies; button fully keyboard
  operable with correct aria state
- npm run verify green; existing greps (hex, landmarks) unchanged

## Implementation decisions (coder, recorded before the code commit)

- **"Reserve its box" is met by taking the box out of flow.** ADR-0007 asks
  for no layout shift when the button un-hides and names a reserved box as
  the means. The toggle's bar is absolutely positioned instead: an
  out-of-flow box contributes nothing to layout at any point, so there is
  no shift to reserve against — the stronger guarantee of the same
  property, and it does not cost every visitor ~48px of dead space above
  the hero (including the no-JS ones who never get the control). Rationale
  is repeated at the CSS in Base.astro.
- **No `<header>` wrapper.** Wrapping the button would add a `banner`
  landmark the page does not have today (empty for no-JS visitors) and
  would change the landmark set this slice's DoD asks to leave unchanged.
- **`aria-pressed` is defined as "the light scheme is active".** Pairing a
  pressed state with an action-phrased label ("Switch to dark theme,
  pressed") is an acknowledged ARIA tension, but ADR-0007 mandates syncing
  `aria-pressed` and the label wording is fixed by the copy deck. One
  consistent definition, stated in Base.astro's frontmatter.
- **Visible affordance:** the two-tone disc explicitly sanctioned by
  docs/copy.md §ThemeToggle, drawn in CSS, no text, no emoji. The
  accessible name carries the meaning.

## Test plan

- Build; grep script count/sizes/positions in dist/index.html
- Serve dist; emulate both OS schemes × both manual choices (4 states);
  reload persistence; hard-refresh flash check with throttled CPU
- JS-disabled render (both OS schemes); keyboard-only operation; SR label
  announcement matches §ThemeToggle
- Private-mode/localStorage-disabled smoke test (no console errors, OS
  fallback intact)
