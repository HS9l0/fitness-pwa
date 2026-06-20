import { WORKOUTS } from '../data.js';

let activeTab = 0;

export function renderPlan(container) {
  container.innerHTML = `
    <div class="screen-header">
      <div class="badge">Full Program</div>
      <h1>Your Plan</h1>
      <p>All exercises with instructions</p>
    </div>
    <div class="plan-tabs">
      ${WORKOUTS.map((w, i) => `
        <button class="plan-tab ${i === activeTab ? 'active' : ''}" data-tab="${i}">
          Day ${w.day}
        </button>
      `).join('')}
    </div>
    <div id="plan-content" class="section"></div>
  `;

  renderPlanTab(container, activeTab);

  container.querySelectorAll('.plan-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      activeTab = parseInt(btn.dataset.tab);
      container.querySelectorAll('.plan-tab').forEach(b => b.classList.toggle('active', b === btn));
      renderPlanTab(container, activeTab);
    });
  });
}

function renderPlanTab(container, tabIndex) {
  const workout = WORKOUTS[tabIndex];
  const content = container.querySelector('#plan-content');
  content.innerHTML = `
    <div class="card" style="margin-bottom:12px;background:rgba(255,165,0,0.06);border-color:rgba(255,165,0,0.2)">
      <div style="display:flex;gap:10px;align-items:flex-start">
        <span style="font-size:1.3rem;flex-shrink:0">🔥</span>
        <div>
          <div style="font-size:0.78rem;font-weight:700;color:#f0a500;margin-bottom:4px">Warm-Up (5 min)</div>
          <div style="font-size:0.8rem;color:var(--text-muted);line-height:1.5">${workout.warmup}</div>
        </div>
      </div>
    </div>
    <div class="plan-exercise-grid">
      ${workout.exercises.map((ex, i) => renderExerciseCard(ex, i + 1, false)).join('')}
    </div>
    <div class="card" style="margin-top:4px;background:rgba(61,142,248,0.06);border-color:rgba(61,142,248,0.2)">
      <div style="font-size:0.78rem;font-weight:700;color:var(--accent-blue);margin-bottom:8px">❄️ Cool-Down</div>
      <ul style="padding-left:16px">
        ${workout.cooldown.map(c => `<li style="font-size:0.8rem;color:var(--text-muted);padding:3px 0;line-height:1.5">${c}</li>`).join('')}
      </ul>
    </div>
  `;

  content.querySelectorAll('.exercise-card').forEach(card => {
    card.querySelector('.ex-header').addEventListener('click', () => {
      card.classList.toggle('open');
    });
  });
}

export function renderExerciseCard(ex, num, isWorkoutMode, lastWeights) {
  const detailsHtml = `
    <div class="detail-grid">
      <div class="detail-box"><div class="d-label">How to do it</div><div class="d-val">${ex.howTo}</div></div>
      <div class="detail-box"><div class="d-label">Key points</div><div class="d-val">${ex.keyPoints}</div></div>
      ${ex.settings ? `<div class="detail-box"><div class="d-label">Settings / weight</div><div class="d-val">${ex.settings}</div></div>` : ''}
      ${ex.ifTooHard ? `<div class="detail-box"><div class="d-label">If too hard</div><div class="d-val">${ex.ifTooHard}</div></div>` : ''}
    </div>
    <div class="tip-box"><strong>Common mistake:</strong> ${ex.commonMistake}</div>
  `;

  const bodyHtml = isWorkoutMode ? renderSetRows(ex, lastWeights) : detailsHtml;

  return `
    <div class="exercise-card" data-ex-name="${ex.name}">
      <div class="ex-header">
        <div class="ex-num">${num}</div>
        <div class="ex-info">
          <div class="ex-name">${ex.name}</div>
          <div class="ex-muscles">${ex.muscles}</div>
        </div>
        <div class="ex-meta">${ex.setsLabel}</div>
        <div class="ex-chevron">▶</div>
      </div>
      <div class="ex-body">
        ${bodyHtml}
      </div>
    </div>
  `;
}

function renderSetRows(ex, lastWeights) {
  const lastHint = lastWeights
    ? (ex.isCardio
        ? (lastWeights.note ? `Last: ${lastWeights.note}` : 'Done before')
        : `Last: ${lastWeights.weight ?? '?'} kg × ${lastWeights.reps ?? '?'} reps`)
    : 'First time — start light';

  if (ex.isCardio) {
    return `
      <div class="cardio-note">
        <div style="font-size:0.8rem;color:var(--text-muted);line-height:1.5;margin-bottom:10px">${ex.howTo}</div>
        <div style="font-size:0.72rem;color:var(--text-dim);margin-bottom:10px">${lastHint}</div>
        <label style="font-size:0.72rem;color:var(--text-dim);display:block;margin-bottom:4px">Notes (optional)</label>
        <input type="text" class="set-note" placeholder="e.g. 10 min, ran at 11 km/h" data-ex="${ex.name}" style="width:100%" />
        <label style="display:flex;align-items:center;gap:8px;margin-top:12px;font-size:0.85rem;color:var(--text-muted);cursor:pointer">
          <input type="checkbox" class="cardio-done" data-ex="${ex.name}" style="width:18px;height:18px;accent-color:var(--accent);flex-shrink:0" />
          Mark as done
        </label>
      </div>
    `;
  }

  const rows = Array.from({ length: ex.defaultSets }, (_, i) => `
    <div class="set-row" data-set="${i}" data-ex="${ex.name}">
      <div class="set-num">${i + 1}</div>
      <input type="number" class="set-weight" min="0" max="999" step="2.5"
        placeholder="${lastWeights?.weight ?? 'kg'}" data-ex="${ex.name}" data-set="${i}" />
      <input type="number" class="set-reps" min="0" max="99"
        placeholder="${lastWeights?.reps ?? 'reps'}" data-ex="${ex.name}" data-set="${i}" />
      <button class="set-check" data-ex="${ex.name}" data-set="${i}">✓</button>
    </div>
  `).join('');

  return `
    <div style="font-size:0.72rem;color:var(--text-dim);padding:10px 0 6px">${lastHint}</div>
    <div class="sets-header">
      <div></div>
      <div>Weight</div>
      <div>Reps</div>
      <div></div>
    </div>
    ${rows}
    <div style="font-size:0.71rem;color:var(--text-dim);padding:8px 0 0">Tap ✓ after completing each set</div>
  `;
}
