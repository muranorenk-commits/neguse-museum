import { useRef, useState, type ChangeEvent, type DragEvent } from 'react'

interface ImageUploaderProps {
  onImageSelected: (file: File, previewUrl: string) => void
  onAnalyze: () => void
  imagePreview: string | null
}

export function ImageUploader({ onImageSelected, onAnalyze, imagePreview }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return

    const url = URL.createObjectURL(file)
    onImageSelected(file, url)
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  return (
    <div className="w-full max-w-md mx-auto animate-slide-up">
      {/* アップロードエリア */}
      {!imagePreview ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            border-2 border-dashed rounded-xl p-10 text-center cursor-pointer
            transition-all duration-200
            ${isDragging
              ? 'border-museum-gold bg-yellow-50 scale-[1.02]'
              : 'border-museum-beige hover:border-museum-gold hover:bg-yellow-50'
            }
          `}
        >
          {/* アイコン */}
          <div className="text-5xl mb-4">📸</div>
          <p className="text-museum-dark font-serif text-base mb-1">
            ここに画像をドロップ
          </p>
          <p className="text-museum-gray text-sm mb-4">または</p>
          <button
            type="button"
            className="inline-block text-sm px-5 py-2 rounded-full border border-museum-gold text-museum-gold hover:bg-museum-gold hover:text-white transition-colors duration-200"
          >
            ファイルを選択
          </button>
          <p className="text-museum-gray text-xs mt-4 leading-relaxed">
            顔は写っていなくてもOKです。<br />
            髪の荒ぶりが伝わる角度で撮影してください。
          </p>
        </div>
      ) : (
        /* プレビュー表示 */
        <div className="animate-fade-in">
          <div className="relative rounded-xl overflow-hidden border border-museum-beige shadow-md">
            <img
              src={imagePreview}
              alt="アップロードした寝ぐせ"
              className="w-full object-cover max-h-72"
            />
            {/* 撮り直しボタン */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm text-museum-gray text-xs px-3 py-1 rounded-full border border-museum-beige hover:bg-white transition-colors"
            >
              撮り直す
            </button>
          </div>

          {/* 鑑定ボタン */}
          <button
            type="button"
            onClick={onAnalyze}
            className="
              mt-6 w-full py-4 rounded-xl
              bg-museum-dark text-white font-serif text-lg
              hover:bg-gray-800 active:scale-[0.98]
              transition-all duration-200 shadow-md
            "
          >
            今日の寝ぐせを鑑定する
          </button>
        </div>
      )}

      {/* 非表示のファイル入力 */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}
