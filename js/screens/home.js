import { WORKOUTS, getTodayWorkoutDay } from '../data.js';
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
const ICO_DUMBBELL_LG = `<svg viewBox="0 0 24 24" width="52" height="52" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7v10M7 5v14M17 5v14M20 7v10"/><line x1="7" y1="12" x2="17" y2="12"/></svg>`;

const DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function fmtHistDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  const days   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
}

function showDateHistory(dateStr, sessions) {
  const session = sessions.find(s => s.date === dateStr);
  if (!session) return;
  const workout = WORKOUTS[session.day - 1];
  if (!workout) return;

  document.querySelector('.hist-sheet')?.remove();
  const sheet = document.createElement('div');
  sheet.className = 'hist-sheet';
  sheet.innerHTML = `
    <div class="hist-backdrop"></div>
    <div class="hist-panel">
      <div class="settings-panel-hdr">
        <span class="settings-panel-title">${fmtHistDate(dateStr)}</span>
        <button class="settings-done-btn hist-close-btn">Done</button>
      </div>
      <div class="settings-body" style="padding-top:4px">
        <div style="font-size:1rem;font-weight:800;color:var(--text);margin-bottom:2px">${workout.label}</div>
        <div style="font-size:0.78rem;color:var(--text-muted);margin-bottom:16px">${session.durationMin ?? '?'} min · ${session.exercises?.length ?? 0} exercises</div>
        ${(session.exercises ?? []).map(ex => {
          const doneSets = (ex.sets ?? []).filter(s => s.done);
          const chips = doneSets.length === 0
            ? '<span class="hist-set-chip is-skip">skipped</span>'
            : doneSets.map((s, i) =>
                s.skipped
                  ? `<span class="hist-set-chip is-skip">Set ${i + 1} ✕</span>`
                  : ex.isCardio
                    ? `<span class="hist-set-chip">${s.note || 'done'}</span>`
                    : `<span class="hist-set-chip">${s.weight ?? '?'} kg × ${s.reps ?? '?'}</span>`
              ).join('');
          return `<div class="hist-ex-row">
            <div class="hist-ex-name">${ex.name}</div>
            <div class="hist-ex-chips">${chips}</div>
          </div>`;
        }).join('')}
      </div>
    </div>
  `;
  document.body.appendChild(sheet);
  requestAnimationFrame(() => sheet.classList.add('open'));
  const close = () => { sheet.classList.remove('open'); setTimeout(() => sheet.remove(), 340); };
  sheet.querySelector('.hist-backdrop').addEventListener('click', close);
  sheet.querySelector('.hist-close-btn').addEventListener('click', close);
}

