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
- **A one-line rail replaced the U-turn geometry I first reached for.** See
  the f-005 section below for what the return path is now.

## Review cycle 1 — f-005 (P2, behavior)

The reviewer blocked on two counts, both accepted without argument. The
second is the question this brief had already raised.

**1. The return path did not convey the return.** Cycle 1 rendered
`blocked → rework` as a chip centred beneath the flow on a plain riser. It
sat after `done` in document order, and the riser had no direction and no
second endpoint — it stopped in the gap between `coded` and `reviewed`
instead of leaving one card and entering the other. My own note calling the
placement "the accepted trade" was wrong: the constraint I claimed (that CSS
could not row-align a sibling chip without `display: contents`) only binds
if the label stays a sibling of the `<ol>`. It does not have to be.

The label now lives inside the `reviewed` `<li>`, which fixes both channels
at once:

- **Order.** CSS-disabled and screen-reader order is now
  "reviewed … / blocked → rework" *before* `done`, so the branch is attached
  to the state it leaves.
- **Direction.** A dashed rail — three strokes on one absolutely positioned
  box — runs from `reviewed` back to `coded` and ends in an arrowhead on
  `coded`'s own edge. Stacked, it leaves reviewed's midline, runs up the
  gutter and turns in at coded's midline; in the row layout it becomes a U
  below the row, from reviewed's centre back up into coded's bottom edge.
  The label rides the rail at its midpoint, carrying `--color-bg` so the
  stroke does not show through it.

Three stacked-layout changes are forced by that geometry, not chosen:
`grid-auto-rows: 1fr` (equal rows are what make "half a card up from
reviewed's middle" land on coded's middle — with content-sized rows the
distance is not expressible in CSS), a `--space-6` row gap (the label band
has to fit between two cards without touching either), and a `--space-5`
inline-start padding on the list (somewhere for the vertical run to go that
is neither on top of a card nor outside the section).

The `<span>` around the label is a positioning hook, not a split: the copy
string is the span's whole contents, one uninterrupted text node, so the
dist grep still matches it. Same for the caption the `<p>` now follows.

**2. `role="list"` added.** `list-style: none` makes WebKit drop the list
role, and that role is the entire justification for the connectors being
decorative. One attribute; no trade-off to weigh.

Also fixed while verifying the above, and worth naming because it was
invisible in the source: the row-layout `@media` block sat *above* the rail's
base rules, so at equal specificity the base rules won and none of the
row-layout overrides applied — the rail rendered with stacked geometry on a
wide viewport. The block now comes last, after every rule it overrides.

## Test plan

- npm run verify; script count/size/content greps on dist
- Manual: scroll trigger, reduced-motion, both schemes

Results (2026-07-26, re-run after the f-005 fix — every number below is from
the post-fix build) — clean build (`rm -rf dist` first), live check in Chrome
against `astro preview`:

- `metis verify --post`: ALL GREEN
- Script: `<script` appears **1** time in all of `dist/`; one script element,
  no attributes, **177 bytes** of inline content (limit 600), contains
  `IntersectionObserver`; 0 `src=` script refs and 0 `.js`/`.mjs` files in
  `dist/`. Unchanged by the fix — no script edit. Built CSS 13,860 bytes
  (gate limit 50KB)
- Copy: §Protocol carries **eight** copy-marked entries. The seven that are
  rendered strings — the section heading, the four captions, the loop label
  and the section footer line — were each found byte-for-byte in
  `dist/index.html` (`grep -F` per string), including `blocked → rework`.
  The eighth, "Diagram states (in order): pending → coded → reviewed → done",
  is deliberately not grepped as a string: it is a structural spec, and the
  state names render as the first word of each caption with the `<ol>`
  carrying the order (implementation note 3). No `&mdash;`/`&rarr;` entities
  anywhere in dist
- Semantics (f-005 part 1): `role="list"` present on the `<ol>` in dist; the
  label renders inside the `reviewed` item —
  `…identity checked<p class="loop"><span class="loop-label">blocked → rework`
  — so it precedes `done` in document order
- Return path geometry, measured from `getBoundingClientRect()` rather than
  inferred, in both layouts:
  - stacked (real 614px viewport): rows all 72px (`grid-auto-rows: 1fr`
    holds), gap 48px, label 40px and clearing both cards; rail bottom lands
    on reviewed's midline (0px off), rail top on coded's midline (2px off),
    rail's inner edge on the cards' left edge (1px off). The 1-2px is the
    li's padding box vs the row's border box — expected, invisible
  - row layout (real 1900px viewport): rail top on the cards' bottom edge
    (1px), left riser on coded's centre (2px), right riser on reviewed's
    centre (0px), label centred on the bottom run (0px), and the label
    clears the closing paragraph
  - arrowhead rotation reads `rotate(45deg)` stacked (points in along the
    top stroke) and `rotate(-45deg)` in the row layout (points up into
    coded's bottom edge)
  - both layouts draw exactly three dashed aegean strokes with the fourth
    side `none`, and the head solid aegean
- No overflow: emulated 360px viewport (main content box 312px) — rail and
  label both inside the content box, `scrollWidth == clientWidth`
- Scroll trigger: at page top the section carries only `class="section"` and
  every state, the rail and the label already compute to `opacity: 1` —
  content is never hidden. On scrolling in, the class becomes
  `section is-revealed` and the reveal runs `animation-delay`
  0/140/280/420ms with the rail last at 560ms, `fill-mode: backwards`,
  `duration: 320ms`, settling at `opacity: 1`
- Reduced motion: every animation-bearing rule for this component sits inside
  the single `(prefers-reduced-motion: no-preference)` media rule in the
  built CSS (enumerated via CSSOM — nothing outside it touches opacity or
  animation). Disabling that rule leaves all six elements at `opacity: 1`,
  `animation-name: none`, and their real heights (117/117/117/117/32/40)
- No-JS: removing `is-revealed` leaves the same complete final state
- Schemes: dark rendered live. Light verified by applying tokens.css's light
  override values to `:root` and re-reading computed styles — card
  `#FFFFFF`/text `#0E1116` (18.91:1), label and closing line `#5C636E` on
  `#FAF7F0` (5.66:1), label fill `#FAF7F0`, connectors and rail `#1F6B63`.
  Note this exercises the component's use of the tokens, not the
  `prefers-color-scheme` query itself, which belongs to tokens.css and was
  reviewed in phase 0
- Contrast: no aegean text anywhere — `#2E8C83` on the card surface `#171B22`
  computes to 4.27:1 and would fail AA, which is why it is decorative-only
- Raw hex in the component appears only inside the frontmatter contrast
  comment, which is compiled away (mirrors tokens.css's ratio table)
