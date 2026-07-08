import type { ChildProfile, SkillId, SkillProgress } from '../types'

const STORAGE_KEY = 'math-island-profile'
const skillIds: SkillId[] = ['counting', 'comparing', 'addSub', 'placeValue']

const createSkillProgress = (skillId: SkillId): SkillProgress => ({
  skillId,
  attempts: 0,
  correct: 0,
  mastered: false,
})

const createDefaultProfile = (): ChildProfile => ({
  name: 'Explorer',
  bells: 0,
  badges: [],
  progress: {
    counting: createSkillProgress('counting'),
    comparing: createSkillProgress('comparing'),
    addSub: createSkillProgress('addSub'),
    placeValue: createSkillProgress('placeValue'),
  },
})

const isSkillId = (value: unknown): value is SkillId =>
  typeof value === 'string' && skillIds.includes(value as SkillId)

const isValidSkillProgress = (
  value: unknown,
  skillId: SkillId,
): value is SkillProgress => {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const progress = value as Partial<SkillProgress>

  return (
    progress.skillId === skillId &&
    typeof progress.attempts === 'number' &&
    Number.isInteger(progress.attempts) &&
    progress.attempts >= 0 &&
    typeof progress.correct === 'number' &&
    Number.isInteger(progress.correct) &&
    progress.correct >= 0 &&
    progress.correct <= progress.attempts &&
    typeof progress.mastered === 'boolean'
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
    Array.isArray(profile.badges) &&
    profile.badges.every(isSkillId) &&
    typeof profile.progress === 'object' &&
    profile.progress !== null &&
    skillIds.every((skillId) =>
      isValidSkillProgress(profile.progress?.[skillId], skillId),
    )
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

export const recordAnswer = (
  profile: ChildProfile,
  skillId: SkillId,
  isCorrect: boolean,
): ChildProfile => {
  const currentProgress = profile.progress[skillId]
  const windowAttempts = currentProgress.attempts + 1
  const windowCorrect = currentProgress.correct + (isCorrect ? 1 : 0)
  const completedWindow = windowAttempts % 10 === 0
  const mastered = currentProgress.mastered || (completedWindow && windowCorrect >= 8)
  const earnedNewBadge = mastered && !currentProgress.mastered

  return {
    ...profile,
    bells: profile.bells + (isCorrect ? 10 : 0),
    badges:
      earnedNewBadge && !profile.badges.includes(skillId)
        ? [...profile.badges, skillId]
        : [...profile.badges],
    progress: {
      ...profile.progress,
      [skillId]: {
        ...currentProgress,
        attempts: completedWindow ? 0 : windowAttempts,
        correct: completedWindow ? 0 : windowCorrect,
        mastered,
      },
    },
  }
}
