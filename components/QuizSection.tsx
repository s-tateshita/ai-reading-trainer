'use client'

import { useState, useCallback, useEffect } from 'react'
import type { GradeContent, GradeLevel, AnswerState, QuizState } from '@/lib/types'
import { getSession, saveSession } from '@/lib/storage'
import QuestionItem from './QuestionItem'

interface QuizSectionProps {
  content: GradeContent
  grade: GradeLevel
  date: string
  gradeLabel: string
  /** 採点完了を親に通知。score=正解数、total=問題数 */
  onScored?: (score: number, total: number) => void
}

function initAnswers(count: number): AnswerState[] {
  return Array.from({ length: count }, () => ({
    selectedIndex: null,
    isSubmitted: false,
  }))
}

export default function QuizSection({
  content,
  grade,
  date,
  gradeLabel,
  onScored,
}: QuizSectionProps) {
  const [quizState, setQuizState] = useState<QuizState>(() => ({
    answers: initAnswers(content.questions.length),
    isSubmitted: false,
    score: null,
  }))

  useEffect(() => {
    const saved = getSession(date, grade)
    if (saved && saved.completedAt) {
      setQuizState({
        answers: saved.answers,
        isSubmitted: true,
        score: saved.score,
      })
      // 保存済みスコアを親に通知（カレンダー・結果バナー更新用）
      onScored?.(saved.score, saved.totalQuestions)
    } else {
      setQuizState({
        answers: initAnswers(content.questions.length),
        isSubmitted: false,
        score: null,
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grade, date])

  const handleSelect = useCallback((questionIndex: number, choiceIndex: number) => {
    setQuizState((prev) => {
      if (prev.isSubmitted) return prev
      const newAnswers = [...prev.answers]
      newAnswers[questionIndex] = { selectedIndex: choiceIndex, isSubmitted: false }
      return { ...prev, answers: newAnswers }
    })
  }, [])

  const handleSubmit = useCallback(() => {
    setQuizState((prev) => {
      if (prev.isSubmitted) return prev

      const score = content.questions.reduce((acc, q, i) => {
        return acc + (prev.answers[i].selectedIndex === q.answer ? 1 : 0)
      }, 0)

      saveSession({
        date,
        grade,
        answers: prev.answers,
        score,
        totalQuestions: content.questions.length,
        completedAt: new Date().toISOString(),
      })

      onScored?.(score, content.questions.length)
      return { ...prev, isSubmitted: true, score }
    })
  }, [content.questions, date, grade, onScored])

  const handleRetry = useCallback(() => {
    setQuizState({
      answers: initAnswers(content.questions.length),
      isSubmitted: false,
      score: null,
    })
  }, [content.questions.length])

  const answeredCount = quizState.answers.filter((a) => a.selectedIndex !== null).length
  const allAnswered = answeredCount === content.questions.length

  return (
    <section aria-label="設問" className="mt-6 space-y-4">
      <h2
        className="text-sm font-bold text-[#4a4035] border-b border-[#d4c9b5] pb-2"
        style={{ fontFamily: '"Noto Sans JP", sans-serif' }}
      >
        設問（全{content.questions.length}問）
      </h2>

      {/* 問題リスト */}
      <div className="space-y-4">
        {content.questions.map((q, i) => (
          <QuestionItem
            key={q.id}
            question={q}
            index={i}
            answerState={quizState.answers[i]}
            isSubmitted={quizState.isSubmitted}
            onSelect={(choiceIndex) => handleSelect(i, choiceIndex)}
          />
        ))}
      </div>

      {/* 採点ボタン / やり直しボタン */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        {!quizState.isSubmitted ? (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
            className={`flex-1 py-3 px-6 rounded-lg font-bold text-sm transition-colors duration-150
              ${allAnswered
                ? 'bg-[#8b5e3c] text-white hover:bg-[#6d4a2e] active:bg-[#5a3d27]'
                : 'bg-[#d4c9b5] text-[#8b7d6b] cursor-not-allowed'
              }`}
            aria-disabled={!allAnswered}
          >
            {allAnswered
              ? '採点する'
              : `採点する（あと${content.questions.length - answeredCount}問回答してください）`
            }
          </button>
        ) : (
          <button
            onClick={handleRetry}
            className="py-2 px-4 rounded-lg border border-[#d4c9b5] text-sm text-[#4a4035] hover:bg-[#f5f0e8] transition-colors duration-150"
          >
            もう一度やり直す
          </button>
        )}
      </div>

    </section>
  )
}
