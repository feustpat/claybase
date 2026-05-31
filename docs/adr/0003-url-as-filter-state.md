# ADR 0003: The URL is the source of truth for gallery state

## Status

Accepted

## Context

The gallery has several pieces of view state: the search query, selected tags and
accent colors (each with an any/all mode), a favorites-only toggle, the open detail
panel, and shared collections. This state needs to be shareable, bookmarkable, and
survive a page reload, without standing up a backend.

## Decision

Encode that state in the URL query string and treat it as the single source of
truth: `q` (query), `t` (tags), `tm` (tag mode), `c` (colors), `cm` (color mode),
`fav` (favorites only), and `s` (a shared collection). The open illustration is the
route path (`/illustrations/:slug`). `useGalleryFilters` centralises reading and
writing these params (writes use `replace` so filtering doesn't spam history).
Favorites themselves are separate user data and live in `localStorage`.

## Consequences

- Every view, filter, and shared selection is a plain link, with working back/forward
  and no client-side store to manage.
- The query-param names are a public contract, so they're covered by tests
  (`useGalleryFilters.test.tsx`).
- Favorites persist per-browser and are intentionally not in the URL, except when a
  user explicitly shares a snapshot via `s`.
