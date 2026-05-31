import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { useGalleryFilters } from './useGalleryFilters'

function renderFilters(initialUrl = '/') {
  return renderHook(() => useGalleryFilters(), {
    wrapper: ({ children }) => (
      <MemoryRouter
        initialEntries={[initialUrl]}
        future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
      >
        {children}
      </MemoryRouter>
    ),
  })
}

describe('useGalleryFilters', () => {
  it('defaults to empty filters with mode "any"', () => {
    const { result } = renderFilters()
    expect(result.current.query).toBe('')
    expect(result.current.selectedTags).toEqual([])
    expect(result.current.selectedAccentColors).toEqual([])
    expect(result.current.tagsMode).toBe('any')
    expect(result.current.accentColorsMode).toBe('any')
    expect(result.current.favoritesOnly).toBe(false)
  })

  it('reads initial state from the URL', () => {
    const { result } = renderFilters('/?q=brain&t=tech&t=home&tm=all&fav=1')
    expect(result.current.query).toBe('brain')
    expect(result.current.selectedTags).toEqual(['tech', 'home'])
    expect(result.current.tagsMode).toBe('all')
    expect(result.current.favoritesOnly).toBe(true)
  })

  it('setQuery writes and clears the q param', () => {
    const { result } = renderFilters()
    act(() => result.current.setQuery('cat'))
    expect(result.current.query).toBe('cat')
    act(() => result.current.setQuery(''))
    expect(result.current.searchParams.has('q')).toBe(false)
  })

  it('stores multiple tags as repeated params, not a joined string', () => {
    const { result } = renderFilters()
    act(() => result.current.setSelectedTags(['tech', 'home']))
    expect(result.current.searchParams.getAll('t')).toEqual(['tech', 'home'])
    expect(result.current.selectedTags).toEqual(['tech', 'home'])
  })

  it('persists tagsMode only when "all" (default "any" stays out of the URL)', () => {
    const { result } = renderFilters()
    act(() => result.current.setTagsMode('all'))
    expect(result.current.searchParams.get('tm')).toBe('all')
    act(() => result.current.setTagsMode('any'))
    expect(result.current.searchParams.has('tm')).toBe(false)
    expect(result.current.tagsMode).toBe('any')
  })

  it('setFavoritesOnly toggles the fav param', () => {
    const { result } = renderFilters()
    act(() => result.current.setFavoritesOnly(true))
    expect(result.current.searchParams.get('fav')).toBe('1')
    act(() => result.current.setFavoritesOnly(false))
    expect(result.current.searchParams.has('fav')).toBe(false)
  })

  it('clearFilters removes every filter but preserves the shared-view param', () => {
    const { result } = renderFilters('/?q=brain&t=tech&tm=all&c=blue&cm=all&fav=1&s=ai,beach')
    act(() => result.current.clearFilters())
    expect(result.current.query).toBe('')
    expect(result.current.selectedTags).toEqual([])
    expect(result.current.selectedAccentColors).toEqual([])
    expect(result.current.tagsMode).toBe('any')
    expect(result.current.accentColorsMode).toBe('any')
    expect(result.current.favoritesOnly).toBe(false)
    // The shared collection must survive a filter reset.
    expect(result.current.searchParams.get('s')).toBe('ai,beach')
  })
})
