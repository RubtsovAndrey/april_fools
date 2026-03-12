import { useEffect, useRef, useCallback } from 'react'
import asset from '../utils/asset'

const TRACKS = {
  title: { src: asset('/music/music_title.mp3'), loop: true },
  prologue: { src: asset('/music/music_prologue.mp3'), loop: true },
  era1: { src: asset('/music/music_era1.mp3'), loop: true },
  era2: { src: asset('/music/music_era2.mp3'), loop: true },
  era3: { src: asset('/music/music_era3.mp3'), loop: true },
  era4: { src: asset('/music/music_era4.mp3'), loop: true },
  era5: { src: asset('/music/music_era5.mp3'), loop: true },
  era6: { src: asset('/music/music_era6.mp3'), loop: true },
  era7: { src: asset('/music/music_era7.mp3'), loop: true },
  finale: { src: asset('/music/music_finale.mp3'), loop: true },
  rickroll: { src: asset('/music/music_rickroll.mp3'), loop: true },
  victory: { src: asset('/music/music_victory.mp3'), loop: false },
  gameover_1: { src: asset('/music/music_gameover_1.mp3'), loop: false },
  gameover_2: { src: asset('/music/music_gameover_2.mp3'), loop: false },
}

const GAMEOVER_KEYS = ['gameover_1', 'gameover_2']

// Map era index (0-based) to track key
function getEraTrack(eraIndex) {
  return `era${eraIndex + 1}`
}

const FADE_DURATION_DEFAULT = 1000 // ms
const FADE_DURATION_VICTORY = 5000 // ms — slow crossfade from rickroll to victory
const VOLUME = 0.3

function resolveTrackKey(screen, eraIndex, rickRollPhase) {
  if (screen === 'title') return 'title'
  if (screen === 'prologue') return 'prologue'
  if (screen === 'victory') return 'victory'
  if (screen === 'game_over') return GAMEOVER_KEYS[Math.floor(Math.random() * GAMEOVER_KEYS.length)]

  // Rick Roll finale: cards 7+ = video with rickroll music, cards 1–6 = static with finale music
  if (rickRollPhase >= 7) return 'rickroll'
  if (rickRollPhase >= 1) return 'finale'

  // Era transition and gameplay use era track
  if (screen === 'era_transition' || screen === 'game' || screen === 'result') {
    return getEraTrack(eraIndex)
  }

  return null
}

export default function AudioManager({ screen, eraIndex, rickRollPhase }) {
  const currentAudioRef = useRef(null)
  const currentTrackKeyRef = useRef(null)
  const fadeIntervalRef = useRef(null)
  const hasInteractedRef = useRef(false)

  const fadeOut = useCallback((audio, onComplete, duration = FADE_DURATION_DEFAULT) => {
    if (!audio) {
      onComplete?.()
      return
    }
    const steps = 20
    const stepTime = duration / steps
    const volumeStep = audio.volume / steps
    let current = 0

    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current)

    fadeIntervalRef.current = setInterval(() => {
      current++
      audio.volume = Math.max(0, audio.volume - volumeStep)
      if (current >= steps) {
        clearInterval(fadeIntervalRef.current)
        fadeIntervalRef.current = null
        audio.pause()
        audio.currentTime = 0
        onComplete?.()
      }
    }, stepTime)
  }, [])

  const fadeIn = useCallback((audio, duration = FADE_DURATION_DEFAULT) => {
    audio.volume = 0
    const playPromise = audio.play()
    if (playPromise) {
      playPromise.catch(() => {
        // Autoplay blocked — will retry on user interaction
      })
    }

    const steps = 20
    const stepTime = duration / steps
    const volumeStep = VOLUME / steps
    let current = 0

    const interval = setInterval(() => {
      current++
      audio.volume = Math.min(VOLUME, audio.volume + volumeStep)
      if (current >= steps) {
        clearInterval(interval)
      }
    }, stepTime)
  }, [])

  // Resume audio on first user interaction (autoplay policy)
  useEffect(() => {
    const handleInteraction = () => {
      if (hasInteractedRef.current) return
      hasInteractedRef.current = true
      if (currentAudioRef.current && currentAudioRef.current.paused) {
        currentAudioRef.current.play().catch(() => {})
      }
    }
    window.addEventListener('pointerdown', handleInteraction, { once: false })
    window.addEventListener('keydown', handleInteraction, { once: false })
    return () => {
      window.removeEventListener('pointerdown', handleInteraction)
      window.removeEventListener('keydown', handleInteraction)
    }
  }, [])

  useEffect(() => {
    const trackKey = resolveTrackKey(screen, eraIndex, rickRollPhase)

    // Same track — do nothing
    if (trackKey === currentTrackKeyRef.current) return

    // No track needed
    if (!trackKey || !TRACKS[trackKey]) {
      if (currentAudioRef.current) {
        fadeOut(currentAudioRef.current)
        currentAudioRef.current = null
        currentTrackKeyRef.current = null
      }
      return
    }

    const track = TRACKS[trackKey]
    const newAudio = new Audio(track.src)
    newAudio.loop = track.loop
    newAudio.volume = 0
    newAudio.preload = 'auto'

    // Determine crossfade duration (slow 5s for rickroll → victory)
    const prevKey = currentTrackKeyRef.current
    const fadeDuration = (prevKey === 'rickroll' && trackKey === 'victory')
      ? FADE_DURATION_VICTORY
      : FADE_DURATION_DEFAULT

    // Crossfade: fade out old, fade in new
    const oldAudio = currentAudioRef.current
    currentAudioRef.current = newAudio
    currentTrackKeyRef.current = trackKey

    if (oldAudio) {
      fadeOut(oldAudio, () => {
        fadeIn(newAudio, fadeDuration)
      }, fadeDuration)
    } else {
      fadeIn(newAudio, fadeDuration)
    }

    return () => {
      // Cleanup only on unmount — don't stop on every re-render
    }
  }, [screen, eraIndex, rickRollPhase, fadeOut, fadeIn])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current)
      if (currentAudioRef.current) {
        currentAudioRef.current.pause()
        currentAudioRef.current = null
      }
    }
  }, [])

  return null // No visual output
}
