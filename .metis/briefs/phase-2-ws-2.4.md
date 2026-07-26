# phase-2-ws-2.4 — Ledger proof strip in the hero

- **Type:** feat | **Risk:** low | **Priority:** p2
- **Coder:** claude-code/opus | **Date:** 2026-07-26
- **Plan:** .metis/plans/phase-2.md §2.4 (Amendment A)

## Goal

Render the docs/copy.md §Proof stats strip in the hero — three
ledger-measured numbers plus the labeled token-spend estimate and the
dated audit-trail caption — under the ADR-0008 accuracy regime. Also
render the §Hero vendor line (agent-agnostic, zero lock-in) beneath the
subline.

## Architectural context

- Copy renders verbatim from docs/copy.md §Proof and the §Hero vendor
  line (ADR-0003); the numbers are static strings with an as-of date —
  nothing is fetched (OVERVIEW §2.2)
- Stat 4 (`−55%`) is a labeled estimate: its `est.` prefix and "at best
  observed" qualifier are part of the copy and must render — dropping
  either is a P2 finding (ADR-0008)
- Placement: beneath the terminal caption in Hero.astro; the hero renders
  immediately (no data-reveal on the first viewport, per §2.1), so the
  strip must not introduce reveal wiring
- Markup: a semantic list or `<dl>` (value + label pairs), not bare divs;
  values in the display face, labels muted; tokens only
- Mobile-first: stats stack on narrow viewports, row out where space
  allows; must not reintroduce the f-006 class of sub-375px overflow
- ADR-0008 binds the reviewer: recompute every number via the §Proof
  verification notes; a mismatch is a P2 behavior finding

## Declared file scope

- **owned_paths:**
  - src/components/Hero.astro
- **read_only_paths:**
  - docs/copy.md (§Proof — copy source, do not edit)
  - src/styles/tokens.css

## Definition of Done

- Four stats + kicker + caption render verbatim from §Proof; caption
  links to https://github.com/techspeque/metiswww; vendor line renders
  verbatim beneath the subline
- Reviewer's recomputation of the three measured numbers matches; the
  estimate's label and qualifier are intact
- No new script tags; token discipline; AA contrast both schemes
- npm run verify green

## Test plan

- Build and inspect dist: strip + vendor line present, copy byte-identical
  to the deck
- Recompute measured stats per §Proof verification notes (slices-done
  count, findings count, scope-audit state); confirm `est.` renders on
  stat 4; re-verify the vendor line's surface claims against
  `metis surface generate` docs/output
- Both schemes spot-checked; narrow-viewport check at 320/360/375px
  (documentElement scrollWidth == clientWidth)
