import React, { useState } from 'react'

export default function StartScreen({ onStart }) {
  const [unlocked, setUnlocked] = useState(false)
  const [hovering, setHovering] = useState(false)

  const handleTapAnywhere = () => {
    if (unlocked) return
    setUnlocked(true)
  }

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-end relative overflow-hidden"
      onClick={handleTapAnywhere}
    >
      {/* Background image — no overlay, shown as-is */}
      <div className="absolute inset-0">
        <img
          src="/screens/screen_title.png"
          alt=""
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = 'none'
          }}
        />
      </div>

      {/* UI elements — positioned in the lower dark area of the background */}
      <div className="relative z-10 flex flex-col items-center gap-5 pb-[8vh]">
        {/* Title */}
        <h1
          className="font-title text-5xl font-bold text-dodo-beige tracking-[0.15em] animate-fade-in"
          style={{ textShadow: '0 2px 30px rgba(0,0,0,0.9), 0 0 60px rgba(0,0,0,0.6)' }}
        >
          DODO REIGNS
        </h1>

        {!unlocked ? (
          /* Phase 1: Blinking "tap anywhere" prompt */
          <p
            className="font-title text-lg text-dodo-beige/70 tracking-[0.15em] animate-blink"
            style={{
              textShadow: '0 2px 10px rgba(0,0,0,0.8)',
            }}
          >
            Нажмите в любом месте экрана
          </p>
        ) : (
          /* Phase 2: Start button slides up + hint */
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onStart()
              }}
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
              className={`
                relative px-14 py-3.5 font-title text-lg tracking-[0.2em] uppercase
                transition-all duration-300 animate-slide-up-delayed
                ${hovering
                  ? 'bg-dodo-orange text-white shadow-lg shadow-dodo-orange/40 scale-105 rounded-lg'
                  : 'text-dodo-beige/80 hover:text-dodo-beige rounded-lg'
                }
              `}
              style={{
                textShadow: '0 2px 10px rgba(0,0,0,0.8)',
                border: hovering ? 'none' : '1px solid rgba(212, 197, 169, 0.2)',
                backgroundColor: hovering ? undefined : 'rgba(27, 31, 59, 0.4)',
              }}
            >
              Начать игру
            </button>

            <p
              className="text-dodo-beige/25 text-[10px] tracking-[0.3em] uppercase animate-slide-up-delayed"
              style={{
                animationDelay: '0.2s',
                textShadow: '0 1px 8px rgba(0,0,0,0.9)',
              }}
            >
              Свайпайте карточки влево или вправо
            </p>
          </>
        )}
      </div>
    </div>
  )
}
