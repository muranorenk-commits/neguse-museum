// アプリの画面状態
export type AppState = 'top' | 'loading' | 'result'

// 各診断スコア
export interface DiagnosisScores {
  explosion: number       // 爆発度
  artistry: number        // 芸術性
  socialReturn: number    // 社会復帰可能性
  asymmetry: number       // 左右非対称度
  pillowBattle: number    // 寝相バトル指数
}

// 診断結果全体
export interface DiagnosisResult {
  totalScore: number      // 総合芸術点
  title: string           // 作品タイトル
  review: string          // 評論文
  scores: DiagnosisScores
  todayMessage: string    // 今日の一言
  shareText: string       // SNSシェア用テキスト
}
