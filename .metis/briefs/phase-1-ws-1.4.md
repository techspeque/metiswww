# phase-1-ws-1.4 — Install, Footer, and landmark amendment

- **Type:** feat | **Risk:** low | **Priority:** p2
- **Coder:** claude-code/opus | **Date:** 2026-07-26
- **Plan:** .metis/plans/phase-1.md §1.4

## Goal

Content-complete Install and Footer sections, and the ADR-0004 landmark
amendment: Footer moves out of <main> to body level.

## Architectural context

- Copy: docs/copy.md §Install, §Footer verbatim; the colophon's "built by
  agents, governed by metis" claim is true and links the audit trail
- ADR-0004: index.astro renders <main>…5 sections…</main><Footer/>; this
  deliberately supersedes phase-0's all-in-main criterion
- Install one-liner must match the real install script URL (verify the
  path exists in techspeque/metis before shipping)

## Declared file scope

- **owned_paths:** src/components/Install.astro, src/components/Footer.astro, src/pages/index.astro
- **read_only_paths:** docs/copy.md, .metis/adr/0004-footer-landmark.md

## Definition of Done

- Copy verbatim; footer is a body-level sibling of main in dist
- One main, one footer, one h1; external links rel="noopener"
- npm run verify green

## Implementation notes (coder)

Nine decisions a reviewer would otherwise have to re-derive. The first three
are about the one thing this slice does that no earlier section slice had to:
the deck's §Install and §Footer contain **markdown links**, so the
"one copy string, one unsplit text node" convention that phase-1-ws-1.1
established (and 1.2/1.3 documented) cannot hold literally here.

1. **Where the deck has a markdown link, the string is split — and only
   there.** `[release](…)` and `[Read the audit trail](…)` are functional
   links, not typography; they must be real `<a>` elements, so the sentences
   containing them can never be one text node under any implementation. The
   greppable unit degrades from "the sentence" to "the deck's own atoms":
   the text before the link, the link's label, the text after it. Every
   fragment is still byte-for-byte deck text — nothing is reworded, and the
   period after `[release](…)` / `[Read the audit trail](…)` stays *outside*
   the anchor because that is where the deck puts it.
2. **Backticked commands in prose still render as plain text.** §Install
   backticks `go install …` and `metis init` inline. Rendering them as
   `<code>` would split two more strings for typography alone — the exact
   trade phase-1-ws-1.3 note 2 refused for `metis next` in §Protocol, and a
   reviewer archived that decision. So the verification line stays one
   uninterrupted text node ("then: metis init — it prints every next step.")
   and the alternatives line splits *only* at its link. This keeps the two
   adjacent lines visually consistent too: the sole mono treatment in this
   section is the `<pre>` one-liner, which the deck asks for explicitly.
3. **§Footer's "Links:" line is a spec, not a rendered string.** "GitHub ·
   Docs · Releases · MIT License" names four links and their order; four
   anchors can never be one text node, so the literal string is unattainable
   — the same category as §Protocol's "Diagram states (in order)" line, which
   1.3 treated as structural and the reviewer accepted. It renders as a `<ul>`
   (order in the markup) with the interpuncts drawn as decorative CSS
   `::before`, matching how 1.3 draws its connectors. Grep units: the four
   labels. The `<ul>` carries `role="list"` and `padding: var(--space-0)` —
   f-005 and f-003 respectively, both P-findings from this same file class.
4. **The four footer link targets, and the one the deck does not give.**
   GitHub / Docs / Releases reuse the URLs §Hero and §Install already
   publish. "MIT License" has no deck URL and no local `LICENSE` in this
   repo, so it points at metis's:
   `https://github.com/techspeque/metis/blob/main/LICENSE` — verified 200,
   and its content is the MIT licence text. Consistent with the other three,
   which all point at the metis repo rather than this one.
