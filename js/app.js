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
  if (name === 'plan'      && localStorage.getItem('fit_plan_enabled')      !== 'true') return;
  if (name === 'progress'  && localStorage.getItem('fit_progress_enabled')  !== 'true') return;
  if (name === currentScreen) {
    if (name === 'home')      renderHome(screens.home, navigateTo);
    if (name === 'plan')      renderPlan(screens.plan);
    if (name === 'nutrition') renderNutrition(screens.nutrition);
    return;
  }

  if (currentScreen) {
    screens[currentScreen].classList.remove('active', 'fade-in');
  }

  const entering = screens[name];
  entering.classList.remove('fade-in');
  entering.classList.add('active');
  void entering.offsetHeight;
  entering.classList.add('fade-in');

  currentScreen = name;

  document.querySelectorAll('.sidebar-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.screen === name);
  });
  if (name === 'home')      renderHome(screens.home, navigateTo);
  if (name === 'plan')      renderPlan(screens.plan);
  if (name === 'workout')   renderWorkout(screens.workout, navigateTo);
  if (name === 'nutrition') renderNutrition(screens.nutrition);
  if (name === 'progress')  renderProgress(screens.progress);
}

document.querySelectorAll('.sidebar-btn').forEach(btn => {
  btn.addEventListener('click', () => navigateTo(btn.dataset.screen));
});

export function applyTabVisibility() {
  const nutriOn    = localStorage.getItem('fit_nutrition_enabled') === 'true';
  const planOn     = localStorage.getItem('fit_plan_enabled')      === 'true';
  const progressOn = localStorage.getItem('fit_progress_enabled')  === 'true';
  document.querySelectorAll('[data-screen="nutrition"]').forEach(el => { el.style.display = nutriOn    ? '' : 'none'; });
  document.querySelectorAll('[data-screen="plan"]').forEach(el =>      { el.style.display = planOn     ? '' : 'none'; });
  document.querySelectorAll('[data-screen="progress"]').forEach(el =>  { el.style.display = progressOn ? '' : 'none'; });
}

applyTabVisibility();

// ── Settings sheet ────────────────────────────────────────
function openSettings() {
  if (document.getElementById('settings-sheet')) return;

  const planOn     = localStorage.getItem('fit_plan_enabled')     === 'true';
  const progressOn = localStorage.getItem('fit_progress_enabled') === 'true';
  const nutriOn    = localStorage.getItem('fit_nutrition_enabled') === 'true';
  const unit = (() => {
    try { return JSON.parse(localStorage.getItem('fit_settings') ?? '{}').weightUnit ?? 'kg'; } catch { return 'kg'; }
  })();

  const sheet = document.createElement('div');
  sheet.id = 'settings-sheet';
  sheet.className = 'settings-sheet';
  sheet.innerHTML = `
    <div class="settings-backdrop"></div>
    <div class="settings-panel">
      <div class="settings-panel-hdr">
        <span class="settings-panel-title">Settings</span>
        <button class="settings-done-btn">Done</button>
      </div>
      <div class="settings-body">
        <div class="settings-section-label">Sections</div>
        <label class="settings-row">
          <span class="settings-row-label">Plan</span>
          <div class="ios-toggle"><input type="checkbox" id="stg-plan" ${planOn ? 'checked' : ''}><span class="ios-track"></span></div>
        </label>
        <label class="settings-row">
          <span class="settings-row-label">Progress</span>
          <div class="ios-toggle"><input type="checkbox" id="stg-progress" ${progressOn ? 'checked' : ''}><span class="ios-track"></span></div>
        </label>
        <label class="settings-row">
          <span class="settings-row-label">Nutrition</span>
          <div class="ios-toggle"><input type="checkbox" id="stg-nutrition" ${nutriOn ? 'checked' : ''}><span class="ios-track"></span></div>
        </label>
        <div class="settings-section-label">Units</div>
        <div class="settings-row">
          <span class="settings-row-label">Weight</span>
          <div class="unit-seg">
            <button class="unit-seg-btn ${unit === 'kg' ? 'active' : ''}" data-unit="kg">kg</button>
            <button class="unit-seg-btn ${unit === 'lbs' ? 'active' : ''}" data-unit="lbs">lbs</button>
          </div>
        </div>
        <a href="./admin.html" class="settings-admin-link">Admin Dashboard →</a>
      </div>
    </div>
  `;
  document.body.appendChild(sheet);
  requestAnimationFrame(() => sheet.classList.add('open'));

  sheet.querySelector('.settings-backdrop').addEventListener('click', closeSettings);
  sheet.querySelector('.settings-done-btn').addEventListener('click', closeSettings);

  ['plan', 'progress', 'nutrition'].forEach(name => {
    const el = sheet.querySelector(`#stg-${name}`);
    if (!el) return;
    el.addEventListener('change', () => {
      const key = name === 'nutrition' ? 'fit_nutrition_enabled' : `fit_${name}_enabled`;
      localStorage.setItem(key, el.checked ? 'true' : 'false');
      applyTabVisibility();
      if (currentScreen === 'home') renderHome(screens.home, navigateTo);
    });
  });

  sheet.querySelectorAll('.unit-seg-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sheet.querySelectorAll('.unit-seg-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      let cfg = {};
      try { cfg = JSON.parse(localStorage.getItem('fit_settings') ?? '{}'); } catch {}
      cfg.weightUnit = btn.dataset.unit;
      localStorage.setItem('fit_settings', JSON.stringify(cfg));
    });
  });
}

function closeSettings() {
  const sheet = document.getElementById('settings-sheet');
  if (!sheet) return;
  sheet.classList.remove('open');
  setTimeout(() => sheet?.remove(), 340);
}

document.getElementById('cogwheel-btn')?.addEventListener('click', openSettings);

navigateTo('home');

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', e => {
    if (e.data?.type === 'SW_UPDATED') window.location.reload();
  });
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}
