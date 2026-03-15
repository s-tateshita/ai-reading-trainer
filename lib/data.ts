import type { DailyContent } from './types'
import manifestJson from '@/content/manifest.json'

/**
 * コンテンツが存在する日付の一覧（manifest.json を正規情報源とする）。
 * 将来は GitHub Actions でデータ追加時に自動更新する。
 */
export const AVAILABLE_DATES: string[] = manifestJson as string[]

/**
 * 指定日付のコンテンツを取得する。
 * static export を前提としているため、build 時に利用可能なデータのみ扱う。
 * 将来 API 化する際はこの関数を差し替える。
 */
export async function getDailyContent(date: string): Promise<DailyContent | null> {
  try {
    // dynamic import でコンテンツを読み込む（static export 時に bundle に含まれる）
    const mod = await import(`@/content/${date}.json`)
    return mod.default as DailyContent
  } catch {
    return null
  }
}

/**
 * 今日の日付文字列を返す（YYYY-MM-DD形式）
 */
export function getTodayString(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * 日付文字列を日本語表示用にフォーマット
 */
export function formatDateJa(dateStr: string): string {
  const [y, m, d] = dateStr.split('-')
  return `${y}年${parseInt(m)}月${parseInt(d)}日`
}

/**
 * 曜日を日本語で返す
 */
export function getDayOfWeekJa(dateStr: string): string {
  const days = ['日', '月', '火', '水', '木', '金', '土']
  const date = new Date(dateStr)
  return days[date.getDay()]
}
