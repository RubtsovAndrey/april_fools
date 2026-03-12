import asset from './asset'
import characters from '../data/characters'
import { eras, RESOURCE_LABELS } from '../engine/gameEngine'

const loaded = new Set()

function preloadImage(path) {
  if (!path || loaded.has(path)) return Promise.resolve()
  loaded.add(path)
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = resolve
    img.onerror = resolve
    img.src = asset(path)
  })
}

// Batch preload with concurrency limit
async function preloadBatch(paths, concurrency = 4) {
  const queue = [...paths]
  const workers = Array.from({ length: concurrency }, async () => {
    while (queue.length > 0) {
      await preloadImage(queue.shift())
    }
  })
  await Promise.all(workers)
}

// Phase 1: Critical — title screen (called immediately)
export function preloadTitleScreen() {
  return preloadImage('/screens/screen_title.png')
}

// Phase 2: Next screens — prologue, first era bg/transition, icons (called on title screen)
export function preloadEarlyGame() {
  const paths = [
    '/screens/screen_prologue.png',
    '/cards/card_back.png',
    eras[0]?.background,
    eras[0]?.transition,
    ...Object.values(RESOURCE_LABELS).map(r => r.icon),
  ].filter(Boolean)

  // Also preload first few character images
  const charImages = Object.values(characters)
    .slice(0, 8)
    .map(c => c.image)
    .filter(Boolean)

  return preloadBatch([...paths, ...charImages], 6)
}

// Phase 3: Preload assets for a specific era (called during era transition)
export function preloadEraAssets(eraIndex) {
  const paths = []
  const era = eras[eraIndex]
  if (era) {
    if (era.background) paths.push(era.background)
    if (era.transition) paths.push(era.transition)
  }
  // Also preload next era's transition for smooth flow
  const nextEra = eras[eraIndex + 1]
  if (nextEra?.transition) paths.push(nextEra.transition)

  // Preload all character images (they're tiny now after compression)
  const allChars = Object.values(characters).map(c => c.image).filter(Boolean)
  return preloadBatch([...paths, ...allChars], 6)
}

// Phase 4: Preload game over / victory screens in background
export function preloadEndScreens() {
  return preloadBatch([
    '/screens/screen_victory.png',
  ], 2)
}
