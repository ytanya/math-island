import {
  CAMBRIDGE_PRIMARY_MATH_BOOK1,
  CAMBRIDGE_PRIMARY_MATH_BOOK1_ID,
} from '../curriculums/cambridgePrimaryMathBook1'
import type { ChildProfile, LevelProgress, TreasureProgress } from '../types'

const STORAGE_KEY = 'math-island-profile'

const createDefaultLevelProgress = (): LevelProgress => ({
  treasures: Object.fromEntries(
    CAMBRIDGE_PRIMARY_MATH_BOOK1.units.map((unit) => [
      unit.id,
      { completed: false, coinsEarned: 0 } as TreasureProgress,
    ]),
  ),
  currentAvailableTreasureId: CAMBRIDGE_PRIMARY_MATH_BOOK1.units[0].id,
})

const createDefaultProfile = (): ChildProfile => ({
  name: 'Explorer',
  bells: 0,
  levelProgress: {
    [CAMBRIDGE_PRIMARY_MATH_BOOK1_ID]: createDefaultLevelProgress(),
  },
})

const isValidTreasureProgress = (value: unknown): value is TreasureProgress => {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const progress = value as Partial<TreasureProgress>

  return (
    typeof progress.completed === 'boolean' &&
    typeof progress.coinsEarned === 'number' &&
    Number.isInteger(progress.coinsEarned) &&
    progress.coinsEarned >= 0 &&
    progress.coinsEarned <= 10
  )
}

const isValidLevelProgress = (value: unknown): value is LevelProgress => {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const levelProgress = value as Partial<LevelProgress>

  if (typeof levelProgress.currentAvailableTreasureId !== 'string') {
    return false
  }

  if (typeof levelProgress.treasures !== 'object' || levelProgress.treasures === null) {
    return false
  }

  return CAMBRIDGE_PRIMARY_MATH_BOOK1.units.every((unit) =>
    isValidTreasureProgress(levelProgress.treasures?.[unit.id]),
  )
}

const isValidProfile = (value: unknown): value is ChildProfile => {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const profile = value as Partial<ChildProfile>

  return (
    typeof profile.name === 'string' &&
    typeof profile.bells === 'number' &&
    Number.isInteger(profile.bells) &&
    profile.bells >= 0 &&
    typeof profile.levelProgress === 'object' &&
    profile.levelProgress !== null &&
    isValidLevelProgress(profile.levelProgress[CAMBRIDGE_PRIMARY_MATH_BOOK1_ID])
  )
}

export const loadProfile = (): ChildProfile => {
  const storedProfile = localStorage.getItem(STORAGE_KEY)

  if (storedProfile === null) {
    return createDefaultProfile()
  }

  try {
    const parsedProfile = JSON.parse(storedProfile)

    if (isValidProfile(parsedProfile)) {
      return parsedProfile
    }
  } catch {
    return createDefaultProfile()
  }

  return createDefaultProfile()
}

export const saveProfile = (profile: ChildProfile): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
}

export interface CompleteTreasureResult {
  profile: ChildProfile
  coinsAwarded: number
}

export const completeTreasure = (
  profile: ChildProfile,
  curriculumId: string,
  unitId: string,
  coinsEarned: number,
  nextUnitId: string | null,
): CompleteTreasureResult => {
  const levelProgress = profile.levelProgress[curriculumId]
  const alreadyCompleted = levelProgress.treasures[unitId]?.completed ?? false

  if (alreadyCompleted) {
    return { profile, coinsAwarded: 0 }
  }

  const updatedProfile: ChildProfile = {
    ...profile,
    bells: profile.bells + coinsEarned,
    levelProgress: {
      ...profile.levelProgress,
      [curriculumId]: {
        treasures: {
          ...levelProgress.treasures,
          [unitId]: { completed: true, coinsEarned },
        },
        currentAvailableTreasureId: nextUnitId ?? levelProgress.currentAvailableTreasureId,
      },
    },
  }

  return { profile: updatedProfile, coinsAwarded: coinsEarned }
}
