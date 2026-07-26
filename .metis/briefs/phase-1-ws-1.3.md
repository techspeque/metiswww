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

Two things found while checking the build, recorded so the reviewer does not
have to rediscover them:

- **No HTML comment beside the script.** An HTML comment explaining the
  script survives into dist, and one that named a script element literally
  put a second `<script` in `dist/index.html` — the phase gate counts those.
  The rationale moved into the frontmatter, which is compiled away.
- **The loop chip is centred, and that is a placement decision.** The block
  path leaves the flow after `reviewed` and returns to `coded`. Centring the
  chip puts its riser exactly in the gap between those two cards in the
  four-track layout (the centre of a four-track grid falls in that gap), and
  on the chain's own vertical spine when stacked. In the stacked layout the
  chip necessarily sits below `done`, because it follows the `<ol>` in
  document order; its dashed stroke marks it as a branch off the solid main
  flow rather than a fifth state. CSS cannot row-align it to the third card
  either: the states are grid items of the `<ol>`, so a section-level grid
  would need `display: contents` on the `<ol>` — which strips the list
  semantics the diagram's reading order depends on — and absolute
  positioning would need a magic offset that breaks as soon as a caption
  wraps. A fragile layout hack is worse than the documented trade.

## Open question for the reviewer

`.lifecycle` is an `<ol>` with `list-style: none`. WebKit is known to drop
the list role from a list styled that way unless an explicit `role="list"` is
present, which would weaken the "the `<ol>` carries the order" argument that
justifies the decorative connectors — for VoiceOver specifically, not for the
CSS-disabled case (markers return when the stylesheet is gone) and not for
DOM reading order (each caption still opens with its state name). I have not
verified the behaviour in a real screen reader, and the dispatch has moved to
Reviewer, so this is raised rather than changed. If it holds, `role="list"`
on the `<ol>` is the whole fix. Note it does not transfer to
`Problem.astro`'s list, which is out of scope here and whose order is not
semantic.

## Test plan

- npm run verify; script count/size/content greps on dist
- Manual: scroll trigger, reduced-motion, both schemes

Results (2026-07-26) — clean build (`rm -rf dist` first), live check in Chrome
against `astro preview`:

- `metis verify --post`: ALL GREEN
- Script: `<script` appears **1** time in all of `dist/`; one script element,
  no attributes, **177 bytes** of inline content (limit 600), contains
  `IntersectionObserver`; 0 `src=` script refs and 0 `.js`/`.mjs` files in
  `dist/`. Built CSS 12,779 bytes (gate limit 50KB)
- Copy: §Protocol carries **eight** copy-marked entries. The seven that are
  rendered strings — the section heading, the four captions, the loop label
  and the section footer line — were each found byte-for-byte in
  `dist/index.html` (`grep -F` per string), including `blocked → rework`.
  The eighth, "Diagram states (in order): pending → coded → reviewed → done",
  is deliberately not grepped as a string: it is a structural spec, and the
  state names render as the first word of each caption with the `<ol>`
  carrying the order (implementation note 3). No `&mdash;`/`&rarr;` entities
  anywhere in dist
- Scroll trigger: at page top the section carries only `class="section"` and
  every state and the chip already compute to `opacity: 1` — content is never
  hidden. On scrolling in, the class becomes `section is-revealed` and the
  states animate with `animation-delay` 0/140/280/420ms, `fill-mode:
  backwards`, `duration: 320ms`, settling at `opacity: 1`
- Reduced motion: every animation-bearing rule for this component sits inside
  the single `(prefers-reduced-motion: no-preference)` media rule in the
  built CSS (enumerated via CSSOM — nothing outside it touches opacity or
  animation). Disabling that rule leaves all five elements at `opacity: 1`,
  `animation-name: none`, `transform: none`, non-zero height
- No-JS: removing `is-revealed` leaves the same complete final state
- Layouts: stacked below 1024px (verified at a real 560px viewport) and four
  tracks above (verified at a real 1900px viewport); connectors are
  `::before`/`::after` on every state but the first, chevrons rotate 135°
  stacked / 45° across. The chip's centre and the chain's centre line agree
  to the pixel in both (280/280 and 950/950)
- Schemes: dark rendered live. Light verified by applying tokens.css's light
  override values to `:root` and re-reading computed styles — card
  `#FFFFFF`/text `#0E1116` (18.91:1), chip and closing line `#5C636E` on
  `#FAF7F0` (5.66:1), connectors `#1F6B63`. Note this exercises the
  component's use of the tokens, not the `prefers-color-scheme` query itself,
  which belongs to tokens.css and was reviewed in phase 0
- Contrast: no aegean text anywhere — `#2E8C83` on the card surface `#171B22`
  computes to 4.27:1 and would fail AA, which is why it is decorative-only
- Raw hex in the component appears only inside the frontmatter contrast
  comment, which is compiled away (mirrors tokens.css's ratio table)
