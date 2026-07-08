# Treasure Hunt Level System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Math Island's 4-skill Level 1 with a 16-treasure island driven by a configurable curriculum config (Cambridge Primary Mathematics Book 1), with sequential unlock, coin rewards, and a coin-flight animation into the header wallet.

**Architecture:** A `Curriculum` data module (`src/curriculums/cambridgePrimaryMathBook1.ts`) holds 16 units (10 static questions each) plus each unit's map position. `ChildProfile.levelProgress` tracks per-curriculum treasure completion and the currently unlocked treasure id, keyed by curriculum id so a second curriculum can be added later without touching this one. `QuizScreen` becomes a pure quiz runner (no profile access) that reports `(unitId, coinsEarned)` on completion; `App.tsx` applies that result to the profile via `completeTreasure` and hands a "coin animation pending" flag to `HomeScreen`, which flies a coin from the completed treasure's map position to the header and plays sounds.

**Tech Stack:** React 19 + TypeScript, Vite, Vitest + @testing-library/react, Web Audio API (no external assets), CSS (no animation libraries).

## Global Constraints

- The existing `SkillId`/`SkillProgress`/4-skill system is fully replaced, not kept alongside — there is no persisted production data to migrate, so dead code must be deleted rather than left unused (YAGNI).
- `src/data/questionBank.ts` and `src/data/questionBank.test.ts` are deleted; procedural question generation is replaced by static curriculum content.
- All 16 units' questions use the existing numeric `choices: number[]` / `answer: number` shape (no schema change to support text answers) — units like Geometry/Time/Statistics are phrased so their answer is a number (e.g. "How many sides does a triangle have?" → 3).
- Treasures unlock in fixed sequence matching curriculum unit order (`unit_1` → `unit_2` → ... → `unit_16`); replaying a completed treasure never re-awards bells (`completeTreasure` is a no-op on already-completed units).
- The `QuizScreen` Next button is always visible (not gated behind answering correctly) — a child can skip a question they're stuck on, so `coinsEarned` can genuinely range 0-10 based on how many they got right. This changes existing behavior (currently Next is hidden until correct) — call this out to the user after implementation in case they want the old strict-lock behavior back.
- Treasure map positions in `src/assets/adventure-island.png` are estimated from visual inspection of the current image (16 treasure chests were identified). They are approximate — verify in the running app and adjust the `mapLeft`/`mapTop` values in `src/curriculums/cambridgePrimaryMathBook1.ts` if any hotspot doesn't sit on its chest.
- All existing sound/animation/mobile-responsive work is preserved; only the skill/quiz/profile/home/parent layers change.

---

### Task 1: Core data types for curriculum and treasure progress

**Files:**
- Modify: `src/types.ts`

**Interfaces:**
- Produces: `TreasureQuestion`, `CurriculumUnit`, `Curriculum`, `TreasureProgress`, `LevelProgress`, `ChildProfile` (new shape) — every later task imports these from `../types`.

- [ ] **Step 1: Replace the contents of `src/types.ts`**

```typescript
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
```

- [ ] **Step 2: Verify the project still type-checks up to this point (expect failures elsewhere)**

Run: `cd D:\math-island && npx tsc --noEmit`
Expected: FAIL with errors in `questionBank.ts`, `profileStore.ts`, `HomeScreen.tsx`, `QuizScreen.tsx`, `ParentScreen.tsx`, `App.tsx` (all reference the old `SkillId`/`SkillProgress` types) — this is expected; those files are rewritten in later tasks.

- [ ] **Step 3: Commit**

```bash
cd D:\math-island
git add src/types.ts
git commit -m "refactor: replace skill-based types with curriculum/treasure types"
```

---

### Task 2: Cambridge Primary Mathematics Book 1 curriculum content

**Files:**
- Create: `src/curriculums/cambridgePrimaryMathBook1.ts`
- Test: `src/curriculums/cambridgePrimaryMathBook1.test.ts`

**Interfaces:**
- Consumes: `Curriculum`, `CurriculumUnit`, `TreasureQuestion` from `../types` (Task 1)
- Produces: `CAMBRIDGE_PRIMARY_MATH_BOOK1_ID: string`, `CAMBRIDGE_PRIMARY_MATH_BOOK1: Curriculum`, `getUnitById(curriculum: Curriculum, unitId: string): CurriculumUnit | undefined`, `getNextUnitId(curriculum: Curriculum, currentUnitId: string): string | null` — used by `profileStore.ts`, `QuizScreen.tsx`, `HomeScreen.tsx`, `ParentScreen.tsx`, `App.tsx` in later tasks.

- [ ] **Step 1: Write the failing test**

Create `src/curriculums/cambridgePrimaryMathBook1.test.ts`:

```typescript
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd D:\math-island && npx vitest run src/curriculums/cambridgePrimaryMathBook1.test.ts`
Expected: FAIL with "Cannot find module './cambridgePrimaryMathBook1'"

- [ ] **Step 3: Create `src/curriculums/cambridgePrimaryMathBook1.ts`**

