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

## Declared file scope

- **owned_paths:** src/layouts/Base.astro, public/robots.txt, src/components/
- **read_only_paths:** src/styles/tokens.css (escalate via out-of-scope declaration if a token fix is genuinely required)

## Definition of Done

- All four Lighthouse categories ≥ 95 (scores + LH version recorded here)
- Existing policy greps unchanged; npm run verify green

## Test plan

- npx lighthouse against served dist, headless, both schemes spot-checked
- Re-run the phase-1 gate greps as regression suite
