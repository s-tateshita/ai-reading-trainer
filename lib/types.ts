// ============================================================
// 読解問題サイト - データ型定義
// ============================================================

/** 問題タイプ（現在は選択式のみ。将来拡張用） */
export type QuestionType = 'multiple_choice' | 'short_answer' | 'ordering'

/** 学年レベル */
export type GradeLevel = 'grade1' | 'grade7'

/** 設問1問 */
export interface Question {
  id: string              // 例: "q1", "q2"
  type: QuestionType
  prompt: string          // 問題文
  choices: string[]       // 選択肢（4択）
  answer: number          // 正解インデックス（0始まり）
  explanation: string     // 解説

  // 将来拡張フィールド（オプショナル）
  difficulty?: 'easy' | 'medium' | 'hard'
  tags?: string[]
}

/** 学年別問題セット */
export interface GradeContent {
  title: string           // 本文タイトル
  passage: string         // 本文（縦書き表示用）
  questions: Question[]   // 設問5問

  // 将来拡張フィールド（オプショナル）
  estimated_time?: number  // 目安時間（分）
  word_count?: number
}

/** 1日分のデータ（JSONファイル1つ） */
export interface DailyContent {
  date: string            // "YYYY-MM-DD"
  weekly_theme: string    // 今週のテーマ（例：「動物」）
  daily_theme: string     // 今日のテーマ（例：「犬について」）
  levels: {
    grade1: GradeContent  // 小1レベル
    grade7: GradeContent  // 中1レベル
  }

  // 将来拡張フィールド（オプショナル）
  version?: string
  generation_model?: string
  reviewed_by_human?: boolean
  tags?: string[]
}

// ============================================================
// localStorage 型定義
// ============================================================

/** 1問の回答状態 */
export interface AnswerState {
  selectedIndex: number | null  // ユーザーの選択（null=未回答）
  isSubmitted: boolean
}

/** 学年別の1日分の解答セッション */
export interface SessionResult {
  date: string
  grade: GradeLevel
  answers: AnswerState[]        // questions と同じ順序
  score: number                 // 正解数
  totalQuestions: number
  completedAt: string | null    // ISO8601
}

/** localStorage に保存するデータ形式 */
export interface StorageData {
  sessions: Record<string, SessionResult>  // key: "${date}_${grade}"
  lastVisited: string   // ISO8601
}

// ============================================================
// UI状態型定義
// ============================================================

export interface QuizState {
  answers: AnswerState[]
  isSubmitted: boolean
  score: number | null
}
