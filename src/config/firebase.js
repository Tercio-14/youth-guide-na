// Firebase configuration for YouthGuide NA frontend
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAhNBhGm3MhWZWyhaRiqweZGA842iWMlk8",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "youthguide-na.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "youthguide-na",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "youthguide-na.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "493846258233",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:493846258233:web:d3dcc98a489da5ca8763e8",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-SD64VBD26Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Analytics (optional - for tracking user behavior)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;