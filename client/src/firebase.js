// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "anny-realestate.firebaseapp.com",
  projectId: "anny-realestate",
  storageBucket: "anny-realestate.appspot.com",
  messagingSenderId: "872882537582",
  appId: "1:872882537582:web:c40dd55e651f58931b127f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);