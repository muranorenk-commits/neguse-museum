import { useEffect, useState } from 'react'
import type { User } from 'firebase/auth'
import { getMyPosts } from '../lib/firestore'
import type { Post } from '../types'
import { PostCard } from './PostCard'

interface HistoryTabProps {
  user: User
}

export function HistoryTab({ user }: HistoryTabProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyPosts(user.uid)
      .then(setPosts)
      .finally(() => setLoading(false))
  }, [user.uid])

  if (loading) {
    return (
      <div className="text-center py-16 text-[#6b6b6b]">
        <div className="text-3xl mb-3">🎨</div>
        <p className="text-sm">記録を読み込み中…</p>
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-16 text-[#6b6b6b]">
        <div className="text-4xl mb-3">🖼️</div>
        <p className="font-serif text-base">まだ作品がありません</p>
        <p className="text-sm mt-1">寝ぐせを鑑定すると記録されます</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-[#6b6b6b] text-center">
        これまでの作品 {posts.length} 点
      </p>
      {posts.map(post => (
        <PostCard key={post.id} post={post} defaultOpen />
      ))}
    </div>
  )
}
