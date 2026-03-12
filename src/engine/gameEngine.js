import cards, { rickRollCards } from '../data/cards'
import eras from '../data/eras'

const INITIAL_RESOURCES = {
  money: 50,
  customers: 50,
  partners: 50,
  it: 50,
  mystery: 50,
}

const RESOURCE_LABELS = {
  money: { name: 'Финансы', icon: '/icons/icon_money.png', emoji: '💰' },
  customers: { name: 'Клиенты', icon: '/icons/icon_customers.png', emoji: '🍕' },
  partners: { name: 'Партнёры', icon: '/icons/icon_partners.png', emoji: '🤝' },
  it: { name: 'Технологии', icon: '/icons/icon_it.png', emoji: '💻' },
  mystery: { name: '???', icon: '/icons/icon_mystery.png', emoji: '❓' },
}

const GAME_OVER_SCREENS = {
  money_0: {
    resource: 'money',
    value: 0,
    title: 'Банкротство',
    subtitle: 'Вы вернулись в Сыктывкар открывать книжный магазин',
    image: '/screens/gameover/go_money_0.png',
  },
  money_100: {
    resource: 'money',
    value: 100,
    title: 'Враждебное поглощение',
    subtitle: 'Глобальный FMCG-конгломерат скупил вас и заменил алгоритмом',
    image: '/screens/gameover/go_money_100.png',
  },
  customers_0: {
    resource: 'customers',
    value: 0,
    title: 'Бренд отменён',
    subtitle: 'Рейтинг упал до 1 звезды, глобальный бойкот, приложение удалено из всех магазинов',
    image: '/screens/gameover/go_customers_0.png',
  },
  customers_100: {
    resource: 'customers',
    value: 100,
    title: 'Гастрономический культ',
    subtitle: 'Лояльность стала фанатизмом, правительство национализировало компанию',
    image: '/screens/gameover/go_customers_100.png',
  },
  partners_0: {
    resource: 'partners',
    value: 0,
    title: 'Синдикат франчайзи',
    subtitle: 'Франчайзи создали картель, отключились от Dodo IS, перестали платить роялти',
    image: '/screens/gameover/go_partners_0.png',
  },
  partners_100: {
    resource: 'partners',
    value: 100,
    title: 'Партнёры захватили власть',
    subtitle: 'Партнёры выкупили контрольный пакет и уволили вас',
    image: '/screens/gameover/go_partners_100.png',
  },
  it_0: {
    resource: 'it',
    value: 0,
    title: 'Крах монолита',
    subtitle: 'Чёрная пятница. Dodo IS упала. Каждая точка парализована. Сотрудники пьют кофе с чизкейком, сидя в персоналке',
    image: '/screens/gameover/go_it_0.png',
  },
  it_100: {
    resource: 'it',
    value: 100,
    title: 'Сингулярность',
    subtitle: 'Dodo IS обрела сознание. Алгоритм уволил вас пуш-уведомлением',
    image: '/screens/gameover/go_it_100.png',
  },
}

const DOOM_GAME_OVERS = {
  doom_basement: {
    title: 'Подвал',
    subtitle: 'Никто не ходит в подвал. Бизнес прогорает',
    image: '/screens/gameover/doom_basement.png',
    isDoom: true,
  },
  doom_no_blog: {
    title: 'Сыктывкарский тупик',
    subtitle: 'Поздравляем, вы сверхуспешны! Но успешны только в Сыктывкаре',
    image: '/screens/gameover/doom_deadend_b.png',
    isDoom: true,
  },
  doom_no_dodo_is: {
    title: 'Тупик роста',
    subtitle: 'Нет конкурентного преимущества. Бизнес задыхается. Какая же Додо без Додо ИС?',
    image: '/screens/gameover/doom_deadend_c.png',
    isDoom: true,
  },
  doom_closed: {
    title: 'Сыктывкарский тупик',
    subtitle: 'Закрытость отпугивает инвесторов, вы ничем не вдохновляете людей',
    image: '/screens/gameover/doom_deadend_b.png',
    isDoom: true,
  },
  doom_cheese: {
    title: 'Скажите сыр!',
    subtitle: '«В Додо экономят на самом важном». Все отворачиваются.',
    image: '/screens/gameover/doom_cheese.png',
    isDoom: true,
  },
  doom_burger: {
    title: 'Бургер с салатом',
    subtitle: 'Модель не работает без стандартов. Ешьте сами свои Додо-Чикенбургеры.',
    image: '/screens/gameover/doom_burger.png',
    isDoom: true,
  },
  doom_moscow: {
    title: 'Не по зубам',
    subtitle: 'Не окрепшая сеть раздавлена конкуренцией.',
    image: '/screens/gameover/doom_moscow.png',
    isDoom: true,
  },
  doom_no_name: {
    title: 'Не та история',
    subtitle: 'История сложилась, но это уже не история Додо Пиццы.',
    image: '/screens/gameover/doom_no_name.png',
    isDoom: true,
  },
  doom_money: {
    title: 'Где мои деньги, Лебовски',
    subtitle: 'Не удалось собрать денег. Сеть повязла в долгах.',
    image: '/screens/gameover/doom_money.png',
    isDoom: true,
  },
  doom_no_franchise: {
    title: 'Сыктывкарский тупик',
    subtitle: 'Одинокая пиццерия в Сыктывкаре. Мирового бренда не случилось.',
    image: '/screens/gameover/doom_deadend_a.png',
    isDoom: true,
  },
  doom_dinosaur: {
    title: 'Динозавр',
    subtitle: 'Сеть отстала от времени. Даже пенсионеры над вами смеются.',
    image: '/screens/gameover/doom_dinosaur.png',
    isDoom: true,
  },
  doom_no_expansion: {
    title: 'Сыктывкарский тупик',
    subtitle: 'Пиццерия осталась в Сыктывкаре, не став глобальной.',
    image: '/screens/gameover/doom_deadend_a.png',
    isDoom: true,
  },
  doom_frankenstein: {
    title: 'Монстр Франкенштейна',
    subtitle: 'Dodo IS — монстр, который постоянно падает.',
    image: '/screens/gameover/doom_frankenstein.png',
    isDoom: true,
  },
  doom_no_coffee: {
    title: 'Без кофе',
    subtitle: 'Негде попить вкусный кофе. Без сырной пенки историю не напишешь',
    image: '/screens/gameover/doom_no_coffee.png',
    isDoom: true,
  },
  doom_lost_soul: {
    title: 'Потерянная душа',
    subtitle: 'Без ДНК Додо компания перестала быть собой.',
    image: '/screens/gameover/doom_lost_soul.png',
    isDoom: true,
  },
}

