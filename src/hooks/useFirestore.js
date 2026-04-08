import { useEffect, useRef } from 'react';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

// Sync helpers: localStorage first (instant), Firestore in background

export function useFirestoreSync(uid) {
  const syncedRef = useRef(false);

  // Load all workout logs from Firestore on first mount
  useEffect(() => {
    if (!uid || syncedRef.current) return;
    syncedRef.current = true;

    // Sync workout log
    syncCollection(uid, 'workoutLog', 'workout_log');
    // Sync body weight
    syncCollection(uid, 'bodyWeight', 'body_weight_log');
    // Sync daily state
    syncDoc(uid, 'dailyState', 'plan_fitness_v1');
  }, [uid]);
}

async function syncCollection(uid, firestoreCollection, localStorageKey) {
  try {
    const colRef = collection(db, 'users', uid, firestoreCollection);
    const snap = await getDocs(colRef);
    if (snap.empty) return;

    const local = safeParseJSON(localStorage.getItem(localStorageKey)) || {};
    let merged = { ...local };
    snap.forEach(d => {
      const key = d.id;
      if (!merged[key]) merged[key] = d.data();
    });
    localStorage.setItem(localStorageKey, JSON.stringify(merged));
  } catch {}
}

async function syncDoc(uid, firestoreDoc, localStorageKey) {
  try {
    const docRef = doc(db, 'users', uid, firestoreDoc, 'current');
    const snap = await getDoc(docRef);
    if (!snap.exists()) return;

    const local = safeParseJSON(localStorage.getItem(localStorageKey));
    const remote = snap.data();
    // Remote wins if local is stale (different date or missing)
    if (!local || local.date !== remote.date) {
      localStorage.setItem(localStorageKey, JSON.stringify(remote));
    }
  } catch {}
}

// Save functions that write to both localStorage and Firestore

export function saveToFirestore(uid, firestoreCollection, key, data) {
  if (!uid) return;
  try {
    const docRef = doc(db, 'users', uid, firestoreCollection, key);
    setDoc(docRef, data, { merge: true }).catch(() => {});
  } catch {}
}

export function saveDailyState(uid, data) {
  if (!uid) return;
  try {
    const docRef = doc(db, 'users', uid, 'dailyState', 'current');
    setDoc(docRef, data, { merge: true }).catch(() => {});
  } catch {}
}

function safeParseJSON(str) {
  try { return JSON.parse(str); } catch { return null; }
}
