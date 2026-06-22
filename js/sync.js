import { auth, db } from './firebase.js';
import {
  signInWithPopup, GoogleAuthProvider, signOut,
  setPersistence, browserLocalPersistence, browserSessionPersistence
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import {
  collection, doc, setDoc, getDoc, getDocs, onSnapshot
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const KEYS = { sessions: 'fit_sessions' };

export async function signInWithGoogle(remember = true) {
  await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
  return signInWithPopup(auth, new GoogleAuthProvider());
}

export async function signOutUser() {
  return signOut(auth);
}

export async function pullFromFirestore(uid) {
  const [profileSnap, sessionsSnap] = await Promise.all([
    getDoc(doc(db, 'users', uid)),
    getDocs(collection(db, 'users', uid, 'sessions')),
  ]);

  const profile = profileSnap.data();
  const goalFields = ['weightUnit'];
  if (goalFields.some(f => profile?.[f] !== undefined)) {
    let cfg = {};
    try { cfg = JSON.parse(localStorage.getItem('fit_settings') ?? '{}'); } catch {}
    goalFields.forEach(f => { if (profile[f] !== undefined) cfg[f] = profile[f]; });
    localStorage.setItem('fit_settings', JSON.stringify(cfg));
  }

  const sessions = [];
  sessionsSnap.forEach(d => sessions.push(d.data()));
  sessions.sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));
  localStorage.setItem(KEYS.sessions, JSON.stringify(sessions));
}

export function pushSession(uid, session) {
  const id = `${session.date}-${session.day}`;
  setDoc(doc(db, 'users', uid, 'sessions', id), session).catch(() => {});
}

let unsubSessions = null;

export function startListeners(uid, onUpdate) {
  stopListeners();
  unsubSessions = onSnapshot(collection(db, 'users', uid, 'sessions'), snap => {
    const sessions = [];
    snap.forEach(d => sessions.push(d.data()));
    sessions.sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));
    localStorage.setItem(KEYS.sessions, JSON.stringify(sessions));
    onUpdate();
  });
}

export function stopListeners() {
  if (unsubSessions) { unsubSessions(); unsubSessions = null; }
}

export function saveUserProfile(uid, user) {
  setDoc(doc(db, 'users', uid), {
    email: user.email ?? '',
    displayName: user.displayName ?? '',
    photoURL: user.photoURL ?? '',
    lastSeen: new Date().toISOString()
  }, { merge: true }).catch(() => {});
}
