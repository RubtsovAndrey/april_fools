import React, { useState, useCallback } from 'react'
import Card from './Card'
import ResourcePanel from './ResourcePanel'
import { eras } from '../engine/gameEngine'

export default function GameScreen({ gameState, currentCard, onSwipe, onMysteryCheat }) {
  const [prevResources, setPrevResources] = useState(null)
  const [affectedResources, setAffectedResources] = useState(null)

  const currentEra = eras[gameState.currentEraIndex]
  const isPizzeria = !!currentCard?.isPizzeria

  const handleHoverDirection = useCallback((dir) => {
    if (dir && currentCard) {
      setAffectedResources(currentCard.affects || [])
    } else {
      setAffectedResources(null)
    }
  }, [currentCard])

  const handleSwipe = useCallback((direction) => {
    setPrevResources({ ...gameState.resources })
    setAffectedResources(null)
    onSwipe(direction)
  }, [gameState.resources, onSwipe])

  return (
    <div className="w-full h-full flex flex-col relative overflow-hidden">
      {/* Background — switches to pizzeria bg during pizzeria cards */}
      <div className="absolute inset-0">
        <img
          src={isPizzeria ? '/backgrounds/bg_pizzeria.jpg' : currentEra?.background}
          alt=""
          className="w-full h-full object-cover transition-opacity duration-1000"
          onError={(e) => {
            e.target.style.display = 'none'
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: isPizzeria
              ? 'radial-gradient(ellipse at center, rgba(27,31,59,0.2) 0%, rgba(27,31,59,0.6) 100%)'
              : 'radial-gradient(ellipse at center, rgba(27,31,59,0.3) 0%, rgba(27,31,59,0.7) 100%)',
          }}
        />
      </div>

      {/* Resource Panel — top center curtain, hidden during pizzeria */}
      <div className="relative z-20 flex justify-center pt-0">
        <ResourcePanel
          resources={gameState.resources}
          prevResources={prevResources}
          affectedResources={affectedResources}
          hidden={isPizzeria}
          onMysteryCheat={onMysteryCheat}
        />
      </div>

      {/* Era indicator */}
      <div className="relative z-10 flex justify-center mt-1">
        <div className="text-dodo-beige/40 text-[10px] tracking-[0.2em] uppercase">
          {currentEra?.name} • {currentEra?.years} • Ход {gameState.totalCardsPlayed + 1}
        </div>
      </div>

      {/* Card area — centered */}
      <div className="flex-1 flex items-center justify-center relative z-10">
        {currentCard ? (
          <Card
            card={currentCard}
            onSwipe={handleSwipe}
            onHoverDirection={handleHoverDirection}
          />
        ) : (
          <div className="text-dodo-beige/50 text-center">
            <p className="font-title text-xl">Нет доступных карт</p>
            <p className="text-xs mt-2">Эра завершается...</p>
          </div>
        )}
      </div>

      {/* Era progress bar at bottom */}
      <div className="relative z-10 flex justify-center pb-3">
        <div className="flex items-center gap-2">
          <span className="text-dodo-beige/30 text-[9px] uppercase tracking-wider">Эра {currentEra?.id}/7</span>
          <div className="w-32 h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(212,197,169,0.1)' }}>
            <div
              className="h-full rounded-full bg-dodo-orange/50 resource-bar-fill"
              style={{
                width: `${(gameState.cardsPlayedInEra / (currentEra?.cardsNeeded || 10)) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
