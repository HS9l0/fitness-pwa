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

  content.querySelectorAll('.video-thumb').forEach(thumb => {
    thumb.addEventListener('click', e => { e.stopPropagation(); embedVideo(thumb); });
  });
}

export function embedVideo(thumb) {
  const vid = thumb.dataset.vid;
  const iframe = document.createElement('iframe');
  iframe.className = 'video-frame';
  iframe.src = `https://www.youtube-nocookie.com/embed/${vid}?autoplay=1`;
  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute('allow', 'autoplay; encrypted-media');
  iframe.setAttribute('frameborder', '0');
  thumb.replaceWith(iframe);
}

export function renderExerciseCard(ex, num, isWorkoutMode, lastWeights) {
  const videoHtml = ex.videoId ? `
    <div class="video-wrap">
      <div class="video-thumb" data-vid="${ex.videoId}">
        <img src="https://img.youtube.com/vi/${ex.videoId}/mqdefault.jpg" alt="Tutorial" loading="lazy" />
        <div class="play-overlay">
          <div class="play-circle">▶</div>
          <span class="play-label">Watch tutorial</span>
        </div>
      </div>
    </div>` : '';

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
        <div class="ex-chevron">▶</div>
      </div>
      <div class="ex-body">
        ${bodyHtml}
      </div>
    </div>
  `;
}

function renderSetRowsWithVideo(ex, lastWeights) {
  const setHtml = renderSetRows(ex, lastWeights);
  const videoHtml = ex.videoId ? `
    <div class="video-wrap" style="margin-top:14px;border-top:1px solid var(--border);padding-top:14px">
      <div class="video-thumb" data-vid="${ex.videoId}">
        <img src="https://img.youtube.com/vi/${ex.videoId}/mqdefault.jpg" alt="Tutorial" loading="lazy" />
        <div class="play-overlay">
          <div class="play-circle">▶</div>
          <span class="play-label">Watch tutorial</span>
        </div>
      </div>
    </div>` : '';
  return setHtml + videoHtml;
}

function renderSetRows(ex, lastWeights) {
  const lastHint = lastWeights
    ? (ex.isCardio
        ? (lastWeights.note ? `Last time: ${lastWeights.note}` : 'Done before')
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
    <div style="font-size:0.72rem;color:var(--text-dim);padding:8px 0 6px">${lastHint}</div>
    <div class="sets-header">
      <div></div><div>Weight</div><div>Reps</div><div></div>
    </div>
    ${rows}
    <div style="font-size:0.7rem;color:var(--text-dim);padding:8px 0 0">Tap ✓ after each set</div>
  `;
}
