import { useEffect, useState } from 'react'
import { Button, Title, Wallet } from 'animal-island-ui'
import islandMap from '../assets/math-island.png'
import treasureChestIcon from '../assets/treasure-chest.png'
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
      <header className="home-screen__header">
        <div className="home-screen__title">
          <Title size="large" color="app-yellow">
            Math Island
          </Title>
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

      <div className="home-screen__map-wrapper">
        <section className="home-screen__map" aria-label="Math Island map">
          <img
            alt="Illustrated treasure island map"
            className="home-screen__map-image"
            src={islandMap}
          />

          <svg
            aria-hidden="true"
            className="home-screen__path"
            data-testid="treasure-path"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            {CAMBRIDGE_PRIMARY_MATH_BOOK1.units.slice(0, -1).map((unit, index) => {
              const nextUnit = CAMBRIDGE_PRIMARY_MATH_BOOK1.units[index + 1]
              const isTraveled = levelProgress.treasures[unit.id].completed

              return (
                <line
                  className={[
                    'home-screen__path-segment',
                    isTraveled ? 'home-screen__path-segment--traveled' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  key={unit.id}
                  vectorEffect="non-scaling-stroke"
                  x1={parseFloat(unit.mapLeft)}
                  x2={parseFloat(nextUnit.mapLeft)}
                  y1={parseFloat(unit.mapTop)}
                  y2={parseFloat(nextUnit.mapTop)}
                />
              )
            })}
          </svg>

          {CAMBRIDGE_PRIMARY_MATH_BOOK1.units.map((unit, index) => {
            const treasure = levelProgress.treasures[unit.id]
            const isAvailable = unit.id === levelProgress.currentAvailableTreasureId
            const isCompleted = treasure.completed
            const isCurrent = isAvailable && !isCompleted
            const isLocked = !isAvailable && !isCompleted
            const stepNumber = index + 1

            if (isLocked) {
              return (
                <div
                  aria-hidden="true"
                  className="home-screen__treasure-hotspot home-screen__treasure-hotspot--locked"
                  data-testid={`locked-${unit.id}`}
                  key={unit.id}
                  style={{ left: unit.mapLeft, top: unit.mapTop }}
                >
                  <img alt="" className="home-screen__treasure-icon" src={treasureChestIcon} />
                  <span className="home-screen__treasure-step" data-testid={`step-${unit.id}`}>
                    {stepNumber}
                  </span>
                </div>
              )
            }

            return (
              <button
                aria-label={`Play ${unit.name}`}
                className={[
                  'home-screen__treasure-hotspot',
                  isCurrent ? 'home-screen__treasure-hotspot--current' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                data-testid={`play-button-${unit.id}`}
                key={unit.id}
                onClick={() => {
                  playClickSound()
                  onPlayTreasure(unit.id)
                }}
                style={{ left: unit.mapLeft, top: unit.mapTop }}
                type="button"
              >
                <img alt="" className="home-screen__treasure-icon" src={treasureChestIcon} />
                <span className="home-screen__treasure-step" data-testid={`step-${unit.id}`}>
                  {stepNumber}
                </span>
              </button>
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
      </div>
    </main>
  )
}

export default HomeScreen
