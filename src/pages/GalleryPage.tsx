import { useState, useRef, useEffect } from 'react'
import { Heart, X } from 'lucide-react'
import { useParams, useNavigate } from 'react-router-dom'
import { useIllustrations } from '@/context/IllustrationContext'
import { useSearch } from '@/hooks/useSearch'
import { SITE_TITLE } from '@/utils/siteTitle'
import { usePageMeta } from '@/hooks/usePageMeta'
import { useFavorites } from '@/hooks/useFavorites'
import { useBatchDownload } from '@/hooks/useBatchDownload'
import { useGalleryFilters } from '@/hooks/useGalleryFilters'
import { useGalleryKeyboard } from '@/hooks/useGalleryKeyboard'
import IllustrationCard from '@/components/gallery/IllustrationCard'
import GalleryControls from '@/components/gallery/GalleryControls'
import DisplaySidebar from '@/components/gallery/DisplaySidebar'
import DetailPanel from '@/components/detail/DetailPanel'
import { strings as t } from '@/locales/en'

export type CardSize = 'sm' | 'md' | 'lg'
export type GridWidth = 'narrow' | 'wide' | 'full'
const CARD_WIDTHS: Record<CardSize, number> = { sm: 128, md: 180, lg: 256 }
const CARD_GAPS: Record<CardSize, number> = { sm: 8, md: 12, lg: 16 }
const CARD_GAP_CLASS: Record<CardSize, string> = {
  sm: 'gap-1 md:gap-2',
  md: 'gap-1.5 md:gap-3',
  lg: 'gap-2 md:gap-4',
}
const CARD_MOBILE_COLS: Record<CardSize, number> = { sm: 4, md: 3, lg: 2 }
const GRID_WIDTH_CLASS: Record<GridWidth, string> = {
  narrow: 'mx-auto max-w-[1100px]',
  wide: 'mx-auto max-w-[1500px]',
  full: '',
}

