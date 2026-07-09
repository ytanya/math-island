# Treasure Hunt Level System Design

**Date:** 2025-07-09  
**Project:** Math Island  
**Scope:** Level 1 redesign + configurable framework for future curricula  
**Author:** Design collaboration

---

## Executive Summary

Transform Math Island Level 1 from a 4-skill flat layout into a 16-treasure island where children progress sequentially through Cambridge Primary Mathematics units. Each completed unit earns coins (0-10, equal to correct answers), which animate into a money bag with sound feedback. The system is designed to be fully configurable via JSON, enabling rapid deployment of new curricula (Scientist Cambridge, etc.) without code changes.

---

## 1. Problem Statement & Goals

**Current State:**
- Level 1: 4 hardcoded skills (counting, comparing, add/sub, place value)
- Flat card-based UI lacks progression feel
- Limited engagement hooks for young learners

**Goals:**
1. ✅ Increase engagement through treasure-hunt progression mechanics
2. ✅ Support 16 Cambridge Primary Math Book 1 units (vs. 4 skills)
3. ✅ Design for reusability across multiple curricula
4. ✅ Add multi-sensory feedback (coin animation + sound)
5. ✅ Maintain localStorage-based progress tracking

---

## 2. Architecture

### 2.1 Data Model

#### Curriculum Config Schema
Location: `src/curriculums/cambridge-primary-math-book1.json`

```json
{
  "id": "cambridge-primary-math-book1",
  "name": "Cambridge Primary Mathematics Book 1",
  "level": 1,
  "unitCount": 16,
  "units": [
    {
      "id": "unit_1",
      "name": "Numbers to 10",
      "questionsPerUnit": 10,
      "questions": [
        {
          "id": "q_1_1",
          "prompt": "Count the apples",
          "choices": [2, 3, 4, 5],
          "answer": 3,
          "visualCount": 3
        },
        ...10 questions per unit...
      ]
    },
    {
      "id": "unit_2",
      "name": "Working with numbers to 10",
      "questionsPerUnit": 10,
      "questions": [...]
    },
    ...16 total units...
  ]
}
```

#### Profile Structure (Extended)
File: `src/store/profileStore.ts`

```typescript
interface TreasureProgress {
  completed: boolean
  coinsEarned: number // 0-10, equals correct answers
}

interface LevelProgress {
  curriculum: string // e.g., "cambridge-primary-math-book1"
  treasures: Record<string, TreasureProgress> // keyed by unit_id
  currentAvailableTreasure: string // unit_id of next unlocked treasure
  totalBells: number // sum of all coinsEarned across completed treasures
}

interface ChildProfile {
  name: string
  bells: number // global currency
  badges: string[]
  progress: Record<string, SkillProgress> // existing, for backward compatibility
  levelProgress: {
    [curriculumId: string]: LevelProgress // new, for treasure hunt levels
  }
}
```

**Migration Note:** The system supports both old `progress` (4 skills) and new `levelProgress` (N units). Level 1 transitions entirely to `levelProgress["cambridge-primary-math-book1"]`.

### 2.2 Progression Rules

1. **Sequential Unlock:** Treasures unlock in fixed order (unit_1 → unit_2 → ... → unit_16)
2. **Completion Requirement:** Child must answer all 10 questions in a unit (correctness is not required to unlock next treasure, but correct count determines coins earned)
3. **Coin Earn Formula:** `coinsEarned = number of correct answers (0-10)`
4. **Bell Increment:** `profile.bells += coinsEarned` when treasure is completed
5. **Replay:** Completed treasures remain open/bright and can be replayed anytime
6. **State Persistence:** All progress saved to localStorage

---

## 3. UI Layer

### 3.1 Home Screen (Island Map)

**Visual Asset:** `src/assets/adventure-island.png` (existing, same path)
- 16 treasures positioned on illustrated island
- Same responsive square container as current Level 1

**Treasure States:**
| State | Visual | Interaction |
|-------|--------|-------------|
| Locked | Grayed out, closed chest appearance | Non-interactive |
| Available | Bright, highlighted, open chest | Tappable → starts quiz |
| Completed | Bright (same as available) | Tappable → replays quiz |

**Header:** Unchanged wallet component showing accumulated bells

