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

### 2. `src/layouts/Base.astro` — the four hand-written asset links

A local `asset()` helper joins `BASE_URL` to a path with exactly one slash
between them, so it is correct whether or not `BASE_URL` ends in one, and
correct when base is `/` (the dev-server and no-base case). Four call
sites: two favicons, two font preloads. No other href in the built HTML is
internal — every remaining one is an external `https://` link to
github.com, which base cannot affect.

### 3. `src/layouts/Base.astro` — the canonical / og:url double-count

```
- const pageUrl = new URL(SITE.url + Astro.url.pathname);
+ const canonical = new URL(Astro.url.pathname, SITE.url).href;
```

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
directly below it. The comment says so, names the two config keys, and
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
at the site home, and it is written through `asset()`, because a bare
`href="/"` is exactly what this slice's acceptance grep exists to catch.

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

## Verification performed

Filled in after implementation — see "Final measurement" below.
