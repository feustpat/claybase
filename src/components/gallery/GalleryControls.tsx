import { X, ListFilter, Heart } from 'lucide-react'
import { useSidebar } from '@/context/SidebarContext'
import { strings as t } from '@/locales/en'

interface Props {
  query: string
  onQueryChange: (q: string) => void
  totalCount: number
  resultCount: number
  isFiltered: boolean
  onResetFilters: () => void
  searchRef?: React.RefObject<HTMLInputElement>
  favoritesOnly: boolean
  onFavoritesOnlyChange: (v: boolean) => void
  favoritesCount: number
}

export default function GalleryControls({
  query,
  onQueryChange,
  totalCount,
  resultCount,
  isFiltered,
  onResetFilters,
  searchRef,
  favoritesOnly,
  onFavoritesOnlyChange,
  favoritesCount,
}: Props) {
  const { toggleSidebar } = useSidebar()

  return (
    <div className="flex flex-col gap-2">
      {/* Row 1: sidebar toggle + search */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative shrink-0 lg:hidden">
          <button
            onClick={toggleSidebar}
            aria-label={t.controls.openFilters}
            className="h-10 w-10 md:h-9 md:w-9 flex items-center justify-center rounded-lg border border-ctp-surface1 text-ctp-subtext1 hover:bg-ctp-surface1 hover:text-ctp-text transition-colors"
          >
            <ListFilter size={15} />
          </button>
          {isFiltered && (
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-accent pointer-events-none" />
          )}
        </div>
        <div className="relative flex-1">
          <kbd className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none items-center rounded border border-ctp-surface2 px-2 py-0.5 text-xs leading-none text-ctp-overlay0 font-sans">
            /
          </kbd>
          <input
            ref={searchRef}
            type="search"
            placeholder={t.controls.searchPlaceholder}
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                onQueryChange('')
                ;(e.target as HTMLInputElement).blur()
              }
            }}
            className={`
              w-full rounded-lg border border-ctp-surface1 bg-ctp-surface0
              pl-3 md:pl-10 py-2 text-base md:text-sm text-ctp-text placeholder:text-ctp-overlay0
              focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
              [&::-webkit-search-cancel-button]:hidden
              ${query ? 'pr-9' : 'pr-4'}
            `}
          />
          {query && (
            <button
              onClick={() => {
                onQueryChange('')
                searchRef?.current?.focus()
              }}
              aria-label={t.controls.clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ctp-overlay0 hover:text-ctp-subtext1 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Row 2: mobile only — always in flow to prevent grid jump */}
      <div className="md:hidden flex items-center justify-end gap-2">
        {isFiltered ? (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-1.5 rounded-full border border-ctp-surface1 px-3 py-1 text-xs font-medium text-ctp-subtext1 hover:bg-ctp-surface1 hover:text-ctp-text transition-colors"
          >
            <X size={11} />
            <span className="text-ctp-overlay1 font-normal">
              {resultCount}/{totalCount}
            </span>
            {t.controls.clearFilters}
          </button>
        ) : (
          <span className="inline-flex items-center rounded-full border border-transparent pl-0 pr-3 py-1 text-xs text-ctp-subtext0">
            {t.controls.showingAll(totalCount)}
          </span>
        )}
        <button
          onClick={() => onFavoritesOnlyChange(!favoritesOnly)}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
            favoritesOnly
              ? 'border-accent/40 bg-accent/10 text-accent hover:bg-accent/20'
              : 'border-ctp-surface1 text-ctp-subtext1 hover:bg-ctp-surface1 hover:text-ctp-text'
          }`}
        >
          <Heart size={11} fill={favoritesOnly ? 'currentColor' : 'none'} />
          {t.sidebar.favorites(favoritesCount)}
        </button>
      </div>
    </div>
  )
}
