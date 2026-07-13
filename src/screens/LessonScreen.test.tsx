import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { LessonScreen } from './LessonScreen'
import { speakText } from '../utils/speech'

vi.mock('../utils/speech', () => ({ speakText: vi.fn() }))

const SLIDES = ['Slide one text.', 'Slide two text.', 'Slide three text.']

describe('LessonScreen', () => {
  it('shows the first slide, speaks it, and steps through with Next', () => {
    vi.mocked(speakText).mockClear()
    const onFinish = vi.fn()

    render(<LessonScreen slides={SLIDES} onFinish={onFinish} />)

    expect(screen.getByTestId('lesson-slide-text').textContent).toBe('Slide one text.')
    expect(speakText).toHaveBeenCalledWith('Slide one text.')
    expect(screen.getByTestId('lesson-next-button').textContent).toBe('Next')

    fireEvent.click(screen.getByTestId('lesson-next-button'))
    expect(screen.getByTestId('lesson-slide-text').textContent).toBe('Slide two text.')
    expect(speakText).toHaveBeenCalledWith('Slide two text.')

    fireEvent.click(screen.getByTestId('lesson-next-button'))
    expect(screen.getByTestId('lesson-slide-text').textContent).toBe('Slide three text.')
    expect(screen.getByTestId('lesson-next-button').textContent).toBe("Let's play!")

    expect(onFinish).not.toHaveBeenCalled()
    fireEvent.click(screen.getByTestId('lesson-next-button'))
    expect(onFinish).toHaveBeenCalledTimes(1)
  })

  it('calls onFinish immediately when Skip is clicked, from any slide', () => {
    const onFinish = vi.fn()

    render(<LessonScreen slides={SLIDES} onFinish={onFinish} />)

    fireEvent.click(screen.getByTestId('lesson-cancel-button'))

    expect(onFinish).toHaveBeenCalledTimes(1)
    expect(screen.getByTestId('lesson-slide-text').textContent).toBe('Slide one text.')
  })
})
