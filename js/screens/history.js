import { getSessionsForMonth, getSessions } from '../store.js';
import { WORKOUTS } from '../data.js';

let calYear = new Date().getFullYear();
let calMonth = new Date().getMonth();
let selectedDate = null;

export function renderHistory(container) {
  const sessions = getSessionsForMonth(calYear, calMonth);
  const sessionMap = {};
  sessions.forEach(s => { sessionMap[s.date] = s; });

  const monthName = new Date(calYear, calMonth, 1)
    .toLocaleString('default', { month: 'long', year: 'numeric' });
  const firstDow = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const todayStr = new Date().toISOString().slice(0, 10);

  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push('<div class="cal-day"></div>');
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const hasSession = !!sessionMap[dateStr];
    const isToday = dateStr === todayStr;
    const isSelected = dateStr === selectedDate;
    cells.push(`<div class="cal-day ${hasSession ? 'has-session' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}" data-date="${dateStr}">${d}</div>`);
  }

  const allSessions = getSessions();

  container.innerHTML = `
    <div class="screen-header">
      <div class="badge">Workout Log</div>
      <h1>History</h1>
      <p>${allSessions.length} session${allSessions.length !== 1 ? 's' : ''} logged</p>
    </div>
    <div class="section">
      <div class="history-layout">
        <div>
          <div class="card">
            <div class="cal-nav">
              <button id="cal-prev">‹</button>
              <h3>${monthName}</h3>
              <button id="cal-next">›</button>
            </div>
            <div class="cal-grid">
              ${['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => `<div class="cal-day-hdr">${d}</div>`).join('')}
              ${cells.join('')}
            </div>
          </div>
          <div id="session-detail"></div>
        </div>

        <div>
          <div class="section-title">Recent Sessions</div>
          ${allSessions.length
            ? allSessions.slice(0, 20).map(s => `
              <div class="card session-row" style="margin-bottom:10px;cursor:pointer" data-date="${s.date}">
                <div style="display:flex;justify-content:space-between;align-items:center">
                  <div>
                    <div style="font-size:0.88rem;font-weight:700">${WORKOUTS[s.day - 1]?.label ?? 'Workout'}</div>
                    <div style="font-size:0.72rem;color:var(--text-muted);margin-top:2px">${s.date} · ${s.durationMin ?? '?'} min</div>
                  </div>
                  <div style="font-size:0.72rem;color:var(--accent);font-weight:700">${s.exercises?.length ?? 0} exercises →</div>
                </div>
              </div>
            `).join('')
            : '<div style="color:var(--text-dim);font-size:0.85rem;text-align:center;padding:28px 0">No sessions yet.<br/>Complete a workout to see it here.</div>'
          }
        </div>
      </div>
    </div>
  `;

  container.querySelector('#cal-prev').addEventListener('click', () => {
    calMonth--;
    if (calMonth < 0) { calMonth = 11; calYear--; }
    selectedDate = null;
    renderHistory(container);
  });

  container.querySelector('#cal-next').addEventListener('click', () => {
    calMonth++;
    if (calMonth > 11) { calMonth = 0; calYear++; }
    selectedDate = null;
    renderHistory(container);
  });

  container.querySelectorAll('.cal-day.has-session').forEach(el => {
    el.addEventListener('click', () => {
      const date = el.dataset.date;
      selectedDate = selectedDate === date ? null : date;
      if (selectedDate && sessionMap[date]) {
        renderSessionDetail(container.querySelector('#session-detail'), sessionMap[date]);
      } else {
        container.querySelector('#session-detail').innerHTML = '';
        selectedDate = null;
      }
      renderHistory(container);
    });
  });

  container.querySelectorAll('.session-row').forEach(el => {
    el.addEventListener('click', () => {
      const date = el.dataset.date;
      const session = allSessions.find(s => s.date === date);
      if (session) {
        selectedDate = date;
        renderSessionDetail(container.querySelector('#session-detail'), session);
        container.scrollTo({ top: 0, behavior: 'smooth' });
        renderHistory(container);
      }
    });
  });

  // Restore selected detail after re-render
  if (selectedDate) {
    const session = sessionMap[selectedDate] || allSessions.find(s => s.date === selectedDate);
    if (session) renderSessionDetail(container.querySelector('#session-detail'), session);
  }
}

function renderSessionDetail(el, session) {
  const workout = WORKOUTS[session.day - 1];
  el.innerHTML = `
    <div class="session-detail">
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
          <div style="font-weight:700;font-size:0.95rem;color:#fff">${workout?.label ?? 'Workout'}</div>
          <div style="font-size:0.72rem;color:var(--text-muted)">${session.date} · ${session.durationMin ?? '?'} min</div>
        </div>
        ${session.exercises?.map(ex => {
          const doneSets = ex.sets?.filter(s => s.done) ?? [];
          return `
            <div class="session-ex-row">
              <div class="session-ex-name">${ex.name}</div>
              <div style="margin-top:5px">
                ${doneSets.length
                  ? doneSets.map((s, i) =>
                      ex.isCardio
                        ? `<span class="session-set-pill">${s.note || 'done'}</span>`
                        : `<span class="session-set-pill">Set ${i + 1}: ${s.weight ?? '?'} kg × ${s.reps ?? '?'}</span>`
                    ).join('')
                  : `<span style="font-size:0.72rem;color:var(--text-dim)">Skipped</span>`
                }
              </div>
            </div>
          `;
        }).join('') ?? ''}
      </div>
    </div>
  `;
}
