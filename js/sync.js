import { auth, db } from './firebase.js';
import {
  signInWithPopup, GoogleAuthProvider, signOut,
  setPersistence, browserLocalPersistence, browserSessionPersistence
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import {
  collection, doc, setDoc, getDoc, getDocs, onSnapshot
} from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const KEYS = { sessions: 'fit_sessions', water: 'fit_water' };

export async function signInWithGoogle(remember = true) {
  await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
  return signInWithPopup(auth, new GoogleAuthProvider());
}

export async function signOutUser() {
  return signOut(auth);
}

export async function pullFromFirestore(uid) {
  const [profileSnap, sessionsSnap, waterSnap] = await Promise.all([
    getDoc(doc(db, 'users', uid)),
    getDocs(collection(db, 'users', uid, 'sessions')),
    getDocs(collection(db, 'users', uid, 'water'))
  ]);

  const profile = profileSnap.data();
  if (profile?.geminiKey) {
    localStorage.setItem('fit_gemini_key', profile.geminiKey);
  }
  if (profile?.nutritionEnabled !== undefined)
    localStorage.setItem('fit_nutrition_enabled', profile.nutritionEnabled ? 'true' : 'false');
  if (profile?.planEnabled !== undefined)
    localStorage.setItem('fit_plan_enabled',      profile.planEnabled      ? 'true' : 'false');
  if (profile?.progressEnabled !== undefined)
    localStorage.setItem('fit_progress_enabled',  profile.progressEnabled  ? 'true' : 'false');
  // Sync goal settings from Firestore into fit_settings
  const goalFields = ['calorieGoalKcal', 'proteinGoalG', 'fatGoalG', 'waterGoalMl', 'weightUnit'];
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

export function saveUserProfile(uid, user) {
  setDoc(doc(db, 'users', uid), {
    email: user.email ?? '',
    displayName: user.displayName ?? '',
    photoURL: user.photoURL ?? '',
    lastSeen: new Date().toISOString()
  }, { merge: true }).catch(() => {});
}
