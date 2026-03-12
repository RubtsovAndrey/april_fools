import React, { useState, useEffect } from 'react'
import { RESOURCE_LABELS } from '../engine/gameEngine'

export default function GameOverScreen({ gameOver, gameState, onRestart }) {
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 800)
    return () => clearTimeout(t)
  }, [])

  const stats = [
    { label: 'Ходов сыграно', value: gameState.totalCardsPlayed },
    { label: 'Эра', value: `${gameState.currentEraIndex + 1} / 7` },
    { label: 'Причина', value: gameOver.title },
  ]

  return (
    <div className="w-full h-full flex flex-col justify-end relative overflow-hidden">
      {/* Full-screen game over image */}
      <div className="absolute inset-0">
        <img
          src={gameOver.image}
          alt={gameOver.title}
          className="w-full h-full object-cover animate-fade-in"
          onError={(e) => {
            e.target.style.display = 'none'
            e.target.parentElement.style.background = '#1B1F3B'
          }}
        />
      </div>

      {/* Bottom gradient for text readability */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: '55%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0) 100%)',
        }}
      />

      {/* Content — bottom-aligned */}
      <div className="relative z-10 text-center px-6 pb-[5vh] max-w-2xl mx-auto">
        {/* Game Over label */}
        <p
          className="text-red-400 text-xs tracking-[0.5em] uppercase mb-3 animate-slide-up"
          style={{ animationDelay: '0.3s', textShadow: '0 1px 8px rgba(0,0,0,0.9)' }}
        >
          Конец игры
        </p>

        {/* Title */}
        <h1
          className="font-title text-3xl font-bold text-dodo-beige mb-2 animate-slide-up"
          style={{
            textShadow: '0 2px 20px rgba(0,0,0,0.9), 0 0 40px rgba(166,61,47,0.3)',
            animationDelay: '0.5s',
          }}
        >
          {gameOver.title}
        </h1>

        {/* Subtitle */}
        <p
          className="text-dodo-beige/70 text-sm mb-5 animate-slide-up italic"
          style={{ animationDelay: '0.7s', textShadow: '0 1px 8px rgba(0,0,0,0.9)' }}
        >
          «{gameOver.subtitle}»
        </p>

        {/* Stats + Resources in one row */}
        {revealed && (
          <div className="flex items-center justify-center gap-5 mb-5 animate-slide-up">
            {/* Resources */}
            {Object.entries(gameState.resources).map(([key, val]) => (
              <div key={key} className="text-center">
                <span className="text-lg">{RESOURCE_LABELS[key]?.emoji}</span>
                <p
                  className={`text-sm font-bold ${val <= 0 || val >= 100 ? 'text-red-400' : 'text-dodo-beige'}`}
                  style={{ textShadow: '0 1px 6px rgba(0,0,0,0.9)' }}
                >
                  {val}%
                </p>
              </div>
            ))}

            <div className="w-px h-8 bg-dodo-beige/15 mx-1" />

            {/* Stats */}
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-dodo-beige/50 text-[10px] uppercase tracking-wider" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}>
                  {stat.label}
                </p>
                <p className="text-dodo-beige text-sm font-bold" style={{ textShadow: '0 1px 6px rgba(0,0,0,0.9)' }}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Restart button */}
        {revealed && (
          <button
            onClick={onRestart}
            className="px-8 py-3 border border-dodo-beige/30 rounded-lg
              text-dodo-beige font-title text-lg tracking-wider
              hover:bg-dodo-orange hover:text-white hover:border-transparent
              transition-all duration-300 animate-slide-up"
            style={{ animationDelay: '0.2s', textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}
          >
            ПОПРОБОВАТЬ СНОВА
          </button>
        )}
      </div>
    </div>
  )
}
