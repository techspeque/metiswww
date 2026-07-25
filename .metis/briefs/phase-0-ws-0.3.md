# phase-0-ws-0.3 — Page skeleton with placeholder sections

- **Type:** feat | **Risk:** low | **Priority:** p2
- **Coder:** claude-code/opus | **Date:** 2026-07-25
- **Plan:** .metis/plans/phase-0.md §0.3

## Goal

Compose the single-page skeleton — six placeholder section components rendered
in order inside one `<main>` through `Base.astro` — so Phase 1 can fill each
section one slice at a time on a fully-themed, zero-JS shell.

## Architectural context

- No `metis interfaces` configured (skipped) — consistent with 0.1/0.2.
- Consumes 0.1's token layer (`src/styles/tokens.css`) exclusively for all
  color/spacing/type: `--container-max`, `--space-*` (8px rhythm),
  `--color-border`, `--color-muted`, `--text-*`, etc. No raw values.
- Consumes 0.2's `Base.astro` — the HTML shell with head/metadata/theming and
  a `<slot />` in `<body>`. This slice fills that slot with `<main>` + the six
  sections. `Base.astro`, `tokens.css`, `global.css`, `fonts.css`, `consts.ts`
  are read-only here (owned by 0.1/0.2).
- **Footer-inside-`<main>` decision:** the binding acceptance criterion states
  all six components' headings render "inside one `<main>` element in the
  declared order." A site `<footer>` is normally a sibling of `<main>`, but the
  criterion is mechanical and explicit, so `Footer.astro` (a `<footer>`) is
  composed as the last child of `<main>`. `<footer>` inside `<main>` is valid
  HTML (a footer for the main content).
- **Heading levels:** `Hero.astro` carries the page's single `<h1>`; the other
  five sections use `<h2>` for a clean document outline. global.css already
  styles h1–h4 from tokens.
- **Anchor ids:** `hero`, `problem`, `personas`, `protocol`, `install` on the
  five `<section>` elements. `Footer.astro` takes no id (only five listed).
  These ids are hex-grep-safe (each begins with a non-hex letter).
- **Component-local styling:** each component owns a small scoped `<style>`
  (section vertical rhythm + hairline divider) rather than extracting a shared
  stylesheet — `src/components/` must contain *exactly* the six files, so a 7th
  shared file there would trip the "exactly six" check. `index.astro` owns the
  container style on `<main>` (max-width, centering, inline padding). Astro
  scoped styles reach only each file's own markup, which fits this split.
- **Title/description:** already carry real, non-aspirational metiswww copy
  set in 0.2 (`index.astro` props) — kept as-is, which satisfies §0.3's "add
  real site title/description copy" task (not a skipped step). No CLI-behavior
  claims (no commands, flags, or command output) anywhere in placeholder copy,
  per OVERVIEW §3.4.

## Declared file scope

- **owned_paths:**
  - src/components/Hero.astro
  - src/components/Problem.astro
  - src/components/Personas.astro
  - src/components/Protocol.astro
  - src/components/Install.astro
  - src/components/Footer.astro
  - src/pages/index.astro
- **read_only_paths:**
  - OVERVIEW.md (design constraints §3.2, invariants §3.4)
  - .metis/plans/phase-0.md (§0.3 acceptance criteria)
  - src/layouts/Base.astro (consumed via slot; not modified — 0.2 owns it)
  - src/styles/tokens.css (consumed; not modified — 0.1 owns it)
  - src/styles/global.css (consumed; not modified — 0.1 owns it)
  - src/consts.ts, src/styles/fonts.css (context only — 0.2 owns them)

## Definition of Done

From plan §0.3 acceptance criteria:

- [ ] `npm run verify` exits 0.
- [ ] `src/components/` contains exactly the six components listed above, and
      built `dist/index.html` renders their headings inside one `<main>`
      element in the declared order (Hero, Problem, Personas, Protocol,
      Install, Footer).
- [ ] `dist/index.html` contains the section ids `hero`, `problem`,
      `personas`, `protocol`, `install`.
- [ ] `grep -rEn '#[0-9a-fA-F]{3,8}' src/components src/pages` returns no
      matches — components/pages consume tokens only (holds in scoped `<style>`
      blocks AND in doc comments, since this grep scans whole files).
- [ ] Built `dist/index.html` contains no `<script` tag.
- [ ] Placeholder copy makes no claims about metis CLI behavior (no command
      output, no flags), checked against OVERVIEW.md §3.4.

## Test plan

No unit-test framework configured (Testing Rules: none); the verify gate is
`astro check && astro build`. Verification for this slice:

1. `npm run verify` exits 0 (via `metis verify --post`).
2. Mechanical gates run by hand and cited in the report. Criteria that target
   the *built* output are grepped against `dist/index.html` (mirroring 0.2),
   not source:
   - Heading text in declared order inside the single `<main>`:
     inspect `dist/index.html` for `<main>` … Hero → Problem → Personas →
     Protocol → Install → Footer … `</main>`.
   - `grep -Eo 'id="(hero|problem|personas|protocol|install)"' dist/index.html`
     → all five present.
   - `grep -c '<script' dist/index.html` → 0.
   - `grep -rEn '#[0-9a-fA-F]{3,8}' src/components src/pages` → empty.
   - `ls src/components` → exactly the six files.
3. Copy-accuracy: manual read of every placeholder sentence confirms no CLI
   command, flag, or command-output claim (OVERVIEW §3.4).

## Out-of-scope touches

None.
