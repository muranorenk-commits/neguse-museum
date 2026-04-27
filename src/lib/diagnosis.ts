// 診断ロジック
// 将来的にはここをAI API呼び出しに差し替えることで、リアルな診断が可能になります

import type { DiagnosisResult, DiagnosisScores } from '../types'

// 作品タイトル候補
const TITLES = [
  '明け方の反乱',
  '枕との最終戦争',
  '右側頭部の独立宣言',
  '寝起きの構造的混乱',
  '朝日を拒む者',
  '毛流れの暴動',
  'まだ夢の中にいる髪',
  '起床に失敗した彫刻',
  '後頭部の叫び',
  '寝室に残された芸術',
]

// 評論文パーツ（組み合わせて生成する）
const REVIEW_OPENERS = [
  '右側頭部に強烈な上昇志向が見られます。',
  '毛先の動きに、昨夜の葛藤と枕への抵抗が見て取れます。',
  '左右のバランスは完全に崩壊していますが、その崩壊こそが本作品の魅力です。',
  'これは髪型ではありません。朝に偶然発生した現代アートです。',
  '後頭部に、枕との激しい格闘の跡が残っています。',
  '全体的なシルエットに、夢の残像が色濃く反映されています。',
  '毛流れの方向性から、少なくとも3回は寝返りを打ったことが読み取れます。',
]

const REVIEW_MIDDLES = [
  '全体として、予定に間に合う気配はありませんが、',
  '社会生活にはやや不向きですが、',
  '整える前に、一度写真に残す価値があります。',
  '現代美術の観点からは、非常に興味深い作品です。',
  'コームで対処できる範囲は、すでに超えています。',
  'この状態での外出は、周囲への芸術的な主張となるでしょう。',
]

const REVIEW_CLOSERS = [
  '作品としては非常に完成度が高いです。',
  '展示作品としては十分な迫力があります。',
  '整える前に、一度称えましょう。',
  '美術館への展示を強くお勧めします。',
  'その価値は計り知れません。',
  '今すぐ美術館に収蔵すべきでしょう。',
]

// 今日の一言候補
const TODAY_MESSAGES = [
  '髪は乱れているが、魂はまだ起きていない。',
  '外に出る前に、まず人間に戻りましょう。',
  '今日のあなたは、寝室が生んだ芸術です。',
  'その髪、直す前に一度称えましょう。',
  '枕とはまだ和解できていません。',
  '社会復帰には少し時間が必要です。',
  '寝ぐせとしては満点、人としては要調整です。',
]

// ローディング中のテキスト候補（LoadingAnalysis コンポーネントでも使用）
export const LOADING_MESSAGES = [
  '枕との戦闘履歴を解析中…',
  '後頭部の主張を確認中…',
  '社会復帰可能性を審査中…',
  '美術館への展示可否を判定中…',
  '右側頭部の反乱を記録中…',
  '毛流れの暴動指数を計測中…',
  '朝の芸術的価値を査定中…',
  '枕との和解可能性を検討中…',
]

// ランダムな整数を返すヘルパー関数
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// 配列からランダムに1つ選ぶヘルパー関数
function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

// 評論文をランダム生成
function generateReview(scores: DiagnosisScores): string {
  const opener = randomPick(REVIEW_OPENERS)
  const middle = randomPick(REVIEW_MIDDLES)
  const closer = randomPick(REVIEW_CLOSERS)

  // スコアに応じたコメントを追加
  if (scores.explosion > 80) {
    return `${opener}爆発的な存在感は、他の追随を許しません。${closer}`
  }
  if (scores.asymmetry > 85) {
    return `左右非対称度は驚異的な数値を記録しています。${middle}${closer}`
  }
  if (scores.pillowBattle > 80) {
    return `${opener}昨夜の枕との格闘は相当激しかったようです。${closer}`
  }
  if (scores.socialReturn < 20) {
    return `${opener}社会復帰への道は険しいですが、芸術的価値は折り紙付きです。${closer}`
  }

  return `${opener}${middle}${closer}`
}

// SNSシェア文を生成
function generateShareText(result: Omit<DiagnosisResult, 'shareText'>): string {
  return `【本日の寝ぐせ美術館】

作品名：${result.title}
総合芸術点：${result.totalScore}点

${result.todayMessage}

#寝ぐせ美術館 #朝の芸術 #寝ぐせ診断`
}

// 総合芸術点を計算
// 爆発度×0.3 + 芸術性×0.3 + 左右非対称度×0.2 + 寝相バトル指数×0.2
function calcTotalScore(scores: DiagnosisScores): number {
  const total =
    scores.explosion * 0.3 +
    scores.artistry * 0.3 +
    scores.asymmetry * 0.2 +
    scores.pillowBattle * 0.2
  return Math.round(total)
}

// メイン診断関数
// 将来的にはここを: analyzeBedheadWithAI(imageFile: File) に置き換える
export async function analyzeBedhead(_imageFile: File): Promise<DiagnosisResult> {
  // モック: ランダムスコアを生成（AI連携時はAPIを呼ぶ）
  const scores: DiagnosisScores = {
    explosion: randomInt(20, 100),
    artistry: randomInt(30, 100),
    socialReturn: randomInt(5, 60),   // 低いほど面白い
    asymmetry: randomInt(15, 100),
    pillowBattle: randomInt(25, 100),
  }

  const totalScore = calcTotalScore(scores)
  const title = randomPick(TITLES)
  const todayMessage = randomPick(TODAY_MESSAGES)
  const review = generateReview(scores)

  const resultWithoutShare = { totalScore, title, review, scores, todayMessage }
  const shareText = generateShareText(resultWithoutShare)

  return {
    totalScore,
    title,
    review,
    scores,
    todayMessage,
    shareText,
  }
}
