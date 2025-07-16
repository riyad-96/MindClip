// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAiQVO_1Re0rSu3K0pG657FycGW8cpX5WM",
  authDomain: "zero-note-b18ed.firebaseapp.com",
  projectId: "zero-note-b18ed",
  storageBucket: "zero-note-b18ed.firebasestorage.app",
  messagingSenderId: "554413115906",
  appId: "1:554413115906:web:e17a8f2618f95d0ebff51b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleAuth = new GoogleAuthProvider();
export const db = getFirestore(app);