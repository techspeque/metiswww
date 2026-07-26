---
type: adr
id: 0009
title: The §Proof statistics are Human-owned
status: accepted
date: 2026-07-26
phase: 2
---

# ADR-0009: The §Proof statistics are Human-owned

> Phase: 2 | Status: accepted | Date: 2026-07-26
> Decision drivers: ADR-0008's recompute obligation forms a non-terminating
> loop against a ledger that reviewing the slice itself mutates; observed
> live during phase-2-ws-2.4 review cycle 1

## Context

ADR-0008 requires every rendered number to be ledger-derived, and obliges the
reviewer of any slice rendering stats to recompute each one, making a mismatch
a P2 finding. The reasoning was sound: the site's credibility play is that it
is built by the tool it describes, next to a link inviting the reader to audit
the ledger.

What ADR-0008 did not anticipate is that the ledger those numbers measure is
mutated by the act of reviewing the slice that renders them:

- Recording a finding against the strip increments the findings count the
  strip displays.
- Archiving any slice increments the slices count.
- Slice phase-2-ws-2.4 demonstrated both inside a single review cycle. `9/9`
  went stale when phase-2-ws-2.1 archived, hours after the copy was written;
  then raising f-011 against stat 2 made stat 2's own value wrong.

Under ADR-0008 as written each of those is a P2 the coder must fix, and each
fix mutates the ledger again. That does not terminate, and it spends agent
cycles on marketing copy rather than on the product. The remaining phase-2
slices (2.5, 2.6, 2.2, 2.3, gate) would each move the numbers again.

The distinction ADR-0008 missed is between a number that is **stale** and a
claim that is **false**. Staleness is what an as-of date exists to carry.
Falsity is not.

## Decision

The §Proof statistics are Human-owned copy: agents render them verbatim and
never recompute them, and the Human refreshes the values once before release.
ADR-0008's recompute obligation is withdrawn for §Proof *values* only; every
other clause of ADR-0008 stands.

### Rules this decision implies:

1. A stale §Proof **value** is not a finding. An agent that notices one
   records it in its brief and proceeds.
2. A false §Proof **label** remains a P2 (category behavior) — a label makes
   a claim about metis's behaviour, and OVERVIEW §3.4's copy-accuracy
   invariant governs it.
3. The reviewer of a slice rendering stats still checks, and each remains a
   P2: stat 4's `est.` prefix and "at best observed" qualifier render intact;
   the caption's as-of date renders; no label asserts something the ledger
   contradicts.
4. Refreshing the four values and the as-of date is a Human act performed once
   before the dev → main merge. It is not slice work and needs no ledger entry.
5. Verification notes stay in docs/copy.md. They document the method so a
   *reader* can audit a number; they no longer oblige an agent to recompute it.
6. ADR-0008's estimate clause is untouched: estimates stay visibly labeled,
   invented percentages stay prohibited.

## Consequences

### Positive
- Review of a stats-rendering slice terminates.
- Agent effort moves off copy arithmetic and onto the product.
- The distinction between a stale number and a false claim becomes explicit,
  which is the distinction that actually protects the site's credibility.

### Negative
- Numbers can ship staler than before if the Human forgets the pre-release
  refresh. The as-of date bounds the damage but does not remove it.
- The site's "recomputable by anyone" property now rests on the reader
  following a verification note, not on an agent having just done so.

### Neutral
- docs/copy.md §Proof gains an owner in the same sense the plan and ADRs
  already have one.

## Alternatives Considered

| Option | Pros | Cons | Why rejected |
|---|---|---|---|
| Keep ADR-0008 as written | Strongest recompute guarantee | Does not terminate; each fix invalidates the next number | Demonstrated live in phase-2-ws-2.4 cycle 1 |
| Compute the stats at build time from the ledger | Always current, no human step | Needs build-time data ingestion, which OVERVIEW §2.2 forbids | Violates a standing architectural constraint |
| Drop the numbers, keep prose | Nothing to go stale | Discards the proof-over-promises positioning that motivates the strip | Loses the section's entire purpose |
| Freeze the numbers at a tagged commit and cite it | Precise and self-consistent | Reader must resolve a commit hash to audit; still needs a human refresh | Added ceremony for the same human step |

## References

- ADR-0008 — Site statistics are ledger-derived, recomputable, and dated
  (amended by this ADR; not superseded)
- ADR-0003 — copy deck is the single source of truth
- OVERVIEW.md §2.2 (no client-side data fetching), §3.4 (copy accuracy)
- f-011 — the finding that exposed the loop
- .metis/briefs/phase-2-ws-2.4.md — the deferral note that preceded this ADR
