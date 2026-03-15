'use client'

import type { Question, AnswerState } from '@/lib/types'

interface QuestionItemProps {
  question: Question
  index: number
  answerState: AnswerState
  isSubmitted: boolean
  onSelect: (choiceIndex: number) => void
  /** 小1かどうか（フォントサイズ調整用） */
  isGrade1?: boolean
}

export default function QuestionItem({
  question,
  index,
  answerState,
  isSubmitted,
  onSelect,
  isGrade1 = false,
}: QuestionItemProps) {
  const { selectedIndex } = answerState
  const showResult = isSubmitted

  function getChoiceClass(choiceIndex: number): string {
    const base = 'flex flex-col items-center py-1.5 px-1 h-full rounded-md border transition-all duration-150 cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-offset-1 '

    if (!showResult) {
      return base + (selectedIndex === choiceIndex
        ? 'border-[#8b5e3c] bg-[#f5f0e8] focus:ring-[#8b5e3c]'
        : 'border-[#d4c9b5] bg-white hover:bg-[#f5f0e8] hover:border-[#8b5e3c] focus:ring-[#8b5e3c]')
    }

    const isCorrect = choiceIndex === question.answer
    const isSelected = selectedIndex === choiceIndex

    if (isCorrect && isSelected)  return base + 'border-[#2e7d32] bg-[#e8f5e9] text-[#1b5e20] focus:ring-[#2e7d32]'
    if (!isCorrect && isSelected) return base + 'border-[#c62828] bg-[#ffebee] text-[#b71c1c] focus:ring-[#c62828]'
    if (isCorrect && !isSelected) return base + 'border-[#2e7d32] bg-[#e8f5e9] text-[#1b5e20]'
    return base + 'border-[#d4c9b5] bg-white opacity-40'
  }

  const isCorrect    = showResult && selectedIndex === question.answer
  const isUnanswered = showResult && selectedIndex === null

  /*
   * フォントサイズ
   * 小1: 問題文 1rem / 選択肢 0.85rem
   * 中1: 問題文 0.85rem / 選択肢 0.75rem
   */
  const promptSize = isGrade1
    ? 'clamp(0.9rem, 2.4vw, 1.05rem)'
    : 'clamp(0.78rem, 1.9vw, 0.9rem)'
  const choiceSize = isGrade1
    ? 'clamp(0.8rem, 2.1vw, 0.95rem)'
    : 'clamp(0.68rem, 1.7vw, 0.82rem)'

  /*
   * 設問エリアの高さ：スクロールなしで問題文＋選択肢が収まる値に固定する
   * - 小1: テキストが少ないので少し低め
   * - 中1: 長めの問題文に対応するため高め
   */
  const areaHeight = isGrade1
    ? 'clamp(8rem, 24vw, 10rem)'
    : 'clamp(9rem, 26vw, 12rem)'

  return (
    <div
      className="question-card"
      role="group"
      aria-labelledby={`q-prompt-${question.id}`}
    >
      {/* 問番号 + 正誤マーク */}
      <div className="flex items-center justify-between mb-2">
        <span
          className="text-xs font-bold text-[#8b5e3c] bg-[#f5f0e8] px-2 py-0.5 rounded"
          style={{ fontFamily: '"Noto Sans JP", sans-serif' }}
        >
          問{index + 1}
        </span>
        {showResult && (
          <span
            className={`text-sm font-bold ${isCorrect ? 'text-[#2e7d32]' : isUnanswered ? 'text-[#8b5e3c]' : 'text-[#c62828]'}`}
            aria-label={isCorrect ? '正解' : isUnanswered ? '未回答' : '不正解'}
          >
            {isCorrect ? '○' : isUnanswered ? '－' : '✕'}
          </span>
        )}
      </div>

      {/*
        縦書きレイアウト（スクロールなし）
        ─────────────────────────────────────────
        DOM順:  [問題文] [選択肢1] [選択肢2] [選択肢3] [選択肢4]
        flex-row-reverse で表示順（左→右）:
                [4]      [3]      [2]      [1]      [問題文]
        右から左に読む: 問題文 → 1 → 2 → 3 → 4  ✓

        overflow: hidden で横スクロールを完全に廃止し、
        height を clamp で固定することで 1 画面内に収める。
      */}
      <div
        className="flex flex-row-reverse"
        style={{
          height: areaHeight,
          overflow: 'hidden',
          gap: '0.3rem',
        }}
      >
        {/* ── 問題文（右端） ── */}
        <div
          className="shrink-0 overflow-hidden"
          style={{
            maxWidth: '44%',
            borderLeft: '1px solid #d4c9b5',
            paddingLeft: '0.5rem',
          }}
        >
          <p
            id={`q-prompt-${question.id}`}
            style={{
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              fontFamily: '"Noto Serif JP", "Yu Mincho", "YuMincho", "Hiragino Mincho ProN", serif',
              fontSize: promptSize,
              lineHeight: '1.9',
              letterSpacing: '0.06em',
              height: '100%',
              overflow: 'hidden',
            }}
          >
            {question.prompt}
          </p>
        </div>

        {/* ── 選択肢 1〜4（flex-row-reverse で 1が右、4が左） ── */}
        <div
          className="flex flex-row-reverse flex-1 min-w-0 overflow-hidden"
          style={{ gap: '0.3rem' }}
          role="radiogroup"
          aria-labelledby={`q-prompt-${question.id}`}
        >
          {question.choices.map((choice, i) => {
            const isCorrectChoice  = i === question.answer
            const isSelectedChoice = selectedIndex === i

            return (
              <button
                key={i}
                className={getChoiceClass(i)}
                onClick={() => !showResult && onSelect(i)}
                disabled={showResult}
                aria-pressed={isSelectedChoice}
                aria-label={`選択肢${i + 1}: ${choice}${showResult && isCorrectChoice ? '（正解）' : ''}${showResult && isSelectedChoice && !isCorrectChoice ? '（あなたの回答）' : ''}`}
                style={{ flex: '1 1 0', minWidth: 0, overflow: 'hidden' }}
              >
                {/* 番号ラベル（横書き） */}
                <span
                  className="text-xs font-bold text-[#8b5e3c] mb-1"
                  style={{ fontFamily: '"Noto Sans JP", sans-serif', writingMode: 'horizontal-tb' }}
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                {/* 選択肢テキスト（縦書き） */}
                <span
                  style={{
                    writingMode: 'vertical-rl',
                    textOrientation: 'mixed',
                    fontFamily: '"Noto Serif JP", "Yu Mincho", "YuMincho", "Hiragino Mincho ProN", serif',
                    fontSize: choiceSize,
                    lineHeight: '1.9',
                    letterSpacing: '0.06em',
                    overflow: 'hidden',
                    flex: '1 1 0',
                    display: 'block',
                  }}
                >
                  {choice}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 解説（採点後・横書き） */}
      {showResult && (
        <div className="explanation-box" aria-live="polite">
          <span className="font-bold text-[#8b5e3c] mr-1">解説：</span>
          {question.explanation}
        </div>
      )}
    </div>
  )
}
