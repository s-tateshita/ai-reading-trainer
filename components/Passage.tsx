'use client'

import { useEffect, useRef } from 'react'
import type { GradeLevel } from '@/lib/types'

interface PassageProps {
  title: string
  passage: string
  gradeLabel: string
  grade: GradeLevel
}

// 学年ごとのフォントサイズ
const FONT_SIZE: Record<GradeLevel, string> = {
  grade1: 'clamp(1.125rem, 3.5vw, 1.375rem)', // 小1：大きめ
  grade7: 'clamp(0.9rem, 2.5vw, 1.0625rem)',   // 中1：標準
}

export default function Passage({ title, passage, gradeLabel, grade }: PassageProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // 縦書きは右端が先頭 → マウント時に右端へスクロール
  useEffect(() => {
    const el = scrollRef.current
    if (el) {
      el.scrollLeft = el.scrollWidth
    }
  }, [passage]) // passage が変わる（学年切替）たびにリセット

  const formattedText = passage
    .split('\n\n')
    .map((p) => p.trim())
    .filter(Boolean)
    .join('\n\u3000\n')

  return (
    <section aria-label="本文" className="passage-container p-4 md:p-6">
      {/* タイトル（横書き） */}
      <div className="mb-4 pb-3 border-b border-[#d4c9b5] flex items-baseline justify-between">
        <h2
          className="text-lg font-bold text-[#1a1510]"
          style={{ fontFamily: '"Noto Serif JP", serif' }}
        >
          {title}
        </h2>
        <span className="text-xs text-[#8b5e3c] ml-2">{gradeLabel}</span>
      </div>

      {/* 本文スクロールコンテナ */}
      <div
        ref={scrollRef}
        style={{
          overflowX: 'auto',
          overflowY: 'hidden',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'thin',
          scrollbarColor: '#d4c9b5 transparent',
        }}
        aria-label="本文（縦書き）"
      >
        <div
          style={{
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
            fontFamily: '"Noto Serif JP", "Yu Mincho", "YuMincho", "Hiragino Mincho ProN", serif',
            fontSize: FONT_SIZE[grade],
            lineHeight: grade === 'grade1' ? '2.4' : '2.2',
            letterSpacing: '0.08em',
            whiteSpace: 'pre-wrap',
            height: 'min(52vh, 420px)',
            padding: '0.5rem 1rem',
          }}
        >
          {formattedText}
        </div>
      </div>

      {/* スクロールヒント（スマホ向け） */}
      <p className="mt-2 text-xs text-[#8b5e3c] text-right sm:hidden">
        ← 横にスクロールできます
      </p>
    </section>
  )
}
