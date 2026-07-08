export interface TreasureQuestion {
  id: string
  prompt: string
  choices: number[]
  answer: number
  visualCount?: number
}

export interface CurriculumUnit {
  id: string
  name: string
  mapLeft: string
  mapTop: string
  questions: TreasureQuestion[]
}

export interface Curriculum {
  id: string
  name: string
  units: CurriculumUnit[]
}

export interface TreasureProgress {
  completed: boolean
  coinsEarned: number
}

export interface LevelProgress {
  treasures: Record<string, TreasureProgress>
  currentAvailableTreasureId: string
}

export interface ChildProfile {
  name: string
  bells: number
  levelProgress: Record<string, LevelProgress>
}
