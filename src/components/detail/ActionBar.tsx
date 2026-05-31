import { useState } from 'react'
import { Download, Heart, Link, Check } from 'lucide-react'
import { track } from '@vercel/analytics'
import type { Illustration } from '@/types/illustration'
import { downloadFile } from '@/utils/downloadFile'
import { strings as t } from '@/locales/en'

interface Props {
  illustration: Illustration
  isFavorite: boolean
  onToggleFavorite: () => void
}

export default function ActionBar({ illustration, isFavorite, onToggleFavorite }: Props) {
  const [linkCopied, setLinkCopied] = useState(false)

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 1500)
    } catch {
      // clipboard access denied — leave button state unchanged
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => {
          downloadFile(illustration.images.download, `${illustration.slug}.jpg`)
          track('download', { slug: illustration.slug })
        }}
        className="flex items-center gap-1.5 rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-ctp-base hover:opacity-80 transition-colors"
      >
        <Download size={14} /> {t.detail.download}
      </button>
      <button
        onClick={onToggleFavorite}
        className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm transition-colors ${
          isFavorite
            ? 'border-accent bg-accent/10 text-accent'
            : 'border-ctp-surface1 text-ctp-subtext1 hover:border-ctp-surface2 hover:text-ctp-text'
        }`}
      >
        <Heart size={14} fill={isFavorite ? 'currentColor' : 'none'} />
        {isFavorite ? t.detail.favorited : t.detail.favorite}
      </button>
      <button
        onClick={handleCopyLink}
        className="flex items-center gap-1.5 rounded-lg border border-ctp-surface1 px-3 py-1.5 text-sm text-ctp-subtext1 hover:border-ctp-surface2 hover:text-ctp-text transition-colors"
      >
        {linkCopied ? <Check size={14} /> : <Link size={14} />}
        {linkCopied ? t.detail.copied : t.detail.copyLink}
      </button>
    </div>
  )
}
