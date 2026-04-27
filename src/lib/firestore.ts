// Firestore の読み書きロジック
import {
  collection, doc, setDoc, getDoc, getDocs,
  query, where, orderBy, addDoc, serverTimestamp,
  updateDoc, arrayUnion, arrayRemove,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from './firebase'
import type { Post, UserProfile, DiagnosisResult } from '../types'

// ---- ユーザー ----

// ユーザープロフィールを作成 or 更新
export async function upsertUser(uid: string, displayName: string, photoURL: string) {
  const ref_ = doc(db, 'users', uid)
  const snap = await getDoc(ref_)
  if (!snap.exists()) {
    await setDoc(ref_, { uid, displayName, photoURL, friendIds: [] })
  }
}

// ユーザープロフィールを取得
export async function getUser(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? (snap.data() as UserProfile) : null
}

// 表示名でユーザー検索
export async function searchUserByName(name: string): Promise<UserProfile[]> {
  const q = query(collection(db, 'users'), where('displayName', '==', name))
  const snap = await getDocs(q)
  return snap.docs.map(d => d.data() as UserProfile)
}

// 友達追加
export async function addFriend(myUid: string, friendUid: string) {
  await updateDoc(doc(db, 'users', myUid), { friendIds: arrayUnion(friendUid) })
}

// 友達削除
export async function removeFriend(myUid: string, friendUid: string) {
  await updateDoc(doc(db, 'users', myUid), { friendIds: arrayRemove(friendUid) })
}

// ---- 投稿 ----

// 画像を Storage にアップロードして URL を返す
export async function uploadImage(uid: string, file: File): Promise<string> {
  const path = `posts/${uid}/${Date.now()}_${file.name}`
  const storageRef = ref(storage, path)
  await uploadBytes(storageRef, file)
  return getDownloadURL(storageRef)
}

// 投稿を Firestore に保存
export async function savePost(
  uid: string,
  userName: string,
  userPhotoURL: string,
  imageFile: File,
  result: DiagnosisResult,
): Promise<string> {
  const imageURL = await uploadImage(uid, imageFile)
  const docRef = await addDoc(collection(db, 'posts'), {
    userId: uid,
    userName,
    userPhotoURL,
    imageURL,
    result,
    createdAt: serverTimestamp(),
  })
  return docRef.id
}

// 自分の投稿一覧を取得
export async function getMyPosts(uid: string): Promise<Post[]> {
  const q = query(
    collection(db, 'posts'),
    where('userId', '==', uid),
    orderBy('createdAt', 'desc'),
  )
  const snap = await getDocs(q)
  return snap.docs.map(d => ({
    id: d.id,
    ...d.data(),
    createdAt: d.data().createdAt?.toMillis?.() ?? Date.now(),
  } as Post))
}

// 友達の投稿一覧を取得
export async function getFriendsPosts(friendIds: string[]): Promise<Post[]> {
  if (friendIds.length === 0) return []
  // Firestore の in クエリは最大 30 件
  const chunks: string[][] = []
  for (let i = 0; i < friendIds.length; i += 30) {
    chunks.push(friendIds.slice(i, i + 30))
  }
  const results: Post[] = []
  for (const chunk of chunks) {
    const q = query(
      collection(db, 'posts'),
      where('userId', 'in', chunk),
      orderBy('createdAt', 'desc'),
    )
    const snap = await getDocs(q)
    snap.docs.forEach(d => results.push({
      id: d.id,
      ...d.data(),
      createdAt: d.data().createdAt?.toMillis?.() ?? Date.now(),
    } as Post))
  }
  return results.sort((a, b) => b.createdAt - a.createdAt)
}
