# phase-2-ws-2.5 — Workflow section: run it from two terminals

- **Type:** feat | **Risk:** medium | **Priority:** p2
- **Coder:** claude-code/opus | **Date:** 2026-07-26
- **Plan:** .metis/plans/phase-2.md §2.5 (Amendment A)

## Goal

A new section between Protocol and Install showing how metis is actually
driven: two terminals — coder agent and reviewer agent — trading four
short prompts while the protocol carries the context.

## Architectural context

- New src/components/Workflow.astro; copy verbatim from docs/copy.md
  §Workflow (heading, lead, four-step loop, footer line)
- Registered in index.astro between `<Protocol />` and `<Install />`
- CRITICAL copy discipline: the four step lines are human prompts to an
  agent, NOT shell commands — render them without a `$` glyph, visually
  distinct from CLI output (e.g. a chat-style or quoted treatment inside
  the terminal frame). The parenthetical captions are CLI-behavior claims
  already verified in the deck; render them as captions, not transcripts.
- Visual language echoes the hero terminal (surface, border, mono) without
  duplicating its typing animation; the 1↔2 alternation should read as a
  loop — a simple alternating layout is enough, no new animation concepts
- Reveals: section carries data-reveal per ADR-0005 (observer landed in
  2.1); pre-reveal state must never hide content; reduced-motion and no-JS
  render the section complete
- Landmarks/headings: `<section>` under main with an h2, consistent with
  siblings (ADR-0004 rules unaffected)

## Declared file scope

- **owned_paths:**
  - src/components/Workflow.astro
  - src/pages/index.astro
- **read_only_paths:**
  - docs/copy.md (§Workflow — copy source, do not edit)
  - src/components/Hero.astro (visual reference only)
  - src/styles/tokens.css

## Definition of Done

- Section renders §Workflow verbatim, in source and visual order between
  Protocol and Install
- Prompts visually distinct from CLI output; no invented CLI transcripts
- Exactly one inline script still (theme arrives in 2.6); no-JS and
  reduced-motion complete
- Token discipline; AA both schemes; npm run verify green

## Test plan

- Build; diff rendered strings against §Workflow
- Grep dist/index.html script count (== 1 at this workstream)
- JS-disabled and reduced-motion render checks; both schemes; heading
  outline unchanged (one h1, ordered h2s)
