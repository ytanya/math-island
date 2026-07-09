import { useEffect, useState } from 'react'
import { Button, Tag, Time, Title, Wallet } from 'animal-island-ui'
import islandMap from '../assets/adventure-island.png'
import { MusicToggleButton } from '../components/MusicToggleButton'
import {
  CAMBRIDGE_PRIMARY_MATH_BOOK1,
  CAMBRIDGE_PRIMARY_MATH_BOOK1_ID,
  getNextUnitId,
  getUnitById,
} from '../curriculums/cambridgePrimaryMathBook1'
import type { ChildProfile } from '../types'
import { playClickSound, playCoinSound, playTreasureUnlockSound } from '../utils/sound'
import './HomeScreen.css'

const COIN_END_LEFT = '50%'
const COIN_END_TOP = '10%'
const COIN_ANIMATION_DURATION_MS = 1200

interface PendingCoinAnimation {
  unitId: string
  coinsEarned: number
}

interface HomeScreenProps {
  profile: ChildProfile
  onPlayTreasure: (unitId: string) => void
  onOpenParents?: () => void
  pendingCoinAnimation: PendingCoinAnimation | null
  onCoinAnimationComplete: () => void
}

interface CoinFlightState {
  left: string
  top: string
}

export function HomeScreen({
  profile,
  onPlayTreasure,
  onOpenParents,
  pendingCoinAnimation,
  onCoinAnimationComplete,
}: HomeScreenProps) {
  const [coinFlight, setCoinFlight] = useState<CoinFlightState | null>(null)
  const levelProgress = profile.levelProgress[CAMBRIDGE_PRIMARY_MATH_BOOK1_ID]

  useEffect(() => {
    if (!pendingCoinAnimation) {
      return
    }

    const unit = getUnitById(CAMBRIDGE_PRIMARY_MATH_BOOK1, pendingCoinAnimation.unitId)

    if (!unit) {
      onCoinAnimationComplete()
      return
    }

    playCoinSound()
    setCoinFlight({ left: unit.mapLeft, top: unit.mapTop })

    const flightTimeout = setTimeout(() => {
      setCoinFlight({ left: COIN_END_LEFT, top: COIN_END_TOP })
    }, 20)

    const finishTimeout = setTimeout(() => {
      const nextUnitId = getNextUnitId(CAMBRIDGE_PRIMARY_MATH_BOOK1, pendingCoinAnimation.unitId)

      if (nextUnitId !== null) {
        playTreasureUnlockSound()
      }

      setCoinFlight(null)
      onCoinAnimationComplete()
    }, COIN_ANIMATION_DURATION_MS)

    return () => {
      clearTimeout(flightTimeout)
      clearTimeout(finishTimeout)
    }
  }, [pendingCoinAnimation, onCoinAnimationComplete])

  return (
    <main className="home-screen" data-testid="home-screen">
      <section className="home-screen__map" aria-label="Math Island map">
        <img
          alt="Illustrated treasure island map"
          className="home-screen__map-image"
          src={islandMap}
        />

        <header className="home-screen__header">
          <div className="home-screen__title">
            <Title size="large" color="app-yellow">
              Math Island
            </Title>
            <Time className="home-screen__time" />
          </div>

          <div className="home-screen__actions">
            <Wallet value={profile.bells} size="medium" />
            <div className="home-screen__action-buttons">
              <MusicToggleButton />
              {onOpenParents ? (
                <Button size="small" type="text" onClick={onOpenParents}>
                  Parents
                </Button>
              ) : null}
            </div>
          </div>
        </header>

        {CAMBRIDGE_PRIMARY_MATH_BOOK1.units.map((unit) => {
          const treasure = levelProgress.treasures[unit.id]
          const isAvailable = unit.id === levelProgress.currentAvailableTreasureId
          const isCompleted = treasure.completed
          const isLocked = !isAvailable && !isCompleted

          return (
            <div
              className="home-screen__treasure-hotspot"
              data-testid={`treasure-${unit.id}`}
              key={unit.id}
              style={{ left: unit.mapLeft, top: unit.mapTop }}
            >
              {isLocked ? (
                <div aria-hidden="true" className="home-screen__treasure-marker--locked">
                  <span className="home-screen__treasure-emoji">🔒</span>
                </div>
              ) : (
                <Button
                  className="home-screen__treasure-marker"
                  data-testid={`play-button-${unit.id}`}
                  htmlType="button"
                  onClick={() => {
                    playClickSound()
                    onPlayTreasure(unit.id)
                  }}
                  type="primary"
                >
                  <span className="home-screen__treasure-emoji" aria-hidden="true">
                    🗝️
                  </span>
                  <span className="home-screen__treasure-name">{unit.name}</span>
                  <div className="home-screen__tag-slot">
                    {isCompleted ? (
                      <span data-testid={`treasure-coins-${unit.id}`}>
                        <Tag color="app-green" size="small">
                          {`🪙 ${treasure.coinsEarned}`}
                        </Tag>
                      </span>
                    ) : null}
                  </div>
                </Button>
              )}
            </div>
          )
        })}

        {coinFlight ? (
          <span
            aria-hidden="true"
            className="home-screen__treasure-coin"
            data-testid="treasure-coin-flight"
            style={{ left: coinFlight.left, top: coinFlight.top }}
          >
            🪙
          </span>
        ) : null}
      </section>
    </main>
  )
}

export default HomeScreen
