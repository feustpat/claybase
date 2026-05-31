import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const META_DIR = path.join(ROOT, 'meta')
const ASSETS_DIR = path.join(ROOT, 'assets')

const REQUIRED_FIELDS = [
  'creation-date',
  'illustration-model',
  'illustration-style',
  'illustration-color-scheme',
  'illustration-tags',
]

let errors = 0

const metaFiles = fs.readdirSync(META_DIR).filter(f => f.endsWith('.md'))

for (const file of metaFiles) {
  const slug = file.replace(/\.md$/, '')
  const filePath = path.join(META_DIR, file)
  const raw = fs.readFileSync(filePath, 'utf-8')

  let data: Record<string, unknown>
  try {
    const parsed = matter(raw)
    data = parsed.data
  } catch (e) {
    console.error(`✗ ${slug}: failed to parse frontmatter — ${e}`)
    errors++
    continue
  }

  for (const field of REQUIRED_FIELDS) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      console.error(`✗ ${slug}: missing required field "${field}"`)
      errors++
    }
  }

  const imageFile = path.join(ASSETS_DIR, `${slug}.jpeg`)
  if (!fs.existsSync(imageFile)) {
    console.error(`✗ ${slug}: no matching image at assets/${slug}.jpeg`)
    errors++
  }
}

if (errors === 0) {
  console.log(`✓ All ${metaFiles.length} meta files valid`)
} else {
  console.error(`\n${errors} error(s) found across ${metaFiles.length} files`)
  process.exit(1)
}
