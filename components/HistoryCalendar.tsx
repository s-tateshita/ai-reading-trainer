'use client'

import { useState, useEffect, useCallback } from 'react'
import { getAllSessions, clearAllSessions } from '@/lib/storage'
import type { SessionResult } from '@/lib/types'

interface DayMark {
  grade1: boolean
  grade7: boolean
}

function buildMarkMap(sessions: SessionResult[]): Map<string, DayMark> {
  const map = new Map<string, DayMark>()
  for (const s of sessions) {
    if (!s.completedAt) continue
    const existing = map.get(s.date) ?? { grade1: false, grade7: false }
    if (s.grade === 'grade1') existing.grade1 = true
    if (s.grade === 'grade7') existing.grade7 = true
    map.set(s.date, existing)
  }
  return map
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay() // 0=日, 6=土
}

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土']

export default function HistoryCalendar() {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [markMap, setMarkMap] = useState<Map<string, DayMark>>(new Map())
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const reload = useCallback(() => {
    setMarkMap(buildMarkMap(getAllSessions()))
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  function prevMonth() {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11) }
    else setViewMonth(m => m - 1)
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0) }
    else setViewMonth(m => m + 1)
  }

  function handleReset() {
    clearAllSessions()
    setMarkMap(new Map())
    setShowResetConfirm(false)
  }

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDow = getFirstDayOfWeek(viewYear, viewMonth)
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  // カレンダーグリッド（日曜始まり）
  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  // 6行になるよう末尾を補完
  while (cells.length % 7 !== 0) cells.push(null)

  return (
    <section className="bg-white rounded-lg border border-[#d4c9b5] shadow-sm p-4 md:p-6">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-4">
        <h2
          className="text-sm font-bold text-[#1a1510]"
          style={{ fontFamily: '"Noto Sans JP", sans-serif' }}
        >
          取り組み記録
        </h2>
        <button
          onClick={() => setShowResetConfirm(true)}
          className="text-xs text-[#8b7d6b] hover:text-[#c62828] transition-colors px-2 py-1 rounded hover:bg-[#fff0f0]"
          aria-label="記録をリセット"
        >
          記録をリセット
        </button>
      </div>

      {/* リセット確認 */}
      {showResetConfirm && (
        <div className="mb-4 p-3 bg-[#fff3f3] border border-[#f5c6c6] rounded-md text-sm">
          <p className="text-[#c62828] font-medium mb-2">すべての取り組み記録を削除しますか？</p>
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="px-3 py-1 bg-[#c62828] text-white rounded text-xs font-bold hover:bg-[#b71c1c]"
            >
              削除する
            </button>
            <button
              onClick={() => setShowResetConfirm(false)}
              className="px-3 py-1 border border-[#d4c9b5] text-[#4a4035] rounded text-xs hover:bg-[#f5f0e8]"
            >
              キャンセル
            </button>
          </div>
        </div>
      )}

      {/* 月ナビゲーション */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={prevMonth}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#f5f0e8] text-[#4a4035] transition-colors"
          aria-label="前の月"
        >
          ‹
        </button>
        <span
          className="text-sm font-bold text-[#1a1510]"
          style={{ fontFamily: '"Noto Sans JP", sans-serif' }}
        >
          {viewYear}年{viewMonth + 1}月
        </span>
        <button
          onClick={nextMonth}
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#f5f0e8] text-[#4a4035] transition-colors"
          aria-label="次の月"
        >
          ›
        </button>
      </div>

      {/* 曜日ヘッダー */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((d, i) => (
          <div
            key={d}
            className={`text-center text-xs font-medium py-1
              ${i === 0 ? 'text-[#c62828]' : i === 6 ? 'text-[#5c6bc0]' : 'text-[#8b7d6b]'}`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* 日付グリッド */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} />
          }

          const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const mark = markMap.get(dateStr)
          const isToday = dateStr === todayStr
          const dow = (firstDow + day - 1) % 7

          return (
            <div
              key={dateStr}
              className="flex flex-col items-center py-1"
            >
              {/* 日付数字 */}
              <span
                className={`text-xs w-6 h-6 flex items-center justify-center rounded-full font-medium
                  ${isToday ? 'bg-[#8b5e3c] text-white' : ''}
                  ${!isToday && dow === 0 ? 'text-[#c62828]' : ''}
                  ${!isToday && dow === 6 ? 'text-[#5c6bc0]' : ''}
                  ${!isToday && dow !== 0 && dow !== 6 ? 'text-[#1a1510]' : ''}
                `}
              >
                {day}
              </span>

              {/* 丸マーク */}
              {mark && (
                <div className="flex gap-0.5 mt-0.5">
                  {mark.grade1 && (
                    <span
                      className="w-2 h-2 rounded-full bg-[#4a7c6f]"
                      title="小1 完了"
                      aria-label="小1完了"
                    />
                  )}
                  {mark.grade7 && (
                    <span
                      className="w-2 h-2 rounded-full bg-[#5c6bc0]"
                      title="中1 完了"
                      aria-label="中1完了"
                    />
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* 凡例 */}
      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[#d4c9b5]">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#4a7c6f] shrink-0" />
          <span className="text-xs text-[#4a4035]">小１完了</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#5c6bc0] shrink-0" />
          <span className="text-xs text-[#4a4035]">中１完了</span>
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <span className="w-5 h-5 rounded-full bg-[#8b5e3c] shrink-0" />
          <span className="text-xs text-[#4a4035]">今日</span>
        </div>
      </div>
    </section>
  )
}
