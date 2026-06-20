import { renderHome } from './screens/home.js';
import { renderPlan } from './screens/plan.js';
import { renderWorkout } from './screens/workout.js';
import { renderHistory } from './screens/history.js';
import { renderNutrition } from './screens/nutrition.js';
import { auth } from './firebase.js';
import { signInWithGoogle, signOutUser, pullFromFirestore, startListeners, stopListeners, saveUserProfile } from './sync.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

const BASE_ADMINS = ['lusi.genova@gmail.com', 'ranov.insta@gmail.com'];
function getAdminEmails() {
  try {
    const s = JSON.parse(localStorage.getItem('fit_admin_emails') ?? 'null');
    return Array.isArray(s) && s.length ? s : BASE_ADMINS;
  } catch { return BASE_ADMINS; }
}

const screens = {
  home:      document.getElementById('screen-home'),
  workout:   document.getElementById('screen-workout'),
  history:   document.getElementById('screen-history'),
  plan:      document.getElementById('screen-plan'),
  nutrition: document.getElementById('screen-nutrition')
};

const signinScreen = document.getElementById('signin-screen');
const appEl = document.getElementById('app');

const SCREEN_ORDER = ['home', 'workout', 'history', 'plan', 'nutrition'];
let currentScreen = null;

export function navigateTo(name) {
  // Firestore-triggered re-render — no animation, just refresh content
  if (name === currentScreen) {
    if (name === 'home')      renderHome(screens.home, navigateTo);
    if (name === 'plan')      renderPlan(screens.plan);
    if (name === 'history')   renderHistory(screens.history);
    if (name === 'nutrition') renderNutrition(screens.nutrition);
    return;
  }

  const fromIdx = SCREEN_ORDER.indexOf(currentScreen ?? 'home');
  const toIdx = SCREEN_ORDER.indexOf(name);
  const isForward = toIdx >= fromIdx;

  // Fade out the leaving screen
  if (currentScreen) {
    const leaving = screens[currentScreen];
    leaving.classList.add('leaving');
    setTimeout(() => leaving.classList.remove('active', 'leaving'), 260);
  }

  // Slide in the entering screen (force reflow so animation replays cleanly)
  const entering = screens[name];
  entering.classList.remove('slide-right', 'slide-left', 'leaving');
  void entering.offsetHeight;
  entering.classList.add('active', isForward ? 'slide-right' : 'slide-left');

  currentScreen = name;

  document.querySelectorAll('.nav-btn, .sidebar-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.screen === name);
  });
  if (name === 'home')      renderHome(screens.home, navigateTo);
  if (name === 'plan')      renderPlan(screens.plan);
  if (name === 'history')   renderHistory(screens.history);
  if (name === 'workout')   renderWorkout(screens.workout, navigateTo);
  if (name === 'nutrition') renderNutrition(screens.nutrition);
}

// Wire nav buttons (bottom nav + sidebar)
document.querySelectorAll('.nav-btn, .sidebar-btn').forEach(btn => {
  btn.addEventListener('click', () => navigateTo(btn.dataset.screen));
});

// Sign-in buttons
function rememberChecked() { return document.getElementById('remember-me')?.checked ?? true; }

document.getElementById('google-signin-btn')?.addEventListener('click', () => {
  signInWithGoogle(rememberChecked()).catch(err => console.error('Sign in failed:', err));
});
document.getElementById('staff-login-btn')?.addEventListener('click', () => {
  sessionStorage.setItem('loginMode', 'staff');
  signInWithGoogle(rememberChecked()).catch(err => console.error('Staff sign in failed:', err));
});

// Auth state — main entry point
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const loginMode = sessionStorage.getItem('loginMode');
    sessionStorage.removeItem('loginMode');
    if (loginMode === 'staff' && getAdminEmails().includes(user.email)) {
      window.location.href = './admin.html';
      return;
    }
    signinScreen.style.display = 'none';
    appEl.style.display = 'flex';
    updateSidebarUser(user);
    saveUserProfile(user.uid, user);
    try {
      await pullFromFirestore(user.uid);
    } catch {
      // Offline — localStorage already has data, continue
    }
    navigateTo('home');
    startListeners(user.uid, () => {
      // Re-render active screen on remote data change; skip workout to avoid wiping in-progress session
      const active = Object.entries(screens).find(([, el]) => el.classList.contains('active'))?.[0];
      if (active && active !== 'workout') navigateTo(active);
    });
  } else {
    stopListeners();
    signinScreen.style.display = 'flex';
    appEl.style.display = 'none';
  }
});

function updateSidebarUser(user) {
  const el = document.getElementById('sidebar-user');
  if (!el) return;
  el.innerHTML = `
    <img src="${user.photoURL ?? ''}" alt=""
      style="width:32px;height:32px;border-radius:50%;background:var(--surface-raised);flex-shrink:0"
      onerror="this.style.display='none'">
    <div style="flex:1;min-width:0">
      <div style="font-size:0.78rem;font-weight:600;color:var(--text);
        white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${user.displayName ?? 'User'}</div>
      <div style="font-size:0.65rem;color:var(--text-dim);
        white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${user.email ?? ''}</div>
    </div>
    <button id="sidebar-signout-btn" title="Sign out"
      style="color:var(--text-dim);font-size:0.7rem;padding:4px 8px;
      border:1px solid var(--border);border-radius:6px;white-space:nowrap;flex-shrink:0">
      Out
    </button>
  `;
  document.getElementById('sidebar-signout-btn')?.addEventListener('click', async () => {
    stopListeners();
    await signOutUser();
  });
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}
