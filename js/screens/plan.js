import { WORKOUTS } from '../data.js';

let activeTab = 0;

export function renderPlan(container) {
  container.innerHTML = `
    <div class="screen-header">
      <div class="badge">Full Program</div>
      <h1>Your Plan</h1>
      <p>3 days · 17 exercises · videos included</p>
    </div>
    <div class="plan-tabs">
      ${WORKOUTS.map((w, i) => `
        <button class="plan-tab ${i === activeTab ? 'active' : ''}" data-tab="${i}">
          ${w.label.split('—')[1]?.trim() ?? `Day ${w.day}`}
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
    <div class="plan-overview">
      <div class="plan-ov-item"><span>${workout.durationMin}</span> min</div>
      <div class="plan-ov-sep"></div>
      <div class="plan-ov-item"><span>${workout.exercises.length}</span> exercises</div>
      <div class="plan-ov-sep"></div>
      <div class="plan-ov-item"><span>${workout.weekday}</span></div>
    </div>

    <div class="card warmup-card">
      <div style="display:flex;gap:10px;align-items:flex-start">
        <span style="font-size:1.2rem;flex-shrink:0">🔥</span>
        <div>
          <div class="warmup-title">Warm-Up · 5 min</div>
          <div class="warmup-body">${workout.warmup}</div>
        </div>
      </div>
    </div>

    <div class="plan-exercise-grid">
      ${workout.exercises.map((ex, i) => renderExerciseCard(ex, i + 1, false)).join('')}
    </div>

    <div class="card cooldown-card">
      <div class="cooldown-title">❄️ Cool-Down</div>
      <ul class="cooldown-list">
        ${workout.cooldown.map(c => `<li>${c}</li>`).join('')}
      </ul>
    </div>
  `;

  content.querySelectorAll('.exercise-card .ex-header').forEach(header => {
    header.addEventListener('click', () => header.closest('.exercise-card').classList.toggle('open'));
  });

}

export function renderExerciseCard(ex, num, isWorkoutMode, lastWeights) {
  const videoHtml = ex.videoId ? `
    <a class="yt-search-btn" href="https://www.youtube.com/results?search_query=${encodeURIComponent(ex.name + ' exercise tutorial')}" target="_blank" rel="noopener">
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"/></svg>
      Search on YouTube
    </a>` : '';

  const detailsHtml = `
    ${videoHtml}
    <div class="detail-grid">
      <div class="detail-box"><div class="d-label">How to do it</div><div class="d-val">${ex.howTo}</div></div>
      <div class="detail-box"><div class="d-label">Key points</div><div class="d-val">${ex.keyPoints}</div></div>
      ${ex.settings ? `<div class="detail-box"><div class="d-label">Settings / weight</div><div class="d-val">${ex.settings}</div></div>` : ''}
      ${ex.ifTooHard ? `<div class="detail-box"><div class="d-label">If too hard</div><div class="d-val">${ex.ifTooHard}</div></div>` : ''}
    </div>
    <div class="tip-box"><strong>Common mistake:</strong> ${ex.commonMistake}</div>
  `;

  const workoutBodyHtml = `
    ${renderSetRows(ex, lastWeights)}
    ${videoHtml ? `<div class="workout-video-toggle">
      <div class="video-wrap" style="margin-top:14px">${videoHtml.replace('<div class="video-wrap">', '').replace('</div>', '').trimEnd().slice(0, -6)}</div>
    </div>` : ''}
  `;

  const bodyHtml = isWorkoutMode
    ? renderSetRowsWithVideo(ex, lastWeights)
    : detailsHtml;

  return `
    <div class="exercise-card" data-ex-name="${ex.name}">
      <div class="ex-header">
        <div class="ex-num">${num}</div>
        <div class="ex-info">
          <div class="ex-name">${ex.name}</div>
          <div class="ex-muscles">${ex.muscles}</div>
        </div>
        <div class="ex-meta">${ex.setsLabel}</div>
        <svg class="ex-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><polyline points="9 18 15 12 9 6"/></svg>
      </div>
      <div class="ex-body-outer">
        <div class="ex-body">
          ${bodyHtml}
        </div>
      </div>
    </div>
  `;
}

function renderSetRowsWithVideo(ex, lastWeights) {
  const setHtml = renderSetRows(ex, lastWeights);
  const videoHtml = ex.videoId ? `
    <div style="margin-top:12px;border-top:1px solid var(--border);padding-top:12px">
      <a class="yt-search-btn" href="https://www.youtube.com/results?search_query=${encodeURIComponent(ex.name + ' exercise tutorial')}" target="_blank" rel="noopener">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"/></svg>
        Search on YouTube
      </a>
    </div>` : '';
  return setHtml + videoHtml;
}

function renderSetRows(ex, lastWeights) {
  const lastW    = lastWeights?.weight ?? null;
  const lastR    = lastWeights?.reps   ?? null;
  const lastNote = lastWeights?.note   ?? null;
  const lastHint = lastWeights
    ? (ex.isCardio
        ? (lastNote ? `Last: ${lastNote}` : 'Done before ✓')
        : `Last: ${lastW ?? '?'} kg × ${lastR ?? '?'} reps`)
    : 'First time — start light';

  const exId = ex.name.replace(/[^a-z0-9]/gi, '-');

  if (ex.isCardio) {
    return `
      <div class="cardio-section">
        <div class="set-last-hint">${lastHint}</div>
        <div style="margin-bottom:12px">
          <label class="set-last-hint" style="display:block;margin-bottom:5px">Notes (optional)</label>
          <input type="text" class="set-note" placeholder="e.g. 10 min, 11 km/h" data-ex="${ex.name}"/>
        </div>
        <button class="cardio-done-btn" data-ex="${ex.name}">
          <span class="cardio-done-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><polyline points="20 6 9 17 4 12"/></svg>
          </span>
          <span class="cardio-done-label">Mark as Done</span>
        </button>
      </div>
    `;
  }

  const rows = Array.from({ length: ex.defaultSets }, (_, i) => {
    const initW = lastW ?? 0;
    const initR = lastR ?? 5;
    return `
    <div class="set-row" data-set="${i}" data-ex="${ex.name}" data-weight="${initW}" data-reps="${initR}">
      <div class="set-row-top">
        <span class="set-num">${i + 1}</span>
        <div class="set-fields">
          <div class="set-field set-field-tap" data-type="weight">
            <div class="set-val${!lastW ? ' empty' : ''}">${initW}</div>
            <span class="set-field-lbl">kg</span>
          </div>
          <span class="set-sep">×</span>
          <div class="set-field set-field-tap" data-type="reps">
            <div class="set-val${!lastR ? ' empty' : ''}">${initR}</div>
            <span class="set-field-lbl">reps</span>
          </div>
        </div>
      </div>
      <div class="set-row-foot">
        <button class="set-skip-btn" data-ex="${ex.name}" data-set="${i}" aria-label="Skip set">Skip</button>
        <button class="set-check-btn" data-ex="${ex.name}" data-set="${i}" aria-label="Log set">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="17" height="17"><polyline points="20 6 9 17 4 12"/></svg>
        </button>
      </div>
    </div>
  `;
  }).join('');

  return `
    <div class="set-last-hint">${lastHint}</div>
    <div class="sets-progress" id="sets-progress-${exId}">
      <div class="sets-progress-bar"><div class="sets-progress-fill" style="width:0%"></div></div>
      <span class="sets-progress-txt">0 / ${ex.defaultSets}</span>
    </div>
    <div class="sets-list">${rows}</div>
  `;
}
