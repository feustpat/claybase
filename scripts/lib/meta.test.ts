import { describe, it, expect } from 'vitest'
import { resolveStringOrArray, slugToName } from './meta'

describe('resolveStringOrArray', () => {
  it('returns an empty array for missing values', () => {
    expect(resolveStringOrArray(undefined)).toEqual([])
    expect(resolveStringOrArray(null)).toEqual([])
    expect(resolveStringOrArray('')).toEqual([])
  })

  it('wraps a single non-empty string in an array', () => {
    expect(resolveStringOrArray('tech')).toEqual(['tech'])
  })

  it('preserves array order', () => {
    expect(resolveStringOrArray(['tech', 'home', 'nature'])).toEqual(['tech', 'home', 'nature'])
  })

  it('drops non-string and empty entries from an array', () => {
    expect(resolveStringOrArray(['tech', '', 42, null, 'home', undefined])).toEqual([
      'tech',
      'home',
    ])
  })

  it('returns an empty array for an empty array', () => {
    expect(resolveStringOrArray([])).toEqual([])
  })
})

describe('slugToName', () => {
  it('replaces every hyphen with a space', () => {
    expect(slugToName('Air-Fryer')).toBe('Air Fryer')
    expect(slugToName('Cold-Brew-Coffee')).toBe('Cold Brew Coffee')
  })

  it('leaves an unhyphenated slug unchanged', () => {
    expect(slugToName('Anchor')).toBe('Anchor')
  })
})
