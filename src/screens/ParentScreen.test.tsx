import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import {
  CAMBRIDGE_PRIMARY_MATH_BOOK1,
  CAMBRIDGE_PRIMARY_MATH_BOOK1_ID,
} from '../curriculums/cambridgePrimaryMathBook1'
import type { ChildProfile } from '../types'
import { ParentScreen } from './ParentScreen'

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

describe('ParentScreen', () => {
  it('shows treasure progress rows and closes back to the island', () => {
    const onClose = vi.fn()

    render(<ParentScreen profile={buildProfile()} onClose={onClose} />)

    fireEvent.click(screen.getByTestId('view-details-toggle'))

    expect(screen.getByTestId('parent-table-row-unit_1').textContent).toContain('Numbers to 10')
    expect(screen.getByTestId('parent-table-row-unit_1').textContent).toContain('8')
    expect(screen.getByTestId('parent-table-row-unit_1').textContent).toContain('Yes')

    expect(screen.getByTestId('parent-table-row-unit_2').textContent).toContain(
      'Working with numbers to 10',
    )
    expect(screen.getByTestId('parent-table-row-unit_2').textContent).toContain('No')

    fireEvent.click(screen.getByTestId('back-to-island-from-parent-button'))

    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
