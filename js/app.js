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
  if (name === 'plan'      && localStorage.getItem('fit_plan_enabled')      === 'false') return;
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
    screens[currentScreen].classList.remove('active', 'fade-in');
  }

  const entering = screens[name];
  entering.classList.remove('fade-in');
  entering.classList.add('active');
  void entering.offsetHeight;
  entering.classList.add('fade-in');

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

const nutriOn    = localStorage.getItem('fit_nutrition_enabled') === 'true';
const planOn     = localStorage.getItem('fit_plan_enabled')      !== 'false';
const progressOn = localStorage.getItem('fit_progress_enabled')  !== 'false';

document.querySelectorAll('[data-screen="nutrition"]').forEach(el => { el.style.display = nutriOn    ? '' : 'none'; });
document.querySelectorAll('[data-screen="plan"]').forEach(el =>      { el.style.display = planOn     ? '' : 'none'; });
document.querySelectorAll('[data-screen="progress"]').forEach(el =>  { el.style.display = progressOn ? '' : 'none'; });

navigateTo('home');

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', e => {
    if (e.data?.type === 'SW_UPDATED') window.location.reload();
  });
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}
