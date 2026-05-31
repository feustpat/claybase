import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useFavorites } from './useFavorites'

beforeEach(() => localStorage.clear())

describe('useFavorites', () => {
  it('starts with no favorites', () => {
    const { result } = renderHook(() => useFavorites())
    expect(result.current.favorites.size).toBe(0)
  })

  it('adds a favorite on toggle', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => result.current.toggle('ai'))
    expect(result.current.isFavorite('ai')).toBe(true)
  })

  it('removes a favorite on second toggle', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => result.current.toggle('ai'))
    act(() => result.current.toggle('ai'))
    expect(result.current.isFavorite('ai')).toBe(false)
  })

  it('persists to localStorage', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => result.current.toggle('beach'))
    const stored = JSON.parse(localStorage.getItem('illustration-favorites') ?? '[]') as string[]
    expect(stored).toContain('beach')
  })

  it('loads from localStorage on mount', () => {
    localStorage.setItem('illustration-favorites', JSON.stringify(['book']))
    const { result } = renderHook(() => useFavorites())
    expect(result.current.isFavorite('book')).toBe(true)
  })

  it('reset clears all favorites', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => result.current.toggle('ai'))
    act(() => result.current.toggle('beach'))
    act(() => result.current.reset())
    expect(result.current.favorites.size).toBe(0)
  })

  it('reset persists empty state to localStorage', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => result.current.toggle('ai'))
    act(() => result.current.reset())
    const stored = JSON.parse(localStorage.getItem('illustration-favorites') ?? '[]') as string[]
    expect(stored).toHaveLength(0)
  })
})
