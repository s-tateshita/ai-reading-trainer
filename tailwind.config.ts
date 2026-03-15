import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // 教科書体近似フォントスタック
        // Noto Serif JP → 游明朝 → 明朝系フォールバック
        textbook: [
          '"Noto Serif JP"',
          '"Yu Mincho"',
          '"YuMincho"',
          '"Hiragino Mincho ProN"',
          '"Hiragino Mincho Pro"',
          '"HGS明朝E"',
          '"MS P明朝"',
          'serif',
        ],
        // UI用（横書き部分）
        ui: [
          '"Noto Sans JP"',
          '"Hiragino Kaku Gothic ProN"',
          '"Hiragino Sans"',
          '"Meiryo"',
          'sans-serif',
        ],
      },
      colors: {
        // 学習教材らしい落ち着いた配色
        paper: '#f9f6f0',      // 和紙系背景
        ink: '#1a1510',        // 濃い墨色
        'ink-light': '#4a4035', // 薄い墨
        accent: '#8b5e3c',     // 茶色アクセント（教科書の赤み）
        'grade1': '#4a7c6f',   // 小1 緑系
        'grade7': '#5c6bc0',   // 中1 青系
        correct: '#2e7d32',    // 正解
        incorrect: '#c62828',  // 不正解
        border: '#d4c9b5',     // ボーダー
      },
      writingMode: {
        vertical: 'vertical-rl',
        horizontal: 'horizontal-tb',
      },
    },
  },
  plugins: [],
}

export default config
