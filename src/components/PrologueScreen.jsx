import React, { useState, useEffect } from 'react'

export default function PrologueScreen({ onComplete }) {
  const [step, setStep] = useState(0)

  const lines = [
    'На кон поставлено всё.',
    'Перед вами — маленькая пиццерия в Сыктывкаре.',
    'Четыре показателя определят вашу судьбу:',
    'Финансы  •  Клиенты  •  Партнёры  •  Технологии',
    'Если любой из них упадёт до нуля или достигнет максимума, то дело — труба.',
    'Свайпайте карточки влево или вправо. Каждое решение меняет баланс.',
    'Удачи, CEO.',
  ]

  useEffect(() => {
    if (step < lines.length) {
      const t = setTimeout(() => setStep(s => s + 1), 1800)
      return () => clearTimeout(t)
    }
  }, [step, lines.length])

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/screens/screen_prologue.png"
          alt=""
          className="w-full h-full object-cover"
          onError={(e) => { e.target.style.display = 'none' }}
        />
        <div className="absolute inset-0" style={{ background: 'rgba(27, 31, 59, 0.7)' }} />
      </div>

      {/* Text lines */}
      <div className="relative z-10 max-w-lg text-center space-y-4 px-6">
        {lines.slice(0, step).map((line, i) => (
          <p
            key={`line-${i}`}
            className={`
              font-title text-dodo-beige animate-slide-up
              ${i === lines.length - 1 ? 'text-xl font-bold text-dodo-orange mt-6' : 'text-base'}
              ${i === 3 ? 'text-sm tracking-wider' : ''}
            `}
            style={{ animationDuration: '0.6s' }}
          >
            {line}
          </p>
        ))}
      </div>

      {/* Skip / Continue button */}
      {step >= lines.length && (
        <button
          onClick={onComplete}
          className="relative z-10 mt-10 px-8 py-3 border border-dodo-beige/30 rounded-lg
            text-dodo-beige font-title text-lg tracking-wider
            hover:bg-dodo-orange hover:text-white hover:border-transparent
            transition-all duration-300 animate-slide-up"
        >
          ВСЁ ТОЛЬКО НАЧИНАЕТСЯ!
        </button>
      )}

      {step < lines.length && (
        <button
          onClick={() => setStep(lines.length)}
          className="relative z-10 mt-10 text-dodo-beige/30 text-xs tracking-widest uppercase
            hover:text-dodo-beige/60 transition-colors"
        >
          Пропустить →
        </button>
      )}
    </div>
  )
}
