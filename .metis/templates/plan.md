---
type: plan
phase: <N>
title: <Phase title>
overview_ref: OVERVIEW.md §<section>
status: draft | approved | executing | completed
created: YYYY-MM-DD
---

# Phase <N> — <Title>

> Derived from: OVERVIEW.md §<section>
> Produces: slices phase-<N>-ws-<N.M> in .metis/slices.yaml
> ADRs: .metis/adr/NNNN-*.md (created alongside this plan)

## Context

<What this phase achieves. One paragraph. Reference the OVERVIEW section
that drives this phase. State what the system can do after this phase that
it cannot do before.>

## Dependencies

- Requires: <Phase N-1 complete, or "none" if first phase>
- External: <any external dependencies, services, credentials needed>

---

## Workstream <N.1>: <Title>

- **Risk:** low | medium | high
- **Coder:** <agent-slug — see `metis config get agents -o json`>
- **Reviewer:** <agent-slug, must differ from coder>
- **Stage:** <project taxonomy label, e.g., foundation | mvp | beta>
- **Blocked by:** <workstream IDs if dependency exists, omit if none>

Tasks:
- <imperative verb> <specific deliverable>
- <imperative verb> <specific deliverable>
- <imperative verb> <specific deliverable>

Suggested packages:
- `path/to/package`
- `path/to/other`

Acceptance criteria:
- [ ] <testable, specific outcome — becomes the brief's Definition of Done>
- [ ] <testable, specific outcome>
- [ ] <testable, specific outcome>

---

## Workstream <N.2>: <Title>

- **Risk:** low | medium | high
- **Coder:** <agent-slug>
- **Reviewer:** <agent-slug>
- **Stage:** <taxonomy>

Tasks:
- <task>

Suggested packages:
- `path/to/package`

Acceptance criteria:
- [ ] <outcome>
- [ ] <outcome>

---

## Phase Gate

> This section defines how Phase <N> is validated as a composed system.
> It becomes a `gate` slice automatically.

Composition scenarios to validate:
- [ ] <integration scenario proving modules work together>
- [ ] <contract scenario proving interfaces align at seams>
- [ ] <end-to-end scenario proving the phase's stated goal>

Performance / resource checks:
- [ ] <metric within acceptable bounds>

---

## Sizing Guidance (for the planning agent)

Each workstream should be:
- ONE reviewable unit of work (a few hundred lines of diff, not thousands)
- Independently testable (has its own acceptance criteria)
- Completable in a single agent session
- Small enough that scope creep is immediately visible in review

If a workstream feels too large, split it. If it feels trivial, merge with adjacent.

## Ordering Guidance

- Declaration order = execution order within same priority
- Use "Blocked by" for hard dependencies
- Foundation/interface slices come before implementation slices
- Each workstream should be able to point its brief at real interfaces from prior slices
