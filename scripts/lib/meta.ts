/**
 * Pure helpers for turning illustration frontmatter into index data.
 * Kept separate from build-index.ts so they can be unit-tested without
 * pulling in sharp, the filesystem, or the build's top-level side effects.
 */

/** Normalises a frontmatter value that may be a string, an array, or missing into a string[]. */
export function resolveStringOrArray(value: unknown): string[] {
  if (!value) return []
  if (Array.isArray(value)) {
    return value.filter((v): v is string => typeof v === 'string' && v.length > 0)
  }
  if (typeof value === 'string' && value.length > 0) return [value]
  return []
}

/** Derives a display name from a file slug: "Air-Fryer" → "Air Fryer". */
export function slugToName(slug: string): string {
  return slug.replace(/-/g, ' ')
}
