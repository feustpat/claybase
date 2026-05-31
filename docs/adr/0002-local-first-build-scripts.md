# ADR 0002: Local-first build scripts, CI as a thin caller

## Status

Accepted

## Context

The project needs build, lint, test, and metadata-validation steps that run both
during local development and in CI. The goal is a good local experience and no
lock-in to a particular CI vendor.

## Decision

Every operation is an `npm run` script in `package.json`. CI (GitHub Actions) and
the host (Vercel) only call those scripts; they contain no logic of their own. The
production build runs `build:data` first, which turns `assets/` + `meta/` into the
generated `public/` output the app reads at runtime.

## Consequences

- `npm run build`, `test`, `lint`, and `validate` behave identically locally and in CI.
- Switching CI providers means editing a thin caller, not the build logic.
- Generated output (`public/illustrations/`, `public/data/`, `sitemap.xml`) is not
  committed; the host regenerates it on every deploy from the committed sources.
