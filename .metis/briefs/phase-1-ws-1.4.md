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
