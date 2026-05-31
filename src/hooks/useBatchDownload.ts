import { useState, useCallback } from 'react'
import { zipSync } from 'fflate'
import { track } from '@vercel/analytics'
import type { Illustration } from '@/types/illustration'

const BATCH_SIZE = 6

export interface DownloadProgress {
  done: number
  total: number
}

/** `all` — every asset failed; `partial` — some succeeded, `failed` of `total` did not. */
export type BatchDownloadError =
  | { kind: 'all' }
  | { kind: 'partial'; failed: number; total: number }

export function useBatchDownload(illustrations: Illustration[], favorites: Set<string>) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [progress, setProgress] = useState<DownloadProgress | null>(null)
  const [error, setError] = useState<BatchDownloadError | null>(null)

  const download = useCallback(async () => {
    const targets = illustrations.filter((i) => favorites.has(i.slug))
    if (targets.length === 0) return

    setIsDownloading(true)
    setError(null)
    setProgress({ done: 0, total: targets.length })

    try {
      const files: Record<string, Uint8Array> = {}
      let done = 0

      for (let i = 0; i < targets.length; i += BATCH_SIZE) {
        const batch = targets.slice(i, i + BATCH_SIZE)
        const results = await Promise.allSettled(
          batch.map(async (illus) => {
            const res = await fetch(illus.images.download)
            if (!res.ok) throw new Error(`Failed to fetch ${illus.slug}`)
            const buf = await res.arrayBuffer()
            return { slug: illus.slug, data: new Uint8Array(buf) }
          })
        )

        for (const result of results) {
          if (result.status === 'fulfilled') {
            files[`${result.value.slug}.jpg`] = result.value.data
          }
        }

        done += batch.length
        setProgress({ done, total: targets.length })
      }

      const succeeded = Object.keys(files)
      if (succeeded.length === 0) {
        setError({ kind: 'all' })
        return
      }

      const zipBytes = zipSync(files)
      const url = URL.createObjectURL(new Blob([zipBytes], { type: 'application/zip' }))
      const a = document.createElement('a')
      a.href = url
      a.download = 'favorites.zip'
      a.click()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
      track('batch_download', {
        count: succeeded.length,
        slugs: succeeded.map((f) => f.replace(/\.jpg$/, '')).join(','),
      })

      if (succeeded.length < targets.length) {
        setError({
          kind: 'partial',
          failed: targets.length - succeeded.length,
          total: targets.length,
        })
      }
    } catch {
      setError({ kind: 'all' })
    } finally {
      setIsDownloading(false)
      setProgress(null)
    }
  }, [illustrations, favorites])

  return { download, isDownloading, progress, error }
}
