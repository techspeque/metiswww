# phase-2-ws-2.3 — GitHub Pages pipeline, base path, and 404

- **Type:** feat | **Risk:** high | **Priority:** p2
- **Coder:** claude-code/opus | **Date:** 2026-07-26
- **Plan:** .metis/plans/phase-2.md §2.3

## Goal

ADR-0006 in full: correct base-path handling for project pages, the deploy
workflow gated on verify, and the 404 page.

## Architectural context

- This pays ws-0.2's documented debt: font preloads/favicons/canonical in
  Base.astro are root-absolute today and WILL break under /metiswww/ —
  derive everything from import.meta.env.BASE_URL; consts.ts SITE.url is
  the only allowed absolute (og:url needs it)
- Workflow: verify → build → upload-pages-artifact → deploy-pages,
  main-only, github-pages environment; dev never deploys
- 404.astro renders docs/copy.md §NotFound verbatim; its terminal garnish
  is real CLI output — do not alter it

### The defect phase-2-ws-2.2 handed forward

.metis/briefs/phase-2-ws-2.2.md:144-171 records a latent defect that slice
found but did not own: `Base.astro:136` builds the absolute page URL as
`SITE.url + Astro.url.pathname`. With no `base`, `pathname` is `/` and the
result is right. The moment this slice sets `base: "/metiswww"`, `pathname`
becomes `/metiswww/` and the concatenation **double-counts the project
path**. Reproduced here before any edit, in a scratchpad copy of this repo
with only `site` + `base` added to astro.config.mjs:

```
<link rel="canonical" href="https://techspeque.github.io/metiswww/metiswww/">
<meta property="og:url" content="https://techspeque.github.io/metiswww/metiswww/">
```

Both are fixed here, as 2.2 asked, because the fix belongs with the config
change that triggers it.

## Declared file scope

- **owned_paths:** astro.config.mjs, src/layouts/Base.astro, src/consts.ts, src/pages/404.astro, .github/workflows/deploy.yml
- **read_only_paths:** docs/copy.md, .metis/adr/0006-pages-deploy-base-path.md

## Definition of Done

- site+base set; zero non-based root-absolute asset URLs in dist
- dist/404.html with §NotFound copy verbatim
- deploy.yml: main-only trigger, verify precedes build, pages environment
- npm run verify green

## Test plan

- Build; grep dist for href/src="/" not followed by metiswww
- Serve dist under a /metiswww prefix locally; zero 404s loading the page
- actionlint or line-by-line workflow review

## Measurement before any code change

Every claim below was produced by building a scratchpad copy of this
repository (rsync minus node_modules/dist/.git) with **only** `site` +
`base` added to astro.config.mjs, then reading the built output. Nothing
here is predicted.

**1. Which root-absolute URLs actually break — and which do not.**

`grep -rn 'href="/\|src="/\|url("/' src/` finds six. They split two ways,
and the split is why this slice's declared scope is sufficient:

| Reference | File | Under `base` |
|---|---|---|
| `url("/fonts/space-grotesk-variable.woff2")` | src/styles/fonts.css:16 | **auto-fixed by the build** |
| `url("/fonts/jetbrains-mono-variable.woff2")` | src/styles/fonts.css:26 | **auto-fixed by the build** |
| `<link rel="icon" href="/favicon.svg">` | Base.astro:192 | breaks |
| `<link rel="icon" href="/favicon.ico">` | Base.astro:193 | breaks |
| `<link rel="preload" href="/fonts/space-grotesk-variable.woff2">` | Base.astro:199 | breaks |
| `<link rel="preload" href="/fonts/jetbrains-mono-variable.woff2">` | Base.astro:206 | breaks |

The two in `fonts.css` are the load-bearing finding. Vite's CSS pipeline
rewrites a root-absolute `url()` that resolves into `public/` by prefixing
the configured base, so the emitted stylesheet already carries the prefix
with no source change:

```
$ grep -o 'url([^)]*woff2[^)]*)' dist/_astro/*.css
url(/metiswww/fonts/space-grotesk-variable.woff2)
url(/metiswww/fonts/jetbrains-mono-variable.woff2)
```