export default function GalleryPage() {
  const { slug } = useParams<{ slug?: string }>()
  const navigate = useNavigate()
  const { illustrations, loading, error } = useIllustrations()
  const { isFavorite, toggle, reset: resetFavorites, favorites } = useFavorites()
  const {
    download: downloadFavorites,
    progress: downloadProgress,
    error: downloadError,
  } = useBatchDownload(illustrations, favorites)

  const {
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
  } = useGalleryFilters()
  const sharedSlugs = (searchParams.get('s') ?? '').split(',').filter(Boolean)
  const isSharedView = sharedSlugs.length > 0

  // Display state persisted to localStorage
  const [isMobileLayout, setIsMobileLayout] = useState(() => window.innerWidth < 1024)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)')
    const fn = (e: MediaQueryListEvent) => setIsMobileLayout(e.matches)
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])

  const [cardSize, setCardSize] = useState<CardSize>('md')
  const [gridWidth, setGridWidth] = useState<GridWidth>('narrow')
  const [shuffledSlugs, setShuffledSlugs] = useState<string[] | null>(null)
  const [searchMaxWidth, setSearchMaxWidth] = useState<number | undefined>()
  const searchRef = useRef<HTMLInputElement>(null)
  const browseAllRef = useRef<HTMLButtonElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!loading && !slug && window.innerWidth >= 768) searchRef.current?.focus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]) // slug omitted intentionally — only focus on initial load, not on panel open/close

  // iOS Safari renders the caret at a stale position when a focused input is inside a
  // sticky+backdrop-blur container and the page scrolls. Blurring on touchmove fixes it.
  // Using touchmove (not scroll) so a tap on the input doesn't immediately blur it again.
  useEffect(() => {
    function onTouchMove() {
      if (document.activeElement === searchRef.current) searchRef.current?.blur()
    }
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    return () => window.removeEventListener('touchmove', onTouchMove)
  }, [])

  useEffect(() => {
    if (favoritesOnly && favorites.size === 0) browseAllRef.current?.focus()
  }, [favoritesOnly, favorites.size])

  function resetSearch() {
    clearFilters()
    setShuffledSlugs(null)
    searchRef.current?.focus()
  }

  const filters = {
    query,
    tags: selectedTags,
    tagsMode,
    accentColors: selectedAccentColors,
    accentColorsMode,
    favoritesOnly,
  }
  const results = useSearch(
    illustrations,
    filters,
    favorites,
    isSharedView ? sharedSlugs : undefined
  )
  const isFiltered = !!(
    query ||
    selectedTags.length > 0 ||
    selectedAccentColors.length > 0 ||
    favoritesOnly
  )

  const displayResults = shuffledSlugs
    ? [...results].sort((a, b) => {
        const ai = shuffledSlugs.indexOf(a.slug)
        const bi = shuffledSlugs.indexOf(b.slug)
        return (ai === -1 ? Infinity : ai) - (bi === -1 ? Infinity : bi)
      })
    : results

  const hasGridResults = displayResults.length > 0
  useEffect(() => {
    const el = gridRef.current
    if (!el || isMobileLayout) {
      setSearchMaxWidth(undefined)
      return
    }
    const update = () => {
      const cols = getComputedStyle(el).gridTemplateColumns.split(' ').length
      setSearchMaxWidth(cols * CARD_WIDTHS[cardSize] + (cols - 1) * CARD_GAPS[cardSize])
    }
    const ro = new ResizeObserver(update)
    ro.observe(el)
    update()
    return () => ro.disconnect()
  }, [isMobileLayout, cardSize, hasGridResults])

  function handleShuffle() {
    if (results.length === 0) return
    const shuffled = [...results].sort(() => Math.random() - 0.5)
    setShuffledSlugs(shuffled.map((i) => i.slug))
    navigate({ pathname: `/illustrations/${shuffled[0].slug}`, search: searchParams.toString() })
  }

  function handleSortAlphabetical() {
    setShuffledSlugs(null)
  }

  const activeIllustration = slug ? (illustrations.find((i) => i.slug === slug) ?? null) : null

  usePageMeta({
    title: activeIllustration ? `${SITE_TITLE} | ${activeIllustration.name}` : SITE_TITLE,
    description: activeIllustration
      ? `${activeIllustration.name} — a 3D clay render illustration from the Claybase collection.`
      : 'A curated library of AI-generated illustrations in a 3D clay render style, built on the Catppuccin Mocha color palette.',
    imageUrl: activeIllustration?.images.display,
    pageUrl: activeIllustration
      ? `${window.location.origin}/illustrations/${activeIllustration.slug}`
      : undefined,
  })

  const activeIndex = activeIllustration
    ? displayResults.findIndex((i) => i.slug === activeIllustration.slug)
    : -1
  const prevSlug = activeIndex > 0 ? displayResults[activeIndex - 1].slug : null
  const nextSlug =
    activeIndex !== -1 && activeIndex < displayResults.length - 1
      ? displayResults[activeIndex + 1].slug
      : null

  useGalleryKeyboard({
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
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-ctp-subtext0">
        {t.gallery.loading}
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-ctp-red">
        {t.gallery.error(error)}
      </div>
    )
  }

  return (
    <div className="px-2 md:px-4">
      <div className={`flex gap-6 min-h-[calc(100vh-3.5rem)] ${GRID_WIDTH_CLASS[gridWidth]}`}>
        <DisplaySidebar
          isFiltered={isFiltered}
          cardSize={cardSize}
          onCardSizeChange={setCardSize}
          gridWidth={gridWidth}
          onGridWidthChange={setGridWidth}
          isShuffled={!!shuffledSlugs}
          onShuffle={handleShuffle}
          onSortAlphabetical={handleSortAlphabetical}
          selectedTags={selectedTags}
          onTagsChange={setSelectedTags}
          tagsMode={tagsMode}
          onTagsModeChange={setTagsMode}
          selectedAccentColors={selectedAccentColors}
          onAccentColorsChange={setSelectedAccentColors}
          accentColorsMode={accentColorsMode}
          onAccentColorsModeChange={setAccentColorsMode}
          favoritesOnly={favoritesOnly}
          onFavoritesOnlyChange={setFavoritesOnly}
          isSharedView={isSharedView}
          favoritesCount={favorites.size}
          onResetFavorites={() => {
            resetFavorites()
            setFavoritesOnly(false)
          }}
          onDownloadFavorites={downloadFavorites}
          downloadProgress={downloadProgress}
          downloadError={downloadError}
          favorites={favorites}
          allIllustrations={illustrations}
        />

        <div className="flex-1 min-w-0 pb-3 md:pb-6">
          <div className="sticky top-14 z-10 bg-ctp-base/40 backdrop-blur-md pt-3 md:pt-6 pb-[5px] md:pb-5">
            <div className="flex items-center gap-3">
              <div
                style={
                  !isMobileLayout
                    ? {
                        maxWidth:
                          searchMaxWidth !== undefined ? Math.min(searchMaxWidth, 500) : 500,
                      }
                    : undefined
                }
                className="flex-1 min-w-0"
              >
                <GalleryControls
                  query={query}
                  onQueryChange={setQuery}
                  totalCount={illustrations.length}
                  resultCount={results.length}
                  isFiltered={isFiltered}
                  onResetFilters={resetSearch}
                  searchRef={searchRef}
                  favoritesOnly={favoritesOnly}
                  onFavoritesOnlyChange={setFavoritesOnly}
                  favoritesCount={favorites.size}
                />
              </div>
              {isFiltered ? (
                <button
                  onClick={resetSearch}
                  className="hidden md:inline-flex shrink-0 items-center gap-1.5 rounded-full border border-ctp-surface1 px-3 py-1 text-xs font-medium text-ctp-subtext1 hover:bg-ctp-surface1 hover:text-ctp-text transition-colors"
                >
                  <X size={11} />
                  <span className="text-ctp-overlay1 font-normal">
                    {results.length}/{illustrations.length}
                  </span>
                  {t.controls.clearFilters}
                </button>
              ) : (
                <span className="hidden md:inline-flex shrink-0 items-center rounded-full border border-transparent px-3 py-1 text-xs text-ctp-subtext0">
                  {t.controls.showingAll(illustrations.length)}
                </span>
              )}
            </div>
          </div>
          {isSharedView && (
            <div
              style={
                !isMobileLayout
                  ? { maxWidth: searchMaxWidth !== undefined ? Math.min(searchMaxWidth, 800) : 800 }
                  : undefined
              }
            >
              <div className="flex items-center gap-3 mb-4 px-2 py-2 rounded-lg border border-accent/30 bg-accent/5 text-sm text-ctp-subtext1">
                <div className="shrink-0">
                  {sharedSlugs.every((s) => favorites.has(s)) ? (
                    <span className="flex items-center gap-1 text-xs text-ctp-overlay1">
                      <Heart size={11} fill="currentColor" />
                      {t.gallery.allSaved}
                    </span>
                  ) : (
                    <button
                      onClick={() =>
                        sharedSlugs.forEach((s) => {
                          if (!favorites.has(s)) toggle(s)
                        })
                      }
                      className="flex items-center gap-1 text-xs text-accent hover:opacity-80 transition-opacity"
                    >
                      <Heart size={11} />
                      {t.gallery.saveAll}
                    </button>
                  )}
                </div>
                <span className="flex-1 text-center">
                  <span className="sm:hidden">
                    {t.gallery.sharedCollectionShort(sharedSlugs.length)}
                  </span>
                  <span className="hidden sm:inline">
                    {t.gallery.sharedCollection(sharedSlugs.length)}
                  </span>
                </span>
                <button
                  onClick={() => {
                    const next = new URLSearchParams(searchParams)
                    next.delete('s')
                    setSearchParams(next, { replace: true })
                  }}
                  className="flex items-center gap-1 text-xs text-ctp-overlay1 hover:text-ctp-text transition-colors shrink-0"
                >
                  <X size={11} />
                  {t.gallery.exitSharedView}
                </button>
              </div>
            </div>
          )}
          {displayResults.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 md:py-24 text-ctp-subtext0 gap-2">
              <img
                src={
                  favoritesOnly && favorites.size === 0
                    ? '/ui/no_favorites_yet.jpg'
                    : '/ui/no_search_result.jpg'
                }
                alt=""
                className="w-32 h-32 object-cover mix-blend-lighten opacity-40 [mask-image:linear-gradient(to_right,transparent,black_18%,black_82%,transparent),linear-gradient(to_bottom,transparent,black_18%,black_82%,transparent)] [mask-composite:intersect]"
              />
              <p className="text-sm text-center max-w-xs px-4">
                {favoritesOnly && favorites.size === 0
                  ? t.gallery.noFavorites
                  : t.gallery.noResults}
              </p>
              {favoritesOnly && favorites.size === 0 ? (
                <button
                  ref={browseAllRef}
                  onClick={() => {
                    setFavoritesOnly(false)
                    searchRef.current?.focus()
                  }}
                  className="mt-3 flex items-center gap-1.5 rounded-lg border border-ctp-surface1 px-3 py-1.5 text-sm text-ctp-subtext1 hover:bg-ctp-surface1 hover:text-ctp-text transition-colors"
                >
                  {t.gallery.browseAll}
                </button>
              ) : (
                <button
                  onClick={resetSearch}
                  className="mt-3 flex items-center gap-1.5 rounded-lg border border-ctp-surface1 px-3 py-1.5 text-sm text-ctp-subtext1 hover:bg-ctp-surface1 hover:text-ctp-text transition-colors"
                >
                  {t.gallery.resetSearch}
                </button>
              )}
            </div>
          ) : (
            <div
              ref={gridRef}
              className={`grid pt-0.5 ${CARD_GAP_CLASS[cardSize]}`}
              style={{
                gridTemplateColumns: (() => {
                  if (!isMobileLayout) return `repeat(auto-fill, ${CARD_WIDTHS[cardSize]}px)`
                  const cols = CARD_MOBILE_COLS[cardSize]
                  const mobileCap = `calc(${(100 / cols).toFixed(4)}% - ${((CARD_GAPS[cardSize] * (cols - 1)) / cols).toFixed(2)}px)`
                  return `repeat(auto-fill, minmax(min(${CARD_WIDTHS[cardSize]}px, ${mobileCap}), 1fr))`
                })(),
              }}
            >
              {displayResults.map((illustration) => (
                <IllustrationCard
                  key={illustration.slug}
                  illustration={illustration}
                  isFavorite={isFavorite(illustration.slug)}
                  onToggleFavorite={() => toggle(illustration.slug)}
                  isActive={illustration.slug === activeIllustration?.slug}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {activeIllustration && (
        <DetailPanel
          illustration={activeIllustration}
          isFavorite={isFavorite(activeIllustration.slug)}
          onToggleFavorite={() => {
            if (favoritesOnly) {
              const target = prevSlug ?? nextSlug
              navigate({
                pathname: target ? `/illustrations/${target}` : '/',
                search: searchParams.toString(),
              })
            }
            toggle(activeIllustration.slug)
          }}
          onClose={() => navigate({ pathname: '/', search: searchParams.toString() })}
          prevSlug={prevSlug}
          nextSlug={nextSlug}
          onNavigate={(s) =>
            navigate({ pathname: `/illustrations/${s}`, search: searchParams.toString() })
          }
          onRandom={() => {
            const others = displayResults.filter((i) => i.slug !== activeIllustration?.slug)
            if (others.length === 0) return
            const pick = others[Math.floor(Math.random() * others.length)]
            navigate({ pathname: `/illustrations/${pick.slug}`, search: searchParams.toString() })
          }}
          selectedTags={selectedTags}
          onTagClick={(tag) =>
            setSelectedTags(
              selectedTags.includes(tag)
                ? selectedTags.filter((t) => t !== tag)
                : [...selectedTags, tag]
            )
          }
          selectedAccentColors={selectedAccentColors}
          onAccentColorClick={(c) =>
            setSelectedAccentColors(
              selectedAccentColors.includes(c)
                ? selectedAccentColors.filter((x) => x !== c)
                : [...selectedAccentColors, c]
            )
          }
        />
      )}
    </div>
  )
}
