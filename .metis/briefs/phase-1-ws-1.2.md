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

## Test plan

- npm run verify; copy grep against dist; hex grep on touched files
