# phase-2-ws-2.2 — Accessibility and performance pass

- **Type:** feat | **Risk:** medium | **Priority:** p2
- **Coder:** claude-code/opus | **Date:** 2026-07-26
- **Plan:** .metis/plans/phase-2.md §2.2

## Goal

Lighthouse ≥95 across performance/accessibility/best-practices/SEO on the
production build, with scores recorded as evidence.

## Architectural context

- Serve dist locally (npx serve / astro preview) and run npx lighthouse
  headless; iterate on findings
- Likely work: favicon/link names, robots.txt, preload tuning, any Phase 1
  contrast regressions (fix in tokens if tokens are wrong, else in the
  offending component — declare out-of-scope touches in this brief if a
  tokens change is required)
- Do NOT trade the zero-framework/one-script constraints for score

### Findings this slice inherits (plan §2.2 "Blocked by")

The plan routes two ledger findings here. Neither is in the pre-authored
DoD above, so both are added to it below.

- **f-006 (P2, behavior, deferred by explicit human risk acceptance)** —
  page-level horizontal overflow below ~375px, caused by the unbreakable
  `github.com/techspeque/metis/cmd/metis@latest` token in
  `Install.astro`'s `.alternatives` paragraph. Lighthouse will *not* find
  this: its mobile emulation is 412px wide, above the break.
- **f-004 (P3, advisory)** — Lightning CSS rewrites `@media (min-width:
  768px)` to range syntax `@media (width>=768px)` in the built CSS,
  unsupported before Chrome 104 / Safari 16.4 / Firefox 63. The finding
  asks this slice for "a deliberate decision … either accept it or set an
  Astro build target". Decision recorded below.

## Declared file scope

- **owned_paths:** src/layouts/Base.astro, public/robots.txt, src/components/, .metis/briefs/phase-2-ws-2.2.md
- **read_only_paths:** src/styles/tokens.css (escalate via out-of-scope declaration if a token fix is genuinely required)

> The brief path is added to `owned_paths` because the DoD requires the
> scores to be recorded *in this file* — the same self-inclusion
> `phase-1-gate.md` declared. No other path is added: `astro.config.mjs`,
> `src/consts.ts`, `src/pages/index.astro`, `src/styles/**` and `docs/**`
> stay outside, and anything that would need them is escalated rather than
> edited (see "Escalations", below).

## Definition of Done

- All four Lighthouse categories ≥ 95 (scores + LH version recorded here)
- f-006 fixed: no page-level horizontal overflow at 300–1440px, both
  schemes, re-measured by the same width-controlled iframe method the
  finding used
- f-004 answered with a recorded decision
- Existing policy greps unchanged; npm run verify green

## Test plan

- npx lighthouse against served dist, headless, both schemes spot-checked
- Re-run the phase-1 gate greps as regression suite
- Width sweep 300 → 1440px in a width-controlled iframe (headless Chrome
  floors a real window at 500px), both schemes, before and after the fix

---

## Baseline measurement (before any code change)

Environment, recorded so the reviewer can reproduce it exactly:

- Lighthouse **13.4.1** (`npm install --no-save lighthouse` into a
  scratchpad dir — not added to this repo's package.json)
- Chrome: `/Applications/Google Chrome.app`, `--headless=new --no-sandbox`
- Server: `npm run preview -- --port 4321` over `dist/` from a clean
  `npm run build`; default simulated throttling; no LH flags beyond
  `--preset=desktop` where stated

| Run | perf | a11y | best-practices | SEO |
|---|---|---|---|---|
| mobile (412×823, default preset) | 100 | 100 | 100 | **91** |
| desktop (`--preset=desktop`, 1350×940) | 100 | 100 | 100 | **91** |

One scored audit failed, identically on both form factors:

- `seo/canonical` → 0. Explanation, verbatim from the LH JSON:
  **"Is not an absolute URL (/metiswww/)"**.

That is the whole SEO gap: `canonical` carries weight 1 of the SEO
category's 11, i.e. 91/100. Nothing else in any category scored below 1
except the two unweighted *insight* audits (`render-blocking-insight`,
`network-dependency-tree-insight`), which contribute 0 to the score and
whose subject is the site's single render-blocking stylesheet (21 KB on
disk, 4.3 KB over the wire, `wastedMs: 151`) — inlining it to chase an
unweighted insight would trade the authored-CSS architecture for nothing.
Not done.

