import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyCtXDvbERdGcH03xOjr2M047uJS4bzZdg0",
  authDomain: "everypoop-e8531.firebaseapp.com",
  projectId: "everypoop-e8531",
  storageBucket: "everypoop-e8531.firebasestorage.app",
  messagingSenderId: "556883594313",
  appId: "1:556883594313:web:b442ba1ec7cf00bd0e0398"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
export {auth, provider, db};