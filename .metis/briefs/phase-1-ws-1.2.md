# phase-1-ws-1.2 — Problem, Insight, and Personas sections

- **Type:** feat | **Risk:** low | **Priority:** p2
- **Coder:** claude-code/opus | **Date:** 2026-07-26
- **Plan:** .metis/plans/phase-1.md §1.2

## Goal

Content-complete Problem (with the Insight pull-quote inside it) and
Personas (two-column split) sections, copy verbatim from docs/copy.md.

## Architectural context

- Copy: docs/copy.md §Problem, §Insight, §Personas (ADR-0003 — verbatim)
- The Insight pull-quote lives INSIDE Problem.astro (no seventh component;
  preserves phase-0's component count decision)
- Personas: CSS columns/grid, stacks below 768px; tokens only

## Declared file scope

- **owned_paths:** src/components/Problem.astro, src/components/Personas.astro
- **read_only_paths:** docs/copy.md, src/styles/tokens.css

## Definition of Done

- Copy verbatim; two-column personas ≥768px, stacked below
- Tokens only; zero <script>; npm run verify green

## Implementation notes (coder)

Four decisions a reviewer would otherwise have to re-derive:

1. **One source line per copy string, no inline elements inside one.** The
   copy deck hard-wraps its paragraphs; the verbatim string is the unwrapped
   text. Following phase-1-ws-1.1's `greppable subline` fix, every paragraph,
   list item and caption is written on a single source line so the built
   output greps literally. This is also why the failure list is styled through
   its marker, dividers and spacing rather than by wrapping the phrase before
   each em dash in `<strong>` — that would put
   `<strong>Scope creep</strong> — …` in dist and break the literal grep.
2. **Em dashes are real characters, never CSS-generated or entities.** The
   attribution's leading "— " is part of the copy and lives in the markup;
   a `::before` dash or `&mdash;` would not survive a dist grep.
3. **The Insight quote uses `figure`/`figcaption`, not a nested `footer`.**
   Same idiom as Hero's terminal caption, and it keeps ADR-0004's landmark
   question out of a section that has no business raising it.
4. **`768px` is a raw length by design.** tokens.css owns colour, type and
   spacing and defines no breakpoint scale; the value is the threshold the
   plan (§1.2) specifies. The layout is mobile-first, so the single-column
   case needs no query at all. No other raw value is used at a point of use;
   hex appears in these components only inside contrast-documentation
   comments, mirroring tokens.css's ratio table.

No animation was added — section reveals are phase 2 (ADR-0005) — so dist
still contains zero `<script>`.

## Test plan

- npm run verify; copy grep against dist; hex grep on touched files

Results (2026-07-26):

- `metis verify --post`: ALL GREEN
- 13/13 copy strings from §Problem, §Insight, §Personas found byte-for-byte
  in `dist/index.html` (`grep -F` per string)
- `grep -o '<script' dist/index.html` → 0; no `&mdash;`/`&#8212;` in dist
- `grep -nE '#[0-9a-fA-F]{3,8}'` on both components → no match
