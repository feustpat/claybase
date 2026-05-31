import { useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'illustration-favorites'

function load(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set()
  } catch {
    return new Set()
  }
}

function save(slugs: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...slugs]))
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(load)

  useEffect(() => {
    save(favorites)
  }, [favorites])

  const toggle = useCallback((slug: string) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(slug)) next.delete(slug)
      else next.add(slug)
      return next
    })
  }, [])

  const reset = useCallback(() => setFavorites(new Set()), [])

  const isFavorite = useCallback((slug: string) => favorites.has(slug), [favorites])

  return { favorites, toggle, reset, isFavorite }
}
