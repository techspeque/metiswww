# metiswww Copy Deck

> Single source of truth for all rendered site copy (ADR-0003). Components
> render these strings verbatim; wording changes land here first. Every CLI
> claim below was verified against metis v0.0.6 on 2026-07-26 — commands
> shown exist with the shown flags, and the terminal transcript is genuine
> output from this repository's own ledger (accuracy discipline: this site
> is built by the tool it describes).

## Meta

> Head copy, not body copy: `src/pages/index.astro` passes these to Base.astro,
> which renders the title into `<title>` + `og:title` + `twitter:title` and the
> description into `<meta name="description">` + `og:description` +
> `twitter:description`. Authored in phase 0, before this deck existed; brought
> under the deck by the phase-1 gate so ADR-0003's pinned source covers every
> rendered string, head included, not only what lands in `<main>`.

**Title:** metis — the meta-harness for AI coding agents

**Description:** metis governs AI coding agents with a disciplined protocol:
one slice at a time, file scope as a contract, and cross-vendor review — so
scope creep, self-review, and lost context stop happening.

> Each claim in the description is verified against metis v0.0.6, per the CLI
> discipline in this deck's header: "one slice at a time" — `metis next -o json`
> returns a single active-slice object, never a list; "file scope as a contract"
> — `metis log <id> --validate` audits committed files against the brief's
> `owned_paths`; "cross-vendor review" — `metis commit --flip reviewed` requires
> `--agent`, which its own help calls "required with --flip reviewed for
> cross-vendor validation".

## Hero

**Headline:** Your agents are brilliant. Their process isn't.

**Subline:** metis is the meta-harness for AI coding agents — deterministic
dispatch, scope as a contract, and cross-vendor review, enforced by exit
codes instead of hope.

**Vendor line (small, beneath the subline — added by Amendment A, rendered
by slice phase-2-ws-2.4):** Agent-agnostic by design — Claude Code,
opencode, Codex, or any surface that reads `AGENTS.md`. One protocol, zero
lock-in.

> Vendor-line verification: `metis surface generate` writes CLAUDE.md,
> AGENTS.md, opencode.json, and .claude/settings.json (internal/surface);
> AGENTS.md is the convention Codex and other surfaces read; README "Why
> Meta" states agent-agnosticism. This repository's own ledger pairs
> claude-code/opus with opencode/gpt-5.6-sol — the claim is demonstrated,
> not aspirational.

> Install one-liner retired from the hero (phase-3-ws-3.1): it duplicated
> §Install's one-liner verbatim, one screen below. The command now renders
> exactly once on the page, in §Install.

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

**Terminal caption:** This very page is a slice in metis's own ledger, built
under its own protocol, where the numbers tell the real story:

> Rewritten by phase-3-ws-3.1: the caption absorbed the §Proof kicker
> ("built under its own protocol") and now ends in a colon — it is the
> sentence that introduces the stats strip directly below the terminal.

## Proof (hero stats strip)

> Rendered beneath the terminal caption (slice phase-2-ws-2.4). Governed by
> ADR-0008 and ADR-0009: every number below is measured from THIS
> repository's public ledger and carries a verification note, so a reader
> can recompute it. Under ADR-0009 the values are Human-owned — agents
> render them verbatim, do not recompute them, and a stale value is not a
> finding; the Human refreshes all four and the as-of date once before
> release. A *label* that makes a false claim remains a P2.
> One estimate is used here — stat 4 — and renders visibly labeled `est.`
> per ADR-0008; its prefix and "at best observed" qualifier may not be
> dropped.

> Kicker retired (phase-3-ws-3.1). It read "Dogfood numbers — this site,
> built under its own protocol" and was compacted into the §Hero-terminal
> caption, which now introduces the strip. No kicker renders; the stats
> list's accessible name moves to the caption (wiring recorded in the
> brief).

**Stat 1 — value:** `9/9`
**Stat 1 — label:** slices independently reviewed — never by their author

**Stat 2 — value:** `10`
**Stat 2 — label:** findings logged against this site's own slices — every
one public in the ledger, none ever removed

**Stat 3 — value:** `0`
**Stat 3 — label:** out-of-scope files shipped — file scope is
machine-audited on every slice

**Stat 4 — value:** `−55%`
**Stat 4 — label:** est. token spend at best observed — one bounded slice
at a time replaces session-long re-exploration