`src/styles/fonts.css` is **not** in this slice's owned_paths, and this is
why it does not need to be: editing it would be an out-of-scope touch to
fix a defect the build does not have. The four in Base.astro get no such
treatment — Astro passes template attribute values through verbatim — so
they are hand-rebased here.

**2. The three build-time values the rebasing uses.** Probed by rendering
them into `<meta>` in the same scratchpad build:

```
import.meta.env.BASE_URL  →  "/metiswww"                      (no trailing slash)
Astro.site                →  "https://techspeque.github.io/"  (origin only, no base)
Astro.url.pathname        →  "/metiswww/"                     (base included)
```

Two consequences drive the code. `BASE_URL` has no trailing slash *as this
config is written*, but Astro normalizes it against `trailingSlash`, so a
later edit to `base` could add one — the join must not assume either form.
And `pathname` already carries the base, which is what makes the canonical
fix a one-liner (below).

## What changed, and why each change

### 1. `astro.config.mjs` — site + base

Verbatim from ADR-0006: `site: "https://techspeque.github.io"`,
`base: "/metiswww"`. Nothing else. No `trailingSlash`, no `build.format` —
both stay at their defaults, because changing either would move every URL
on the site in a slice whose job is to stop URLs from moving.

### 2. `src/consts.ts` — `withBase()`, and the four hand-written asset links

`withBase(path)` joins `import.meta.env.BASE_URL` to a path with exactly
one slash between them, so it holds whether or not `BASE_URL` carries a
trailing slash, and when base is `/` (the dev-server and no-base case).
`withBase("")` yields the site root.

It lives in `src/consts.ts` rather than in `Base.astro` because two files
need it — the layout's asset links and the 404's CTA — and Astro frontmatter
cannot export. One join rule in one place; a second copy would be a second
thing to keep correct.

Five call sites: two favicons and two font preloads in `Base.astro`, the
home link in `404.astro`. No other href in either built document is
internal — every remaining one is an external `https://` link to
github.com, which base cannot affect.

### 3. `src/layouts/Base.astro` — the canonical / og:url double-count

```
- const pageUrl = new URL(SITE.url + Astro.url.pathname);
+ const pageUrl = new URL(Astro.url.pathname, SITE.url);
```

The line below it — `const canonical = pageUrl.href;`, and the paragraph of
phase-2-ws-2.2 rationale attached to it — is unchanged.

`SITE.url` is used as the URL **base** rather than concatenated onto —
which is precisely what the old comment at 133-135 argued against, because
under no-base a `pathname` of `/` would have replaced the project segment
and produced the bare origin. That argument dies with this slice: once
`base` is set, `pathname` *is* `/metiswww/`, so resolving against
`SITE.url` yields `https://techspeque.github.io/metiswww/` and the segment
is preserved by the path, not by string surgery. The comment is rewritten
rather than deleted — it now documents the property that replaces it: only
`SITE.url`'s **origin** is load-bearing, its path segment can no longer
reach the output, so the mirror cannot double-count again.

ADR-0006 says `SITE.url` "derives from site+base and remains the single
mirror", so the export stays and is re-documented as a mirror of `site` +
`base` in astro.config.mjs. `Astro.site` would work identically and is now
available, but using it would orphan the export the ADR keeps — an ADR
deviation this slice has no reason to argue for.

### 4. `src/consts.ts` — the SITE doc comment

`SITE.url` is now a documented duplicate of `site` + `base` in
astro.config.mjs, in the same spirit as `THEME_COLOR` mirroring tokens.css
further down the file. The comment says so, names the two config keys, and
records that only the origin reaches the output. Value unchanged.

### 5. `src/pages/404.astro` — new

Copy renders verbatim from docs/copy.md §NotFound (ADR-0003), one string
per source line, unsplit by inline elements, so it greps literally against
the deck — the convention every phase-1 component follows. The terminal
garnish is reproduced exactly as the deck publishes it.

