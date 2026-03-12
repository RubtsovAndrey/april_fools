import React, { useState, useRef, useCallback } from 'react'
import asset from '../utils/asset'

export default function ResultCard({ resultCard, onDismiss }) {
  const [dragX, setDragX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [swipeAnim, setSwipeAnim] = useState(null)
  const [flipIn, setFlipIn] = useState(true)
  const startX = useRef(0)
  const lastDragX = useRef(0)

  const SWIPE_THRESHOLD = 80

  // Flip-in on mount
  React.useEffect(() => {
    setFlipIn(true)
    const t = setTimeout(() => setFlipIn(false), 500)
    return () => clearTimeout(t)
  }, [resultCard.text])

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
      setTimeout(() => {
        onDismiss()
        setSwipeAnim(null)
        setDragX(0)
        lastDragX.current = 0
      }, 350)
    } else {
      setDragX(0)
      lastDragX.current = 0
    }
  }, [isDragging, swipeAnim, onDismiss])

  const rotation = dragX * 0.08

  const getCardStyle = () => {
    if (swipeAnim) {
      const { direction } = swipeAnim
      const targetX = direction === 'left' ? -window.innerWidth : window.innerWidth
      const targetRotation = direction === 'left' ? -25 : 25
      return {
        transform: `translateX(${targetX}px) rotate(${targetRotation}deg)`,
        transition: 'transform 0.35s ease-in, opacity 0.35s ease-in',
        opacity: 0,
      }
    }
    return {
      transform: `translateX(${dragX}px) rotate(${rotation}deg)`,
      transition: isDragging ? 'none' : 'transform 0.3s ease-out',
    }
  }

  const animClass = flipIn && !swipeAnim ? 'animate-flip-in' : ''

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden"
      style={{ backgroundColor: '#1B1F3B' }}
    >
      <div className="flex-1 flex items-center justify-center relative z-10">
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
              src={asset('/cards/card_back.png')}
              alt=""
              className="w-full h-full object-cover rounded-xl opacity-60"
              onError={(e) => { e.target.style.display = 'none' }}
            />
          </div>

          {/* Main result card */}
          <div
            className={`
              relative card-width rounded-xl shadow-2xl cursor-grab active:cursor-grabbing
              ${animClass}
            `}
            style={{
              height: '70vh',
              maxHeight: '600px',
              backgroundColor: '#2A1F17',
              border: '1px solid rgba(212, 197, 169, 0.4)',
              boxShadow: '0 0 30px rgba(196, 130, 50, 0.15)',
              zIndex: 10,
              ...getCardStyle(),
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            {/* Result image — stylized question mark */}
            <div
              className="w-full overflow-hidden rounded-t-xl"
              style={{ height: '45%' }}
            >
              <img
                src={asset('/characters/result_card.png')}
                alt="Результат"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.parentElement.style.background = 'linear-gradient(135deg, #3D2B1F 0%, #1B1F3B 100%)'
                  e.target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center text-6xl" style="color: #C47B35; opacity: 0.7;">?</div>`
                }}
              />
            </div>

            {/* Result text area */}
            <div
              className="flex flex-col px-5 py-4 flex-1 items-center justify-center"
              style={{
                background: 'linear-gradient(180deg, #2A1F17 0%, #3D2B1F 100%)',
                height: '40%',
              }}
            >
              <p className="font-title card-name-text font-semibold text-dodo-orange mb-2 tracking-wide">
                Результат
              </p>
              <p className="card-body-text text-dodo-beige leading-relaxed text-center italic">
                {resultCard.text}
              </p>
            </div>

            {/* Swipe hint at bottom */}
            <div
              className="flex items-center justify-center rounded-b-xl"
              style={{
                height: '15%',
                backgroundColor: 'rgba(27, 31, 59, 0.5)',
                borderTop: '1px solid rgba(212, 197, 169, 0.1)',
              }}
            >
              <p className="text-dodo-beige/30 text-xs uppercase tracking-widest">
                ← Свайп для продолжения →
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
