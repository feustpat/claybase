import { describe, it, expect } from 'vitest'
import { getTagLabel, isTagHidden, hiddenTags } from './tag-names'

describe('getTagLabel', () => {
  it('returns raw tag ID when no entry exists', () => {
    expect(getTagLabel('no-such-tag')).toBe('no-such-tag')
  })

  it('returns display name for a known tag', () => {
    expect(getTagLabel('animal')).toBe('Animals')
  })
})

describe('isTagHidden', () => {
  it('returns false for an unknown tag', () => {
    expect(isTagHidden('not-a-real-tag')).toBe(false)
  })

  it('returns false for a known but visible tag', () => {
    expect(isTagHidden('animal')).toBe(false)
  })

  it('returns true for an explicitly hidden tag', () => {
    hiddenTags.add('temp-hidden-test')
    expect(isTagHidden('temp-hidden-test')).toBe(true)
    hiddenTags.delete('temp-hidden-test')
  })
})
