# Contributing

## Scope

A few things are intentional constraints rather than gaps, so please don't open
PRs for these, as they're unlikely to be accepted:

- **New illustration styles or color palettes.** The 3D clay render style and
  Catppuccin Mocha palette are core to the project. Mixing in other styles would
  break the coherence of the collection.
- **Additional UI languages.** The site is English-only. Each new locale is
  ongoing work to keep in sync, not something to take on lightly.
- **User accounts or cloud sync.** The site is intentionally local-first with no
  server. Favorites and settings stay in the browser; that's a design choice.
- **Additional color variants of existing illustrations.** Each illustration has
  one or a few accent colors chosen at generation time. Producing every illustration
  in every color combination is not a goal.
- **Large UI overhauls.** Small improvements and bug fixes are welcome. Bigger
  structural changes to the layout or design are owner-driven.

When in doubt, open an issue before writing code.

## Reporting website bugs

Open a GitHub issue. Include steps to reproduce and what you expected to happen.

## Reporting illustration bugs

AI-generated images can have subtle defects: odd proportions, garbled details,
color inconsistencies, or artifacts that slipped past review. If you spot one,
open a GitHub issue with the label `illustration-flaw` and include:

- The illustration name
- A short description of what looks wrong
- A screenshot if it helps

The maintainer will review and decide whether to regenerate. Not every imperfection
warrants a fix; minor quirks are expected and part of working with AI generation.

## Requesting an illustration

Open a GitHub issue with the label `illustration-request`. Describe the subject
and any context that would help (intended use, style notes, preferred accent color).
All illustrations are generated and reviewed by the maintainer; contributors do
not submit images directly.

## Code contributions

Small, focused pull requests are welcome. For anything larger than a bug fix,
open an issue first so we can align before you invest the time.

Run the following before submitting:

    npm run format && npm run lint && npm run test -- --run && npm run build

## Illustration license

Illustrations are released under CC BY-NC 4.0. By requesting a new illustration
you agree that it will be published under the same terms.