**Head copy.** Base.astro requires `title` and `description` props, and
§NotFound publishes no head copy — §Meta scopes itself to
`src/pages/index.astro` by name. f-002 established with this reviewer that
`<title>` / `og:description` *is* deck-governed copy, and docs/copy.md is
`read_only` in this slice, so no §NotFound Meta block can be authored here.
Both props therefore reuse §NotFound's own published strings verbatim —
`title` is the Heading, `description` is the Body. Nothing is invented.

**The CTA href.** "← Back to metis" is the only internal link on the site
and the deck gives it no URL (unlike §Hero, which spells its URLs out).
§NotFound's own Body — "returning to the last known good state" — points it
at the site home, and it is written through `withBase("")`, because a bare
`href="/"` is exactly what this slice's acceptance grep exists to catch.

**Sizes.** No hardcoded measure: global.css:85-87 already caps every `<p>`
at `--measure`, so the body copy sets none of its own, and the h1 inherits
its size from global.css. The only values this page's stylesheet carries
are `--space-*`, `--text-sm`, `--container-max` and `--color-muted` — token
discipline per OVERVIEW §6, the rule f-003 was raised under.

**Canonical on a 404.** The page inherits Base's canonical, which resolves
to `…/metiswww/404`. GitHub Pages serves this document at arbitrary missing
paths, so that link is not the URL the visitor requested. It is inert:
Pages returns a real 404 status with it, and a crawler that sees 404 does
not index the document whatever its canonical says. Suppressing it would
mean a conditional in Base.astro serving exactly one page — not paid for
here, and recorded rather than left for the reviewer to find.

**Motion and landmarks.** No `data-reveal` and no `.reveal`: the reveal
observer lives in `src/pages/index.astro` and does not ship on this page,
so either class would be markup with no mechanism behind it. The page is
one `<main>` landmark and does not repeat the Footer, which would pull a
component into a slice that owns neither it nor its landmark decision
(ADR-0004).

### 6. `.github/workflows/deploy.yml` — new

`build` then `deploy`, per ADR-0006: main-only push plus
`workflow_dispatch`, the `github-pages` environment on the deploy job, and
the `pages: write` / `id-token: write` permissions `deploy-pages` requires.

**On "verify precedes build".** `npm run verify` *is* `astro check &&
astro build` — both the gate and the build — and ADR-0006 names it
directly ("The deploy workflow builds with the same `npm run verify` gate
the protocol uses"). It runs as one step. The ordering the criterion asks
for is enforced inside it by the shell `&&`: a red `astro check` exits
non-zero, `astro build` never runs, no `dist/` is produced, and the job
fails before anything is uploaded. Adding a separate `npm run build` would
rebuild what verify just built; splitting into `check` + `build` would mean
the workflow no longer runs the command the ADR names. Neither trade is
worth taking.

`npm ci` rather than `npm install`, so the deploy can never resolve a
dependency the verified build did not use. `package-lock.json` is committed
(`git ls-files package-lock.json`, 186 KB) — checked explicitly, because
both `npm ci` and `setup-node`'s `cache: npm` fail outright without it, and
that failure is invisible from `dev`: the workflow runs only on `main`.

Action versions are the current majors, each confirmed to exist as a moving
tag via `gh api repos/<action>/git/ref/tags/<major>` on 2026-07-26:
checkout@v7, setup-node@v7, configure-pages@v6, upload-pages-artifact@v5,
deploy-pages@v5.

## Decisions recorded (things deliberately NOT done)

- **`src/styles/fonts.css` untouched** — measured above: the build already
  emits the based URLs. Editing it would be an unnecessary out-of-scope
  touch.
- **`public/robots.txt` untouched** — its own comment (lines 5-8) already
  documents that a project site serves it at `/metiswww/robots.txt` while
  crawlers read the origin root, and that it stays inert until the custom
  domain lands. Nothing in this slice changes that, and it is not in scope.
- **No `trailingSlash` or `build.format` config** — see §1 above.
- **No sitemap, no `@astrojs/sitemap`** — not in the plan, not in the ADR,
  and a ship slice should not introduce a new dependency.

## Escalations / out-of-scope touches

None. Declared scope was sufficient; the fonts.css measurement above is why.

**For the human, not this slice:** the workflow deploys nothing until the
repository's Pages source is set to "GitHub Actions" (Settings → Pages →
Build and deployment → Source). That is a repository setting, not a file,
so no slice can make it true. Until it is set, a push to `main` runs the
workflow and the `deploy-pages` step fails.

