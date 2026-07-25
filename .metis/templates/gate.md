---
type: gate
slice: <gate-slice-id>
phase: <N>
title: Phase <N> Gate — <Phase Title>
date: YYYY-MM-DD
verdict: pass | fail
---

# Phase <N> Gate — Evidence Report

> Slice: <gate-slice-id>
> Phase: <N> — <Phase Title>
> Date: <YYYY-MM-DD>

---

## 1. Prerequisite Check

- [ ] All phase <N> slices coded and reviewed
- [ ] No open P1 findings against phase <N> slices
- [ ] All phase <N> ADRs in accepted status
- [ ] `metis verify` passes on clean checkout

---

## 2. Composition Scenarios

> These prove the phase works as a composed system, not just individual slices.

### Scenario 1: <end-to-end scenario description>

- **Setup:** <preconditions>
- **Action:** <what was exercised>
- **Expected:** <expected behavior>
- **Actual:** <observed behavior>
- **Verdict:** pass | fail
- **Evidence:** <test name, log reference, or file:line>

### Scenario 2: <integration scenario description>

- **Setup:** <preconditions>
- **Action:** <what was exercised>
- **Expected:** <expected behavior>
- **Actual:** <observed behavior>
- **Verdict:** pass | fail
- **Evidence:** <reference>

### Scenario 3: <contract scenario at seam point>

- **Setup:** <preconditions>
- **Action:** <what was exercised>
- **Expected:** <expected behavior>
- **Actual:** <observed behavior>
- **Verdict:** pass | fail
- **Evidence:** <reference>

---

## 3. Interface Seam Verification

| Boundary | Provider | Consumer | Contract | Status |
|---|---|---|---|---|
| <seam name> | <module/package> | <module/package> | <interface/type> | verified / mismatch |
| <seam name> | <module/package> | <module/package> | <interface/type> | verified / mismatch |

---

## 4. Performance / Resource Check

| Metric | Value | Threshold | Status |
|---|---|---|---|
| <metric> | <measured> | <acceptable limit> | ok / concerning / fail |

---

## 5. Findings

<If composition failures were found, list them here. Each should be filed
via `metis block <offending-slice-id>` against the responsible slice.>

| Finding | Severity | Offending Slice | Filed As |
|---|---|---|---|
| <description> | P1/P2/P3 | <slice-id> | <finding-id> |

---

## 6. Verdict

**PASS** | **FAIL**

### If PASS:
Phase <N> is validated. The composed system meets the phase's stated goals.
Proceed to Phase <N+1> planning.

### If FAIL:
<Which scenarios failed. Which slices are blocked. What rework is needed
before the gate can be re-evaluated.>
