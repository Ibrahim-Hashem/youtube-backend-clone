// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAAP9L0wxr8BppWYbTXIbVzbDgfmjNwrZY",
  authDomain: "yt-clone-7fa36.firebaseapp.com",
  projectId: "yt-clone-7fa36",
  storageBucket: "yt-clone-7fa36.appspot.com",
  messagingSenderId: "1074125671801",
  appId: "1:1074125671801:web:8c582d74392502b425b3a8",
  measurementId: "G-ZCG2WL9B7E",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/**
 * Signs the user in with a google popup
 * @returns The user object credentials
 */
export function signInWithGoogle() {
  return signInWithPopup(auth, new GoogleAuthProvider());
}

/**
 * Signs the User out
 * @returns A promise that resolves when the user is signed out
 */
export function signOut() {
  return auth.signOut();
}

/**
 * Triggers a callback when user auth state changes.
 * @returns A function to unsubscribe from the callback
 */
export function onAuthStateChangedHelper(
  callback: (user: User | null) => void,
) {
  return onAuthStateChanged(auth, callback);
}
