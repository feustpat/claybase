import { useState, useEffect, useRef } from 'react'
import {
  Heart,
  ChevronDown,
  ChevronsLeft,
  ListFilter,
  Undo2,
  Trash2,
  RefreshCw,
  Download,
  Share2,
  Check,
  Link,
} from 'lucide-react'
import TagPill from '@/components/ui/TagPill'
import AccentColorPill from '@/components/ui/AccentColorPill'
import { useSidebar } from '@/context/SidebarContext'
import type { CardSize, GridWidth } from '@/pages/GalleryPage'
import type { FilterMode } from '@/hooks/useSearch'
import type { BatchDownloadError } from '@/hooks/useBatchDownload'
import type { Illustration } from '@/types/illustration'
import { strings as t } from '@/locales/en'
import { getTagLabel, isTagHidden } from '@/locales/tag-names'

interface Props {
  isFiltered: boolean
  cardSize: CardSize
  onCardSizeChange: (s: CardSize) => void
  gridWidth: GridWidth
  onGridWidthChange: (v: GridWidth) => void
  isShuffled: boolean
  onShuffle: () => void
  onSortAlphabetical: () => void
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
  tagsMode: FilterMode
  onTagsModeChange: (m: FilterMode) => void
  selectedAccentColors: string[]
  onAccentColorsChange: (colors: string[]) => void
  accentColorsMode: FilterMode
  onAccentColorsModeChange: (m: FilterMode) => void
  favoritesOnly: boolean
  onFavoritesOnlyChange: (v: boolean) => void
  isSharedView: boolean
  favoritesCount: number
  onResetFavorites: () => void
  onDownloadFavorites: () => void
  downloadProgress: { done: number; total: number } | null
  downloadError: BatchDownloadError | null
  favorites: Set<string>
  allIllustrations: Illustration[]
}

