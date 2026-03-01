import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
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
const firebaseApp = getApps().length
  ? getApps()[0]
  : initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const firestoreDb = getFirestore(firebaseApp, 'fuel-memo');

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
