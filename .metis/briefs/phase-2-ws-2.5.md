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

## Presentation notes (coder, recorded before implementation)

Additive to everything above — nothing in the Goal, Architectural context,
Definition of Done or Test plan is withdrawn or replaced.

1. **Three copy strings per step, not one.** Each deck step publishes an
   attribution (`Terminal 1 — the coder:`), a quoted prompt, and a
   parenthetical caption on one markdown line. They render as three sibling
   elements, each holding ONE uninterrupted text node, split only at the
   deck's own bold/quote/italic boundaries. A single text node is not
   available: the DoD requires the prompt to be visually distinct from the
   caption, which needs separate elements. This is consistent with how the
   deck treats every other separately-rendered string (§Personas publishes
   column heading and body as distinct fields; §Proof publishes stat value
   and label as distinct fields).
2. **The quote marks render.** They are literal characters in the deck and
   they are the "quoted treatment" the Architectural context asks for. Copy
   characters are never generated from CSS on this site (Problem.astro's
   em-dash rule).
3. **No `$` anywhere in the section.** The plan's "prompt glyph" is honored
   as terminal *chrome*: a decorative caret block in each card's title bar,
   beside the attribution — never in front of the human words, which is what
   would make a prompt read as a shell command.
4. **Layout is a staircase, not a grid.** From 768px, odd steps sit in the
   left column and even steps in the right, one step per row, so the
   1↔2 alternation reads as the ping-pong loop. Below 768px it is one column
   in document order. `<ol>` carries the order (role="list" per f-005), so
   the connectors-free layout loses nothing with CSS off.
5. **Two typographic registers.** Title bar and caption are mono (terminal
   chrome and machine narration); the prompt is the display face, one step
   larger and full-strength. No transcript, no command line, no output block
   is rendered anywhere in the section.
6. **Caret colour alternates** gold (coder) / aegean (reviewer). Purely
   decorative and redundant with the attribution text, which names the
   terminal; aegean is tokens.css's diagram accent and this staircase is a
   diagram of the loop.
7. **CLI claims re-verified independently** against metis 0.0.6 in this
   session rather than inherited from the deck's note: `metis kickoff` prints
   the session protocol; `metis next -o json` returns one active-slice object
   (deterministic dispatch, never a list); `metis commit --help` shows
   `--brief`, `--flip coded|reviewed` and `--agent` "required with --flip
   reviewed for cross-vendor validation"; kickoff step 5 documents `metis
   verify`'s distinct exit codes (0 / 1 / 2); scope auditing and findings are
   `metis log <id> --validate`, `metis block`, `metis findings record`.
8. **No script, no local animation.** The component declares only
   `--reveal-delay` values, consumed by index.astro's ADR-0005 rule, so
   reduced-motion and no-JS completeness is structural rather than asserted.

## Out-of-scope touches

None. index.astro's frontmatter comment counts ("five content sections",
"four opted-in sections") are corrected inside that owned file, per hard
rule 9 — reality beats documents.