```typescript
import type { Curriculum, CurriculumUnit } from '../types'

export const CAMBRIDGE_PRIMARY_MATH_BOOK1_ID = 'cambridge-primary-math-book1'

const unit1: CurriculumUnit = {
  id: 'unit_1',
  name: 'Numbers to 10',
  mapLeft: '23%',
  mapTop: '78%',
  questions: [
    { id: 'u1_q1', prompt: 'How many apples are there?', choices: [1, 2, 3, 4], answer: 2, visualCount: 2 },
    { id: 'u1_q2', prompt: 'How many apples are there?', choices: [3, 4, 5, 6], answer: 5, visualCount: 5 },
    { id: 'u1_q3', prompt: 'How many apples are there?', choices: [5, 6, 7, 8], answer: 7, visualCount: 7 },
    { id: 'u1_q4', prompt: 'How many apples are there?', choices: [1, 2, 3, 4], answer: 1, visualCount: 1 },
    { id: 'u1_q5', prompt: 'How many apples are there?', choices: [7, 8, 9, 10], answer: 9, visualCount: 9 },
    { id: 'u1_q6', prompt: 'How many apples are there?', choices: [1, 2, 3, 4], answer: 3, visualCount: 3 },
    { id: 'u1_q7', prompt: 'How many apples are there?', choices: [7, 8, 9, 10], answer: 10, visualCount: 10 },
    { id: 'u1_q8', prompt: 'How many apples are there?', choices: [4, 5, 6, 7], answer: 6, visualCount: 6 },
    { id: 'u1_q9', prompt: 'How many apples are there?', choices: [2, 3, 4, 5], answer: 4, visualCount: 4 },
    { id: 'u1_q10', prompt: 'How many apples are there?', choices: [6, 7, 8, 9], answer: 8, visualCount: 8 },
  ],
}

const unit2: CurriculumUnit = {
  id: 'unit_2',
  name: 'Working with numbers to 10',
  mapLeft: '40%',
  mapTop: '79%',
  questions: [
    { id: 'u2_q1', prompt: '2 + 3 = ?', choices: [4, 5, 6, 7], answer: 5 },
    { id: 'u2_q2', prompt: '6 - 2 = ?', choices: [2, 3, 4, 5], answer: 4 },
    { id: 'u2_q3', prompt: '4 + 4 = ?', choices: [6, 7, 8, 9], answer: 8 },
    { id: 'u2_q4', prompt: '9 - 5 = ?', choices: [2, 3, 4, 5], answer: 4 },
    { id: 'u2_q5', prompt: '1 + 6 = ?', choices: [5, 6, 7, 8], answer: 7 },
    { id: 'u2_q6', prompt: '10 - 3 = ?', choices: [5, 6, 7, 8], answer: 7 },
    { id: 'u2_q7', prompt: '3 + 3 = ?', choices: [4, 5, 6, 7], answer: 6 },
    { id: 'u2_q8', prompt: '8 - 6 = ?', choices: [1, 2, 3, 4], answer: 2 },
    { id: 'u2_q9', prompt: '5 + 5 = ?', choices: [8, 9, 10, 11], answer: 10 },
    { id: 'u2_q10', prompt: '7 - 4 = ?', choices: [2, 3, 4, 5], answer: 3 },
  ],
}

const unit3: CurriculumUnit = {
  id: 'unit_3',
  name: 'Geometry',
  mapLeft: '10%',
  mapTop: '88%',
  questions: [
    { id: 'u3_q1', prompt: 'How many sides does a triangle have?', choices: [2, 3, 4, 5], answer: 3 },
    { id: 'u3_q2', prompt: 'How many sides does a square have?', choices: [3, 4, 5, 6], answer: 4 },
    { id: 'u3_q3', prompt: 'How many corners does a rectangle have?', choices: [2, 3, 4, 5], answer: 4 },
    { id: 'u3_q4', prompt: 'How many sides does a pentagon have?', choices: [4, 5, 6, 7], answer: 5 },
    { id: 'u3_q5', prompt: 'How many sides does a hexagon have?', choices: [5, 6, 7, 8], answer: 6 },
    { id: 'u3_q6', prompt: 'How many corners does a triangle have?', choices: [2, 3, 4, 5], answer: 3 },
    { id: 'u3_q7', prompt: 'How many faces does a cube have?', choices: [4, 5, 6, 7], answer: 6 },
    { id: 'u3_q8', prompt: 'How many corners does a cube have?', choices: [6, 7, 8, 9], answer: 8 },
    { id: 'u3_q9', prompt: 'How many sides does an octagon have?', choices: [6, 7, 8, 9], answer: 8 },
    { id: 'u3_q10', prompt: 'How many corners does a square have?', choices: [3, 4, 5, 6], answer: 4 },
  ],
}

const unit4: CurriculumUnit = {
  id: 'unit_4',
  name: 'Fractions',
  mapLeft: '10%',
  mapTop: '63%',
  questions: [
    { id: 'u4_q1', prompt: 'What is half of 2?', choices: [1, 2, 3, 4], answer: 1 },
    { id: 'u4_q2', prompt: 'What is half of 4?', choices: [1, 2, 3, 4], answer: 2 },
    { id: 'u4_q3', prompt: 'What is half of 6?', choices: [2, 3, 4, 5], answer: 3 },
    { id: 'u4_q4', prompt: 'What is half of 8?', choices: [3, 4, 5, 6], answer: 4 },
    { id: 'u4_q5', prompt: 'What is half of 10?', choices: [4, 5, 6, 7], answer: 5 },
    { id: 'u4_q6', prompt: 'What is half of 12?', choices: [5, 6, 7, 8], answer: 6 },
    { id: 'u4_q7', prompt: 'What is half of 14?', choices: [6, 7, 8, 9], answer: 7 },
    { id: 'u4_q8', prompt: 'What is half of 16?', choices: [7, 8, 9, 10], answer: 8 },
    { id: 'u4_q9', prompt: 'What is half of 18?', choices: [8, 9, 10, 11], answer: 9 },
    { id: 'u4_q10', prompt: 'What is half of 20?', choices: [9, 10, 11, 12], answer: 10 },
  ],
}

const unit5: CurriculumUnit = {
  id: 'unit_5',
  name: 'Measures',
  mapLeft: '24%',
  mapTop: '65%',
  questions: [
    { id: 'u5_q1', prompt: 'Which is longer: 3 cm or 7 cm? Answer with the number.', choices: [3, 5, 7, 9], answer: 7 },
    { id: 'u5_q2', prompt: 'Which is shorter: 8 cm or 2 cm? Answer with the number.', choices: [2, 4, 6, 8], answer: 2 },
    { id: 'u5_q3', prompt: 'Which is longer: 5 cm or 4 cm? Answer with the number.', choices: [3, 4, 5, 6], answer: 5 },
    { id: 'u5_q4', prompt: 'Which is shorter: 9 cm or 6 cm? Answer with the number.', choices: [6, 7, 8, 9], answer: 6 },
    { id: 'u5_q5', prompt: 'Which is longer: 1 cm or 10 cm? Answer with the number.', choices: [1, 4, 7, 10], answer: 10 },
    { id: 'u5_q6', prompt: 'Which is shorter: 3 cm or 5 cm? Answer with the number.', choices: [2, 3, 4, 5], answer: 3 },
    { id: 'u5_q7', prompt: 'Which is longer: 6 cm or 2 cm? Answer with the number.', choices: [2, 4, 6, 8], answer: 6 },
    { id: 'u5_q8', prompt: 'Which is shorter: 7 cm or 4 cm? Answer with the number.', choices: [3, 4, 5, 7], answer: 4 },
    { id: 'u5_q9', prompt: 'Which is longer: 8 cm or 9 cm? Answer with the number.', choices: [6, 7, 8, 9], answer: 9 },
    { id: 'u5_q10', prompt: 'Which is shorter: 2 cm or 6 cm? Answer with the number.', choices: [2, 3, 4, 6], answer: 2 },
  ],
}

const unit6: CurriculumUnit = {
  id: 'unit_6',
  name: 'Position',
  mapLeft: '64%',
  mapTop: '68%',
  questions: [
    { id: 'u6_q1', prompt: "What number position is 'first'?", choices: [1, 2, 3, 4], answer: 1 },
    { id: 'u6_q2', prompt: "What number position is 'third'?", choices: [2, 3, 4, 5], answer: 3 },
    { id: 'u6_q3', prompt: "What number position is 'fifth'?", choices: [3, 4, 5, 6], answer: 5 },
    { id: 'u6_q4', prompt: "What number position is 'second'?", choices: [1, 2, 3, 4], answer: 2 },
    { id: 'u6_q5', prompt: "What number position is 'fourth'?", choices: [2, 3, 4, 5], answer: 4 },
    { id: 'u6_q6', prompt: "What number position is 'sixth'?", choices: [4, 5, 6, 7], answer: 6 },
    { id: 'u6_q7', prompt: "What number position is 'seventh'?", choices: [5, 6, 7, 8], answer: 7 },
    { id: 'u6_q8', prompt: "What number position is 'eighth'?", choices: [6, 7, 8, 9], answer: 8 },
    { id: 'u6_q9', prompt: "What number position is 'ninth'?", choices: [7, 8, 9, 10], answer: 9 },
    { id: 'u6_q10', prompt: "What number position is 'tenth'?", choices: [7, 8, 9, 10], answer: 10 },
  ],
}

const unit7: CurriculumUnit = {
  id: 'unit_7',
  name: 'Time',
  mapLeft: '7%',
  mapTop: '42%',
  questions: [
    { id: 'u7_q1', prompt: "The clock shows 3 o'clock. What is the hour?", choices: [2, 3, 4, 5], answer: 3 },
    { id: 'u7_q2', prompt: "The clock shows 7 o'clock. What is the hour?", choices: [6, 7, 8, 9], answer: 7 },
    { id: 'u7_q3', prompt: "The clock shows 1 o'clock. What is the hour?", choices: [1, 2, 3, 4], answer: 1 },
    { id: 'u7_q4', prompt: "The clock shows 10 o'clock. What is the hour?", choices: [8, 9, 10, 11], answer: 10 },
    { id: 'u7_q5', prompt: "How many hours are between 2 o'clock and 5 o'clock?", choices: [2, 3, 4, 5], answer: 3 },
    { id: 'u7_q6', prompt: "How many hours are between 1 o'clock and 6 o'clock?", choices: [4, 5, 6, 7], answer: 5 },
    { id: 'u7_q7', prompt: "The clock shows 12 o'clock. What is the hour?", choices: [10, 11, 12, 1], answer: 12 },
    { id: 'u7_q8', prompt: "How many hours are between 3 o'clock and 8 o'clock?", choices: [4, 5, 6, 7], answer: 5 },
    { id: 'u7_q9', prompt: "The clock shows 9 o'clock. What is the hour?", choices: [7, 8, 9, 10], answer: 9 },
    { id: 'u7_q10', prompt: "How many hours are between 6 o'clock and 9 o'clock?", choices: [2, 3, 4, 5], answer: 3 },
  ],
}

const unit8: CurriculumUnit = {
  id: 'unit_8',
  name: 'Statistics',
  mapLeft: '30%',
  mapTop: '52%',
  questions: [
    { id: 'u8_q1', prompt: 'Circle A has 3 items and circle B has 2 items with no overlap. How many items in total?', choices: [3, 4, 5, 6], answer: 5 },
    { id: 'u8_q2', prompt: 'A set has 4 red apples and 3 green apples. How many apples in total?', choices: [5, 6, 7, 8], answer: 7 },
    { id: 'u8_q3', prompt: 'A Venn diagram has 2 in circle A only, 3 in circle B only, and 1 in both. How many in circle A total?', choices: [1, 2, 3, 4], answer: 3 },
    { id: 'u8_q4', prompt: 'A Venn diagram has 2 in circle A only, 3 in circle B only, and 1 in both. How many in circle B total?', choices: [2, 3, 4, 5], answer: 4 },
    { id: 'u8_q5', prompt: 'A set of shapes has 6 circles and 2 squares. How many shapes in total?', choices: [6, 7, 8, 9], answer: 8 },
    { id: 'u8_q6', prompt: 'A set has 5 toys, and 2 are removed. How many toys are left?', choices: [2, 3, 4, 5], answer: 3 },
    { id: 'u8_q7', prompt: 'A Venn diagram has 4 in circle A only and 3 in both. How many are in circle A total?', choices: [5, 6, 7, 8], answer: 7 },
    { id: 'u8_q8', prompt: 'A set has 10 stickers and 4 are given away. How many stickers are left?', choices: [4, 5, 6, 7], answer: 6 },
    { id: 'u8_q9', prompt: 'A group has 3 boys and 5 girls. How many children in total?', choices: [6, 7, 8, 9], answer: 8 },
    { id: 'u8_q10', prompt: 'A set has 9 fruits and 3 are apples. How many are not apples?', choices: [4, 5, 6, 7], answer: 6 },
  ],
}

const unit9: CurriculumUnit = {
  id: 'unit_9',
  name: 'Numbers to 20',
  mapLeft: '55%',
  mapTop: '52%',
  questions: [
    { id: 'u9_q1', prompt: 'How many apples are there?', choices: [10, 11, 12, 13], answer: 12, visualCount: 12 },
    { id: 'u9_q2', prompt: 'How many apples are there?', choices: [13, 14, 15, 16], answer: 15, visualCount: 15 },
    { id: 'u9_q3', prompt: 'How many apples are there?', choices: [9, 10, 11, 12], answer: 11, visualCount: 11 },
    { id: 'u9_q4', prompt: 'How many apples are there?', choices: [16, 17, 18, 19], answer: 18, visualCount: 18 },
    { id: 'u9_q5', prompt: 'How many apples are there?', choices: [12, 13, 14, 15], answer: 14, visualCount: 14 },
    { id: 'u9_q6', prompt: 'How many apples are there?', choices: [17, 18, 19, 20], answer: 20, visualCount: 20 },
    { id: 'u9_q7', prompt: 'How many apples are there?', choices: [11, 12, 13, 14], answer: 13, visualCount: 13 },
    { id: 'u9_q8', prompt: 'How many apples are there?', choices: [15, 16, 17, 18], answer: 17, visualCount: 17 },
    { id: 'u9_q9', prompt: 'How many apples are there?', choices: [14, 15, 16, 17], answer: 16, visualCount: 16 },
    { id: 'u9_q10', prompt: 'How many apples are there?', choices: [17, 18, 19, 20], answer: 19, visualCount: 19 },
  ],
}

const unit10: CurriculumUnit = {
  id: 'unit_10',
  name: 'Working with numbers to 20',
  mapLeft: '40%',
  mapTop: '43%',
  questions: [
    { id: 'u10_q1', prompt: '12 + 3 = ?', choices: [13, 14, 15, 16], answer: 15 },
    { id: 'u10_q2', prompt: '18 - 5 = ?', choices: [11, 12, 13, 14], answer: 13 },
    { id: 'u10_q3', prompt: '9 + 8 = ?', choices: [15, 16, 17, 18], answer: 17 },
    { id: 'u10_q4', prompt: '20 - 6 = ?', choices: [12, 13, 14, 15], answer: 14 },
    { id: 'u10_q5', prompt: '11 + 7 = ?', choices: [16, 17, 18, 19], answer: 18 },
    { id: 'u10_q6', prompt: '19 - 9 = ?', choices: [8, 9, 10, 11], answer: 10 },
    { id: 'u10_q7', prompt: '6 + 9 = ?', choices: [13, 14, 15, 16], answer: 15 },
    { id: 'u10_q8', prompt: '16 - 4 = ?', choices: [10, 11, 12, 13], answer: 12 },
    { id: 'u10_q9', prompt: '10 + 10 = ?', choices: [18, 19, 20, 21], answer: 20 },
    { id: 'u10_q10', prompt: '17 - 8 = ?', choices: [7, 8, 9, 10], answer: 9 },
  ],
}

const unit11: CurriculumUnit = {
  id: 'unit_11',
  name: 'Geometry (2)',
  mapLeft: '62%',
  mapTop: '40%',
  questions: [
    { id: 'u11_q1', prompt: 'How many faces does a rectangular box (cuboid) have?', choices: [4, 5, 6, 7], answer: 6 },
    { id: 'u11_q2', prompt: 'How many edges does a cube have?', choices: [10, 11, 12, 13], answer: 12 },
    { id: 'u11_q3', prompt: 'How many faces does a triangular pyramid have?', choices: [3, 4, 5, 6], answer: 4 },
    { id: 'u11_q4', prompt: 'How many corners does a pentagon have?', choices: [3, 4, 5, 6], answer: 5 },
    { id: 'u11_q5', prompt: 'How many sides does a heptagon have?', choices: [6, 7, 8, 9], answer: 7 },
    { id: 'u11_q6', prompt: 'How many flat faces does a cylinder have?', choices: [0, 1, 2, 3], answer: 2 },
    { id: 'u11_q7', prompt: 'How many corners does a hexagon have?', choices: [5, 6, 7, 8], answer: 6 },
    { id: 'u11_q8', prompt: 'How many flat faces does a cone have?', choices: [0, 1, 2, 3], answer: 1 },
    { id: 'u11_q9', prompt: 'How many corners does an octagon have?', choices: [6, 7, 8, 9], answer: 8 },
    { id: 'u11_q10', prompt: 'How many edges does a triangle have?', choices: [2, 3, 4, 5], answer: 3 },
  ],
}

const unit12: CurriculumUnit = {
  id: 'unit_12',
  name: 'Fractions (2)',
  mapLeft: '90%',
  mapTop: '55%',
  questions: [
    { id: 'u12_q1', prompt: 'What is half of 22?', choices: [10, 11, 12, 13], answer: 11 },
    { id: 'u12_q2', prompt: 'What is half of 24?', choices: [11, 12, 13, 14], answer: 12 },
    { id: 'u12_q3', prompt: 'What is half of 26?', choices: [12, 13, 14, 15], answer: 13 },
    { id: 'u12_q4', prompt: 'What is half of 28?', choices: [13, 14, 15, 16], answer: 14 },
    { id: 'u12_q5', prompt: 'What is half of 30?', choices: [14, 15, 16, 17], answer: 15 },
    { id: 'u12_q6', prompt: 'What is half of 16?', choices: [7, 8, 9, 10], answer: 8 },
    { id: 'u12_q7', prompt: 'What is half of 18?', choices: [8, 9, 10, 11], answer: 9 },
    { id: 'u12_q8', prompt: 'What is half of 20?', choices: [9, 10, 11, 12], answer: 10 },
    { id: 'u12_q9', prompt: 'What is half of 32?', choices: [15, 16, 17, 18], answer: 16 },
    { id: 'u12_q10', prompt: 'What is half of 34?', choices: [16, 17, 18, 19], answer: 17 },
  ],
}

const unit13: CurriculumUnit = {
  id: 'unit_13',
  name: 'Measures (2)',
  mapLeft: '13%',
  mapTop: '23%',
  questions: [
    { id: 'u13_q1', prompt: 'Which is heavier: 2 kg or 8 kg? Answer with the number.', choices: [2, 4, 6, 8], answer: 8 },
    { id: 'u13_q2', prompt: 'Which is lighter: 5 kg or 3 kg? Answer with the number.', choices: [2, 3, 4, 5], answer: 3 },
    { id: 'u13_q3', prompt: 'Which holds more: 4 litres or 9 litres? Answer with the number.', choices: [4, 6, 7, 9], answer: 9 },
    { id: 'u13_q4', prompt: 'Which holds less: 6 litres or 2 litres? Answer with the number.', choices: [1, 2, 3, 6], answer: 2 },
    { id: 'u13_q5', prompt: 'Which is heavier: 7 kg or 1 kg? Answer with the number.', choices: [1, 3, 5, 7], answer: 7 },
    { id: 'u13_q6', prompt: 'Which is lighter: 9 kg or 4 kg? Answer with the number.', choices: [3, 4, 5, 9], answer: 4 },
    { id: 'u13_q7', prompt: 'Which holds more: 3 litres or 10 litres? Answer with the number.', choices: [3, 5, 7, 10], answer: 10 },
    { id: 'u13_q8', prompt: 'Which holds less: 8 litres or 5 litres? Answer with the number.', choices: [4, 5, 6, 8], answer: 5 },
    { id: 'u13_q9', prompt: 'Which is heavier: 6 kg or 2 kg? Answer with the number.', choices: [2, 3, 4, 6], answer: 6 },
    { id: 'u13_q10', prompt: 'Which is lighter: 7 kg or 5 kg? Answer with the number.', choices: [4, 5, 6, 7], answer: 5 },
  ],
}

const unit14: CurriculumUnit = {
  id: 'unit_14',
  name: 'Position, direction and patterns',
  mapLeft: '90%',
  mapTop: '32%',
  questions: [
    { id: 'u14_q1', prompt: 'What number comes next: 2, 4, 6, 8, ?', choices: [9, 10, 11, 12], answer: 10 },
    { id: 'u14_q2', prompt: 'What number comes next: 1, 3, 5, 7, ?', choices: [8, 9, 10, 11], answer: 9 },
    { id: 'u14_q3', prompt: 'What number comes next: 5, 10, 15, 20, ?', choices: [22, 24, 25, 30], answer: 25 },
    { id: 'u14_q4', prompt: 'What number comes next: 10, 8, 6, 4, ?', choices: [1, 2, 3, 4], answer: 2 },
    { id: 'u14_q5', prompt: 'What number comes next: 3, 6, 9, 12, ?', choices: [13, 14, 15, 16], answer: 15 },
    { id: 'u14_q6', prompt: 'What number comes next: 20, 18, 16, 14, ?', choices: [10, 11, 12, 13], answer: 12 },
    { id: 'u14_q7', prompt: 'What number comes next: 0, 2, 4, 6, ?', choices: [7, 8, 9, 10], answer: 8 },
    { id: 'u14_q8', prompt: 'What number comes next: 4, 8, 12, 16, ?', choices: [18, 19, 20, 21], answer: 20 },
    { id: 'u14_q9', prompt: 'What number comes next: 15, 12, 9, 6, ?', choices: [2, 3, 4, 5], answer: 3 },
    { id: 'u14_q10', prompt: 'What number comes next: 1, 4, 7, 10, ?', choices: [11, 12, 13, 14], answer: 13 },
  ],
}

const unit15: CurriculumUnit = {
  id: 'unit_15',
  name: 'Time (2)',
  mapLeft: '77%',
  mapTop: '22%',
  questions: [
    { id: 'u15_q1', prompt: 'How many minutes are in half an hour?', choices: [15, 20, 30, 45], answer: 30 },
    { id: 'u15_q2', prompt: 'How many minutes are in a full hour?', choices: [30, 45, 60, 90], answer: 60 },
    { id: 'u15_q3', prompt: 'The clock shows half past 3. What is the hour number?', choices: [2, 3, 4, 5], answer: 3 },
    { id: 'u15_q4', prompt: 'How many minutes are in a quarter of an hour?', choices: [10, 15, 20, 25], answer: 15 },
    { id: 'u15_q5', prompt: 'The clock shows half past 7. What is the hour number?', choices: [6, 7, 8, 9], answer: 7 },
    { id: 'u15_q6', prompt: 'How many half-hours are in 2 hours?', choices: [2, 3, 4, 5], answer: 4 },
    { id: 'u15_q7', prompt: 'The clock shows half past 9. What is the hour number?', choices: [8, 9, 10, 11], answer: 9 },
    { id: 'u15_q8', prompt: 'How many minutes are in 2 hours?', choices: [90, 100, 110, 120], answer: 120 },
    { id: 'u15_q9', prompt: 'The clock shows half past 11. What is the hour number?', choices: [9, 10, 11, 12], answer: 11 },
    { id: 'u15_q10', prompt: 'How many quarter-hours are in 1 hour?', choices: [2, 3, 4, 5], answer: 4 },
  ],
}

const unit16: CurriculumUnit = {
  id: 'unit_16',
  name: 'Statistics (2)',
  mapLeft: '50%',
  mapTop: '21%',
  questions: [
    { id: 'u16_q1', prompt: 'A block graph shows 4 blocks for apples and 6 for bananas. How many more bananas than apples?', choices: [1, 2, 3, 4], answer: 2 },
    { id: 'u16_q2', prompt: 'A tally shows 5 marks for cats and 3 for dogs. How many pets in total?', choices: [6, 7, 8, 9], answer: 8 },
    { id: 'u16_q3', prompt: 'A block graph shows 7 blocks for red and 2 for blue. How many more red than blue?', choices: [3, 4, 5, 6], answer: 5 },
    { id: 'u16_q4', prompt: 'A table shows 3 rows with 4 items each. How many items in total?', choices: [10, 11, 12, 13], answer: 12 },
    { id: 'u16_q5', prompt: 'A tally shows 6 marks for sunny days and 4 for rainy days. How many days in total?', choices: [8, 9, 10, 11], answer: 10 },
    { id: 'u16_q6', prompt: 'A block graph shows 5 blocks for football and 8 for swimming. How many more swimming than football?', choices: [2, 3, 4, 5], answer: 3 },
    { id: 'u16_q7', prompt: 'A table shows 2 rows with 6 items each. How many items in total?', choices: [10, 11, 12, 13], answer: 12 },
    { id: 'u16_q8', prompt: 'A tally shows 9 marks for pens and 5 for pencils. How many more pens than pencils?', choices: [2, 3, 4, 5], answer: 4 },
    { id: 'u16_q9', prompt: 'A block graph shows 3 blocks for yellow and 7 for green. How many blocks in total?', choices: [8, 9, 10, 11], answer: 10 },
    { id: 'u16_q10', prompt: 'A table shows 4 rows with 5 items each. How many items in total?', choices: [18, 19, 20, 21], answer: 20 },
  ],
}

export const CAMBRIDGE_PRIMARY_MATH_BOOK1: Curriculum = {
  id: CAMBRIDGE_PRIMARY_MATH_BOOK1_ID,
  name: 'Cambridge Primary Mathematics Book 1',
  units: [
    unit1, unit2, unit3, unit4, unit5, unit6, unit7, unit8,
    unit9, unit10, unit11, unit12, unit13, unit14, unit15, unit16,
  ],
}

export function getUnitById(
  curriculum: Curriculum,
  unitId: string,
): CurriculumUnit | undefined {
  return curriculum.units.find((unit) => unit.id === unitId)
}

export function getNextUnitId(
  curriculum: Curriculum,
  currentUnitId: string,
): string | null {
  const currentIndex = curriculum.units.findIndex((unit) => unit.id === currentUnitId)

  if (currentIndex === -1 || currentIndex === curriculum.units.length - 1) {
    return null
  }

  return curriculum.units[currentIndex + 1].id
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd D:\math-island && npx vitest run src/curriculums/cambridgePrimaryMathBook1.test.ts`
Expected: PASS (4 tests)

