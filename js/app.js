import { renderHome } from './screens/home.js';
import { renderPlan } from './screens/plan.js';
import { renderWorkout } from './screens/workout.js';
import { renderHistory } from './screens/history.js';

const screens = {
  home: document.getElementById('screen-home'),
  workout: document.getElementById('screen-workout'),
  history: document.getElementById('screen-history'),
  plan: document.getElementById('screen-plan')
};

const navBtns = document.querySelectorAll('.nav-btn');

export function navigateTo(name) {
  Object.entries(screens).forEach(([key, el]) => {
    el.classList.toggle('active', key === name);
  });
  navBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.screen === name);
  });
  if (name === 'home') renderHome(screens.home, navigateTo);
  if (name === 'plan') renderPlan(screens.plan);
  if (name === 'history') renderHistory(screens.history);
  if (name === 'workout') renderWorkout(screens.workout, navigateTo);
}

navBtns.forEach(btn => {
  btn.addEventListener('click', () => navigateTo(btn.dataset.screen));
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}

navigateTo('home');
