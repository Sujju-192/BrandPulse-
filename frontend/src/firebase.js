import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB-xqnpjE82VmL76okn6VaklNmfn8O3Hi4",
  authDomain: "brandpulse-38830.firebaseapp.com",
  projectId: "brandpulse-38830",
  storageBucket: "brandpulse-38830.firebasestorage.app",
  messagingSenderId: "89079649163",
  appId: "1:89079649163:web:eb2cf33e25295ace7b958e",
  measurementId: "G-CJFYQ2SK81",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();