import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { LessonScreen } from './LessonScreen'
import { speakText } from '../utils/speech'

vi.mock('../utils/speech', () => ({ speakText: vi.fn() }))

const SLIDES = [
  { text: 'Slide one text.', emoji: '1️⃣' },
  { text: 'Slide two text.', emoji: '2️⃣' },
  { text: 'Slide three text.', emoji: '3️⃣' },
]

describe('LessonScreen', () => {
  it('shows the first slide with its emoji, speaks it, and steps through with Next', () => {
    vi.mocked(speakText).mockClear()
    const onFinish = vi.fn()

    render(<LessonScreen slides={SLIDES} onFinish={onFinish} />)

    expect(screen.getByTestId('lesson-slide-text').textContent).toBe('Slide one text.')
    expect(speakText).toHaveBeenCalledWith('Slide one text.')
    expect(screen.getByTestId('lesson-next-button').textContent).toBe('Next')
    expect(screen.queryByTestId('lesson-back-button')).toBeNull()

    fireEvent.click(screen.getByTestId('lesson-next-button'))
    expect(screen.getByTestId('lesson-slide-text').textContent).toBe('Slide two text.')
    expect(speakText).toHaveBeenCalledWith('Slide two text.')
    expect(screen.getByTestId('lesson-back-button')).not.toBeNull()

    fireEvent.click(screen.getByTestId('lesson-next-button'))
    expect(screen.getByTestId('lesson-slide-text').textContent).toBe('Slide three text.')
    expect(screen.getByTestId('lesson-next-button').textContent).toBe("Let's play!")

    expect(onFinish).not.toHaveBeenCalled()
    fireEvent.click(screen.getByTestId('lesson-next-button'))
    expect(onFinish).toHaveBeenCalledTimes(1)
  })

  it('goes back to the previous slide with the Back button', () => {
    render(<LessonScreen slides={SLIDES} onFinish={vi.fn()} />)

    fireEvent.click(screen.getByTestId('lesson-next-button'))
    fireEvent.click(screen.getByTestId('lesson-next-button'))
    expect(screen.getByTestId('lesson-slide-text').textContent).toBe('Slide three text.')

    fireEvent.click(screen.getByTestId('lesson-back-button'))
    expect(screen.getByTestId('lesson-slide-text').textContent).toBe('Slide two text.')

    fireEvent.click(screen.getByTestId('lesson-back-button'))
    expect(screen.getByTestId('lesson-slide-text').textContent).toBe('Slide one text.')
    expect(screen.queryByTestId('lesson-back-button')).toBeNull()
  })

  it('jumps directly to any slide by clicking its dot', () => {
    render(<LessonScreen slides={SLIDES} onFinish={vi.fn()} />)

    fireEvent.click(screen.getByTestId('lesson-dot-2'))
    expect(screen.getByTestId('lesson-slide-text').textContent).toBe('Slide three text.')

    fireEvent.click(screen.getByTestId('lesson-dot-0'))
    expect(screen.getByTestId('lesson-slide-text').textContent).toBe('Slide one text.')
  })

  it('calls onFinish immediately when Skip is clicked, from any slide', () => {
    const onFinish = vi.fn()

    render(<LessonScreen slides={SLIDES} onFinish={onFinish} />)

    fireEvent.click(screen.getByTestId('lesson-cancel-button'))

    expect(onFinish).toHaveBeenCalledTimes(1)
    expect(screen.getByTestId('lesson-slide-text').textContent).toBe('Slide one text.')
  })
})
