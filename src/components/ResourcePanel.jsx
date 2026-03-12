import React, { useState, useEffect, useRef } from 'react'
import { RESOURCE_LABELS } from '../engine/gameEngine'

const RESOURCE_KEYS = ['money', 'customers', 'partners', 'it']
const MYSTERY_KEY = 'mystery'

function ResourceIcon({ resourceKey, value, prevValue, showAffected }) {
  const [flash, setFlash] = useState(false)
  const label = RESOURCE_LABELS[resourceKey]
  const isLow = value <= 15
  const isHigh = value >= 85

  useEffect(() => {
    if (prevValue !== undefined && prevValue !== value) {
      setFlash(true)
      const t = setTimeout(() => setFlash(false), 500)
      return () => clearTimeout(t)
    }
  }, [value, prevValue])

  return (
    <div className="flex flex-col items-center gap-1">
      {/* Icon */}
      <div
        className={`
          w-10 h-10 rounded-full flex items-center justify-center
          transition-all duration-300
          ${flash ? 'animate-resource-flash' : ''}
          ${showAffected ? 'ring-2 ring-dodo-orange animate-pulse-glow' : ''}
        `}
        style={{ backgroundColor: '#3D2B1F' }}
      >
        <img
          src={label.icon}
          alt={label.name}
          className="w-7 h-7 object-contain"
          onError={(e) => {
            e.target.style.display = 'none'
            e.target.parentElement.textContent = label.emoji
          }}
        />
      </div>

      {/* Bar */}
      <div className="w-10 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: '#1B1F3B' }}>
        <div
          className={`h-full rounded-full resource-bar-fill ${
            isLow ? 'bg-red-500' : isHigh ? 'bg-yellow-400' : 'bg-dodo-beige'
          }`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

export default function ResourcePanel({ resources, prevResources, affectedResources, hidden, onMysteryCheat }) {
  const clickCount = useRef(0)
  const clickTimer = useRef(null)

  const handleMysteryClick = () => {
    clickCount.current += 1
    if (clickTimer.current) clearTimeout(clickTimer.current)
    clickTimer.current = setTimeout(() => { clickCount.current = 0 }, 2000)
    if (clickCount.current >= 7) {
      clickCount.current = 0
      onMysteryCheat?.()
    }
  }

  return (
    <div
      className={`flex items-center justify-center transition-all duration-1000 ${
        hidden ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
      }`}
    >
      <div
        className="flex items-center gap-5 px-6 py-2.5 rounded-b-2xl shadow-lg"
        style={{
          backgroundColor: 'rgba(61, 43, 31, 0.95)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(212, 197, 169, 0.2)',
          borderLeft: '1px solid rgba(212, 197, 169, 0.1)',
          borderRight: '1px solid rgba(212, 197, 169, 0.1)',
        }}
      >
        {RESOURCE_KEYS.map(key => (
          <ResourceIcon
            key={key}
            resourceKey={key}
            value={resources[key]}
            prevValue={prevResources?.[key]}
            showAffected={affectedResources?.includes(key)}
          />
        ))}
        {/* Mystery resource — clickable for cheat code */}
        <div className="ml-1 border-l border-dodo-beige/10 pl-3" onClick={handleMysteryClick}>
          <ResourceIcon
            resourceKey={MYSTERY_KEY}
            value={resources[MYSTERY_KEY] ?? 50}
            prevValue={prevResources?.[MYSTERY_KEY]}
            showAffected={affectedResources?.includes(MYSTERY_KEY)}
          />
        </div>
      </div>
    </div>
  )
}
