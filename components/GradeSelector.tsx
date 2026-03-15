'use client'

import type { GradeLevel } from '@/lib/types'

interface GradeSelectorProps {
  currentGrade: GradeLevel
  onSelect: (grade: GradeLevel) => void
  grade1Completed: boolean
  grade7Completed: boolean
}

const GRADE_LABELS: Record<GradeLevel, string> = {
  grade1: '小１',
  grade7: '中１',
}

export default function GradeSelector({
  currentGrade,
  onSelect,
  grade1Completed,
  grade7Completed,
}: GradeSelectorProps) {
  return (
    <div className="flex gap-1 border-b border-[#d4c9b5]" role="tablist" aria-label="学年選択">
      {(['grade1', 'grade7'] as GradeLevel[]).map((grade) => {
        const isActive = currentGrade === grade
        const isCompleted = grade === 'grade1' ? grade1Completed : grade7Completed
        const colorClass = grade === 'grade1' ? 'grade1' : 'grade7'
        const activeColors =
          grade === 'grade1'
            ? 'bg-[#4a7c6f] text-white border-[#4a7c6f]'
            : 'bg-[#5c6bc0] text-white border-[#5c6bc0]'
        const inactiveColors =
          grade === 'grade1'
            ? 'bg-white text-[#4a7c6f] border-transparent hover:bg-[#e8f4f1]'
            : 'bg-white text-[#5c6bc0] border-transparent hover:bg-[#eef0fb]'

        return (
          <button
            key={grade}
            role="tab"
            aria-selected={isActive}
            aria-label={`${GRADE_LABELS[grade]}の問題${isCompleted ? '（回答済み）' : ''}`}
            onClick={() => onSelect(grade)}
            className={`grade-tab border-b-2 ${isActive ? activeColors : inactiveColors} relative`}
          >
            <span className="text-base font-bold">{GRADE_LABELS[grade]}</span>
            {isCompleted && (
              <span
                className="ml-1 text-xs"
                title="回答済み"
                aria-label="回答済み"
              >
                ✓
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
