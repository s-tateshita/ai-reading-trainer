# 毎日よみとき

家庭学習向け日本語読解問題サイト。毎日1テーマ、小１・中１の2レベルで出題。縦書き表示で教科書体の雰囲気を再現。

---

## ディレクトリ構成

```
ai-reading-trainer/
├── app/
│   ├── layout.tsx          # ルートレイアウト（フォント・メタデータ）
│   ├── page.tsx            # メインページ（今日の問題）
│   └── globals.css         # グローバルCSS・縦書きユーティリティ
├── components/
│   ├── Header.tsx          # ヘッダー（日付・テーマ表示）
│   ├── GradeSelector.tsx   # 学年切替タブ（小1 / 中1）
│   ├── Passage.tsx         # 本文（縦書き・横スクロール）
│   ├── QuizSection.tsx     # 問題セクション（回答・採点管理）
│   ├── QuestionItem.tsx    # 設問1問（選択肢・解説）
│   ├── ResultBanner.tsx    # 採点結果バナー
│   └── NotFoundMessage.tsx # データ未登録時のフォールバック
├── lib/
│   ├── types.ts            # TypeScript型定義
│   ├── storage.ts          # localStorage操作ユーティリティ
│   └── data.ts             # データ取得・日付ユーティリティ
├── content/
│   ├── YYYY-MM-DD.json     # 日付ごとの問題データ
│   ├── _template.json      # データ追加用テンプレート
│   └── _ai_prompt_template.md  # AI生成用プロンプト雛形
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Pages自動デプロイ
├── next.config.js          # Next.js設定（static export）
├── tailwind.config.ts      # Tailwind設定（縦書き・教科書体）
└── tsconfig.json
```

---

## 開発環境セットアップ

```bash
# リポジトリをクローン
git clone https://github.com/<username>/ai-reading-trainer.git
cd ai-reading-trainer

# 依存パッケージをインストール
npm install
```

**必要な環境**
- Node.js 18 以上
- npm 9 以上

---

## ローカル起動方法

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開く。

**別の日の問題を確認したい場合:**
```
http://localhost:3000/?date=2026-03-16
```

---

## Static Export（本番ビルド）方法

```bash
npm run build
```

`out/` ディレクトリに静的ファイルが生成される。

ローカルで確認する場合:
```bash
npx serve out
```

---

## GitHub Pages デプロイ方法

### 手動セットアップ（初回）

1. GitHub でリポジトリを作成
2. リポジトリ設定 → `Settings > Pages`
   - Source: **GitHub Actions** を選択
3. `main` ブランチにプッシュすると自動デプロイ

### basePath の設定（必要な場合）

リポジトリが `https://username.github.io/ai-reading-trainer/` 形式でホストされる場合、`next.config.js` の以下の行のコメントを外す:

```js
// next.config.js
basePath: '/ai-reading-trainer',
assetPrefix: '/ai-reading-trainer/',
```

### 自動デプロイ

- `main` ブランチへのプッシュで自動デプロイ
- 毎日 AM 6:00 JST にも自動ビルド（将来の自動コンテンツ生成との連携用）

---

## データ追加方法

1. `content/_template.json` をコピーして `content/YYYY-MM-DD.json` を作成
2. 以下のフィールドを埋める:

```json
{
  "date": "2026-03-18",
  "weekly_theme": "週のテーマ",
  "daily_theme": "今日のテーマ",
  "levels": {
    "grade1": {
      "title": "タイトル",
      "passage": "本文（150〜220字）",
      "questions": [ /* 5問 */ ]
    },
    "grade7": {
      "title": "タイトル",
      "passage": "本文（400〜550字）",
      "questions": [ /* 5問 */ ]
    }
  }
}
```

3. `answer` は **0始まりのインデックス**（0〜3）で指定
4. `git add content/2026-03-18.json && git commit -m "add: 2026-03-18 問題追加"`
5. `main` にプッシュ → 自動デプロイ

---

## localStorage に保存する内容

**キー:** `ai-reading-trainer-v1`

```typescript
{
  sessions: {
    // key: "${date}_${grade}"
    "2026-03-15_grade1": {
      date: "2026-03-15",
      grade: "grade1",
      answers: [
        { selectedIndex: 1, isSubmitted: false },
        // ...（5問分）
      ],
      score: 4,           // 正解数
      totalQuestions: 5,
      completedAt: "2026-03-15T09:30:00.000Z"  // 完了日時
    }
  },
  lastVisited: "2026-03-15T09:30:00.000Z"
}
```

- 学年・日付ごとに独立して保存
- `completedAt` が null でない場合、回答済みとして表示
- ページを再読み込みしても回答内容が復元される

---

## 将来の自動生成連携案

### 推奨フロー

```
GitHub Actions (schedule: 毎日 AM 1:00 JST)
  ↓
Claude API でプロンプト送信
  ↓
JSON レスポンスを検証
  ↓
content/YYYY-MM-DD.json を生成・コミット
  ↓
デプロイ用ワークフローがトリガー
  ↓
GitHub Pages に反映
```

### 詳細プロンプトは `content/_ai_prompt_template.md` を参照

---

## 設計判断メモ（TODO / DECISION LOG）

### 採用した判断
- **dynamic import でコンテンツ読み込み**: static export でも build 時に JSON がバンドルに含まれる
- **writing-mode: vertical-rl**: CSS 縦書き。iOS Safari・Android Chrome 共に安定対応
- **URLパラメータ `?date=` でデバッグ可能**: 過去・未来の問題を開発中に確認しやすくした
- **QuizSection の key に `date-grade` を使用**: 学年切替時に状態がリセットされるよう明示

### 今後の実装候補
- [ ] 過去問一覧ページ（`/history`）
- [ ] 週間・月間の正答率グラフ
- [ ] 音声読み上げ対応（Web Speech API）
- [ ] ルビ（読み仮名）表示
- [ ] 問題のプリント用CSS（印刷レイアウト）
- [ ] JSON スキーマバリデーション CI（Zod or ajv）
- [ ] `basePath` 設定の自動化（環境変数経由）
- [ ] コンテンツ生成 GitHub Actions ワークフロー本実装
