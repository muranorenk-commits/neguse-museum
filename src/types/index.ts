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
  totalScore: number
  title: string
  review: string
  scores: DiagnosisScores
  todayMessage: string
  shareText: string
}

// Firestore に保存する投稿データ
export interface Post {
  id: string
  userId: string
  userName: string
  userPhotoURL: string
  imageURL: string        // Firebase Storage の URL
  result: DiagnosisResult
  createdAt: number       // タイムスタンプ (ms)
}

// ユーザープロフィール
export interface UserProfile {
  uid: string
  displayName: string
  photoURL: string
  friendIds: string[]     // 友達の uid リスト
}
