/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'
import type { Illustration, IllustrationIndex } from '@/types/illustration'

interface IllustrationContextValue {
  illustrations: Illustration[]
  loading: boolean
  error: string | null
  promptsPublished: boolean
}

const IllustrationContext = createContext<IllustrationContextValue>({
  illustrations: [],
  loading: true,
  error: null,
  promptsPublished: false,
})

export function IllustrationProvider({ children }: { children: React.ReactNode }) {
  const [illustrations, setIllustrations] = useState<Illustration[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [promptsPublished, setPromptsPublished] = useState(false)

  useEffect(() => {
    fetch('/data/index.json')
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load index: ${r.status}`)
        return r.json() as Promise<IllustrationIndex>
      })
      .then((data) => {
        setIllustrations(data.illustrations)
        setPromptsPublished(data.promptsPublished)
        setLoading(false)
      })
      .catch((err) => {
        setError(String(err))
        setLoading(false)
      })
  }, [])

  return (
    <IllustrationContext.Provider value={{ illustrations, loading, error, promptsPublished }}>
      {children}
    </IllustrationContext.Provider>
  )
}

export function useIllustrations() {
  return useContext(IllustrationContext)
}
