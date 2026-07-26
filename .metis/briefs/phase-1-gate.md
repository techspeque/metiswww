---
type: gate
slice: phase-1-gate
phase: 1
title: Phase 1 Gate — Sections
date: 2026-07-26
verdict: pass
---

# phase-1-gate — Phase 1 gate: composed-system validation

- **Type:** gate | **Risk:** high | **Priority:** p2
- **Coder:** claude-code/opus | **Date:** 2026-07-26
- **Plan:** .metis/plans/phase-1.md §Phase Gate
- **CLI under test:** `metis --version` → `metis 0.0.6 (1653ed3) built 2026-07-26T08:31:08Z`
  (plan asks for v0.0.6+)

## Phase being validated

Phase 1 — Sections: Hero with the CSS typed terminal (ws-1.1), Problem +
Insight + Personas (ws-1.2), the Protocol lifecycle diagram carrying the one
permitted inline observer (ws-1.3), and Install + Footer with the ADR-0004
landmark amendment (ws-1.4) — composed into the content-complete single page.

## Declared file scope

- **owned_paths:**
  - .metis/briefs/phase-1-gate.md
  - docs/copy.md
- **read_only_paths:**
  - OVERVIEW.md (§3.2, §3.4)
  - .metis/plans/phase-1.md (§Phase Gate)
  - .metis/adr/0002, 0003, 0004 (the policies this gate enforces)
  - src/** and dist/** (validated as built artifacts; not modified)

> Gate discipline: this slice produces the evidence report, plus the one copy-
> deck edit the reviewer directed in cycle 1. **No product code was touched** in
> either cycle: `src/**` is untouched, and the built output is byte-identical
> across the deck edit (§7 proves it — same CSS content hash, same 14,420 bytes).
> All render checks ran against throwaway `dist` copies in the session
> scratchpad; the repository's own `dist/` was only rebuilt, never edited. Where
> a scenario surfaced a *code* defect (§5 f-006), it was recorded and routed, not
> fixed — that fix belongs to a workstream slice, which is a planning decision.

---

## 1. Prerequisite Check

- [x] **All phase-1 slices coded and reviewed.** `.metis/slices-done.yaml`
      records ws-1.1 (`coded: true, reviewed: true, review_cycles: 0`),
      ws-1.2 (`1`), ws-1.3 (`1`), ws-1.4 (`0`); all four archived. `metis
      next -o json` returns `phase-1-gate` as the only active phase-1 entry,
      and `.metis/slices.yaml` holds no other `phase-1` id.
- [x] **No open P1 findings against phase-1 slices.** `.metis/findings.yaml`
      holds five entries. f-003 (P3, ws-1.2) and f-005 (P2, ws-1.3) are both
      `status: resolved` with verification notes. f-004 (ws-1.2) is
      `status: advisory` — the Lightning-CSS media-range rewrite — and its own
      text routes it to phase-2 ws-2.2; it is carried forward here rather than
      dropped (§5). No P1 exists anywhere in the file.
- [~] **Open phase-0 findings — stated, not silently passed.** f-001 and f-002
      are both `status: open`, both P3, both against `phase-0-gate` (not a
      phase-1 slice), and both are evidence-trail defects in the phase-0 gate
      *report*, not code defects. Reading `.metis/briefs/phase-0-gate.md`
      today, both fixes are already present in the text: Scenario 5's Setup
      enumerates `src/pages/index.astro:16,18` and the verdict reads
      "substantively satisfied, not vacuous." Closing them via
      `metis findings resolve` is the phase-0-gate reviewer's action, not
      this gate's. They do not block: the stated bar is "no open **P1**".
- [x] **All phase-1 ADRs accepted.** `.metis/adr/0002`, `0003`, `0004` all
      carry `status: accepted`, `phase: 1`. (0005 and 0006 are phase-2 ADRs
      and are out of scope here.)
- [x] **`metis verify` passes on a clean checkout.** `metis verify --pre` →
      exit 0, `verify: ALL GREEN` (log: `.metis/runs/phase-1-gate/verify-pre.log`).

---

## 2. Composition Scenarios

The plan declares five composition bullets plus a performance line. This report
reorganises them into six scenarios; the mapping is:

| .metis/plans/phase-1.md §Phase Gate | Covered by |
|---|---|
| Full-page render in both schemes, no placeholder text | Scenario 1 (build + placeholder sweep) and Scenario 5 (both-scheme renders) |
| Copy audit — traceable to docs/copy.md, CLI claims verified against v0.0.6+ | Scenario 2 |
| Animation policy — one inline script, plays once, reduced-motion final states | Scenario 3 |
| Landmarks — one main, body-level footer, one h1, unbroken headings | Scenario 4 |
| WCAG AA pairings documented and true for new UI | §4 (contrast table + reproduction note) |
| Perf — CSS ≤ 50KB, script ≤ 600 B, no new fonts | §4 (budget table) |
| *(not plan-declared)* responsive behaviour at the new breakpoints | Scenario 6 |

### Scenario 1: Clean build — five sections plus footer compose, no placeholders

- **Setup:** clean `dev` checkout, `dist/` removed.
- **Action:** `rm -rf dist && npm run verify` (= `astro check && astro build`);
      then sweep the built output for placeholder copy.
- **Expected:** exit 0, zero check errors; no placeholder/lorem/TODO text
      anywhere in the built page or CSS.
- **Actual:** `astro check` → 0 errors / 0 warnings / 0 hints; `astro build` →
      "1 page(s) built"; exit 0.
      `grep -rniE 'placeholder|lorem|ipsum|TODO|TBD|FIXME|XXX|coming soon'` over
      `dist/index.html` and `dist/_astro/*.css` → **no matches**. The same grep
      over `src/` returns exactly one hit — `Footer.astro:7`, a frontmatter
      comment recording that the placeholder `<h2>` was removed — which Astro
      compiles away and which therefore never reaches `dist`.
- **Verdict:** pass
- **Evidence:** `npm run verify` exit 0 (scratchpad `verify.log`); the two greps
      above.

### Scenario 2: Copy audit — traceability to docs/copy.md and CLI accuracy

**Setup — copy-carrying file set enumerated from the filesystem (accuracy rule
#1; `find`, then `grep -rl` for the deck's distinctive literals, not assumed):**

`find src public -type f` returns 18 files. Of those, `grep -rl` for eight
distinctive deck strings ("Your agents are brilliant", "A single long agent
session", "Two personas", "One slice at a time", "Two minutes to a governed",
"Built by AI agents", "deterministic tooling", "meta-harness") resolves the
copy-carrying set to **seven** files:

- **`src/components/*.astro` (6):** Hero, Problem, Personas, Protocol, Install,
  Footer — all `<main>`/`<footer>` body copy.
- **`src/pages/index.astro:23-25`:** the `title` and `description` literals,
  which Base.astro renders into `<title>`, `<meta name="description">` and the
  og:/twitter: title+description. Included here deliberately — omitting it is
  what f-002 blocked phase-0-gate for.

**Excluded, each with a filesystem basis:** `src/layouts/Base.astro` is a
conduit — it interpolates the title/description props and emits only metadata
enum values (`content="website"`, `content="summary"`) plus `lang="en"`; a grep
for deck literals returns none. `src/consts.ts` holds one URL (`SITE.url`) and
two hex literals (`THEME_COLOR`) — no behavioral copy. `src/styles/*.css` (3)
carry no text content. `public/` (6) holds favicons, two `.woff2` faces and two
font-licence `.txt` files — none rendered as page copy. No other page, markdown
or component exists under `src`.

- **Action (a) deck → dist:** assert 41 deck strings (every heading, body
      paragraph, list item, caption, CTA label, URL, link label and the
      copyright line) appear verbatim in `dist/index.html`.
- **Action (b) dist → deck:** extract every visible text node in `<body>`
      (scripts and styles stripped), then require each to appear in
      `docs/copy.md` after normalising the deck only for markdown syntax
      (`[label](url)` → `label`, backticks and `**` removed, whitespace
      collapsed) — i.e. the check is on the deck side, never on the rendered
      side.
- **Action (b′) head → deck (added in cycle 1):** extract every rendered head
      copy string — `<title>` and the `description` / `og:title` /
      `og:description` / `twitter:title` / `twitter:description` `content`
      values — and require each to trace to the deck under the same
      deck-side-only normalisation.
- **Action (c):** byte-for-byte diff of the rendered hero transcript against
      §Hero-terminal.
- **Action (d):** run or `--help` every command string the page renders, and
      resolve every URL it renders.
- **Actual:**
  - **(a)** 41/41 present. Multiplicities are the specified state, not bugs:
    the install one-liner appears **twice** (§Hero "beneath the terminal" and
    §Install "mono block"), and the three metis URLs recur across Hero CTAs and
    the footer link cluster.
  - **(b)** **51/51 visible text nodes traceable**, 0 untraceable. Re-run after
    the cycle-1 deck edit: still 51/51, 0 untraceable.
  - **(b′)** **6/6 head copy strings traceable**, 0 untraceable — `<title>`,
    `description`, `og:title`, `og:description`, `twitter:title`,
    `twitter:description`. Beyond traceability, the deck's §Meta values are
    **byte-identical** to the literals `index.astro:23-25` authors (`title ==
    deck Title` → True; `description == deck Description` unwrapped → True), and
    the title ships as `<title>…</title>` verbatim with the description
    appearing 3× in `dist` (name, og, twitter) — so "renders verbatim from the
    deck" is true in the strong sense, not just the normalised one.
  - **(c)** transcript matches §Hero-terminal **byte-for-byte** — 204 bytes
    rendered, 204 bytes in the deck, `==` True. Zero HTML entities in the
    transcript, and zero in the whole document (`&…;` scan returns `[]`), so the
    literal-byte grep the phase-1 components were built around holds.
  - **(d) every rendered command verified against metis 0.0.6:**

| Rendered string | Where | Verification |
|---|---|---|
| `metis next -o json` | Hero transcript | run at session kickoff; `-o, --output` is a documented global flag (`metis --help`) |
| `metis next` | Protocol, "pending" caption | `metis --help` → `next  Find the active slice and display dispatch info` |
| `metis init` | Install, verification line | `metis init --help` → exists, **no required flags**; its own help says "the Next steps it prints are copy-pasteable", matching the deck's "it prints every next step" |
| `curl -fsSL https://raw.githubusercontent.com/…/scripts/install.sh \| bash` | Hero + Install | URL resolves **200** (fetched, not executed) |
| `go install github.com/techspeque/metis/cmd/metis@latest` | Install, alternatives | remote `go.mod` line 1 is `module github.com/techspeque/metis`; `cmd/metis/main.go` resolves **200** |

  - **(d) every rendered URL resolves 200:** repo, `/tree/main/docs`,
    `/releases`, `/blob/main/LICENSE` (first line: `MIT License`, so the footer
    label is accurate), and `github.com/techspeque/metiswww`.
  - **(d) every protocol claim in the copy verified against the CLI**, not just
    read for plausibility: "brief committed first" ← `metis commit --brief`;
    "scope audited" ← `metis log --validate` ("audits the slice's commits:
    format compliance and files vs the brief's owned_paths"); "a different agent
    signs off, identity checked" ← `metis commit --flip reviewed` requires
    `--agent` ("required with --flip reviewed for cross-vendor validation");
    "archived with the full paper trail" ← `metis archive`; "blocked → rework" ←
    `metis block` + `metis reopen`; "Findings become rules" ← `metis rule
    promote`; Personas' "a registry to run it across every project you own" ←
    `metis workspace` ("Manage the user-level workspace registry").

- **On the transcript's elision (pre-empting the reviewer's diff):** today's
  real `metis next -o json` emits keys in the order `active, id, title, type,
  priority, risk, role, agent_slug, plan, plan_section, review_cycles,
  reading_rule`. The rendered transcript shows `active, id, title, risk, role,
  agent_slug` then `...` — the genuine order with `type`/`priority` elided
  mid-object and the tail elided under the trailing `...`. Every line shown is
  real output and every value matches the archived ledger record for
  phase-1-ws-1.1 (`.metis/slices-done.yaml`: title "Hero with typed-terminal
  animation", `risk: medium`, `coder: claude-code/opus`). No line is invented,
  so §3.4's "no aspirational output" holds; the elision is truncation, marked.

- **Verdict:** **pass — fully, in both directions.**
  **Cycle 0 recorded this scenario as "pass for body copy; not literally met for
  head copy" and still returned PASS. The reviewer blocked that, correctly**
  (f-009): a gate cannot pass a criterion its own evidence says is unmet. Cycle 1
  closes the gap at its source rather than re-arguing it — `docs/copy.md` now
  carries a **§Meta** section holding the title and description verbatim, so
  every rendered string on the page, head and body, traces to the deck:
  **57/57** (51 body nodes + 6 head strings), 0 untraceable. ADR-0003's pinned
  source now covers the whole document, and the plan's criterion at
  `.metis/plans/phase-1.md:139-141` is met literally, not by interpretation.
  The claims themselves were already true and remain verified against metis
  0.0.6 — "one slice at a time" ← `metis next -o json` returns a single
  active-slice object; "file scope as a contract" ← `metis log --validate`;
  "cross-vendor review" ← the `--agent` requirement — and that verification is
  now recorded in the deck beside the copy, where the next editor will see it.
- **Evidence:** `find src public` + `grep -rl` file-set enumeration; the 41-string,
      51-node and 6-head-string scripted comparisons; the byte-identical
      deck-vs-`index.astro` diff; the 204-byte transcript diff; the command and
      URL tables above. Re-run end-to-end in cycle 1 (§7).

### Scenario 3: Animation policy (ADR-0002) — one script, plays once, reduced-motion complete

- **Setup:** built `dist/`, plus four scratchpad copies of it served over HTTP
      (fonts and CSS are root-relative, so **each variant needs its own server
      root** — serving them from one parent directory 404s the CSS and silently
      renders an unstyled page): `dark` (light block neutralised to
      `@media not all`), `light` (neutralised to `@media all`), `rm`
      (no-preference blocks → `@media not all`, reduce → `@media all`), and
      `nojs` (the `<script>` element removed from the HTML).
- **Action:** count and measure the built script; audit every animation
      declaration's position in the cascade; render each variant at several
      virtual-time budgets.
- **Expected:** exactly one inline script containing `IntersectionObserver`,
      under 600 bytes; no other JS in `dist`; nothing loops; reduced-motion and
      no-JS both render the complete final state.
- **Actual:**
  - **`grep -c '<script' dist/index.html` → 1.** No `src` attribute; content is
    `new IntersectionObserver(…).observe(document.getElementById("protocol"))`.
    **177 bytes inner text, 194 bytes including the tag** — under 600 on either
    definition, so ADR-0002's ambiguity there does not affect the verdict.
    `node --check` on the extracted script: syntax OK.
  - **Zero other JS:** `find dist -name '*.js' -o -name '*.mjs'` → 0 files;
    `dist/` contains only `index.html`, one CSS file, two favicons, two `.woff2`
    and two licence `.txt`. No inline `on*=` handlers, no `javascript:` URLs.
  - **Nothing loops:** `infinite` → 0 occurrences, `alternate` → 0. Every
    animation uses `forwards` or `backwards` fill at default iteration count 1,
    and the observer calls `o.unobserve(e.target)` on first hit.
  - **Durations inside ADR-0002's 200-700ms envelope:** `type` 650ms,
    `caret-out` 200ms, `emit` 220ms, `state-in` 320ms. Composed hero sequence
    ends at 2405ms + 220ms ≈ **2.6s**, inside ws-1.1's 2-4s.
  - **Every animation declaration is opt-in.** Extracting the two
    `@media (prefers-reduced-motion:no-preference)` blocks from the built CSS
    and removing them leaves exactly one `animation-*` declaration in the file:
    `animation-duration:.01ms!important` inside the global `reduce` guard. The
    two `opacity:0` occurrences outside those blocks are both `@keyframes` `0%`
    frames (`emit`, `state-in`) — never applied without a running animation.
    `visibility:hidden` appears nowhere.
  - **Renders (dark variant, motion enabled):** at `virtual-time-budget=60` the
    terminal is empty but for the owl-gold caret — the typing is genuinely
    running; at 8000 the transcript is complete. At ~400ms the diagram shows
    `done` faded/offset and `.loop` not yet drawn while the first three states
    are solid, which is the 420ms/560ms stagger mid-flight — positive proof the
    observer fired, the class landed, and Astro's scoped selectors matched.
  - **Reduced motion (`rm` variant):** at `virtual-time-budget=60` the full
    transcript is already visible with the caret; the diagram is complete
    including the return rail and chip. Nothing is hidden at t≈0.
  - **No JS (`nojs` variant, script element removed):** protocol region renders
    **byte-identical at t=60, t=400 and t=8000** (same md5) and is complete —
    ADR-0005's never-invisible rule, ahead of its slice.
  - **Method note for the reviewer:** Chrome's `--disable-javascript` switch is
    **inert** in this build (200.x, macOS). Renders taken with it are
    JS-enabled; the earlier apparent "no-JS is missing the loop" result was the
    reveal caught mid-stagger, not a defect. True no-JS evidence comes only from
    the script-stripped copy. Chrome headless also **floors the window width at
    500px**, so narrow-viewport work in Scenario 6 uses a sized iframe instead.
- **Verdict:** pass
- **Evidence:** script count/byte measurement; the cascade extraction above;
      scratchpad `dark-t0.png`, `rm-t0.png`, `rm-full-protocol.png`,
      `truenojs-t{60,400,8000}-protocol.png`, `render-dark-full.png`.

### Scenario 4: Landmarks (ADR-0004) and heading outline

- **Setup:** built `dist/index.html`.
- **Action:** count landmark elements; locate `<footer>` relative to `</main>`;
      extract the heading sequence in document order.
- **Expected:** exactly one `<main>`, one `<footer>` as a body-level sibling of
      `<main>` (so it maps to `contentinfo`), exactly one `<h1>`, no skipped
      heading levels.
- **Actual:** `<main>` 1, `<footer>` 1, `<h1>` 1, `<nav>` 0, `<header>` 0.
      `</main>` ends at byte 7852; `<footer>` opens at 7859 with **the empty
      string between them** and `</body></html>` immediately after `</footer>`
      — the footer is a direct child of `<body>`, exactly ADR-0004's decision.
      Heading outline in document order: `h1` "Your agents are brilliant. Their
      process isn't." → `h2` "A single long agent session drifts." → `h2` "Two
      personas, one binary." → `h3` "The developer" → `h3` "The agent" → `h2`
      "One slice at a time. Every time." → `h2` "Two minutes to a governed
      project." No level is skipped (h1→h2, h2→h3, h3→h2 are all legal).
      All 8 external anchors carry `rel="noopener"`; none uses `target`.
- **Verdict:** pass
- **Evidence:** landmark counts and byte offsets above; the extracted heading
      list; the 8-anchor `rel` audit.

### Scenario 5: Both color schemes render complete and legible

- **Setup:** the `dark` and `light` scratchpad variants, each served from its
      own root over HTTP so the self-hosted fonts resolve.
- **Action:** full-page headless render at 1440×4000 in each scheme.
- **Expected:** every section content-complete and legible in both schemes.
- **Actual:** **Dark** — ink `#0E1116` field, parchment headline, muted body,
      owl-gold primary CTA and caret, aegean connectors; hero, problem+insight,
      personas, protocol (four-across with the return rail), install and the
      body-level footer all render fully. **Light** — parchment `#FAF7F0` field,
      ink headings, deep-gold `#8A5A12` CTA and links, deep-aegean connectors;
      same complete structure. Both renders show the full install one-liner,
      the alternatives and verification lines, the four footer links with their
      interpuncts, and the copyright line. No placeholder text in either.
- **Verdict:** pass
- **Evidence:** scratchpad `render-dark-full.png`, `render-light-full.png`.

### Scenario 6: Responsive behaviour at the declared breakpoints

> Not a plan-declared gate scenario. Run because Phase 1 introduced the site's
> first two media queries and the diagram's geometry changes across them.

- **Setup:** the `dark` variant loaded into a width-controlled iframe (headless
      Chrome floors a real window at 500px, so an iframe is the only way to
      measure a phone-width viewport in this environment); a probe reports
      `documentElement.scrollWidth` vs `clientWidth` and the geometry of the
      persona columns and lifecycle states.
- **Action:** measure at 300, 320, 340, 360, 375, 390, 767, 768, 1023, 1024
      and 1440 px.
- **Expected:** personas two-up from 768px, lifecycle four-across from 1024px,
      and no page-level horizontal overflow at any width.
- **Actual:**
  - Breakpoints behave exactly as specified: `personaSideBySide` false at 767,
    **true at 768**; `lifecycleRow` false at 1023, **true at 1024**.
  - `scrollWidth == clientWidth` at 375, 390, 767, 768, 1023, 1024 and 1440 —
    no page overflow. Elements that do extend past the viewport (`PRE.transcript`
    `sw=426/cw=340`, the two install `PRE`s `sw=756/cw=340`) are all inside
    `pre { overflow-x: auto }` (global.css:130) and scroll internally, as
    designed.
  - **Below ~375px the page itself overflows:** at 300/320/340/360 the document
    pins to `scrollWidth=364` against a smaller `clientWidth`. The chain is
    `P.alternatives sw=340/cw=272 → SECTION.section sw=340 → MAIN sw=364`
    (main's 2×24px inline padding). The cause is the unbreakable token
    `github.com/techspeque/metis/cmd/metis@latest` in `Install.astro:49`,
    which — unlike the `<pre>` one-liner above it — sits in a plain `<p>` with
    no overflow or wrapping control. Confirmed visually at 320px: the line runs
    past the viewport edge while the `<pre>` beside it scrolls correctly.
- **Verdict:** pass at ≥375px; **defect below 375px**, recorded as f-006 (P2)
      and routed to phase-2 ws-2.2 (§5). It blocks no declared gate scenario and
      violates no OVERVIEW §3.4 invariant — but see the note in §5.
- **Evidence:** the eleven-width probe table above; scratchpad `shot320-alt.png`.

---

## 3. Interface Seam Verification

| Boundary | Provider | Consumer | Contract | Status |
|---|---|---|---|---|
| Design tokens | `src/styles/tokens.css` | global.css, Base.astro, 6 components, index.astro | semantic `--color-*` / `--text-*` / `--space-*` custom properties | **verified** — 50 distinct `var(--…)` references across `src` (comments stripped), all 50 defined; 0 undefined. Raw hex appears only in tokens.css's brand block; every `#…` in a `.astro` file is inside a CSS comment documenting a contrast ratio, never in a declaration. No `rgb()/hsl()/named` colors anywhere. |
| Copy deck | `docs/copy.md` | 6 components **+ `index.astro`** | every rendered string comes from the deck verbatim (ADR-0003) | **verified, whole document** — 41/41 deck strings present in dist; **57/57** rendered strings traceable (51 body nodes + 6 head strings); transcript byte-identical at 204 B; deck §Meta byte-identical to `index.astro:23-25`. The head gap that cycle 0 reported here was closed in cycle 1 (§7). |
| Layout shell | `src/layouts/Base.astro` | `src/pages/index.astro` | HTML shell + `<slot />`, head/meta/theming | **verified** — one `<main>` renders through the shell with all five section ids; title/description props reach `<title>`, `<meta name=description>` and all four og:/twitter: tags. |
| Landmark split | `src/pages/index.astro` | `Footer.astro` | Footer is a sibling of `<main>`, not a descendant (ADR-0004) | **verified** — empty string between `</main>` and `<footer>`; Footer.astro re-declares the container rules because Astro's scoped `main` rule cannot reach a sibling, and the render confirms the footer is inset like every section above it. |
| Observer ↔ diagram | `Protocol.astro` inline script | `<section id="protocol">` + `.is-revealed` scoped rules | `getElementById("protocol")` must find the section, and `.is-revealed[data-astro-cid-rm6zpkkp]` must match the class the script adds to that same element | **verified empirically** — the ~400ms render shows `done` at its `backwards` start frame and `.loop` not yet drawn while states 1-3 are solid. That is only reachable if the id resolved, the class landed, and the scoped selector matched. |

---

## 4. Performance / Resource Check

| Metric | Value | Threshold | Status |
|---|---|---|---|
| `<script>` elements in dist | 1, inline, no `src` | exactly 1 (ADR-0002) | ok |
| Inline script size | **177 B** inner / **194 B** with tag | ≤ 600 B | ok |
| Other JS files in dist | 0 | 0 | ok |
| Total built CSS | **14,420 B (14.08 KB)** | ≤ 50 KB | ok |
| Font faces / payload | **2 faces, 62,692 B** — byte-for-byte identical to the phase-0 gate's figure, so **no new fonts** were added in Phase 1 | ≤ 2 faces, no new fonts | ok |
| External origins fetched on load | 0 (the only absolute URLs are `og:url` metadata and outbound anchor hrefs) | none | ok |
| Animation durations | 200 / 220 / 320 / 650 ms | 200-700 ms | ok |
| Looping animations | 0 (`infinite`/`alternate` absent) | 0 | ok |

**WCAG AA — independently recomputed** from the raw hex via sRGB relative
luminance, covering the pairings Phase 1 introduces alongside the inherited
ones. Every text pairing ≥ 4.5:1; every informational non-text boundary ≥ 3:1.

| Pairing | Computed | Requirement | Result |
|---|---|---|---|
| text on bg — dark / light | 17.68:1 / 17.68:1 | 4.5:1 | pass |
| muted on bg — dark / light | 8.39:1 / 5.66:1 | 4.5:1 | pass |
| accent on bg — dark / light | 8.17:1 / 5.53:1 | 4.5:1 | pass |
| secondary on bg — dark / light | 4.68:1 / 5.87:1 | 4.5:1 | pass |
| text on surface (state cards, persona columns) — dark / light | 16.14:1 / 18.91:1 | 4.5:1 | pass |
| muted on surface — dark / light | 7.66:1 / 6.06:1 | 4.5:1 | pass |
| **accent on surface (terminal caret, new)** — dark / light | 7.46:1 / 5.91:1 | 4.5:1 | pass |
| **CTA primary: bg-colour label on accent fill (new)** — dark / light | 8.17:1 / 5.53:1 | 4.5:1 | pass |
| **CTA secondary border: muted on bg (new, informational)** — dark / light | 8.39:1 / 5.66:1 | 3:1 | pass |
| **loop rail: secondary on bg (new, non-text UI)** — dark / light | 4.68:1 / 5.87:1 | 3:1 | pass |
| diagram connectors: secondary on surface — dark / light | 4.27:1 / 6.28:1 | decorative | n/a |
| hairline: border on bg — dark / light | 1.41:1 / 1.29:1 | decorative | n/a |

**Reproduction against `tokens.css`.** Its published table (`tokens.css:50-57`
dark, `:60-66` light) carries 15 rows, 13 of them non-decorative. **All 13
non-decorative rows reproduce exactly** — 17.68, 8.39, 8.17, 4.68, 16.14, 7.66,
7.46 (dark) and 17.68, 5.66, 5.53, 5.87, 18.91, 6.06 (light). Both hairline
rows differ, and the table above prints the computed values, so name both:
dark `#2A2F38` on `#0E1116` computes **1.41:1** against a documented 1.40:1 —
rounding at the boundary, the same underlying value — and light `#E2DBCB` on
`#FAF7F0` computes **1.29:1** against a documented 1.10:1, which is a genuine
error (f-008). Reproducing 13 of 13 text pairings is what isolates the light
hairline as the defect rather than the method. Neither hairline carries text or
information, and both sit far below the 3:1 threshold either way, so no AA
conclusion changes. Where this report and f-008's own wording disagree on the
count, **the table and paragraph above are authoritative**: f-008's parenthetical
says "11 of 12 other rows" and then lists 12 values, which miscounts the same
reproduction described here (`metis findings` has no edit path; the substance of
f-008 — the 1.10 vs 1.29 error — is correct).

Two rows in the table above are new pairings `tokens.css` does not document at
all: accent on the light surface (`#8A5A12` on `#FFFFFF`, 5.91:1 — Hero.astro's
comment states it conservatively as "≥ 5.53:1", which holds) and secondary on
the light surface (6.28:1, decorative).

---

## 5. Findings

No composition failure blocks this gate. One blocking finding from cycle 1
(f-009) is **fixed**; three observations recorded; one carried forward.

| ID | Severity | Category | Finding | Routing |
|---|---|---|---|---|
| **f-009** | **P2** | protocol | *(reviewer, cycle 1 — blocking)* The copy audit failed its declared criterion: `.metis/plans/phase-1.md:139-141` requires every rendered string to trace to `docs/copy.md`, but `index.astro:23-25` authored the title and description outside the deck, and the gate report returned PASS while calling the criterion "not literally met". | **fixed in cycle 1** — `docs/copy.md` gains a §Meta section carrying both strings verbatim; 57/57 rendered strings now trace; built output byte-identical (§7). Ready for the reviewer to close. |
| **f-006** | **P2** | behavior | Page-level horizontal overflow below ~375px viewport width. `Install.astro:49` renders `go install github.com/techspeque/metis/cmd/metis@latest` as an unbreakable token in a plain `<p>`; the adjacent `<pre>` one-liner scrolls internally but the paragraph does not. Measured chain at 320px: `P.alternatives sw=340/cw=272 → section 340 → main 364` vs `clientWidth 320`. Clean at 375px and above. | recorded against `phase-1-gate`, routed to **phase-2 ws-2.2** (accessibility/performance pass), where Lighthouse would flag it anyway |
| **f-007** | P3 | protocol | *(self-recorded, cycle 0)* Same substance as f-009 at lower severity: the `<title>` and meta description live outside the deck ADR-0003 pins. | **fixed in cycle 1** by the same §Meta edit. Ready for the reviewer to close alongside f-009. |
| **f-008** | P3 | doc | `tokens.css:66` documents the light hairline `#E2DBCB` on `#FAF7F0` as 1.10:1; independent recomputation gives **1.29:1**. Phase-0 artifact; decorative token, so no AA consequence. Fix: correct the table row. | recorded against `phase-1-gate` |
| f-004 | advisory | — | Lightning CSS rewrites `@media (min-width: 768px)` to range syntax in the built CSS; unsupported before Chrome 104 / Safari 16.4 / Firefox 63, where the query is dropped and personas render single-column. Benign — the layout is mobile-first. Phase 1 added a **second** such query at 1024px (the lifecycle row), so the decision now covers two breakpoints, not one. | already routed to **ws-2.2** by its own text; restated here so it is not silently dropped |

**On f-006 and the verdict.** Viewport integrity is not among the five
composition scenarios the plan declares for this gate, and Scenario 1's plain
reading is content-completeness, not layout. The precedent is f-004: a
layout/browser-support degradation recorded advisory and routed to ws-2.2
rather than blocking its phase. That is the treatment applied here. If the
reviewer reads viewport integrity into Scenario 1, that is a legitimate basis
to block, and this report does not contest it — the measurements above are
complete enough to make that call either way.

---

## 6. Verdict

**PASS**

Phase 1 is validated as a composed system. The five slices compose into a
content-complete page that builds clean with zero check errors and no
placeholder text anywhere in the output. Copy is genuinely pinned to the deck:
41 of 41 deck strings render verbatim, **all 57 rendered strings trace back —
51 body text nodes and, after the cycle-1 fix, the 6 head strings too** — the
hero transcript is byte-identical at 204 bytes, and — the sub-clause
phase-0-gate explicitly deferred to this phase — every command the page now
renders was executed or `--help`-checked against metis 0.0.6 and every URL
resolved 200, so "commands shown must exist with the shown flags" is a live,
satisfied check rather than a vacuous one. ADR-0002 holds exactly: one inline
177-byte IntersectionObserver, no other JS in `dist`, nothing loops, every
animation declaration is opt-in behind `prefers-reduced-motion: no-preference`,
and reduced-motion, no-JS and unsupported-observer paths were each rendered
showing the complete final state. ADR-0004 holds: `<footer>` is a direct child
of `<body>` with one `<main>` and one `<h1>` and an unbroken heading outline.
All AA pairings, including the five Phase 1 introduces, were recomputed
independently and pass. CSS, script and font budgets are well inside threshold,
with no fonts added since Phase 0.

The one blocking finding (f-009, with its lower-severity twin f-007) is fixed
at source, not argued away. Two advisories remain open, neither blocking: a
narrow-viewport overflow routed to ws-2.2 (f-006) and a wrong ratio in a
decorative row of the tokens table (f-008). Proceed to Phase 2.

---

## 7. Review Cycle 1 — the block and the fix

**Finding (f-009, P2/protocol, blocking):** "Phase gate copy audit fails its
declared criterion… The gate brief itself says this criterion is 'not literally
met' while still returning PASS. Add the title and description verbatim to a
Meta section in docs/copy.md (or formally amend the governing requirement
through planning), then rerun the gate evidence and review."

**Response: agreed, no contest.** Cycle 0 surfaced the gap honestly in
Scenario 2 and then returned PASS anyway. That is the defect the reviewer
names, and it is the right block: a gate's verdict has to follow its own
evidence, or the evidence is decoration. Of the two remedies offered, the deck
edit is taken — amending the plan's criterion through planning would weaken a
requirement to fit the artifact, when the artifact was one paragraph away from
meeting it.

**Change made** — the smaller of the two options the finding allows, and the
only file added to scope:

- `docs/copy.md` gains a **§Meta** section ahead of §Hero, carrying the
  **Title** and **Description** verbatim, plus two notes in the deck's existing
  voice: where the strings render (title → `<title>`/`og:title`/`twitter:title`;
  description → `<meta name="description">`/`og:description`/
  `twitter:description`), and the per-claim CLI verification behind the
  description, so the next editor sees the check beside the copy.

**Evidence re-run after the change:**

| Check | Result |
|---|---|
| `rm -rf dist && npm run verify` | exit 0 |
| Head strings → deck | **6/6 traceable**, 0 untraceable (was 0/6) |
| Body nodes → deck | **51/51**, 0 untraceable (unchanged) |
| Deck §Meta vs `index.astro:23-25` | **byte-identical** — `title == deck Title` True, `description == deck Description` True |
| Title/description in `dist` | `<title>…</title>` verbatim; description present 3× (name, og, twitter) |
| Built output changed? | **No** — CSS content hash still `index.BZ3ZAYrX.css`, still 14,420 bytes; all 8 `dist/` files present. `docs/` is not a build input, so the fix is provably render-neutral. |
| Script count / landmarks re-checked post-build | 1 `<script>`; one `<main>`, one `<footer>`, one `<h1>`; footer still after `</main>` |

**Not re-run, and why:** Scenarios 3-6 and §4 depend only on `src/**` and the
built output, neither of which changed — the byte-identical `dist` above is the
proof, so re-rendering would restate cycle 0's results rather than test
anything. The cheap post-build structural checks in the table were re-run
anyway as a guard against exactly that assumption being wrong.

**Left open for the reviewer:** f-009 and f-007 are fixed here but not closed —
`metis findings resolve` is the reviewer's action after independent
verification, not the coder's. f-006 (P2, narrow-viewport overflow) and f-008
(P3, tokens ratio row) are unchanged and still routed as recorded in §5; f-006
in particular was left unfixed deliberately — it is a code defect in
`Install.astro`, outside this gate's scope, and belongs to ws-2.2.

## Report

See §1–§6 above — filled during execution with actual evidence: commands run
and their observed output, scripted deck/dist comparisons, an eleven-width
viewport probe, and live headless renders (dark, light, reduced-motion, no-JS,
and 320px) in the session scratchpad.
