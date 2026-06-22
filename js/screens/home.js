import { WORKOUTS, getNextWorkoutDay } from '../data.js';
import { getSessions, today } from '../store.js';

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
  const todayStr  = today();
  const nextDay   = getNextWorkoutDay(sessions);
  const workout   = WORKOUTS[nextDay - 1];

  const planOn     = localStorage.getItem('fit_plan_enabled')     !== 'false';
  const progressOn = localStorage.getItem('fit_progress_enabled') !== 'false';
  const nutriOn    = localStorage.getItem('fit_nutrition_enabled') === 'true';
  const quickLinks = [
    planOn     && { screen: 'plan',      label: 'Plan',      svg: `<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>` },
    progressOn && { screen: 'progress',  label: 'Progress',  svg: `<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>` },
    nutriOn    && { screen: 'nutrition', label: 'Nutrition', svg: `<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/>` },
  ].filter(Boolean);

  const dow = new Date().getDay();
  const workoutDays = { 1: 1, 3: 2, 5: 3 };
  const todayWorkoutDay = workoutDays[dow];

  const streakDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - 6 + i);
    return d.toISOString().slice(0, 10);
  });
  const sessionDates = new Set(sessions.map(s => s.date));

  const totalWorkouts = sessions.length;
  const streak        = computeStreak(sessions);
  const totalMin      = sessions.reduce((s, x) => s + (x.durationMin ?? 0), 0);

  const lastSession = sessions[0];
  const lastWorkout = lastSession ? WORKOUTS[lastSession.day - 1] : null;

  container.innerHTML = `
    <div class="screen-header">
      <div class="badge">Beginner · 3×/week</div>
      <h1>Train Hard.<br/><span style="color:var(--accent)">Stay Consistent.</span></h1>
      <p>Age 15 · Split Training Program</p>
    </div>

    ${quickLinks.length ? `
    <div class="home-quicknav">
      ${quickLinks.map(({ screen, label, svg }) => `
        <button class="home-qnav-btn" data-nav="${screen}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${svg}</svg>
          ${label}
        </button>`).join('')}
    </div>` : ''}

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

      ${isIos() && !isInStandaloneMode() ? `
        <div class="card install-card" style="margin-top:16px">
          <div class="install-title">📱 Install on iPhone</div>
          <div class="install-body">Tap <strong>Share</strong> then <strong>"Add to Home Screen"</strong> to use the app offline.</div>
        </div>
      ` : ''}
    </div>
  `;

  container.querySelector('#start-workout-btn')?.addEventListener('click', () => navigate('workout'));

  container.querySelectorAll('.home-qnav-btn').forEach(btn => {
    btn.addEventListener('click', () => navigate(btn.dataset.nav));
  });
}
