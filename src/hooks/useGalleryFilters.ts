import { useSearchParams } from 'react-router-dom'
import type { FilterMode } from '@/hooks/useSearch'

/**
 * Owns the gallery's filter state, which lives entirely in the URL query string
 * so views are shareable and survive reloads. Exposes the derived values plus
 * setters that write back to the URL with `replace` (no history spam).
 */
export function useGalleryFilters() {
  const [searchParams, setSearchParams] = useSearchParams()

  const query = searchParams.get('q') ?? ''
  const selectedTags = searchParams.getAll('t')
  const tagsMode = (searchParams.get('tm') ?? 'any') as FilterMode
  const selectedAccentColors = searchParams.getAll('c')
  const accentColorsMode = (searchParams.get('cm') ?? 'any') as FilterMode
  const favoritesOnly = searchParams.get('fav') === '1'

  function setQuery(q: string) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (q) next.set('q', q)
        else next.delete('q')
        return next
      },
      { replace: true }
    )
  }

  function setSelectedTags(tags: string[]) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        next.delete('t')
        tags.forEach((t) => next.append('t', t))
        return next
      },
      { replace: true }
    )
  }

  function setSelectedAccentColors(colors: string[]) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        next.delete('c')
        colors.forEach((c) => next.append('c', c))
        return next
      },
      { replace: true }
    )
  }

  function setTagsMode(mode: FilterMode) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (mode === 'all') next.set('tm', 'all')
        else next.delete('tm')
        return next
      },
      { replace: true }
    )
  }

  function setAccentColorsMode(mode: FilterMode) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (mode === 'all') next.set('cm', 'all')
        else next.delete('cm')
        return next
      },
      { replace: true }
    )
  }

  function setFavoritesOnly(v: boolean) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (v) next.set('fav', '1')
        else next.delete('fav')
        return next
      },
      { replace: true }
    )
  }

  /** Clears all filters but leaves a shared-view (`s`) param untouched. */
  function clearFilters() {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        next.delete('q')
        next.delete('t')
        next.delete('tm')
        next.delete('c')
        next.delete('cm')
        next.delete('fav')
        return next
      },
      { replace: true }
    )
  }

  return {
    searchParams,
    setSearchParams,
    query,
    selectedTags,
    tagsMode,
    selectedAccentColors,
    accentColorsMode,
    favoritesOnly,
    setQuery,
    setSelectedTags,
    setSelectedAccentColors,
    setTagsMode,
    setAccentColorsMode,
    setFavoritesOnly,
    clearFilters,
  }
}
