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

## Implementation notes (coder)

Six decisions a reviewer would otherwise have to re-derive:

1. **Aegean is decorative-only in this diagram.** The plan asks for "aegean
   accents", and the natural card treatment puts them on `--color-surface`.
   Recomputed: `#2E8C83` on `#171B22` is **4.27:1** — below AA for normal
   text, and a pairing tokens.css's ratio table does not cover (it documents
   aegean on the *base* `#0E1116` at 4.68:1). So aegean appears only as flow
   connectors and node markers, which carry no text and no information the
   markup does not already carry (the `<ol>` carries order). Every string in
   the diagram uses `--color-text` / `--color-muted`, whose pairings on
   surface are already in the table (16.14:1 / 7.66:1 dark, 18.91:1 / 6.06:1
   light).
2. **State captions are unsplit single-line text nodes, and there is no
   separate state heading.** The deck's caption already begins with the state
   name ("pending — dispatched by ..."), so a heading would duplicate it, and
   wrapping the name — or the backticked `metis next` — in an element would
   put `<code>`/`<span>` inside the string and break the literal dist grep.
   This is the convention phase-1-ws-1.1 established and phase-1-ws-1.2
   documented; the state name loses distinct typography, which is the correct
   trade against a cross-vendor verbatim check.
3. **"blocked → rework" carries a real arrow character.** It is a rendered
   copy string (deck: "Loop label (block path)"), so the `→` lives in the
   markup, not in a CSS `::before` — same reasoning as phase-1-ws-1.2's em
   dashes. Connectors *between* the four states stay decorative CSS: "states
   in order" is a structural spec, not a rendered string.
4. **Animation is opt-in via `animation-fill-mode: backwards`.** The base
   rules render the finished diagram, and the staged reveal exists only
   inside `@media (prefers-reduced-motion: no-preference)`, keyed off an
   `is-revealed` class. With JS off, or the observer unsupported, or
   reduced-motion set, the diagram is complete and static — never hidden
   (ADR-0002's final-state rule; ADR-0005's never-invisible rule). `backwards`
   is what lets each state hold its start frame through its stagger delay
   without an `opacity: 0` base.
5. **The observer watches the `<section>`, at the default threshold.** A
   ratio threshold on the diagram itself can never be met when the diagram is
   taller than the viewport (four stacked cards on a narrow phone), so the
   reveal would never fire. Watching the section at threshold 0 also arms the
   stagger at the heading, before the states scroll into view. The class
   lands on an element inside this component, which is required for Astro's
   scoped selectors to match it.
6. **`<script is:inline>`, one line, at the end of the component.** A plain
   `<script>` would be bundled to an external module — ADR-0002 requires the
   script to be *inline*. `is:inline` is passed through verbatim and is not
   minified, so it is hand-minified and its source bytes are its dist bytes.

Deferred deliberately: no `data-reveal` generalization — that is
phase-2-ws-2.1's slice under ADR-0005.

## Test plan

- npm run verify; script count/size/content greps on dist
- Manual: scroll trigger, reduced-motion, both schemes
