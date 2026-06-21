import { getSessions, getWeightLog, addWeightEntry, today as getToday, getSettings } from '../store.js';

export function renderProgress(container) {
  const sessions   = getSessions();
  const unit       = getSettings().weightUnit ?? 'kg';
  const weightLog  = getWeightLog();
  const chartExs   = getChartableExercises(sessions);
  const prs        = computePRs(sessions, unit);

  container.innerHTML = `
    <div class="screen-header">
      <div class="badge">Analytics</div>
      <h1>Progress</h1>
      <p>Your training at a glance</p>
    </div>

    <div class="section">
      <div class="section-title">90-Day Activity</div>
      <div class="card" style="padding:14px 10px 10px">
        ${buildHeatmap(sessions)}
      </div>
    </div>

    <div class="section">
      <div class="section-title">Personal Records</div>
      ${buildPRs(prs, unit)}
    </div>

    <div class="section">
      <div class="section-title">Strength Trend</div>
      <div class="card">
        ${chartExs.length ? `
          <select id="ex-select" class="prog-select">
            ${chartExs.map(n => `<option value="${escH(n)}">${escH(n)}</option>`).join('')}
          </select>
          <div id="chart-area" style="margin-top:12px">${buildExChart(sessions, chartExs[0], unit)}</div>
        ` : '<p class="chart-empty">Complete weighted exercises to see trends.</p>'}
      </div>
    </div>

    <div class="section">
      <div class="section-title">Body Weight</div>
      ${buildWeightSection(unit, weightLog)}
    </div>
  `;

  container.querySelector('#ex-select')?.addEventListener('change', e => {
    const el = container.querySelector('#chart-area');
    if (el) el.innerHTML = buildExChart(sessions, e.target.value, unit);
  });

  container.querySelector('#weight-submit')?.addEventListener('click', () => {
    const inp = container.querySelector('#weight-input');
    const val = parseFloat(inp.value);
    if (!val || val < 20 || val > 500) return;
    addWeightEntry(getToday(), val);
    renderProgress(container);
  });
}

// ── Heatmap ──────────────────────────────────────────────
function buildHeatmap(sessions) {
  const sessionDates = new Set(sessions.map(s => s.date));
  const todayStr  = getToday();
  const todayDate = new Date(todayStr + 'T12:00:00');

  const start = new Date(todayDate);
  start.setDate(start.getDate() - 89);
  const dow = (start.getDay() + 6) % 7;
  start.setDate(start.getDate() - dow);

  const end = new Date(todayDate);
  const endDow = (end.getDay() + 6) % 7;
  end.setDate(end.getDate() + (6 - endDow));

  const days = [];
  const d = new Date(start);
  while (d <= end) {
    const ds = d.toISOString().slice(0, 10);
    days.push({ ds, has: sessionDates.has(ds), isToday: ds === todayStr, future: d > todayDate });
    d.setDate(d.getDate() + 1);
  }

  const months = [];
  let lastM = -1;
  days.forEach((day, i) => {
    if (day.future) return;
    const m = new Date(day.ds + 'T12:00:00').getMonth();
    if (m !== lastM) {
      months.push({ col: Math.floor(i / 7) + 1, name: new Date(day.ds + 'T12:00:00').toLocaleDateString('en', { month: 'short' }) });
      lastM = m;
    }
  });

  const numCols = days.length / 7;

  return `
    <div class="heatmap-outer">
      <div class="heatmap-day-labels">
        ${['M','','W','','F','',''].map(l => `<span>${l}</span>`).join('')}
      </div>
      <div class="heatmap-right">
        <div class="heatmap-months" style="grid-template-columns:repeat(${numCols},14px)">
          ${months.map(m => `<span class="hm-month" style="grid-column:${m.col}">${m.name}</span>`).join('')}
        </div>
        <div class="heatmap-grid">
          ${days.map(day => `<div class="hm-cell${day.has ? ' hm-on' : ''}${day.isToday ? ' hm-today' : ''}${day.future ? ' hm-future' : ''}" title="${day.future ? '' : day.ds}"></div>`).join('')}
        </div>
      </div>
    </div>
    <div class="heatmap-legend">
      <span>Less</span>
      <div class="hm-cell"></div>
      <div class="hm-cell hm-on" style="opacity:0.35"></div>
      <div class="hm-cell hm-on"></div>
      <span>More</span>
    </div>
  `;
}

// ── Personal Records ──────────────────────────────────────
function computePRs(sessions) {
  const prs = {};
  for (const s of sessions) {
    for (const ex of (s.exercises ?? [])) {
      if (ex.isCardio) continue;
      for (const set of (ex.sets ?? [])) {
        if (!set.done || !set.weight) continue;
        const w = parseFloat(set.weight);
        if (!w) continue;
        if (!prs[ex.name] || w > prs[ex.name].weight) {
          prs[ex.name] = { weight: w, reps: set.reps, date: s.date };
        }
      }
    }
  }
  return prs;
}

function buildPRs(prs, unit) {
  const entries = Object.entries(prs);
  if (!entries.length) return `<p class="chart-empty">Complete weighted exercises to unlock records.</p>`;
  entries.sort(([a], [b]) => a.localeCompare(b));
  return `<div class="pr-grid">${entries.map(([name, pr]) => `
    <div class="pr-item">
      <div class="pr-name">${escH(name)}</div>
      <div class="pr-weight">${pr.weight}<span style="font-size:0.58rem;color:var(--text-dim);margin-left:3px">${unit}</span></div>
      <div class="pr-detail">${pr.reps} reps · ${pr.date}</div>
    </div>`).join('')}</div>`;
}

