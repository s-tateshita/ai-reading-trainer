import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '毎日よみとき | 家庭学習向け読解問題サイト',
  description: '小1・中1レベルの読解問題を毎日1テーマ出題。縦書きで本文・設問・解説を学習できる家庭学習サイト。',
  keywords: ['読解', '国語', '学習', '小学生', '中学生', '縦書き', '問題'],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        {children}
      </body>
    </html>
  )
}
