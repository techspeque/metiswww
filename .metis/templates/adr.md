---
type: adr
id: NNNN
title: <decision title>
status: proposed | accepted | superseded | deprecated
date: YYYY-MM-DD
phase: <N>
supersedes: <ADR-MMMM if applicable, omit otherwise>
---

# ADR-NNNN: <Decision Title>

> Phase: <N> | Status: <status> | Date: <YYYY-MM-DD>
> Decision drivers: <why this decision is being made now>

## Context

<The problem, the forces, the constraints. Keep it short — if this grows
into an essay, write a design doc and link it. Focus on WHY this decision
is needed, not what the decision is (that's the next section).>

## Decision

<What we are doing. Write in imperative mood. Be specific: 1-3 sentences
stating the decision, followed by the rules or invariants it implies.>

### Rules this decision implies:

1. <rule — concrete, enforceable, may become an accuracy_rule via `metis rule add`>
2. <rule>
3. <rule>

## Consequences

### Positive
- <what gets easier>
- <what becomes possible>

### Negative
- <what gets harder>
- <what constraints are introduced>
- <what can fail>

### Neutral
- <what changes without being clearly better or worse>

## Alternatives Considered

| Option | Pros | Cons | Why rejected |
|---|---|---|---|
| <alternative 1> | <pros> | <cons> | <reason> |
| <alternative 2> | <pros> | <cons> | <reason> |

## References

- <link to relevant docs, prior ADRs, external resources>
