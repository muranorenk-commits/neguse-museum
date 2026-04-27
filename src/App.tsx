import { useState } from 'react'
import type { AppState, DiagnosisResult } from './types'
import { ImageUploader } from './components/ImageUploader'
import { LoadingAnalysis } from './components/LoadingAnalysis'
import { DiagnosisResultView } from './components/DiagnosisResult'
import { analyzeBedhead } from './lib/diagnosis'

export default function App() {
  // 現在の画面状態
  const [appState, setAppState] = useState<AppState>('top')

  // アップロードされた画像
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // 診断結果
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null)

  // 画像が選択されたとき
  const handleImageSelected = (file: File, previewUrl: string) => {
    setImageFile(file)
    setImagePreview(previewUrl)
  }

  // 「鑑定する」ボタンが押されたとき
  const handleAnalyze = async () => {
    if (!imageFile) return

    setAppState('loading')

    // 2秒のローディング演出 + 診断処理
    const [result] = await Promise.all([
      analyzeBedhead(imageFile),
      new Promise((resolve) => setTimeout(resolve, 2500)),
    ])

    setDiagnosisResult(result)
    setAppState('result')
  }

  // リセット（最初から）
  const handleReset = () => {
    setAppState('top')
    setImageFile(null)
    // プレビューURLのメモリを解放
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
    }
    setImagePreview(null)
    setDiagnosisResult(null)
  }

  return (
    <div className="min-h-screen bg-museum-cream">
      {/* ヘッダー */}
      <header className="border-b border-museum-beige bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <p className="museum-label text-museum-gray text-xs">THE</p>
            <h1 className="font-serif text-museum-dark text-xl leading-tight">
              寝ぐせ美術館
            </h1>
          </div>
          <div className="text-right">
            <p className="museum-label text-museum-gray text-xs">BEDHEAD</p>
            <p className="museum-label text-museum-gray text-xs">MUSEUM</p>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="max-w-lg mx-auto px-4 py-8">

        {/* トップ画面 / アップロード画面 */}
        {(appState === 'top') && (
          <div className="animate-fade-in">
            {/* ヒーローセクション */}
            <div className="text-center mb-10">
              {/* 美術館の壁飾り風 */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="h-px flex-1 bg-museum-beige" />
                <span className="text-museum-gold text-2xl">✦</span>
                <div className="h-px flex-1 bg-museum-beige" />
              </div>

              <h2 className="font-serif text-museum-dark text-2xl leading-tight mb-4">
                寝ぐせは、失敗じゃない。<br />
                <span className="text-museum-gray text-xl">朝に生まれた偶然のアートだ。</span>
              </h2>

              <p className="text-museum-gray text-sm leading-relaxed">
                あなたの朝の髪を、<br />
                AI美術評論家が勝手に採点します。
              </p>

              <div className="flex items-center justify-center gap-4 mt-6">
                <div className="h-px flex-1 bg-museum-beige" />
                <span className="text-museum-gold text-2xl">✦</span>
                <div className="h-px flex-1 bg-museum-beige" />
              </div>
            </div>

            {/* 展示の案内っぽいカード */}
            <div className="bg-white border border-museum-beige rounded-xl shadow-sm p-6 mb-6">
              <p className="museum-label text-museum-gray text-center mb-5">
                作品を提出する
              </p>
              <ImageUploader
                onImageSelected={handleImageSelected}
                onAnalyze={handleAnalyze}
                imagePreview={imagePreview}
              />
            </div>

            {/* フッター注意書き */}
            <p className="text-center text-museum-gray text-xs leading-relaxed">
              ※ 本サービスはフィクションです。<br />
              結果は笑いのためのものです。深刻に受け止めないでください。
            </p>
          </div>
        )}

        {/* 分析中画面 */}
        {appState === 'loading' && (
          <div className="bg-white border border-museum-beige rounded-xl shadow-sm p-8">
            <LoadingAnalysis />
          </div>
        )}

        {/* 診断結果画面 */}
        {appState === 'result' && diagnosisResult && imagePreview && (
          <DiagnosisResultView
            result={diagnosisResult}
            imagePreview={imagePreview}
            onReset={handleReset}
          />
        )}
      </main>

      {/* フッター */}
      <footer className="border-t border-museum-beige mt-12 py-6">
        <p className="text-center museum-label text-museum-gray text-xs">
          © 寝ぐせ美術館 — All Bedheads Reserved
        </p>
      </footer>
    </div>
  )
}
