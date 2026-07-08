export type SkillId = 'counting' | 'comparing' | 'addSub' | 'placeValue'

export interface Question {
  id: string
  skillId: SkillId
  prompt: string
  choices: number[]
  answer: number
  visualCount?: number
}

export interface SkillProgress {
  skillId: SkillId
  attempts: number
  correct: number
  mastered: boolean
}

export interface ChildProfile {
  name: string
  bells: number
  badges: SkillId[]
  progress: Record<SkillId, SkillProgress>
}
