import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyCsBaVWbFxxqM4_jZNJqZdTutl7GmHUa5U",
  authDomain: "fitness-pwa-5af52.firebaseapp.com",
  projectId: "fitness-pwa-5af52",
  storageBucket: "fitness-pwa-5af52.firebasestorage.app",
  messagingSenderId: "742928543173",
  appId: "1:742928543173:web:39bd651da414f6e7d2efac"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