// ── Exercise chart ────────────────────────────────────────
function getChartableExercises(sessions) {
  const counts = {};
  for (const s of sessions) {
    for (const ex of (s.exercises ?? [])) {
      if (ex.isCardio) continue;
      if ((ex.sets ?? []).some(st => st.done && parseFloat(st.weight) > 0))
        counts[ex.name] = (counts[ex.name] ?? 0) + 1;
    }
  }
  return Object.entries(counts).filter(([, c]) => c >= 1).map(([n]) => n).sort();
}

function buildExChart(sessions, exerciseName, unit) {
  const map = {};
  for (const s of sessions) {
    const ex = s.exercises?.find(e => e.name === exerciseName);
    if (!ex) continue;
    const maxW = Math.max(0, ...(ex.sets ?? []).filter(st => st.done && st.weight).map(st => parseFloat(st.weight) || 0));
    if (maxW > 0) map[s.date] = map[s.date] ? Math.max(map[s.date], maxW) : maxW;
  }
  const pts = Object.entries(map).sort(([a], [b]) => a.localeCompare(b)).map(([date, w]) => ({ date, w }));
  if (pts.length < 2) return `<p class="chart-empty">Log ${escH(exerciseName)} in more sessions to see your trend.</p>`;
  return drawSVGChart(pts);
}

// ── SVG chart ─────────────────────────────────────────────
function drawSVGChart(pts) {
  const VW = 320, VH = 130, PL = 34, PR = 10, PT = 10, PB = 20;
  const CW = VW - PL - PR, CH = VH - PT - PB;
  const n = pts.length;

  const vals = pts.map(p => p.w);
  const minV = Math.floor(Math.min(...vals) * 0.94);
  const maxV = Math.ceil(Math.max(...vals) * 1.06);
  const range = maxV - minV || 1;

  const x = i => PL + (i / (n - 1)) * CW;
  const y = v => PT + CH - ((v - minV) / range) * CH;

  const linePts = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p.w).toFixed(1)}`).join(' ');
  const area    = `${linePts} L${x(n-1).toFixed(1)},${(PT+CH).toFixed(1)} L${x(0).toFixed(1)},${(PT+CH).toFixed(1)} Z`;

  const yTicks = [minV, Math.round(minV + range / 2), maxV];
  const xLabels = n <= 5
    ? pts.map((p, i) => ({ i, label: p.date.slice(5) }))
    : [0, Math.floor(n / 2), n - 1].map(i => ({ i, label: pts[i].date.slice(5) }));

  return `
    <svg viewBox="0 0 ${VW} ${VH}" class="prog-chart-svg">
      ${yTicks.map(v => `
        <line x1="${PL}" y1="${y(v).toFixed(1)}" x2="${VW-PR}" y2="${y(v).toFixed(1)}" stroke="#353029" stroke-width="0.7"/>
        <text x="${PL-4}" y="${y(v).toFixed(1)}" text-anchor="end" dominant-baseline="middle" fill="#534a43" font-size="8">${Math.round(v)}</text>
      `).join('')}
      ${xLabels.map(({ i, label }) => `<text x="${x(i).toFixed(1)}" y="${VH-3}" text-anchor="middle" fill="#534a43" font-size="8">${label}</text>`).join('')}
      <path d="${area}" fill="rgba(249,115,22,0.1)"/>
      <path d="${linePts}" fill="none" stroke="#f97316" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
      ${pts.map((p, i) => `<circle cx="${x(i).toFixed(1)}" cy="${y(p.w).toFixed(1)}" r="2.5" fill="#f97316" stroke="#0f0e0d" stroke-width="1.5"/>`).join('')}
    </svg>
  `;
}

// ── Body weight section ───────────────────────────────────
function buildWeightSection(unit, weightLog) {
  const entries   = Object.entries(weightLog).sort(([a], [b]) => a.localeCompare(b));
  const todayStr  = getToday();
  const todayVal  = weightLog[todayStr] ?? '';
  const lastOther = entries.filter(([d]) => d !== todayStr).at(-1);
  const chartPts  = entries.slice(-30).map(([date, w]) => ({ date, w }));

  return `
    <div class="card">
      <div style="display:flex;gap:8px;align-items:center${chartPts.length >= 2 ? ';margin-bottom:14px' : ''}">
        <input type="number" id="weight-input" placeholder="Today (${unit})" value="${todayVal}" min="20" max="500" step="0.1" style="flex:1"/>
        <button class="btn-primary" id="weight-submit" style="width:auto;padding:10px 18px;flex-shrink:0">Log</button>
      </div>
      ${lastOther ? `<div style="font-size:0.7rem;color:var(--text-dim);margin-bottom:12px">Last: ${lastOther[1]} ${unit} on ${lastOther[0]}</div>` : ''}
      ${chartPts.length >= 2 ? drawSVGChart(chartPts) : `<p class="chart-empty" style="margin-top:10px">Log your weight on 2+ days to see your trend.</p>`}
      ${entries.length ? `
        <div class="weight-recent">
          ${entries.slice(-5).reverse().map(([date, val]) => `
            <div class="weight-row">
              <span class="weight-row-date">${date}</span>
              <span class="weight-row-val">${val} ${unit}</span>
            </div>`).join('')}
        </div>` : ''}
    </div>
  `;
}

function escH(s) {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
