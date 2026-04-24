import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if all required environment variables are set
const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'appId'];
const missingKeys = requiredKeys.filter(key => !firebaseConfig[key as keyof typeof firebaseConfig] || firebaseConfig[key as keyof typeof firebaseConfig] === 'your_api_key_here' || firebaseConfig[key as keyof typeof firebaseConfig]?.includes('your_project_id'));

if (missingKeys.length > 0 && typeof window !== 'undefined') {
  console.warn(`Firebase Configuration Warning: Missing or placeholder values for: ${missingKeys.join(', ')}. Please check your .env.local file.`);
}

// Debugging log (only show first 5 characters for security)
if (typeof window !== 'undefined') {
  console.log("Firebase API Key loaded:", firebaseConfig.apiKey ? firebaseConfig.apiKey.substring(0, 5) + "..." : "MISSING");
}

// Initialize Firebase
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, db, googleProvider };
