# Claybase

A library of AI-generated 3D clay render illustrations and the React app that showcases them. See `CONTEXT.md` for the domain glossary and `README.md` for setup and the illustration metadata format.

## Before marking a change done

Run all four and make sure they pass:

```
npm run format
npm run lint
npm run test -- --run
npm run build
```

## How illustrations work

Each illustration is a pair of files: `assets/<Slug>.jpeg` (the source image) and `meta/<Slug>.md` (YAML frontmatter with tags, accent colors, model, and prompt). `npm run build:data` turns those into the gallery index and the resized image variants under `public/`.