5. **The placeholder `<h2>metiswww</h2>` is deleted, not replaced.** §Footer
   specifies a colophon, links and a copyright line — no heading — and
   ADR-0003 forbids inventing copy to fill one. A `<footer>` that is a direct
   child of `<body>` maps to `contentinfo` with no accessible name required,
   and ADR-0004 supersedes phase-0's "six headings inside one main" criterion
   for exactly this component. Result: five headings in `<main>` (one `h1`,
   four `h2`), none in the footer, levels unbroken.
6. **Footer container styling is duplicated in Footer.astro, deliberately.**
   Astro's scoped styles hash against the elements in *their own* template,
   so index.astro's `main { max-width: … }` rule cannot reach the `<footer>`
   element once it is a sibling rather than a descendant. Footer.astro
   therefore repeats `--container-max` / `margin-inline: auto` /
   `padding-inline: var(--space-4)`. Without the inline padding the footer
   text would sit flush against the viewport edge on a phone while every
   section above it is inset.
7. **The install one-liner is in dist twice, by instruction.** §Hero asks for
   it "beneath the terminal" and §Install asks for it as the section's mono
   block. `grep -c` returning 2 is the specified state, not a duplication
   bug.
8. **Install keeps the shared `.section` border-bottom.** It is now the last
   child of `<main>`, so that hairline reads as the rule separating page
   content from the footer — which is what a footer boundary wants anyway.
   Checked live rather than assumed (see evidence).
9. **No new characters as entities.** `©` and `·` are written as literal
   characters. 1.3's evidence established that dist must be entity-free so
   the deck greps against literal bytes; `© 2026 techspeque` is a copy string
   and has to match.

CLI/URL claims verified before writing any markup (this slice publishes six
external URLs and two commands):

- `scripts/install.sh` on `main` → 200; `cmd/metis/main.go` → 200 and
  `go.mod` line 1 is `module github.com/techspeque/metis`, so
  `go install github.com/techspeque/metis/cmd/metis@latest` resolves as a
  real package path, not just an existing tree URL
- `metis init --help` (v0.0.6) exists with no required flags and its help
  text says the "Next steps it prints are copy-pasteable" — the deck's
  "it prints every next step" is accurate
- `/releases`, `/tree/main/docs`, `/blob/main/LICENSE`,
  `github.com/techspeque/metiswww` → all 200

## Test plan

- npm run verify (clean build)
- Copy: enumerate the §Install/§Footer strings *from the file* (awk on
  docs/copy.md) rather than from reading, then `grep -F` each rendered
  fragment against dist/index.html — accuracy rule #1
- Landmarks: ordering proof, not a presence grep —
  `index("</main>") < index("<footer")` in dist/index.html; plus counts of
  `<main`, `<footer`, `<h1`