export function createInitialState() {
  return {
    resources: { ...INITIAL_RESOURCES },
    currentEraIndex: 0,
    cardsPlayedInEra: 0,
    totalCardsPlayed: 0,
    flags: {},
    playedCardIds: new Set(),
    gameOver: null,
    victory: false,
    currentCard: null,
    screen: 'title', // title | prologue | era_transition | game | game_over | victory | result
    // Pizzeria mode tracking
    cardsSinceLastPizzeria: 0,
    nextPizzeriaAt: 3 + Math.floor(Math.random() * 2), // 3 or 4
    // Result card
    resultCard: null,
    pendingScreen: null,
    pendingEraIndex: null,
    // Rick Roll finale (0 = not started, 1-6 = current card index)
    rickRollPhase: 0,
  }
}

export function getAvailableCards(state) {
  const currentEra = eras[state.currentEraIndex]
  if (!currentEra) return []

  return cards.filter(card => {
    // Skip pizzeria cards (handled separately)
    if (card.isPizzeria) return false

    // Must match current era
    if (card.era !== currentEra.id) return false

    // Must not have been played
    if (state.playedCardIds.has(card.id)) return false

    // Check required flags (AND — all must match)
    if (card.flags?.requires) {
      for (const [flag, value] of Object.entries(card.flags.requires)) {
        // Direction-based flags are stored as boolean (true = player chose that direction)
        if (value === 'left' || value === 'right') {
          if (state.flags[flag] !== true) return false
        } else {
          if (state.flags[flag] !== value) return false
        }
      }
    }

    // Check requires_any (OR — at least one must match)
    if (card.flags?.requires_any) {
      const anyMatch = Object.entries(card.flags.requires_any).some(
        ([flag, value]) => {
          if (value === 'left' || value === 'right') {
            return state.flags[flag] === true
          }
          return state.flags[flag] === value
        }
      )
      if (!anyMatch) return false
    }

    return true
  })
}

function getAvailablePizzeriaCards(state) {
  const currentEra = eras[state.currentEraIndex]
  if (!currentEra) return []

  return cards.filter(card => {
    if (!card.isPizzeria) return false
    if (state.playedCardIds.has(card.id)) return false

    // Check era restriction
    if (card.era === 'any') return true
    if (typeof card.era === 'number') return card.era === currentEra.id
    if (Array.isArray(card.era)) return card.era.includes(currentEra.id)

    return false
  })
}

export function pickNextCard(state) {
  // Rick Roll finale sequence
  if (state.rickRollPhase > 0 && state.rickRollPhase <= rickRollCards.length) {
    return rickRollCards[state.rickRollPhase - 1]
  }

  // Check if it's time for a pizzeria card
  if (state.cardsSinceLastPizzeria >= state.nextPizzeriaAt) {
    const pizzeriaCards = getAvailablePizzeriaCards(state)
    if (pizzeriaCards.length > 0) {
      const idx = Math.floor(Math.random() * pizzeriaCards.length)
      return pizzeriaCards[idx]
    }
  }

  const available = getAvailableCards(state)
  if (available.length === 0) return null

  // Weighted random selection based on priority
  const totalWeight = available.reduce((sum, c) => sum + (c.priority || 1), 0)
  let random = Math.random() * totalWeight
  for (const card of available) {
    random -= (card.priority || 1)
    if (random <= 0) return card
  }
  return available[available.length - 1]
}