- [ ] **Step 5: Commit**

```bash
cd D:\math-island
git add src/curriculums/cambridgePrimaryMathBook1.ts src/curriculums/cambridgePrimaryMathBook1.test.ts
git commit -m "feat: add Cambridge Primary Math Book 1 curriculum with 16 units"
```

---

### Task 3: Coin collection and treasure-unlock sounds

**Files:**
- Modify: `src/utils/sound.ts`

**Interfaces:**
- Produces: `playCoinSound(): void`, `playTreasureUnlockSound(): void` — used by `HomeScreen.tsx` (Task 6).

- [ ] **Step 1: Add the two new sound functions to the end of `src/utils/sound.ts`**

```typescript
export function playCoinSound() {
  playTones(
    [
      { frequency: 1318.51, startTime: 0, duration: 0.08 },
      { frequency: 1567.98, startTime: 0.06, duration: 0.16 },
    ],
    'square',
    0.14,
  )
}

export function playTreasureUnlockSound() {
  playTones(
    [
      { frequency: 440, startTime: 0, duration: 0.1 },
      { frequency: 554.37, startTime: 0.08, duration: 0.1 },
      { frequency: 659.25, startTime: 0.16, duration: 0.1 },
      { frequency: 880, startTime: 0.24, duration: 0.32 },
    ],
    'triangle',
    0.17,
  )
}
```

