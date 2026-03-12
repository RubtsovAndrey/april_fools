import React, { useState, useEffect } from 'react'
import { RESOURCE_LABELS } from '../engine/gameEngine'
import asset from '../utils/asset'

export default function VictoryScreen({ gameState, onRestart }) {
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 1200)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="w-full h-full flex flex-col justify-end relative overflow-hidden">
      {/* Background — no overlay */}
      <div className="absolute inset-0">
        <img
          src={asset('/screens/screen_victory.png')}
          alt=""
          className="w-full h-full object-cover animate-fade-in"
          onError={(e) => { e.target.style.display = 'none' }}
        />
      </div>

      {/* Bottom gradient for text readability */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: '60%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.65) 40%, rgba(0,0,0,0) 100%)',
        }}
      />

      {/* Content — bottom-aligned cinematic titles */}
      <div className="relative z-10 text-center px-6 pb-[5vh] max-w-2xl mx-auto">
        {/* Victory badge */}
        <div
          className="text-5xl mb-2 animate-slide-up"
          style={{ animationDelay: '0.3s' }}
        >
          👑
        </div>

        <p
          className="text-dodo-orange text-xs tracking-[0.5em] uppercase mb-3 animate-slide-up"
          style={{ animationDelay: '0.5s', textShadow: '0 1px 8px rgba(0,0,0,0.9)' }}
        >
          Победа
        </p>

        <h1
          className="font-title text-4xl font-bold text-dodo-beige mb-2 animate-slide-up"
          style={{
            textShadow: '0 2px 20px rgba(0,0,0,0.9), 0 0 40px rgba(196,123,53,0.3)',
            animationDelay: '0.7s',
          }}
        >
          Легенда FoodTech
        </h1>

        <p
          className="text-dodo-beige/80 text-sm mb-5 animate-slide-up italic"
          style={{ animationDelay: '0.9s', textShadow: '0 1px 8px rgba(0,0,0,0.9)' }}
        >
          Вы провели Dodo Brands через все кризисы и построили глобальную империю.
          1500+ точек в 25 странах. Стратегия 2030 реализована.
        </p>

        {/* Final resources + Stats in one row */}
        {revealed && (
          <div className="flex items-center justify-center gap-6 mb-5 animate-slide-up">
            {Object.entries(gameState.resources).map(([key, val]) => (
              <div key={key} className="text-center">
                <span className="text-lg">{RESOURCE_LABELS[key]?.emoji}</span>
                <p className="text-dodo-beige text-sm font-bold" style={{ textShadow: '0 1px 6px rgba(0,0,0,0.9)' }}>{val}%</p>
                <p className="text-dodo-beige/50 text-[9px]" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}>{RESOURCE_LABELS[key]?.name}</p>
              </div>
            ))}

            <div className="w-px h-8 bg-dodo-beige/15 mx-2" />

            <div className="text-center">
              <p className="text-dodo-beige/50 text-[10px] uppercase tracking-wider" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}>Ходов</p>
              <p className="text-dodo-beige text-lg font-bold" style={{ textShadow: '0 1px 6px rgba(0,0,0,0.9)' }}>{gameState.totalCardsPlayed}</p>
            </div>
            <div className="text-center">
              <p className="text-dodo-beige/50 text-[10px] uppercase tracking-wider" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}>Эр</p>
              <p className="text-dodo-beige text-lg font-bold" style={{ textShadow: '0 1px 6px rgba(0,0,0,0.9)' }}>7 / 7</p>
            </div>
          </div>
        )}

        {/* Play again */}
        {revealed && (
          <button
            onClick={onRestart}
            className="px-8 py-3 border border-dodo-orange/50 rounded-lg
              text-dodo-orange font-title text-lg tracking-wider
              hover:bg-dodo-orange hover:text-white hover:border-transparent
              transition-all duration-300 animate-slide-up"
            style={{ animationDelay: '0.2s', textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}
          >
            ИГРАТЬ СНОВА
          </button>
        )}
      </div>
    </div>
  )
}
