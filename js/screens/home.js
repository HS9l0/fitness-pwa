import { WORKOUTS, getNextWorkoutDay } from '../data.js';
import { getSessions, getWater, addWater, getSettings, today } from '../store.js';
import { signOutUser, stopListeners } from '../sync.js';

function isIos() { return /iphone|ipad|ipod/i.test(navigator.userAgent); }
function isInStandaloneMode() {
  return window.matchMedia('(display-mode: standalone)').matches || !!window.navigator.standalone;
}

export function renderHome(container, navigate) {
  const sessions = getSessions();
  const settings = getSettings();
  const todayStr = today();
  const waterMl = getWater(todayStr);
  const goal = settings.waterGoalMl;
  const nextDay = getNextWorkoutDay(sessions);
  const workout = WORKOUTS[nextDay - 1];

  const dow = new Date().getDay();
  const workoutDays = { 1: 1, 3: 2, 5: 3 };
  const todayWorkoutDay = workoutDays[dow];

  const streakDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 6 + i);
    return d.toISOString().slice(0, 10);
  });
  const sessionDates = new Set(sessions.map(s => s.date));
  const pct = Math.min(100, (waterMl / goal) * 100);

  container.innerHTML = `
    <div class="screen-header">
      <div class="badge">Beginner · 3×/week</div>
      <h1>Train Hard.<br/><span style="color:var(--accent)">Stay Consistent.</span></h1>
      <p>Age 15 · Split Training Program</p>
    </div>

    <div class="section">
      <div class="home-grid">
        <div>
          <div class="section-title">Next Up</div>
          ${todayWorkoutDay
            ? `<div class="card next-workout-card">
                <div class="next-day-label">${workout.weekday}</div>
                <div class="next-day-title">${workout.label}</div>
                <div class="next-day-focus">${workout.focus}</div>
                <div class="next-day-meta">
                  <div class="next-meta-item">⏱ <span>~${workout.durationMin}</span> min</div>
                  <div class="next-meta-item">🏋️ <span>${workout.exercises.length}</span> exercises</div>
                </div>
                <button class="btn-primary" id="start-workout-btn">Start Workout →</button>
              </div>`
            : `<div class="card rest-day-card">
                <div class="rest-icon">🧘</div>
                <h3>Rest Day</h3>
                <p>Walk, stretch, or fully recover.<br/>Muscles grow during rest.</p>
                <div style="margin-top:16px">
                  <button class="btn-primary" id="start-workout-btn"
                    style="background:var(--surface-raised);color:var(--text-muted);border:1px solid var(--border)">
                    Do ${workout.label} anyway →
                  </button>
                </div>
              </div>`
          }

          <div class="section-title" style="margin-top:20px">This Week</div>
          <div class="card">
            <div class="streak-row">
              ${streakDays.map(dateStr => {
                const d = new Date(dateStr + 'T12:00:00');
                const label = ['Su','Mo','Tu','We','Th','Fr','Sa'][d.getDay()];
                const done = sessionDates.has(dateStr);
                const isToday = dateStr === todayStr;
                return `<div class="streak-dot ${done ? 'done' : ''} ${isToday && !done ? 'today' : ''}">
                  <div class="dot">${done ? '✓' : d.getDate()}</div>
                  <div class="day-lbl">${label}</div>
                </div>`;
              }).join('')}
            </div>
          </div>
        </div>

        <div>
          <div class="section-title">Water Intake</div>
          <div class="card">
            <div class="water-label">
              <span>💧 ${waterMl} ml</span>
              <span style="color:${waterMl >= goal ? 'var(--accent)' : 'var(--text-muted)'}">
                ${waterMl >= goal ? '✓ Goal reached!' : `Goal: ${goal} ml`}
              </span>
            </div>
            <div class="water-bar-wrap">
              <div class="water-bar-bg">
                <div class="water-bar-fill" style="width:${pct}%"></div>
              </div>
            </div>
            <div class="water-btns">
              <button class="water-btn" data-ml="250">+ 250 ml 🥤</button>
              <button class="water-btn" data-ml="500">+ 500 ml 💧</button>
              <button class="water-btn" data-ml="-250" style="color:var(--text-dim);font-size:1rem">−</button>
            </div>
          </div>

          <div class="section-title" style="margin-top:20px">Account</div>
          <div class="card" style="display:flex;align-items:center;justify-content:space-between;gap:12px">
            <div style="font-size:0.82rem;color:var(--text-muted)">☁️ Syncing to Firebase</div>
            <button id="mobile-signout-btn"
              style="font-size:0.78rem;color:var(--text-dim);padding:6px 12px;
              border:1px solid var(--border);border-radius:6px;white-space:nowrap;flex-shrink:0">
              Sign out
            </button>
          </div>

          ${isIos() && !isInStandaloneMode() ? `
            <div class="card" style="margin-top:12px;border-color:var(--accent-blue);background:rgba(61,142,248,0.06)">
              <div style="font-size:0.78rem;font-weight:700;color:var(--accent-blue);margin-bottom:6px">📱 Install on iPhone</div>
              <div style="font-size:0.78rem;color:var(--text-muted);line-height:1.6">
                Tap <strong style="color:var(--text)">Share</strong> → <strong style="color:var(--text)">"Add to Home Screen"</strong>
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;

  container.querySelector('#start-workout-btn')?.addEventListener('click', () => navigate('workout'));

  container.querySelectorAll('.water-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      addWater(todayStr, parseInt(btn.dataset.ml));
      renderHome(container, navigate);
    });
  });

  document.getElementById('mobile-signout-btn')?.addEventListener('click', async () => {
    stopListeners();
    await signOutUser();
  });
}
