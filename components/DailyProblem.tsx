'use client'

import { useState, useCallback } from 'react'
import type { DailyContent, GradeLevel } from '@/lib/types'
import { hasCompletedToday } from '@/lib/storage'
import GradeSelector from './GradeSelector'
import Passage from './Passage'
import QuizSection from './QuizSection'
import HistoryCalendar from './HistoryCalendar'
import ResultBanner from './ResultBanner'

interface DailyProblemProps {
  content: DailyContent
}

const GRADE_LABELS: Record<GradeLevel, string> = {
  grade1: '小１',
  grade7: '中１',
}

interface BottomResult {
  score: number
  total: number
  gradeLabel: string
}

export default function DailyProblem({ content }: DailyProblemProps) {
  const [activeGrade, setActiveGrade] = useState<GradeLevel>('grade1')
  // 採点後にタブの完了マークを再描画するためのカウンタ
  const [completionTick, setCompletionTick] = useState(0)
  // ページ最下部に表示する採点結果
  const [bottomResult, setBottomResult] = useState<BottomResult | null>(null)

  const handleScored = useCallback((score: number, total: number) => {
    setCompletionTick(t => t + 1)
    // activeGrade は handleScored 生成時点の値を参照するため、
    // useCallback の依存配列に activeGrade を含める
    setBottomResult({ score, total, gradeLabel: GRADE_LABELS[activeGrade] })
  }, [activeGrade])

  // 学年切替時は結果をリセット（新しい学年の QuizSection が再マウントされ、
  // 保存済みなら onScored が再度呼ばれて更新される）
  const handleGradeChange = useCallback((grade: GradeLevel) => {
    setActiveGrade(grade)
    setBottomResult(null)
  }, [])

  // completionTick が変わるたびに再評価される
  const grade1Completed = hasCompletedToday(content.date, 'grade1')
  const grade7Completed = hasCompletedToday(content.date, 'grade7')

  const gradeContent = content.levels[activeGrade]

  return (
    <div className="max-w-3xl mx-auto px-4 pb-12">
      {/* テーマ表示 */}
      <div className="py-4 border-b border-[#d4c9b5] mb-4">
        <h2
          className="text-base text-[#1a1510] font-medium"
          style={{ fontFamily: '"Noto Serif JP", serif' }}
        >
          今日のテーマ：
          <span className="font-bold text-[#8b5e3c]">「{content.daily_theme}」</span>
        </h2>
        <p className="text-xs text-[#8b5e3c] mt-0.5">
          本文を読んで、すべての設問に答えましょう
        </p>
      </div>

      {/* 学年切替タブ */}
      <div className="mb-6">
        <GradeSelector
          currentGrade={activeGrade}
          onSelect={handleGradeChange}
          grade1Completed={grade1Completed}
          grade7Completed={grade7Completed}
        />
      </div>

      {/* 本文 */}
      <Passage
        title={gradeContent.title}
        passage={gradeContent.passage}
        gradeLabel={GRADE_LABELS[activeGrade]}
        grade={activeGrade}
      />

      {/* 問題セクション */}
      <QuizSection
        key={`${content.date}-${activeGrade}`}
        content={gradeContent}
        grade={activeGrade}
        date={content.date}
        gradeLabel={GRADE_LABELS[activeGrade]}
        onScored={handleScored}
      />

      {/* 取り組み記録カレンダー */}
      <div className="mt-10">
        <HistoryCalendar key={completionTick} />
      </div>

      {/* ── 採点結果（ページ最下部） ── */}
      {bottomResult && (
        <div className="mt-6">
          <ResultBanner
            score={bottomResult.score}
            total={bottomResult.total}
            gradeLabel={bottomResult.gradeLabel}
          />
        </div>
      )}
    </div>
  )
}
