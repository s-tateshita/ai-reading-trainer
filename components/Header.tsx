'use client'

import { formatDateJa, getDayOfWeekJa } from '@/lib/data'

interface HeaderProps {
  dateStr: string
  weeklyTheme: string
  dailyTheme: string
}

export default function Header({ dateStr, weeklyTheme, dailyTheme }: HeaderProps) {
  const dateJa = formatDateJa(dateStr)
  const dayOfWeek = getDayOfWeekJa(dateStr)

  return (
    <header className="site-header sticky top-0 z-10">
      <div className="max-w-3xl mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
        {/* サイト名 */}
        <div className="flex items-baseline gap-3">
          <h1 className="text-lg font-bold text-[#1a1510] tracking-wide" style={{ fontFamily: '"Noto Serif JP", serif' }}>
            毎日よみとき
          </h1>
          <span className="text-xs text-[#8b5e3c] hidden sm:inline">家庭学習向け読解問題</span>
        </div>

        {/* 日付・テーマ */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#4a4035]">
          <span className="bg-[#f5f0e8] px-2 py-0.5 rounded font-medium">
            {dateJa}（{dayOfWeek}）
          </span>
          <span className="text-[#8b5e3c]">週テーマ：{weeklyTheme}</span>
          <span className="font-medium text-[#1a1510]">▶ {dailyTheme}</span>
        </div>
      </div>
    </header>
  )
}
