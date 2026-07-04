import { WORKOUTS, getTodayWorkoutDay } from '../data.js';
import { getSessions, saveSession, getLastWeights, today } from '../store.js';
import { showWeightPicker, showRepsPicker } from '../drum-picker.js';

const ICO_CHEVRON_R = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>`;
const ICO_CHECK = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>`;
const ICO_FLAME = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#f0a500" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2C10 6 7 9 7 13a5 5 0 0010 0c0-4-2.5-7-5-11z"/><path d="M12 13c-1.1.8-2 2-2 3a2 2 0 004 0c0-1-.9-2.2-2-3z" fill="#f0a500" stroke="none"/></svg>`;
const ICO_CLOCK = `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 14.5 14.5"/></svg>`;
const ICO_DUMBBELL = `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 7v10M7 5v14M17 5v14M20 7v10"/><line x1="7" y1="12" x2="17" y2="12"/></svg>`;
const ICO_PLAY = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><polygon points="6 4 20 12 6 20"/></svg>`;
const ICO_STOP = `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>`;

let timerInterval  = null;
let restInterval   = null;
let startTime      = null;
let activeSession  = null;
let cardioTimers   = {}; // exName -> { start, interval }

function fmtMinSec(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function clearCardioTimers() {
  Object.values(cardioTimers).forEach(t => clearInterval(t.interval));
  cardioTimers = {};
}

function isPhone() {
  return window.matchMedia('(max-width: 479px)').matches;
}

export function renderWorkout(container, navigate) {
  const todayDay = getTodayWorkoutDay();

  if (!todayDay && !activeSession) {
    navigate('home');
    return;
  }

  const workout = WORKOUTS[(todayDay ?? activeSession?.day ?? 1) - 1];

  if (!activeSession) {
    beginWorkout(todayDay);
  }

  renderActiveWorkout(container, workout, navigate);
}

function beginWorkout(day) {
  clearCardioTimers();
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
  // Clear any stale rest/cardio-timer state left over from a previous visit
  if (restInterval) { clearInterval(restInterval); restInterval = null; }
  clearCardioTimers();
  document.querySelector('.rest-overlay')?.remove();
  container.classList.remove('rest-blocking');

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
  // Clear any stale rest/cardio-timer state left over from a previous visit
  if (restInterval) { clearInterval(restInterval); restInterval = null; }
  clearCardioTimers();
  document.querySelector('.rest-overlay')?.remove();
  container.classList.remove('rest-blocking');

  const session = activeSession;
  let currentIdx = 0;

  container.style.paddingBottom = '0';
  container.style.overflow = 'hidden';

  const exCount = workout.exercises.length;

  container.innerHTML = `
    <div class="pwkt">
      <div class="pwkt-hdr">
        <button class="pwkt-back" id="pwkt-back-home">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><polyline points="15 18 9 12 15 6"/></svg>
          Home
        </button>
        <div class="pwkt-hdr-center">
          <div class="pwkt-label">Exercise <span id="pwkt-excount">1 of ${exCount}</span></div>
        </div>
        <div class="pwkt-hdr-timer" id="pwkt-elapsed">0:00</div>
      </div>
      <div class="pwkt-prog-track"><div class="pwkt-prog-fill" id="pwkt-prog-fill" style="width:${(100 / exCount).toFixed(2)}%"></div></div>
      <div class="pwkt-stage" id="pwkt-stage">
        ${workout.exercises.map((ex, i) => renderExerciseCard(ex, i + 1, getLastWeights(ex.name))).join('')}
      </div>
    </div>
  `;

  startTimer(container.querySelector('#pwkt-elapsed'));

  const allCards   = [...container.querySelectorAll('.exercise-card')];
  const excountEl  = container.querySelector('#pwkt-excount');
  const progFillEl = container.querySelector('#pwkt-prog-fill');

  function updateProgress(idx) {
    if (excountEl)  excountEl.textContent = `${idx + 1} of ${exCount}`;
    if (progFillEl) progFillEl.style.width = `${(((idx + 1) / exCount) * 100).toFixed(2)}%`;
  }

  function goToSlide(idx, dir = 'next') {
    if (idx < 0 || idx >= allCards.length) return;
    const leaving  = allCards[currentIdx];
    const entering = allCards[idx];
    const outCls = dir === 'next' ? 'pwkt-slide-out-left'  : 'pwkt-slide-out-right';
    const inCls  = dir === 'next' ? 'pwkt-slide-in-right'  : 'pwkt-slide-in-left';
    leaving.classList.add(outCls);
    leaving.addEventListener('animationend', () => leaving.classList.remove('pwkt-active', outCls), { once: true });
    entering.classList.add('pwkt-active', inCls, 'open');
    entering.scrollTop = 0;
    entering.addEventListener('animationend', () => entering.classList.remove(inCls), { once: true });
    currentIdx = idx;
    updateProgress(idx);
  }

  allCards[0]?.classList.add('pwkt-active', 'open');

  container.querySelector('#pwkt-back-home').addEventListener('click', () => {
    clearInterval(restInterval); restInterval = null;
    document.querySelector('.rest-overlay')?.remove();
    container.classList.remove('rest-blocking');
    navigate('home');
  });

  wireWorkoutEvents(container, session, workout, {
    incDone() {},
    getTotalSets() { return 0; },
    getDoneSets()  { return 0; },
    onExComplete(_exCard, cards, nextCard) {
      goToSlide(cards.indexOf(nextCard), 'next');
    },
    onFinish() {
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
        <div class="cardio-timer-wrap">
          <div class="cardio-timer-val" id="cardio-timer-${exId}">0:00</div>
          <div class="cardio-timer-lbl">Elapsed</div>
        </div>
        <button class="cardio-done-btn" data-ex="${ex.name}" data-timer-state="idle">
          <span class="cardio-done-icon">${ICO_PLAY}</span>
          <span class="cardio-done-label">Start Timer</span>
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
function openFieldPicker(row, type) {
  const setIdx = parseInt(row.dataset.set);
  const exName = row.dataset.ex;
  const label  = `${exName} — Set ${setIdx + 1}`;
  if (type === 'weight') {
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
}

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
function wireWorkoutEvents(container, session, workout, { incDone, getTotalSets, getDoneSets, onExComplete = null, onFinish = null }) {
  // container (#screen-workout) is a persistent element reused across renders —
  // remove any listener from a previous render before adding a fresh one, or
  // clicks fire once per accumulated listener (e.g. start+stop in one tap).
  if (container.__workoutClickHandler) {
    container.removeEventListener('click', container.__workoutClickHandler);
  }
  const handleClick = e => {

    // ── Field tap: drum picker ──────────────────────────────
    const field = e.target.closest('.set-field-tap');
    if (field) {
      const row = field.closest('.set-row');
      if (!row || row.classList.contains('done') || row.classList.contains('skipped')) return;
      field.classList.add('pressed');
      setTimeout(() => field.classList.remove('pressed'), 200);
      openFieldPicker(row, field.dataset.type);
      return;
    }

    // ── Skip ───────────────────────────────────────────────
    const skipBtn = e.target.closest('.set-skip-btn');
    if (skipBtn) {
      if (container.classList.contains('rest-blocking')) { nudgeRestTimer(); nudgeEl(skipBtn.closest('.set-row')); return; }
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

      if (doneSets === totalSets) {
        // All sets done/skipped — move on. No rest needed since nothing was
        // actually performed, so advance straight through instead of resting.
        const exCard   = container.querySelector(`.exercise-card[data-ex-name="${exName}"]`);
        exCard?.classList.add('ex-complete');
        const allCards = [...container.querySelectorAll('.exercise-card')];
        const nextCard = allCards[allCards.indexOf(exCard) + 1];
        document.activeElement?.blur();
        if (nextCard && onExComplete) {
          onExComplete(exCard, allCards, nextCard);
        } else if (!nextCard && onFinish) {
          // Last exercise on phone — the rest timer's action button is still
          // how the workout actually gets saved, so keep that path here.
          showRestTimer(container, 90, onFinish, 'Finish Workout');
        }
      }
      if (allExercisesDone(session)) revealFinish(container);
      return;
    }

    // ── Done (check tick) ──────────────────────────────────
    const checkBtn = e.target.closest('.set-check-btn');
    if (checkBtn) {
      if (container.classList.contains('rest-blocking')) { nudgeRestTimer(); nudgeEl(checkBtn.closest('.set-row')); return; }
      const row = checkBtn.closest('.set-row');
      if (!row || row.classList.contains('done') || row.classList.contains('skipped')) return;
      const exName    = checkBtn.dataset.ex;
      const setIdx    = parseInt(checkBtn.dataset.set);
      const exId      = exName.replace(/[^a-z0-9]/gi, '-');
      const exSession = session.exercises.find(ex => ex.name === exName);
      if (!exSession) return;

      const w = parseFloat(row.dataset.weight) || null;
      const r = parseInt(row.dataset.reps)     || null;

      // Block logging if weight or reps is missing/zero — but rather than a
      // dead-end shake, open the picker for the missing field so the tap
      // actually does something the user can act on.
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
        openFieldPicker(row, w === null ? 'weight' : 'reps');
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
        if (onFinish) {
          // Phone: timer button IS the navigation
          const timerDone = nextCard && onExComplete
            ? () => onExComplete(exCard, allCards, nextCard)
            : onFinish;
          const timerLabel = nextCard ? 'Next Exercise' : 'Finish Workout';
          showRestTimer(container, 90, timerDone, timerLabel);
        } else {
          // Desktop: auto-open next card, timer just blocks
          if (nextCard && onExComplete) onExComplete(exCard, allCards, nextCard);
          showRestTimer(container, 90);
        }
      } else {
        document.activeElement?.blur();
        showRestTimer(container, 90);
      }
      return;
    }

    // ── Cardio timer: start, then stop & mark as done ───────
    const cardioBtn = e.target.closest('.cardio-done-btn');
    if (cardioBtn) {
      if (container.classList.contains('rest-blocking')) { nudgeRestTimer(); nudgeEl(cardioBtn, 'cardio-nudge'); return; }
      const exName    = cardioBtn.dataset.ex;
      const exId      = exName.replace(/[^a-z0-9]/gi, '-');
      const exSession = session.exercises.find(ex => ex.name === exName);
      if (!exSession || cardioBtn.dataset.timerState === 'done') return;

      if (cardioBtn.dataset.timerState !== 'running') {
        // Start the timer
        cardioBtn.dataset.timerState = 'running';
        cardioBtn.classList.add('timing');
        cardioBtn.querySelector('.cardio-done-icon').innerHTML = ICO_STOP;
        cardioBtn.querySelector('.cardio-done-label').textContent = 'Stop & Mark as Done';
        const displayEl = container.querySelector(`#cardio-timer-${exId}`);
        const start = Date.now();
        cardioTimers[exName] = {
          start,
          interval: setInterval(() => {
            if (displayEl) displayEl.textContent = fmtMinSec(Math.floor((Date.now() - start) / 1000));
          }, 1000)
        };
        if ('vibrate' in navigator) navigator.vibrate(20);
        return;
      }

      // Stop the timer & mark as done
      const timer = cardioTimers[exName];
      let elapsedSec = 0;
      if (timer) {
        clearInterval(timer.interval);
        elapsedSec = Math.floor((Date.now() - timer.start) / 1000);
        delete cardioTimers[exName];
      }
      const timeStr = fmtMinSec(elapsedSec);
      const displayEl = container.querySelector(`#cardio-timer-${exId}`);
      if (displayEl) displayEl.textContent = timeStr;
      exSession.sets[0] = { done: true, weight: null, reps: null, note: timeStr };

      cardioBtn.dataset.timerState = 'done';
      cardioBtn.classList.remove('timing');
      cardioBtn.classList.add('done');
      cardioBtn.querySelector('.cardio-done-icon').innerHTML = ICO_CHECK;
      cardioBtn.querySelector('.cardio-done-label').textContent = `Done · ${timeStr}`;
      if ('vibrate' in navigator) navigator.vibrate(40);

      const exCard = container.querySelector(`.exercise-card[data-ex-name="${exName}"]`);
      exCard?.classList.add('ex-complete');
      if (allExercisesDone(session)) revealFinish(container);
      const allCards = [...container.querySelectorAll('.exercise-card')];
      const nextCard = allCards[allCards.indexOf(exCard) + 1];
      document.activeElement?.blur();
      if (onFinish) {
        const timerDone = nextCard && onExComplete
          ? () => onExComplete(exCard, allCards, nextCard)
          : onFinish;
        const timerLabel = nextCard ? 'Next Exercise' : 'Finish Workout';
        showRestTimer(container, 90, timerDone, timerLabel);
      } else {
        if (nextCard && onExComplete) onExComplete(exCard, allCards, nextCard);
        showRestTimer(container, 90);
      }
    }
  };

  container.addEventListener('click', handleClick);
  container.__workoutClickHandler = handleClick;
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
  container.classList.remove('rest-blocking');
  session.durationMin = Math.max(1, Math.round((Date.now() - startTime) / 60000));
  saveSession(session);
  const btn = container.querySelector('#finish-btn');
  if (btn) { btn.classList.add('finishing'); btn.innerHTML = `${ICO_CHECK} Saved`; }
  setTimeout(() => { activeSession = null; navigate('home'); }, 600);
}

