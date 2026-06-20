import { getSessionsForMonth, getSessions } from '../store.js';
import { WORKOUTS } from '../data.js';

let calYear  = new Date().getFullYear();
let calMonth = new Date().getMonth();
let selectedDate = null;

function computeStreak(sessions) {
  if (!sessions.length) return 0;
  const dates = new Set(sessions.map(s => s.date));
  let streak = 0;
  const d = new Date();
  if (!dates.has(d.toISOString().slice(0, 10))) d.setDate(d.getDate() - 1);
  while (dates.has(d.toISOString().slice(0, 10))) { streak++; d.setDate(d.getDate() - 1); }
  return streak;
}

function computeBestStreak(sessions) {
  if (!sessions.length) return 0;
  const dates = [...new Set(sessions.map(s => s.date))].sort();
  let best = 1, cur = 1;
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1] + 'T12:00:00');
    const curr = new Date(dates[i]     + 'T12:00:00');
    const diff = (curr - prev) / 86400000;
    cur = diff === 1 ? cur + 1 : 1;
    best = Math.max(best, cur);
  }
  return best;
}

function getPersonalRecords(sessions) {
  const prs = {};
  sessions.forEach(s => {
    s.exercises?.forEach(ex => {
      if (ex.isCardio) return;
      ex.sets?.forEach(set => {
        if (!set.done || !set.weight) return;
        if (!prs[ex.name] || set.weight > prs[ex.name].weight) {
          prs[ex.name] = { weight: set.weight, reps: set.reps, date: s.date };
        }
      });
    });
  });
  return prs;
}

