import { describe, expect, it } from 'vitest'
import {
  CAMBRIDGE_PRIMARY_MATH_BOOK1,
  getNextUnitId,
  getUnitById,
} from './cambridgePrimaryMathBook1'

describe('CAMBRIDGE_PRIMARY_MATH_BOOK1', () => {
  it('has 16 units with 10 valid questions each', () => {
    expect(CAMBRIDGE_PRIMARY_MATH_BOOK1.units).toHaveLength(16)

    for (const unit of CAMBRIDGE_PRIMARY_MATH_BOOK1.units) {
      expect(unit.questions).toHaveLength(10)

      for (const question of unit.questions) {
        expect(question.choices).toContain(question.answer)
        expect(new Set(question.choices).size).toBe(question.choices.length)
      }
    }
  })

  it('has unique unit ids', () => {
    const ids = CAMBRIDGE_PRIMARY_MATH_BOOK1.units.map((unit) => unit.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('looks up a unit by id', () => {
    const unit = getUnitById(CAMBRIDGE_PRIMARY_MATH_BOOK1, 'unit_1')
    expect(unit?.name).toBe('Numbers to 10')
  })

  it('returns the next unit id in sequence, and null after the last unit', () => {
    expect(getNextUnitId(CAMBRIDGE_PRIMARY_MATH_BOOK1, 'unit_1')).toBe('unit_2')
    expect(getNextUnitId(CAMBRIDGE_PRIMARY_MATH_BOOK1, 'unit_16')).toBeNull()
  })
})
