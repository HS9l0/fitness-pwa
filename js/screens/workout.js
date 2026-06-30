import { WORKOUTS, getTodayWorkoutDay } from '../data.js';
import { getSessions, saveSession, getLastWeights, today } from '../store.js';
import { showWeightPicker, showRepsPicker } from '../drum-picker.js';

const ICO_CHEVRON_R = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>`;
const ICO_CHECK = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>`;
const ICO_FLAME = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#f0a500" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2C10 6 7 9 7 13a5 5 0 0010 0c0-4-2.5-7-5-11z"/><path d="M12 13c-1.1.8-2 2-2 3a2 2 0 004 0c0-1-.9-2.2-2-3z" fill="#f0a500" stroke="none"/></svg>`;
const ICO_CLOCK = `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 14.5 14.5"/></svg>`;
const ICO_DUMBBELL = `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7v10M7 5v14M17 5v14M20 7v10"/><line x1="7" y1="12" x2="17" y2="12"/></svg>`;

let timerInterval = null;
let restInterval  = null;
let startTime     = null;
let activeSession = null;

function isPhone() {
  return window.matchMedia('(max-width: 479px)').matches;
}

export function renderWorkout(container, navigate) {
  const todayDay = getTodayWorkoutDay(); // 1, 2, 3, or null

  // Guard: if it's not a scheduled workout day, send back to home
  if (!todayDay && !activeSession) {
    navigate('home');
    return;
  }

  const workout = WORKOUTS[(todayDay ?? activeSession?.day ?? 1) - 1];

  if (activeSession) {
    renderActiveWorkout(container, workout, navigate);
    return;
  }

  container.innerHTML = `
    <div class="screen-header" style="display:flex;align-items:center;gap:14px;padding-bottom:12px">
      <button class="wkt-back-btn" id="wkt-back" style="margin-bottom:0;flex-shrink:0">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        Home
      </button>
      <div style="flex:1;min-width:0">
        <div style="font-size:0.82rem;font-weight:800;color:var(--text);letter-spacing:-0.2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${workout.label}</div>
        <div style="font-size:0.68rem;color:var(--text-muted);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${workout.focus}</div>
        <div style="font-size:0.65rem;color:var(--dim);margin-top:3px;display:flex;align-items:center;gap:10px">
          <span style="display:flex;align-items:center;gap:4px">${ICO_CLOCK} ~${workout.durationMin} min</span>
          <span style="display:flex;align-items:center;gap:4px">${ICO_DUMBBELL} ${workout.exercises.length} exercises</span>
        </div>
      </div>
    </div>
    <div class="section">
      <button class="btn-primary" id="begin-btn" style="margin-bottom:16px">Begin Workout ${ICO_CHEVRON_R}</button>
      <div class="section-title">Exercises Today</div>
      ${workout.exercises.map((ex, i) => `
        <div class="card" style="display:flex;align-items:center;gap:12px;padding:14px 16px;margin-bottom:8px">
          <div class="ex-num">${i + 1}</div>
          <div>
            <div style="font-size:0.88rem;font-weight:700">${ex.name}</div>
            <div style="font-size:0.72rem;color:var(--text-muted)">${ex.setsLabel} · ${ex.muscles}</div>
          </div>
        </div>
      `).join('')}
    </div>
  `;

  container.querySelector('#wkt-back').addEventListener('click', () => navigate('home'));
  container.querySelector('#begin-btn').addEventListener('click', () => {
    beginWorkout(todayDay);
    renderActiveWorkout(container, workout, navigate);
  });
}

function beginWorkout(day) {
  startTime     = Date.now();
  activeSession = {
    day,
    date: today(),
    exercises: WORKOUTS[day - 1].exercises.map(ex => ({
      name: ex.name,
      isCardio: ex.isCardio,
      sets: Array.from({ length: ex.defaultSets }, () => ({ done: false, weight: null, reps: null, note: '' }))
    }))
  };
}

