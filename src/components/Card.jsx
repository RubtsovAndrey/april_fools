import React, { useState, useRef, useCallback, useEffect } from 'react'
import characters from '../data/characters'
import { RESOURCE_LABELS } from '../engine/gameEngine'

export default function Card({ card, onSwipe, onHoverDirection }) {
  const [dragX, setDragX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [swipeAnim, setSwipeAnim] = useState(null)
  const [flipIn, setFlipIn] = useState(true)
  const startX = useRef(0)
  const lastDragX = useRef(0)
  const cardRef = useRef(null)

  const character = characters[card.character]
  const SWIPE_THRESHOLD = 80
  const isPizzeria = !!card.isPizzeria

  const hoverDir = dragX > 20 ? 'right' : dragX < -20 ? 'left' : null

  // Notify parent about hover direction for resource preview
  React.useEffect(() => {
    onHoverDirection?.(hoverDir)
  }, [hoverDir, onHoverDirection])

  // Flip-in on card change (slower for pizzeria)
  React.useEffect(() => {
    setFlipIn(true)
    const t = setTimeout(() => setFlipIn(false), card.isPizzeria ? 1000 : 500)
    return () => clearTimeout(t)
  }, [card.id, card.isPizzeria])

  const handlePointerDown = useCallback((e) => {
    if (swipeAnim) return
    setIsDragging(true)
    startX.current = e.clientX
    e.currentTarget.setPointerCapture(e.pointerId)
  }, [swipeAnim])

  const handlePointerMove = useCallback((e) => {
    if (!isDragging || swipeAnim) return
    const dx = e.clientX - startX.current
    setDragX(dx)
    lastDragX.current = dx
  }, [isDragging, swipeAnim])

  const handlePointerUp = useCallback(() => {
    if (!isDragging || swipeAnim) return
    setIsDragging(false)

    const currentDragX = lastDragX.current
    if (Math.abs(currentDragX) > SWIPE_THRESHOLD) {
      const direction = currentDragX > 0 ? 'right' : 'left'
      setSwipeAnim({ direction, fromX: currentDragX })
      const swipeDuration = isPizzeria ? 700 : 350
      setTimeout(() => {
        onSwipe(direction)
        setSwipeAnim(null)
        setDragX(0)
        lastDragX.current = 0
      }, swipeDuration)
    } else {
      setDragX(0)
      lastDragX.current = 0
    }
  }, [isDragging, swipeAnim, onSwipe])

  const rotation = dragX * 0.08

  // When swiping away, animate from current position to off-screen
  const getCardStyle = () => {
    const swipeSec = isPizzeria ? '0.7s' : '0.35s'
    const snapSec = isPizzeria ? '0.6s' : '0.3s'
    if (swipeAnim) {
      const { direction, fromX } = swipeAnim
      const targetX = direction === 'left' ? -window.innerWidth : window.innerWidth
      const targetRotation = direction === 'left' ? -25 : 25
      return {
        transform: `translateX(${targetX}px) rotate(${targetRotation}deg)`,
        transition: `transform ${swipeSec} ease-in, opacity ${swipeSec} ease-in`,
        opacity: 0,
      }
    }
    return {
      transform: `translateX(${dragX}px) rotate(${rotation}deg)`,
      transition: isDragging ? 'none' : `transform ${snapSec} ease-out`,
    }
  }

  const animClass = flipIn && !swipeAnim
    ? (isPizzeria ? 'animate-flip-in-slow' : 'animate-flip-in')
    : ''

  // Choice labels
  const leftChoice = card.choiceLeft
  const rightChoice = card.choiceRight

  return (
    <div className="relative flex flex-col items-center card-responsive">
      {/* Card deck (card back behind) */}
      <div
        className="absolute card-width rounded-xl shadow-lg"
        style={{
          height: '70vh',
          maxHeight: '600px',
          backgroundColor: '#3D2B1F',
          transform: 'translateY(4px) scale(0.97)',
          zIndex: 0,
          border: '1px solid rgba(212, 197, 169, 0.15)',
        }}
      >
        <img
          src="/cards/card_back.png"
          alt=""
          className="w-full h-full object-cover rounded-xl opacity-60"
          onError={(e) => { e.target.style.display = 'none' }}
        />
      </div>

      {/* Main card */}
      <div
        ref={cardRef}
        className={`
          relative card-width rounded-xl shadow-2xl cursor-grab active:cursor-grabbing
          ${animClass}
        `}
        style={{
          height: '70vh',
          maxHeight: '600px',
          backgroundColor: '#2A1F17',
          border: '1px solid rgba(212, 197, 169, 0.25)',
          zIndex: 10,
          ...getCardStyle(),
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Character image area — top half */}
        <div
          className="w-full overflow-hidden rounded-t-xl"
          style={{ height: '45%' }}
        >
          {character?.isVideo ? (
            <video
              src={character.image}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={character?.image}
              alt={character?.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.parentElement.style.background = 'linear-gradient(135deg, #3D2B1F 0%, #1B1F3B 100%)'
                e.target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center text-5xl opacity-30">👤</div>`
              }}
            />
          )}
        </div>

        {/* Character name & text area */}
        <div
          className="flex flex-col px-4 py-3 flex-1"
          style={{
            background: 'linear-gradient(180deg, #2A1F17 0%, #3D2B1F 100%)',
            height: '35%',
          }}
        >
          <p className="font-title card-name-text font-semibold text-dodo-orange mb-1 tracking-wide">
            {character?.name || 'Неизвестный'}
          </p>
          <p className="card-body-text text-dodo-beige leading-relaxed line-clamp-5 overflow-hidden">
            {card.text}
          </p>
        </div>

        {/* Affected resources row */}
        <div className="flex items-center justify-center gap-2 py-1" style={{ height: '5%' }}>
          {card.affects?.map(key => (
            <img
              key={key}
              src={RESOURCE_LABELS[key]?.icon}
              alt={key}
              className="w-4 h-4 opacity-60"
              onError={(e) => {
                e.target.outerHTML = `<span class="text-xs">${RESOURCE_LABELS[key]?.emoji || ''}</span>`
              }}
            />
          ))}
        </div>

        {/* Choice labels at bottom */}
        <div
          className="flex justify-between items-center px-3 rounded-b-xl"
          style={{
            height: '15%',
            backgroundColor: 'rgba(27, 31, 59, 0.5)',
            borderTop: '1px solid rgba(212, 197, 169, 0.1)',
          }}
        >
          <div
            className={`flex-1 text-center transition-all duration-200 ${
              hoverDir === 'left' ? 'text-dodo-orange scale-110 font-bold' : 'text-dodo-beige/60'
            }`}
          >
            <p className="text-[10px] uppercase tracking-wider mb-0.5">← Свайп</p>
            <p className="card-choice-text leading-tight">{leftChoice.label}</p>
          </div>
          <div className="w-px h-8 bg-dodo-beige/10" />
          <div
            className={`flex-1 text-center transition-all duration-200 ${
              hoverDir === 'right' ? 'text-dodo-orange scale-110 font-bold' : 'text-dodo-beige/60'
            }`}
          >
            <p className="text-[10px] uppercase tracking-wider mb-0.5">Свайп →</p>
            <p className="card-choice-text leading-tight">{rightChoice.label}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
