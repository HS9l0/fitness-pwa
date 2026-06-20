import { WORKOUTS, getNextWorkoutDay } from '../data.js';
import { getSessions, getWater, addWater, getSettings, today } from '../store.js';
import { signOutUser, stopListeners } from '../sync.js';

const QUOTES = [
  "Every rep is a promise to your future self.",
  "Discipline is doing it when you don't feel like it.",
  "Consistency beats perfection every single time.",
  "Strong is a skill. Train it daily.",
  "You're one workout away from a good mood.",
  "Show up. That's 80% of the battle.",
  "Soreness today, strength tomorrow.",
  "Progress is progress, no matter how small.",
  "The only bad workout is the one you skipped.",
  "Hard work in the gym builds character outside it.",
  "You don't have to be great to start. Start to be great.",
  "Rest when you must. Quit never.",
];

function showWaterFloat(ml, btn) {
  const rect = btn.getBoundingClientRect();
  const el = document.createElement('div');
  el.className = 'water-float';
  el.textContent = ml > 0 ? `+${ml} ml` : `−${Math.abs(ml)} ml`;
  if (ml < 0) el.style.color = 'var(--text-dim)';
  el.style.left = `${rect.left + rect.width / 2}px`;
  el.style.top = `${rect.top}px`;
  document.body.appendChild(el);
  el.addEventListener('animationend', () => el.remove());
}

function isIos() { return /iphone|ipad|ipod/i.test(navigator.userAgent); }
function isInStandaloneMode() {
  return window.matchMedia('(display-mode: standalone)').matches || !!window.navigator.standalone;
}