function renderActiveWorkout(container, workout, navigate) {
  if (isPhone()) {
    renderPhoneWorkout(container, workout, navigate);
  } else {
    renderDesktopWorkout(container, workout, navigate);
  }
}

// ── Desktop layout ────────────────────────────────────────
function renderDesktopWorkout(container, workout, navigate) {
  const session = activeSession;
  const totalWorkoutSets = workout.exercises
    .filter(e => !e.isCardio)
    .reduce((sum, e) => sum + e.defaultSets, 0);
  let doneWorkoutSets = 0;

  container.style.paddingBottom = '';
  container.style.overflow = '';

  container.innerHTML = `
    <div class="workout-header">
      <div class="workout-header-left">
        <h2>${workout.label}</h2>
        <p id="wkt-progress">0 / ${totalWorkoutSets} sets</p>
      </div>
      <div class="wkt-timer-wrap">
        <div class="timer" id="workout-timer">0:00</div>
        <div class="timer-lbl">elapsed</div>
      </div>
    </div>
    <div class="section">
      ${workout.exercises.map((ex, i) => renderExerciseCard(ex, i + 1, getLastWeights(ex.name))).join('')}
      <button class="btn-primary" id="finish-btn" style="margin-top:8px;display:none">Finish Workout ${ICO_CHECK}</button>
    </div>
  `;

  startTimer(container.querySelector('#workout-timer'));

  container.querySelector('.exercise-card')?.classList.add('open');
  container.querySelectorAll('.exercise-card .ex-header').forEach(header => {
    header.addEventListener('click', () => header.closest('.exercise-card').classList.toggle('open'));
  });

  wireWorkoutEvents(container, session, workout, {
    incDone() { doneWorkoutSets++; },
    getTotalSets() { return totalWorkoutSets; },
    getDoneSets()  { return doneWorkoutSets; },
    onExComplete(_exCard, _allCards, nextCard) {
      _exCard?.classList.remove('open');
      nextCard?.classList.add('open');
      nextCard?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  container.querySelector('#finish-btn').addEventListener('click', () => finishWorkout(container, session, navigate));
}

// ── Phone layout ──────────────────────────────────────────
function renderPhoneWorkout(container, workout, navigate) {
  const session = activeSession;
  const total   = workout.exercises.length;
  let currentIdx = 0;

  container.style.paddingBottom = '0';
  container.style.overflow = 'hidden';

  container.innerHTML = `
    <div class="pwkt">
      <div class="pwkt-hdr">
        <button class="pwkt-back" id="pwkt-back-home">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><polyline points="15 18 9 12 15 6"/></svg>
          Home
        </button>
      </div>
      <div class="pwkt-stage" id="pwkt-stage">
        ${workout.exercises.map((ex, i) => renderExerciseCard(ex, i + 1, getLastWeights(ex.name))).join('')}
      </div>
      <div class="pwkt-foot">
        <button class="pwkt-arrow" id="pwkt-prev" aria-label="Previous">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <button class="btn-primary pwkt-center-btn" id="finish-btn">Next Exercise <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></button>
        <button class="pwkt-arrow" id="pwkt-next" aria-label="Next">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
    </div>
  `;

  startTimer(null);

  const allCards = [...container.querySelectorAll('.exercise-card')];

  function updateNav() {
    container.querySelector('#pwkt-prev').style.opacity = currentIdx === 0 ? '0.3' : '1';
    container.querySelector('#pwkt-next').style.opacity = currentIdx === allCards.length - 1 ? '0.3' : '1';
    const centerBtn = container.querySelector('#finish-btn');
    if (centerBtn) {
      if (currentIdx === allCards.length - 1) {
        centerBtn.innerHTML = 'Finish Workout ' + ICO_CHECK;
      } else {
        centerBtn.innerHTML = 'Next Exercise <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>';
      }
    }
  }

  function goToSlide(idx, dir = 'next') {
    if (idx < 0 || idx >= allCards.length) return;
    const leaving = allCards[currentIdx];
    const entering = allCards[idx];
    const outCls = dir === 'next' ? 'pwkt-slide-out-left'  : 'pwkt-slide-out-right';
    const inCls  = dir === 'next' ? 'pwkt-slide-in-right'  : 'pwkt-slide-in-left';

    leaving.classList.add(outCls);
    leaving.addEventListener('animationend', () => leaving.classList.remove('pwkt-active', outCls), { once: true });

    entering.classList.add('pwkt-active', inCls, 'open');
    entering.addEventListener('animationend', () => entering.classList.remove(inCls), { once: true });

    // Scroll stage to top when switching
    container.querySelector('#pwkt-stage').scrollTop = 0;

    currentIdx = idx;
    updateNav();
  }

  allCards[0]?.classList.add('pwkt-active', 'open');
  updateNav();

  container.querySelector('#pwkt-back-home').addEventListener('click', () => navigate('home'));
  container.querySelector('#pwkt-prev').addEventListener('click', () => goToSlide(currentIdx - 1, 'prev'));
  container.querySelector('#pwkt-next').addEventListener('click', () => goToSlide(currentIdx + 1, 'next'));

  wireWorkoutEvents(container, session, workout, {
    incDone() {},
    getTotalSets() { return 0; },
    getDoneSets()  { return 0; },
    onExComplete(_exCard, cards, nextCard) {
      if (!nextCard) return;
      goToSlide(cards.indexOf(nextCard), 'next');
    }
  });

  container.querySelector('#finish-btn').addEventListener('click', () => {
    if (currentIdx < allCards.length - 1) {
      goToSlide(currentIdx + 1, 'next');
    } else {
      container.style.paddingBottom = '';
      container.style.overflow = '';
      finishWorkout(container, session, navigate);
    }
  });
}

// ── Exercise card (inlined from plan.js) ─────────────────
function renderExerciseCard(ex, num, lastWeights) {
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
          ${renderSetRowsWithVideo(ex, lastWeights)}
        </div>
      </div>
    </div>
  `;
}

function renderSetRowsWithVideo(ex, lastWeights) {
  const setHtml   = renderSetRows(ex, lastWeights);
  const videoHtml = ex.videoId ? `
    <div style="margin-top:12px;border-top:1px solid var(--border);padding-top:12px">
      <a class="yt-search-btn" href="https://www.youtube.com/results?search_query=${encodeURIComponent(ex.name + ' exercise tutorial')}" target="_blank" rel="noopener">
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        Watch Tutorial
      </a>
    </div>` : '';
  return setHtml + videoHtml;
}

function renderSetRows(ex, lastWeights) {
  const lastW    = lastWeights?.weight ?? null;
  const lastR    = lastWeights?.reps   ?? null;

  const exId = ex.name.replace(/[^a-z0-9]/gi, '-');

  if (ex.isCardio) {
    return `
      <div class="cardio-section">
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
      <div class="set-row-body">
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
      <div class="set-row-summary"></div>
    </div>
  `;
  }).join('');

  return `
    <div class="sets-progress" id="sets-progress-${exId}">
      <div class="sets-progress-bar"><div class="sets-progress-fill" style="width:0%"></div></div>
      <span class="sets-progress-txt">0 / ${ex.defaultSets}</span>
    </div>
    <div class="sets-list">${rows}</div>
  `;
}

// ── Helpers ───────────────────────────────────────────────
function allExercisesDone(session) {
  return session.exercises.every(ex =>
    ex.isCardio
      ? ex.sets.some(s => s.done)
      : ex.sets.every(s => s.done)
  );
}

function revealFinish(container) {
  const btn = container.querySelector('#finish-btn');
  if (btn && btn.style.display === 'none') {
    btn.style.display = '';
    btn.classList.add('finish-reveal');
  }
}

// ── Shared event wiring ───────────────────────────────────
// Uses event delegation (one listener on container) so clicks on SVG children
// inside buttons are caught correctly on all browsers including iOS Safari.
function wireWorkoutEvents(container, session, workout, { incDone, getTotalSets, getDoneSets, onExComplete }) {
  container.addEventListener('click', e => {

    // ── Field tap: drum picker ──────────────────────────────
    const field = e.target.closest('.set-field-tap');
    if (field) {
      const row = field.closest('.set-row');
      if (!row || row.classList.contains('done') || row.classList.contains('skipped')) return;
      const setIdx = parseInt(row.dataset.set);
      const exName = row.dataset.ex;
      const label  = `${exName} — Set ${setIdx + 1}`;
      field.classList.add('pressed');
      setTimeout(() => field.classList.remove('pressed'), 200);
      if (field.dataset.type === 'weight') {
        showWeightPicker({
          weight: parseFloat(row.dataset.weight) || 0,
          label,
          onConfirm(newW) {
            row.dataset.weight = newW;
            const wVal = row.querySelector('.set-field[data-type="weight"] .set-val');
            if (wVal) { wVal.textContent = newW; wVal.classList.remove('empty'); }
          }
        });
      } else {
        showRepsPicker({
          reps: parseInt(row.dataset.reps) || 5,
          label,
          onConfirm(newR) {
            row.dataset.reps = newR;
            const rVal = row.querySelector('.set-field[data-type="reps"] .set-val');
            if (rVal) { rVal.textContent = newR; rVal.classList.remove('empty'); }
          }
        });
      }
      return;
    }

    // ── Skip ───────────────────────────────────────────────
    const skipBtn = e.target.closest('.set-skip-btn');
    if (skipBtn) {
      const row = skipBtn.closest('.set-row');
      if (!row || row.classList.contains('skipped') || row.classList.contains('done')) return;
      const exName    = skipBtn.dataset.ex;
      const setIdx    = parseInt(skipBtn.dataset.set);
      const exId      = exName.replace(/[^a-z0-9]/gi, '-');
      const exSession = session.exercises.find(ex => ex.name === exName);
      if (!exSession) return;

      exSession.sets[setIdx] = { done: true, skipped: true, weight: null, reps: null, note: '' };
      collapseSetRow(row,
        `<span class="set-sum-num">Set ${setIdx + 1}</span>`+
        `<span class="set-sum-icon is-skip">✕</span>`+
        `<span class="set-sum-lbl">Skipped</span>`);
      row.classList.add('skipped');
      if ('vibrate' in navigator) navigator.vibrate(20);

      const doneSets  = exSession.sets.filter(s => s.done).length;
      const totalSets = exSession.sets.length;
      const fill = container.querySelector(`#sets-progress-${exId} .sets-progress-fill`);
      const txt  = container.querySelector(`#sets-progress-${exId} .sets-progress-txt`);
      if (fill) fill.style.width = `${(doneSets / totalSets) * 100}%`;
      if (txt)  txt.textContent  = `${doneSets} / ${totalSets}`;
      if (allExercisesDone(session)) revealFinish(container);
      return;
    }

    // ── Done (check tick) ──────────────────────────────────
    const checkBtn = e.target.closest('.set-check-btn');
    if (checkBtn) {
      const row = checkBtn.closest('.set-row');
      if (!row || row.classList.contains('done') || row.classList.contains('skipped')) return;
      const exName    = checkBtn.dataset.ex;
      const setIdx    = parseInt(checkBtn.dataset.set);
      const exId      = exName.replace(/[^a-z0-9]/gi, '-');
      const exSession = session.exercises.find(ex => ex.name === exName);
      if (!exSession) return;

      const w = parseFloat(row.dataset.weight) || null;
      const r = parseInt(row.dataset.reps)     || null;

      // Block logging if weight or reps is missing/zero
      if (w === null || r === null) {
        if ('vibrate' in navigator) navigator.vibrate([30, 50, 30]);
        [['weight', w], ['reps', r]].forEach(([type, val]) => {
          if (val !== null) return;
          const f = row.querySelector(`.set-field[data-type="${type}"]`);
          if (!f) return;
          f.classList.remove('field-shake');
          void f.offsetWidth; // reflow to restart animation
          f.classList.add('field-shake');
          f.addEventListener('animationend', () => f.classList.remove('field-shake'), { once: true });
        });
        return;
      }

      exSession.sets[setIdx] = { done: true, weight: w, reps: r, note: '' };
      const unit   = row.querySelector('.set-field[data-type="weight"] .set-field-lbl')?.textContent ?? 'kg';
      const detail = w !== null && r !== null ? `${w} ${unit} × ${r}` : '';
      collapseSetRow(row,
        `<span class="set-sum-num">Set ${setIdx + 1}</span>`+
        `<span class="set-sum-icon is-done">✓</span>`+
        (detail ? `<span class="set-sum-detail">${detail}</span>` : ''));
      row.classList.add('done');
      if ('vibrate' in navigator) navigator.vibrate(40);

      const doneSets  = exSession.sets.filter(s => s.done).length;
      const totalSets = exSession.sets.length;
      const fill = container.querySelector(`#sets-progress-${exId} .sets-progress-fill`);
      const txt  = container.querySelector(`#sets-progress-${exId} .sets-progress-txt`);
      if (fill) fill.style.width = `${(doneSets / totalSets) * 100}%`;
      if (txt)  txt.textContent  = `${doneSets} / ${totalSets}`;

      incDone();
      const wktProg = container.querySelector('#wkt-progress');
      if (wktProg) wktProg.textContent = `${getDoneSets()} / ${getTotalSets()} sets`;
      if (allExercisesDone(session)) revealFinish(container);

      if (doneSets === totalSets) {
        const exCard   = container.querySelector(`.exercise-card[data-ex-name="${exName}"]`);
        exCard?.classList.add('ex-complete');
        const allCards = [...container.querySelectorAll('.exercise-card')];
        const nextCard = allCards[allCards.indexOf(exCard) + 1];
        document.activeElement?.blur();
        showRestTimer(container, 90, nextCard ? () => onExComplete(exCard, allCards, nextCard) : null);
      } else {
        document.activeElement?.blur();
        showRestTimer(container, 90);
      }
      return;
    }

    // ── Cardio done toggle ─────────────────────────────────
    const cardioBtn = e.target.closest('.cardio-done-btn');
    if (cardioBtn) {
      const exName    = cardioBtn.dataset.ex;
      const noteInput = container.querySelector(`.set-note[data-ex="${exName}"]`);
      const exSession = session.exercises.find(ex => ex.name === exName);
      if (!exSession) return;
      const isDone = cardioBtn.classList.toggle('done');
      exSession.sets[0] = { done: isDone, weight: null, reps: null, note: noteInput?.value || '' };
      if ('vibrate' in navigator) navigator.vibrate(isDone ? 40 : 20);
      const exCard = container.querySelector(`.exercise-card[data-ex-name="${exName}"]`);
      exCard?.classList.toggle('ex-complete', isDone);
      if (isDone) {
        if (allExercisesDone(session)) revealFinish(container);
        document.activeElement?.blur();
        const allCards = [...container.querySelectorAll('.exercise-card')];
        const nextCard = allCards[allCards.indexOf(exCard) + 1];
        showRestTimer(container, 90, nextCard ? () => onExComplete(exCard, allCards, nextCard) : null);
      }
    }
  });
}

