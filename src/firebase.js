import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDl7CXj6YBTe_xwoENrB8Tzz9kwoA7stA8",
  authDomain: "furniture-tracker-81cfe.firebaseapp.com",
  projectId: "furniture-tracker-81cfe",
  storageBucket: "furniture-tracker-81cfe.firebasestorage.app",
  messagingSenderId: "552704875029",
  appId: "1:552704875029:web:7cd2e1ff8c8af04cb2cc1c"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
