# ADR 0001: Publish illustration prompts by default

## Status

Accepted

## Context

Every illustration carries the text prompt it was generated from, stored in its
markdown frontmatter (`illustration-prompt`). Those prompts are useful: they show
how the consistent clay style is achieved and let people learn from or adapt them.
Early on the site stripped them from the published output, leaving open whether to
expose them at all.

## Decision

Publish prompts by default. The build (`scripts/build-index.ts`) includes each
prompt in the generated `index.json`, and the detail panel renders it. A
`PUBLISH_PROMPTS` environment variable still exists as an escape hatch: set it to
`false` to strip prompts at build time (useful for a private fork).

## Consequences

- Prompts are visible on the site and in the JSON payload, and they live in the
  public repo's `meta/` files.
- The collection doubles as a reference for prompting in this style.
- Anyone forking the repo who wants prompts hidden can flip one env var.
