import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { IslandCompleteScreen } from './IslandCompleteScreen'
import { playIslandCompleteFanfare } from '../utils/sound'
import { speakText } from '../utils/speech'

vi.mock('../utils/sound', () => ({ playIslandCompleteFanfare: vi.fn() }))
vi.mock('../utils/speech', () => ({ speakText: vi.fn() }))

describe('IslandCompleteScreen', () => {
  it('plays the fanfare, speaks an affirming message, and shows the bell count', () => {
    render(<IslandCompleteScreen bells={160} onClose={vi.fn()} />)

    expect(playIslandCompleteFanfare).toHaveBeenCalledTimes(1)
    expect(speakText).toHaveBeenCalledTimes(1)
    expect(vi.mocked(speakText).mock.calls[0][0]).toContain('proud')
    expect(screen.getByTestId('island-complete-message').textContent).toContain('160 bells')
  })

  it('calls onClose when the button is clicked', () => {
    const onClose = vi.fn()
    render(<IslandCompleteScreen bells={160} onClose={onClose} />)

    fireEvent.click(screen.getByTestId('island-complete-close-button'))

    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
