import { useEffect, useRef, useState } from 'react'

interface ScoreBarProps {
  label: string
  score: number
  color?: string
  // 低いスコアが良い場合（社会復帰可能性など）
  invertGood?: boolean
}

export function ScoreBar({ label, score, color = 'bg-museum-gold', invertGood = false }: ScoreBarProps) {
  const [displayWidth, setDisplayWidth] = useState(0)
  const hasAnimated = useRef(false)

  useEffect(() => {
    // マウント後にアニメーション開始
    if (!hasAnimated.current) {
      hasAnimated.current = true
      const timer = setTimeout(() => {
        setDisplayWidth(score)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [score])

  // スコアに応じてバーの色を決定
  const getBarColor = () => {
    if (color !== 'bg-museum-gold') return color
    if (invertGood) {
      // 低いほど良い（社会復帰可能性）: 低い = 赤
      if (score < 30) return 'bg-red-400'
      if (score < 60) return 'bg-yellow-500'
      return 'bg-green-500'
    }
    if (score >= 80) return 'bg-amber-500'
    if (score >= 50) return 'bg-yellow-500'
    return 'bg-stone-400'
  }

  // スコアのコメント
  const getScoreComment = () => {
    if (invertGood) {
      // 社会復帰可能性: 低いほど面白い
      if (score < 20) return '🔥 絶望的'
      if (score < 40) return '⚡ 危険域'
      if (score < 60) return '⚠️ 要注意'
      return '✅ ギリギリ'
    }
    if (score >= 90) return '✨ 傑作'
    if (score >= 70) return '🎨 優秀'
    if (score >= 50) return '👍 良好'
    if (score >= 30) return '📝 並'
    return '🌱 控えめ'
  }

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-serif text-museum-dark">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-museum-gray">{getScoreComment()}</span>
          <span className="text-sm font-bold text-museum-dark tabular-nums w-8 text-right">
            {score}
          </span>
        </div>
      </div>
      <div className="h-2 bg-museum-beige rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${getBarColor()}`}
          style={{ width: `${displayWidth}%` }}
        />
      </div>
    </div>
  )
}
