---
type: adr
id: 0005
title: One shared IntersectionObserver drives all scroll-triggered motion
status: accepted
date: 2026-07-26
phase: 2
supersedes: ADR-0002 (script-purpose clause only)
---

# ADR-0005: One shared IntersectionObserver drives all scroll-triggered motion

> Phase: 2 | Status: accepted | Date: 2026-07-26
> Decision drivers: Phase 2 adds section reveals (OVERVIEW §3.2); ADR-0002
> limited the single script to the protocol diagram specifically

## Context

ADR-0002 permits exactly one inline script and scoped it to the protocol
diagram. Phase 2's subtle section reveals also need a scroll trigger. Two
scripts would violate the policy; zero would forfeit a mandated design
feature.

## Decision

- Still exactly ONE inline script — but generalized: a single
  IntersectionObserver that watches every element carrying `data-reveal`
  and adds an `is-revealed` class once (then unobserves).
- The protocol diagram's staged animation and all section reveals are
  expressed purely in CSS keyed off `is-revealed` (+ optional
  `--reveal-delay` custom property for stagger).
- Script budget raised from 600 bytes to 1KB to cover the generalization.
  Everything else in ADR-0002 stands: no libraries, plays once, 200-700ms
  ease-out, complete final states under `prefers-reduced-motion` (the CSS
  must render final state when `is-revealed` is absent AND reduced-motion
  is on — i.e. reveal styling is opt-in animation, not opt-in visibility).

## Rules this decision implies

- Content must NEVER be invisible without JS: the pre-reveal state may
  translate/fade but must not set `visibility: hidden`/`display: none`;
  with JS disabled the page reads fine, merely without motion.
- Gate grep: exactly one inline script, contains "IntersectionObserver",
  ≤ 1024 bytes.