export default function DisplaySidebar({
  isFiltered,
  cardSize,
  onCardSizeChange,
  gridWidth,
  onGridWidthChange,
  isShuffled,
  onShuffle,
  onSortAlphabetical,
  selectedTags,
  onTagsChange,
  tagsMode,
  onTagsModeChange,
  selectedAccentColors,
  onAccentColorsChange,
  accentColorsMode,
  onAccentColorsModeChange,
  favoritesOnly,
  onFavoritesOnlyChange,
  isSharedView,
  favoritesCount,
  onResetFavorites,
  onDownloadFavorites,
  downloadProgress,
  downloadError,
  favorites,
  allIllustrations,
}: Props) {
  const { sidebarOpen: isOpen, toggleSidebar } = useSidebar()
  const CARD_SIZES: { value: CardSize; label: string }[] = [
    { value: 'sm', label: t.sidebar.small },
    { value: 'md', label: t.sidebar.medium },
    { value: 'lg', label: t.sidebar.large },
  ]
  const isOpenRef = useRef(isOpen)
  isOpenRef.current = isOpen
  const toggleSidebarRef = useRef(toggleSidebar)
  toggleSidebarRef.current = toggleSidebar
  const [confirmingReset, setConfirmingReset] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [shareLinkCopied, setShareLinkCopied] = useState(false)
  const [favoritesOpen, setFavoritesOpen] = useState(
    () => localStorage.getItem('ui-section-favorites') !== 'false'
  )
  const isDisplayModified = cardSize !== 'md' || gridWidth !== 'narrow' || isShuffled
  const [tagsOpen, setTagsOpen] = useState(
    () => localStorage.getItem('ui-section-tags') !== 'false'
  )
  const [accentColorsOpen, setAccentColorsOpen] = useState(
    () => localStorage.getItem('ui-section-colors') !== 'false'
  )
  const [displayOptionsOpen, setDisplayOptionsOpen] = useState(
    () => localStorage.getItem('ui-section-display') !== 'false'
  )

  function toggleSection(key: string, setter: React.Dispatch<React.SetStateAction<boolean>>) {
    setter((o) => {
      const n = !o
      localStorage.setItem(key, String(n))
      return n
    })
  }
  const allTags = [...new Set(allIllustrations.flatMap((i) => i.tags))].sort()
  const allAccentColors = [...new Set(allIllustrations.flatMap((i) => i.accentColors))].sort()
  const tagCounts = Object.fromEntries(
    allTags.map((tag) => [tag, allIllustrations.filter((i) => i.tags.includes(tag)).length])
  )
  const accentColorCounts = Object.fromEntries(
    allAccentColors.map((c) => [
      c,
      allIllustrations.filter((i) => i.accentColors.includes(c)).length,
    ])
  )

  useEffect(() => {
    if (!isOpen || window.matchMedia('(min-width: 1024px)').matches) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    const SWIPE_MIN = 50
    let startX = 0
    let startY = 0

    function onTouchStart(e: TouchEvent) {
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
    }

    function onTouchEnd(e: TouchEvent) {
      const dx = e.changedTouches[0].clientX - startX
      const dy = e.changedTouches[0].clientY - startY
      if (Math.abs(dx) < SWIPE_MIN || Math.abs(dx) < Math.abs(dy)) return
      if (window.matchMedia('(min-width: 1024px)').matches) return
      if (dx < 0 && isOpenRef.current && startX < 300) toggleSidebarRef.current()
    }

    document.addEventListener('touchstart', onTouchStart, { passive: true })
    document.addEventListener('touchend', onTouchEnd, { passive: true })
    return () => {
      document.removeEventListener('touchstart', onTouchStart)
      document.removeEventListener('touchend', onTouchEnd)
    }
  }, [])

  useEffect(() => {
    if (!confirmingReset) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setConfirmingReset(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [confirmingReset])

  function toggleTag(tag: string) {
    onTagsChange(
      selectedTags.includes(tag) ? selectedTags.filter((t) => t !== tag) : [...selectedTags, tag]
    )
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 top-14 z-[55] bg-ctp-crust/60 lg:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
      <div
        className={`shrink-0 fixed top-14 left-0 z-[60] lg:sticky lg:z-auto flex flex-col bg-ctp-base border-r border-ctp-surface0 h-[calc(100vh-3.5rem)] overflow-hidden transition-[transform,width] duration-100 ease-in-out w-[300px] ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} ${isOpen ? 'lg:w-[300px]' : 'lg:w-11'}`}
      >
        {/* Single toggle button — always at top, position never changes */}
        <div className="shrink-0 flex justify-end pt-2 pr-1">
          <button
            onClick={toggleSidebar}
            aria-label={isOpen ? t.sidebar.collapse : t.sidebar.expand}
            title={isOpen ? t.sidebar.collapse : t.sidebar.expand}
            className="h-10 w-10 flex items-center justify-center rounded-md text-ctp-subtext1 hover:bg-ctp-surface0 hover:text-ctp-text transition-colors"
          >
            {isOpen ? <ChevronsLeft size={16} /> : <ListFilter size={16} />}
          </button>
          {!isOpen && isFiltered && (
            <span className="absolute top-2 right-1 w-1.5 h-1.5 rounded-full bg-accent" />
          )}
        </div>

        <aside
          className={`flex-1 flex flex-col gap-8 pl-4 lg:pl-0 pr-4 overflow-y-scroll pb-6 pt-4 transition-opacity duration-75 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        >
          <Section
            title={t.sidebar.favorites(favoritesCount)}
            onToggle={() => toggleSection('ui-section-favorites', setFavoritesOpen)}
            isCollapsed={!favoritesOpen}
          >
            <div className="flex flex-col">
              <button
                onClick={() => onFavoritesOnlyChange(!favoritesOnly)}
                disabled={isSharedView}
                className={`flex items-center gap-2 w-full text-left rounded-md border px-2.5 py-1.5 text-sm transition-colors disabled:opacity-40 disabled:pointer-events-none ${
                  favoritesOnly
                    ? 'border-accent text-accent'
                    : 'border-ctp-surface1 text-ctp-subtext1 hover:border-ctp-surface2 hover:text-ctp-text'
                }`}
              >
                <Heart size={13} fill={favoritesOnly ? 'currentColor' : 'none'} />
                {t.sidebar.showFavoritesOnly}
              </button>
              <div
                className={`grid transition-[grid-template-rows] duration-200 ease-in-out ${
                  favoritesCount > 0 ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="flex flex-col gap-2 pt-2">
                    <button
                      onClick={() => setConfirmingReset(true)}
                      className="flex items-center gap-2 w-full text-left rounded-md border border-ctp-surface1 px-2.5 py-1.5 text-sm text-ctp-subtext1 transition-colors hover:border-ctp-red/50 hover:text-ctp-red"
                    >
                      <Trash2 size={13} />
                      {t.sidebar.removeFavorites}
                    </button>
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={onDownloadFavorites}
                        disabled={!!downloadProgress || favoritesCount > 30}
                        className="flex items-center gap-2 w-full text-left rounded-md border border-ctp-surface1 px-2.5 py-1.5 text-sm text-ctp-subtext1 transition-colors hover:border-ctp-surface2 hover:text-ctp-text disabled:opacity-50 disabled:pointer-events-none"
                      >
                        <Download size={13} />
                        {downloadProgress
                          ? downloadProgress.done > 0
                            ? t.sidebar.downloading(downloadProgress.done, downloadProgress.total)
                            : t.sidebar.downloadingStart
                          : t.sidebar.downloadFavorites}
                      </button>
                      {favoritesCount > 30 && (
                        <p className="text-xs text-ctp-overlay0 px-0.5">
                          {t.sidebar.downloadLimit}
                        </p>
                      )}
                      {downloadError && (
                        <p className="text-xs text-ctp-red px-0.5">
                          {downloadError.kind === 'all'
                            ? t.sidebar.downloadFailed
                            : t.sidebar.downloadPartial(downloadError.failed, downloadError.total)}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => setShowShareDialog(true)}
                        disabled={favoritesCount > 30}
                        className="flex items-center gap-2 w-full text-left rounded-md border border-ctp-surface1 px-2.5 py-1.5 text-sm text-ctp-subtext1 transition-colors hover:border-ctp-surface2 hover:text-ctp-text disabled:opacity-50 disabled:pointer-events-none"
                      >
                        <Share2 size={13} />
                        {t.sidebar.shareFavorites}
                      </button>
                      {favoritesCount > 30 && (
                        <p className="text-xs text-ctp-overlay0 px-0.5">{t.sidebar.shareLimit}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {allTags.length > 0 && (
            <Section
              title={t.sidebar.tags(selectedTags.length)}
              onToggle={() => toggleSection('ui-section-tags', setTagsOpen)}
              isCollapsed={!tagsOpen}
              action={
                <button
                  onClick={() => onTagsChange([])}
                  aria-label={t.sidebar.resetTagFilter}
                  className={`flex items-center justify-center rounded-full p-2 -translate-y-0.5 text-ctp-overlay1 hover:bg-ctp-surface1 hover:text-ctp-text transition-colors ${
                    selectedTags.length === 0 ? 'invisible pointer-events-none' : ''
                  }`}
                >
                  <Undo2 size={13} />
                </button>
              }
            >
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap gap-1.5">
                  {allTags
                    .filter((tag) => !isTagHidden(tag))
                    .map((tag) => (
                      <TagPill
                        key={tag}
                        label={getTagLabel(tag)}
                        active={selectedTags.includes(tag)}
                        onClick={() => toggleTag(tag)}
                        count={tagCounts[tag]}
                      />
                    ))}
                </div>
                <div
                  className={`grid transition-[grid-template-rows] duration-200 ease-in-out ${
                    selectedTags.length >= 2 ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="flex flex-col gap-1.5 pt-2">
                      <SegmentGroup>
                        <Segment
                          active={tagsMode === 'any'}
                          onClick={() => onTagsModeChange('any')}
                        >
                          {t.sidebar.or}
                        </Segment>
                        <Segment
                          active={tagsMode === 'all'}
                          onClick={() => onTagsModeChange('all')}
                        >
                          {t.sidebar.and}
                        </Segment>
                      </SegmentGroup>
                      <p className="text-xs text-ctp-overlay0 px-0.5">
                        {tagsMode === 'all' ? t.sidebar.tagHintAll : t.sidebar.tagHintAny}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Section>
          )}

          {allAccentColors.length > 0 && (
            <Section
              title={t.sidebar.accentColors(selectedAccentColors.length)}
              onToggle={() => toggleSection('ui-section-colors', setAccentColorsOpen)}
              isCollapsed={!accentColorsOpen}
              action={
                <button
                  onClick={() => onAccentColorsChange([])}
                  aria-label={t.sidebar.resetColorFilter}
                  className={`flex items-center justify-center rounded-full p-2 -translate-y-0.5 text-ctp-overlay1 hover:bg-ctp-surface1 hover:text-ctp-text transition-colors ${
                    selectedAccentColors.length === 0 ? 'invisible pointer-events-none' : ''
                  }`}
                >
                  <Undo2 size={13} />
                </button>
              }
            >
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap gap-1.5">
                  {allAccentColors.map((c) => (
                    <AccentColorPill
                      key={c}
                      label={c}
                      active={selectedAccentColors.includes(c)}
                      onClick={() =>
                        onAccentColorsChange(
                          selectedAccentColors.includes(c)
                            ? selectedAccentColors.filter((x) => x !== c)
                            : [...selectedAccentColors, c]
                        )
                      }
                      count={accentColorCounts[c]}
                    />
                  ))}
                </div>
                <div
                  className={`grid transition-[grid-template-rows] duration-200 ease-in-out ${
                    selectedAccentColors.length >= 2 ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="flex flex-col gap-1.5 pt-2">
                      <SegmentGroup>
                        <Segment
                          active={accentColorsMode === 'any'}
                          onClick={() => onAccentColorsModeChange('any')}
                        >
                          {t.sidebar.or}
                        </Segment>
                        <Segment
                          active={accentColorsMode === 'all'}
                          onClick={() => onAccentColorsModeChange('all')}
                        >
                          {t.sidebar.and}
                        </Segment>
                      </SegmentGroup>
                      <p className="text-xs text-ctp-overlay0 px-0.5">
                        {accentColorsMode === 'all'
                          ? t.sidebar.colorHintAll
                          : t.sidebar.colorHintAny}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Section>
          )}

          <Section
            title={t.sidebar.displayOptions}
            onToggle={() => toggleSection('ui-section-display', setDisplayOptionsOpen)}
            isCollapsed={!displayOptionsOpen}
            action={
              <button
                onClick={() => {
                  onCardSizeChange('md')
                  onGridWidthChange('narrow')
                  onSortAlphabetical()
                }}
                aria-label={t.sidebar.resetDisplayOptions}
                className={`flex items-center justify-center rounded-full p-2 -translate-y-0.5 text-ctp-overlay1 hover:bg-ctp-surface1 hover:text-ctp-text transition-colors ${
                  isDisplayModified ? '' : 'invisible pointer-events-none'
                }`}
              >
                <Undo2 size={13} />
              </button>
            }
          >
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-ctp-subtext0">{t.sidebar.sorting}</span>
                <SegmentGroup>
                  <Segment active={!isShuffled} onClick={onSortAlphabetical}>
                    {t.sidebar.alphabetical}
                  </Segment>
                  <Segment active={isShuffled} onClick={onShuffle}>
                    <span className="inline-flex items-center justify-center gap-1">
                      {t.sidebar.random}
                      {isShuffled && <RefreshCw size={10} />}
                    </span>
                  </Segment>
                </SegmentGroup>
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-xs text-ctp-subtext0">{t.sidebar.cardSize}</span>
                <SegmentGroup>
                  {CARD_SIZES.map(({ value, label }) => (
                    <Segment
                      key={value}
                      active={cardSize === value}
                      onClick={() => onCardSizeChange(value)}
                    >
                      {label}
                    </Segment>
                  ))}
                </SegmentGroup>
              </div>
              <div className="hidden lg:flex flex-col gap-1.5">
                <span className="text-xs text-ctp-subtext0">{t.sidebar.gridWidth}</span>
                <SegmentGroup>
                  <Segment
                    active={gridWidth === 'narrow'}
                    onClick={() => onGridWidthChange('narrow')}
                  >
                    {t.sidebar.narrow}
                  </Segment>
                  <Segment active={gridWidth === 'wide'} onClick={() => onGridWidthChange('wide')}>
                    {t.sidebar.wide}
                  </Segment>
                  <Segment active={gridWidth === 'full'} onClick={() => onGridWidthChange('full')}>
                    {t.sidebar.full}
                  </Segment>
                </SegmentGroup>
              </div>
            </div>
          </Section>
        </aside>
      </div>

      {showShareDialog && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-ctp-crust/70 backdrop-blur-sm"
          onClick={() => setShowShareDialog(false)}
        >
          <div
            className="bg-ctp-mantle border border-ctp-surface0 rounded-xl shadow-2xl p-6 w-80 flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-semibold text-ctp-text">
                {t.sidebar.shareTitle(favoritesCount)}
              </h3>
              <p className="text-sm text-ctp-subtext1 leading-relaxed">{t.sidebar.shareBody}</p>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowShareDialog(false)
                  setShareLinkCopied(false)
                }}
                className="px-3 py-1.5 text-sm rounded-md border border-ctp-surface1 text-ctp-subtext1 hover:bg-ctp-surface1 hover:text-ctp-text transition-colors"
              >
                {t.sidebar.cancel}
              </button>
              <button
                onClick={async () => {
                  const slugs = [...favorites].slice(0, 30).join(',')
                  const url = new URL(window.location.origin)
                  url.searchParams.set('s', slugs)
                  await navigator.clipboard.writeText(url.toString())
                  setShareLinkCopied(true)
                  setTimeout(() => {
                    setShareLinkCopied(false)
                    setShowShareDialog(false)
                  }, 1500)
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border border-ctp-surface1 bg-ctp-surface0 text-ctp-text hover:bg-ctp-surface1 transition-colors"
              >
                {shareLinkCopied ? <Check size={13} /> : <Link size={13} />}
                {shareLinkCopied ? t.sidebar.shareCopied : t.sidebar.shareCopyLink}
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmingReset && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-ctp-crust/70 backdrop-blur-sm"
          onClick={() => setConfirmingReset(false)}
        >
          <div
            className="bg-ctp-mantle border border-ctp-surface0 rounded-xl shadow-2xl p-6 w-80 flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-1">
              <h3 className="text-base font-semibold text-ctp-text">{t.sidebar.confirmTitle}</h3>
              <p className="text-sm text-ctp-subtext1 leading-relaxed">
                {t.sidebar.confirmBody(favoritesCount)}
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmingReset(false)}
                className="px-3 py-1.5 text-sm rounded-md border border-ctp-surface1 text-ctp-subtext1 hover:bg-ctp-surface1 hover:text-ctp-text transition-colors"
              >
                {t.sidebar.cancel}
              </button>
              <button
                onClick={() => {
                  onResetFavorites()
                  setConfirmingReset(false)
                }}
                className="px-3 py-1.5 text-sm rounded-md border border-ctp-surface1 bg-ctp-surface0 text-ctp-text hover:bg-ctp-surface1 transition-colors"
              >
                {t.sidebar.removeAll}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function Section({
  title,
  action,
  onToggle,
  isCollapsed,
  children,
}: {
  title: string
  action?: React.ReactNode
  onToggle?: () => void
  isCollapsed?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center">
        {onToggle ? (
          <button
            onClick={onToggle}
            className="flex-1 flex items-center gap-1 text-sm font-semibold uppercase tracking-wider text-ctp-subtext0 hover:text-ctp-subtext1 transition-colors"
          >
            <ChevronDown
              size={13}
              className={`shrink-0 transition-transform duration-300 ${isCollapsed ? '-rotate-90' : ''}`}
            />
            {title}
          </button>
        ) : (
          <span className="flex-1 text-sm font-semibold uppercase tracking-wider text-ctp-subtext0">
            {title}
          </span>
        )}
        {action}
      </div>
      {!isCollapsed && children}
    </div>
  )
}

function SegmentGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex w-full divide-x divide-ctp-surface1 rounded-lg border border-ctp-surface1 overflow-hidden">
      {children}
    </div>
  )
}

function Segment({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 px-2 py-1.5 text-xs transition-colors ${
        active
          ? 'bg-ctp-surface1 text-ctp-text'
          : 'bg-ctp-surface0 text-ctp-subtext0 hover:bg-ctp-surface1/60 hover:text-ctp-text'
      }`}
    >
      {children}
    </button>
  )
}