- [ ] **Step 2: Verify the project builds (no existing test file covers `sound.ts`, consistent with the rest of the file)**

Run: `cd D:\math-island && npx tsc --noEmit`
Expected: Same pre-existing errors as Task 1 Step 2 (unrelated files not yet rewritten) — no new errors from `sound.ts`.

- [ ] **Step 3: Commit**

```bash
cd D:\math-island
git add src/utils/sound.ts
git commit -m "feat: add coin collection and treasure unlock sounds"
```

---

### Task 4: Rewrite profileStore for treasure progress, delete old question bank

**Files:**
- Modify: `src/store/profileStore.ts`
- Modify: `src/store/profileStore.test.ts`
- Delete: `src/data/questionBank.ts`
- Delete: `src/data/questionBank.test.ts`

**Interfaces:**
- Consumes: `CAMBRIDGE_PRIMARY_MATH_BOOK1`, `CAMBRIDGE_PRIMARY_MATH_BOOK1_ID` from `../curriculums/cambridgePrimaryMathBook1` (Task 2); `ChildProfile`, `LevelProgress`, `TreasureProgress` from `../types` (Task 1)
- Produces: `loadProfile(): ChildProfile`, `saveProfile(profile: ChildProfile): void`, `CompleteTreasureResult { profile: ChildProfile; coinsAwarded: number }`, `completeTreasure(profile: ChildProfile, curriculumId: string, unitId: string, coinsEarned: number, nextUnitId: string | null): CompleteTreasureResult` — used by `App.tsx` (Task 8).

- [ ] **Step 1: Delete the old question bank files**

```bash
cd D:\math-island
git rm src/data/questionBank.ts src/data/questionBank.test.ts
```

- [ ] **Step 2: Write the failing test — replace `src/store/profileStore.test.ts`**

```typescript
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
```

- [ ] **Step 3: Run test to verify it fails**

Run: `cd D:\math-island && npx vitest run src/store/profileStore.test.ts`
Expected: FAIL (old `profileStore.ts` still exports the skill-based API; `loadProfile()` shape mismatches expectations)

- [ ] **Step 4: Replace `src/store/profileStore.ts`**

```typescript
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
```

- [ ] **Step 5: Run test to verify it passes**

Run: `cd D:\math-island && npx vitest run src/store/profileStore.test.ts`
Expected: PASS (5 tests)

- [ ] **Step 6: Commit**

```bash
cd D:\math-island
git add -A
git commit -m "refactor: rewrite profileStore for treasure progress, remove old question bank"
```