function computeStreak(sessions) {
  if (!sessions.length) return 0;
  const dates = new Set(sessions.map(s => s.date));
  let streak = 0;
  const d = new Date();
  if (!dates.has(d.toISOString().slice(0, 10))) d.setDate(d.getDate() - 1);
  while (dates.has(d.toISOString().slice(0, 10))) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

function fmtTime(totalMin) {
  if (!totalMin) return '0m';
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return h ? `${h}h ${m}m` : `${m}m`;
}

export function renderHome(container, navigate) {
  const sessions  = getSessions();
  const settings  = getSettings();
  const todayStr  = today();
  const waterMl   = getWater(todayStr);
  const goal      = settings.waterGoalMl;
  const nextDay   = getNextWorkoutDay(sessions);
  const workout   = WORKOUTS[nextDay - 1];

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

  // Stats
  const totalWorkouts = sessions.length;
  const streak        = computeStreak(sessions);
  const totalMin      = sessions.reduce((s, x) => s + (x.durationMin ?? 0), 0);

  // Last workout (most recent session)
  const lastSession = sessions[0];
  const lastWorkout = lastSession ? WORKOUTS[lastSession.day - 1] : null;

  // Daily quote
  const quote = QUOTES[new Date().getDate() % QUOTES.length];

  container.innerHTML = `
    <div class="screen-header">
      <div class="badge">Beginner · 3×/week</div>
      <h1>Train Hard.<br/><span style="color:var(--accent)">Stay Consistent.</span></h1>
      <p>Age 15 · Split Training Program</p>
    </div>

    <!-- Stat strip -->
    <div class="home-stats">
      <div class="home-stat">
        <div class="home-stat-num">${totalWorkouts}</div>
        <div class="home-stat-lbl">Workouts</div>
      </div>
      <div class="home-stat">
        <div class="home-stat-num">${streak}${streak > 0 ? ' 🔥' : ''}</div>
        <div class="home-stat-lbl">Day Streak</div>
      </div>
      <div class="home-stat">
        <div class="home-stat-num">${fmtTime(totalMin)}</div>
        <div class="home-stat-lbl">Total Time</div>
      </div>
    </div>

    <div class="section">
      <div class="home-grid">
        <!-- Left column -->
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
                <p>Walk, stretch, or recover fully.<br/>Muscles grow during rest.</p>
                <div style="margin-top:16px">
                  <button class="btn-primary" id="start-workout-btn"
                    style="background:var(--surface-raised);color:var(--text-muted);border:1px solid var(--border)">
                    Do ${workout.label} anyway →
                  </button>
                </div>
              </div>`
          }

          ${lastSession && lastWorkout ? `
            <div class="section-title" style="margin-top:20px">Last Workout</div>
            <div class="card last-workout-card">
              <div class="last-workout-top">
                <div>
                  <div class="last-workout-name">${lastWorkout.label}</div>
                  <div class="last-workout-meta">${lastSession.date} · ${lastSession.durationMin ?? '?'} min · ${lastSession.exercises?.length ?? 0} exercises</div>
                </div>
                <span class="last-workout-done">✓</span>
              </div>
              <div class="last-workout-exs">
                ${(lastSession.exercises ?? []).slice(0, 4).map(ex => {
                  const done = (ex.sets ?? []).filter(s => s.done);
                  const label = !done.length ? 'skipped'
                    : ex.isCardio ? (done[0].note || 'done')
                    : `${done[0].weight ?? '?'} kg × ${done[0].reps ?? '?'}`;
                  return `<span class="last-ex-chip">${ex.name}<span class="last-ex-val">${label}</span></span>`;
                }).join('')}
                ${(lastSession.exercises?.length ?? 0) > 4 ? `<span class="last-ex-chip" style="color:var(--text-dim)">+${lastSession.exercises.length - 4} more</span>` : ''}
              </div>
            </div>
          ` : ''}

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

        <!-- Right column -->
        <div>
          <div class="section-title">Water Today</div>
          <div class="card">
            <div class="water-label">
              <span>💧 ${waterMl} ml</span>
              <span style="color:${waterMl >= goal ? 'var(--accent-2)' : 'var(--text-muted)'}">
                ${waterMl >= goal ? '✓ Goal reached!' : `Goal: ${goal} ml`}
              </span>
            </div>
            <div class="water-bar-wrap">
              <div class="water-bar-bg">
                <div class="water-bar-fill" style="width:${pct}%"></div>
              </div>
            </div>
            <div class="water-btns">
              <button class="water-btn" data-ml="250">+250 ml</button>
              <button class="water-btn" data-ml="500">+500 ml</button>
              <button class="water-btn" data-ml="-250" style="color:var(--text-dim)">−250</button>
            </div>
          </div>

          <div class="section-title" style="margin-top:20px">Today's Thought</div>
          <div class="card quote-card">
            <div class="quote-text">"${quote}"</div>
          </div>

          <div class="section-title" style="margin-top:20px">Account</div>
          <div class="card" style="display:flex;align-items:center;justify-content:space-between;gap:12px">
            <div style="font-size:0.8rem;color:var(--text-muted)">☁️ Syncing to Firebase</div>
            <button id="mobile-signout-btn"
              style="font-size:0.75rem;color:var(--text-dim);padding:5px 12px;border:1px solid var(--border);border-radius:6px;white-space:nowrap;flex-shrink:0">
              Sign out
            </button>
          </div>

          ${isIos() && !isInStandaloneMode() ? `
            <div class="card install-card" style="margin-top:10px">
              <div class="install-title">📱 Install on iPhone</div>
              <div class="install-body">Tap <strong>Share</strong> then <strong>"Add to Home Screen"</strong> to use the app offline.</div>
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;

  container.querySelector('#start-workout-btn')?.addEventListener('click', () => navigate('workout'));
  document.getElementById('mobile-signout-btn')?.addEventListener('click', async () => {
    stopListeners(); await signOutUser();
  });

  container.querySelectorAll('.water-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const ml = parseInt(btn.dataset.ml);
      addWater(todayStr, ml);
      const newMl  = getWater(todayStr);
      const goalMl = getSettings().waterGoalMl;
      const newPct = Math.min(100, (newMl / goalMl) * 100);
      const fill = container.querySelector('.water-bar-fill');
      const lbl  = container.querySelector('.water-label');
      if (fill) fill.style.width = `${newPct}%`;
      if (lbl) lbl.innerHTML = `
        <span>💧 ${newMl} ml</span>
        <span style="color:${newMl >= goalMl ? 'var(--accent-2)' : 'var(--text-muted)'}">
          ${newMl >= goalMl ? '✓ Goal reached!' : `Goal: ${goalMl} ml`}
        </span>
      `;
      showWaterFloat(ml, btn);
    });
  });
}
