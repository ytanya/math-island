import { Button, Collapse, Table } from 'animal-island-ui'
import type { TableColumn } from 'animal-island-ui'
import type { HTMLAttributes } from 'react'
import type { ChildProfile, SkillId } from '../types'
import './ParentScreen.css'

interface ParentScreenProps {
  profile: ChildProfile
  onClose: () => void
}

interface SkillRow extends Record<string, unknown> {
  skillId: SkillId
  skillName: string
  attempts: number
  correct: number
  accuracy: string
  mastered: string
}

const skillNames: Record<SkillId, string> = {
  counting: 'Counting',
  comparing: 'Comparing',
  addSub: 'Add & Subtract',
  placeValue: 'Tens & Ones',
}

const skillOrder: SkillId[] = ['counting', 'comparing', 'addSub', 'placeValue']

const columns: TableColumn[] = [
  {
    title: 'Skill name',
    dataIndex: 'skillName',
  },
  {
    title: 'Attempts',
    dataIndex: 'attempts',
    align: 'right',
  },
  {
    title: 'Correct',
    dataIndex: 'correct',
    align: 'right',
  },
  {
    title: 'Accuracy %',
    dataIndex: 'accuracy',
    align: 'right',
  },
  {
    title: 'Mastered',
    dataIndex: 'mastered',
  },
]

const buildRows = (profile: ChildProfile): SkillRow[] =>
  skillOrder.map((skillId) => {
    const progress = profile.progress[skillId]
    const accuracy =
      progress.attempts === 0
        ? 0
        : Math.round((progress.correct / progress.attempts) * 100)

    return {
      skillId,
      skillName: skillNames[skillId],
      attempts: progress.attempts,
      correct: progress.correct,
      accuracy: `${accuracy}%`,
      mastered: progress.mastered ? 'Yes' : 'No',
    }
  })

const getRowProps = (
  record: Record<string, unknown>,
): HTMLAttributes<HTMLTableRowElement> => {
  const rowProps: HTMLAttributes<HTMLTableRowElement> & {
    'data-testid': string
  } = {
    'data-testid': `parent-table-row-${String(record.skillId)}`,
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
            rowKey="skillId"
          />
        }
        question={<span data-testid="view-details-toggle">View details</span>}
      />
    </main>
  )
}

export default ParentScreen
