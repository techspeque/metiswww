# phase-3-ws-3.1 — Hero & colophon copy corrections

- **Type:** fix | **Risk:** low | **Priority:** p2
- **Coder:** claude-code/opus | **Date:** 2026-07-27
- **Plan:** .metis/plans/phase-3.md §3.1

## Goal

Bring Hero.astro and Footer.astro back into verbatim agreement with
docs/copy.md after the 2026-07-27 planning cycle amended the deck on the
product owner's direction: one merged caption sentence replacing the old
terminal caption + proof kicker, the hero's duplicate install one-liner
removed, and both audit-trail links retargeted to the ledger directory
(https://github.com/techspeque/metiswww/tree/main/.metis).

## Architectural context

- **The deck already changed; this slice implements it.** ADR-0003: copy
  lands in docs/copy.md first — that happened at planning (Amendment A
  precedent). Do not edit the deck; if the deck seems wrong, stop and
  raise it rather than "fixing" it here
- **The four §Proof stat values and labels are Human-owned (ADR-0009).**
  Render them exactly as they stand. A stale value is not a finding and
  must not be "refreshed" in passing
- The new caption ends in a colon because it now INTRODUCES the stats
  strip. The kicker `<p id="proof-kicker">` is removed, but the stats
  `<dl>` names itself via `aria-labelledby="proof-kicker"` — the wiring
  must move, not dangle. Intended shape: give the figcaption an id and
  point the `<dl>`'s `aria-labelledby` at it (the caption's sentence is
  the correct accessible name for the list it introduces). Any equivalent
  that leaves the `<dl>` validly named is acceptable; a dangling idref or
  an unnamed list is not
- The one-source-line grep convention holds (phase-1-ws-1.1): rendered
  strings sit on one source line so dist greps literally against the deck.
  The caption keeps its one permitted split — none: unlike the §Proof
  caption it contains no link, so it renders as a single text node
- Removing the hero `<pre class="install">` orphans the `.install` rules
  in Hero.astro's `<style>` — remove them too (dead CSS is a review
  finding). Install.astro's own one-liner styling is untouched and out of
  scope
- Hero.astro's frontmatter narration references the retired layout
  ("terminal, then strip, then install", the kicker). Update stale
  narration; keep the ADR/f-number history accurate
- Script budget unchanged: exactly two inline scripts (ADR-0007). This
  slice adds no JS and no tokens

## Declared file scope

> **Widened 2026-07-27 by product-owner override.** OVERVIEW.md and
> docs/copy.md moved into owned_paths after implementation. Both were
> touched by the planning commit (530ab98), which carries this slice's ID
> because the deck amendment and the slice were authored in the same cycle
> — the scope audit therefore attributed planning work to the coder and
> returned FAIL. The Human owns scope conflicts; the call is that this
> slice's declared scope should cover the planning edits made under its ID
> rather than that the ledger be rewritten. docs/copy.md consequently
> leaves read_only_paths. This does not license a coder to edit the deck:
> ADR-0003 still puts copy in docs/copy.md first, as a planning act, and
> the implementation commit (2f9f894) touched neither file.

- **owned_paths:**
  - src/components/Hero.astro
  - src/components/Footer.astro
  - docs/copy.md
  - OVERVIEW.md
- **read_only_paths:**
  - src/styles/tokens.css
  - src/components/Install.astro

## Definition of Done

- Hero figcaption renders, verbatim and on one source line: "This very
  page is a slice in metis's own ledger, built under its own protocol,
  where the numbers tell the real story:"
- The old caption sentence and the kicker string ("Dogfood numbers — this
  site, built under its own protocol") appear nowhere in dist
- The kicker `<p>` and its `.kicker` CSS are gone; the stats `<dl>` has a
  valid accessible name sourced from the new caption (no dangling idrefs)
- The hero `<pre class="install">` and its `.install` CSS are gone; the
  `curl … install.sh | bash` string appears exactly once in
  dist/index.html (§Install's block)
- "audit the ledger" (§Proof caption) and "Read the audit trail"
  (colophon) both href
  https://github.com/techspeque/metiswww/tree/main/.metis, `rel="noopener"`
  retained
- §Proof stat values/labels, the transcript, and all other copy
  byte-identical to before this slice
- Regression greps green: two inline scripts, no raw values, landmark and
  heading structure unchanged
- npm run verify exits 0

## Test plan

- Build; grep dist/index.html for: the new caption (present, once), the
  old caption and kicker strings (absent), `install.sh | bash` (exactly
  one occurrence), `tree/main/.metis` (exactly two occurrences)
- Verify the `<dl>`'s aria-labelledby resolves: extract the idref and
  confirm an element with that id exists and contains the caption text
- `curl -sI -o /dev/null -w '%{http_code}'
  https://github.com/techspeque/metiswww/tree/main/.metis` → 200
- Both schemes spot-checked; the hero's post-removal spacing rhythm
  reviewed (the CTAs now follow the proof caption directly — the gap must
  come from tokens, not leftover margins targeting the removed block)
- No-JS and reduced-motion renders complete (no reveal wiring exists in
  the hero; confirm none was introduced)

## Out-of-scope touches

None by the coder. The implementation commit (2f9f894) touches exactly the
two source files it set out to change — Hero.astro and Footer.astro — and
nothing else. The deck was not edited during implementation: it was already
correct, because amending it was the planning act. Install.astro stayed
read-only as the reference for the single surviving install one-liner.

**Scope-audit history.** `metis log phase-3-ws-3.1 --validate` returned
FAIL at coder handoff, naming OVERVIEW.md and docs/copy.md. Both came from
ONE commit — the planning commit — and the product-owner override recorded
under "Declared file scope" above resolves it by widening owned_paths to
cover them. The audit is green from that point on. The commit breakdown,
kept because it is what the override was decided on (the validator ignores
`.metis/` ledger paths, so the brief and flip commits never appeared in the
list):

- `530ab98 chore(phase-3-ws-3.1): docs and copy updates` — the PLANNING
  commit, authored before this slice was seeded (the seed is 89c3bf7). It
  created .metis/plans/phase-3.md and this brief, and amended OVERVIEW.md
  §4 and docs/copy.md §Hero/§Hero-terminal/§Proof/§Footer. Those last two
  are what the validator names. Deck authoring is the Human/planning act
  under the Amendment A precedent the plan cites; it predates the brief
  that declares owned_paths, so no scope contract existed for it to break.
  It carries the slice-ID prefix, which is the only reason it lands in this
  slice's audit at all.
- `2f9f894 feat(…)` — the implementation. Hero.astro and Footer.astro only.
- `50e6a9b chore(…): flip coded` and the brief commits — ledger only, and
  not counted by the scope audit.

Reviewer: the audit now passes, but the split is still worth confirming
with `git show --stat 530ab98` and `git show --stat 2f9f894`. What the
widened scope must NOT be read to mean is that the coder edited the deck —
the implementation commit touches neither OVERVIEW.md nor docs/copy.md, and
the §Proof stat values remain untouched per ADR-0009.