## Final measurement (after the changes)

All of the following ran against a clean `rm -rf dist && npm run verify`
build of this working tree.

### The acceptance grep

```
$ grep -oE '(href|src)="/[^"]*"' dist/*.html | grep -v '="/metiswww/'
NONE
```

Run over `dist/*.html`, not just `dist/index.html`: the criterion names
index.html but the DoD says "zero non-based root-absolute asset URLs in
dist", and 404.html renders through the same layout. Every internal URL in
both documents:

```
/metiswww/_astro/Base.Cyr545Ux.css     /metiswww/favicon.ico
/metiswww/_astro/index.CpKCsDwZ.css    /metiswww/favicon.svg
/metiswww/                             /metiswww/fonts/jetbrains-mono-variable.woff2
                                       /metiswww/fonts/space-grotesk-variable.woff2
```

Every other href in either document is an external `https://` link to
github.com (or the absolute canonical), which no base path affects.

Built stylesheet, confirming the fonts.css measurement held after the
config landed:

```
$ grep -o 'url([^)]*woff2[^)]*)' dist/_astro/*.css
url(/metiswww/fonts/space-grotesk-variable.woff2)
url(/metiswww/fonts/jetbrains-mono-variable.woff2)
```

### The canonical double-count is gone

```
index.html : <link rel="canonical" href="https://techspeque.github.io/metiswww/">
             <meta property="og:url" content="https://techspeque.github.io/metiswww/">
404.html   : https://techspeque.github.io/metiswww/404/
```

Compare the pre-change reproduction in §Architectural context above:
`…/metiswww/metiswww/`.

### Served under the base prefix — zero 404s

`npx astro preview` (which honors `base`) on :4331, every URL either page
references plus the files that are requested rather than linked:

```
404  /                                            ← nothing at the origin root, as expected
200  /metiswww/                                   200  /metiswww/favicon.ico
200  /metiswww/404.html                           200  /metiswww/favicon.svg
200  /metiswww/robots.txt                         200  /metiswww/fonts/space-grotesk-variable.woff2
200  /metiswww/_astro/Base.Cyr545Ux.css           200  /metiswww/fonts/jetbrains-mono-variable.woff2
200  /metiswww/_astro/index.CpKCsDwZ.css
```

### 404 copy renders verbatim

Each string `grep -F`'d against `dist/404.html`, all present:

```
OK  404 — no active slice here.
OK  This page isn't in the ledger. The dispatch algorithm suggests returning to the last known good state.
OK  ← Back to metis
OK  $ metis next
OK  No active slices. The backlog is empty.
```

Head copy, as reasoned above — the Heading and Body, unaltered:

```
<title>404 — no active slice here.</title>
<meta name="description" content="This page isn't in the ledger. The dispatch algorithm suggests returning to the last known good state.">
```

### Index page regression: nothing changed but URLs

Built the pre-slice tree (a detached worktree at the brief commit) and
diffed its `dist/index.html` against this one, normalizing the base prefix
and the content-hash in asset filenames. The only differences are the two
source comments this slice rewrote — and one structural change, below.
Every byte of rendered content, every `data-astro-cid`, both inline
scripts, and all head metadata are identical.

**The one structural change: CSS is now split into two chunks.**

```
before:  index.html → index.<hash>.css                       21070 B   (1 request)
after:   index.html → Base.<hash>.css + index.<hash>.css      6137 + 14952 B (2 requests)
         404.html   → Base.<hash>.css                          6137 B   (1 request)
```

