'use client'

import type { Question, AnswerState } from '@/lib/types'

interface QuestionItemProps {
  question: Question
  index: number
  answerState: AnswerState
  isSubmitted: boolean
  onSelect: (choiceIndex: number) => void
}

export default function QuestionItem({
  question,
  index,
  answerState,
  isSubmitted,
  onSelect,
}: QuestionItemProps) {
  const { selectedIndex } = answerState
  const showResult = isSubmitted

  function getChoiceClass(choiceIndex: number): string {
    // 縦長カードのベーススタイル
    const base = 'choice-button flex flex-col items-center py-3 px-2 h-full '

    if (!showResult) {
      return base + (selectedIndex === choiceIndex
        ? 'choice-button-selected'
        : 'choice-button-default')
    }

    const isCorrect = choiceIndex === question.answer
    const isSelected = selectedIndex === choiceIndex

    if (isCorrect && isSelected) return base + 'choice-button-correct'
    if (!isCorrect && isSelected) return base + 'choice-button-incorrect'
    if (isCorrect && !isSelected) return base + 'choice-button-correct-answer'
    return base + 'choice-button-default opacity-40'
  }

  const isCorrect = showResult && selectedIndex === question.answer
  const isUnanswered = showResult && selectedIndex === null

  return (
    <div
      className="question-card"
      role="group"
      aria-labelledby={`q-prompt-${question.id}`}
    >
      {/* 問番号 + 正誤マーク */}
      <div className="flex items-center justify-between mb-3">
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
        縦書きレイアウト：
        ・問題文 → 右端（縦書きは右から左に読む）
        ・選択肢 1〜4 → 右から左の順で問題文の左に並ぶ

        flex-row-reverse を使うことで
        DOM順: [問題文] [選択肢1] [選択肢2] [選択肢3] [選択肢4]
        表示順（左→右）: [4] [3] [2] [1] [問題文]
        読み順（右→左）: 問題文 → 1 → 2 → 3 → 4  ✓
      */}
      <div
        className="flex flex-row-reverse gap-2 overflow-x-auto"
        style={{ minHeight: '10rem' }}
      >
        {/* 問題文（縦書き・右端） */}
        <div
          className="shrink-0"
          style={{
            borderLeft: '1px solid #d4c9b5',
            paddingLeft: '0.75rem',
          }}
        >
          <p
            id={`q-prompt-${question.id}`}
            style={{
              writingMode: 'vertical-rl',
              textOrientation: 'mixed',
              fontFamily: '"Noto Serif JP", "Yu Mincho", "YuMincho", "Hiragino Mincho ProN", serif',
              fontSize: 'clamp(0.875rem, 2.5vw, 1rem)',
              lineHeight: '2.0',
              letterSpacing: '0.08em',
              whiteSpace: 'pre-wrap',
            }}
          >
            {question.prompt}
          </p>
        </div>

        {/* 選択肢 1〜4（flex-row-reverse により右から 1,2,3,4 の順で表示） */}
        <div
          className="flex flex-row-reverse flex-1 gap-2 min-w-0"
          role="radiogroup"
          aria-labelledby={`q-prompt-${question.id}`}
        >
          {question.choices.map((choice, i) => {
            const isCorrectChoice = i === question.answer
            const isSelectedChoice = selectedIndex === i

            return (
              <button
                key={i}
                className={getChoiceClass(i)}
                onClick={() => !showResult && onSelect(i)}
                disabled={showResult}
                aria-pressed={isSelectedChoice}
                aria-label={`選択肢${i + 1}: ${choice}${showResult && isCorrectChoice ? '（正解）' : ''}${showResult && isSelectedChoice && !isCorrectChoice ? '（あなたの回答）' : ''}`}
                style={{ flex: '1 1 0', minWidth: '3.5rem' }}
              >
                {/* 番号ラベル（横書き） */}
                <span
                  className="text-xs font-bold text-[#8b5e3c] mb-2"
                  style={{
                    fontFamily: '"Noto Sans JP", sans-serif',
                    writingMode: 'horizontal-tb',
                  }}
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
                    fontSize: '0.875rem',
                    lineHeight: '2.0',
                    letterSpacing: '0.08em',
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