Baseline width sweep (the f-006 reproduction), both schemes, at
300/320/340/360/375/390/412/767/768/1023/1024/1440:

- `documentElement.scrollWidth = 364` against a smaller `clientWidth` at
  300, 320, 340 and 360 in **both** schemes — f-006 reproduced exactly as
  recorded (same 364px pin).
- Clean (`scrollWidth == clientWidth`) at 375 and every width above it.

## What changed, and why each change

**1. `src/layouts/Base.astro` — canonical is now absolute.**

The only Lighthouse failure. The link was deliberately root-relative
(phase-0-ws-0.2 recorded the reasoning: a relative href resolves to the
same absolute URL, is valid HTML, and keeps the built HTML clean under the
phase-0 gate's mechanical grep `<(script|link)[^>]*(src|href)="http`).
That reasoning holds as HTML but not as SEO: Google's canonicalization
documentation and Lighthouse both require an absolute URL, and a relative
one is scored as *no* canonical at all.

The trade is real and is called out here rather than left for the gate to
discover:

- The phase-0 gate criterion this trips is *phrased* as a resource rule —
  "built `dist/index.html` references **no external origins for scripts,
  stylesheets, or fonts**" and "no request to any external origin on page
  load". A `<link rel="canonical">` is metadata: it fetches nothing, so
  the criterion's stated intent is untouched. What it trips is only the
  proxy grep, which cannot tell `rel="canonical"` from `rel="stylesheet"`.
  The same absolute URL was already in the built HTML as `og:url`, as a
  `<meta>`, for exactly the same non-resource reason.
- The refined grep, which the phase-2 gate should use in place of the
  phase-0 one, is: match as before, then require every hit to be the
  canonical link —
  `grep -En '<(script|link)[^>]*(src|href)="http' dist/index.html | grep -v 'rel="canonical"'`
  → **no output** (verified below). The invariant that actually binds —
  zero external-origin *resource* references, zero external requests — is
  unchanged and still mechanically checkable.
- Side effect for **phase-2-ws-2.3**: the canonical is no longer a
  root-absolute path, so it leaves that slice's base-path burden entirely.
  Plan §2.3 lists it among the hrefs needing `base` handling
  (.metis/plans/phase-2.md:201) — after this slice, fonts and favicons are
  the remaining ones. §2.3's own acceptance grep (line 210, root-absolute
  paths not starting with `/metiswww/`) is unaffected: an
  `https://` href is not a root-absolute path.

`SITE.url` and `astro.config.mjs` were **not** touched — the URL string
was already correct and already computed in the file; only which of the
two derived forms is emitted changed.

**2. `src/components/Install.astro` — f-006 fixed.**

`overflow-wrap: break-word` on `.alternatives`. Chosen over the finding's
other candidate (giving the token the `<pre>`/`<code>` scroll treatment)
for three reasons: the deck publishes the alternatives line as prose, not
as a command block; ADR-0003 makes the string render verbatim, and a CSS
wrapping property changes no bytes of it (the built HTML is byte-identical
in that paragraph); and `break-word` only breaks a word that cannot fit, so
at 375px and above the token still renders unbroken exactly as it does
today. `word-break: break-all` would have broken it at every width, and
`anywhere` would additionally change the paragraph's min-content
contribution — neither is needed for the defect.

**3. `public/robots.txt` — new, allow-all.**

A plan §2.2 task and a declared owned path. Lighthouse did *not* flag it
(with no robots.txt, `seo/is-crawlable` already passed and `seo/robots-txt`
is not applicable), so this is plan compliance, not a score fix. Its
limitation is recorded in the file itself and here: on a GitHub Pages
**project** site the served path is `/metiswww/robots.txt`, and crawlers
read `/robots.txt` at the origin root, which this repository does not own.
The file is therefore inert until the custom domain lands (OVERVIEW §8);
it is correct, allow-all, and costs one request nobody makes.

## Decisions recorded (things deliberately NOT done)

- **f-004 — accepted, not fixed.** Keeping the legacy media syntax needs a
  build target in `astro.config.mjs`, which is outside this slice's
  declared scope; and the finding's own analysis is that the degradation
  is benign (the layout is mobile-first, so a browser that drops the query
  renders the single-column base rule, which is a supported layout, not a
  broken one). The affected versions — Chrome ≤103, Safari ≤16.3, Firefox
  ≤62 — predate the range syntax's ship dates of 2022–2023. Accepting
  costs those browsers one column; fixing it costs a config change in a
  file this slice may not edit, to pin a build target the project has
  otherwise never needed. Accepted. The reviewer owns closing f-004.
