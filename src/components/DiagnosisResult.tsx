import { useState } from 'react'
import type { DiagnosisResult } from '../types'
import { ScoreBar } from './ScoreBar'

interface DiagnosisResultProps {
  result: DiagnosisResult
  imagePreview: string
  onReset: () => void
}

export function DiagnosisResultView({ result, imagePreview, onReset }: DiagnosisResultProps) {
  const [copied, setCopied] = useState(false)

  // SNSシェアテキストをクリップボードにコピー
  const handleCopy = async () => {
    await navigator.clipboard.writeText(result.shareText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // 総合点に応じた星の数（0〜5）
  const starCount = Math.round((result.totalScore / 100) * 5)
  const stars = '★'.repeat(starCount) + '☆'.repeat(5 - starCount)

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in">
      {/* 鑑定書ヘッダー */}
      <div className="text-center mb-6">
        <p className="museum-label text-museum-gray mb-1">鑑定結果</p>
        <div className="w-full h-px bg-museum-beige my-2" />
        <p className="text-xs text-museum-gray tracking-widest">CERTIFICATE OF ARTISTIC MERIT</p>
      </div>

      {/* 作品カード */}
      <div className="bg-white border border-museum-beige rounded-xl shadow-lg overflow-hidden mb-5">

        {/* アップロード画像 */}
        <div className="relative">
          <img
            src={imagePreview}
            alt="鑑定作品"
            className="w-full object-cover max-h-64"
          />
          {/* 美術館展示ラベル風のオーバーレイ */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <p className="museum-label text-white/70 text-xs mb-0.5">作品番号 No.{String(result.totalScore).padStart(3, '0')}</p>
            <p className="font-serif text-white text-xl leading-tight">{result.title}</p>
          </div>
        </div>

        {/* 総合芸術点 */}
        <div className="p-6 border-b border-museum-beige text-center">
          <p className="museum-label text-museum-gray mb-2">総合芸術点</p>
          <div className="flex items-end justify-center gap-1">
            <span className="font-serif text-7xl font-bold text-museum-dark leading-none">
              {result.totalScore}
            </span>
            <span className="font-serif text-2xl text-museum-gray mb-2">点</span>
          </div>
          <p className="text-amber-500 text-xl tracking-widest mt-2">{stars}</p>
        </div>

        {/* 評論文 */}
        <div className="p-6 border-b border-museum-beige">
          <p className="museum-label text-museum-gray mb-3">評論</p>
          <p className="font-serif text-museum-dark text-sm leading-relaxed">
            {result.review}
          </p>
        </div>

        {/* 各スコア */}
        <div className="p-6 border-b border-museum-beige">
          <p className="museum-label text-museum-gray mb-4">詳細スコア</p>
          <ScoreBar label="爆発度" score={result.scores.explosion} />
          <ScoreBar label="芸術性" score={result.scores.artistry} />
          <ScoreBar
            label="社会復帰可能性"
            score={result.scores.socialReturn}
            color="bg-museum-gold"
            invertGood
          />
          <ScoreBar label="左右非対称度" score={result.scores.asymmetry} />
          <ScoreBar label="寝相バトル指数" score={result.scores.pillowBattle} />
        </div>

        {/* 今日の一言 */}
        <div className="p-6">
          <p className="museum-label text-museum-gray mb-3">今日の一言</p>
          <blockquote className="font-serif text-museum-dark text-sm italic border-l-2 border-museum-gold pl-4 leading-relaxed">
            「{result.todayMessage}」
          </blockquote>
        </div>
      </div>

      {/* SNSシェアエリア */}
      <div className="bg-white border border-museum-beige rounded-xl p-5 mb-5">
        <p className="museum-label text-museum-gray mb-3">シェアする</p>
        <div className="bg-museum-cream rounded-lg p-4 mb-3">
          <pre className="font-sans text-xs text-museum-dark whitespace-pre-wrap leading-relaxed">
            {result.shareText}
          </pre>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className={`
            w-full py-2.5 rounded-lg text-sm font-sans
            border transition-all duration-200
            ${copied
              ? 'border-green-400 bg-green-50 text-green-600'
              : 'border-museum-gold text-museum-gold hover:bg-museum-gold hover:text-white'
            }
          `}
        >
          {copied ? '✓ コピーしました！' : 'テキストをコピー'}
        </button>
      </div>

      {/* もう一度鑑定するボタン */}
      <button
        type="button"
        onClick={onReset}
        className="
          w-full py-4 rounded-xl
          border-2 border-museum-dark text-museum-dark font-serif text-base
          hover:bg-museum-dark hover:text-white
          active:scale-[0.98] transition-all duration-200
        "
      >
        もう一度鑑定する
      </button>
    </div>
  )
}