// ── Set row collapse (JS-driven so no CSS cache issues) ───
function collapseSetRow(row, summaryHtml) {
  const body    = row.querySelector('.set-row-body');
  const summary = row.querySelector('.set-row-summary');
  if (!body || !summary) return;

  // Lock height to measured value, then animate to 0
  const h = body.scrollHeight;
  body.style.height    = h + 'px';
  body.style.overflow  = 'hidden';
  body.style.transition = 'height 0.32s cubic-bezier(0.4,0,0.2,1), opacity 0.2s ease';
  requestAnimationFrame(() => {
    body.style.height  = '0';
    body.style.opacity = '0';
  });

  // Populate and fade-in summary after body has collapsed
  summary.innerHTML      = summaryHtml;
  summary.style.display  = 'flex';
  summary.style.opacity  = '0';
  summary.style.transition = 'opacity 0.22s ease';
  setTimeout(() => { summary.style.opacity = '1'; }, 240);
}

// ── Helpers ───────────────────────────────────────────────
function startTimer(el) {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    if (el) el.textContent = `${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, '0')}`;
  }, 1000);
}

function finishWorkout(container, session, navigate) {
  clearInterval(timerInterval); timerInterval = null;
  clearInterval(restInterval);  restInterval  = null;
  document.querySelector('.rest-overlay')?.remove();
  session.durationMin = Math.max(1, Math.round((Date.now() - startTime) / 60000));
  saveSession(session);
  const btn = container.querySelector('#finish-btn');
  if (btn) { btn.classList.add('finishing'); btn.innerHTML = `${ICO_CHECK} Saved`; }
  setTimeout(() => { activeSession = null; navigate('home'); }, 600);
}