---

### Task 5: Rewrite QuizScreen to run curriculum-driven quizzes

**Files:**
- Modify: `src/screens/QuizScreen.tsx`
- Modify: `src/screens/QuizScreen.test.tsx`

**Interfaces:**
- Consumes: `CAMBRIDGE_PRIMARY_MATH_BOOK1`, `getUnitById` from `../curriculums/cambridgePrimaryMathBook1` (Task 2); `playCelebrationSound`, `playClickSound`, `playCorrectSound`, `playWrongSound` from `../utils/sound` (existing)
- Produces: `QuizScreen({ unitId, onComplete, onExit }: QuizScreenProps)` where `onComplete: (unitId: string, coinsEarned: number) => void` — used by `App.tsx` (Task 8).

- [ ] **Step 1: Write the failing test — replace `src/screens/QuizScreen.test.tsx`**

```tsx
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { QuizScreen } from './QuizScreen'

const answerAllTenQuestions = () => {
  for (let index = 0; index < 10; index += 1) {
    const appleCount = screen.getByTestId('visual-objects').querySelectorAll('span').length
    const buttons = screen.getAllByTestId(/^choice-button-/)
    const correctButton = buttons.find((button) => button.textContent === String(appleCount))

    fireEvent.click(correctButton as HTMLElement)
    fireEvent.click(screen.getByTestId('next-button'))
  }
}

describe('QuizScreen', () => {
  it('answers all 10 questions for unit_1, shows the score, and completes with full coins', () => {
    const onComplete = vi.fn()
    const onExit = vi.fn()

    render(<QuizScreen onComplete={onComplete} onExit={onExit} unitId="unit_1" />)

    answerAllTenQuestions()

    expect(screen.getByTestId('quiz-summary')).not.toBeNull()
    expect(screen.getByTestId('summary-score').textContent).toContain('10 / 10')

    fireEvent.click(screen.getByTestId('back-to-island-button'))

    expect(onComplete).toHaveBeenCalledWith('unit_1', 10)
    expect(onComplete).toHaveBeenCalledTimes(1)
    expect(onExit).not.toHaveBeenCalled()
  })

  it('calls onExit without completing when Exit is clicked mid-quiz', () => {
    const onComplete = vi.fn()
    const onExit = vi.fn()

    render(<QuizScreen onComplete={onComplete} onExit={onExit} unitId="unit_1" />)

    fireEvent.click(screen.getByText('Exit'))

    expect(onExit).toHaveBeenCalledTimes(1)
    expect(onComplete).not.toHaveBeenCalled()
  })

  it('awards fewer coins when a question is skipped via Next without answering correctly', () => {
    const onComplete = vi.fn()

    render(<QuizScreen onComplete={onComplete} onExit={vi.fn()} unitId="unit_1" />)

    fireEvent.click(screen.getByTestId('next-button'))

    for (let index = 0; index < 9; index += 1) {
      const appleCount = screen.getByTestId('visual-objects').querySelectorAll('span').length
      const buttons = screen.getAllByTestId(/^choice-button-/)
      const correctButton = buttons.find((button) => button.textContent === String(appleCount))

      fireEvent.click(correctButton as HTMLElement)
      fireEvent.click(screen.getByTestId('next-button'))
    }

    fireEvent.click(screen.getByTestId('back-to-island-button'))

    expect(onComplete).toHaveBeenCalledWith('unit_1', 9)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd D:\math-island && npx vitest run src/screens/QuizScreen.test.tsx`
Expected: FAIL (old `QuizScreen` expects `skillId`/`profile`/`onProfileChange` props, not `unitId`/`onComplete`)

- [ ] **Step 3: Replace `src/screens/QuizScreen.tsx`**

```tsx
import { useState } from 'react'
import { Button, Card, Progress, Typewriter } from 'animal-island-ui'
import { CAMBRIDGE_PRIMARY_MATH_BOOK1, getUnitById } from '../curriculums/cambridgePrimaryMathBook1'
import { MusicToggleButton } from '../components/MusicToggleButton'
import {
  playCelebrationSound,
  playClickSound,
  playCorrectSound,
  playWrongSound,
} from '../utils/sound'
import './QuizScreen.css'

const TOTAL_QUESTIONS = 10

interface QuizScreenProps {
  unitId: string
  onComplete: (unitId: string, coinsEarned: number) => void
  onExit: () => void
}

export function QuizScreen({ unitId, onComplete, onExit }: QuizScreenProps) {
  const unit = getUnitById(CAMBRIDGE_PRIMARY_MATH_BOOK1, unitId)

  if (!unit) {
    throw new Error(`Unknown unit id: ${unitId}`)
  }

  const [questionIndex, setQuestionIndex] = useState(1)
  const [correctCount, setCorrectCount] = useState(0)
  const [selectedChoice, setSelectedChoice] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)
  const [showSummary, setShowSummary] = useState(false)

  const currentQuestion = unit.questions[questionIndex - 1]

  const handleChoiceClick = (choice: number) => {
    const isCorrect = choice === currentQuestion.answer

    setSelectedChoice(choice)
    setFeedbackMessage(isCorrect ? 'Great job! 🎉' : 'Try again!')

    if (isCorrect) {
      setAnswered(true)
      setCorrectCount((count) => count + 1)
      playCorrectSound()
    } else {
      playWrongSound()
    }
  }

  const handleNextClick = () => {
    if (questionIndex >= TOTAL_QUESTIONS) {
      playCelebrationSound()
      setShowSummary(true)
      return
    }

    playClickSound()
    setQuestionIndex((index) => index + 1)
    setSelectedChoice(null)
    setAnswered(false)
    setFeedbackMessage(null)
  }

  const handleExitClick = () => {
    playClickSound()
    onExit()
  }

  const handleBackToIslandClick = () => {
    playClickSound()
    onComplete(unitId, correctCount)
  }

  if (showSummary) {
    return (
      <main className="quiz-screen quiz-screen--summary" data-testid="quiz-screen">
        <Card className="quiz-screen__summary-card" color="app-green">
          <section data-testid="quiz-summary">
            <p className="quiz-screen__eyebrow">Quiz complete</p>
            <h1>Score</h1>
            <p className="quiz-screen__score" data-testid="summary-score">
              {correctCount} / {TOTAL_QUESTIONS}
            </p>
            <Button
              data-testid="back-to-island-button"
              htmlType="button"
              onClick={handleBackToIslandClick}
              type="primary"
            >
              Back to Island
            </Button>
          </section>
        </Card>
      </main>
    )
  }

  return (
    <main className="quiz-screen" data-testid="quiz-screen">
      <header className="quiz-screen__header">
        <Button htmlType="button" onClick={handleExitClick} type="text">
          Exit
        </Button>
        <MusicToggleButton />
        <div className="quiz-screen__progress">
          <span>
            Question {questionIndex} / {TOTAL_QUESTIONS}
          </span>
          <Progress
            duration={0}
            infoFormat={() => `${questionIndex} / ${TOTAL_QUESTIONS}`}
            infoPosition="right"
            percent={(questionIndex / TOTAL_QUESTIONS) * 100}
            showInfo
            size="middle"
          />
        </div>
      </header>

      <Card className="quiz-screen__question-card" color="app-yellow">
        <p className="quiz-screen__eyebrow">Choose the answer</p>
        <h1 className="quiz-screen__prompt" data-testid="question-prompt">
          <Typewriter autoPlay={false} trigger={currentQuestion.id}>
            {currentQuestion.prompt}
          </Typewriter>
        </h1>

        {currentQuestion.visualCount !== undefined ? (
          <div
            aria-hidden="true"
            className="quiz-screen__visual-objects"
            data-testid="visual-objects"
          >
            {Array.from({ length: currentQuestion.visualCount }).map((_, index) => (
              <span className="quiz-screen__visual-object" key={index}>
                🍎
              </span>
            ))}
          </div>
        ) : null}

        <div className="quiz-screen__choices">
          {currentQuestion.choices.map((choice, index) => {
            const isSelected = selectedChoice === choice
            const isCorrectChoice = answered && choice === currentQuestion.answer

            return (
              <Button
                block
                className={[
                  'quiz-screen__choice',
                  isSelected ? 'quiz-screen__choice--selected' : '',
                  isCorrectChoice ? 'quiz-screen__choice--correct' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                data-testid={`choice-button-${index}`}
                disabled={answered}
                htmlType="button"
                key={`${currentQuestion.id}-${choice}-${index}`}
                onClick={() => handleChoiceClick(choice)}
                type={isSelected || isCorrectChoice ? 'primary' : 'default'}
              >
                {choice}
              </Button>
            )
          })}
        </div>

        <div className="quiz-screen__footer">
          <p
            aria-live="polite"
            className="quiz-screen__feedback"
            data-testid="quiz-feedback"
          >
            {feedbackMessage}
          </p>
          <Button
            data-testid="next-button"
            htmlType="button"
            onClick={handleNextClick}
            type="primary"
          >
            {questionIndex === TOTAL_QUESTIONS ? 'See Score' : 'Next'}
          </Button>
        </div>
      </Card>
    </main>
  )
}

export default QuizScreen
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd D:\math-island && npx vitest run src/screens/QuizScreen.test.tsx`
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
cd D:\math-island
git add src/screens/QuizScreen.tsx src/screens/QuizScreen.test.tsx
git commit -m "refactor: QuizScreen runs curriculum questions and reports coinsEarned on completion"
```

---

### Task 6: Rewrite HomeScreen with 16 treasures, lock states, and coin-flight animation

**Files:**
- Modify: `src/screens/HomeScreen.tsx`
- Modify: `src/screens/HomeScreen.css`
- Modify: `src/screens/HomeScreen.test.tsx`

**Interfaces:**
- Consumes: `CAMBRIDGE_PRIMARY_MATH_BOOK1`, `CAMBRIDGE_PRIMARY_MATH_BOOK1_ID`, `getNextUnitId`, `getUnitById` from `../curriculums/cambridgePrimaryMathBook1` (Task 2); `playClickSound`, `playCoinSound`, `playTreasureUnlockSound` from `../utils/sound` (Task 3); `ChildProfile` from `../types` (Task 1)
- Produces: `HomeScreen({ profile, onPlayTreasure, onOpenParents, pendingCoinAnimation, onCoinAnimationComplete }: HomeScreenProps)` where `onPlayTreasure: (unitId: string) => void` and `pendingCoinAnimation: { unitId: string; coinsEarned: number } | null` — used by `App.tsx` (Task 8).

- [ ] **Step 1: Write the failing test — replace `src/screens/HomeScreen.test.tsx`**

```tsx
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import {
  CAMBRIDGE_PRIMARY_MATH_BOOK1,
  CAMBRIDGE_PRIMARY_MATH_BOOK1_ID,
} from '../curriculums/cambridgePrimaryMathBook1'
import type { ChildProfile } from '../types'
import { HomeScreen } from './HomeScreen'

