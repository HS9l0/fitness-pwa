import { renderHome }    from './screens/home.js';
import { renderWorkout } from './screens/workout.js';

const screens = {
  home:    document.getElementById('screen-home'),
  workout: document.getElementById('screen-workout'),
};

const SCREEN_ORDER = ['home', 'workout'];
let currentScreen = null;

export function navigateTo(name) {
  if (name === currentScreen) {
    if (name === 'home') renderHome(screens.home, navigateTo);
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
  if (name === 'home')    renderHome(screens.home, navigateTo);
  if (name === 'workout') renderWorkout(screens.workout, navigateTo);
}

document.querySelectorAll('.sidebar-btn').forEach(btn => {
  btn.addEventListener('click', () => navigateTo(btn.dataset.screen));
});

// ── Settings sheet ────────────────────────────────────────
function openSettings() {
  if (document.getElementById('settings-sheet')) return;

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