- **`<meta name="generator">` kept.** Plan §2.2 says remove it "if
  flagged". Best-practices scored 100 with it present, so it is not
  flagged, and Astro emits it as standard build provenance.
- **No preload change.** The two font preloads are both used by the first
  paint; LH raised no `preload-fonts`/`unused-preload` finding, and
  `font-display` passed.
- **No CSS inlining, no critical-path surgery.** See the unweighted
  insight note above.
- **Theme script untouched.** No edit went near it; its ADR-0007 budget is
  re-measured below anyway, because the file it lives in was edited.

## Escalations / out-of-scope touches

None. Every change landed inside a declared owned path. Two items that
would have required leaving it were declined instead and are recorded
above (f-004 → `astro.config.mjs`; canonical → `src/consts.ts`, not
needed).

Two advisory findings that touch files outside this scope remain open and
are **not** this slice's to fix: f-008 (a wrong ratio in `tokens.css`'s
documentation comment — `read_only` here) and f-013 (a copy-deck line in
`docs/copy.md` — ADR-0003 makes the deck the only place it may change).

## Final measurement (after the changes)

Same environment as the baseline: **Lighthouse 13.4.1**, Chrome headless
(`--headless=new --no-sandbox`), served by `npm run preview -- --port 4321`
over a clean `npm run build`, default simulated throttling. Command, in
full, for both form factors:

```
lighthouse http://localhost:4321/ [--preset=desktop] \
  --chrome-flags="--headless=new --no-sandbox" \
  --output=json --output-path=<file>
```

**Three consecutive runs per form factor** (local perf scores are noisy;
one sample is not evidence):

| Run | perf | a11y | best-practices | SEO |
|---|---|---|---|---|
| mobile ×3 | 100, 100, 100 | 100, 100, 100 | 100, 100, 100 | 100, 100, 100 |
| desktop ×3 | 100, 100, 100 | 100, 100, 100 | 100, 100, 100 | 100, 100, 100 |

**All four categories 100/100 on every run — DoD ≥95 met with 5 points of
margin.** The only scored audit still below 1 anywhere is
`network-dependency-tree-insight` at weight 0 (see the baseline note).

### Both schemes, measured rather than asserted

The LH CLI has no `prefers-color-scheme` switch, so the light scheme was
audited by serving the built page with `data-theme="light"` on `<html>` —
the site's own sanctioned override (ADR-0007), which selects the
`:root[data-theme="light"]` token block at higher specificity than the
media query. **Verified, not inferred:** the run's own
`full-page-screenshot` renders parchment-on-ink-inverted, i.e. the light
scheme really was in effect. Same server, same flags; `dist/index.html`
was restored by rebuild afterwards and `diff` confirms it is byte-identical
to the committed build.

| Light-scheme run | perf | a11y | best-practices | SEO |
|---|---|---|---|---|
| mobile ×3 | 100, 100, 100 | 100, **96**, 100 | 100, 100, 100 | 100, 100, 100 |
| desktop ×3 | 100, 100, 100 | 100, 100, **96** | 100, 100, 100 | 100, 100, 100 |

### The intermittent light-scheme `color-contrast` result — investigated, not papered over

Two of six light runs (once mobile, once desktop; never in twelve dark
runs) scored a11y **96** on one `color-contrast` item. It is a
mid-animation sample, and here is why that is the finding rather than an
excuse:

- The flagged node is always the same one: `span.line.out.prompt`, the
  closing `$ █` line of the hero transcript — the **last** element in the
  typing choreography, `emit` starting at 2405 ms and settling at 2625 ms
  (Hero.astro). It is the one piece of text still fading when axe runs.
- The reported foreground differs run to run — `#9b7234`, then `#9b7133` —
  and neither is a token. Both are `--color-accent` **blended** toward the
  surface at partial opacity. A settled failure would report the same
  colour every time.
