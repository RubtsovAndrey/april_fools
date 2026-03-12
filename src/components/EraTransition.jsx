import React, { useState } from 'react'
import { eras } from '../engine/gameEngine'
import asset from '../utils/asset'

export default function EraTransition({ eraIndex, onContinue }) {
  const [revealed, setRevealed] = useState(false)
  const era = eras[eraIndex]

  React.useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 600)
    return () => clearTimeout(t)
  }, [])

  return (
    <div
      className="w-full h-full flex flex-col justify-end relative overflow-hidden cursor-pointer"
      onClick={onContinue}
    >
      {/* Background transition image — no overlay, shown as-is */}
      <div className="absolute inset-0">
        <img
          src={asset(era?.transition || '')}
          alt=""
          className="w-full h-full object-cover animate-fade-in"
          onError={(e) => { e.target.style.display = 'none' }}
        />
      </div>

      {/* Bottom gradient for text readability */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{
          height: '55%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0) 100%)',
        }}
      />

      {/* Content — cinematic bottom titles */}
      <div className="relative z-10 text-center px-6 pb-[6vh] max-w-2xl mx-auto">
        {/* Era number */}
        <div
          className="animate-slide-up text-dodo-beige/50 text-[11px] tracking-[0.5em] uppercase mb-3"
          style={{ animationDelay: '0.3s', textShadow: '0 1px 8px rgba(0,0,0,0.9)' }}
        >
          Эра {era?.id} из 7
        </div>

        {/* Era name */}
        <h1
          className="font-title text-5xl font-bold text-dodo-beige animate-slide-up mb-1.5"
          style={{
            textShadow: '0 2px 20px rgba(0,0,0,0.9), 0 0 60px rgba(0,0,0,0.5)',
            animationDelay: '0.5s',
          }}
        >
          {era?.name}
        </h1>

        {/* Subtitle */}
        <p
          className="font-title text-lg text-dodo-orange animate-slide-up mb-2"
          style={{ animationDelay: '0.7s', textShadow: '0 1px 12px rgba(0,0,0,0.9)' }}
        >
          {era?.subtitle}
        </p>

        {/* Years */}
        <p
          className="text-dodo-beige/60 text-sm tracking-[0.3em] animate-slide-up mb-4"
          style={{ animationDelay: '0.9s', textShadow: '0 1px 8px rgba(0,0,0,0.9)' }}
        >
          {era?.years}
        </p>

        {/* Description */}
        {revealed && (
          <p
            className="text-dodo-beige/70 text-sm leading-relaxed animate-slide-up mb-5"
            style={{ textShadow: '0 1px 6px rgba(0,0,0,0.9)' }}
          >
            {era?.description}
          </p>
        )}

        {/* Continue hint */}
        {revealed && (
          <p
            className="text-dodo-beige/30 text-[10px] tracking-[0.3em] uppercase animate-slide-up"
            style={{ textShadow: '0 1px 6px rgba(0,0,0,0.9)' }}
          >
            Нажмите, чтобы продолжить
          </p>
        )}
      </div>
    </div>
  )
}
