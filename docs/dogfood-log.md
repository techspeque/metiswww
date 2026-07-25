# Dogfood Log — metis friction observed while building metiswww

Feeds back into metis hardening. Session: 2026-07-25, metis v0.0.5.

## From the Phase 0 planning session
1. `metis seed --dry-run -o json` not honored — dry-run is a read, rule 13 says every read supports JSON; deps not mechanically confirmable
2. `routing.review: cross-vendor` unsatisfiable with two same-surface agents (cross-model is best achievable); accepted silently — semantics need defining
3. Template never states the workstream heading number becomes the slice ID suffix
4. "Stage" taxonomy referenced but undefined anywhere; gate slice has empty stage
5. Gate slice risk=high is implicit/undocumented, not settable from the plan
6. Template's "Sizing/Ordering Guidance" sections: unclear if they stay in the final plan
7. Planning role has no protocol entry point — CLAUDE.md mandates kickoff first, but kickoff only serves coder/reviewer; AGENTS.md assigns planning to Human

## From the ws-0.1 coder session
8. Coder flow has no explicit "commit your source" step — literal reading flips coded before the code commit exists
9. `metis commit -m` double-prefixes when the message already contains the prefix (no detection)
10. `owned_paths` matching is literal — backtick-wrapped paths (which the brief template's prose style invites) cause false scope violations
11. No amend path in metis commit — message fixes require raw `git commit --amend` (Hard Rule 5 deviation forced by tooling gap)

## From the ws-0.1 reviewer session
12. "Cross-vendor" label misleading for same-vendor/different-model pairs (second report of #2 — recurring)
13. Empty AGENTS.md sections ("(None configured)") read as unconstrained; reviewer had to infer the checklist from OVERVIEW §7 — init could seed review_checklist from the OVERVIEW
14. Undocumented: `metis brief <id>` remains readable after archive (works; just not stated)

## From the ws-0.2 coder session
15. `metis commit -m` doesn't auto-stage — fails with a raw git "nothing staged" error; needs a hint or scoped-add option
16. Brief re-commits produce identical canned subjects (`docs(id): slice brief` twice) — no message override or amend path
17. `metis brief <id>` fails with "slice not found" for ARCHIVED slices even though the brief file exists — breaks the documented seam-reading/archaeology path exactly when slices complete (contradicts #14, which was observed pre-archive)

## From the ws-0.2 reviewer session
18. Empty review_checklist reported again — third occurrence of the #13 pattern; RECURRING, promote a fix (init should seed it from OVERVIEW)
19. `metis log --validate -o json` lacks first/last commit fields — reviewers reconstruct the commit range by hand for manual audits

## From the ws-0.3 coder session
20. Scope granularity undefined — plan suggests directories (`src/components/`), validation matches files; template should state whether owned_paths entries are dirs or files (both work via prefix match, but agents can't know that)

## From the ws-0.3 reviewer session
21. No advisory-finding channel — `metis block` is the only findings write path and it forces a rework cycle; non-blocking observations (e.g. a landmark trade-off forced by the plan) have no durable structured record
22. `metis verify` prints only ALL GREEN/exit code — not citable as review evidence; reviewers shell out to the underlying command for detail (a --show-output flag would help)