export function renderHome(container, navigate) {
  const sessions     = getSessions();
  const todayStr     = today();
  const todayDay     = getTodayWorkoutDay(); // 1, 2, 3, or null
  const workout      = todayDay ? WORKOUTS[todayDay - 1] : null;

  const now = new Date();
  const dow = now.getDay();

  // Activity ring: workouts this Mon–Sun week
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - ((dow + 6) % 7)); // Mon
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  const weekDone = sessions.filter(s => {
    const d = new Date(s.date + 'T12:00:00');
    return d >= startOfWeek && d < endOfWeek;
  }).length;
  const weekGoal = 3;
  const ringC = 2 * Math.PI * 44;
  const ringFill = Math.min(weekDone / weekGoal, 1) * ringC;

  const sessionDates = new Set(sessions.map(s => s.date));
  const lastSession = sessions[0];
  const lastWorkout = lastSession ? WORKOUTS[lastSession.day - 1] : null;

  const WHEN_LABELS = ['Monday', 'Wednesday', 'Friday'];
  const dateLabel = `${DAY_NAMES[dow]}, ${MONTH_NAMES[now.getMonth()]} ${now.getDate()}`;
  const doneToday = todayDay !== null && sessions.some(s => s.date === todayStr && s.day === todayDay);

  // Next scheduled workout (for rest-day card)
  const nextScheduledDay = [1, 3, 5].find(d => d > dow) ?? 1; // next Mon/Wed/Fri
  const nextScheduledDayName = { 1: 'Monday', 3: 'Wednesday', 5: 'Friday' }[nextScheduledDay];
  const nextScheduledWorkoutDay = { 1: 1, 3: 2, 5: 3 }[nextScheduledDay];
  const nextWorkout = WORKOUTS[nextScheduledWorkoutDay - 1];

  // Streak dots: last 7 days ending today
  const streakStart = new Date(now);
  streakStart.setDate(now.getDate() - 6);
  const streakDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(streakStart);
    d.setDate(streakStart.getDate() + i);
    return d.toISOString().slice(0, 10);
  });

  const dotsHtml = streakDays.map(dateStr => {
    const d = new Date(dateStr + 'T12:00:00');
    const label = ['Su','Mo','Tu','We','Th','Fr','Sa'][d.getDay()];
    const done = sessionDates.has(dateStr);
    const isToday = dateStr === todayStr;
    let dotStyle, lblStyle, dotContent;
    if (done) {
      dotStyle = `style="width:28px;height:28px;border-radius:50%;background:var(--accent);border:1.5px solid var(--accent);display:flex;align-items:center;justify-content:center;color:var(--onAccent);"`;
      lblStyle = `style="font-size:9px;color:var(--dim);text-transform:uppercase;"`;
      dotContent = ICO_CHECK_SM;
    } else if (isToday) {
      dotStyle = `style="width:28px;height:28px;border-radius:50%;background:var(--accentSoft);border:1.5px solid var(--accent);display:flex;align-items:center;justify-content:center;font-size:11px;color:var(--accent);"`;
      lblStyle = `style="font-size:9px;color:var(--accent);text-transform:uppercase;"`;
      dotContent = d.getDate();
    } else {
      dotStyle = `style="width:28px;height:28px;border-radius:50%;background:var(--surface2);border:1.5px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:11px;color:var(--dim);"`;
      lblStyle = `style="font-size:9px;color:var(--dim);text-transform:uppercase;"`;
      dotContent = d.getDate();
    }
    return `<button class="streak-dot-btn${done ? ' has-session' : ''}" data-date="${dateStr}" style="flex:1;display:flex;flex-direction:column;align-items:center;gap:5px;background:none;border:none;padding:4px 0;cursor:${done ? 'pointer' : 'default'}">
      <div ${dotStyle}>${dotContent}</div>
      <div ${lblStyle}>${label}</div>
    </button>`;
  }).join('');

  // Next-up / done-today / rest-day card
  let nextCardHtml;
  if (doneToday) {
    nextCardHtml = `
      <div class="card done-today-card" style="margin-bottom:12px">
        <div class="done-today-icon">${ICO_CHECK_CIRCLE}</div>
        <div class="done-today-text">
          <div class="done-today-title">Workout complete!</div>
          <div class="done-today-sub">You're done for today. Rest up and come back ${nextScheduledDayName}.</div>
        </div>
      </div>`;
  } else if (todayDay) {
    nextCardHtml = `
      <div class="card next-card" style="margin-bottom:12px">
        <div class="next-gradient">
          <div class="next-dumbbell-icon">${ICO_DUMBBELL_LG}</div>
          <div class="next-when-lbl">Today · ${WHEN_LABELS[todayDay - 1]}</div>
          <div class="next-workout-name">${workout.label}</div>
        </div>
        <div class="next-body">
          <div class="next-focus-txt">${workout.focus}</div>
          <div class="next-meta-row">
            <div class="next-meta-item">${ICO_CLOCK} <span>~${workout.durationMin}</span> min</div>
            <div class="next-meta-item">${ICO_DUMBBELL} <span>${workout.exercises.length}</span> exercises</div>
          </div>
        </div>
      </div>`;
  } else {
    nextCardHtml = `
      <div class="card rest-day-card" style="margin-bottom:12px">
        <div class="rest-icon">${ICO_MOON}</div>
        <h3>Rest Day</h3>
        <p>Walk, stretch, or recover fully.<br/>Next up: <strong>${nextWorkout.label}</strong> on ${nextScheduledDayName}.</p>
      </div>`;
  }

  container.innerHTML = `
    <div class="hig-large-title">FitPlan</div>
    <div class="hig-date-label">${dateLabel}</div>

    <div class="section" style="padding-top:0">

      <!-- Merged "This Week" card: ring + streak dots -->
      <div class="card week-card" style="margin-bottom:12px">
        <div class="ring-card">
          <div class="ring-wrap">
            <svg width="104" height="104" viewBox="0 0 104 104">
              <circle cx="52" cy="52" r="44" fill="none" stroke="var(--accentSoft)" stroke-width="13"/>
              <circle cx="52" cy="52" r="44" fill="none" stroke="var(--accent)" stroke-width="13"
                stroke-linecap="round"
                stroke-dasharray="${ringFill.toFixed(1)} ${ringC.toFixed(1)}"
                transform="rotate(-90 52 52)"/>
            </svg>
            <div class="ring-inner">
              <span class="ring-count">${weekDone}</span>
              <span class="ring-of">of ${weekGoal}</span>
            </div>
          </div>
          <div class="ring-info">
            <div class="ring-headline">This Week</div>
            <div class="ring-sub">
              ${weekDone === 0
                ? 'No workouts yet — let\'s go!'
                : weekDone >= weekGoal
                  ? '<strong>Goal reached!</strong> Great week.'
                  : `<strong>${weekGoal - weekDone} more</strong> to hit your goal`
              }
            </div>
          </div>
        </div>
        <div class="week-dots-row">
          ${dotsHtml}
        </div>
        ${lastSession && lastWorkout ? `
          <div class="last-wkt-merged">
            <div class="last-wkt-top">
              <div>
                <div class="last-workout-name">${lastWorkout.label}</div>
                <div class="last-workout-meta">${lastSession.date} · ${lastSession.durationMin ?? '?'} min · ${lastSession.exercises?.length ?? 0} exercises</div>
              </div>
              <span style="color:var(--accent);flex-shrink:0">${ICO_CHECK_CIRCLE}</span>
            </div>
            <div class="last-workout-exs">
              ${(lastSession.exercises ?? []).slice(0, 4).map(ex => {
                const doneSets = (ex.sets ?? []).filter(s => s.done);
                const lbl = !doneSets.length ? 'skipped' : ex.isCardio ? (doneSets[0].note || 'done') : `${doneSets[0].weight ?? '?'} kg × ${doneSets[0].reps ?? '?'}`;
                return `<span class="last-ex-chip">${ex.name}<span class="last-ex-val">${lbl}</span></span>`;
              }).join('')}
              ${(lastSession.exercises?.length ?? 0) > 4 ? `<span class="last-ex-chip" style="color:var(--dim)">+${lastSession.exercises.length - 4} more</span>` : ''}
            </div>
          </div>
        ` : ''}
      </div>

      ${nextCardHtml}

      ${todayDay && !doneToday ? `
        <div class="home-cta-wrap">
          <button class="hig-btn-primary" id="start-workout-btn">Start Workout ${ICO_CHEVRON_R}</button>
        </div>
      ` : ''}

      ${isIos() && !isInStandaloneMode() ? `
        <div class="card install-card" style="margin-top:12px">
          <div class="install-title">${ICO_PHONE} Install on iPhone</div>
          <div class="install-body">Tap <strong>Share</strong> then <strong>"Add to Home Screen"</strong> to use the app offline.</div>
        </div>
      ` : ''}
    </div>
  `;

  container.querySelector('#start-workout-btn')?.addEventListener('click', () => navigate('workout'));
  container.querySelectorAll('.streak-dot-btn.has-session').forEach(btn => {
    btn.addEventListener('click', () => showDateHistory(btn.dataset.date, sessions));
  });
}
