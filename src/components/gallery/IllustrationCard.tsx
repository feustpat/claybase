import { useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { Heart } from 'lucide-react'
import type { Illustration } from '@/types/illustration'
import { strings as t } from '@/locales/en'

interface Props {
  illustration: Illustration
  isFavorite: boolean
  onToggleFavorite: () => void
  isActive?: boolean
}

export default function IllustrationCard({
  illustration,
  isFavorite,
  onToggleFavorite,
  isActive,
}: Props) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const cardRef = useRef<HTMLDivElement>(null)
  const [imgLoaded, setImgLoaded] = useState(false)

  useEffect(() => {
    if (isActive) cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [isActive])

  return (
    <div
      ref={cardRef}
      data-illustration-card
      className={`scroll-mt-36 group relative flex flex-col w-full rounded-lg md:rounded-xl p-[2px] md:p-[3px] transition-colors duration-150 ${
        isActive
          ? 'bg-ctp-surface1 ring-2 ring-accent/70'
          : 'bg-ctp-surface0 hover:bg-ctp-surface1 focus-within:ring-2 focus-within:ring-accent/50'
      }`}
    >
      {/* Image — clickable area for detail panel */}
      <button
        onClick={() =>
          navigate({
            pathname: `/illustrations/${illustration.slug}`,
            search: searchParams.toString(),
          })
        }
        className="scroll-mt-36 w-full aspect-square overflow-hidden rounded-md md:rounded-lg bg-ctp-mantle focus-visible:outline-none"
        aria-label={t.card.open(illustration.name)}
      >
        <img
          src={illustration.images.thumbnail}
          alt={illustration.name}
          loading="lazy"
          decoding="async"
          ref={(el) => {
            if (el?.complete) setImgLoaded(true)
          }}
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover transition-[opacity,transform] duration-300 group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
        />
      </button>

      {/* Name + fav row */}
      <div className="flex items-center px-[2px] pt-[2px] md:px-[3px] md:pt-[3px]">
        <button
          onClick={() =>
            navigate({
              pathname: `/illustrations/${illustration.slug}`,
              search: searchParams.toString(),
            })
          }
          className="flex-1 truncate text-left text-xs text-ctp-subtext1 group-hover:text-ctp-text transition-colors focus-visible:outline-none"
          tabIndex={-1}
          aria-hidden="true"
        >
          {illustration.name}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleFavorite()
          }}
          aria-label={isFavorite ? t.card.removeFavorite : t.card.addFavorite}
          className={`shrink-0 flex items-center justify-center h-8 w-8 -my-1 -mr-[3px] rounded transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent ${
            isFavorite ? 'text-ctp-text' : 'text-ctp-overlay0 hover:text-ctp-text'
          }`}
        >
          <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>
    </div>
  )
}
