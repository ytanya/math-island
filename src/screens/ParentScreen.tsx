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
  onResetProgress: () => void
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

export function ParentScreen({ profile, onClose, onResetProgress }: ParentScreenProps) {
  const rows = buildRows(profile)

  const handleResetClick = () => {
    const confirmed = window.confirm(
      `This will erase all of ${profile.name}'s progress and bells. This can't be undone. Continue?`,
    )

    if (confirmed) {
      onResetProgress()
    }
  }

  return (
    <main className="parent-screen" data-testid="parent-screen">
      <header className="parent-screen__header">
        <div>
          <p className="parent-screen__eyebrow">Parent dashboard</p>
          <h1>{profile.name}'s Progress</h1>
        </div>

        <div className="parent-screen__header-actions">
          <Button
            data-testid="reset-progress-button"
            htmlType="button"
            onClick={handleResetClick}
            type="text"
          >
            Reset Progress
          </Button>

          <Button
            data-testid="back-to-island-from-parent-button"
            htmlType="button"
            onClick={onClose}
            type="primary"
          >
            Back to Island
          </Button>
        </div>
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
