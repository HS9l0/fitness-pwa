import { auth, db } from './firebase.js';
import {
  signInWithPopup, GoogleAuthProvider, signOut
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import {
  collection, doc, setDoc, getDocs, onSnapshot
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const KEYS = { sessions: 'fit_sessions', water: 'fit_water' };

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
}

export async function signOutUser() {
  return signOut(auth);
}

export async function pullFromFirestore(uid) {
  const [sessionsSnap, waterSnap] = await Promise.all([
    getDocs(collection(db, 'users', uid, 'sessions')),
    getDocs(collection(db, 'users', uid, 'water'))
  ]);

  const sessions = [];
  sessionsSnap.forEach(d => sessions.push(d.data()));
  sessions.sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));
  localStorage.setItem(KEYS.sessions, JSON.stringify(sessions));

  const water = {};
  waterSnap.forEach(d => { water[d.id] = d.data().ml ?? 0; });
  localStorage.setItem(KEYS.water, JSON.stringify(water));
}

export function pushSession(uid, session) {
  const id = `${session.date}-${session.day}`;
  setDoc(doc(db, 'users', uid, 'sessions', id), session).catch(() => {});
}

export function pushWater(uid, date, ml) {
  setDoc(doc(db, 'users', uid, 'water', date), { ml }).catch(() => {});
}

let unsubSessions = null;
let unsubWater = null;

export function startListeners(uid, onUpdate) {
  stopListeners();

  unsubSessions = onSnapshot(collection(db, 'users', uid, 'sessions'), snap => {
    const sessions = [];
    snap.forEach(d => sessions.push(d.data()));
    sessions.sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));
    localStorage.setItem(KEYS.sessions, JSON.stringify(sessions));
    onUpdate();
  });

  unsubWater = onSnapshot(collection(db, 'users', uid, 'water'), snap => {
    const water = {};
    snap.forEach(d => { water[d.id] = d.data().ml ?? 0; });
    localStorage.setItem(KEYS.water, JSON.stringify(water));
    onUpdate();
  });
}

export function stopListeners() {
  if (unsubSessions) { unsubSessions(); unsubSessions = null; }
  if (unsubWater) { unsubWater(); unsubWater = null; }
}
