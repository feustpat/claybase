import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'
import sharp from 'sharp'
import type { Illustration, IllustrationIndex } from '../src/types/illustration.js'
import { resolveStringOrArray, slugToName } from './lib/meta.js'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const META_DIR = path.join(ROOT, 'meta')
const ASSETS_DIR = path.join(ROOT, 'assets')
const OUT_DIR = path.join(ROOT, 'public')
const ILLUS_OUT = path.join(OUT_DIR, 'illustrations')
const DATA_OUT = path.join(OUT_DIR, 'data')

const SITE_URL = 'https://claybase.vercel.app'
const PUBLISH_PROMPTS = process.env.PUBLISH_PROMPTS !== 'false'
const THUMBNAIL_SIZE = parseInt(process.env.THUMBNAIL_SIZE ?? '200', 10)
const DISPLAY_SIZE = parseInt(process.env.DISPLAY_SIZE ?? '512', 10)
const DOWNLOAD_SIZE = parseInt(process.env.DOWNLOAD_SIZE ?? '512', 10)

async function generateVariant(src: string, dest: string, size: number) {
  await fs.promises.mkdir(path.dirname(dest), { recursive: true })
  await sharp(src).resize(size, size, { fit: 'cover' }).jpeg({ quality: 85 }).toFile(dest)
}

async function main() {
  const metaFiles = fs.readdirSync(META_DIR).filter(f => f.endsWith('.md'))

  fs.mkdirSync(path.join(ILLUS_OUT, 'thumbnails'), { recursive: true })
  fs.mkdirSync(path.join(ILLUS_OUT, 'display'), { recursive: true })
  fs.mkdirSync(path.join(ILLUS_OUT, 'downloads'), { recursive: true })
  fs.mkdirSync(DATA_OUT, { recursive: true })

  const illustrations: Illustration[] = []
  let skipped = 0

  for (const file of metaFiles) {
    const slug = file.replace(/\.md$/, '')
    const srcImage = path.join(ASSETS_DIR, `${slug}.jpeg`)

    if (!fs.existsSync(srcImage)) {
      console.warn(`  ⚠ No image for ${slug}, skipping`)
      skipped++
      continue
    }

    const raw = fs.readFileSync(path.join(META_DIR, file), 'utf-8')
    const { data, content } = matter(raw)

    const thumbnailPath = `/illustrations/thumbnails/${slug}.jpg`
    const displayPath = `/illustrations/display/${slug}.jpg`
    const downloadPath = `/illustrations/downloads/${slug}.jpg`

    const displayDest = path.join(ILLUS_OUT, 'display', `${slug}.jpg`)
    await Promise.all([
      generateVariant(srcImage, path.join(ILLUS_OUT, 'thumbnails', `${slug}.jpg`), THUMBNAIL_SIZE),
      generateVariant(srcImage, displayDest, DISPLAY_SIZE),
    ])
    if (DOWNLOAD_SIZE === DISPLAY_SIZE) {
      await fs.promises.copyFile(displayDest, path.join(ILLUS_OUT, 'downloads', `${slug}.jpg`))
    } else {
      await generateVariant(srcImage, path.join(ILLUS_OUT, 'downloads', `${slug}.jpg`), DOWNLOAD_SIZE)
    }

    const illustration: Illustration = {
      slug,
      name: slugToName(slug),
      creationDate: String(data['creation-date'] ?? ''),
      model: String(data['illustration-model'] ?? ''),
      style: String(data['illustration-style'] ?? ''),
      colorScheme: String(data['illustration-color-scheme'] ?? ''),
      accentColors: resolveStringOrArray(data['illustration-accent-colors']),
      tags: resolveStringOrArray(data['illustration-tags']),
      aliases: resolveStringOrArray(data['illustration-aliases']),
      images: { thumbnail: thumbnailPath, display: displayPath, download: downloadPath },
      body: content.trim(),
    }

    if (PUBLISH_PROMPTS && data['illustration-prompt']) {
      illustration.prompt = String(data['illustration-prompt'])
    }

    illustrations.push(illustration)
    process.stdout.write(`  ✓ ${slug}\n`)
  }

  illustrations.sort((a, b) => a.name.localeCompare(b.name))

  const index: IllustrationIndex = {
    generatedAt: new Date().toISOString(),
    promptsPublished: PUBLISH_PROMPTS,
    illustrations,
  }

  fs.writeFileSync(path.join(DATA_OUT, 'index.json'), JSON.stringify(index, null, 2))

  const today = new Date().toISOString().slice(0, 10)
  const staticPages = ['/', '/about', '/contribute', '/faq']
  const urlEntries = [
    ...staticPages.map(
      (p, i) =>
        `  <url><loc>${SITE_URL}${p}</loc><lastmod>${today}</lastmod><priority>${i === 0 ? '1.0' : '0.5'}</priority></url>`,
    ),
    ...illustrations.map(
      ill =>
        `  <url><loc>${SITE_URL}/illustrations/${ill.slug}</loc><lastmod>${today}</lastmod><priority>0.8</priority></url>`,
    ),
  ].join('\n')
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`
  fs.writeFileSync(path.join(OUT_DIR, 'sitemap.xml'), sitemap)

  console.log(`\nBuilt index: ${illustrations.length} illustrations, ${skipped} skipped`)
  console.log(`Prompts published: ${PUBLISH_PROMPTS}`)
}

main().catch(err => { console.error(err); process.exit(1) })
