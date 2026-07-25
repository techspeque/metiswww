---
type: overview
project: <project-name>
status: living
last_updated: YYYY-MM-DD
---

# <Project Name> — Full Specification

> <One-line description of what this application does>

---

## 1. Purpose

<What this application does and why it exists. Who uses it and what problem
it solves. 2-3 paragraphs maximum. This section answers "why are we building
this?" — the motivation that drives all technical decisions below.>

---

## 2. Architecture

<High-level system design. Components, their responsibilities, and how they
interact. Use ASCII diagrams where helpful.>

### 2.1 System Boundaries

<What is inside the system vs. external. Integration points, APIs consumed,
services depended upon.>

### 2.2 Data Model

<Core entities, their relationships, and where they live. Schema decisions.
This is high-level — detailed schemas belong in ADRs or code.>

### 2.3 Component Structure

<Packages, modules, layers. The dependency graph between internal components.
Where the seam points are.>

---

## 3. Constraints

### 3.1 Technology

- **Language:** <primary language>
- **Build system:** <build tool>
- **Storage:** <database/storage approach>
- **Runtime:** <deployment target>

### 3.2 Non-Goals (do NOT build)

<Explicit things this project will never do. Agents must not build these
even if asked indirectly. These become `non_goals` in the project config
(the human applies them via `metis config set`).>

- <non-goal>
- <non-goal>

### 3.3 Invariants (must ALWAYS hold)

<Project-wide rules that must never be violated. These become
`accuracy_rules` (added via `metis rule add` or promoted from findings
via `metis rule promote`) and are enforced in every review.>

- <invariant>
- <invariant>

---

## 4. Phases (High-Level Roadmap)

<Sketch all phases at a high level. Each phase gets detailed planning
(in .metis/plans/) only when you're about to execute it.>

### Phase 0 — Foundation
<2-3 sentences: what infrastructure/scaffolding this establishes>

### Phase 1 — Core
<2-3 sentences: what core functionality this delivers>

### Phase 2 — <Name>
<2-3 sentences>

### Phase N — Polish / Release
<2-3 sentences>

---

## 5. Security Model

<Authentication, authorization, trust boundaries, data sensitivity levels.
What needs to be protected and from whom.>

---

## 6. API / Interface Contracts

<Public interfaces this system exposes. REST endpoints, CLI commands,
library APIs, event schemas. Enough detail that consumers can code against
these contracts.>

---

## 7. Testing Strategy

<What gets tested at which level. Unit test boundaries, integration test
approach, contract tests, performance tests. Where mocking is appropriate
vs. hitting real dependencies.>

---

## 8. Operational Concerns

<Deployment, monitoring, logging, error handling strategy, configuration
management. How the system runs in production.>
