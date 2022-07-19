import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDWBS07iB2h3YD-Cpyy9DMnVtz9dhJREZw",
  authDomain: "house-marketplace-app-e3436.firebaseapp.com",
  projectId: "house-marketplace-app-e3436",
  storageBucket: "house-marketplace-app-e3436.appspot.com",
  messagingSenderId: "450906538499",
  appId: "1:450906538499:web:12e9bd1851c8403da0c436"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore()