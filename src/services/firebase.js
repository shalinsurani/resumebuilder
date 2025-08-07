
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {

  apiKey: "AIzaSyCZgComihR2Wt4I-iVh-oOUv2X1KrSafqM",
  authDomain: "resumebuilder-e7fbd.firebaseapp.com",
  projectId: "resumebuilder-e7fbd",
  storageBucket: "resumebuilder-e7fbd.firebasestorage.app",
  messagingSenderId: "1047447979681",
  appId: "1:1047447979681:web:5b3e141e83ab8bd63852e0",
  measurementId: "G-D72E93M5TF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