This is Astro's normal chunking, triggered by a second page sharing the
Base layout — not something this slice chose. Total bytes for index are
within 19 B of before; the 404 pays 6 KB instead of 21 KB. The cost is one
extra same-origin request on index, and it was measured rather than
assumed to be free (below). No `build.inlineStylesheets` override was
added to suppress it: it would be tuning a build default to undo a change
that measures at zero.

### Lighthouse — the phase-2 ≥95 bar still clears, on both pages

Lighthouse 13.4.1 against the preview server, the same tool version
phase-2-ws-2.2 used. Mobile and desktop presets, both pages:

| | perf | a11y | best-practices | seo |
|---|---|---|---|---|
| index, desktop | 100 | 100 | 100 | 100 |
| index, mobile | 100 | 100 | 100 | 100 |
| 404, desktop | 100 | 100 | 100 | 100 |
| 404, mobile | 100 | 100 | 100 | 100 |

The extra stylesheet request cost nothing measurable, and the absolute
canonical 2.2 introduced for SEO 100 still scores as absolute now that it
resolves correctly under the base.

### Script policy (ADR-0005 / ADR-0007), re-measured

```
index.html:  2 scripts   theme    inner 719 B / whole 736 B   (ADR-0007 budget 768)
                         observer inner 242 B / whole 259 B   (ADR-0005 budget 1024)
404.html:    1 script    theme only — the observer is index-only, by design
```

`dist/404.html` references no external origin at all. Reduced motion and
no-JS need no separate check on the 404: it has no animation to disable,
and its only scripted element is the inherited theme toggle, which stays
`hidden` without JS exactly as it does on index.

### The workflow — reviewed, not executed

`actionlint` is not installed on this machine and no npm-distributed build
of it exists, so this is a YAML parse plus a line-by-line read, and it is
reported as that rather than as "validated". The file parses cleanly
(`yaml.safe_load`) and resolves to: one `push` trigger on `main` plus
`workflow_dispatch`; `contents: read` / `pages: write` / `id-token: write`;
a `pages` concurrency group with `cancel-in-progress: false`; a `build` job
(checkout → setup-node 22 with npm cache → `npm ci` → `npm run verify` →
configure-pages → upload-pages-artifact of `./dist`); and a `deploy` job
gated on `needs: build`, in the `github-pages` environment, running
`deploy-pages`.

One artifact of that parse worth naming so it is not read as a defect: a
YAML 1.1 parser (PyYAML) resolves the `on:` key to the boolean `true`.
GitHub's own parser does not — `on` is the documented trigger key in every
GitHub workflow. Cosmetic, and only visible when parsing locally.

The workflow cannot be executed from `dev` by construction: it triggers on
`main` only, which is the property being asked for. Its first real run will
be the human's dev → main merge.

**The runtime prerequisite, again, because it is the difference between
"coded" and "shipped":** Settings → Pages → Build and deployment → Source
must be "GitHub Actions". Until it is, the run will fail — which step
reports it, and with what message, is not something this slice can observe
from `dev`, so no specific failure text is claimed here.

### Verify

`metis verify --post` — ALL GREEN
(.metis/runs/phase-2-ws-2.3/verify-post.log). `git status` shows exactly
the five declared owned_paths and nothing else.

### Files changed

| File | Change |
|---|---|
| `astro.config.mjs` | site + base (ADR-0006), with the measured consequences documented |
| `src/consts.ts` | new `withBase()` join; SITE.url re-documented as the site+base mirror, value unchanged |
| `src/layouts/Base.astro` | four asset links rebased through `withBase()`; canonical resolves instead of concatenating |
| `src/pages/404.astro` | new |
| `.github/workflows/deploy.yml` | new |

Everything in this section was re-run after the review-cycle-0 refactor
that moved the join helper into `src/consts.ts` and dropped the 404's
hardcoded `max-width`: clean rebuild green, acceptance grep still empty,
all seven asset URLs still 200 under the preview prefix, all five §NotFound
strings still verbatim, and Lighthouse mobile still 100/100/100/100 on both
pages.
