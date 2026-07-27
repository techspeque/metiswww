---
type: plan
phase: 3
title: Hero & colophon copy corrections
overview_ref: OVERVIEW.md §4 Phase 3
status: approved
created: 2026-07-27
---

# Phase 3 — Hero & colophon copy corrections

> Derived from: OVERVIEW.md §4 (Phase 3), product-owner direction 2026-07-27
> Produces: slice phase-3-ws-3.1 in .metis/slices.yaml (gate waived — see
>          Phase Gate section)
> ADRs: none new — executes under ADR-0003 (deck is the copy source),
>       ADR-0009 (proof values are Human-owned), ADR-0005/0007 (script
>       budget), ADR-0004 (landmarks)
> Copy source: docs/copy.md — §Hero, §Hero-terminal, §Proof and §Footer
>              were amended IN THIS PLANNING CYCLE (Amendment A precedent:
>              deck authoring is the Human/planning act; slices render it)

## Context

The site is live (phase-2 gate passed; dev merged to main via PR #1). The
product owner reviewed the shipped page and directed four copy corrections,
all in the hero and the footer colophon:

1. **Compact two lines into one sentence.** The terminal caption ("This
   very page is a slice in metis's own ledger.") and the proof-strip kicker
   ("Dogfood numbers — this site, built under its own protocol") merge into
   a single caption that introduces the stats: *"This very page is a slice
   in metis's own ledger, built under its own protocol, where the numbers
   tell the real story:"* — the kicker element is removed.
2. **Drop the hero's duplicate install one-liner.** The `curl … | bash`
   block below the proof caption repeats §Install's one-liner verbatim one
   screen below; the hero copy of it is removed.
3. **Retarget "audit the ledger"** (§Proof caption) to
   https://github.com/techspeque/metiswww/tree/main/.metis — the ledger
   directory itself, not the repository root.
4. **Retarget "Read the audit trail"** (footer colophon) to the same URL.

The deck already carries all four changes (this planning cycle edited
docs/copy.md); the slice's job is to bring Hero.astro and Footer.astro back
into verbatim agreement with the deck. The four fixes ship as ONE
workstream by explicit product-owner direction: they are a single
reviewable diff across three tightly-coupled files, and slicing them apart
would manufacture ledger overhead without adding review value.

## Dependencies

- Requires: Phase 2 complete (phase-2-gate archived)
- External: none — the target URL is already live and public
  (`.metis` exists on main since PR #1; verified 2026-07-27)

---

## Workstream 3.1: Hero & colophon copy corrections

- **Risk:** low
- **Coder:** claude-code/opus
- **Reviewer:** opencode/gpt-5.6-sol
- **Stage:** polish

Tasks:
- Render the amended §Hero-terminal caption verbatim in the hero
  figcaption; remove the kicker `<p>` from the proof block
- Rewire the stats `<dl>`'s accessible name: `aria-labelledby` currently
  points at the removed `#proof-kicker` — point it at the (now id-bearing)
  figcaption, whose sentence is the strip's introduction; the `<dl>` must
  not be left unnamed or dangling-referenced
- Remove the hero's `<pre class="install">` block and its now-dead
  `.install` CSS rules from Hero.astro
- Retarget the §Proof caption's "audit the ledger" anchor and the footer
  colophon's "Read the audit trail" anchor to
  https://github.com/techspeque/metiswww/tree/main/.metis
- Update Hero.astro's frontmatter narration where it is now stale (the
  "terminal, then strip, then install" ordering note, the kicker
  references); leave the ADR history intact
- Touch NOTHING else: stat values and labels are Human-owned (ADR-0009),
  the transcript is byte-pinned, no new scripts, no token changes

Acceptance criteria:
- [ ] dist/index.html greps the new caption verbatim; the old caption
      sentence and the kicker string appear nowhere in dist
- [ ] The `curl … install.sh | bash` one-liner appears exactly ONCE in
      dist/index.html (the §Install section)
- [ ] Both audit anchors' href is
      https://github.com/techspeque/metiswww/tree/main/.metis and the URL
      resolves (HTTP 200, public)
- [ ] The stats `<dl>` retains a valid accessible name (aria-labelledby
      resolves to an existing id whose text is the new caption); no
      dangling id references in dist
- [ ] Regression greps unchanged: exactly two inline scripts (ADR-0007
      form), no raw color/spacing values, landmarks/headings untouched
      (one h1, sections under main, body-level footer)
- [ ] All four §Proof stat values and labels byte-identical to the deck —
      unchanged by this slice (ADR-0009)
- [ ] npm run verify exits 0

---

## Phase Gate

> WAIVED 2026-07-27 by product-owner direction: Phase 3 is a hotfix phase
> and does not warrant a composed-system gate. The gate slice seeded from
> the original version of this section (phase-3-gate) was retired via
> `metis skip`. Its composition checks — deck copy audit, live-link fetch,
> script-policy re-grep, accessibility spot-check, CSS budget — are already
> subsumed by workstream 3.1's acceptance criteria and `npm run verify`.
