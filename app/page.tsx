'use client'

import { useState, useEffect } from 'react'
import type { DailyContent } from '@/lib/types'
import { getTodayString, getDailyContent, formatDateJa, getDayOfWeekJa } from '@/lib/data'
import Header from '@/components/Header'
import DailyProblem from '@/components/DailyProblem'
import NotFoundMessage from '@/components/NotFoundMessage'

// ============================================================
// デバッグ用：URLパラメータで日付指定を可能にする
//   例: /?date=2026-03-16
// ============================================================
function getTargetDate(): string {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search)
    const d = params.get('date')
    if (d && /^\d{4}-\d{2}-\d{2}$/.test(d)) return d
  }
  return getTodayString()
}

export default function HomePage() {
  const [dateStr, setDateStr] = useState<string>('')
  const [content, setContent] = useState<DailyContent | null | undefined>(undefined)

  useEffect(() => {
    const target = getTargetDate()
    setDateStr(target)

    getDailyContent(target).then((data) => {
      setContent(data ?? null)
    })
  }, [])

  // ローディング
  if (content === undefined || !dateStr) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f6f0]">
        <p className="text-[#8b5e3c] text-sm" aria-live="polite">読み込み中…</p>
      </div>
    )
  }

  const headerProps = content
    ? {
        dateStr: content.date,
        weeklyTheme: content.weekly_theme,
        dailyTheme: content.daily_theme,
      }
    : {
        dateStr,
        weeklyTheme: '—',
        dailyTheme: '—',
      }

  return (
    <div className="min-h-screen bg-[#f9f6f0]">
      <Header {...headerProps} />

      <main id="main-content" tabIndex={-1}>
        {content ? (
          <DailyProblem content={content} />
        ) : (
          <NotFoundMessage dateStr={`${formatDateJa(dateStr)}（${getDayOfWeekJa(dateStr)}）`} />
        )}
      </main>

      <footer className="border-t border-[#d4c9b5] mt-8 py-4 text-center">
        <p className="text-xs text-[#8b7d6b]">
          毎日よみとき — 家庭学習向け読解問題サイト
        </p>
      </footer>
    </div>
  )
}
