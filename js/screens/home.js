import { WORKOUTS, getNextWorkoutDay } from '../data.js';
import { getSessions, today } from '../store.js';

function isIos() { return /iphone|ipad|ipod/i.test(navigator.userAgent); }
function isInStandaloneMode() {
  return window.matchMedia('(display-mode: standalone)').matches || !!window.navigator.standalone;
}

const ICO_CHEVRON_R = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>`;
const ICO_CHECK_CIRCLE = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg>`;
const ICO_CHECK_SM = `<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>`;
const ICO_CLOCK = `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 14.5 14.5"/></svg>`;
const ICO_DUMBBELL = `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7v10M7 5v14M17 5v14M20 7v10"/><line x1="7" y1="12" x2="17" y2="12"/></svg>`;
const ICO_MOON = `<svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
const ICO_PHONE = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="17" r="1" fill="currentColor" stroke="none"/></svg>`;

export function renderHome(container, navigate) {
  const sessions  = getSessions();
  const todayStr  = today();
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

  const lastSession = sessions[0];
  const lastWorkout = lastSession ? WORKOUTS[lastSession.day - 1] : null;

  container.innerHTML = `
    <div class="section">
      <div class="section-title">Next Up</div>
      ${todayWorkoutDay
        ? `<div class="card next-workout-card">
            <div class="next-day-title">${workout.label}</div>
            <div class="next-day-focus">${workout.focus}</div>
            <div class="next-day-meta">
              <div class="next-meta-item">${ICO_CLOCK} <span>~${workout.durationMin}</span> min</div>
              <div class="next-meta-item">${ICO_DUMBBELL} <span>${workout.exercises.length}</span> exercises</div>
            </div>
            <button class="btn-primary" id="start-workout-btn">Start Workout ${ICO_CHEVRON_R}</button>
          </div>`
        : `<div class="card rest-day-card">
            <div class="rest-icon">${ICO_MOON}</div>
            <h3>Rest Day</h3>
            <p>Walk, stretch, or recover fully.<br/>Muscles grow during rest.</p>
            <div style="margin-top:16px">
              <button class="btn-primary" id="start-workout-btn"
                style="background:var(--surface-raised);color:var(--text-muted);border:1px solid var(--border)">
                Do ${workout.label} anyway ${ICO_CHEVRON_R}
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
            <span class="last-workout-done">${ICO_CHECK_CIRCLE}</span>
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
              <div class="dot">${done ? ICO_CHECK_SM : d.getDate()}</div>
              <div class="day-lbl">${label}</div>
            </div>`;
          }).join('')}
        </div>
      </div>

      ${isIos() && !isInStandaloneMode() ? `
        <div class="card install-card" style="margin-top:16px">
          <div class="install-title">${ICO_PHONE} Install on iPhone</div>
          <div class="install-body">Tap <strong>Share</strong> then <strong>"Add to Home Screen"</strong> to use the app offline.</div>
        </div>
      ` : ''}
    </div>
  `;

  container.querySelector('#start-workout-btn')?.addEventListener('click', () => navigate('workout'));
}
