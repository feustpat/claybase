export interface Illustration {
  /** Filename slug, e.g. "AI" or "3D-Printing" */
  slug: string
  /** Display name derived from slug */
  name: string
  creationDate: string
  model: string
  style: string
  colorScheme: string
  accentColors: string[]
  tags: string[]
  aliases: string[]
  /** Only present when PUBLISH_PROMPTS=true at build time */
  prompt?: string
  /** Paths to image variants relative to the public root */
  images: {
    thumbnail: string
    display: string
    download: string
  }
  /** Free-form markdown body (Obsidian-specific blocks stripped) */
  body: string
}

export interface IllustrationIndex {
  generatedAt: string
  promptsPublished: boolean
  illustrations: Illustration[]
}
