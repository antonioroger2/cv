import { initializeApp, getApps, FirebaseApp, FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFirestore as getFirestoreLite } from 'firebase/firestore/lite';
import { getStorage } from 'firebase/storage';

// Firebase configuration - only expose necessary public values
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Singleton pattern to ensure Firebase is only initialized once
function getFirebaseApp(): FirebaseApp {
  const existingApp = getApps();
  if (existingApp.length > 0) {
    return existingApp[0];
  }

  // Validate required configuration
  const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
  const missingKeys = requiredKeys.filter(key => !firebaseConfig[key as keyof FirebaseOptions]);
  
  if (missingKeys.length > 0) {
    console.error(`Missing Firebase configuration: ${missingKeys.join(', ')}`);
    throw new Error(`Firebase configuration is incomplete. Missing: ${missingKeys.join(', ')}. Check your environment variables.`);
  }

  return initializeApp(firebaseConfig);
}

// Initialize and export services
const app = getFirebaseApp();
const auth = getAuth(app);
const db = getFirestore(app);
const dbLite = getFirestoreLite(app);
const storage = getStorage(app);

export { app, auth, db, dbLite, storage };

// Export only the necessary public config for client-side use
export const publicFirebaseConfig = {
  apiKey: firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
};