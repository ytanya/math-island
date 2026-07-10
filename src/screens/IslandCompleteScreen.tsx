import { useEffect, useMemo } from 'react'
import { Button, Card } from 'animal-island-ui'
import { playIslandCompleteFanfare } from '../utils/sound'
import { speakText } from '../utils/speech'
import './IslandCompleteScreen.css'

const CONFETTI_COLORS = ['#ffb300', '#ff6f61', '#4fc3f7', '#81c784', '#ba68c8', '#ffd54f']
const CONFETTI_COUNT = 36

interface IslandCompleteScreenProps {
  bells: number
  onClose: () => void
}

interface ConfettiPiece {
  color: string
  delay: number
  duration: number
  left: number
  rotate: number
}

export function IslandCompleteScreen({ bells, onClose }: IslandCompleteScreenProps) {
  const confettiPieces = useMemo<ConfettiPiece[]>(
    () =>
      Array.from({ length: CONFETTI_COUNT }, () => ({
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        delay: Math.random() * 1.2,
        duration: 2.6 + Math.random() * 1.6,
        left: Math.random() * 100,
        rotate: Math.random() * 360,
      })),
    [],
  )

  useEffect(() => {
    playIslandCompleteFanfare()
    speakText('Wow! You finished every treasure on Math Island! You should be so proud of yourself!')
  }, [])

  return (
    <main className="island-complete" data-testid="island-complete-screen">
      <div aria-hidden="true" className="island-complete__confetti">
        {confettiPieces.map((piece, index) => (
          <span
            className="island-complete__confetti-piece"
            key={index}
            style={{
              animationDelay: `${piece.delay}s`,
              animationDuration: `${piece.duration}s`,
              background: piece.color,
              left: `${piece.left}%`,
              transform: `rotate(${piece.rotate}deg)`,
            }}
          />
        ))}
      </div>

      <Card className="island-complete__card" color="app-yellow">
        <span aria-hidden="true" className="island-complete__trophy">
          🏆
        </span>
        <h1 className="island-complete__title">You did it!</h1>
        <p className="island-complete__message" data-testid="island-complete-message">
          You found every treasure on Math Island and collected {bells} bells. Be proud of
          yourself &mdash; that's amazing work!
        </p>
        <Button
          data-testid="island-complete-close-button"
          htmlType="button"
          onClick={onClose}
          type="primary"
        >
          Back to Island
        </Button>
      </Card>
    </main>
  )
}

export default IslandCompleteScreen
