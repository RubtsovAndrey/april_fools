import React, { useState, useCallback, useEffect } from 'react'
import StartScreen from './components/StartScreen'
import PrologueScreen from './components/PrologueScreen'
import GameScreen from './components/GameScreen'
import EraTransition from './components/EraTransition'
import GameOverScreen from './components/GameOverScreen'
import VictoryScreen from './components/VictoryScreen'
import ResultCard from './components/ResultCard'
import AudioManager from './components/AudioManager'
import { createInitialState, applyChoice, pickNextCard } from './engine/gameEngine'

export default function App() {
  const [gameState, setGameState] = useState(createInitialState())
  const [currentCard, setCurrentCard] = useState(null)

  // Pick next card when entering game screen or after swipe
  useEffect(() => {
    if (gameState.screen === 'game' && !currentCard) {
      const card = pickNextCard(gameState)
      if (card) {
        setCurrentCard(card)
      } else {
        // No cards available — force era transition or victory
        if (gameState.currentEraIndex < 6) {
          setGameState(prev => ({
            ...prev,
            currentEraIndex: prev.currentEraIndex + 1,
            cardsPlayedInEra: 0,
            screen: 'era_transition',
          }))
        } else {
          setGameState(prev => ({ ...prev, victory: true, screen: 'victory' }))
        }
      }
    }
  }, [gameState.screen, currentCard, gameState])

  const handleStart = useCallback(() => {
    setGameState(prev => ({ ...prev, screen: 'prologue' }))
  }, [])

  const handlePrologueComplete = useCallback(() => {
    setGameState(prev => ({ ...prev, screen: 'era_transition' }))
  }, [])

  const handleEraTransitionComplete = useCallback(() => {
    setGameState(prev => ({ ...prev, screen: 'game' }))
    setCurrentCard(null)
  }, [])

  const handleSwipe = useCallback((direction) => {
    if (!currentCard) return

    const newState = applyChoice(gameState, currentCard, direction)
    setGameState(newState)

    if (newState.screen === 'game') {
      // Pick next card after a brief delay for animation
      setCurrentCard(null)
    } else {
      setCurrentCard(null)
    }
  }, [gameState, currentCard])

  const handleResultDismiss = useCallback(() => {
    setGameState(prev => {
      const next = { ...prev, resultCard: null, screen: prev.pendingScreen || 'game' }
      // If transitioning era, apply the deferred era change
      if (prev.pendingScreen === 'era_transition' && prev.pendingEraIndex != null) {
        next.currentEraIndex = prev.pendingEraIndex
        next.cardsPlayedInEra = 0
      }
      next.pendingScreen = null
      next.pendingEraIndex = null
      return next
    })
    setCurrentCard(null)
  }, [])

  const handleMysteryCheat = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      resources: { money: 50, customers: 50, partners: 50, it: 50, mystery: 50 },
    }))
  }, [])

  const handleRestart = useCallback(() => {
    setGameState(createInitialState())
    setCurrentCard(null)
  }, [])

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState.screen === 'game' && currentCard) {
        if (e.key === 'ArrowLeft' || e.key === 'a') {
          handleSwipe('left')
        } else if (e.key === 'ArrowRight' || e.key === 'd') {
          handleSwipe('right')
        }
      } else if (gameState.screen === 'title') {
        if (e.key === 'Enter' || e.key === ' ') {
          handleStart()
        }
      } else if (gameState.screen === 'era_transition') {
        if (e.key === 'Enter' || e.key === ' ') {
          handleEraTransitionComplete()
        }
      } else if (gameState.screen === 'result') {
        if (e.key === 'Enter' || e.key === ' ') {
          handleResultDismiss()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameState.screen, currentCard, handleSwipe, handleStart, handleEraTransitionComplete, handleResultDismiss])

  return (
    <div className="w-screen h-screen overflow-hidden" style={{ backgroundColor: '#3D2B1F' }}>
      <AudioManager
        screen={gameState.screen}
        eraIndex={gameState.currentEraIndex}
        rickRollPhase={gameState.rickRollPhase || 0}
      />
      {gameState.screen === 'title' && (
        <StartScreen onStart={handleStart} />
      )}

      {gameState.screen === 'prologue' && (
        <PrologueScreen onComplete={handlePrologueComplete} />
      )}

      {gameState.screen === 'era_transition' && (
        <EraTransition
          eraIndex={gameState.currentEraIndex}
          onContinue={handleEraTransitionComplete}
        />
      )}

      {gameState.screen === 'game' && (
        <GameScreen
          gameState={gameState}
          currentCard={currentCard}
          onSwipe={handleSwipe}
          onMysteryCheat={handleMysteryCheat}
        />
      )}

      {gameState.screen === 'result' && gameState.resultCard && (
        <ResultCard
          resultCard={gameState.resultCard}
          onDismiss={handleResultDismiss}
        />
      )}

      {gameState.screen === 'game_over' && (
        <GameOverScreen
          gameOver={gameState.gameOver}
          gameState={gameState}
          onRestart={handleRestart}
        />
      )}

      {gameState.screen === 'victory' && (
        <VictoryScreen
          gameState={gameState}
          onRestart={handleRestart}
        />
      )}
    </div>
  )
}
