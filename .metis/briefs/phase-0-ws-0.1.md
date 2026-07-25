# phase-0-ws-0.1 — Design token system and global styles

- **Type:** feat | **Risk:** medium | **Priority:** p2
- **Coder:** claude-code/opus | **Date:** 2026-07-25
- **Plan:** .metis/plans/phase-0.md §0.1

## Goal

Establish the design-token foundation — the ink/owl/aegean palette, type
scale, and 8px spacing rhythm as CSS custom properties, plus a global
stylesheet consuming only those tokens — that every later slice builds on.

## Architectural context

- No `metis interfaces` configured (skipped). First code slice; only the
  bare Astro scaffold exists (`src/pages/index.astro` is a stub, no styles).
- OVERVIEW §3.2 is binding: palette hex `#0E1116` (ink), `#FAF7F0`
  (parchment), `#D4A24E` (owl-gold), `#2E8C83` (aegean teal); dark-first via
  `prefers-color-scheme`; one display + one mono font maximum; 8px rhythm;
  `prefers-reduced-motion` disables non-essential animation.
- OVERVIEW §6: `src/styles/tokens.css` is the single source for color/size
  tokens; hardcoded values at point of use are a review finding.
- These two files are NOT imported by any page in this slice (that is 0.2's
  job). Consequence: `astro check && astro build` will not parse them, so a
  green verify is necessary but does not exercise the CSS — syntax is
  eyeballed by hand.

**Font-family seam (explicit decision to avoid overlap with 0.2):**
`tokens.css` owns `--font-display` and `--font-mono` as the fallback
contract (generic stacks only, no bundled face). Slice 0.2's `fonts.css`
layers the real `@font-face` faces and enriches these same tokens via the
cascade. `global.css` consumes them by name. The 0.2 reviewer should expect
these tokens to already exist.

## Declared file scope

- **owned_paths:**
  - `src/styles/tokens.css`
  - `src/styles/global.css`
- **read_only_paths:**
  - `OVERVIEW.md` (design constraints §3.2, invariants §3.4)
  - `.metis/plans/phase-0.md` (§0.1 acceptance criteria)
  - `src/pages/index.astro` (context only; not modified — 0.2/0.3 own it)

## Definition of Done

From plan §0.1 acceptance criteria:

- [ ] `npm run verify` exits 0
- [ ] `tokens.css` contains exact hex `#0E1116`, `#FAF7F0`, `#D4A24E`,
      `#2E8C83`, each assigned only to a custom property (brand tokens).
- [ ] `tokens.css` has a `:root` block (dark defaults) and a
      `@media (prefers-color-scheme: light)` block overriding the same
      semantic color properties.
- [ ] `tokens.css` defines a modular `--text-*` type scale (sizes, line
      heights, weights) and an 8px-based `--space-*` scale (scheme-independent
      tokens stay on `:root` only).
- [ ] `global.css` has a `@media (prefers-reduced-motion: reduce)` block that
      zeroes transition/animation durations globally.
- [ ] `grep -rEn '#[0-9a-fA-F]{3,8}' src/styles/global.css` returns no matches
      — every color in global.css is a `var(--…)`.
- [ ] Every documented text/background pairing meets WCAG AA (≥4.5:1 normal,
      ≥3:1 large), with ratios listed in a `tokens.css` comment block for both
      schemes.

## Test plan

No unit-test framework is configured (Testing Rules: none). The verify gate
is `astro check && astro build`. Verification for this slice:

1. `npm run verify` exits 0 (via `metis verify --post`).
2. Mechanical grep gates run by hand and cited in the report:
   - `grep -rEn '#[0-9a-fA-F]{3,8}' src/styles/global.css` → no matches.
   - `grep -c` the four brand hex values present in `tokens.css`.
3. Contrast ratios computed with a WCAG-formula script (sRGB linearization,
   0.2126/0.7152/0.0722 luminance weights, (L+0.05) ratio); every documented
   pairing ≥ its AA threshold. Ratios recorded in the tokens.css comment table
   for the reviewer's independent spot-check.

## Out-of-scope touches

None.
