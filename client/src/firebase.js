// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, GoogleAuthProvider } from "firebase/auth"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "siteforage-ab6f8.firebaseapp.com",
  projectId: "siteforage-ab6f8",
  storageBucket: "siteforage-ab6f8.firebasestorage.app",
  messagingSenderId: "392662331293",
  appId: "1:392662331293:web:33536bcd0d84a596164974"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export { auth, provider }