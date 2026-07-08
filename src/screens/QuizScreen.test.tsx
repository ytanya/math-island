import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ChildProfile, Question } from '../types'
import { QuizScreen } from './QuizScreen'

const mockState = vi.hoisted(() => ({
  questionNumber: 0,
}))

vi.mock('../data/questionBank', () => ({
  generateQuestion: vi.fn((): Question => {
    mockState.questionNumber += 1

    return {
      id: `mock-question-${mockState.questionNumber}`,
      skillId: 'counting',
      prompt: 'What is 1 + 1?',
      choices: [1, 2, 3, 4],
      answer: 2,
    }
  }),
}))

vi.mock('../store/profileStore', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('../store/profileStore')>()

  return {
    ...actual,
    saveProfile: vi.fn(),
  }
})

const createProfile = (): ChildProfile => ({
  name: 'Explorer',
  bells: 0,
  badges: [],
  progress: {
    counting: {
      skillId: 'counting',
      attempts: 0,
      correct: 0,
      mastered: false,
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
})

describe('QuizScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockState.questionNumber = 0
  })

  it('answers ten questions, saves progress, and exits from the summary', async () => {
    const { saveProfile } = await import('../store/profileStore')
    const onProfileChange = vi.fn()
    const onExit = vi.fn()

    render(
      <QuizScreen
        profile={createProfile()}
        skillId="counting"
        onExit={onExit}
        onProfileChange={onProfileChange}
      />,
    )

    for (let index = 0; index < 10; index += 1) {
      fireEvent.click(screen.getByTestId('choice-button-1'))
      fireEvent.click(screen.getByTestId('next-button'))
    }

    expect(screen.getByTestId('quiz-summary')).not.toBeNull()
    expect(screen.getByTestId('summary-score').textContent).toContain('10 / 10')
    expect(saveProfile).toHaveBeenCalledTimes(10)
    expect(onProfileChange).toHaveBeenCalledTimes(10)

    fireEvent.click(screen.getByTestId('back-to-island-button'))

    expect(onExit).toHaveBeenCalledTimes(1)
  })
})
