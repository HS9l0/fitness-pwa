import { getSessions } from '../store.js';
import { WORKOUTS } from '../data.js';

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTH_ABBR  = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAY_NAMES   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const DAY_ABBR    = ['Mo','Tu','We','Th','Fr','Sa','Su'];

const ICO_CHEVRON_L = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>`;
const ICO_CHEVRON_R = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>`;
const ICO_CHECK_SM  = `<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>`;

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
  const sessions     = getSessions();
  const sessionDates = new Set(sessions.map(s => s.date));
  const todayStr     = new Date().toISOString().slice(0, 10);
  const now          = new Date();

  let viewYear  = now.getFullYear();
  let viewMonth = now.getMonth();

  // Earliest month we allow navigating back to (first session or 6 months ago)
  const earliest = sessions.length
    ? new Date(sessions[sessions.length - 1].date + 'T12:00:00')
    : new Date(now.getFullYear(), now.getMonth() - 6, 1);
  const earliestYear  = earliest.getFullYear();
  const earliestMonth = earliest.getMonth();

  function buildGrid() {
    const numDays  = new Date(viewYear, viewMonth + 1, 0).getDate();
    const startDow = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7; // 0=Mon

    const monthStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}`;
    const monthSessions = sessions.filter(s => s.date.startsWith(monthStr));
    const monthCount = monthSessions.length;

    const atEarliest = viewYear < earliestYear || (viewYear === earliestYear && viewMonth <= earliestMonth);
    const atLatest   = viewYear === now.getFullYear() && viewMonth === now.getMonth();

    const cells = [
      ...Array(startDow).fill(null),
      ...Array.from({ length: numDays }, (_, i) => {
        const day     = i + 1;
        const dateStr = `${monthStr}-${String(day).padStart(2, '0')}`;
        return {
          day,
          dateStr,
          hasSession: sessionDates.has(dateStr),
          isToday:    dateStr === todayStr,
        };
      }),
    ];

    const cellsHtml = cells.map(cell => {
      if (!cell) return `<div class="hist-cal-cell hist-cal-empty"></div>`;
      if (cell.hasSession) {
        return `<button class="hist-cal-cell hist-cal-session" data-date="${cell.dateStr}">
          <span class="hist-cal-day-num">${cell.day}</span>
          <span class="hist-cal-dot-ico">${ICO_CHECK_SM}</span>
        </button>`;
      }
      if (cell.isToday) return `<div class="hist-cal-cell hist-cal-today">${cell.day}</div>`;
      // future days: dim out
      const isFuture = cell.dateStr > todayStr;
      return `<div class="hist-cal-cell${isFuture ? ' hist-cal-future' : ''}">${cell.day}</div>`;
    }).join('');

    return `
      <div class="hist-month-nav">
        <button class="hist-month-arrow" id="hist-prev" ${atEarliest ? 'disabled' : ''} aria-label="Previous month">
          ${ICO_CHEVRON_L}
        </button>
        <div class="hist-month-label-wrap">
          <span class="hist-month-label">${MONTH_NAMES[viewMonth]} ${viewYear}</span>
          ${monthCount > 0
            ? `<span class="hist-month-count">${monthCount} workout${monthCount !== 1 ? 's' : ''}</span>`
            : `<span class="hist-month-count" style="color:var(--dim)">No workouts</span>`
          }
        </div>
        <button class="hist-month-arrow" id="hist-next" ${atLatest ? 'disabled' : ''} aria-label="Next month">
          ${ICO_CHEVRON_R}
        </button>
      </div>
      <div class="hist-cal-grid">
        ${DAY_ABBR.map(a => `<div class="hist-cal-hdr-cell">${a}</div>`).join('')}
        ${cellsHtml}
      </div>`;
  }

  function wireNav() {
    container.querySelector('#hist-prev')?.addEventListener('click', () => {
      viewMonth--;
      if (viewMonth < 0) { viewMonth = 11; viewYear--; }
      container.querySelector('#hist-cal-body').innerHTML = buildGrid();
      wireNav();
    });
    container.querySelector('#hist-next')?.addEventListener('click', () => {
      viewMonth++;
      if (viewMonth > 11) { viewMonth = 0; viewYear++; }
      container.querySelector('#hist-cal-body').innerHTML = buildGrid();
      wireNav();
    });
    container.querySelectorAll('.hist-cal-session').forEach(btn => {
      btn.addEventListener('click', () => showSessionDetail(btn.dataset.date, sessions));
    });
  }

  container.innerHTML = `
    <div class="hist-nav-bar">
      <button class="hist-back-btn" id="hist-back">${ICO_CHEVRON_L}<span>Home</span></button>
      <span class="hist-nav-title">History</span>
      <div style="width:70px"></div>
    </div>
    <div id="hist-cal-body" class="hist-cal-wrap"></div>
  `;

  container.querySelector('#hist-back').addEventListener('click', () => navigate('home'));
  container.querySelector('#hist-cal-body').innerHTML = buildGrid();
  wireNav();
}