**Caption (with link):** Three numbers measured from this repository's own
ledger as of 2026-07-26; the fourth is a labeled estimate —
[audit the ledger](https://github.com/techspeque/metiswww/tree/main/.metis).

> Link retargeted by phase-3-ws-3.1: it now lands on the ledger directory
> itself (.metis/ on main — slices, findings, briefs, runs) rather than the
> repository root, so "audit the ledger" opens the ledger.

> Verification notes. Under ADR-0008 these bound the reviewer, who had to
> recompute each number before approving. ADR-0009 withdraws that: the values
> are Human-owned, agents render them verbatim and never recompute them, and a
> stale value is not a finding. What the notes are FOR now is the reader — the
> caption invites an audit, and these are the methods that make it possible —
> and the Human, who re-runs all four and re-dates the caption once before the
> dev → main merge. What a reviewer still checks, each still a P2: stat 4's
> `est.` prefix and "at best observed" qualifier render intact, the caption's
> as-of date renders, and no label makes a false claim.
>
> - **9/9:** count entries in `.metis/slices-done.yaml` (9: phase-0 ws
>   0.1–0.3 + gate, phase-1 ws 1.1–1.4 + gate); every entry has
>   `reviewed: true` and a `reviewer` slug different from its `coder`
>   (phase 0: claude-code/opus vs claude-code/sonnet; phase 1:
>   claude-code/opus vs opencode/gpt-5.6-sol).
> - **10:** count entries in `.metis/findings.yaml`, or `metis findings`.
>   "None ever removed" is the auditable half of the claim: replay every
>   commit that touched the file and count entries at each —
>   `git log --format=%h -- .metis/findings.yaml | while read c; do
>   git show $c:.metis/findings.yaml | grep -c '  - id: f-'; done` — the
>   sequence never decreases, so no finding has been deleted or rewritten
>   out. Statuses at the time of writing: 6 resolved, 3 open, 2 advisory;
>   the claim is that all of them are on the public record, not that all
>   were fixed.
>
>   **This value is Human-owned (ADR-0009) and WILL run stale** — it stood
>   at 11 within an hour of being written, because f-011 was raised against
>   this very stat. That is expected and is not a finding: the as-of date
>   carries it and the Human refreshes it before release. Agents render it
>   verbatim and do not recompute it. What remains a P2 is the *label*
>   making a false claim.
>
>   The label was rewritten during phase-2-ws-2.4 review cycle 1. It
>   previously read "findings caught in review, all after the author had
>   called the work done", which was false: f-006, f-007 and f-008 were
>   advisories the coder self-recorded during the phase-1 gate, committed
>   before that gate's first `flip coded` (6ce3545/106f067/9b6ca1e vs
>   4494d3d). Note also that `.metis/findings.yaml` records no author or
>   reviewer field at all, so any authorship claim about a finding can only
>   be inferred from commit position — which is why the label no longer
>   makes one.
> - **0:** the one out-of-scope touch ever recorded (f-010,
>   docs/copy.md outside the phase-1-gate brief's owned_paths) was caught
>   by the scope audit and remediated before merge; final state verified
>   via `metis log phase-1-gate --validate -o json` → `ok=true`,
>   `out_of_scope_files=[]`. No other finding or validation reports an
>   out-of-scope file.
> - **−55% (est.):** a labeled estimate under ADR-0008's estimate clause,
>   NOT ledger-recomputable — which is exactly why the `est.` prefix and
>   "at best observed" qualifier are part of the rendered label and may
>   never be dropped. Basis: the product owner's token-usage records from
>   building this site — comparable feature work run as governed metis
>   slices vs. ungoverned long sessions showed up to 55% lower token
>   spend (best case, not a mean). Mechanism, for the skeptical reader:
>   `metis kickoff` prints the contract instead of the agent re-deriving
>   it, one-slice dispatch keeps context bounded, and deterministic
>   tooling replaces exploratory YAML-walking. Reviewer checks: the label
>   renders with `est.` intact, the figure appears nowhere unlabeled, and
>   the claim is phrased as spend observed on this project — never as a
>   CLI behavior or a guarantee.

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

## Workflow

> New section between Protocol and Install (slice phase-2-ws-2.5). The
> four step lines are PROMPTS a human types to an agent — human words, not
> shell commands — and must render visually distinct from CLI output (no
> `$` prompt glyph on them). The parenthetical captions are behavior
> claims and were verified against metis v0.0.6: `metis kickoff` emits the
> session protocol, `metis next` performs deterministic dispatch,
> `metis commit --flip reviewed` requires `--agent` for cross-vendor
> validation, `metis verify` signals through distinct exit codes.

**Section heading:** Run it from two terminals.

**Lead:** One terminal codes. One terminal reviews. Neither sees the
other's context — the ledger is the only shared state. Point them at
different vendors — the pairing is config, not code — and let the
protocol referee.

**The loop (four steps, alternating terminals):**

1. **Terminal 1 — the coder:** "Go for dev of the next slice."
   *(the agent runs `metis kickoff`, gets dispatched one slice, commits a
   brief, codes inside its declared scope, flips `coded`)*
2. **Terminal 2 — the reviewer:** "Go for review of the next slice."
   *(a different agent audits scope and the checklist, then files
   findings — or flips `reviewed`)*
3. **Terminal 1 — the coder:** "Fix the findings from review."
   *(rework lands on the same slice, same scope, same paper trail)*
4. **Terminal 2 — the reviewer:** "Go for re-review — focus on the
   findings." *(the loop repeats until clean; the final flip demands a
   different agent's identity)*

**Section footer line:** The prompts stay four words long because the
protocol carries the context: `metis kickoff` prints the contract,
`metis next` picks the slice, and exit codes do the arguing.

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
ledger. [Read the audit trail](https://github.com/techspeque/metiswww/tree/main/.metis).

> Link retargeted by phase-3-ws-3.1, same reasoning as §Proof's caption
> link: the audit trail IS the .metis directory, so the anchor lands there.

**Links:** GitHub · Docs · Releases · MIT License

**Copyright line:** © 2026 techspeque

## ThemeToggle

> Chrome, not body copy (slice phase-2-ws-2.6, ADR-0007). The button is
> hidden until the theme script enables it; no-JS visitors never see it.

**Accessible label when dark is active:** Switch to light theme
**Accessible label when light is active:** Switch to dark theme

> Visible affordance is the implementer's choice within OVERVIEW §3.2
> (no emoji; suggestion: the words "Light" / "Dark" or a two-tone disc
> drawn in CSS). The accessible name must be one of the two labels above,
> verbatim.

## NotFound (404 page)

**Heading:** 404 — no active slice here.

**Body:** This page isn't in the ledger. The dispatch algorithm suggests
returning to the last known good state.

**CTA:** ← Back to metis

**Terminal garnish (mono, static):**
```
$ metis next
No active slices. The backlog is empty.
```
