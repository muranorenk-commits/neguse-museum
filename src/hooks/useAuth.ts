import { useState, useEffect } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth'
import { auth, provider } from '../lib/firebase'
import { upsertUser } from '../lib/firestore'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u)
      if (u) {
        await upsertUser(u.uid, u.displayName ?? '名無し', u.photoURL ?? '')
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const login = () => signInWithPopup(auth, provider)
  const logout = () => signOut(auth)

  return { user, loading, login, logout }
}
