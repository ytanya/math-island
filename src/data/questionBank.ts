import type { Question, SkillId } from '../types'

const skillIds: SkillId[] = ['counting', 'comparing', 'addSub', 'placeValue']

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function shuffle(values: number[]): number[] {
  return [...values].sort(() => Math.random() - 0.5)
}

function createId(skillId: SkillId): string {
  return `${skillId}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function choicesFromCandidates(answer: number, candidates: number[], totalChoices: number): number[] {
  const choices = new Set<number>([answer])

  for (const candidate of candidates) {
    if (choices.size >= totalChoices) {
      break
    }

    choices.add(candidate)
  }

  return shuffle([...choices])
}

function nearMissChoices(answer: number, min: number, max: number, totalChoices = 4): number[] {
  const candidates = Array.from({ length: max - min + 1 }, (_, index) => min + index)
    .filter((value) => value !== answer)
    .sort((left, right) => Math.abs(left - answer) - Math.abs(right - answer))

  return choicesFromCandidates(answer, candidates, totalChoices)
}

function generateCountingQuestion(): Question {
  const count = randomInt(1, 10)

  return {
    id: createId('counting'),
    skillId: 'counting',
    prompt: 'How many apples are there?',
    choices: nearMissChoices(count, 1, 12),
    answer: count,
    visualCount: count,
  }
}

function generateComparingQuestion(): Question {
  const first = randomInt(0, 10)
  let second = randomInt(0, 10)

  while (second === first) {
    second = randomInt(0, 10)
  }

  return {
    id: createId('comparing'),
    skillId: 'comparing',
    prompt: 'Which number is bigger?',
    choices: [first, second],
    answer: Math.max(first, second),
  }
}

function generateAddSubQuestion(): Question {
  const operation = Math.random() < 0.5 ? '+' : '-'
  let left: number
  let right: number
  let answer: number

  if (operation === '+') {
    left = randomInt(0, 10)
    right = randomInt(left === 0 ? 1 : 0, 10 - left)
    answer = left + right
  } else {
    left = randomInt(1, 10)
    right = randomInt(0, left - 1)
    answer = left - right
  }

  const candidates = Array.from(
    { length: 5 },
    (_, index) => Math.max(0, answer - 2 + index),
  ).filter((value) => value !== answer)

  return {
    id: createId('addSub'),
    skillId: 'addSub',
    prompt: `${left} ${operation} ${right} = ?`,
    choices: choicesFromCandidates(answer, candidates, 4),
    answer,
  }
}

function generatePlaceValueQuestion(): Question {
  const number = randomInt(10, 99)
  const tens = Math.floor(number / 10)
  const candidates = Array.from({ length: 10 }, (_, index) => index)
    .filter((value) => value !== tens)
    .sort((left, right) => Math.abs(left - tens) - Math.abs(right - tens))

  return {
    id: createId('placeValue'),
    skillId: 'placeValue',
    prompt: `How many tens are in this number? ${number}`,
    choices: choicesFromCandidates(tens, candidates, 4),
    answer: tens,
  }
}

export function generateQuestion(skillId: SkillId): Question {
  switch (skillId) {
    case 'counting':
      return generateCountingQuestion()
    case 'comparing':
      return generateComparingQuestion()
    case 'addSub':
      return generateAddSubQuestion()
    case 'placeValue':
      return generatePlaceValueQuestion()
    default: {
      const exhaustiveSkillId: never = skillId
      throw new Error(`Unsupported skill id: ${exhaustiveSkillId}`)
    }
  }
}

export { skillIds }
