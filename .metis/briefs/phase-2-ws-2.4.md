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

## Out-of-scope touches

None. docs/copy.md stays read-only — see the deferral below.

## Notes for the reviewer

**Stat 1 (`9/9`) is stale by one, and rendering it verbatim is deliberate.**
Recomputed at `fdde402` (archive of phase-2-ws-2.1), `.metis/slices-done.yaml`
holds **10** entries, not the 9 the §Proof verification note enumerates. The
count moved after the copy deck was written; the *claim* did not — all 10
entries carry `reviewed: true` with a `reviewer` slug different from their
`coder`, so "independently reviewed — never by their author" still holds at
10/10.

This is the situation ADR-0008 anticipates: the as-of date carries the claim,
and "refreshing them is a future chore slice that re-runs every verification
note". It is not a fix for this slice. Correcting it here would mean editing
docs/copy.md, which this brief declares read-only and which f-010 already
established as an out-of-scope P2. **Recommend a phase-2 chore slice** that
re-runs all four verification notes and re-dates the caption — ideally after
2.6, so it captures a settled ledger rather than one that moves again on the
next archive.

Stats 2 (`10` findings, f-001..f-010) and 3 (`0` out-of-scope files,
`metis log phase-1-gate --validate -o json` → `ok=true`) both recompute clean
as of this commit. Note that recording an advisory finding against this slice
would itself invalidate stat 2 — hence this brief note rather than
`metis findings record`.

Separately, and also not edited: the §Proof blockquote at docs/copy.md:85-86
("No estimates render on the site unless visibly labeled `est.`; none are
used here") contradicts stat 4, which *is* a labeled estimate. It is an
authoring note, not rendered copy, so nothing on the site is affected — one
for the same refresh chore.
