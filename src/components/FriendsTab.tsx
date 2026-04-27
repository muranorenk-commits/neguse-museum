import { useEffect, useState } from 'react'
import type { User } from 'firebase/auth'
import {
  getUser, searchUserByName, addFriend,
  removeFriend, getFriendsPosts,
} from '../lib/firestore'
import type { Post, UserProfile } from '../types'
import { PostCard } from './PostCard'

interface FriendsTabProps {
  user: User
}

export function FriendsTab({ user }: FriendsTabProps) {
  const [myProfile, setMyProfile] = useState<UserProfile | null>(null)
  const [friendsPosts, setFriendsPosts] = useState<Post[]>([])
  const [searchName, setSearchName] = useState('')
  const [searchResults, setSearchResults] = useState<UserProfile[]>([])
  const [searching, setSearching] = useState(false)
  const [loadingFeed, setLoadingFeed] = useState(true)

  // 自分のプロフィールと友達の投稿を取得
  useEffect(() => {
    const load = async () => {
      const profile = await getUser(user.uid)
      setMyProfile(profile)
      if (profile && profile.friendIds.length > 0) {
        const posts = await getFriendsPosts(profile.friendIds)
        setFriendsPosts(posts)
      }
      setLoadingFeed(false)
    }
    load()
  }, [user.uid])

  // ユーザー検索
  const handleSearch = async () => {
    if (!searchName.trim()) return
    setSearching(true)
    const results = await searchUserByName(searchName.trim())
    // 自分自身は除外
    setSearchResults(results.filter(u => u.uid !== user.uid))
    setSearching(false)
  }

  // 友達追加
  const handleAdd = async (friendUid: string) => {
    await addFriend(user.uid, friendUid)
    const updated = await getUser(user.uid)
    setMyProfile(updated)
    if (updated && updated.friendIds.length > 0) {
      const posts = await getFriendsPosts(updated.friendIds)
      setFriendsPosts(posts)
    }
  }

  // 友達削除
  const handleRemove = async (friendUid: string) => {
    await removeFriend(user.uid, friendUid)
    const updated = await getUser(user.uid)
    setMyProfile(updated)
    const posts = updated && updated.friendIds.length > 0
      ? await getFriendsPosts(updated.friendIds)
      : []
    setFriendsPosts(posts)
  }

  const isFriend = (uid: string) => myProfile?.friendIds.includes(uid) ?? false

  return (
    <div className="space-y-6">
      {/* 友達検索 */}
      <div className="bg-white border border-[#e0d5c0] rounded-xl p-4">
        <p className="text-xs text-[#6b6b6b] mb-3 uppercase tracking-widest">友達を追加</p>
        <div className="flex gap-2">
          <input
            type="text"
            value={searchName}
            onChange={e => setSearchName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="表示名で検索…"
            className="flex-1 border border-[#e0d5c0] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#b8963e]"
          />
          <button
            onClick={handleSearch}
            disabled={searching}
            className="px-4 py-2 bg-[#1a1a1a] text-white rounded-lg text-sm hover:bg-gray-700 disabled:opacity-50 transition-colors"
          >
            検索
          </button>
        </div>

        {/* 検索結果 */}
        {searchResults.length > 0 && (
          <div className="mt-3 space-y-2">
            {searchResults.map(u => (
              <div key={u.uid} className="flex items-center gap-3 p-2 rounded-lg bg-[#f5f0e8]">
                <img src={u.photoURL || '/placeholder.png'} alt={u.displayName} className="w-8 h-8 rounded-full" />
                <span className="flex-1 text-sm font-serif text-[#1a1a1a]">{u.displayName}</span>
                {isFriend(u.uid) ? (
                  <button
                    onClick={() => handleRemove(u.uid)}
                    className="text-xs text-red-400 border border-red-200 px-3 py-1 rounded-full hover:bg-red-50 transition-colors"
                  >
                    削除
                  </button>
                ) : (
                  <button
                    onClick={() => handleAdd(u.uid)}
                    className="text-xs text-[#b8963e] border border-[#b8963e] px-3 py-1 rounded-full hover:bg-yellow-50 transition-colors"
                  >
                    追加
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
        {searchResults.length === 0 && searchName && !searching && (
          <p className="mt-3 text-xs text-[#6b6b6b] text-center">見つかりませんでした</p>
        )}
      </div>

      {/* 友達の投稿フィード */}
      {loadingFeed ? (
        <div className="text-center py-10 text-[#6b6b6b]">
          <p className="text-sm">読み込み中…</p>
        </div>
      ) : friendsPosts.length === 0 ? (
        <div className="text-center py-10 text-[#6b6b6b]">
          <div className="text-4xl mb-3">👥</div>
          <p className="font-serif text-base">友達の作品はまだありません</p>
          <p className="text-sm mt-1">友達を追加すると作品が表示されます</p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-xs text-[#6b6b6b] text-center">友達の最新作品</p>
          {friendsPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
