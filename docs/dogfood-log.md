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
