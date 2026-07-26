---
type: gate
slice: phase-1-gate
phase: 1
title: Phase 1 Gate — Sections
date: 2026-07-26
verdict: pending
---

# phase-1-gate — Phase 1 gate: composed-system validation

- **Type:** gate | **Risk:** high | **Priority:** p2
- **Coder:** claude-code/opus | **Date:** 2026-07-26
- **Plan:** .metis/plans/phase-1.md §Phase Gate

## Phase being validated

Phase 1 — Sections: Hero with the CSS typed terminal (ws-1.1), Problem +
Insight + Personas (ws-1.2), the Protocol lifecycle diagram carrying the one
permitted inline observer (ws-1.3), and Install + Footer with the ADR-0004
landmark amendment (ws-1.4) — composed into the content-complete single page.

## Declared file scope

- **owned_paths:**
  - .metis/briefs/phase-1-gate.md
- **read_only_paths:**
  - OVERVIEW.md (§3.2, §3.4)
  - .metis/plans/phase-1.md (§Phase Gate)
  - docs/copy.md (the copy authority, ADR-0003)
  - .metis/adr/0002, 0003, 0004 (the policies this gate enforces)
  - src/** and dist/** (validated as built artifacts; not modified)

> Gate discipline: this slice produces the evidence report only. No product
> code is touched — the git tree stays clean apart from this report. Render
> checks run against a throwaway `dist` copy in the session scratchpad. If a
> scenario fails, the fix belongs to a workstream slice, not to this one: the
> gate stops and reports to the human.

---

## 1. Prerequisite Check

(filled during execution)

## 2. Composition Scenarios

Per .metis/plans/phase-1.md §Phase Gate:

1. Full-page render in both color schemes; no placeholder text remains
2. Copy audit — every rendered string traceable to docs/copy.md; every CLI
   claim/command verified against metis v0.0.6+ (accuracy rule #1: enumerate
   the copy-carrying file set from the filesystem)
3. Animation policy — exactly one inline script (ADR-0002 gate); both
   animations play once; reduced-motion renders complete final states
4. Landmarks — one main, body-level footer (contentinfo), one h1, heading
   levels unbroken
5. WCAG AA pairings still documented and true for the new UI (diagram states,
   terminal block)

## 3. Interface Seam Verification

(filled during execution)

## 4. Performance / Resource Check

Built CSS ≤ 50KB; single inline script ≤ 600 bytes; no new fonts.

## 5. Findings

(filled during execution)

## 6. Verdict

(filled during execution)

## Report

See §1–§6 — filled during execution with actual evidence.
