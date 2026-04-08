import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';

// TODO: Reemplaza con tu config de Firebase Console
// https://console.firebase.google.com → Tu proyecto → Configuracion → Web app
const firebaseConfig = {
  apiKey: "AIzaSyDEMO_REPLACE_ME",
  authDomain: "plan-fitness-REPLACE.firebaseapp.com",
  projectId: "plan-fitness-REPLACE",
  storageBucket: "plan-fitness-REPLACE.firebasestorage.app",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:000000000000000000"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Firestore con cache offline persistente
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
});
