'use client'

import { useState, useEffect, useCallback } from 'react'
import type { DailyContent } from '@/lib/types'
import { getTodayString, getDailyContent, formatDateJa, getDayOfWeekJa, AVAILABLE_DATES } from '@/lib/data'
import Header from '@/components/Header'
import DailyProblem from '@/components/DailyProblem'
import NotFoundMessage from '@/components/NotFoundMessage'

/** URLパラメータ ?date=YYYY-MM-DD があればそちらを使い、なければ今日 */
function getInitialDate(): string {
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

  /** 指定日付のコンテンツを読み込み、URLも更新する（リロードなし） */
  const loadDate = useCallback((targetDate: string) => {
    setContent(undefined) // ローディング状態
    setDateStr(targetDate)

    // 今日の場合はクエリなし、過去日はクエリあり
    const todayStr = getTodayString()
    const newUrl = targetDate === todayStr
      ? window.location.pathname
      : `${window.location.pathname}?date=${targetDate}`
    window.history.pushState({ date: targetDate }, '', newUrl)

    getDailyContent(targetDate).then((data) => {
      setContent(data ?? null)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  }, [])

  // 初回マウント
  useEffect(() => {
    loadDate(getInitialDate())
  }, [loadDate])

  // ブラウザの「戻る」「進む」に追従
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      const d = (e.state as { date?: string } | null)?.date
      loadDate(d && /^\d{4}-\d{2}-\d{2}$/.test(d) ? d : getTodayString())
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [loadDate])

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
          <DailyProblem
            content={content}
            availableDates={AVAILABLE_DATES}
            onSelectDate={loadDate}
          />
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
