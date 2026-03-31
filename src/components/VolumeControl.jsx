import React, { useState } from 'react'

export default function VolumeControl({ volume, onVolumeChange }) {
  const [open, setOpen] = useState(false)

  const isMuted = volume === 0

  const handleToggleMute = (e) => {
    e.stopPropagation()
    if (isMuted) {
      onVolumeChange(0.3)
    } else {
      onVolumeChange(0)
    }
  }

  return (
    <div
      className="fixed top-3 right-3 z-[9999] flex items-center gap-1.5"
      onPointerDown={(e) => e.stopPropagation()}
    >
      {open && (
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          className="w-16 h-1 accent-dodo-orange opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
          style={{ accentColor: '#FF6900' }}
        />
      )}
      <button
        onClick={(e) => {
          e.stopPropagation()
          setOpen((prev) => !prev)
        }}
        onDoubleClick={handleToggleMute}
        className="w-7 h-7 flex items-center justify-center rounded-full
          bg-black/30 backdrop-blur-sm border border-white/10
          text-white/40 hover:text-white/70 transition-all duration-200"
        title={open ? 'Двойной клик — мут' : 'Громкость'}
      >
        {isMuted ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : volume < 0.4 ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
          </svg>
        )}
      </button>
    </div>
  )
}
