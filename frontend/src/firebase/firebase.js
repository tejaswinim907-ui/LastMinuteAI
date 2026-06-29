import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCXJWgza6DoTebnJ7IJcsqPfm79pxaYPBQ",
  authDomain: "lastminute-ai-c3e4a.firebaseapp.com",
  projectId: "lastminute-ai-c3e4a",
  storageBucket: "lastminute-ai-c3e4a.firebasestorage.app",
  messagingSenderId: "923145143251",
  appId: "1:923145143251:web:da184030c99d8b97656526",
  measurementId: "G-E165V4JRHN"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);