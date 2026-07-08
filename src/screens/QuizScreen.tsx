import { useEffect, useState } from 'react'
import { Button, Card, Progress, Typewriter } from 'animal-island-ui'
import { MusicToggleButton } from '../components/MusicToggleButton'
import { generateQuestion } from '../data/questionBank'
import { recordAnswer, saveProfile } from '../store/profileStore'
import type { ChildProfile, Question, SkillId } from '../types'
import {
  playAchievementSound,
  playCelebrationSound,
  playClickSound,
  playCorrectSound,
  playWrongSound,
} from '../utils/sound'
import './QuizScreen.css'

const TOTAL_QUESTIONS = 10

interface QuizScreenProps {
  skillId: SkillId
  profile: ChildProfile
  onProfileChange: (profile: ChildProfile) => void
  onExit: () => void
}

export function QuizScreen({
  skillId,
  profile,
  onProfileChange,
  onExit,
}: QuizScreenProps) {
  const [currentQuestion, setCurrentQuestion] = useState<Question>(() =>
    generateQuestion(skillId),
  )
  const [activeProfile, setActiveProfile] = useState(profile)
  const [questionIndex, setQuestionIndex] = useState(1)
  const [correctCount, setCorrectCount] = useState(0)
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)
  const [showSummary, setShowSummary] = useState(false)

  useEffect(() => {
    setActiveProfile(profile)
  }, [profile])

  const handleChoiceClick = (choice: number) => {
    const isCorrect = choice === currentQuestion.answer
    const wasMastered = activeProfile.progress[skillId].mastered
    const updatedProfile = recordAnswer(activeProfile, skillId, isCorrect)
    const justMastered = !wasMastered && updatedProfile.progress[skillId].mastered
    const message = isCorrect ? 'Great job! 🎉' : 'Try again!'

    setSelectedChoice(choice)
    setFeedbackMessage(justMastered ? 'Skill mastered! 🌟' : message)
    setActiveProfile(updatedProfile)
    setCorrectCount((count) => count + (isCorrect ? 1 : 0))
    onProfileChange(updatedProfile)
    saveProfile(updatedProfile)

    if (isCorrect) {
      setAnswered(true)
    }

    if (justMastered) {
      playAchievementSound()
    } else if (isCorrect) {
      playCorrectSound()
    } else {
      playWrongSound()
    }
  }

  const handleNextClick = () => {
    if (questionIndex >= TOTAL_QUESTIONS) {
      playCelebrationSound()
      setShowSummary(true)
      return
    }

    playClickSound()
    setCurrentQuestion(generateQuestion(skillId))
    setQuestionIndex((index) => index + 1)
    setSelectedChoice(null)
    setAnswered(false)
    setFeedbackMessage(null)
  }

  const handleExitClick = () => {
    playClickSound()
    onExit()
  }

  if (showSummary) {
    return (
      <main className="quiz-screen quiz-screen--summary" data-testid="quiz-screen">
        <Card className="quiz-screen__summary-card" color="app-green">
          <section data-testid="quiz-summary">
            <p className="quiz-screen__eyebrow">Quiz complete</p>
            <h1>Score</h1>
            <p className="quiz-screen__score" data-testid="summary-score">
              {correctCount} / {TOTAL_QUESTIONS}
            </p>
            <Button
              data-testid="back-to-island-button"
              htmlType="button"
              onClick={handleExitClick}
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
            Question {questionIndex} / {TOTAL_QUESTIONS}
          </span>
          <Progress
            duration={0}
            infoFormat={() => `${questionIndex} / ${TOTAL_QUESTIONS}`}
            infoPosition="right"
            percent={(questionIndex / TOTAL_QUESTIONS) * 100}
            showInfo
            size="middle"
          />
        </div>
      </header>

      <Card className="quiz-screen__question-card" color="app-yellow">
        <p className="quiz-screen__eyebrow">Choose the answer</p>
        <h1 className="quiz-screen__prompt" data-testid="question-prompt">
          <Typewriter autoPlay={false} trigger={currentQuestion.id}>
            {currentQuestion.prompt}
          </Typewriter>
        </h1>

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
          {answered ? (
            <Button
              data-testid="next-button"
              htmlType="button"
              onClick={handleNextClick}
              type="primary"
            >
              {questionIndex === TOTAL_QUESTIONS ? 'See Score' : 'Next'}
            </Button>
          ) : null}
        </div>
      </Card>
    </main>
  )
}

export default QuizScreen