- Links: assert `count(href="http…") == count(rel="noopener")` in dist
- Entities: no `&copy;`/`&middot;`/`&mdash;`/`&rarr;` in dist
- Script count still exactly 1 (Protocol's observer) after editing index.astro
- Manual: both colour schemes, narrow + wide, at the Install→footer boundary

Results (2026-07-26) — clean build (`rm -rf dist` first), live check in Chrome
against `astro preview`. Every number below is from the final build.

- `metis verify --post`: ALL GREEN. Built CSS 14,420 bytes (gate limit 50KB);
  0 `.js`/`.mjs` files in dist, 0 `src=` script refs
- Copy: §Install and §Footer carry **seven** copy-marked entries, enumerated
  from the file (`awk '/^## Install/,/^## NotFound/' docs/copy.md |
  grep -c '^\*\*'`), not from reading. They render as **12 greppable
  fragments** — the two link-bearing strings split into three each — and all
  12 were found byte-for-byte in `dist/index.html` (`grep -F` per fragment),
  including `© 2026 techspeque`. Rendered `textContent` was also read back
  live and reads as the deck sentences with the markdown stripped:
  "or go install …@latest, or grab a release." and "Built by AI agents, …
  ledger. Read the audit trail." No `&copy;`/`&middot;`/`&mdash;`/`&rarr;`
  and no numeric entities anywhere in dist
- Landmarks (ordering proof, not a presence grep): `index("</main>")` = 7852
  < `index("<footer")` = 7859; dist matches both `</main><footer` and
  `</footer></body>`, so the footer is a direct child of body. Live DOM
  agrees: `footer.parentElement === document.body` and
  `compareDocumentPosition` puts it after main. Counts: 1 `<main>`,
  1 `<footer>`, 1 `<h1>`, 4 `<h2>`, 0 headings inside the footer. Heading
  sequence h1→h2→h2→h3,h3→h2→h2, unbroken
- Links: `href="http` appears 8 times and `rel="noopener"` 8 times — equal,
  which is what the criterion asks (2 Hero CTAs + release + audit trail +
  4 footer links). All eight targets were fetched: 200 each
- Script: `<script` still appears exactly 1 time in dist — Protocol's
  observer, untouched by the index.astro edit
- Containers: at 1900px the footer's border box (374–1526) is identical to
  main's, and its text starts at x=398, the same inset as Install's — the
  duplicated container rules line up rather than merely look close. At a
  500px viewport both sit at x=24 and `scrollWidth == clientWidth` (no
  horizontal overflow); the one-liner scrolls inside its own `<pre>`, as the
  Hero's does
- Footer link cluster: `role="list"` present, `padding` computes to `0px`
  from `--space-0`, `list-style: none`. The interpunct is `::after` on
  `li:not(:last-child)` — **changed during verification**: as a `::before` on
  the following item it worked at full width but started every wrapped row
  with a stray leading mark that reads as a bullet (measured at container
  widths 300/200/120px). Hanging it off the preceding item makes it part of
  that item's box, so it can only ever end a line. Re-probed at 300/200/120px:
  every wrapped row now begins with a clean label at the container edge, the
  last item has no separator, and the list never overflows
- Colours, read from computed styles, both schemes. Dark: colophon /
  copyright / alternatives `#A7ADB8` on `#0E1116` (8.39:1), links and the
  release link `#D4A24E` on `#0E1116` (8.17:1), verification line `#FAF7F0`
  (17.68:1), `<pre>` surface `#171B22`. Light (tokens.css's light values
  applied to `:root`, as in 1.3 — this exercises the component's token use,
  not the media query, which belongs to tokens.css): muted `#5C636E` on
  `#FAF7F0` (5.66:1), accent `#8A5A12` (5.53:1), text `#0E1116` (17.68:1),
  surface `#FFFFFF`. All AA, all already in tokens.css's ratio table
- Reduced motion (OVERVIEW.md §3.4) — **substantively** satisfied, not
  vacuously, and the distinction matters (f-002). Install.astro and
  Footer.astro declare no `animation`, `transition` or `@keyframes` of their
  own (grepped, no matches), but this slice adds six anchors, and every
  anchor inherits `transition: color var(--duration-fast) var(--ease-out)`
  from global.css:102. That transition is real motion in new UI, and
  global.css:159-166's `prefers-reduced-motion: reduce` block neutralises it
  with `transition-duration: 0.01ms !important` on `*, ::before, ::after` —
  present in the built CSS in that form. So the new UI does animate, and the
  invariant disables it
- Install→footer boundary checked live in both schemes at 1440px and 500px:
  Install is the last child of main, its hairline reads as the rule above the
  footer rather than as a stray underline

Deferred deliberately, for the reviewer to weigh rather than for me to decide
silently: the interpunct is decorative generated content, and some screen
readers announce it between the link labels. CSS `content: "·" / ""` would
give it empty alt text, but its support floor (Firefox 118, Safari 17.4) is
higher than anything else this project relies on, and an unsupported
declaration drops the mark entirely — the same class of degradation f-004
already parked for phase 2. Left as plain `content` here; worth deciding
alongside f-004 in ws-2.2 rather than in a low-risk slice.
