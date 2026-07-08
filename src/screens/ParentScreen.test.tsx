import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { ChildProfile } from '../types'
import { ParentScreen } from './ParentScreen'

const mockProfile: ChildProfile = {
  name: 'Explorer',
  bells: 24,
  badges: ['counting'],
  progress: {
    counting: {
      skillId: 'counting',
      attempts: 3,
      correct: 2,
      mastered: true,
    },
    comparing: {
      skillId: 'comparing',
      attempts: 4,
      correct: 1,
      mastered: false,
    },
    addSub: {
      skillId: 'addSub',
      attempts: 0,
      correct: 0,
      mastered: false,
    },
    placeValue: {
      skillId: 'placeValue',
      attempts: 5,
      correct: 5,
      mastered: true,
    },
  },
}

describe('ParentScreen', () => {
  it('shows progress rows and closes back to the island', () => {
    const onClose = vi.fn()

    render(<ParentScreen profile={mockProfile} onClose={onClose} />)

    fireEvent.click(screen.getByTestId('view-details-toggle'))

    expect(screen.getByTestId('parent-table-row-counting').textContent).toContain(
      'Counting',
    )
    expect(screen.getByTestId('parent-table-row-counting').textContent).toContain(
      '3',
    )
    expect(screen.getByTestId('parent-table-row-counting').textContent).toContain(
      '2',
    )
    expect(screen.getByTestId('parent-table-row-counting').textContent).toContain(
      '67%',
    )
    expect(screen.getByTestId('parent-table-row-counting').textContent).toContain(
      'Yes',
    )

    expect(screen.getByTestId('parent-table-row-comparing').textContent).toContain(
      'Comparing',
    )
    expect(screen.getByTestId('parent-table-row-comparing').textContent).toContain(
      '4',
    )
    expect(screen.getByTestId('parent-table-row-comparing').textContent).toContain(
      '1',
    )
    expect(screen.getByTestId('parent-table-row-comparing').textContent).toContain(
      '25%',
    )
    expect(screen.getByTestId('parent-table-row-comparing').textContent).toContain(
      'No',
    )

    expect(screen.getByTestId('parent-table-row-addSub').textContent).toContain(
      'Add & Subtract',
    )
    expect(screen.getByTestId('parent-table-row-addSub').textContent).toContain(
      '0',
    )
    expect(screen.getByTestId('parent-table-row-addSub').textContent).toContain(
      '0%',
    )
    expect(screen.getByTestId('parent-table-row-addSub').textContent).toContain(
      'No',
    )

    expect(screen.getByTestId('parent-table-row-placeValue').textContent).toContain(
      'Tens & Ones',
    )
    expect(screen.getByTestId('parent-table-row-placeValue').textContent).toContain(
      '5',
    )
    expect(screen.getByTestId('parent-table-row-placeValue').textContent).toContain(
      '100%',
    )
    expect(screen.getByTestId('parent-table-row-placeValue').textContent).toContain(
      'Yes',
    )

    fireEvent.click(screen.getByTestId('back-to-island-from-parent-button'))

    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
