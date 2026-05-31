import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { zipSync } from 'fflate'
import { useBatchDownload } from './useBatchDownload'
import type { Illustration } from '@/types/illustration'

vi.mock('@vercel/analytics', () => ({ track: vi.fn() }))
vi.mock('fflate', () => ({ zipSync: vi.fn(() => new Uint8Array([1, 2, 3])) }))

const makeIll = (slug: string): Illustration => ({
  slug,
  name: slug,
  creationDate: '2026-01-01',
  model: 'DALL-E 3',
  style: '3D clay render',
  colorScheme: 'Catppuccin Mocha',
  accentColors: [],
  tags: [],
  aliases: [],
  images: {
    thumbnail: `/t/${slug}.jpg`,
    display: `/d/${slug}.jpg`,
    download: `/dl/${slug}.jpg`,
  },
  body: '',
})

const ILLUSTRATIONS = [makeIll('ai'), makeIll('beach'), makeIll('book')]

/** Returns the filenames passed to the mocked zipSync on its most recent call. */
function zippedFilenames(): string[] {
  const mock = vi.mocked(zipSync)
  const lastCall = mock.mock.calls.at(-1)
  return lastCall ? Object.keys(lastCall[0]) : []
}

beforeEach(() => {
  vi.clearAllMocks()
  global.URL.createObjectURL = vi.fn(() => 'blob:mock')
  global.URL.revokeObjectURL = vi.fn()
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
  global.fetch = vi.fn(async (input: RequestInfo | URL) => {
    const url = String(input)
    // Simulate a single failing asset to exercise partial-failure handling.
    if (url.includes('beach')) return { ok: false, status: 500 } as unknown as Response
    return {
      ok: true,
      arrayBuffer: async () => new ArrayBuffer(8),
    } as unknown as Response
  }) as typeof fetch
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('useBatchDownload', () => {
  it('does nothing when no favorites match', async () => {
    const { result } = renderHook(() => useBatchDownload(ILLUSTRATIONS, new Set()))
    await act(async () => {
      await result.current.download()
    })
    expect(fetch).not.toHaveBeenCalled()
    expect(zipSync).not.toHaveBeenCalled()
  })

  it('fetches only favorited illustrations and zips them', async () => {
    const { result } = renderHook(() => useBatchDownload(ILLUSTRATIONS, new Set(['ai', 'book'])))
    await act(async () => {
      await result.current.download()
    })
    expect(fetch).toHaveBeenCalledTimes(2)
    expect(zippedFilenames().sort()).toEqual(['ai.jpg', 'book.jpg'])
    expect(URL.createObjectURL).toHaveBeenCalledTimes(1)
  })

  it('still zips the successful assets and reports a partial failure when one fetch fails', async () => {
    const { result } = renderHook(() =>
      useBatchDownload(ILLUSTRATIONS, new Set(['ai', 'beach', 'book']))
    )
    await act(async () => {
      await result.current.download()
    })
    // "beach" fails its fetch; the zip should contain the other two only.
    expect(zippedFilenames().sort()).toEqual(['ai.jpg', 'book.jpg'])
    expect(URL.createObjectURL).toHaveBeenCalledTimes(1)
    expect(result.current.error).toEqual({ kind: 'partial', failed: 1, total: 3 })
  })

  it('reports a total failure and skips the download when every fetch fails', async () => {
    global.fetch = vi.fn(
      async () => ({ ok: false, status: 500 }) as unknown as Response
    ) as typeof fetch
    const { result } = renderHook(() => useBatchDownload(ILLUSTRATIONS, new Set(['ai', 'book'])))
    await act(async () => {
      await result.current.download()
    })
    expect(result.current.error).toEqual({ kind: 'all' })
    expect(zipSync).not.toHaveBeenCalled()
    expect(URL.createObjectURL).not.toHaveBeenCalled()
  })

  it('reports no error on full success', async () => {
    const { result } = renderHook(() => useBatchDownload(ILLUSTRATIONS, new Set(['ai', 'book'])))
    await act(async () => {
      await result.current.download()
    })
    expect(result.current.error).toBeNull()
  })

  it('clears progress after completing', async () => {
    const { result } = renderHook(() => useBatchDownload(ILLUSTRATIONS, new Set(['ai'])))
    await act(async () => {
      await result.current.download()
    })
    expect(result.current.progress).toBeNull()
    expect(result.current.isDownloading).toBe(false)
  })
})
