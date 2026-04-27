import { useEffect, useState } from 'react'
import { LOADING_MESSAGES } from '../lib/diagnosis'

export function LoadingAnalysis() {
  const [messageIndex, setMessageIndex] = useState(0)
  const [dots, setDots] = useState('')

  // ローディングメッセージをランダムな初期値で始める
  useEffect(() => {
    setMessageIndex(Math.floor(Math.random() * LOADING_MESSAGES.length))
  }, [])

  // メッセージを一定間隔で切り替える
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length)
    }, 800)
    return () => clearInterval(interval)
  }, [])

  // ドットアニメーション
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === '...') return ''
        return prev + '.'
      })
    }, 400)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] animate-fade-in">
      {/* 回転する美術館アイコン */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full border-4 border-museum-beige border-t-museum-gold animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-3xl">
          🎨
        </div>
      </div>

      {/* 鑑定中テキスト */}
      <div className="text-center">
        <p className="museum-label mb-3 text-museum-gray">
          AI美術評論家が鑑定中
        </p>
        <p className="font-serif text-museum-dark text-lg min-h-[3rem] flex items-center justify-center">
          {LOADING_MESSAGES[messageIndex].replace('…', '')}<span className="w-8 text-left inline-block">{dots}</span>
        </p>
      </div>

      {/* 細い装飾ライン */}
      <div className="mt-8 flex items-center gap-3 text-museum-beige">
        <div className="w-12 h-px bg-museum-beige" />
        <span className="text-xs text-museum-gray tracking-widest uppercase">Analyzing</span>
        <div className="w-12 h-px bg-museum-beige" />
      </div>
    </div>
  )
}
