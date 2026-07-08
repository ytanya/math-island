import { beforeEach, describe, expect, it } from 'vitest'
import type { ChildProfile } from '../types'
import { loadProfile, recordAnswer, saveProfile } from './profileStore'

describe('profileStore', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns a valid default profile when localStorage is empty', () => {
    expect(loadProfile()).toEqual({
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
  })

  it('round-trips a saved profile through localStorage', () => {
    const profile: ChildProfile = {
      name: 'Ari',
      bells: 30,
      badges: ['counting'],
      progress: {
        counting: {
          skillId: 'counting',
          attempts: 0,
          correct: 0,
          mastered: true,
        },
        comparing: {
          skillId: 'comparing',
          attempts: 2,
          correct: 1,
          mastered: false,
        },
        addSub: {
          skillId: 'addSub',
          attempts: 3,
          correct: 2,
          mastered: false,
        },
        placeValue: {
          skillId: 'placeValue',
          attempts: 4,
          correct: 3,
          mastered: false,
        },
      },
    }

    saveProfile(profile)

    expect(loadProfile()).toEqual(profile)
  })

  it('masters a skill after 8 correct answers in a 10-answer window', () => {
    const answers = [true, true, false, true, true, true, false, true, true, true]
    const profile = answers.reduce(
      (currentProfile, isCorrect) =>
        recordAnswer(currentProfile, 'counting', isCorrect),
      loadProfile(),
    )

    expect(profile.progress.counting.mastered).toBe(true)
    expect(profile.bells).toBe(80)
    expect(profile.badges).toContain('counting')
  })

  it('does not mutate the profile passed into recordAnswer', () => {
    const profile = loadProfile()
    const originalCountingProgress = { ...profile.progress.counting }

    const updatedProfile = recordAnswer(profile, 'counting', true)

    expect(profile.progress.counting).toEqual(originalCountingProgress)
    expect(updatedProfile).not.toBe(profile)
    expect(updatedProfile.progress).not.toBe(profile.progress)
    expect(updatedProfile.progress.counting).not.toBe(profile.progress.counting)
  })
})