export function renderHistory(container) {
  const sessions   = getSessionsForMonth(calYear, calMonth);
  const sessionMap = {};
  sessions.forEach(s => { sessionMap[s.date] = s; });

  const monthName  = new Date(calYear, calMonth, 1).toLocaleString('default', { month: 'long', year: 'numeric' });
  const firstDow   = new Date(calYear, calMonth, 1).getDay();
  const daysInMon  = new Date(calYear, calMonth + 1, 0).getDate();
  const todayStr   = new Date().toISOString().slice(0, 10);

  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push('<div class="cal-day"></div>');
  for (let d = 1; d <= daysInMon; d++) {
    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const hasS    = !!sessionMap[dateStr];
    const isTod   = dateStr === todayStr;
    const isSel   = dateStr === selectedDate;
    cells.push(`<div class="cal-day${hasS?' has-session':''}${isTod?' today':''}${isSel?' selected':''}" data-date="${dateStr}">${d}</div>`);
  }

  const allSessions = getSessions();
  const totalMin    = allSessions.reduce((s, x) => s + (x.durationMin ?? 0), 0);
  const bestStreak  = computeBestStreak(allSessions);
  const curStreak   = computeStreak(allSessions);
  const prs         = getPersonalRecords(allSessions);
  const prEntries   = Object.entries(prs).sort(([, a], [, b]) => b.weight - a.weight);

  function fmtTime(m) {
    if (!m) return '—';
    const h = Math.floor(m / 60), rem = m % 60;
    return h ? `${h}h ${rem}m` : `${m}m`;
  }

  container.innerHTML = `
    <div class="screen-header">
      <div class="badge">Workout Log</div>
      <h1>History</h1>
      <p>${allSessions.length} session${allSessions.length !== 1 ? 's' : ''} logged</p>
    </div>

    <!-- Lifetime stats -->
    <div class="home-stats">
      <div class="home-stat">
        <div class="home-stat-num">${allSessions.length}</div>
        <div class="home-stat-lbl">Sessions</div>
      </div>
      <div class="home-stat">
        <div class="home-stat-num">${fmtTime(totalMin)}</div>
        <div class="home-stat-lbl">Total Time</div>
      </div>
      <div class="home-stat">
        <div class="home-stat-num">${bestStreak}${bestStreak > 0 ? ' 🔥' : ''}</div>
        <div class="home-stat-lbl">Best Streak</div>
      </div>
      <div class="home-stat">
        <div class="home-stat-num">${curStreak}</div>
        <div class="home-stat-lbl">Current</div>
      </div>
    </div>

    <div class="section">
      <div class="history-layout">
        <!-- Left: calendar + detail -->
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

        <!-- Right: recent sessions + PRs -->
        <div>
          <div class="section-title">Recent Sessions</div>
          ${allSessions.length
            ? allSessions.slice(0, 20).map(s => {
                const wk = WORKOUTS[s.day - 1];
                const exDone = s.exercises?.filter(e => e.sets?.some(st => st.done)) ?? [];
                return `
                  <div class="card session-row" style="margin-bottom:8px;cursor:pointer" data-date="${s.date}">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
                      <div>
                        <div style="font-size:0.86rem;font-weight:700">${wk?.label ?? 'Workout'}</div>
                        <div style="font-size:0.7rem;color:var(--text-muted);margin-top:1px">${s.date} · ${s.durationMin ?? '?'} min</div>
                      </div>
                      <div style="font-size:0.7rem;color:var(--accent);font-weight:700">${exDone.length}/${s.exercises?.length ?? 0} ✓</div>
                    </div>
                    <div style="display:flex;gap:4px;flex-wrap:wrap">
                      ${(s.exercises ?? []).map(ex => {
                        const anyDone = ex.sets?.some(st => st.done);
                        return `<span style="font-size:0.62rem;padding:2px 6px;border-radius:4px;background:${anyDone?'rgba(249,115,22,0.12)':'var(--surface-raised)'};color:${anyDone?'var(--accent)':'var(--text-dim)'}">${ex.name}</span>`;
                      }).join('')}
                    </div>
                  </div>`;
              }).join('')
            : '<div class="history-empty">No sessions yet.<br/>Complete a workout to see it here.</div>'
          }

          ${prEntries.length ? `
            <div class="section-title" style="margin-top:24px">Personal Records 🏆</div>
            <div class="pr-grid">
              ${prEntries.slice(0, 8).map(([name, pr]) => `
                <div class="pr-item">
                  <div class="pr-name">${name}</div>
                  <div class="pr-weight">${pr.weight} kg</div>
                  <div class="pr-detail">× ${pr.reps ?? '?'} reps · ${pr.date}</div>
                </div>
              `).join('')}
            </div>
          ` : ''}
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

  if (selectedDate) {
    const session = sessionMap[selectedDate] || allSessions.find(s => s.date === selectedDate);
    if (session) renderSessionDetail(container.querySelector('#session-detail'), session);
  }
}

function renderSessionDetail(el, session) {
  const workout = WORKOUTS[session.day - 1];
  const totalSets = session.exercises?.reduce((n, ex) => n + (ex.sets?.filter(s => s.done).length ?? 0), 0) ?? 0;

  el.innerHTML = `
    <div class="session-detail">
      <div class="card">
        <div class="session-detail-header">
          <div>
            <div class="session-detail-title">${workout?.label ?? 'Workout'}</div>
            <div class="session-detail-meta">${session.date} · ${session.durationMin ?? '?'} min · ${totalSets} sets completed</div>
          </div>
        </div>
        ${session.exercises?.map(ex => {
          const doneSets = ex.sets?.filter(s => s.done) ?? [];
          return `
            <div class="session-ex-row">
              <div class="session-ex-name">
                ${ex.name}
                ${doneSets.length === 0 ? '<span class="skipped-badge">skipped</span>' : ''}
              </div>
              <div style="margin-top:4px">
                ${doneSets.map((s, i) =>
                    ex.isCardio
                      ? `<span class="session-set-pill">${s.note || 'done'}</span>`
                      : `<span class="session-set-pill">Set ${i+1}: ${s.weight ?? '?'} kg × ${s.reps ?? '?'}</span>`
                  ).join('')}
              </div>
            </div>
          `;
        }).join('') ?? ''}
      </div>
    </div>
  `;
}
