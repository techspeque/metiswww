# metiswww Copy Deck

> Single source of truth for all rendered site copy (ADR-0003). Components
> render these strings verbatim; wording changes land here first. Every CLI
> claim below was verified against metis v0.0.6 on 2026-07-26 — commands
> shown exist with the shown flags, and the terminal transcript is genuine
> output from this repository's own ledger (accuracy discipline: this site
> is built by the tool it describes).

## Hero

**Headline:** Your agents are brilliant. Their process isn't.

**Subline:** metis is the meta-harness for AI coding agents — deterministic
dispatch, scope as a contract, and cross-vendor review, enforced by exit
codes instead of hope.

**Install one-liner (mono, beneath the terminal):**
`curl -fsSL https://raw.githubusercontent.com/techspeque/metis/main/scripts/install.sh | bash`

**Primary CTA:** View on GitHub → https://github.com/techspeque/metis
**Secondary CTA:** Read the docs → https://github.com/techspeque/metis/tree/main/docs

## Hero-terminal

> Genuine output: `metis next -o json` against this website's own ledger,
> the day this copy was written. Re-verify before changing.

```
$ metis next -o json
{
  "active": true,
  "id": "phase-1-ws-1.1",
  "title": "Hero with typed-terminal animation",
  "risk": "medium",
  "role": "Coder",
  "agent_slug": "claude-code/opus",
  ...
}
$ █
```

**Terminal caption:** This very page is a slice in metis's own ledger.

## Problem

**Section heading:** A single long agent session drifts.

**Lead:** It loses scope. It re-explores code it already understood. It
fixes things nobody asked it to fix — and then it marks its own homework.

**The failure list (styled list, four items):**
- Scope creep — files touched that no one asked for
- Self-review — the author grading the author
- Lost context — every session re-discovers the last one
- Mechanical fumbles — walking YAML, comparing slugs, evaluating booleans

## Insight

**Pull-quote:** Everything an agent fumbles should be deterministic tooling,
not agent judgment.

**Attribution line:** — the one rule metis is built on

## Personas

**Section heading:** Two personas, one binary.

**Human column — heading:** The developer
**Human column — body:** You own the spec, the plan, and the priorities.
metis gives you a ledger you can trust, review evidence you can audit, and
a registry to run it across every project you own.

**Agent column — heading:** The agent
**Agent column — body:** Agents get a printed protocol: one slice at a
time, a brief committed before code, machine-checked scope, and a review
they cannot perform on themselves.

## Protocol

**Section heading:** One slice at a time. Every time.

**Diagram states (in order):** pending → coded → reviewed → done
**Loop label (block path):** blocked → rework
**Diagram captions per state:**
- pending — dispatched by `metis next`, never chosen by the agent
- coded — brief committed first, verify green, scope audited
- reviewed — a different agent signs off, identity checked
- done — archived with the full paper trail

**Section footer line:** Findings become rules. Rules prevent repeats. The
system gets better because it remembers.

## Install

**Section heading:** Two minutes to a governed project.

**One-liner (mono block):**
`curl -fsSL https://raw.githubusercontent.com/techspeque/metis/main/scripts/install.sh | bash`

**Alternatives line:** or `go install github.com/techspeque/metis/cmd/metis@latest`,
or grab a [release](https://github.com/techspeque/metis/releases).

**Verification line:** then: `metis init` — it prints every next step.

## Footer

**Colophon:** Built by AI agents, governed by metis — every section of this
page was planned, coded, and cross-vendor reviewed as a slice in its own
ledger. [Read the audit trail](https://github.com/techspeque/metiswww).

**Links:** GitHub · Docs · Releases · MIT License

**Copyright line:** © 2026 techspeque
