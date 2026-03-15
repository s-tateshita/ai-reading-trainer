interface NotFoundMessageProps {
  dateStr: string
}

export default function NotFoundMessage({ dateStr }: NotFoundMessageProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <div className="bg-white rounded-lg border border-[#d4c9b5] p-8 shadow-sm">
        <p
          className="text-4xl mb-4 text-[#d4c9b5]"
          aria-hidden="true"
        >
          ✏️
        </p>
        <h2
          className="text-lg font-bold text-[#1a1510] mb-2"
          style={{ fontFamily: '"Noto Serif JP", serif' }}
        >
          本日の問題はまだ準備中です
        </h2>
        <p className="text-sm text-[#4a4035] mb-4">
          {dateStr} 分のコンテンツが見つかりませんでした。
        </p>
        <p className="text-xs text-[#8b5e3c]">
          問題は毎日更新されます。しばらくお待ちください。
        </p>
      </div>
    </div>
  )
}
