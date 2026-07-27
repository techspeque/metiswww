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

- **owned_paths:**
  - src/components/Hero.astro
  - src/components/Footer.astro
- **read_only_paths:**
  - docs/copy.md
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

None anticipated. docs/copy.md is read-only by design this time: the deck
edit was the planning act and is already committed. Install.astro is
read-only as the reference for the single surviving install one-liner.
