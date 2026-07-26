---
type: adr
id: 0003
title: Single page for v1; link to docs, never mirror them
status: accepted
date: 2026-07-26
phase: 1
---

# ADR-0003: Single page for v1; link to docs, never mirror them

> Phase: 1 | Status: accepted | Date: 2026-07-26
> Decision drivers: single source of truth, maintenance cost, OVERVIEW §2.1

## Context

The metis repo's docs/ is the canonical documentation, versioned with the
code it describes. Mirroring it on the site would drift.

## Decision

One page (`index.astro`). All documentation CTAs deep-link to
github.com/techspeque/metis (README, docs/*.md, releases). The site carries
only positioning copy, the install command, and the protocol illustration —
content that changes at marketing cadence, not release cadence.

## Rules this decision implies

- Every metis behavior claim in site copy must be verifiable against the
  current CLI (OVERVIEW §3.4; project accuracy rule #1 pattern).
- The pinned copy source is docs/copy.md — components render copy from it
  verbatim; wording changes go through that file first.
