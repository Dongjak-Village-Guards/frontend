import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDwg50EEYXYhsqeW42BcQOBOAlFQK1_LYU",
  authDomain: "dongjak-village-guards.firebaseapp.com",
  projectId: "dongjak-village-guards",
  storageBucket: "dongjak-village-guards.firebasestorage.app",
  messagingSenderId: "900539435014",
  appId: "1:900539435014:web:4495d55080dd31e4c5db87",
  measurementId: "G-RSM60L1NCX"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export default app;