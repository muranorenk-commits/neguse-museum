import { useState } from 'react'
import type { AppState, DiagnosisResult } from './types'
import { ImageUploader } from './components/ImageUploader'
import { LoadingAnalysis } from './components/LoadingAnalysis'
import { DiagnosisResultView } from './components/DiagnosisResult'
import { HistoryTab } from './components/HistoryTab'
import { FriendsTab } from './components/FriendsTab'
import { analyzeBedhead } from './lib/diagnosis'
import { savePost } from './lib/firestore'
import { useAuth } from './hooks/useAuth'

type Tab = 'diagnose' | 'history' | 'friends'

export default function App() {
  const { user, loading: authLoading, login, logout } = useAuth()

  const [appState, setAppState] = useState<AppState>('top')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [diagnosisResult, setDiagnosisResult] = useState<DiagnosisResult | null>(null)
  const [activeTab, setActiveTab] = useState<Tab>('diagnose')
  const [saving, setSaving] = useState(false)

  const handleImageSelected = (file: File, previewUrl: string) => {
    setImageFile(file)
    setImagePreview(previewUrl)
  }

  const handleAnalyze = async () => {
    if (!imageFile) return
    setAppState('loading')
    const [result] = await Promise.all([
      analyzeBedhead(imageFile),
      new Promise(r => setTimeout(r, 2500)),
    ])
    setDiagnosisResult(result)
    setAppState('result')

    // ログイン中なら自動保存
    if (user) {
      setSaving(true)
      try {
        await savePost(
          user.uid,
          user.displayName ?? '名無し',
          user.photoURL ?? '',
          imageFile,
          result,
        )
      } catch (e) {
        console.error('保存失敗:', e)
      } finally {
        setSaving(false)
      }
    }
  }

  const handleReset = () => {
    setAppState('top')
    setImageFile(null)
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImagePreview(null)
    setDiagnosisResult(null)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3">🎨</div>
          <p className="font-serif text-[#6b6b6b]">読み込み中…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      {/* ヘッダー */}
      <header className="border-b border-[#e0d5c0] bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#6b6b6b]">THE</p>
            <h1 className="font-serif text-[#1a1a1a] text-xl leading-tight">寝ぐせ美術館</h1>
          </div>

          {/* ログイン状態 */}
          {user ? (
            <div className="flex items-center gap-2">
              <img src={user.photoURL ?? ''} alt="" className="w-7 h-7 rounded-full" />
              <button
                onClick={logout}
                className="text-xs text-[#6b6b6b] border border-[#e0d5c0] px-2 py-1 rounded-full hover:bg-[#f5f0e8] transition-colors"
              >
                ログアウト
              </button>
            </div>
          ) : (
            <button
              onClick={login}
              className="text-xs border border-[#b8963e] text-[#b8963e] px-3 py-1.5 rounded-full hover:bg-[#b8963e] hover:text-white transition-colors"
            >
              Google でログイン
            </button>
          )}
        </div>

        {/* タブ（ログイン時のみ） */}
        {user && (
          <div className="max-w-lg mx-auto px-4 flex border-t border-[#e0d5c0]">
            {([
              { id: 'diagnose', label: '🎨 鑑定' },
              { id: 'history',  label: '📁 記録' },
              { id: 'friends',  label: '👥 友達' },
            ] as { id: Tab; label: string }[]).map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2.5 text-xs font-sans transition-colors
                  ${activeTab === tab.id
                    ? 'border-b-2 border-[#b8963e] text-[#b8963e]'
                    : 'text-[#6b6b6b] hover:text-[#1a1a1a]'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </header>

      <main className="max-w-lg mx-auto px-4 py-8">

        {/* ── 鑑定タブ or 未ログイン ── */}
        {(!user || activeTab === 'diagnose') && (
          <>
            {appState === 'top' && (
              <div className="animate-fade-in">
                {/* ヒーロー */}
                <div className="text-center mb-10">
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="h-px flex-1 bg-[#e0d5c0]" />
                    <span className="text-[#b8963e] text-2xl">✦</span>
                    <div className="h-px flex-1 bg-[#e0d5c0]" />
                  </div>
                  <h2 className="font-serif text-[#1a1a1a] text-2xl leading-tight mb-4">
                    寝ぐせは、失敗じゃない。<br />
                    <span className="text-[#6b6b6b] text-xl">朝に生まれた偶然のアートだ。</span>
                  </h2>
                  <p className="text-[#6b6b6b] text-sm leading-relaxed">
                    あなたの朝の髪を、<br />AI美術評論家が勝手に採点します。
                  </p>
                  <div className="flex items-center justify-center gap-4 mt-6">
                    <div className="h-px flex-1 bg-[#e0d5c0]" />
                    <span className="text-[#b8963e] text-2xl">✦</span>
                    <div className="h-px flex-1 bg-[#e0d5c0]" />
                  </div>
                </div>

                {/* ログイン促進（未ログイン時） */}
                {!user && (
                  <div className="mb-5 p-4 border border-[#e0d5c0] rounded-xl bg-white text-center">
                    <p className="text-sm text-[#6b6b6b] mb-3">
                      ログインすると診断結果が記録され、<br />友達と共有できます
                    </p>
                    <button
                      onClick={login}
                      className="text-sm border border-[#b8963e] text-[#b8963e] px-5 py-2 rounded-full hover:bg-[#b8963e] hover:text-white transition-colors"
                    >
                      Google でログイン
                    </button>
                  </div>
                )}

                <div className="bg-white border border-[#e0d5c0] rounded-xl shadow-sm p-6 mb-6">
                  <p className="text-[10px] uppercase tracking-widest text-[#6b6b6b] text-center mb-5">
                    作品を提出する
                  </p>
                  <ImageUploader
                    onImageSelected={handleImageSelected}
                    onAnalyze={handleAnalyze}
                    imagePreview={imagePreview}
                  />
                </div>
                <p className="text-center text-[#6b6b6b] text-xs leading-relaxed">
                  ※ 本サービスはフィクションです。結果は笑いのためのものです。
                </p>
              </div>
            )}

            {appState === 'loading' && (
              <div className="bg-white border border-[#e0d5c0] rounded-xl shadow-sm p-8">
                <LoadingAnalysis />
              </div>
            )}

            {appState === 'result' && diagnosisResult && imagePreview && (
              <div>
                {saving && (
                  <p className="text-center text-xs text-[#6b6b6b] mb-3 animate-pulse">
                    記録に保存中…
                  </p>
                )}
                <DiagnosisResultView
                  result={diagnosisResult}
                  imagePreview={imagePreview}
                  onReset={handleReset}
                />
              </div>
            )}
          </>
        )}

        {/* ── 記録タブ ── */}
        {user && activeTab === 'history' && <HistoryTab user={user} />}

        {/* ── 友達タブ ── */}
        {user && activeTab === 'friends' && <FriendsTab user={user} />}
      </main>

      <footer className="border-t border-[#e0d5c0] mt-12 py-6">
        <p className="text-center text-[10px] uppercase tracking-widest text-[#6b6b6b]">
          © 寝ぐせ美術館 — All Bedheads Reserved
        </p>
      </footer>
    </div>
  )
}
