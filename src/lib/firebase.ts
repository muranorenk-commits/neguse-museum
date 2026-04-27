import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyA4C6jzOhLHQJ95Un2RIdbs1yOUdFkudes",
  authDomain: "neguse-a2e38.firebaseapp.com",
  projectId: "neguse-a2e38",
  storageBucket: "neguse-a2e38.firebasestorage.app",
  messagingSenderId: "823664049722",
  appId: "1:823664049722:web:ca7dd40a6005faa6ceff03",
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()
export const db = getFirestore(app)
export const storage = getStorage(app)
