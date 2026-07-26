---
type: gate
slice: phase-0-gate
phase: 0
title: Phase 0 Gate — Foundation
date: 2026-07-25
verdict: pass
---

# phase-0-gate — Phase 0 gate: composed-system validation

- **Type:** gate | **Risk:** high | **Priority:** p2
- **Coder:** claude-code/opus | **Date:** 2026-07-25
- **Plan:** .metis/plans/phase-0.md §Phase Gate

## Phase being validated

Phase 0 — Foundation: design-token system (0.1), base layout + self-hosted
fonts + metadata (0.2), and the six-section page skeleton (0.3), composed into
a fully-themed, zero-JS single page.

## Declared file scope

- **owned_paths:**
  - .metis/briefs/phase-0-gate.md
- **read_only_paths:**
  - OVERVIEW.md (§3.4 invariants)
  - .metis/plans/phase-0.md (§Phase Gate)
  - src/** and dist/** (validated as built artifacts; not modified)

> Gate discipline: this slice only produces the evidence report. No product
> code was touched (git tree stayed clean apart from this report). All render
> checks ran against a throwaway `dist` copy in the session scratchpad.

---

## 1. Prerequisite Check

- [x] All phase-0 slices coded and reviewed — ws-0.1, ws-0.2, ws-0.3 all
      flipped `reviewed` and archived (`git log`: commits `e547af5`,
      `2ca40b1`, `1424876`). Only `phase-0-gate` remains active in
      `.metis/slices.yaml`.
- [x] No open P1 findings against phase-0 slices — `.metis/findings.yaml` is
      `findings: []`.
- [~] All phase-0 ADRs in accepted status — **vacuously satisfied.** No
      phase-0 ADRs exist (`.metis/adr/` holds only `_template.md`); none of the
      three workstream briefs required one. See §5 for the doc/reality note on
      the plan header.
- [x] `metis verify` passes on clean checkout — `metis verify --pre` → exit 0
      (`verify: ALL GREEN`); clean `npm run verify` (after `rm -rf dist`) →
      exit 0.

---

## 2. Composition Scenarios

### Scenario 1: Clean build — tokens, fonts, layout, skeleton compose

- **Setup:** clean `dev` checkout, `dist/` removed.
- **Action:** `rm -rf dist && npm run verify` (= `astro check && astro build`).
- **Expected:** exit 0; page built with no check/build errors.
- **Actual:** `astro check` 0 errors / 0 warnings / 0 hints; `astro build`
      "1 page(s) built"; process exit 0. `metis verify --pre` also GREEN.
- **Verdict:** pass
- **Evidence:** `npm run verify` exit 0 (captured); `metis verify --pre` exit 0.

### Scenario 2: Token contract holds at every seam

- **Setup:** built site plus source token layer.
- **Action:** grep source for raw color values and cross-check that every
      `var(--…)` reference resolves to a token defined in `tokens.css`.
- **Expected:** zero raw hex in any `.astro`; no `rgb()/hsl()/named` colors;
      every referenced custom property is defined; tokens actually applied.
- **Actual:**
  - `grep -rEn '#[0-9a-fA-F]{3,8}' src --include='*.astro'` → no matches.
  - `grep -rEn '#…' src/styles/global.css` and `src/layouts/Base.astro` →
    no matches; `src/components src/pages` → no matches.
  - `grep -rEni 'rgb\(|rgba\(|hsl\(|hsla\(|white|black|red|…' src` → no matches.
  - Token closure: 44 distinct `var(--…)` references across `src`; all 44 are
    defined in `tokens.css`/`fonts.css` (0 undefined — `comm -23` empty).
  - Consumption confirmed live: `global.css` `body` sets
    `background-color: var(--color-bg)` and `color: var(--color-text)`; built
    CSS contains 24 `var(--color-*)` usages.
- **Verdict:** pass
- **Evidence:** greps above; `src/styles/global.css:28-29`; `src/styles/tokens.css:31-41`.

### Scenario 3: End-to-end render — one page, all sections, both schemes

- **Setup:** built `dist/index.html` + `dist/_astro/index.*.css`; Chrome
      headless render of the served page in each color scheme.
- **Action:** inspect built HTML structure/meta; render dark scheme over HTTP
      (astro preview); render light scheme over HTTP from a scratchpad copy
      whose `@media (prefers-color-scheme:light)` was neutralized to `@media all`
      (repo untouched) so fonts resolve.
- **Expected:** single `<main>` with all five section ids + `<footer>`, valid
      OG/meta, both schemes styled and legible.
- **Actual:**
  - `<main>` count 1; `<footer>` count 1; ids `hero`, `problem`, `personas`,
    `protocol`, `install` each present exactly once, in declared order.
  - Meta present: `og:title`, `og:description`, `og:type`, `og:url`,
    `twitter:card`, `<meta name="description">`, `theme-color`;
    `<title>metis — the meta-harness for AI coding agents</title>` (not "Astro").
  - Built CSS contains a `prefers-color-scheme:light` block (dark is the
    `:root` default; exactly one media override — dark-first).
  - **Dark render (HTTP):** ink `#0E1116` background, parchment text, muted
    secondary copy, owl accent hierarchy, Space Grotesk display + JetBrains
    Mono, 8px section rhythm with hairline dividers — legible.
  - **Light render (HTTP, forced):** parchment `#FAF7F0` background, ink
    headings, muted `#5C636E` secondary text, same fonts/spacing/dividers —
    legible.
- **Verdict:** pass
- **Evidence:** greps on `dist/index.html`; scratchpad `render-root.png`
      (dark) and `render-light-http.png` (light).

### Scenario 4: Reduced-motion honored in built output

- **Setup:** built CSS.
- **Action:** `grep 'prefers-reduced-motion' dist/_astro/index.*.css`.
- **Expected:** a `prefers-reduced-motion: reduce` block ships in built CSS.
- **Actual:** `prefers-reduced-motion:reduce` present. (Skeleton ships no
      animations yet, so nothing runs regardless; the global guard is in place
      for Phase 1.)
- **Verdict:** pass
- **Evidence:** grep on `dist/_astro/index.CidyUgey.css`.

### Scenario 5: Copy accuracy — all page copy matches the real metis, no aspirational CLI output

- **Setup (scope verified against the filesystem, per accuracy rule #1 — the
      set below was enumerated with `find`/`grep`, not assumed):** every file
      that carries user-visible page copy. A whole-repo sweep
      (`find src public -type f`; `grep -rn` for the copy literals) establishes
      the complete set:
  - **`src/components/*.astro` (6 files):** Hero, Problem, Personas, Protocol,
    Install, Footer — headings + body prose rendered into `<main>`.
  - **`src/pages/index.astro:16,18`:** the `title` and `description` literals,
    which Base.astro renders into `<title>`, `<meta name="description">`, and
    the og:/twitter: title+description. *This file carries page copy and was
    missed by the prior cycle's Scenario 5 — it is the substance of f-002.*
  - **Not copy sources (excluded, each with a filesystem basis):**
    `src/layouts/Base.astro` is a conduit — it interpolates the
    title/description props and emits only metadata enum values
    (`content="website"`, `content="summary"`); a grep for literal copy strings
    returns none. `src/consts.ts` holds a URL (`SITE.url`) and two hex literals
    (`THEME_COLOR`) — no behavioral copy. `public/` holds only favicons, woff2
    fonts, and font-license `.txt` files — none rendered as page copy. No other
    page or markdown exists under `src`.
- **Action:** read every copy source; grep source and the built
      `dist/index.html` for CLI commands, flags, shell prompts, fenced blocks,
      and `<code>`/`<pre>` elements (`metis <word>`, `npm `, `--<flag>`, a `$`
      prompt, a triple-backtick fence, `<code`, `<pre`). Trace every shipped
      visible-text and meta string in `dist` back to its source file, then
      classify each string and check it against the correct authority.
- **Expected:** per OVERVIEW.md §3.4, "All copy about metis behavior must match
      the real CLI (commands shown on the site must exist with the shown flags —
      no aspirational output)." So (a) no rendered command/flag/output anywhere,
      and (b) any descriptive claim about metis must be true.
- **Actual — every shipped copy string traced to source and classified:**
  - **Section labels / placeholders (no metis-behavior claim, nothing to
    check):** the section `<h2>`s ("The problem", "Who it's for", "The
    protocol", "Install"), Footer's "metiswww" heading, and every body `<p>`
    ("Placeholder for …"). These name the page's own sections.
  - **Identity / positioning claims (checked against OVERVIEW.md, the spec):**
    `<title>`/og:title/twitter:title "metis — the meta-harness for AI coding
    agents" and Hero `<h1>` "metis" + tagline "The meta-harness that keeps AI
    coding agents on task." Both match OVERVIEW.md §1 ("metis, the meta-harness
    that orchestrates AI coding agents"). Accurate.
  - **Protocol-behavior claims (checked against the real CLI + AGENTS.md — this
    is the substantive copy the §3.4 invariant targets):** the meta description
    (`index.astro:18`, shipped verbatim in `dist` as `<meta name=description>`,
    og:description, and twitter:description): "metis governs AI coding agents
    with a disciplined protocol: one slice at a time, file scope as a contract,
    and cross-vendor review — so scope creep, self-review, and lost context stop
    happening." Each claim was verified against the CLI mechanism, not just a
    prose match:
    - *"one slice at a time"* ← `metis next -o json` returns a single
      active-slice object (not a list); `metis status` reads "0/1"; AGENTS.md
      Hard Rule 1 ("ONE slice at a time — `metis next` decides which, not you").
    - *"file scope as a contract"* ← the brief declares `owned_paths`;
      `metis log <id> --validate` audits committed files against that scope;
      AGENTS.md Hard Rule 3 ("Scope is a contract — only touch files declared in
      your brief").
    - *"cross-vendor review"* ← `metis commit --flip reviewed --agent <slug>`
      requires a reviewer identity (distinct from the coder); Model Routing
      "Review: cross-vendor"; AGENTS.md Hard Rule 4 ("Cross-vendor review — you
      cannot review your own work"). All three hold.
  - No component or page renders a command, flag, shell prompt, or
    command-output block; the source grep's only hits are CSS custom properties
    (`--space-*`, `border-bottom`) inside `<style>`, not copy.
- **Verdict:** pass — **substantively satisfied, not vacuous.** Correcting the
      prior cycle's characterization (f-002): the page *does* carry copy about
      metis behavior — the meta description's three protocol claims — and each is
      true against the real CLI and contract, so the §3.4 invariant is satisfied
      by accurate claims, not by an absence of claims. Only the invariant's
      narrow sub-clause ("commands shown … must exist with the shown flags") is
      vacuous today: no command string is rendered anywhere yet. Phase 1
      introduces rendered commands (typed terminal, install one-liner, lifecycle
      labels) and re-arms that sub-clause as a live check.
- **Evidence:** `find src public` + `grep -rn` copy sweep (the complete file set
      above); full read of the 6 components, `index.astro`, `Base.astro`,
      `consts.ts`; `dist/index.html` grep tracing every shipped visible/meta
      string to source; `metis next -o json` / `metis status` / AGENTS.md Hard
      Rules 1, 3, 4 + Model Routing for the three protocol claims; OVERVIEW.md §1
      for the positioning claims.

---

## 3. Interface Seam Verification

| Boundary | Provider | Consumer | Contract | Status |
|---|---|---|---|---|
| Design tokens | src/styles/tokens.css | global.css, Base.astro, 6 components, index.astro | semantic `--color-*` / `--text-*` / `--space-*` custom properties | verified (44 refs all defined; 0 raw hex; 24 `--color-*` usages in built CSS) |
| Fonts | src/styles/fonts.css | tokens `--font-*`, global.css | `@font-face` (font-display: swap), local woff2 | verified (2 `@font-face`, local `/fonts/*.woff2`, both faces render) |
| Layout shell | src/layouts/Base.astro | src/pages/index.astro | HTML shell + `<slot />`, head/meta/theming | verified (single `<main>`, five ids + footer render through the shell) |

---

## 4. Performance / Resource Check

| Metric | Value | Threshold | Status |
|---|---|---|---|
| Client-side JS in dist | 0 `<script>` tags | zero | ok |
| Total built CSS | 5,864 B (5.73 KB) | ≤ 50 KB | ok |
| Total font payload | 62,692 B (61.22 KB), woff2 only | ≤ 300 KB | ok |
| External origins on load | 0 (only `og:url` canonical metadata references a URL) | none | ok |
| Font families | 2 (`@font-face` × 2), self-hosted | ≤ 2 | ok |

Contrast (WCAG AA, independently recomputed via sRGB luminance — all 8
documented pairings match the `tokens.css` table exactly; every text pairing
≥ 4.5:1):

| Pairing | Computed | AA |
|---|---|---|
| text `#FAF7F0` on ink `#0E1116` | 17.68:1 | pass |
| muted `#A7ADB8` on ink | 8.39:1 | pass |
| accent `#D4A24E` on ink | 8.17:1 | pass |
| secondary `#2E8C83` on ink (tightest dark) | 4.68:1 | pass |
| text `#0E1116` on parchment `#FAF7F0` | 17.68:1 | pass |
| accent `#8A5A12` on parchment (tightest light) | 5.53:1 | pass |
| muted `#5C636E` on parchment | 5.66:1 | pass |
| secondary `#1F6B63` on parchment | 5.87:1 | pass |

---

## 5. Findings

No composition failures. Nothing filed via `metis block`.

One non-blocking documentation note (Hard Rule 9 — reality beats documents):

| Finding | Severity | Offending Slice | Filed As |
|---|---|---|---|
| Plan header (`phase-0.md`) states "ADRs: .metis/adr/NNNN-*.md (created alongside this plan)", but no phase-0 ADRs exist — only `_template.md`. No workstream required an ADR, so the gate prerequisite is vacuously satisfied. Recommend the plan owner correct the header. | P3 | (plan doc, not a code slice) | not filed (doc note only; no code defect, does not block the gate) |

---

## 6. Verdict

**PASS**

Phase 0 is validated as a composed system. Tokens (0.1) are consumed by the
layout (0.2) and the six-section skeleton (0.3) with zero raw color at any
seam; the site builds clean, ships zero client JS, styles both color schemes
(dark-first with a light override) and renders legibly in each under a real
browser; all WCAG AA pairings hold; and CSS/font/external-origin budgets are
well within threshold. All five OVERVIEW.md §3.4 invariants are evidenced,
including copy accuracy: the only copy about metis behavior on the page — the
meta description's protocol claims — is true against the real CLI (Scenario 5),
and no aspirational command output is rendered anywhere. Proceed to Phase 1
planning.

## Report

See §1–§6 above — filled during execution with actual evidence (commands run
and their observed output; live dark/light browser renders in the session
scratchpad).
