import { useEffect, useState } from 'react'
import { Button, Card } from 'animal-island-ui'
import { playClickSound } from '../utils/sound'
import { speakText } from '../utils/speech'
import './LessonScreen.css'

interface LessonScreenProps {
  slides: string[]
  onFinish: () => void
}

export function LessonScreen({ slides, onFinish }: LessonScreenProps) {
  const [slideIndex, setSlideIndex] = useState(0)
  const isLastSlide = slideIndex === slides.length - 1

  useEffect(() => {
    speakText(slides[slideIndex])
  }, [slideIndex])

  const handleNextClick = () => {
    playClickSound()

    if (isLastSlide) {
      onFinish()
      return
    }

    setSlideIndex((index) => index + 1)
  }

  const handleSkipClick = () => {
    playClickSound()
    onFinish()
  }

  return (
    <main className="lesson-screen" data-testid="lesson-screen">
      <Card className="lesson-screen__card" color="app-blue">
        <p className="lesson-screen__eyebrow">Let's learn!</p>
        <p className="lesson-screen__slide-text" data-testid="lesson-slide-text">
          {slides[slideIndex]}
        </p>

        <div aria-hidden="true" className="lesson-screen__dots">
          {slides.map((slide, index) => (
            <span
              className={[
                'lesson-screen__dot',
                index === slideIndex ? 'lesson-screen__dot--active' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              key={slide}
            />
          ))}
        </div>

        <div className="lesson-screen__footer">
          <Button
            data-testid="lesson-cancel-button"
            htmlType="button"
            onClick={handleSkipClick}
            type="text"
          >
            Skip
          </Button>
          <Button
            data-testid="lesson-next-button"
            htmlType="button"
            onClick={handleNextClick}
            type="primary"
          >
            {isLastSlide ? "Let's play!" : 'Next'}
          </Button>
        </div>
      </Card>
    </main>
  )
}

export default LessonScreen
