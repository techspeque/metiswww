---
type: adr
id: 0002
title: Zero-JS baseline; animations only where they explain
status: accepted
date: 2026-07-26
phase: 1
---

# ADR-0002: Zero-JS baseline; animations only where they explain

> Phase: 1 | Status: accepted | Date: 2026-07-26
> Decision drivers: OVERVIEW §3.1/§3.4 (zero client JS except animation
> necessity), performance, "not vibe-coded"

## Context

The site ships zero client-side JavaScript today. Phase 1 adds the two
animations the OVERVIEW mandates: the typed-terminal hero and the slice
lifecycle diagram.

## Decision

- CSS-first: the hero typing effect is pure CSS (`steps()` + `@keyframes`
  on a monospace block) — no JS.
- The ONLY permitted JS is a single inline IntersectionObserver (<15 lines)
  to trigger the protocol diagram's staged animation on scroll. No
  libraries, no framework hydration, no other scripts.
- Every animation: 200-700ms, ease-out, plays once (no infinite loops), and
  is fully disabled under `prefers-reduced-motion: reduce` with the final
  frame shown statically.

## Consequences

The phase-1 gate's zero-JS grep changes from `count == 0` to "exactly one
inline script, containing IntersectionObserver, < 600 bytes".

## Rules this decision implies

- Any second script tag, external script, or JS beyond the observer is a
  review finding (severity P2, category scope).
- Reduced-motion must show the complete final state, not a blank.
