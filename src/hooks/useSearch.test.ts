import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useSearch } from './useSearch'
import type { Illustration } from '@/types/illustration'
import { tagNames } from '@/locales/tag-names'

const makeIll = (overrides: Partial<Illustration>): Illustration => ({
  slug: 'test',
  name: 'Test',
  creationDate: '2026-01-01',
  model: 'DALL-E 3',
  style: '3D clay render',
  colorScheme: 'Catppuccin Mocha',
  accentColors: [],
  tags: [],
  aliases: [],
  images: { thumbnail: '/t.jpg', display: '/d.jpg', download: '/dl.jpg' },
  body: '',
  ...overrides,
})

const ILLUSTRATIONS: Illustration[] = [
  makeIll({
    slug: 'ai',
    name: 'AI',
    tags: ['tech'],
    aliases: ['Brain', 'Second Brain'],
    accentColors: ['blue', 'purple'],
  }),
  makeIll({
    slug: 'beach',
    name: 'Beach',
    tags: ['nature', 'travel'],
    aliases: [],
    accentColors: ['yellow', 'blue'],
  }),
  makeIll({
    slug: 'book',
    name: 'Book',
    tags: ['learning'],
    aliases: ['Reading'],
    accentColors: ['green'],
  }),
]

describe('useSearch', () => {
  it('returns all illustrations with empty filters', () => {
    const { result } = renderHook(() =>
      useSearch(
        ILLUSTRATIONS,
        {
          query: '',
          tags: [],
          accentColors: [],
          tagsMode: 'any' as const,
          accentColorsMode: 'any' as const,
          favoritesOnly: false,
        },
        new Set()
      )
    )
    expect(result.current).toHaveLength(3)
  })

  it('filters by query matching name', () => {
    const { result } = renderHook(() =>
      useSearch(
        ILLUSTRATIONS,
        {
          query: 'Beach',
          tags: [],
          accentColors: [],
          tagsMode: 'any' as const,
          accentColorsMode: 'any' as const,
          favoritesOnly: false,
        },
        new Set()
      )
    )
    expect(result.current.some((i) => i.slug === 'beach')).toBe(true)
  })

  it('filters by query matching alias', () => {
    const { result } = renderHook(() =>
      useSearch(
        ILLUSTRATIONS,
        {
          query: 'Brain',
          tags: [],
          accentColors: [],
          tagsMode: 'any' as const,
          accentColorsMode: 'any' as const,
          favoritesOnly: false,
        },
        new Set()
      )
    )
    expect(result.current.some((i) => i.slug === 'ai')).toBe(true)
  })

  it('filters by tag', () => {
    const { result } = renderHook(() =>
      useSearch(
        ILLUSTRATIONS,
        {
          query: '',
          tags: ['tech'],
          accentColors: [],
          tagsMode: 'any' as const,
          accentColorsMode: 'any' as const,
          favoritesOnly: false,
        },
        new Set()
      )
    )
    expect(result.current).toHaveLength(1)
    expect(result.current[0].slug).toBe('ai')
  })

  it('combines query and tag filter (OR across tags)', () => {
    const { result } = renderHook(() =>
      useSearch(
        ILLUSTRATIONS,
        {
          query: 'book',
          tags: ['learning'],
          accentColors: [],
          tagsMode: 'any' as const,
          accentColorsMode: 'any' as const,
          favoritesOnly: false,
        },
        new Set()
      )
    )
    expect(result.current.some((i) => i.slug === 'book')).toBe(true)
  })

  it('tag filter is OR — matches any selected tag', () => {
    const { result } = renderHook(() =>
      useSearch(
        ILLUSTRATIONS,
        {
          query: '',
          tags: ['tech', 'nature'],
          accentColors: [],
          tagsMode: 'any' as const,
          accentColorsMode: 'any' as const,
          favoritesOnly: false,
        },
        new Set()
      )
    )
    expect(result.current.some((i) => i.slug === 'ai')).toBe(true)
    expect(result.current.some((i) => i.slug === 'beach')).toBe(true)
    expect(result.current.some((i) => i.slug === 'book')).toBe(false)
  })

  it('filters by favorites only', () => {
    const { result } = renderHook(() =>
      useSearch(
        ILLUSTRATIONS,
        {
          query: '',
          tags: [],
          accentColors: [],
          tagsMode: 'any' as const,
          accentColorsMode: 'any' as const,
          favoritesOnly: true,
        },
        new Set(['ai'])
      )
    )
    expect(result.current).toHaveLength(1)
    expect(result.current[0].slug).toBe('ai')
  })

  it('returns empty array when nothing matches', () => {
    const { result } = renderHook(() =>
      useSearch(
        ILLUSTRATIONS,
        {
          query: 'zzznomatch',
          tags: [],
          accentColors: [],
          tagsMode: 'any' as const,
          accentColorsMode: 'any' as const,
          favoritesOnly: false,
        },
        new Set()
      )
    )
    expect(result.current).toHaveLength(0)
  })

  it('accent color filter OR mode — matches any selected color', () => {
    const { result } = renderHook(() =>
      useSearch(
        ILLUSTRATIONS,
        {
          query: '',
          tags: [],
          accentColors: ['purple', 'green'],
          tagsMode: 'any' as const,
          accentColorsMode: 'any' as const,
          favoritesOnly: false,
        },
        new Set()
      )
    )
    expect(result.current.some((i) => i.slug === 'ai')).toBe(true)
    expect(result.current.some((i) => i.slug === 'book')).toBe(true)
    expect(result.current.some((i) => i.slug === 'beach')).toBe(false)
  })

  it('accent color filter AND mode — must have all selected colors', () => {
    const { result } = renderHook(() =>
      useSearch(
        ILLUSTRATIONS,
        {
          query: '',
          tags: [],
          accentColors: ['blue', 'purple'],
          tagsMode: 'any' as const,
          accentColorsMode: 'all' as const,
          favoritesOnly: false,
        },
        new Set()
      )
    )
    expect(result.current).toHaveLength(1)
    expect(result.current[0].slug).toBe('ai')
  })

  it('accent color AND mode excludes items missing any color', () => {
    const { result } = renderHook(() =>
      useSearch(
        ILLUSTRATIONS,
        {
          query: '',
          tags: [],
          accentColors: ['blue', 'green'],
          tagsMode: 'any' as const,
          accentColorsMode: 'all' as const,
          favoritesOnly: false,
        },
        new Set()
      )
    )
    expect(result.current).toHaveLength(0)
  })

  it('fuzzy search tolerates typos', () => {
    const { result } = renderHook(() =>
      useSearch(
        ILLUSTRATIONS,
        {
          query: 'Beech',
          tags: [],
          accentColors: [],
          tagsMode: 'any' as const,
          accentColorsMode: 'any' as const,
          favoritesOnly: false,
        },
        new Set()
      )
    )
    expect(result.current.some((i) => i.slug === 'beach')).toBe(true)
  })

  it('fuzzy search matches alias with typo', () => {
    const { result } = renderHook(() =>
      useSearch(
        ILLUSTRATIONS,
        {
          query: 'Readng',
          tags: [],
          accentColors: [],
          tagsMode: 'any' as const,
          accentColorsMode: 'any' as const,
          favoritesOnly: false,
        },
        new Set()
      )
    )
    expect(result.current.some((i) => i.slug === 'book')).toBe(true)
  })

  it('searches by tag display name when a translation is defined', () => {
    tagNames['mapped-tag'] = 'Mapped Display'
    const ills = [makeIll({ slug: 'mapped', name: 'Mapped', tags: ['mapped-tag'] })]
    const { result } = renderHook(() =>
      useSearch(
        ills,
        {
          query: 'Mapped Display',
          tags: [],
          accentColors: [],
          tagsMode: 'any',
          accentColorsMode: 'any',
          favoritesOnly: false,
        },
        new Set()
      )
    )
    expect(result.current.some((i) => i.slug === 'mapped')).toBe(true)
    delete tagNames['mapped-tag']
  })

  it('falls back to raw tag ID in search when no translation is defined', () => {
    const ills = [makeIll({ slug: 'raw-tagged', name: 'Raw Tagged', tags: ['unmapped-raw'] })]
    const { result } = renderHook(() =>
      useSearch(
        ills,
        {
          query: 'unmapped-raw',
          tags: [],
          accentColors: [],
          tagsMode: 'any',
          accentColorsMode: 'any',
          favoritesOnly: false,
        },
        new Set()
      )
    )
    expect(result.current.some((i) => i.slug === 'raw-tagged')).toBe(true)
  })
})