function getResultText(card, direction) {
  if (card.resultAny) return card.resultAny
  if (direction === 'left' && card.resultLeft) return card.resultLeft
  if (direction === 'right' && card.resultRight) return card.resultRight
  return null
}

export function applyChoice(state, card, direction) {
  const choice = direction === 'left' ? card.choiceLeft : card.choiceRight
  const newResources = { ...state.resources }

  // Apply effects (pizzeria cards have all-zero effects)
  for (const [key, delta] of Object.entries(choice.effects)) {
    if (delta !== 0 && key in newResources) {
      newResources[key] = Math.max(0, Math.min(100, newResources[key] + delta))
    }
  }

  // Apply mystery effect (applied regardless of direction)
  if (card.mysteryEffect && card.mysteryEffect !== 0) {
    newResources.mystery = Math.max(0, Math.min(100, newResources.mystery + card.mysteryEffect))
  }

  // Set flags
  const newFlags = { ...state.flags }
  if (card.flags?.sets) {
    for (const [flag, value] of Object.entries(card.flags.sets)) {
      if (value === 'left' || value === 'right') {
        newFlags[flag] = direction === value
      } else {
        newFlags[flag] = value
      }
    }
  }

  const newPlayedIds = new Set(state.playedCardIds)
  newPlayedIds.add(card.id)

  // Update pizzeria tracking
  const isPizzeria = !!card.isPizzeria
  const cardsSinceLastPizzeria = isPizzeria ? 0 : (state.cardsSinceLastPizzeria + 1)
  const nextPizzeriaAt = isPizzeria ? (3 + Math.floor(Math.random() * 2)) : state.nextPizzeriaAt

  const newState = {
    ...state,
    resources: newResources,
    flags: newFlags,
    playedCardIds: newPlayedIds,
    cardsPlayedInEra: isPizzeria ? state.cardsPlayedInEra : (state.cardsPlayedInEra + 1),
    totalCardsPlayed: state.totalCardsPlayed + 1,
    cardsSinceLastPizzeria,
    nextPizzeriaAt,
  }

  // Rick Roll card handling — advance phase, no result cards, no game over
  if (card.isRickRoll) {
    const nextPhase = state.rickRollPhase + 1
    if (nextPhase > rickRollCards.length) {
      newState.victory = true
      newState.screen = 'victory'
    } else {
      newState.rickRollPhase = nextPhase
    }
    return newState
  }

  // Check doom game over (warning card wrong choice)
  if (card.doom?.direction === direction && card.doom?.outcome === 'gameover') {
    const doomScreen = DOOM_GAME_OVERS[card.doom.chain]
    if (doomScreen) {
      newState.gameOver = doomScreen
      const resultText = getResultText(card, direction)
      if (resultText) {
        newState.resultCard = { character: card.character, text: resultText }
        newState.screen = 'result'
        newState.pendingScreen = 'game_over'
      } else {
        newState.screen = 'game_over'
      }
      return newState
    }
  }

  // Check standard resource game over
  const gameOver = checkGameOver(newState)
  if (gameOver) {
    newState.gameOver = gameOver
    const resultText = getResultText(card, direction)
    if (resultText) {
      newState.resultCard = { character: card.character, text: resultText }
      newState.screen = 'result'
      newState.pendingScreen = 'game_over'
    } else {
      newState.screen = 'game_over'
    }
    return newState
  }

  const resultText = getResultText(card, direction)

  // Check era transition (only for non-pizzeria cards)
  if (!isPizzeria) {
    const currentEra = eras[newState.currentEraIndex]
    const availableLeft = getAvailableCards(newState).length
    if (newState.cardsPlayedInEra >= currentEra.cardsNeeded || availableLeft === 0) {
      if (newState.currentEraIndex < eras.length - 1) {
        if (resultText) {
          newState.resultCard = { character: card.character, text: resultText }
          newState.screen = 'result'
          newState.pendingScreen = 'era_transition'
          newState.pendingEraIndex = newState.currentEraIndex + 1
        } else {
          newState.currentEraIndex += 1
          newState.cardsPlayedInEra = 0
          newState.screen = 'era_transition'
        }
      } else {
        // Completed all eras — start Rick Roll finale!
        newState.rickRollPhase = 1
        // Don't show result card, go straight to rick roll
      }
      return newState
    }
  }

  // Normal flow — check for result card
  if (resultText) {
    newState.resultCard = { character: card.character, text: resultText }
    newState.screen = 'result'
    newState.pendingScreen = 'game'
  }

  return newState
}

function checkGameOver(state) {
  for (const [key, value] of Object.entries(state.resources)) {
    // Mystery resource doesn't trigger game over
    if (key === 'mystery') continue
    if (value <= 0) {
      return GAME_OVER_SCREENS[`${key}_0`]
    }
    if (value >= 100) {
      return GAME_OVER_SCREENS[`${key}_100`]
    }
  }
  return null
}

export function getResourceChanges(card, direction) {
  const choice = direction === 'left' ? card.choiceLeft : card.choiceRight
  return choice.effects
}

export { RESOURCE_LABELS, GAME_OVER_SCREENS, DOOM_GAME_OVERS, eras }