// ── Blocked-tap feedback ──────────────────────────────────
// Nudges the element the user actually tapped, so a rest-blocked
// skip/tick/cardio-done tap is obviously "blocked" rather than "broken".
function nudgeEl(el, cls = 'row-nudge') {
  if (!el) return;
  el.classList.remove(cls);
  void el.offsetWidth;
  el.classList.add(cls);
  el.addEventListener('animationend', () => el.classList.remove(cls), { once: true });
  if ('vibrate' in navigator) navigator.vibrate(15);
}

// ── Rest Timer ────────────────────────────────────────────
function nudgeRestTimer() {
  const card = document.querySelector('.rest-card');
  if (!card) return;
  card.classList.remove('rest-nudge');
  void card.offsetWidth;
  card.classList.add('rest-nudge');
  card.addEventListener('animationend', () => card.classList.remove('rest-nudge'), { once: true });
  if ('vibrate' in navigator) navigator.vibrate(15);
}

function showRestTimer(container, seconds, onDone, actionLabel = null) {
  clearInterval(restInterval);
  restInterval = null;
  document.querySelector('.rest-overlay')?.remove();
  container.classList.add('rest-blocking');

  const CIRC = 2 * Math.PI * 32;
  let remaining = seconds;
  let total     = seconds;

  const overlay = document.createElement('div');
  overlay.className = 'rest-overlay';
  overlay.innerHTML = `
    <div class="rest-card">
      <div class="rest-lbl">Rest</div>

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
        <button class="rest-btn-skip" id="rest-skip">
          ${actionLabel ? `${actionLabel} ${ICO_CHEVRON_R}` : 'Skip'}
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const countEl = overlay.querySelector('#rest-count');
  const arcEl   = overlay.querySelector('#rest-fill');

  function finish() {
    clearInterval(restInterval); restInterval = null;
    container.classList.remove('rest-blocking');
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
    container.classList.remove('rest-blocking');
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
