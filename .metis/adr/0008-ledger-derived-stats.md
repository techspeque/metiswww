---
type: adr
id: 0008
title: Site statistics are ledger-derived, recomputable, and dated
status: accepted
date: 2026-07-26
phase: 2
---

# ADR-0008: Site statistics are ledger-derived, recomputable, and dated

> Phase: 2 | Status: accepted | Date: 2026-07-26
> Decision drivers: Amendment A adds a hero proof strip; OVERVIEW §3.4
> copy-accuracy invariant; the site's core positioning is auditability

## Context

The hero gains a strip of statistics about metis's effect on quality. The
obvious marketing move — "improved quality by 40%" — is an invented number,
and this site's entire credibility play is the opposite: it is built by the
tool it describes, next to a link that says "read the audit trail". A
fabricated percentage beside that link would be self-refuting.

This project has real numbers: its own `.metis/` ledger, findings file, and
archive are public.

## Decision

- Every number rendered on the site MUST be **measured from this
  repository's public ledger** (slices.yaml/slices-done.yaml,
  findings.yaml, briefs, git history) or from the metis repo's public
  record.
- Each stat in docs/copy.md carries a **verification note**: the exact
  file/command by which a reviewer recomputes it. The reviewer of any
  slice rendering stats MUST recompute them; a mismatch is a P2 finding
  (category behavior).
- The strip is **dated** ("as of <date>") because the numbers are static
  strings, not fetched at runtime (OVERVIEW §2.2: no client-side data
  fetching). Refreshing them is a future chore slice that re-runs every
  verification note.
- **Estimates are second-class:** permitted only when visibly labeled
  (`est.`), derived from a stated measured basis, and never phrased as a
  CLI-behavior claim. Unlabeled projections and invented percentages are
  prohibited.

## Rules this decision implies

- A rendered number with no verification note in docs/copy.md is a review
  finding (severity P2, category protocol).
- Copy edits that change a stat go through docs/copy.md first (ADR-0003)
  and re-run that stat's verification note.
- If the ledger moves on (numbers stale but true-as-dated), the strip is
  not "wrong" — the as-of date carries the claim. Removing the date is a
  finding.
