import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import {
  CAMBRIDGE_PRIMARY_MATH_BOOK1,
  CAMBRIDGE_PRIMARY_MATH_BOOK1_ID,
} from './curriculums/cambridgePrimaryMathBook1'
import type { ChildProfile } from './types'

const STORAGE_KEY = 'math-island-profile'

const buildAllButLastCompletedProfile = (): ChildProfile => ({
  name: 'Explorer',
  bells: 150,
  levelProgress: {
    [CAMBRIDGE_PRIMARY_MATH_BOOK1_ID]: {
      treasures: Object.fromEntries(
        CAMBRIDGE_PRIMARY_MATH_BOOK1.units.map((unit) => [
          unit.id,
          unit.id === 'unit_16'
            ? { completed: false, coinsEarned: 0 }
            : { completed: true, coinsEarned: 10 },
        ]),
      ),
      currentAvailableTreasureId: 'unit_16',
    },
  },
})

const buildOnlyFirstCompletedProfile = (): ChildProfile => ({
  name: 'Explorer',
  bells: 10,
  levelProgress: {
    [CAMBRIDGE_PRIMARY_MATH_BOOK1_ID]: {
      treasures: Object.fromEntries(
        CAMBRIDGE_PRIMARY_MATH_BOOK1.units.map((unit) => [
          unit.id,
          unit.id === 'unit_1'
            ? { completed: true, coinsEarned: 10 }
            : { completed: false, coinsEarned: 0 },
        ]),
      ),
      currentAvailableTreasureId: 'unit_2',
    },
  },
})

const lastUnit = CAMBRIDGE_PRIMARY_MATH_BOOK1.units[CAMBRIDGE_PRIMARY_MATH_BOOK1.units.length - 1]
const secondUnit = CAMBRIDGE_PRIMARY_MATH_BOOK1.units[1]

const answerAllQuestionsCorrectly = (unit: typeof lastUnit) => {
  for (const question of unit.questions) {
    const buttons = screen.getAllByTestId(/^choice-button-/)
    const correctButton = buttons.find((button) => Number(button.textContent) === question.answer)
    fireEvent.click(correctButton as HTMLElement)
    fireEvent.click(screen.getByTestId('next-button'))
  }
}

describe('App', () => {
  afterEach(() => {
    localStorage.clear()
    vi.useRealTimers()
  })

  it('shows the island-complete celebration after finishing the final treasure', () => {
    vi.useFakeTimers()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(buildAllButLastCompletedProfile()))

    render(<App />)

    fireEvent.click(screen.getByTestId(`play-button-${lastUnit.id}`))
    answerAllQuestionsCorrectly(lastUnit)
    fireEvent.click(screen.getByTestId('back-to-island-button'))

    act(() => {
      vi.advanceTimersByTime(1200)
    })

    expect(screen.getByTestId('island-complete-screen')).not.toBeNull()
  })

  it('does not show the island-complete celebration after finishing a non-final treasure', () => {
    vi.useFakeTimers()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(buildOnlyFirstCompletedProfile()))

    render(<App />)

    fireEvent.click(screen.getByTestId(`play-button-${secondUnit.id}`))
    answerAllQuestionsCorrectly(secondUnit)
    fireEvent.click(screen.getByTestId('back-to-island-button'))

    act(() => {
      vi.advanceTimersByTime(1200)
    })

    expect(screen.queryByTestId('island-complete-screen')).toBeNull()
  })

  it('resets all progress from the parent dashboard after confirming', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(buildAllButLastCompletedProfile()))
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true)

    render(<App />)

    fireEvent.click(screen.getByText('Parents'))
    fireEvent.click(screen.getByTestId('reset-progress-button'))
    fireEvent.click(screen.getByTestId('back-to-island-from-parent-button'))

    expect(screen.getByTestId('play-button-unit_1')).not.toBeNull()
    expect(screen.queryByTestId('play-button-unit_16')).toBeNull()
    expect(screen.getByTestId('locked-unit_16')).not.toBeNull()

    const storedProfile = JSON.parse(localStorage.getItem(STORAGE_KEY) as string)
    expect(storedProfile.bells).toBe(0)

    confirmSpy.mockRestore()
  })
})