### 3.2 Quiz Screen

**Flow:**
1. Child taps treasure → Quiz Screen loads with 10 questions from curriculum config
2. Child answers all 10 questions (visual feedback for correct/wrong preserved from Level 1)
3. Child completes (sees "See Score" button after 10th answer)
4. Score shows: X / 10 correct
5. "Back to Island" button returns to map

**Question Rendering:** 
- Questions loaded dynamically from `curriculumConfig.units[treasureIndex].questions`
- Same question types as current Level 1 (counting, multiple choice, visual matching)
- Visual elements (apples, objects) populated from `visualCount` field in config

### 3.3 Completion & Treasure Unlock

**Trigger:** "Back to Island" button clicked after quiz completion

**Sequence:**
1. Calculate `coinsEarned = correct answers count`
2. Play coin collection sound
3. Animate coin from treasure chest → money bag in header (1-2 sec arc animation)
4. Update `profile.bells += coinsEarned`
5. Update treasure state: `treasures[unitId] = { completed: true, coinsEarned }`
6. If not final treasure: unlock next treasure with visual transition (grayed → bright)
7. Play optional treasure-unlock sound
8. Return to island map with updated state

---

## 4. Sound & Animation Layer

### 4.1 New Sounds

**Coin Collection Sound**
- Trigger: When coin animation starts (quiz completion)
- Characteristic: Bright, happy "ding" or coin-drop sound
- Volume: Balanced with existing sounds (not louder than celebration sound)
- Duration: ~0.5 sec

**Optional: Treasure Unlock Sound**
- Trigger: When next treasure transitions from locked → available
- Characteristic: Fanfare or sparkle sound (playful)
- Reuse existing `playAchievementSound()` or create new variant

### 4.2 New Animations

**Treasure State Transition**
- When `currentAvailableTreasure` changes
- Animation: Locked treasure (grayed) fades/transitions to bright
- Duration: 0.5-1 sec
- Timing: Plays after coin animation completes

**Chest Open/Close**
- When treasure is tapped: brief visual reaction (chest lid bounces or opens)
- When treasure completes: chest visually closes or settles
- Duration: 0.3 sec
- Subtle, non-blocking

**Coin Flight Animation**
- Trigger: After quiz completion, before returning to map
- Path: Arc from treasure chest position → money bag in header
- Duration: 1-2 sec (smooth easing)
- Effect: Coin sprite/particle follows arc path, disappears into bag
- Timing: Coin collection sound plays during flight

**Money Bag Sparkle (Optional)**
- Trigger: When coin lands in bag
- Effect: Brief 3-5 frame sparkle/glow around money bag
- Duration: 0.3 sec
- Polish: Enhances the reward feeling

---

## 5. Extensibility & Future Curricula

### Adding a New Curriculum

**Step 1:** Create a curriculum data file matching the existing `Curriculum` /
`CurriculumUnit` / `TreasureQuestion` types (e.g.
`src/curriculums/scientistCambridge.ts`)

**Step 2:** Reuse the same shape as Cambridge Math Book 1 — QuizScreen,
HomeScreen, ParentScreen, App.tsx, and profileStore are all curriculum-agnostic
over that shape and require no changes to read a differently-sized curriculum
(unit count and questions-per-unit are both derived from the data, not
hardcoded)

**Step 3:** Wire in a curriculum selector — as built, App.tsx/HomeScreen/etc.
statically import and reference `CAMBRIDGE_PRIMARY_MATH_BOOK1`, so a second
curriculum still needs a Level Select screen (see below) that picks which
curriculum's data to load. The *types and logic* are code-change-free; the
*which curriculum is active* wiring is not, until that selector exists.
- Quiz screen reads all curriculum content from data
- UI/animation/sound logic is curriculum-agnostic
- User selects curriculum on a Level Select screen (future feature — this is
  the piece that makes "add a curriculum with zero code changes" fully true)

### Supported Variations
- Different unit counts (16, 20, 25, etc.)
- Different question counts per unit (not fixed to 10)
- Different unit names and question types
- Different visual assets per curriculum (optional; reuse adventure-island.png by default)

---

## 6. Data Flow

