import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { QuizScreen } from './QuizScreen'
import { speakText } from '../utils/speech'

vi.mock('../utils/speech', () => ({ speakText: vi.fn() }))

const answerAllTenQuestions = () => {
  for (let index = 0; index < 10; index += 1) {
    const appleCount = screen.getByTestId('visual-objects').querySelectorAll('span').length
    const buttons = screen.getAllByTestId(/^choice-button-/)
    const correctButton = buttons.find((button) => button.textContent === String(appleCount))

    fireEvent.click(correctButton as HTMLElement)
    fireEvent.click(screen.getByTestId('next-button'))
  }
}

describe('QuizScreen', () => {
  it('answers all 10 questions for unit_1, shows the score, and completes with full coins', () => {
    const onComplete = vi.fn()
    const onExit = vi.fn()

    render(<QuizScreen onComplete={onComplete} onExit={onExit} unitId="unit_1" />)

    answerAllTenQuestions()

    expect(screen.getByTestId('quiz-summary')).not.toBeNull()
    expect(screen.getByTestId('summary-score').textContent).toContain('10 / 10')

    fireEvent.click(screen.getByTestId('back-to-island-button'))

    expect(onComplete).toHaveBeenCalledWith('unit_1', 10)
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(onExit).not.toHaveBeenCalled()
  })

  it('calls onExit without completing when Exit is clicked mid-quiz', () => {
    const onComplete = vi.fn()
    const onExit = vi.fn()

    render(<QuizScreen onComplete={onComplete} onExit={onExit} unitId="unit_1" />)

    fireEvent.click(screen.getByText('Exit'))

    expect(onExit).toHaveBeenCalledTimes(1)
    expect(onComplete).not.toHaveBeenCalled()
  })

  it('awards fewer coins when a question is skipped via Next without answering correctly', () => {
    const onComplete = vi.fn()

    render(<QuizScreen onComplete={onComplete} onExit={vi.fn()} unitId="unit_1" />)

    fireEvent.click(screen.getByTestId('next-button'))

    for (let index = 0; index < 9; index += 1) {
      const appleCount = screen.getByTestId('visual-objects').querySelectorAll('span').length
      const buttons = screen.getAllByTestId(/^choice-button-/)
      const correctButton = buttons.find((button) => button.textContent === String(appleCount))

      fireEvent.click(correctButton as HTMLElement)
      fireEvent.click(screen.getByTestId('next-button'))
    }

    fireEvent.click(screen.getByTestId('back-to-island-button'))

    expect(onComplete).toHaveBeenCalledWith('unit_1', 9)
  })

  it('reads the question aloud automatically and again when the speaker button is clicked', () => {
    vi.mocked(speakText).mockClear()

    render(<QuizScreen onComplete={vi.fn()} onExit={vi.fn()} unitId="unit_1" />)

    expect(speakText).toHaveBeenCalledWith('How many apples are there?')
    expect(speakText).toHaveBeenCalledTimes(1)

    fireEvent.click(screen.getByTestId('read-aloud-button'))

    expect(speakText).toHaveBeenCalledTimes(2)
  })

  it('reads the next question aloud when moving to it', () => {
    vi.mocked(speakText).mockClear()

    render(<QuizScreen onComplete={vi.fn()} onExit={vi.fn()} unitId="unit_1" />)

    fireEvent.click(screen.getByTestId('next-button'))

    expect(speakText).toHaveBeenCalledTimes(2)
  })
})
