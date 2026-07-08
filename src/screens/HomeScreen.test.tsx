import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { ChildProfile } from '../types'
import { HomeScreen } from './HomeScreen'

const mockProfile: ChildProfile = {
  name: 'Explorer',
  bells: 42,
  badges: ['counting'],
  progress: {
    counting: {
      skillId: 'counting',
      attempts: 10,
      correct: 8,
      mastered: true,
    },
    comparing: {
      skillId: 'comparing',
      attempts: 0,
      correct: 0,
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
      attempts: 0,
      correct: 0,
      mastered: false,
    },
  },
}

describe('HomeScreen', () => {
  it('renders skill cards, mastered state, and play callbacks', () => {
    const onPlaySkill = vi.fn()

    render(<HomeScreen profile={mockProfile} onPlaySkill={onPlaySkill} />)

    expect(screen.getByTestId('skill-card-counting')).not.toBeNull()
    expect(screen.getByText('Counting')).not.toBeNull()
    expect(screen.getByTestId('skill-card-comparing')).not.toBeNull()
    expect(screen.getByText('Comparing')).not.toBeNull()
    expect(screen.getByTestId('skill-card-addSub')).not.toBeNull()
    expect(screen.getByText('Add & Subtract')).not.toBeNull()
    expect(screen.getByTestId('skill-card-placeValue')).not.toBeNull()
    expect(screen.getByText('Tens & Ones')).not.toBeNull()

    expect(screen.getByTestId('mastered-tag-counting')).not.toBeNull()
    expect(screen.queryByTestId('mastered-tag-comparing')).toBeNull()
    expect(screen.queryByTestId('mastered-tag-addSub')).toBeNull()
    expect(screen.queryByTestId('mastered-tag-placeValue')).toBeNull()

    fireEvent.click(screen.getByTestId('play-button-addSub'))

    expect(onPlaySkill).toHaveBeenCalledWith('addSub')
    expect(onPlaySkill).toHaveBeenCalledTimes(1)
  })
})
