import { describe, expect, it } from 'vitest'
import { generateQuestion } from './questionBank'
import type { SkillId } from '../types'

const skillIds: SkillId[] = ['counting', 'comparing', 'addSub', 'placeValue']

describe('generateQuestion', () => {
  for (const skillId of skillIds) {
    it(`includes the answer and has unique choices for ${skillId}`, () => {
      for (let index = 0; index < 50; index += 1) {
        const question = generateQuestion(skillId)

        expect(question.choices).toContain(question.answer)
        expect(new Set(question.choices).size).toBe(question.choices.length)
      }
    })
  }
})
