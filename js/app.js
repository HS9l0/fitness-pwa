import { renderHome } from './screens/home.js';
import { renderPlan } from './screens/plan.js';
import { renderWorkout } from './screens/workout.js';
import { renderNutrition } from './screens/nutrition.js';
import { renderProgress  } from './screens/progress.js';

const screens = {
  home:      document.getElementById('screen-home'),
  workout:   document.getElementById('screen-workout'),
  plan:      document.getElementById('screen-plan'),
  nutrition: document.getElementById('screen-nutrition'),
  progress:  document.getElementById('screen-progress')
};

const SCREEN_ORDER = ['home', 'workout', 'plan', 'nutrition', 'progress'];
let currentScreen = null;

export function navigateTo(name) {
  if (name === 'nutrition' && localStorage.getItem('fit_nutrition_enabled') !== 'true') return;
  if (name === 'progress'  && localStorage.getItem('fit_progress_enabled')  === 'false') return;
  if (name === currentScreen) {
    if (name === 'home')      renderHome(screens.home, navigateTo);
    if (name === 'plan')      renderPlan(screens.plan);
    if (name === 'nutrition') renderNutrition(screens.nutrition);
    return;
  }

  const fromIdx = SCREEN_ORDER.indexOf(currentScreen ?? 'home');
  const toIdx   = SCREEN_ORDER.indexOf(name);
  const isForward = toIdx >= fromIdx;

  if (currentScreen) {
    const leaving = screens[currentScreen];
    leaving.classList.remove('slide-right', 'slide-left');
    leaving.classList.add('leaving');
    setTimeout(() => leaving.classList.remove('active', 'leaving'), 260);
  }

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
  if (name === 'workout')   renderWorkout(screens.workout, navigateTo);
  if (name === 'nutrition') renderNutrition(screens.nutrition);
  if (name === 'progress')  renderProgress(screens.progress);
}

document.querySelectorAll('.nav-btn, .sidebar-btn').forEach(btn => {
  btn.addEventListener('click', () => navigateTo(btn.dataset.screen));
});

const nutriOn = localStorage.getItem('fit_nutrition_enabled') === 'true';
document.querySelectorAll('[data-screen="nutrition"]').forEach(el => {
  el.style.display = nutriOn ? '' : 'none';
});

navigateTo('home');

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', e => {
    if (e.data?.type === 'SW_UPDATED') window.location.reload();
  });
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}
