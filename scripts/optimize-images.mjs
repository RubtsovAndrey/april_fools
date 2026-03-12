import sharp from 'sharp'
import { readdir, stat } from 'fs/promises'
import { join, extname } from 'path'

const PUBLIC = 'public'

// Size configs per directory
const CONFIG = {
  'characters': { maxWidth: 400, maxHeight: 520, pngQuality: 80 },
  'icons':      { maxWidth: 128, maxHeight: 128, pngQuality: 80 },
  'backgrounds': { maxWidth: 1920, maxHeight: 1080, jpgQuality: 80 },
  'screens':    { maxWidth: 1920, maxHeight: 1080, pngQuality: 80 },
  'cards':      { maxWidth: 400, maxHeight: 600, pngQuality: 80 },
}

async function getFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...await getFiles(full))
    } else {
      files.push(full)
    }
  }
  return files
}

function getConfig(filePath) {
  for (const [folder, cfg] of Object.entries(CONFIG)) {
    if (filePath.includes(`${folder}\\`) || filePath.includes(`${folder}/`)) {
      return cfg
    }
  }
  // Default for any unmatched
  return { maxWidth: 1920, maxHeight: 1080, pngQuality: 80, jpgQuality: 80 }
}

async function optimizeFile(filePath) {
  const ext = extname(filePath).toLowerCase()
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) return null

  const before = (await stat(filePath)).size
  const cfg = getConfig(filePath)

  let pipeline = sharp(filePath)
  const meta = await pipeline.metadata()

  // Resize if needed
  const needsResize = (meta.width > cfg.maxWidth) || (meta.height > cfg.maxHeight)
  if (needsResize) {
    pipeline = pipeline.resize(cfg.maxWidth, cfg.maxHeight, {
      fit: 'inside',
      withoutEnlargement: true,
    })
  }

  let buf
  if (ext === '.png') {
    buf = await pipeline.png({ quality: cfg.pngQuality || 80, compressionLevel: 9, effort: 10 }).toBuffer()
  } else {
    buf = await pipeline.jpeg({ quality: cfg.jpgQuality || 80, mozjpeg: true }).toBuffer()
  }

  // Write back
  await sharp(buf).toFile(filePath + '.tmp')
  const { rename } = await import('fs/promises')
  await rename(filePath + '.tmp', filePath)

  const after = (await stat(filePath)).size
  const saved = ((before - after) / before * 100).toFixed(1)
  return { filePath, before, after, saved }
}

async function main() {
  console.log('Scanning public/ for images...')
  const files = await getFiles(PUBLIC)
  const imageFiles = files.filter(f => ['.png', '.jpg', '.jpeg'].includes(extname(f).toLowerCase()))

  console.log(`Found ${imageFiles.length} images to optimize\n`)

  let totalBefore = 0
  let totalAfter = 0

  for (const file of imageFiles) {
    try {
      const result = await optimizeFile(file)
      if (result) {
        totalBefore += result.before
        totalAfter += result.after
        const beforeMB = (result.before / 1024 / 1024).toFixed(2)
        const afterMB = (result.after / 1024 / 1024).toFixed(2)
        console.log(`${result.saved}% saved | ${beforeMB}MB → ${afterMB}MB | ${result.filePath}`)
      }
    } catch (err) {
      console.error(`ERROR: ${file}: ${err.message}`)
    }
  }

  console.log(`\n--- TOTAL ---`)
  console.log(`Before: ${(totalBefore / 1024 / 1024).toFixed(1)} MB`)
  console.log(`After:  ${(totalAfter / 1024 / 1024).toFixed(1)} MB`)
  console.log(`Saved:  ${((totalBefore - totalAfter) / 1024 / 1024).toFixed(1)} MB (${((totalBefore - totalAfter) / totalBefore * 100).toFixed(1)}%)`)
}

main()
