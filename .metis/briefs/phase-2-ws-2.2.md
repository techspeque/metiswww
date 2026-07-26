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
whose subject is the single 14 KB render-blocking stylesheet — the site
has exactly one, and inlining it to chase an unweighted insight would
trade the authored-CSS architecture for nothing. Not done.

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

## Results (after the changes)

_Filled in after implementation — see "Final measurement" below._