// ── Rest Timer ────────────────────────────────────────────
function showRestTimer(container, seconds, onDone) {
  clearInterval(restInterval);
  restInterval = null;
  document.querySelector('.rest-overlay')?.remove();

  const CIRC = 2 * Math.PI * 32;
  let remaining = seconds;
  let total     = seconds;

  const overlay = document.createElement('div');
  overlay.className = 'rest-overlay';
  overlay.innerHTML = `
    <div class="rest-card">
      <div class="rest-lbl">${onDone ? `Rest · Next ${ICO_CHEVRON_R}` : 'Rest'}</div>

      <div class="rest-arc-wrap">
        <svg viewBox="0 0 72 72" class="rest-arc-svg">
          <circle cx="36" cy="36" r="32" class="rest-arc-bg"/>
          <circle cx="36" cy="36" r="32" class="rest-arc-fill" id="rest-fill"
            stroke-dasharray="${CIRC.toFixed(1)}" stroke-dashoffset="0"
            transform="rotate(-90 36 36)"/>
        </svg>
        <div class="rest-arc-inner">
          <span class="rest-count" id="rest-count">${fmtRest(remaining)}</span>
        </div>
      </div>
      <div class="rest-btns">
        <button class="rest-btn-add" id="rest-add">+30s</button>
        <button class="rest-btn-skip" id="rest-skip">${onDone ? `Skip ${ICO_CHEVRON_R}` : 'Skip'}</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  // Position above the workout footer if present, otherwise above the tab nav
  const foot = document.querySelector('.pwkt-foot');
  if (foot) {
    const footTop = foot.getBoundingClientRect().top;
    overlay.style.bottom = `${window.innerHeight - footTop + 12}px`;
  }

  const countEl = overlay.querySelector('#rest-count');
  const arcEl   = overlay.querySelector('#rest-fill');

  function finish() {
    clearInterval(restInterval); restInterval = null;
    if ('vibrate' in navigator) navigator.vibrate([180, 80, 180]);
    overlay.querySelector('.rest-card')?.classList.add('rest-done');
    setTimeout(() => { overlay.remove(); onDone?.(); }, 1100);
  }

  function tick() {
    remaining--;
    if (remaining <= 0) { finish(); return; }
    countEl.textContent = fmtRest(remaining);
    arcEl.style.strokeDashoffset = (CIRC * (1 - remaining / total)).toFixed(1);
  }

  restInterval = setInterval(tick, 1000);

  overlay.querySelector('#rest-skip').addEventListener('click', () => {
    clearInterval(restInterval); restInterval = null;
    overlay.remove();
    onDone?.();
  });
  overlay.querySelector('#rest-add').addEventListener('click', () => {
    remaining += 30;
    total     += 30;
    countEl.textContent = fmtRest(remaining);
    arcEl.style.strokeDashoffset = (CIRC * (1 - remaining / total)).toFixed(1);
  });
}

function fmtRest(s) {
  const m = Math.floor(s / 60), sec = s % 60;
  return m > 0 ? `${m}:${sec.toString().padStart(2, '0')}` : `${s}s`;
}
