---
type: recon
slice: <recon-slice-id>
overview_version: <sha256 short hash of current OVERVIEW>
date: YYYY-MM-DD
status: draft | complete
---

# Reconciliation Report — <slice-id>

> Triggered by: OVERVIEW.md change
> Date: <YYYY-MM-DD>
> Scope: pending slices, active plans, current ADRs

---

## 1. OVERVIEW Changes Summary

<Describe what changed in the OVERVIEW since last baseline. Be specific:
which sections were added, removed, or modified. Focus on changes that
affect pending or future work.>

### Added
- <new requirement/section>

### Modified
- <changed requirement — what was it before, what is it now>

### Removed
- <removed requirement>

---

## 2. Impact Assessment

### Affected Pending Slices

| Slice ID | Current Title | Impact | Action |
|---|---|---|---|
| <id> | <title> | <what changed for this slice> | edit / skip / no change |
| <id> | <title> | <what changed for this slice> | edit / skip / no change |

### Unaffected Slices (confirmed)

<List slices reviewed and confirmed as unaffected, so the record is complete.>

---

## 3. New Work Required

| Proposed Title | Type | Risk | Reason |
|---|---|---|---|
| <title> | feat/fix/refactor/... | low/medium/high | <why now needed> |

---

## 4. Documentation Updates

- [ ] Plan file <path> updated: <what changed>
- [ ] ADR <NNNN> superseded by ADR <MMMM>: <reason>
- [ ] ADR <NNNN> created: <new decision required by changes>
- [ ] Accuracy rules updated (`metis rule add` / `metis rule promote`): <if invariants changed>
- [ ] Non-goals updated (`metis config set non_goals ...`): <if scope boundaries changed>

---

## 5. Actions Taken

- [ ] `metis edit <id> --title "..." --risk ...` for affected slices
- [ ] `metis skip <id> --reason "..."` for obsolete slices
- [ ] `metis add <type> --title "..." ...` for new work
- [ ] `metis check` passes after all changes
- [ ] `metis surface generate` run (if rules/non-goals changed)

---

## 6. Verification

- [ ] No pending slice references removed OVERVIEW sections
- [ ] All new slices have valid coder/reviewer assignments
- [ ] Dependency ordering is still correct (no orphaned blocked_by)
- [ ] `metis check` passes clean
