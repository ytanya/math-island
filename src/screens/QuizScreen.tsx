import { useEffect, useState } from 'react'
import { Button, Card, Progress, Typewriter } from 'animal-island-ui'
import { CAMBRIDGE_PRIMARY_MATH_BOOK1, getUnitById } from '../curriculums/cambridgePrimaryMathBook1'
import { MusicToggleButton } from '../components/MusicToggleButton'
import {
  playCelebrationSound,
  playClickSound,
  playCorrectSound,
  playWrongSound,
} from '../utils/sound'
import { speakText } from '../utils/speech'
import './QuizScreen.css'

export const CORRECT_FEEDBACK_MESSAGES = [
  'Great job!',
  "You're a rock star!",
  'Awesome work!',
  'You got it!',
  'Fantastic!',
  'Well done!',
  "You're so smart!",
  'Nice one!',
  'Super job!',
  'You nailed it!',
]

export const WRONG_FEEDBACK_MESSAGES = [
  'Try again!',
  'So close, try again!',
  'Almost there, give it another try!',
  'Not quite, try again please!',
  'Keep trying, you can do it!',
  'Oops, try once more!',
  'Nice try, have another go!',
  'Almost! Try again!',
]

function pickRandomMessage(messages: string[]): string {
  return messages[Math.floor(Math.random() * messages.length)]
}

interface QuizScreenProps {
  unitId: string
  onComplete: (unitId: string, coinsEarned: number) => void
  onExit: () => void
}

export function QuizScreen({ unitId, onComplete, onExit }: QuizScreenProps) {
  const unit = getUnitById(CAMBRIDGE_PRIMARY_MATH_BOOK1, unitId)

  if (!unit) {
    throw new Error(`Unknown unit id: ${unitId}`)
  }

  const totalQuestions = unit.questions.length

  const [questionIndex, setQuestionIndex] = useState(1)
  const [correctCount, setCorrectCount] = useState(0)
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)
  const [showSummary, setShowSummary] = useState(false)

  const currentQuestion = unit.questions[questionIndex - 1]

  useEffect(() => {
    if (showSummary) return
    speakText(currentQuestion.prompt)
  }, [currentQuestion.id, showSummary])

  const handleReadAloudClick = () => {
    speakText(currentQuestion.prompt)
  }

  const handleChoiceClick = (choice: number) => {
    const isCorrect = choice === currentQuestion.answer
    const message = pickRandomMessage(isCorrect ? CORRECT_FEEDBACK_MESSAGES : WRONG_FEEDBACK_MESSAGES)

    setSelectedChoice(choice)
    setFeedbackMessage(message)

    if (isCorrect) {
      setAnswered(true)
      setCorrectCount((count) => count + 1)
      playCorrectSound()
    } else {
      playWrongSound()
    }

    speakText(message)
  }

  const handleNextClick = () => {
    if (questionIndex >= totalQuestions) {
      playCelebrationSound()
      setShowSummary(true)
      return
    }

    playClickSound()
    setQuestionIndex((index) => index + 1)
    setSelectedChoice(null)
    setAnswered(false)
    setFeedbackMessage(null)
  }

  const handleExitClick = () => {
    playClickSound()
    onExit()
  }

  const handleBackToIslandClick = () => {
    playClickSound()
    onComplete(unitId, correctCount)
  }

  if (showSummary) {
    return (
      <main className="quiz-screen quiz-screen--summary" data-testid="quiz-screen">
        <Card className="quiz-screen__summary-card" color="app-green">
          <section data-testid="quiz-summary">
            <p className="quiz-screen__eyebrow">Quiz complete</p>
            <h1>Score</h1>
            <p className="quiz-screen__score" data-testid="summary-score">
              {correctCount} / {totalQuestions}
            </p>
            <Button
              data-testid="back-to-island-button"
              htmlType="button"
              onClick={handleBackToIslandClick}
              type="primary"
            >
              Back to Island
            </Button>
          </section>
        </Card>
      </main>
    )
  }

  return (
    <main className="quiz-screen" data-testid="quiz-screen">
      <header className="quiz-screen__header">
        <Button htmlType="button" onClick={handleExitClick} type="text">
          Exit
        </Button>
        <MusicToggleButton />
        <div className="quiz-screen__progress">
          <span>
            Question {questionIndex} / {totalQuestions}
          </span>
          <Progress
            duration={0}
            infoFormat={() => `${questionIndex} / ${totalQuestions}`}
            infoPosition="right"
            percent={(questionIndex / totalQuestions) * 100}
            showInfo
            size="middle"
          />
        </div>
      </header>

      <Card className="quiz-screen__question-card" color="app-yellow">
        <p className="quiz-screen__eyebrow">Choose the answer</p>
        <div className="quiz-screen__prompt-row">
          <h1 className="quiz-screen__prompt" data-testid="question-prompt">
            <Typewriter autoPlay={false} trigger={currentQuestion.id}>
              {currentQuestion.prompt}
            </Typewriter>
          </h1>
          <Button
            aria-label="Read question aloud"
            className="quiz-screen__read-aloud-button"
            data-testid="read-aloud-button"
            htmlType="button"
            onClick={handleReadAloudClick}
            size="small"
            type="text"
          >
            🔊
          </Button>
        </div>

        {currentQuestion.visualCount !== undefined ? (
          <div
            aria-hidden="true"
            className="quiz-screen__visual-objects"
            data-testid="visual-objects"
          >
            {Array.from({ length: currentQuestion.visualCount }).map((_, index) => (
              <span className="quiz-screen__visual-object" key={index}>
                🍎
              </span>
            ))}
          </div>
        ) : null}

        <div className="quiz-screen__choices">
          {currentQuestion.choices.map((choice, index) => {
            const isSelected = selectedChoice === choice
            const isCorrectChoice = answered && choice === currentQuestion.answer

            return (
              <Button
                block
                className={[
                  'quiz-screen__choice',
                  isSelected ? 'quiz-screen__choice--selected' : '',
                  isCorrectChoice ? 'quiz-screen__choice--correct' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                data-testid={`choice-button-${index}`}
                disabled={answered}
                htmlType="button"
                key={`${currentQuestion.id}-${choice}-${index}`}
                onClick={() => handleChoiceClick(choice)}
                type={isSelected || isCorrectChoice ? 'primary' : 'default'}
              >
                {choice}
              </Button>
            )
          })}
        </div>

        <div className="quiz-screen__footer">
          <p
            aria-live="polite"
            className="quiz-screen__feedback"
            data-testid="quiz-feedback"
          >
            {feedbackMessage}
          </p>
          <Button
            data-testid="next-button"
            htmlType="button"
            onClick={handleNextClick}
            type="primary"
          >
            {questionIndex === totalQuestions ? 'See Score' : 'Next'}
          </Button>
        </div>
      </Card>
    </main>
  )
}

export default QuizScreen