```
Home Screen (Island Map)
    ↓ (tap treasure)
Quiz Screen (all questions from the unit's data)
    ↓ (answer all questions)
Summary Screen (show score)
    ↓ (click Back to Island)
Coin Animation (chest → bag) + Sound
    ↓
Treasure State Update + Unlock Next
    ↓
Return to Home Screen (updated state, next treasure bright)
```

---

## 7. Progress Persistence

**localStorage Key:** `math-island-profile` (existing)

**Update on Completion:**
```typescript
const updatedProfile = {
  ...profile,
  bells: profile.bells + coinsEarned,
  levelProgress: {
    ...profile.levelProgress,
    "cambridge-primary-math-book1": {
      treasures: {
        ...treasures,
        [unitId]: { completed: true, coinsEarned }
      },
      currentAvailableTreasure: nextUnitId,
      totalBells: newTotal
    }
  }
}
localStorage.setItem('math-island-profile', JSON.stringify(updatedProfile))
```

---

## 8. Error Handling

| Scenario | Handling |
|----------|----------|
| Curriculum config missing | Fallback: show error message, redirect to home |
| LocalStorage write fails | Notify user, prompt retry |
| Animation completes before coin sound finishes | Animations are non-blocking; user can still interact |
| Child exits quiz mid-way (incomplete) | Progress not saved; treasure remains locked |

---

## 9. Success Criteria

- ✅ 16 treasures visible and progressively unlock on Cambridge Book 1
- ✅ Coin animation plays smoothly without janky frame drops
- ✅ Coin sound and unlock sound play in correct sequence
- ✅ Progress persists across app refreshes
- ✅ Replayable completed treasures
- ✅ Curriculum data types (units, questions, unit/question counts) are fully
  reusable for a new curriculum with no code changes — a curriculum selector
  (Section 5, Step 3) is still needed to make a second curriculum active
- ✅ Mobile-responsive (tested on 375px, 768px, 1024px screens)

---

## 10. Testing Strategy

### Unit Tests
- Progression logic: unlock next treasure only when previous is completed
- Coin calculation: earned coins = correct answers
- Profile serialization: state survives localStorage round-trip

### Integration Tests
- Quiz → completion → animation → map state update (full flow)
- Replay completed treasure: progress not re-saved
- Multiple play sessions: profile merges without data loss

### E2E Tests (Manual)
- Complete one treasure, verify next unlocks
- Replay a treasure, verify bells don't double-increment
- Audio/animation timing: coin reaches bag when sound ends
- Responsive: treasure positions correct on mobile/tablet

---

## 11. Rollout Plan

**Phase 1 (This version):**
- Cambridge Primary Math Book 1 (16 units)
- Fixed map, progressive unlock, coin system
- Test with internal users, gather feedback

**Phase 2 (Post-feedback):**
- Refactor config layer into reusable skill/template
- Document for easy curriculum onboarding
- Add Level Select screen (users choose curriculum)

**Phase 3 (Future):**
- Add second curriculum (Scientist Cambridge, etc.)
- Validate config-driven approach scales

---

## Appendix A: File Structure

```
src/
├── curriculums/
│   └── cambridge-primary-math-book1.json       (NEW)
├── screens/
│   ├── HomeScreen.tsx                           (MODIFY: show 16 treasures, unlock logic)
│   └── QuizScreen.tsx                           (MODIFY: load questions from config)
├── store/
│   └── profileStore.ts                          (MODIFY: extend with levelProgress)
├── utils/
│   └── sound.ts                                 (MODIFY: add coin collection sound)
├── assets/
│   └── adventure-island.png                     (EXISTING: 16 treasures positioned)
└── ...
```

---

## Appendix B: Curriculum Config Template

For future use when adding Scientist Cambridge or other sources:

```json
{
  "id": "curriculum-id",
  "name": "Curriculum Display Name",
  "level": 1,
  "unitCount": 16,
  "units": [
    {
      "id": "unit_N",
      "name": "Unit Display Name",
      "questionsPerUnit": 10,
      "questions": [
        {
          "id": "q_N_1",
          "prompt": "Question text",
          "choices": [option1, option2, option3, option4],
          "answer": correctIndex,
          "visualCount": numberForVisual // optional, for counting questions
        }
      ]
    }
  ]
}
```

---

**END OF DESIGN DOCUMENT**
