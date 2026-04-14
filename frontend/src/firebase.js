import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA0q9bnWYqiY39LRX7iEk42VKIsS565eyo",
  authDomain: "campaignai-e9ddd.firebaseapp.com",
  projectId: "campaignai-e9ddd",
  storageBucket: "campaignai-e9ddd.firebasestorage.app",
  messagingSenderId: "473495825747",
  appId: "1:473495825747:web:1957fcf6e5cdc26ca585a6",
  measurementId: "G-BY4TK45LVX",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
