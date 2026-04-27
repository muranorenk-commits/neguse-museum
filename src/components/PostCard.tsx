import type { Post } from '../types'
import { ScoreBar } from './ScoreBar'

interface PostCardProps {
  post: Post
  defaultOpen?: boolean
}

// 日時フォーマット
function formatDate(ms: number) {
  const d = new Date(ms)
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
}

export function PostCard({ post, defaultOpen = false }: PostCardProps) {
  const stars = '★'.repeat(Math.round((post.result.totalScore / 100) * 5))
    + '☆'.repeat(5 - Math.round((post.result.totalScore / 100) * 5))

  return (
    <div className="bg-white border border-[#e0d5c0] rounded-xl shadow-sm overflow-hidden">
      {/* ユーザー情報 */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-[#e0d5c0]">
        <img
          src={post.userPhotoURL || '/placeholder.png'}
          alt={post.userName}
          className="w-8 h-8 rounded-full object-cover"
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-serif text-[#1a1a1a] truncate">{post.userName}</p>
          <p className="text-xs text-[#6b6b6b]">{formatDate(post.createdAt)}</p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold font-serif text-[#1a1a1a]">{post.result.totalScore}</span>
          <span className="text-xs text-[#6b6b6b] ml-0.5">点</span>
        </div>
      </div>

      {/* 画像 */}
      <div className="relative">
        <img
          src={post.imageURL}
          alt={post.result.title}
          className="w-full object-cover max-h-56"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
          <p className="text-white font-serif text-base">{post.result.title}</p>
          <p className="text-amber-300 text-sm">{stars}</p>
        </div>
      </div>

      {/* 評論・スコア（開閉可能） */}
      {defaultOpen && (
        <div className="px-4 py-4 space-y-4">
          <p className="text-sm font-serif text-[#1a1a1a] leading-relaxed italic border-l-2 border-[#b8963e] pl-3">
            「{post.result.review}」
          </p>
          <div>
            <ScoreBar label="爆発度" score={post.result.scores.explosion} />
            <ScoreBar label="芸術性" score={post.result.scores.artistry} />
            <ScoreBar label="社会復帰可能性" score={post.result.scores.socialReturn} invertGood />
            <ScoreBar label="左右非対称度" score={post.result.scores.asymmetry} />
            <ScoreBar label="寝相バトル指数" score={post.result.scores.pillowBattle} />
          </div>
          <p className="text-xs text-[#6b6b6b] text-center italic">「{post.result.todayMessage}」</p>
        </div>
      )}
    </div>
  )
}
