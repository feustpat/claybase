import { useEffect, useRef, useState } from 'react'
import { X, ChevronLeft, ChevronRight, Shuffle, ChevronDown, Copy, Check } from 'lucide-react'
import TagPill from '@/components/ui/TagPill'
import AccentColorPill from '@/components/ui/AccentColorPill'
import type { Illustration } from '@/types/illustration'
import ActionBar from './ActionBar'
import { strings as t } from '@/locales/en'
import { getTagLabel, isTagHidden } from '@/locales/tag-names'

interface Props {
  illustration: Illustration
  isFavorite: boolean
  onToggleFavorite: () => void
  onClose: () => void
  prevSlug: string | null
  nextSlug: string | null
  onNavigate: (slug: string) => void
  onRandom: () => void
  selectedTags: string[]
  onTagClick: (tag: string) => void
  selectedAccentColors: string[]
  onAccentColorClick: (color: string) => void
}

export default function DetailPanel({
  illustration,
  isFavorite,
  onToggleFavorite,
  onClose,
  prevSlug,
  nextSlug,
  onNavigate,
  onRandom,
  selectedTags,
  onTagClick,
  selectedAccentColors,
  onAccentColorClick,
}: Props) {
  const panelRef = useRef<HTMLElement>(null)
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose
  const [imgLoaded, setImgLoaded] = useState(false)
  const [promptOpen, setPromptOpen] = useState(false)
  const [promptCopied, setPromptCopied] = useState(false)
  useEffect(() => {
    setImgLoaded(false)
    setPromptOpen(false)
    setPromptCopied(false)
  }, [illustration.slug])

  const touchStartX = useRef(0)
  const touchStartY = useRef(0)
  function onImgTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }
  function onImgTouchEnd(e: React.TouchEvent) {
    const dx = e.changedTouches[0].clientX - touchStartX.current
    const dy = e.changedTouches[0].clientY - touchStartY.current
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy)) return
    if (dx < 0 && nextSlug) onNavigate(nextSlug)
    else if (dx > 0 && prevSlug) onNavigate(prevSlug)
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      const target = e.target as Element
      if (target.closest('[data-illustration-card]')) return
      if (!panelRef.current?.contains(target)) onCloseRef.current()
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  return (
    <aside
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label={illustration.name}
      className="fixed right-0 top-14 z-50 h-[calc(100vh-3.5rem)] w-full max-w-md bg-ctp-mantle border-l border-t border-ctp-surface0 shadow-2xl overflow-y-auto flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-ctp-surface0 shrink-0">
        <h2 className="flex-1 text-lg font-semibold text-ctp-text truncate">{illustration.name}</h2>
        <button
          onClick={onClose}
          aria-label={t.detail.close}
          className="shrink-0 flex items-center justify-center h-8 w-8 rounded-lg text-ctp-subtext1 hover:bg-ctp-surface0 hover:text-ctp-text transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      {/* Image */}
      <div
        className="px-5 pt-5"
        onTouchStart={onImgTouchStart}
        onTouchEnd={onImgTouchEnd}
        style={{ touchAction: 'pan-y' }}
      >
        <div className="aspect-square w-full overflow-hidden rounded-xl bg-ctp-base">
          <img
            src={illustration.images.display}
            alt={illustration.name}
            ref={(el) => {
              if (el?.complete) setImgLoaded(true)
            }}
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        </div>
      </div>

      {/* Metadata + actions */}
      <div className="flex flex-col gap-4 px-5 py-5 flex-1">
        <ActionBar
          illustration={illustration}
          isFavorite={isFavorite}
          onToggleFavorite={onToggleFavorite}
        />

        {illustration.aliases.length > 0 && (
          <MetaRow label={t.detail.alsoKnownAs}>
            <p className="text-sm text-ctp-subtext1">{illustration.aliases.join(', ')}</p>
          </MetaRow>
        )}

        {illustration.tags.filter((tag) => !isTagHidden(tag)).length > 0 && (
          <MetaRow label={t.detail.tags}>
            <div className="flex flex-wrap gap-1.5">
              {illustration.tags
                .filter((tag) => !isTagHidden(tag))
                .map((tag) => (
                  <TagPill
                    key={tag}
                    label={getTagLabel(tag)}
                    active={selectedTags.includes(tag)}
                    onClick={() => onTagClick(tag)}
                  />
                ))}
            </div>
          </MetaRow>
        )}

        {illustration.accentColors.length > 0 && (
          <MetaRow label={t.detail.accentColors}>
            <div className="flex flex-wrap gap-1.5">
              {illustration.accentColors.map((c) => (
                <AccentColorPill
                  key={c}
                  label={c}
                  active={selectedAccentColors.includes(c)}
                  onClick={() => onAccentColorClick(c)}
                />
              ))}
            </div>
          </MetaRow>
        )}

        <MetaRow label={`${t.detail.style} & ${t.detail.colorScheme}`}>
          <MetaValue>
            {illustration.style} · {illustration.colorScheme}
          </MetaValue>
        </MetaRow>

        {illustration.prompt && (
          <div className="flex flex-col gap-1">
            <button
              onClick={() => setPromptOpen((o) => !o)}
              className="flex items-center gap-1 w-fit text-xs font-medium uppercase tracking-wide text-ctp-overlay1 hover:text-ctp-subtext1 transition-colors"
            >
              {t.detail.prompt}
              <span className="normal-case font-normal tracking-normal text-ctp-overlay0">
                ({illustration.model})
              </span>
              <ChevronDown
                size={12}
                className={`transition-transform duration-200 ${promptOpen ? '' : '-rotate-90'}`}
              />
            </button>
            <div
              className={`grid transition-[grid-template-rows] duration-200 ease-in-out ${promptOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
            >
              <div className="overflow-hidden">
                <div className="relative mt-1">
                  <p className="text-xs text-ctp-subtext0 font-mono leading-relaxed bg-ctp-surface0 rounded-lg p-3 pr-8">
                    {illustration.prompt}
                  </p>
                  <button
                    onClick={async () => {
                      await navigator.clipboard.writeText(illustration.prompt!)
                      setPromptCopied(true)
                      setTimeout(() => setPromptCopied(false), 1500)
                    }}
                    aria-label={promptCopied ? t.detail.copied : t.detail.copyLink}
                    className="absolute top-2 right-2 p-1 rounded text-ctp-overlay0 hover:text-ctp-subtext1 hover:bg-ctp-surface1 transition-colors"
                  >
                    {promptCopied ? <Check size={12} /> : <Copy size={12} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {illustration.body && (
          <div className="prose prose-sm prose-invert max-w-none text-ctp-subtext1 border-t border-ctp-surface0 pt-4">
            <p className="whitespace-pre-wrap text-sm">{illustration.body}</p>
          </div>
        )}
      </div>

      {/* Prev / Next footer */}
      <div className="sticky bottom-0 flex gap-2 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] border-t border-ctp-surface0 bg-ctp-mantle shrink-0">
        <button
          onClick={() => prevSlug && onNavigate(prevSlug)}
          disabled={!prevSlug}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-ctp-surface1 px-3 py-1.5 text-sm text-ctp-subtext1 hover:bg-ctp-surface1 hover:text-ctp-text transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-ctp-subtext1"
        >
          <ChevronLeft size={14} /> {t.detail.previous}
        </button>
        <button
          onClick={onRandom}
          className="shrink-0 flex items-center justify-center gap-1.5 rounded-lg border border-ctp-surface1 px-3 py-1.5 text-sm text-ctp-subtext1 hover:bg-ctp-surface1 hover:text-ctp-text transition-colors"
        >
          <Shuffle size={14} /> {t.detail.random}
        </button>
        <button
          onClick={() => nextSlug && onNavigate(nextSlug)}
          disabled={!nextSlug}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-ctp-surface1 px-3 py-1.5 text-sm text-ctp-subtext1 hover:bg-ctp-surface1 hover:text-ctp-text transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-ctp-subtext1"
        >
          {t.detail.next} <ChevronRight size={14} />
        </button>
      </div>
    </aside>
  )
}

function MetaRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium uppercase tracking-wide text-ctp-overlay1">{label}</span>
      {children}
    </div>
  )
}

function MetaValue({ children }: { children: React.ReactNode }) {
  return <span className="text-sm text-ctp-subtext1">{children}</span>
}
