import { renderHome }    from './screens/home.js';
import { renderWorkout } from './screens/workout.js';
import { getSessions, getSettings, saveSettings } from './store.js';

const screens = {
  home:    document.getElementById('screen-home'),
  workout: document.getElementById('screen-workout'),
};

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

  const cogwheel = document.getElementById('cogwheel-btn');
  if (cogwheel) cogwheel.style.display = name === 'workout' ? 'none' : '';

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

  const cfg = getSettings();
  const unit     = cfg.weightUnit ?? 'kg';
  const testMode = cfg.testMode   ?? false;
  const testDay  = cfg.testDay    ?? 1;

  const sessions   = getSessions();
  const now        = new Date();
  const DAY_NAMES  = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const MONTH_ABBR = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const realDayLabel = `${DAY_NAMES[now.getDay()]}, ${now.getDate()} ${MONTH_ABBR[now.getMonth()]}`;

  // Sessions this week (Mon–Sun)
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  startOfWeek.setHours(0, 0, 0, 0);
  const weekCount = sessions.filter(s => new Date(s.date + 'T12:00:00') >= startOfWeek).length;

  const ICO_CHEVRON = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex-shrink:0"><polyline points="9 18 15 12 9 6"/></svg>`;

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
            <button class="unit-seg-btn ${unit === 'kg'  ? 'active' : ''}" data-unit="kg">kg</button>
            <button class="unit-seg-btn ${unit === 'lbs' ? 'active' : ''}" data-unit="lbs">lbs</button>
          </div>
        </div>

        <div class="settings-section-label" style="margin-top:18px">Developer</div>
        <div class="settings-row">
          <span class="settings-row-label">Test Mode</span>
          <label class="ios-toggle">
            <input type="checkbox" id="test-mode-chk" ${testMode ? 'checked' : ''}>
            <span class="ios-track"></span>
          </label>
        </div>
        <div id="test-day-wrap" style="${testMode ? '' : 'display:none'}">
          <div class="settings-row" style="align-items:center">
            <span class="settings-row-label" style="font-size:0.82rem;color:var(--text-muted)">Test Day</span>
            <div class="unit-seg">
              <button class="unit-seg-btn dev-day-btn ${testDay===1?'active':''}" data-day="1" style="padding:5px 10px;font-size:0.76rem">Day 1</button>
              <button class="unit-seg-btn dev-day-btn ${testDay===2?'active':''}" data-day="2" style="padding:5px 10px;font-size:0.76rem">Day 2</button>
              <button class="unit-seg-btn dev-day-btn ${testDay===3?'active':''}" data-day="3" style="padding:5px 10px;font-size:0.76rem">Day 3</button>
              <button class="unit-seg-btn dev-day-btn ${testDay===0?'active':''}" data-day="0" style="padding:5px 10px;font-size:0.76rem">Rest</button>
            </div>
          </div>
          <div class="settings-row" style="cursor:default">
            <span class="settings-row-label">Version</span>
            <span class="settings-info-val" id="sw-version-display">—</span>
          </div>
          <div class="settings-row" style="cursor:default">
            <span class="settings-row-label">Today</span>
            <span class="settings-info-val">${realDayLabel}</span>
          </div>
          <div class="settings-row" style="cursor:default">
            <span class="settings-row-label">This week</span>
            <span class="settings-info-val">${weekCount} workout${weekCount !== 1 ? 's' : ''}</span>
          </div>
          <div class="settings-row" style="cursor:default">
            <span class="settings-row-label">Total logged</span>
            <span class="settings-info-val">${sessions.length} workout${sessions.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        <a href="./admin.html" class="settings-admin-link" style="margin-top:8px">Admin Dashboard ${ICO_CHEVRON}</a>
      </div>
    </div>
  `;
  document.body.appendChild(sheet);
  requestAnimationFrame(() => sheet.classList.add('open'));

  // Fetch version from active service worker
  if (navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'GET_VERSION' });
    const versionHandler = e => {
      if (e.data?.type === 'VERSION') {
        const el = sheet.querySelector('#sw-version-display');
        if (el) el.textContent = e.data.version;
        navigator.serviceWorker.removeEventListener('message', versionHandler);
      }
    };
    navigator.serviceWorker.addEventListener('message', versionHandler);
  } else {
    const el = sheet.querySelector('#sw-version-display');
    if (el) el.textContent = 'no SW active';
  }

  sheet.querySelector('.settings-backdrop').addEventListener('click', closeSettings);
  sheet.querySelector('.settings-done-btn').addEventListener('click', closeSettings);

  // Weight unit toggle
  sheet.querySelectorAll('.unit-seg-btn[data-unit]').forEach(btn => {
    btn.addEventListener('click', () => {
      sheet.querySelectorAll('.unit-seg-btn[data-unit]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      saveSettings({ weightUnit: btn.dataset.unit });
    });
  });

  // Test mode toggle
  sheet.querySelector('#test-mode-chk').addEventListener('change', e => {
    saveSettings({ testMode: e.target.checked });
    sheet.querySelector('#test-day-wrap').style.display = e.target.checked ? '' : 'none';
    renderHome(screens.home, navigateTo); // re-render home immediately
  });

  // Test day picker
  sheet.querySelectorAll('.dev-day-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sheet.querySelectorAll('.dev-day-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      saveSettings({ testDay: parseInt(btn.dataset.day, 10) });
      renderHome(screens.home, navigateTo); // re-render home immediately
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
