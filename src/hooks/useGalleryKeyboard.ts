import { useEffect, useRef } from 'react'
import type { NavigateFunction, SetURLSearchParams } from 'react-router-dom'
import { downloadFile } from '@/utils/downloadFile'
import type { Illustration } from '@/types/illustration'

interface GalleryKeyboardParams {
  activeIllustration: Illustration | null
  activeIndex: number
  displayResults: Illustration[]
  prevSlug: string | null
  nextSlug: string | null
  toggle: (slug: string) => void
  searchParams: URLSearchParams
  setSearchParams: SetURLSearchParams
  navigate: NavigateFunction
  searchRef: React.RefObject<HTMLInputElement>
  gridRef: React.RefObject<HTMLDivElement>
}

/**
 * Global keyboard navigation for the gallery: search focus (/ or S), favorite (F),
 * favorites-only view (V), download (D), random (R), and arrow-key movement between
 * cards and through the detail panel. Also restores focus to the originating card
 * when the panel closes.
 *
 * All dynamic values are read through refs so the keydown listener is attached once
 * and never goes stale.
 */
export function useGalleryKeyboard({
  activeIllustration,
  activeIndex,
  displayResults,
  prevSlug,
  nextSlug,
  toggle,
  searchParams,
  setSearchParams,
  navigate,
  searchRef,
  gridRef,
}: GalleryKeyboardParams) {
  const lastActiveSlugRef = useRef<string | null>(null)

  const activeIllustrationRef = useRef(activeIllustration)
  const activeIndexRef = useRef(activeIndex)
  const displayResultsRef = useRef(displayResults)
  const prevSlugRef = useRef(prevSlug)
  const nextSlugRef = useRef(nextSlug)
  const toggleRef = useRef(toggle)
  const searchParamsRef = useRef(searchParams)
  // Navigate wrapper that preserves current filter params in the URL
  const navigateRef = useRef((pathname: string) =>
    navigate({ pathname, search: searchParamsRef.current.toString() })
  )
  activeIllustrationRef.current = activeIllustration
  activeIndexRef.current = activeIndex
  displayResultsRef.current = displayResults
  prevSlugRef.current = prevSlug
  nextSlugRef.current = nextSlug
  toggleRef.current = toggle
  searchParamsRef.current = searchParams
  navigateRef.current = (pathname: string) =>
    navigate({ pathname, search: searchParamsRef.current.toString() })

  useEffect(() => {
    if (activeIllustration) {
      lastActiveSlugRef.current = activeIllustration.slug
    } else if (lastActiveSlugRef.current && gridRef.current) {
      const idx = displayResultsRef.current.findIndex((i) => i.slug === lastActiveSlugRef.current)
      const cards = Array.from(
        gridRef.current.querySelectorAll<HTMLElement>('[data-illustration-card] > button')
      )
      cards[idx]?.focus()
      lastActiveSlugRef.current = null
    }
  }, [activeIllustration, gridRef])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as Element
      const inInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA'
      const noMod = !e.metaKey && !e.ctrlKey && !e.altKey

      // / or S → focus search
      if ((e.key === '/' || e.key === 's' || e.key === 'S') && !inInput && noMod) {
        e.preventDefault()
        searchRef.current?.focus()
        return
      }

      // F → toggle favorite on active illustration (panel open) or focused card in grid
      if ((e.key === 'f' || e.key === 'F') && !inInput && noMod) {
        let ill = activeIllustrationRef.current
        if (!ill && gridRef.current) {
          const cards = Array.from(
            gridRef.current.querySelectorAll<HTMLElement>('[data-illustration-card] > button')
          )
          const idx = cards.indexOf(document.activeElement as HTMLElement)
          if (idx !== -1) ill = displayResultsRef.current[idx] ?? null
        }
        if (!ill) return
        if (activeIllustrationRef.current && searchParamsRef.current.get('fav') === '1') {
          const target = prevSlugRef.current ?? nextSlugRef.current
          navigateRef.current(target ? `/illustrations/${target}` : '/')
        }
        toggleRef.current(ill.slug)
        return
      }

      // V → toggle favorites-only view
      if ((e.key === 'v' || e.key === 'V') && !inInput && noMod) {
        const next = new URLSearchParams(searchParamsRef.current)
        if (next.get('fav') === '1') next.delete('fav')
        else next.set('fav', '1')
        setSearchParams(next, { replace: true })
        return
      }

      // D → download active illustration (panel open) or focused card in grid
      if ((e.key === 'd' || e.key === 'D') && !inInput && noMod) {
        const active = activeIllustrationRef.current
        let ill = active
        if (!ill && gridRef.current) {
          const cards = Array.from(
            gridRef.current.querySelectorAll<HTMLElement>('[data-illustration-card] > button')
          )
          const idx = cards.indexOf(document.activeElement as HTMLElement)
          if (idx !== -1) ill = displayResultsRef.current[idx] ?? null
        }
        if (ill) downloadFile(ill.images.download, `${ill.slug}.jpg`)
        return
      }

      // R → random illustration
      if ((e.key === 'r' || e.key === 'R') && !inInput && noMod) {
        const dr = displayResultsRef.current
        const active = activeIllustrationRef.current
        const pool = active ? dr.filter((i) => i.slug !== active.slug) : dr
        if (pool.length === 0) return
        const pick = pool[Math.floor(Math.random() * pool.length)]
        navigateRef.current(`/illustrations/${pick.slug}`)
        return
      }

      // ← / → / ↑ / ↓ when panel is open
      if (activeIllustrationRef.current) {
        if (gridRef.current?.contains(document.activeElement))
          (document.activeElement as HTMLElement).blur()
        if (e.key === 'ArrowLeft' && prevSlugRef.current) {
          e.preventDefault()
          navigateRef.current(`/illustrations/${prevSlugRef.current}`)
        } else if (e.key === 'ArrowRight' && nextSlugRef.current) {
          e.preventDefault()
          navigateRef.current(`/illustrations/${nextSlugRef.current}`)
        } else if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && gridRef.current) {
          e.preventDefault()
          const colCount = getComputedStyle(gridRef.current).gridTemplateColumns.split(' ').length
          const dr = displayResultsRef.current
          const ai = activeIndexRef.current
          const newIndex = Math.max(
            0,
            Math.min(dr.length - 1, ai + (e.key === 'ArrowUp' ? -colCount : colCount))
          )
          if (newIndex !== ai) navigateRef.current(`/illustrations/${dr[newIndex].slug}`)
        }
        return
      }

      // Arrow keys → move focus between cards in the grid
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
        if (!gridRef.current) return
        const cards = Array.from(
          gridRef.current.querySelectorAll<HTMLElement>('[data-illustration-card] > button')
        )
        if (cards.length === 0) return
        const currentIndex = cards.indexOf(document.activeElement as HTMLElement)
        if (currentIndex === -1) return

        e.preventDefault()
        const colCount = getComputedStyle(gridRef.current).gridTemplateColumns.split(' ').length
        let next = currentIndex
        if (e.key === 'ArrowLeft') next -= 1
        if (e.key === 'ArrowRight') next += 1
        if (e.key === 'ArrowUp') next -= colCount
        if (e.key === 'ArrowDown') next += colCount
        cards[Math.max(0, Math.min(cards.length - 1, next))]?.focus()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // stable — all dynamic values accessed via refs
}
