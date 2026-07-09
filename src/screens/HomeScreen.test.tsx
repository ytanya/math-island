import { act, fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import {
  CAMBRIDGE_PRIMARY_MATH_BOOK1,
  CAMBRIDGE_PRIMARY_MATH_BOOK1_ID,
} from '../curriculums/cambridgePrimaryMathBook1'
import type { ChildProfile } from '../types'
import { HomeScreen } from './HomeScreen'

const buildProfile = (): ChildProfile => ({
  name: 'Explorer',
  bells: 8,
  levelProgress: {
    [CAMBRIDGE_PRIMARY_MATH_BOOK1_ID]: {
      treasures: Object.fromEntries(
        CAMBRIDGE_PRIMARY_MATH_BOOK1.units.map((unit) => [
          unit.id,
          unit.id === 'unit_1'
            ? { completed: true, coinsEarned: 8 }
            : { completed: false, coinsEarned: 0 },
        ]),
      ),
      currentAvailableTreasureId: 'unit_2',
    },
  },
})

describe('HomeScreen', () => {
  it('renders completed and available treasures as clickable, locked treasures as not rendered', () => {
    const onPlayTreasure = vi.fn()

    render(
      <HomeScreen
        onCoinAnimationComplete={vi.fn()}
        onPlayTreasure={onPlayTreasure}
        pendingCoinAnimation={null}
        profile={buildProfile()}
      />,
    )

    expect(screen.getByTestId('play-button-unit_1')).not.toBeNull()
    expect(screen.getByTestId('play-button-unit_2')).not.toBeNull()
    expect(screen.queryByTestId('play-button-unit_3')).toBeNull()

    fireEvent.click(screen.getByTestId('play-button-unit_2'))

    expect(onPlayTreasure).toHaveBeenCalledWith('unit_2')
    expect(onPlayTreasure).toHaveBeenCalledTimes(1)
  })

  it('has no visible text labels on treasure hotspots', () => {
    render(
      <HomeScreen
        onCoinAnimationComplete={vi.fn()}
        onPlayTreasure={vi.fn()}
        pendingCoinAnimation={null}
        profile={buildProfile()}
      />,
    )

    expect(screen.getByTestId('play-button-unit_1').textContent).toBe('')
    expect(screen.getByTestId('play-button-unit_2').textContent).toBe('')
  })

  it('highlights only the next-to-play treasure, not a completed one', () => {
    render(
      <HomeScreen
        onCoinAnimationComplete={vi.fn()}
        onPlayTreasure={vi.fn()}
        pendingCoinAnimation={null}
        profile={buildProfile()}
      />,
    )

    expect(screen.getByTestId('play-button-unit_2').className).toContain(
      'home-screen__treasure-hotspot--current',
    )
    expect(screen.getByTestId('play-button-unit_1').className).not.toContain(
      'home-screen__treasure-hotspot--current',
    )
  })

  it('flies a coin from the completed treasure to the header and calls onCoinAnimationComplete', () => {
    vi.useFakeTimers()
    const onCoinAnimationComplete = vi.fn()

    render(
      <HomeScreen
        onCoinAnimationComplete={onCoinAnimationComplete}
        onPlayTreasure={vi.fn()}
        pendingCoinAnimation={{ unitId: 'unit_1', coinsEarned: 8 }}
        profile={buildProfile()}
      />,
    )

    expect(screen.getByTestId('treasure-coin-flight')).not.toBeNull()

    act(() => {
      vi.advanceTimersByTime(1200)
    })

    expect(onCoinAnimationComplete).toHaveBeenCalledTimes(1)
    expect(screen.queryByTestId('treasure-coin-flight')).toBeNull()

    vi.useRealTimers()
  })
})
