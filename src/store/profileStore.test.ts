import { beforeEach, describe, expect, it } from 'vitest'
import { CAMBRIDGE_PRIMARY_MATH_BOOK1_ID } from '../curriculums/cambridgePrimaryMathBook1'
import { completeTreasure, loadProfile, saveProfile } from './profileStore'

describe('profileStore', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns a default profile with all 16 treasures locked except the first', () => {
    const profile = loadProfile()
    const levelProgress = profile.levelProgress[CAMBRIDGE_PRIMARY_MATH_BOOK1_ID]

    expect(profile.name).toBe('Explorer')
    expect(profile.bells).toBe(0)
    expect(Object.keys(levelProgress.treasures)).toHaveLength(16)
    expect(levelProgress.currentAvailableTreasureId).toBe('unit_1')
    expect(levelProgress.treasures.unit_1).toEqual({ completed: false, coinsEarned: 0 })
  })

  it('round-trips a saved profile through localStorage', () => {
    const profile = loadProfile()
    const updated = {
      ...profile,
      bells: 8,
      levelProgress: {
        [CAMBRIDGE_PRIMARY_MATH_BOOK1_ID]: {
          ...profile.levelProgress[CAMBRIDGE_PRIMARY_MATH_BOOK1_ID],
          treasures: {
            ...profile.levelProgress[CAMBRIDGE_PRIMARY_MATH_BOOK1_ID].treasures,
            unit_1: { completed: true, coinsEarned: 8 },
          },
          currentAvailableTreasureId: 'unit_2',
        },
      },
    }

    saveProfile(updated)

    expect(loadProfile()).toEqual(updated)
  })

  it('completes a treasure: adds bells, marks completed, and unlocks the next treasure', () => {
    const profile = loadProfile()

    const { profile: updatedProfile, coinsAwarded } = completeTreasure(
      profile,
      CAMBRIDGE_PRIMARY_MATH_BOOK1_ID,
      'unit_1',
      8,
      'unit_2',
    )

    expect(coinsAwarded).toBe(8)
    expect(updatedProfile.bells).toBe(8)
    expect(
      updatedProfile.levelProgress[CAMBRIDGE_PRIMARY_MATH_BOOK1_ID].treasures.unit_1,
    ).toEqual({ completed: true, coinsEarned: 8 })
    expect(
      updatedProfile.levelProgress[CAMBRIDGE_PRIMARY_MATH_BOOK1_ID].currentAvailableTreasureId,
    ).toBe('unit_2')
  })

  it('does not award bells again when replaying an already-completed treasure', () => {
    const profile = loadProfile()
    const { profile: firstCompletion } = completeTreasure(
      profile,
      CAMBRIDGE_PRIMARY_MATH_BOOK1_ID,
      'unit_1',
      8,
      'unit_2',
    )

    const { profile: secondCompletion, coinsAwarded } = completeTreasure(
      firstCompletion,
      CAMBRIDGE_PRIMARY_MATH_BOOK1_ID,
      'unit_1',
      10,
      'unit_2',
    )

    expect(coinsAwarded).toBe(0)
    expect(secondCompletion.bells).toBe(8)
    expect(secondCompletion).toEqual(firstCompletion)
  })

  it('does not mutate the profile passed into completeTreasure', () => {
    const profile = loadProfile()
    const originalBells = profile.bells

    completeTreasure(profile, CAMBRIDGE_PRIMARY_MATH_BOOK1_ID, 'unit_1', 8, 'unit_2')

    expect(profile.bells).toBe(originalBells)
    expect(
      profile.levelProgress[CAMBRIDGE_PRIMARY_MATH_BOOK1_ID].treasures.unit_1.completed,
    ).toBe(false)
  })
})
