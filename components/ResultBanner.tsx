'use client'

interface ResultBannerProps {
  score: number
  total: number
  gradeLabel: string
}

export default function ResultBanner({ score, total, gradeLabel }: ResultBannerProps) {
  const rate = score / total

  let bannerClass = 'result-banner '
  let message = ''

  if (rate === 1) {
    bannerClass += 'result-banner-perfect'
    message = '全問正解！すばらしい！'
  } else if (rate >= 0.6) {
    bannerClass += 'result-banner-good'
    message = 'よくできました！'
  } else {
    bannerClass += 'result-banner-normal'
    message = '解説を読んでもう一度確認しよう'
  }

  return (
    <div className={bannerClass} role="status" aria-live="polite">
      <div className="text-2xl font-bold mb-1">
        {score} <span className="text-base font-normal">/ {total} 問正解</span>
      </div>
      <div className="text-sm">{gradeLabel} · {message}</div>
    </div>
  )
}
