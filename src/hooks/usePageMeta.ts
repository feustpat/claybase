import { useEffect } from 'react'

const DEFAULT_TITLE = 'Claybase'
const DEFAULT_DESC =
  'A curated library of AI-generated illustrations in a 3D clay render style, built on the Catppuccin Mocha color palette.'
const DEFAULT_IMAGE_PATH = '/illustrations/display/AI.jpg'

function setMeta(selector: string, content: string) {
  document.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', content)
}

interface PageMetaOptions {
  title: string
  description: string
  imageUrl?: string
  pageUrl?: string
}

export function usePageMeta({ title, description, imageUrl, pageUrl }: PageMetaOptions) {
  useEffect(() => {
    const origin = window.location.origin
    const absImage = imageUrl
      ? imageUrl.startsWith('http')
        ? imageUrl
        : origin + imageUrl
      : origin + DEFAULT_IMAGE_PATH

    document.title = title
    setMeta('meta[property="og:title"]', title)
    setMeta('meta[property="og:description"]', description)
    setMeta('meta[property="og:url"]', pageUrl ?? window.location.href)
    setMeta('meta[property="og:image"]', absImage)
    setMeta('meta[name="description"]', description)
    setMeta('meta[name="twitter:title"]', title)
    setMeta('meta[name="twitter:description"]', description)
    setMeta('meta[name="twitter:image"]', absImage)

    return () => {
      const defaultImage = origin + DEFAULT_IMAGE_PATH
      document.title = DEFAULT_TITLE
      setMeta('meta[property="og:title"]', DEFAULT_TITLE)
      setMeta('meta[property="og:description"]', DEFAULT_DESC)
      setMeta('meta[property="og:url"]', origin + '/')
      setMeta('meta[property="og:image"]', defaultImage)
      setMeta('meta[name="description"]', DEFAULT_DESC)
      setMeta('meta[name="twitter:title"]', DEFAULT_TITLE)
      setMeta('meta[name="twitter:description"]', DEFAULT_DESC)
      setMeta('meta[name="twitter:image"]', defaultImage)
    }
  }, [title, description, imageUrl, pageUrl])
}
