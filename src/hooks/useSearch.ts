import { useMemo } from 'react'
import Fuse from 'fuse.js'
import type { Illustration } from '@/types/illustration'
import { getTagLabel } from '@/locales/tag-names'

const FUSE_OPTIONS = {
  keys: [
    { name: 'name', weight: 2 },
    { name: 'aliases', weight: 1.5 },
    { name: 'tags', weight: 1 },
  ],
  threshold: 0.2,
  includeScore: true,
}

export type FilterMode = 'any' | 'all'

export interface SearchFilters {
  query: string
  tags: string[]
  tagsMode: FilterMode
  accentColors: string[]
  accentColorsMode: FilterMode
  favoritesOnly: boolean
}

export function useSearch(
  illustrations: Illustration[],
  filters: SearchFilters,
  favorites: Set<string>,
  slugFilter?: string[]
): Illustration[] {
  const illustrationBySlug = useMemo(
    () => new Map(illustrations.map((ill) => [ill.slug, ill])),
    [illustrations]
  )

  // Fuse corpus: same structure but with display tag names for full-text search
  const searchCorpus = useMemo(
    () =>
      illustrations.map((ill) => ({
        ...ill,
        tags: ill.tags.map((t) => getTagLabel(t)),
      })),
    [illustrations]
  )

  const fuse = useMemo(() => new Fuse(searchCorpus, FUSE_OPTIONS), [searchCorpus])

  return useMemo(() => {
    if (slugFilter && slugFilter.length > 0) {
      return slugFilter.flatMap((slug) => {
        const ill = illustrationBySlug.get(slug)
        return ill ? [ill] : []
      })
    }

    let results = illustrations

    if (filters.query.trim()) {
      results = fuse
        .search(filters.query)
        .map((r) => illustrationBySlug.get(r.item.slug)!)
        .filter(Boolean)
    }

    if (filters.tags.length > 0) {
      const matchTag =
        filters.tagsMode === 'all'
          ? (ill: Illustration) => filters.tags.every((tag) => ill.tags.includes(tag))
          : (ill: Illustration) => filters.tags.some((tag) => ill.tags.includes(tag))
      results = results.filter(matchTag)
    }

    if (filters.accentColors.length > 0) {
      const match =
        filters.accentColorsMode === 'all'
          ? (ill: Illustration) => filters.accentColors.every((c) => ill.accentColors.includes(c))
          : (ill: Illustration) => filters.accentColors.some((c) => ill.accentColors.includes(c))
      results = results.filter(match)
    }

    if (filters.favoritesOnly) {
      results = results.filter((ill) => favorites.has(ill.slug))
    }

    return results
  }, [illustrations, illustrationBySlug, fuse, filters, favorites, slugFilter])
}
