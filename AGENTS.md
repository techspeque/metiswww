# Agent Contract — metiswww

This repository is managed by Metis. ALL autonomous work follows the
protocol below. These rules are non-negotiable.

## Mandatory

Run `metis kickoff` from step 1 at the start of every session.
Do NOT skip this. Do NOT start work without following the protocol.

## Hard Rules

1. ONE slice at a time — `metis next` decides which, not you
2. Brief BEFORE code — commit scope contract before implementation
3. Scope is a contract — only touch files declared in your brief
4. Cross-vendor review — you cannot review your own work
5. `metis commit` for all commits — enforces format, strips attribution
6. STOP on environment failure — do not modify code to fix a broken sandbox
7. Dirty tree with in-scope files — resume the interrupted session (read brief, check git log, continue)
8. Dirty tree with out-of-scope files — STOP and report to human
9. Reality beats documents — if code contradicts plan, fix the document
10. No planning in execution — do not re-scope or invent additional work
11. Report mismatches — if you're the wrong agent for this slice, STOP
12. Trust the tools — do not walk YAML, compare slugs, or evaluate booleans manually
13. Exact values come from `-o json` — every read command supports it; never parse human-readable output

---

# metiswww — Agent Contract

This contract governs all autonomous work in this repository.

## Session Start Protocol

Every autonomous session begins by running `metis kickoff` from step 1.
No pasted prompt is needed. The CLI provides all context.

## Branch & Commit Rules

- All work lands on the `dev` branch. Never commit to `main`.
- Use `metis commit` for all commits — it enforces format and strips attribution.
- Commit format: `{prefix}({slice_id}): {message}`
- Allowed prefixes: feat, fix, refactor, docs, test, chore
- Every commit subject contains the slice ID.
- No AI attribution in commits (Co-Authored-By, Generated with, model names).

## Definition of Done

A slice is done only when ALL hold:
1. Implementation matches the brief in .metis/briefs/<slice-id>.md
2. Tests proportional to the testing rules exist and pass
3. `metis verify` is green, confirmed independently by the Reviewer
4. The Reviewer walked the checklist with no blocking findings
5. Ledger and brief are committed; commit subjects carry the slice ID

## Roles

- **Coder** — implements one slice within its declared file scope; owns its tests
- **Reviewer** — reviews one slice against the checklist; re-runs verification independently; owns the sign-off
- **Human** — owns planning, scope conflicts, escalations, and release merges

Reviews are cross-vendor by default.

## Hot-Path Zones

(None configured)

## Scope Discipline

- Before any code, commit a brief declaring file scope
- Implement only within declared files
- Genuinely-required out-of-scope fixes go in the brief's "Out-of-scope touches" section
- If the slice needs a non-goal item, or scope differs materially from the plan, stop and report

## Model Routing

- High risk: claude-code/opus
- Medium risk: claude-code/opus
- Low risk: claude-code/opus
- Review: cross-vendor

## Testing Rules

(None configured)

## Non-Goals

(None configured)

## Accuracy Rules

(None configured)

## Review Checklist

(None configured)

## Feedback Loop

- Every blocking review finding is logged via `metis block`
- Findings tracked in .metis/findings.yaml
- Recurring failures graduate into new accuracy rules (`metis rule promote`)
- review_cycles per slice provides routing evidence
- Phase gates validate composed system behavior

## Tooling Map

| Command | Purpose |
|---|---|
| `metis next` | Find active slice, role, required model |
| `metis kickoff` | Session protocol steps |
| `metis instructions --for <id>` | Risk-scaled contract for a slice |
| `metis brief <id> --write` | Generate brief template |
| `metis verify --pre` | Pre-flight verification |
| `metis verify --post` | Post-implementation verification |
| `metis verify --env` | Environment soundness check only |
| `metis interfaces` | Regenerate API summary |
| `metis commit -m "..."` | Commit with enforced format |
| `metis commit --brief` | Commit the brief |
| `metis commit --flip coded` | Flip coded and commit |
| `metis commit --flip reviewed --agent <slug>` | Flip reviewed and commit (identity required) |
| `metis block <id>` | Block a slice during review |
| `metis archive` | Move done slices to archive |
| `metis check` | Validate config + ledger |
| `metis status` | One-line progress summary |
| `metis log <id> --validate` | Audit slice commits: format + scope vs brief |
| `metis config get <key>` | Read one config value |

Every read command accepts `-o json`. When you need an exact value
(slice ID, agent slug, status), read the JSON field — never parse the
human-readable text.