const buildProfile = (): ChildProfile => ({
  name: 'Explorer',
  bells: 8,
  levelProgress: {
    [CAMBRIDGE_PRIMARY_MATH_BOOK1_ID]: {
      treasures: Object.fromEntries(
        CAMBRIDGE_PRIMARY_MATH_BOOK1.units.map((unit) => [
          unit.id,
          unit.id === 'unit_1'
            ? { completed: true, coinsEarned: 8 }
            : { completed: false, coinsEarned: 0 },
        ]),
      ),
      currentAvailableTreasureId: 'unit_2',
    },
  },
})

describe('HomeScreen', () => {
  it('renders completed, available, and locked treasures with correct interactivity', () => {
    const onPlayTreasure = vi.fn()

    render(
      <HomeScreen
        onCoinAnimationComplete={vi.fn()}
        onPlayTreasure={onPlayTreasure}
        pendingCoinAnimation={null}
        profile={buildProfile()}
      />,
    )

    expect(screen.getByTestId('treasure-coins-unit_1').textContent).toContain('8')
    expect(screen.getByTestId('play-button-unit_1')).not.toBeNull()

    expect(screen.getByTestId('play-button-unit_2')).not.toBeNull()
    expect(screen.queryByTestId('treasure-coins-unit_2')).toBeNull()

    expect(screen.queryByTestId('play-button-unit_3')).toBeNull()

    fireEvent.click(screen.getByTestId('play-button-unit_2'))

    expect(onPlayTreasure).toHaveBeenCalledWith('unit_2')
    expect(onPlayTreasure).toHaveBeenCalledTimes(1)
  })

  it('flies a coin from the completed treasure to the header and calls onCoinAnimationComplete', () => {
    vi.useFakeTimers()
    const onCoinAnimationComplete = vi.fn()

    render(
      <HomeScreen
        onCoinAnimationComplete={onCoinAnimationComplete}
        onPlayTreasure={vi.fn()}
        pendingCoinAnimation={{ unitId: 'unit_1', coinsEarned: 8 }}
        profile={buildProfile()}
      />,
    )

    expect(screen.getByTestId('treasure-coin-flight')).not.toBeNull()

    vi.advanceTimersByTime(1200)

    expect(onCoinAnimationComplete).toHaveBeenCalledTimes(1)
    expect(screen.queryByTestId('treasure-coin-flight')).toBeNull()

    vi.useRealTimers()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd D:\math-island && npx vitest run src/screens/HomeScreen.test.tsx`
Expected: FAIL (old `HomeScreen` expects `profile.progress`/`skillId`, not `levelProgress`/treasures, and has no `pendingCoinAnimation` prop)

- [ ] **Step 3: Replace `src/screens/HomeScreen.tsx`**

```tsx
import { useEffect, useState } from 'react'
import { Button, Tag, Time, Title, Wallet } from 'animal-island-ui'
import islandMap from '../assets/adventure-island.png'
import { MusicToggleButton } from '../components/MusicToggleButton'
import {
  CAMBRIDGE_PRIMARY_MATH_BOOK1,
  CAMBRIDGE_PRIMARY_MATH_BOOK1_ID,
  getNextUnitId,
  getUnitById,
} from '../curriculums/cambridgePrimaryMathBook1'
import type { ChildProfile } from '../types'
import { playClickSound, playCoinSound, playTreasureUnlockSound } from '../utils/sound'
import './HomeScreen.css'

const COIN_END_LEFT = '50%'
const COIN_END_TOP = '10%'
const COIN_ANIMATION_DURATION_MS = 1200

interface PendingCoinAnimation {
  unitId: string
  coinsEarned: number
}

interface HomeScreenProps {
  profile: ChildProfile
  onPlayTreasure: (unitId: string) => void
  onOpenParents?: () => void
  pendingCoinAnimation: PendingCoinAnimation | null
  onCoinAnimationComplete: () => void
}

interface CoinFlightState {
  left: string
  top: string
}

export function HomeScreen({
  profile,
  onPlayTreasure,
  onOpenParents,
  pendingCoinAnimation,
  onCoinAnimationComplete,
}: HomeScreenProps) {
  const [coinFlight, setCoinFlight] = useState<CoinFlightState | null>(null)
  const levelProgress = profile.levelProgress[CAMBRIDGE_PRIMARY_MATH_BOOK1_ID]

  useEffect(() => {
    if (!pendingCoinAnimation) {
      return
    }

    const unit = getUnitById(CAMBRIDGE_PRIMARY_MATH_BOOK1, pendingCoinAnimation.unitId)

    if (!unit) {
      onCoinAnimationComplete()
      return
    }

    playCoinSound()
    setCoinFlight({ left: unit.mapLeft, top: unit.mapTop })

    const flightTimeout = setTimeout(() => {
      setCoinFlight({ left: COIN_END_LEFT, top: COIN_END_TOP })
    }, 20)

    const finishTimeout = setTimeout(() => {
      const nextUnitId = getNextUnitId(CAMBRIDGE_PRIMARY_MATH_BOOK1, pendingCoinAnimation.unitId)

      if (nextUnitId !== null) {
        playTreasureUnlockSound()
      }

      setCoinFlight(null)
      onCoinAnimationComplete()
    }, COIN_ANIMATION_DURATION_MS)

    return () => {
      clearTimeout(flightTimeout)
      clearTimeout(finishTimeout)
    }
  }, [pendingCoinAnimation, onCoinAnimationComplete])

  return (
    <main className="home-screen" data-testid="home-screen">
      <section className="home-screen__map" aria-label="Math Island map">
        <img
          alt="Illustrated treasure island map"
          className="home-screen__map-image"
          src={islandMap}
        />

        <header className="home-screen__header">
          <div className="home-screen__title">
            <Title size="large" color="app-yellow">
              Math Island
            </Title>
            <Time className="home-screen__time" />
          </div>

          <div className="home-screen__actions">
            <Wallet value={profile.bells} size="medium" />
            <div className="home-screen__action-buttons">
              <MusicToggleButton />
              {onOpenParents ? (
                <Button size="small" type="text" onClick={onOpenParents}>
                  Parents
                </Button>
              ) : null}
            </div>
          </div>
        </header>

        {CAMBRIDGE_PRIMARY_MATH_BOOK1.units.map((unit) => {
          const treasure = levelProgress.treasures[unit.id]
          const isAvailable = unit.id === levelProgress.currentAvailableTreasureId
          const isCompleted = treasure.completed
          const isLocked = !isAvailable && !isCompleted

          return (
            <div
              className="home-screen__treasure-hotspot"
              data-testid={`treasure-${unit.id}`}
              key={unit.id}
              style={{ left: unit.mapLeft, top: unit.mapTop }}
            >
              {isLocked ? (
                <div aria-hidden="true" className="home-screen__treasure-marker--locked">
                  <span className="home-screen__treasure-emoji">🔒</span>
                </div>
              ) : (
                <Button
                  className="home-screen__treasure-marker"
                  data-testid={`play-button-${unit.id}`}
                  htmlType="button"
                  onClick={() => {
                    playClickSound()
                    onPlayTreasure(unit.id)
                  }}
                  type="primary"
                >
                  <span className="home-screen__treasure-emoji" aria-hidden="true">
                    🗝️
                  </span>
                  <span className="home-screen__treasure-name">{unit.name}</span>
                  <div className="home-screen__tag-slot">
                    {isCompleted ? (
                      <span data-testid={`treasure-coins-${unit.id}`}>
                        <Tag color="app-green" size="small">
                          {`🪙 ${treasure.coinsEarned}`}
                        </Tag>
                      </span>
                    ) : null}
                  </div>
                </Button>
              )}
            </div>
          )
        })}

        {coinFlight ? (
          <span
            aria-hidden="true"
            className="home-screen__treasure-coin"
            data-testid="treasure-coin-flight"
            style={{ left: coinFlight.left, top: coinFlight.top }}
          >
            🪙
          </span>
        ) : null}
      </section>
    </main>
  )
}

export default HomeScreen
```

- [ ] **Step 4: Replace `src/screens/HomeScreen.css`**

```css
.home-screen {
  box-sizing: border-box;
  color: var(--animal-text-color);
  display: flex;
  flex-direction: column;
  max-height: 100svh;
  margin: 0 auto;
  max-width: 1048px;
  overflow-y: auto;
  padding: 28px 24px;
  text-align: left;
  width: 100%;
}

.home-screen__map {
  aspect-ratio: 1 / 1;
  border-radius: 22px;
  box-shadow: 0 18px 45px rgba(82, 52, 23, 0.2);
  margin: 0 auto;
  max-width: 960px;
  overflow: hidden;
  position: relative;
  width: 100%;
}

.home-screen__map-image {
  display: block;
  height: 100%;
  object-fit: cover;
  width: 100%;
}

.home-screen__header {
  align-items: flex-start;
  background: rgba(255, 239, 194, 0.9);
  border: 2px solid rgba(118, 76, 31, 0.18);
  border-radius: 18px;
  box-shadow: 0 10px 28px rgba(82, 52, 23, 0.18);
  display: flex;
  gap: 24px;
  justify-content: space-between;
  left: 50%;
  padding: 14px 18px;
  position: absolute;
  top: 18px;
  transform: translateX(-50%);
  width: min(calc(100% - 36px), 860px);
  z-index: 3;
}

.home-screen__title {
  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.home-screen__time {
  color: var(--animal-text-color-secondary);
  opacity: 0.82;
}

.home-screen__actions {
  align-items: flex-end;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.home-screen__action-buttons {
  align-items: center;
  display: flex;
  gap: 8px;
}

.home-screen__treasure-hotspot {
  position: absolute;
  transform: translate(-50%, -50%);
  transition: transform 180ms ease, filter 180ms ease;
  z-index: 2;
}

.home-screen__treasure-hotspot:hover,
.home-screen__treasure-hotspot:focus-within {
  filter: drop-shadow(0 12px 18px rgba(65, 40, 18, 0.28));
  transform: translate(-50%, -50%) scale(1.08);
}

.home-screen__treasure-marker {
  align-items: center;
  background: rgba(255, 247, 218, 0.94);
  border: 3px solid rgba(120, 76, 31, 0.55);
  border-radius: 999px;
  color: var(--animal-text-color);
  display: inline-flex;
  flex-direction: column;
  gap: 3px;
  min-height: 76px;
  min-width: 112px;
  padding: 8px 14px;
  text-align: center;
  white-space: nowrap;
}

.home-screen__treasure-marker--locked {
  align-items: center;
  background: rgba(90, 90, 90, 0.55);
  border: 3px solid rgba(60, 60, 60, 0.5);
  border-radius: 999px;
  color: rgba(255, 255, 255, 0.8);
  cursor: default;
  display: inline-flex;
  filter: grayscale(1);
  justify-content: center;
  min-height: 56px;
  min-width: 56px;
  opacity: 0.6;
  padding: 8px;
}

.home-screen__treasure-emoji {
  font-size: 26px;
  line-height: 1;
}

.home-screen__treasure-name {
  color: var(--animal-text-color);
  font-size: 14px;
  font-weight: 800;
  line-height: 1.05;
}

.home-screen__tag-slot {
  min-height: 22px;
}

.home-screen__treasure-coin {
  font-size: 30px;
  line-height: 1;
  pointer-events: none;
  position: absolute;
  transform: translate(-50%, -50%);
  transition: left 1.1s ease-in, top 1.1s ease-in;
  z-index: 5;
}

@media (max-width: 768px) {
  .home-screen {
    padding: 18px 16px;
  }

  .home-screen__header {
    align-items: flex-start;
    flex-direction: row;
    gap: 12px;
    padding: 12px 14px;
    top: 12px;
    width: calc(100% - 28px);
  }

  .home-screen__actions {
    align-items: center;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
  }

  .home-screen__treasure-marker {
    min-height: 72px;
    min-width: 100px;
    padding: 7px 11px;
  }

  .home-screen__treasure-emoji {
    font-size: 24px;
  }

  .home-screen__treasure-name {
    font-size: 13px;
  }
}

@media (max-width: 720px) {
  .home-screen {
    padding: 16px 12px;
  }

  .home-screen__header {
    align-items: flex-start;
    flex-direction: column;
    gap: 10px;
    padding: 10px 12px;
    top: 10px;
    width: calc(100% - 20px);
  }

  .home-screen__actions {
    align-items: flex-start;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .home-screen__treasure-marker {
    min-height: 68px;
    min-width: 88px;
    padding: 7px 10px;
  }

  .home-screen__treasure-emoji {
    font-size: 22px;
  }

  .home-screen__treasure-name {
    font-size: 12px;
  }
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `cd D:\math-island && npx vitest run src/screens/HomeScreen.test.tsx`
Expected: PASS (2 tests)

- [ ] **Step 6: Commit**

```bash
cd D:\math-island
git add src/screens/HomeScreen.tsx src/screens/HomeScreen.css src/screens/HomeScreen.test.tsx
git commit -m "refactor: HomeScreen renders 16 treasures with lock states and coin-flight animation"
```

---

### Task 7: Rewrite ParentScreen for 16-unit treasure progress table

**Files:**
- Modify: `src/screens/ParentScreen.tsx`
- Modify: `src/screens/ParentScreen.test.tsx`

**Interfaces:**
- Consumes: `CAMBRIDGE_PRIMARY_MATH_BOOK1`, `CAMBRIDGE_PRIMARY_MATH_BOOK1_ID` from `../curriculums/cambridgePrimaryMathBook1` (Task 2); `ChildProfile` from `../types` (Task 1)
- Produces: `ParentScreen({ profile, onClose }: ParentScreenProps)` — used by `App.tsx` (Task 8), unchanged prop shape from before.

- [ ] **Step 1: Write the failing test — replace `src/screens/ParentScreen.test.tsx`**

```tsx
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import {
  CAMBRIDGE_PRIMARY_MATH_BOOK1,
  CAMBRIDGE_PRIMARY_MATH_BOOK1_ID,
} from '../curriculums/cambridgePrimaryMathBook1'
import type { ChildProfile } from '../types'
import { ParentScreen } from './ParentScreen'

const buildProfile = (): ChildProfile => ({
  name: 'Explorer',
  bells: 8,
  levelProgress: {
    [CAMBRIDGE_PRIMARY_MATH_BOOK1_ID]: {
      treasures: Object.fromEntries(
        CAMBRIDGE_PRIMARY_MATH_BOOK1.units.map((unit) => [
          unit.id,
          unit.id === 'unit_1'
            ? { completed: true, coinsEarned: 8 }
            : { completed: false, coinsEarned: 0 },
        ]),
      ),
      currentAvailableTreasureId: 'unit_2',
    },
  },
})

describe('ParentScreen', () => {
  it('shows treasure progress rows and closes back to the island', () => {
    const onClose = vi.fn()

    render(<ParentScreen profile={buildProfile()} onClose={onClose} />)

    fireEvent.click(screen.getByTestId('view-details-toggle'))

    expect(screen.getByTestId('parent-table-row-unit_1').textContent).toContain('Numbers to 10')
    expect(screen.getByTestId('parent-table-row-unit_1').textContent).toContain('8')
    expect(screen.getByTestId('parent-table-row-unit_1').textContent).toContain('Yes')

    expect(screen.getByTestId('parent-table-row-unit_2').textContent).toContain(
      'Working with numbers to 10',
    )
    expect(screen.getByTestId('parent-table-row-unit_2').textContent).toContain('No')

    fireEvent.click(screen.getByTestId('back-to-island-from-parent-button'))

    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd D:\math-island && npx vitest run src/screens/ParentScreen.test.tsx`
Expected: FAIL (old `ParentScreen` reads `profile.progress[skillId]`, which no longer exists)

- [ ] **Step 3: Replace `src/screens/ParentScreen.tsx`**

```tsx
import { Button, Collapse, Table } from 'animal-island-ui'
import type { TableColumn } from 'animal-island-ui'
import type { HTMLAttributes } from 'react'
import {
  CAMBRIDGE_PRIMARY_MATH_BOOK1,
  CAMBRIDGE_PRIMARY_MATH_BOOK1_ID,
} from '../curriculums/cambridgePrimaryMathBook1'
import type { ChildProfile } from '../types'
import './ParentScreen.css'

interface ParentScreenProps {
  profile: ChildProfile
  onClose: () => void
}

interface TreasureRow extends Record<string, unknown> {
  unitId: string
  unitName: string
  coinsEarned: number
  completed: string
}

const columns: TableColumn[] = [
  { title: 'Unit name', dataIndex: 'unitName' },
  { title: 'Coins earned', dataIndex: 'coinsEarned', align: 'right' },
  { title: 'Completed', dataIndex: 'completed' },
]

const buildRows = (profile: ChildProfile): TreasureRow[] => {
  const levelProgress = profile.levelProgress[CAMBRIDGE_PRIMARY_MATH_BOOK1_ID]

  return CAMBRIDGE_PRIMARY_MATH_BOOK1.units.map((unit) => {
    const treasure = levelProgress.treasures[unit.id]

    return {
      unitId: unit.id,
      unitName: unit.name,
      coinsEarned: treasure.coinsEarned,
      completed: treasure.completed ? 'Yes' : 'No',
    }
  })
}

const getRowProps = (
  record: Record<string, unknown>,
): HTMLAttributes<HTMLTableRowElement> => {
  const rowProps: HTMLAttributes<HTMLTableRowElement> & { 'data-testid': string } = {
    'data-testid': `parent-table-row-${String(record.unitId)}`,
  }

  return rowProps
}

export function ParentScreen({ profile, onClose }: ParentScreenProps) {
  const rows = buildRows(profile)

  return (
    <main className="parent-screen" data-testid="parent-screen">
      <header className="parent-screen__header">
        <div>
          <p className="parent-screen__eyebrow">Parent dashboard</p>
          <h1>{profile.name}'s Progress</h1>
        </div>

        <Button
          data-testid="back-to-island-from-parent-button"
          htmlType="button"
          onClick={onClose}
          type="primary"
        >
          Back to Island
        </Button>
      </header>

      <Collapse
        answer={
          <Table
            className="parent-screen__table"
            columns={columns}
            dataSource={rows}
            onRow={getRowProps}
            rowKey="unitId"
          />
        }
        question={<span data-testid="view-details-toggle">View details</span>}
      />
    </main>
  )
}

export default ParentScreen
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd D:\math-island && npx vitest run src/screens/ParentScreen.test.tsx`
Expected: PASS (1 test)

- [ ] **Step 5: Commit**

```bash
cd D:\math-island
git add src/screens/ParentScreen.tsx src/screens/ParentScreen.test.tsx
git commit -m "refactor: ParentScreen shows 16-unit treasure progress table"
```

---

### Task 8: Wire App.tsx end to end and verify the full build

**Files:**
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `CAMBRIDGE_PRIMARY_MATH_BOOK1`, `CAMBRIDGE_PRIMARY_MATH_BOOK1_ID`, `getNextUnitId` (Task 2); `completeTreasure`, `loadProfile`, `saveProfile` (Task 4); `HomeScreen` (Task 6), `QuizScreen` (Task 5), `ParentScreen` (Task 7); `isMusicEnabled`, `startBackgroundMusic` (existing)
- Produces: The wired `App` default export — no other file consumes this.

- [ ] **Step 1: Replace `src/App.tsx`**

```tsx
import { useEffect, useState } from 'react';

import {
  CAMBRIDGE_PRIMARY_MATH_BOOK1,
  CAMBRIDGE_PRIMARY_MATH_BOOK1_ID,
  getNextUnitId,
} from './curriculums/cambridgePrimaryMathBook1';
import { HomeScreen } from './screens/HomeScreen';
import { ParentScreen } from './screens/ParentScreen';
import { QuizScreen } from './screens/QuizScreen';
import { completeTreasure, loadProfile, saveProfile } from './store/profileStore';
import { isMusicEnabled, startBackgroundMusic } from './utils/sound';

interface PendingCoinAnimation {
  unitId: string;
  coinsEarned: number;
}

export default function App() {
  const [profile, setProfile] = useState(() => loadProfile());
  const [activeUnitId, setActiveUnitId] = useState<string | null>(null);
  const [showParents, setShowParents] = useState(false);
  const [pendingCoinAnimation, setPendingCoinAnimation] = useState<PendingCoinAnimation | null>(
    null,
  );

  useEffect(() => {
    const startMusicOnFirstGesture = () => {
      if (isMusicEnabled()) {
        startBackgroundMusic();
      }
      window.removeEventListener('pointerdown', startMusicOnFirstGesture);
      window.removeEventListener('keydown', startMusicOnFirstGesture);
    };

    window.addEventListener('pointerdown', startMusicOnFirstGesture);
    window.addEventListener('keydown', startMusicOnFirstGesture);

    return () => {
      window.removeEventListener('pointerdown', startMusicOnFirstGesture);
      window.removeEventListener('keydown', startMusicOnFirstGesture);
    };
  }, []);

  const handleQuizComplete = (unitId: string, coinsEarned: number) => {
    const nextUnitId = getNextUnitId(CAMBRIDGE_PRIMARY_MATH_BOOK1, unitId);
    const { profile: updatedProfile, coinsAwarded } = completeTreasure(
      profile,
      CAMBRIDGE_PRIMARY_MATH_BOOK1_ID,
      unitId,
      coinsEarned,
      nextUnitId,
    );

    saveProfile(updatedProfile);
    setProfile(updatedProfile);
    setActiveUnitId(null);

    if (coinsAwarded > 0) {
      setPendingCoinAnimation({ unitId, coinsEarned: coinsAwarded });
    }
  };

  if (showParents) {
    return <ParentScreen profile={profile} onClose={() => setShowParents(false)} />;
  }

  if (activeUnitId !== null) {
    return (
      <QuizScreen
        unitId={activeUnitId}
        onComplete={handleQuizComplete}
        onExit={() => setActiveUnitId(null)}
      />
    );
  }

  return (
    <HomeScreen
      onCoinAnimationComplete={() => setPendingCoinAnimation(null)}
      onOpenParents={() => setShowParents(true)}
      onPlayTreasure={setActiveUnitId}
      pendingCoinAnimation={pendingCoinAnimation}
      profile={profile}
    />
  );
}
```

- [ ] **Step 2: Run the full test suite**

Run: `cd D:\math-island && npx vitest run`
Expected: PASS — all test files green (curriculum, profileStore, QuizScreen, HomeScreen, ParentScreen)

- [ ] **Step 3: Type-check and build**

Run: `cd D:\math-island && npx tsc --noEmit && npm run build`
Expected: Both succeed with no errors

- [ ] **Step 4: Manual end-to-end verification in the browser**

Run: `cd D:\math-island && npm run dev`

Open the printed local URL and verify:
1. The island map shows 16 treasure hotspots; only `unit_1` ("Numbers to 10") is interactive, the rest show a locked 🔒 marker.
2. Tap `unit_1`, answer all 10 questions (try clicking Next once without answering to confirm it skips and reduces the final score below 10/10), then click "Back to Island".
3. A coin flies from `unit_1`'s map position up to the header, a coin sound plays, `unit_2` unlocks (its locked marker becomes an interactive treasure), and the wallet bell count increases by the coins earned.
4. Replay `unit_1` (now shows a coin badge and is still clickable) — verify the wallet bell count does **not** increase again after finishing it a second time.
5. Open "Parents" and verify the table lists all 16 units with coins-earned and completed status matching what you just did.
6. Resize to a narrow mobile width and confirm the map still scrolls/fits per the existing responsive behavior.

- [ ] **Step 5: Commit**

```bash
cd D:\math-island
git add src/App.tsx
git commit -m "feat: wire App.tsx for the 16-treasure Cambridge Book 1 level"
```

---

## Self-Review Notes

- **Spec coverage:** Curriculum config (Task 2), profile/progress model (Task 4), sequential unlock + replay-safe coins (Task 4 + 8), coin sound + unlock sound (Task 3), coin-flight animation (Task 6), treasure lock/unlock UI (Task 6), parent dashboard (Task 7), extensibility via `getUnitById`/`getNextUnitId` pure functions decoupled from any specific curriculum (Task 2) are all covered.
- **Placeholder scan:** No TBD/TODO — all 160 questions, all component code, and all tests are complete and concrete.
- **Type consistency:** `unitId`/`onComplete`/`coinsEarned`/`pendingCoinAnimation` names and shapes are identical across Tasks 4, 5, 6, and 8.
- **Flagged deviations from the design doc** (see Global Constraints): Next button is always visible (design implied it might gate on correctness); old skill system is deleted rather than kept for "backward compatibility" (no real data to migrate); treasure map coordinates are estimated from the image, not pixel-verified.

---

**Plan complete and saved to `docs/superpowers/plans/2025-07-09-treasure-hunt-level-system.md`.** Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
