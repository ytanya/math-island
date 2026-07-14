import { useEffect, useState } from 'react'
import { Button, Card } from 'animal-island-ui'
import type { LessonSlide } from '../types'
import { playClickSound } from '../utils/sound'
import { speakText } from '../utils/speech'
import './LessonScreen.css'

interface LessonScreenProps {
  slides: LessonSlide[]
  onFinish: () => void
}

export function LessonScreen({ slides, onFinish }: LessonScreenProps) {
  const [slideIndex, setSlideIndex] = useState(0)
  const isLastSlide = slideIndex === slides.length - 1
  const isFirstSlide = slideIndex === 0

  useEffect(() => {
    speakText(slides[slideIndex].text)
  }, [slideIndex])

  const goToSlide = (index: number) => {
    playClickSound()
    setSlideIndex(index)
  }

  const handleNextClick = () => {
    if (isLastSlide) {
      playClickSound()
      onFinish()
      return
    }

    goToSlide(slideIndex + 1)
  }

  const handleBackClick = () => {
    if (isFirstSlide) return
    goToSlide(slideIndex - 1)
  }

  const handleSkipClick = () => {
    playClickSound()
    onFinish()
  }

  return (
    <main className="lesson-screen" data-testid="lesson-screen">
      <Card className="lesson-screen__card" color="app-blue">
        <p className="lesson-screen__eyebrow">Let's learn!</p>
        <span aria-hidden="true" className="lesson-screen__emoji">
          {slides[slideIndex].emoji}
        </span>
        <p className="lesson-screen__slide-text" data-testid="lesson-slide-text">
          {slides[slideIndex].text}
        </p>

        <div className="lesson-screen__dots">
          {slides.map((slide, index) => (
            <button
              aria-label={`Go to slide ${index + 1}`}
              className={[
                'lesson-screen__dot',
                index === slideIndex ? 'lesson-screen__dot--active' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              data-testid={`lesson-dot-${index}`}
              key={slide.text}
              onClick={() => goToSlide(index)}
              type="button"
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

          <div className="lesson-screen__nav-buttons">
            {!isFirstSlide ? (
              <Button
                data-testid="lesson-back-button"
                htmlType="button"
                onClick={handleBackClick}
                type="text"
              >
                Back
              </Button>
            ) : null}
            <Button
              data-testid="lesson-next-button"
              htmlType="button"
              onClick={handleNextClick}
              type="primary"
            >
              {isLastSlide ? "Let's play!" : 'Next'}
            </Button>
          </div>
        </div>
      </Card>
    </main>
  )
}

export default LessonScreen
