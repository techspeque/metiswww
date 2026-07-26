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
  - docs/copy.md
  - .metis/adr/0009-proof-stats-are-human-owned.md
- **read_only_paths:**
  - src/styles/tokens.css

> Scope widened in review cycle 1, on the product owner's authorisation, to
> resolve f-011. docs/copy.md moved from read_only to owned because f-011 is
> a false *claim* in the deck, and ADR-0003 requires the fix to land in the
> deck first — it cannot be fixed in the component alone. ADR-0009 is new and
> is what stops the finding from recurring. Both were drafted for approval
> and approved before being written; the deck edit is confined to §Proof.
> Mechanism follows f-010's resolution (51e7093), which amended that brief's
> owned_paths to declare the reality rather than leaving the scope audit red.

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

## Scope amendment (review cycle 1, product owner)

**Presentation deviates from plan §2.4, on the product owner's direction.**
After reviewing the first cut they judged the strip "really bad and plain —
it does not effectively grab the attention", chose a replacement treatment
from three options, and authorised the deviation as a scope call. Recorded
here because the authorisation happened in session, not in the plan.

§2.4 asks for a 2×2 grid with values "styled display". As shipped:

- Values in `--font-mono`, not the display face — the site's idiom for
  machine output, matching the transcript directly above; a ledger reading
  in the display face reads as a marketing stat
- Values in `--color-secondary` (aegean), the token assigned to success
  states, which is what a measured proof number is. Gold was rejected: the
  hero already spends it on the caret and the primary CTA, and OVERVIEW
  §3.2 asks for it sparingly
- The estimate's value in `--color-muted`, so measured-vs-estimated is
  legible before a word is read (reinforces stat 4's `est.`, does not
  replace it)
- One row of four at ≥1024px, divided by hairlines, to remove the dead
  space 2×2 left in wide tracks. **The plan's 2×2 survives as the
  640–1023px band**; below 640px it stacks, as §2.4 requires

Plan §2.4 has not been edited — amending the plan is the Human's act. If
the product owner prefers, this brief is the record and the plan text
stands as the original intent.

Contrast for the new pairings, from the tokens.css table: secondary on
background 4.68:1 dark / 5.87:1 light (AA as normal text; the values render
well above the 24px large-text threshold besides), muted on background
8.39:1 dark / 5.66:1 light. Both verified live in both schemes.

Breakpoint logic verified from the built stylesheet rather than by
resizing: base (<640px) emits no `.stat` padding or divider rules at all;
≥640px sets them and resets `:nth-child(odd)`; ≥1024px restores odd cells
and resets `:first-child`. Widest cell min-content is 100px against the
272px available at a 320px viewport — no f-006-class overflow. Lightning
CSS rewrites both `min-width` queries to `width>=` range syntax, the same
transform f-004 recorded as advisory; no new behaviour.

## f-011 resolution (review cycle 1)

**The finding was correct and is fixed.** Stat 2's label claimed all findings
were caught "after the author had called the work done". False for three:
f-006, f-007 and f-008 were advisories the coder self-recorded during the
phase-1 gate, committed at 6ce3545/106f067/9b6ca1e — 30 seconds before
4494d3d, that gate's first `flip coded`. Verified by commit timestamp.

Two further facts found while confirming it:

- `.metis/findings.yaml` records **no author, agent or reviewer field**
  (fields are: id, date, slice, severity, category, finding, status,
  resolved_by). Any authorship claim about a finding can therefore only be
  inferred from commit position. The replacement label makes no authorship
  claim at all, which removes the class of defect rather than restating it.
- Raising f-011 took findings.yaml to 11 entries, making stat 2's own value
  wrong in the act of reporting stat 2. That is the loop ADR-0009 exists to
  cut.

**Replacement label** (product owner chose the broad option over a narrower
"raised by an independent reviewer…" wording that would have forced the value
to 8): "findings logged against this site's own slices — every one public in
the ledger, none ever removed". True of all 11 regardless of who raised them.
"None ever removed" is independently auditable: replaying every commit that
touched findings.yaml gives a monotonically non-decreasing entry count
(0,1,2,3,3,4,5,5,6,7,8,9,9,9,9,10,10,11), so nothing was ever deleted. The
verification note in the deck carries that command.

**Value stays `10`** and is now merely stale, which ADR-0009 demotes to a
non-finding. It is the Human's pre-release refresh, not slice work.

## ADR-0009 (new, drafted this cycle and approved)

Amends ADR-0008 — does not supersede it. ADR-0008 obliged the reviewer of any
stats-rendering slice to recompute every number, but the ledger those numbers
measure is mutated by reviewing the slice that renders them, so each fix
invalidates the next number. The ADR draws the line that was missing: a stale
**value** is not a finding, a false **label** is. Values become Human-owned
and are refreshed once before the dev → main merge. Every other ADR-0008
clause — estimates visibly labeled, no invented percentages, verification
notes retained so a reader can audit — stands unchanged.

## Notes for the reviewer

**Stat 1 (`9/9`) is stale by one — under ADR-0009 this is now explicitly not
a finding, and rendering it verbatim is correct.**
Recomputed at `fdde402` (archive of phase-2-ws-2.1), `.metis/slices-done.yaml`
holds **10** entries, not the 9 the §Proof verification note enumerates. The
count moved after the copy deck was written; the *claim* did not — all 10
entries carry `reviewed: true` with a `reviewer` slug different from their
`coder`, so "independently reviewed — never by their author" still holds at
10/10.

This is the situation the as-of date exists to carry, and ADR-0009 now says
so outright: the value is Human-owned, agents render it verbatim, and it is
refreshed once before the dev → main merge rather than chased slice by slice.
The earlier draft of this note recommended a phase-2 chore slice for the
refresh; ADR-0009 supersedes that — it is a Human act needing no ledger entry,
and a chore slice would itself move the numbers again on archive.

Stat 2's value (`10`) is likewise stale at 11 and likewise not a finding — see
the f-011 section above for the label fix, which *was* required. Stat 3 (`0`
out-of-scope files, `metis log phase-1-gate --validate -o json` → `ok=true`)
recomputes clean as of this commit.

Note the reason none of this was raised via `metis findings record`: doing so
would increment findings.yaml and invalidate stat 2 again. The brief is the
right instrument for a stats observation, and ADR-0009 rule 1 now says so.

**Vendor-line claims check out.** `metis surface generate` exists in v0.0.6
(`metis surface --help` → `generate` / `validate`), and all four adapter files
the §Hero verification note names are present in this repository: CLAUDE.md,
AGENTS.md, opencode.json, .claude/settings.json. The cross-vendor pairing the
note cites is visible in `.metis/slices-done.yaml` (phase-1 entries:
`coder: claude-code/opus`, `reviewer: opencode/gpt-5.6-sol`).

**The audit link resolves.** `gh repo view techspeque/metiswww --json
visibility` → `PUBLIC`, so the caption's invitation is live for a visitor
today rather than only after the dev → main merge.

Separately, and also not edited: the §Proof blockquote at docs/copy.md:85-86
("No estimates render on the site unless visibly labeled `est.`; none are
used here") contradicts stat 4, which *is* a labeled estimate. It is an
authoring note, not rendered copy, so nothing on the site is affected — one
for the same refresh chore.
