import { WORKOUTS, getTodayWorkoutDay } from '../data.js';
import { getSessions, today } from '../store.js';

const ICO_CHEVRON_R = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>`;
const ICO_CHECK_CIRCLE = `<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg>`;
const ICO_CHECK_SM = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>`;
const ICO_CHECK_CIRCLE_SM = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9.5"/><polyline points="8.5 12 11 14.5 15.5 9.5"/></svg>`;
const ICO_CLOCK = `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 14.5 14.5"/></svg>`;
const ICO_DUMBBELL = `<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7v10M7 5v14M17 5v14M20 7v10"/><line x1="7" y1="12" x2="17" y2="12"/></svg>`;
const ICO_MOON = `<svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
const ICO_DUMBBELL_LG = `<svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7v10M7 5v14M17 5v14M20 7v10"/><line x1="7" y1="12" x2="17" y2="12"/></svg>`;

const DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

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

  // Day strip at the handoff's scale: 34px circles, 14px numerals, 12px
  // labels. A completed day is a filled accent circle carrying a check
  // rather than its date; today is an accent ring around its date.
  const dotsHtml = streakDays.map(dateStr => {
    const d = new Date(dateStr + 'T12:00:00');
    const label = ['Su','Mo','Tu','We','Th','Fr','Sa'][d.getDay()];
    const done = sessionDates.has(dateStr);
    const isToday = dateStr === todayStr;
    const base = 'width:34px;height:34px;border-radius:17px;display:flex;align-items:center;justify-content:center;font-variant-numeric:tabular-nums;';
    let dotStyle, lblStyle, dotContent;
    if (done) {
      dotStyle = `style="${base}background:var(--accent);color:var(--onAccent);"`;
      lblStyle = `style="font-size:12px;font-weight:600;color:var(--label2);"`;
      dotContent = ICO_CHECK_SM;
    } else if (isToday) {
      dotStyle = `style="${base}background:transparent;box-shadow:inset 0 0 0 2px var(--accent);font-size:14px;font-weight:700;color:var(--accent);"`;
      lblStyle = `style="font-size:12px;font-weight:600;color:var(--accent);"`;
      dotContent = d.getDate();
    } else {
      dotStyle = `style="${base}background:var(--fill2);font-size:14px;font-weight:600;color:var(--label3);"`;
      lblStyle = `style="font-size:12px;font-weight:600;color:var(--label3);"`;
      dotContent = d.getDate();
    }
    return `<div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:7px">
      <div ${dotStyle}>${dotContent}</div>
      <div ${lblStyle}>${label}</div>
    </div>`;
  }).join('');

  // Most recent completed session other than today's — the handoff's
  // "last session" row, which pushes to History.
  const priorSessions = sessions
    .filter(s => s.date !== todayStr)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  const lastSession = priorSessions[0] ?? null;
  let lastSessionHtml = '';
  if (lastSession) {
    const ls = new Date(lastSession.date + 'T12:00:00');
    const lsLabel = WORKOUTS[lastSession.day - 1]?.label ?? `Day ${lastSession.day}`;
    const lsDate = `${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][ls.getDay()]}, ${MONTH_NAMES[ls.getMonth()].slice(0, 3)} ${ls.getDate()}`;
    const lsCount = lastSession.exercises?.length ?? 0;
    const bits = [lsDate];
    if (lastSession.durationMin) bits.push(`${lastSession.durationMin} min`);
    if (lsCount) bits.push(`${lsCount} exercise${lsCount === 1 ? '' : 's'}`);
    lastSessionHtml = `
      <button type="button" class="last-session-row" id="last-session-btn">
        <span class="last-session-icon">${ICO_CHECK_CIRCLE_SM}</span>
        <span class="last-session-text">
          <span class="last-session-title">${lsLabel}</span>
          <span class="last-session-sub">${bits.join(' · ')}</span>
        </span>
        ${ICO_CHEVRON_R}
      </button>`;
  }

  // Next-up / done-today / rest-day card
  let nextCardHtml;
  if (doneToday) {
    nextCardHtml = `
      <div class="card done-today-card" style="margin-bottom:8px">
        <div class="done-today-icon">${ICO_CHECK_CIRCLE}</div>
        <div class="done-today-text">
          <div class="done-today-title">Workout complete!</div>
          <div class="done-today-sub">You're done for today. Rest up and come back ${nextScheduledDayName}.</div>
        </div>
      </div>`;
  } else if (todayDay) {
    nextCardHtml = `
      <div class="card next-card" style="margin-bottom:8px">
        <div class="next-gradient">
          <div class="next-dumbbell-icon">${ICO_DUMBBELL_LG}</div>
          <div class="next-when-lbl">Today's Session</div>
          <div class="next-workout-name">${workout.label}</div>
        </div>
        <div class="next-body">
          <div class="next-focus-txt">${workout.focus}</div>
          <div class="next-meta-row">
            <div class="next-meta-item">${ICO_CLOCK}<div><span>${workout.durationMin}</span><em> min</em></div></div>
            <div class="next-meta-item">${ICO_DUMBBELL}<div><span>${workout.exercises.length}</span><em> exercises</em></div></div>
          </div>
        </div>
      </div>`;
  } else {
    nextCardHtml = `
      <div class="card rest-day-card" style="margin-bottom:8px">
        <div class="rest-icon">${ICO_MOON}</div>
        <h3>Rest Day</h3>
        <p>Walk, stretch, or recover fully.<br/>Next up: <strong>${nextWorkout.label}</strong> on ${nextScheduledDayName}.</p>
      </div>`;
  }

  container.innerHTML = `
    <div class="hig-title-row">
      <div class="hig-masthead-text">
        <div class="hig-date-label">${dateLabel}</div>
        <div class="hig-large-title">Today</div>
      </div>
    </div>

    <div class="section home-section" style="padding:0 20px">

      ${nextCardHtml}

      <!-- Merged "This Week" card: ring + streak dots -->
      <div class="card week-card" style="margin-bottom:8px">
        <div class="ring-card">
          <div class="ring-wrap">
            <svg width="84" height="84" viewBox="0 0 104 104">
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
            <div class="ring-headline-row">
              <div class="ring-headline">This Week</div>
            </div>
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
        <button type="button" class="week-dots-row" id="view-history-btn" aria-label="View history">
          ${dotsHtml}
        </button>
      </div>

      ${lastSessionHtml}

      ${todayDay && !doneToday ? `
        <div class="home-cta-wrap">
          <button class="hig-btn-primary" id="start-workout-btn">Start Workout ${ICO_CHEVRON_R}</button>
        </div>
      ` : ''}
    </div>
  `;

  container.querySelector('#start-workout-btn')?.addEventListener('click', () => navigate('workout'));
  container.querySelector('#view-history-btn')?.addEventListener('click', () => navigate('history'));
  container.querySelector('#last-session-btn')?.addEventListener('click', () => navigate('history'));
}
