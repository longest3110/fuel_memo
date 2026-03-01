import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import {
  getFirestore,
  Firestore,
  collection,
  addDoc,
  setDoc,
  doc,
  query,
  where,
  getDocs,
  orderBy,
  deleteDoc,
  limit,
} from 'firebase/firestore';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
};

// Initialize Firebase (singleton pattern)
let firebaseApp: FirebaseApp;
let auth: Auth;
let firestoreDb: Firestore;

if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApps()[0];
}

auth = getAuth(firebaseApp);
firestoreDb = getFirestore(firebaseApp, 'fuel-memo');

export {
  firebaseApp,
  auth,
  firestoreDb,
  collection,
  addDoc,
  setDoc,
  doc,
  query,
  where,
  getDocs,
  orderBy,
  deleteDoc,
  limit,
};
