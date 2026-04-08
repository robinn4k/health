import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCjDMWH_-J58H2dqrbq4E4kqx4NzB9qLIw",
  authDomain: "health-8976e.firebaseapp.com",
  projectId: "health-8976e",
  storageBucket: "health-8976e.firebasestorage.app",
  messagingSenderId: "110483247170",
  appId: "1:110483247170:web:d7e483affd053b5ff59ddb",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Firestore con cache offline persistente
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
});