- The settled value is AA. Measured on the rendered page after the
  animation completes, not read off the comment: computed colour
  `rgb(138, 90, 18)` on surface `rgb(255, 255, 255)` = **5.91:1** light,
  and `rgb(212, 162, 78)` on `rgb(23, 27, 34)` = **7.46:1** dark. Both
  clear the 4.5:1 AA threshold for small text.
- Under `prefers-reduced-motion: reduce` the animation does not run at
  all, so the state cannot occur (verified below).

Deliberately **not** fixed: the only way to remove it is to change motion
OVERVIEW §3.2 specifies and phase-1-ws-1.1 delivered and had reviewed —
paying design for a scanner timing artifact whose settled state already
passes. Recorded here so the reviewer who sees a 96 knows exactly what it
is, and so the phase-2 gate's own LH re-run is not surprised by it. The
worst observed score is 96, above the ≥95 bar; the reviewer may reasonably
disagree and route it to a finding.

### f-006 — fixed and re-measured

Same width-controlled-iframe method as the finding (headless Chrome floors
a real window at 500px, so a real window cannot test this), extended down
to 280px and run in **both** schemes:

| Widths | before | after |
|---|---|---|
| 280, 300, 320, 340, 360 | `scrollWidth` pinned at **364** vs smaller `clientWidth` → page scrolls sideways | `scrollWidth == clientWidth` at every width |
| 375, 390, 412, 767, 768, 1023, 1024, 1440 | clean | clean |

26 measurements (13 widths × 2 schemes), zero page-level horizontal
overflow. A per-element sweep of `main` for boxes that overflow without
being scrollable returns exactly one hit below 1024px, `P.loop`
(sw=151, cw=30) — inspected and **by design**: it is the Protocol
diagram's decorative rail, whose `.loop-label` chip is absolutely
positioned with `width: max-content` and deliberately rides outside the
32px rail box. It contributes nothing to document scroll width, which is
what the first table measures.

### Regression suite (phase-1 gate + ADR-0005/0007 greps)

| Check | Result |
|---|---|
| `grep -c '<script' dist/index.html` | **2** — the ADR-0007 two-script form |
| No `src` on either script | pass (`<script>` ×2, no attributes) |
| Theme script ≤ 768 B, in `<head>`, before the stylesheet link | **719 B** inner / 736 B whole; in head; index 3049 stylesheet link follows it |
| Observer script ≤ 1024 B, contains `IntersectionObserver` | **242 B** inner / 259 B whole; after content |
| Raw hex in `.astro` | none in any declaration (the two `grep` hits, Hero.astro:238 and :406, are comment prose citing the tokens table — pre-existing, untouched) |
| Landmarks | 1 `<main>`, 1 `<footer>`, 3 `role="list"` — unchanged (ADR-0004 shape) |
| Built CSS ≤ 50 KB | **21,070 B** on disk, 4,274 B transferred |
| Total transfer excl. fonts < 150 KB | **10.8 KB** (74.1 KB including both fonts) |
| External-origin *resource* refs | none — refined grep (canonical excluded) returns no output |
| `npm run verify` | exit 0, green |

### Reduced motion and no-JS

- **`prefers-reduced-motion: reduce`** (Chrome
  `--force-prefers-reduced-motion=reduce`, confirmed live by
  `matchMedia(...).matches === true`): `document.getAnimations().length`
  = **0** against 12 with motion allowed; `.cmd` has `animation: none`,
  `overflow: visible` and its full 157px width; every `.out` line and
  every `.reveal` computes `opacity: 1`. Complete content, no motion.
- **No JS** (built page served with both `<script>` elements stripped —
  equivalent to a browser that never runs them, since the site is static
  with no hydration): rendered screenshot shows the full page, and the
  theme toggle is correctly absent. In the built HTML the button still
  carries `hidden`, and `is-revealed` appears nowhere — the two things
  that make the no-JS state safe. All five spot-checked copy strings
  (`Two minutes to a governed project.`, `Your agents are brilliant.`,
  `blocked → rework`, the `go install` line, `Go for dev of the next
  slice.`) are present.

### Files changed

- `src/layouts/Base.astro` — canonical absolute (+ rationale comment)
- `src/components/Install.astro` — `overflow-wrap: break-word` on
  `.alternatives` (+ rationale comment); f-006
- `public/robots.txt` — new
- `.metis/briefs/phase-2-ws-2.2.md` — this record

No file outside `owned_paths` was modified. `dist/` is gitignored and was
only rebuilt.
