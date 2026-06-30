import { getSessions } from '../store.js';
import { WORKOUTS } from '../data.js';

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTH_ABBR  = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAY_NAMES   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const DAY_ABBR    = ['Mo','Tu','We','Th','Fr','Sa','Su'];

const ICO_CHEVRON_L = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>`;

function fmtDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return `${DAY_NAMES[d.getDay()]}, ${MONTH_ABBR[d.getMonth()]} ${d.getDate()}`;
}

function showSessionDetail(dateStr, sessions) {
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
        <span class="settings-panel-title">${fmtDate(dateStr)}</span>
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

export function renderHistory(container, navigate) {
  const sessions    = getSessions();
  const sessionDates = new Set(sessions.map(s => s.date));
  const todayStr    = new Date().toISOString().slice(0, 10);
  const now         = new Date();

  const monthsHtml = Array.from({ length: 3 }, (_, i) => {
    const ref   = new Date(now.getFullYear(), now.getMonth() - (2 - i), 1);
    const year  = ref.getFullYear();
    const month = ref.getMonth();
    const numDays  = new Date(year, month + 1, 0).getDate();
    const startDow = (new Date(year, month, 1).getDay() + 6) % 7; // 0=Mon

    const cells = [
      ...Array(startDow).fill(null),
      ...Array.from({ length: numDays }, (_, d) => {
        const day     = d + 1;
        const dateStr = `${year}-${String(month + 1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
        return { day, dateStr, hasSession: sessionDates.has(dateStr), isToday: dateStr === todayStr };
      })
    ];

    const cellsHtml = cells.map(cell => {
      if (!cell)            return `<div class="hist-cal-cell hist-cal-empty"></div>`;
      if (cell.hasSession)  return `<button class="hist-cal-cell hist-cal-session" data-date="${cell.dateStr}">${cell.day}</button>`;
      if (cell.isToday)     return `<div class="hist-cal-cell hist-cal-today">${cell.day}</div>`;
      return `<div class="hist-cal-cell">${cell.day}</div>`;
    }).join('');

    return `
      <div class="hist-month-block">
        <div class="hist-month-title">${MONTH_NAMES[month]} ${year}</div>
        <div class="hist-cal-grid">
          ${DAY_ABBR.map(a => `<div class="hist-cal-hdr-cell">${a}</div>`).join('')}
          ${cellsHtml}
        </div>
      </div>`;
  }).join('');

  const hasSessions = sessions.length > 0;

  container.innerHTML = `
    <div class="hist-nav-bar">
      <button class="hist-back-btn" id="hist-back">${ICO_CHEVRON_L}<span>Home</span></button>
      <span class="hist-nav-title">History</span>
      <div style="width:70px"></div>
    </div>
    ${hasSessions
      ? `<div class="hist-cal-section">${monthsHtml}</div>`
      : `<div class="hist-empty-state">
           <div class="hist-empty-icon">📅</div>
           <div class="hist-empty-title">No workouts yet</div>
           <div class="hist-empty-sub">Complete your first workout and it will appear here.</div>
         </div>`
    }
  `;

  container.querySelector('#hist-back').addEventListener('click', () => navigate('home'));
  container.querySelectorAll('.hist-cal-session').forEach(btn => {
    btn.addEventListener('click', () => showSessionDetail(btn.dataset.date, sessions));
  });
}
