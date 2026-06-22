import { WORKOUTS, getNextWorkoutDay } from '../data.js';
import { getSessions, saveSession, getLastWeights, today } from '../store.js';
import { renderExerciseCard } from './plan.js';
import { showDrumPicker } from '../drum-picker.js';

let timerInterval = null;
let restInterval  = null;
let startTime     = null;
let activeSession = null;

export function renderWorkout(container, navigate) {
  const sessions = getSessions();
  const nextDay = getNextWorkoutDay(sessions);
  const workout = WORKOUTS[nextDay - 1];

  if (activeSession) {
    renderActiveWorkout(container, workout, navigate);
    return;
  }

  container.innerHTML = `
    <div class="screen-header">
      <div class="badge">${workout.weekday}</div>
      <h1>${workout.label}</h1>
      <p>${workout.focus}</p>
    </div>
    <div class="section">
      <div class="card" style="background:rgba(255,165,0,0.06);border-color:rgba(255,165,0,0.2);margin-bottom:12px">
        <div style="display:flex;gap:10px;align-items:flex-start">
          <span style="font-size:1.3rem;flex-shrink:0">🔥</span>
          <div>
            <div style="font-size:0.78rem;font-weight:700;color:#f0a500;margin-bottom:4px">Warm-Up First</div>
            <div style="font-size:0.8rem;color:var(--text-muted);line-height:1.5">${workout.warmup}</div>
          </div>
        </div>
      </div>
      <button class="btn-primary" id="begin-btn">Begin Workout →</button>
    </div>
    <div class="section" style="padding-top:0">
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

  container.querySelector('#begin-btn').addEventListener('click', () => {
    beginWorkout(nextDay);
    renderActiveWorkout(container, workout, navigate);
  });
}

function beginWorkout(day) {
  startTime = Date.now();
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
  const session = activeSession;
  const totalWorkoutSets = workout.exercises
    .filter(e => !e.isCardio)
    .reduce((sum, e) => sum + e.defaultSets, 0);
  let doneWorkoutSets = 0;

  container.innerHTML = `
    <div class="workout-header">
      <div class="workout-header-left">
        <h2>${workout.label}</h2>
        <p id="wkt-progress">${workout.weekday} · 0 / ${totalWorkoutSets} sets</p>
      </div>
      <div class="wkt-timer-wrap">
        <div class="timer" id="workout-timer">0:00</div>
        <div class="timer-lbl">elapsed</div>
      </div>
    </div>
    <div class="section">
      ${workout.exercises.map((ex, i) => {
        const lastWeights = getLastWeights(ex.name);
        return renderExerciseCard(ex, i + 1, true, lastWeights);
      }).join('')}
      <button class="btn-primary" id="finish-btn" style="margin-top:8px">
        Finish Workout ✓
      </button>
    </div>
  `;

  // Start/restart timer
  const timerEl = container.querySelector('#workout-timer');
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const m = Math.floor(elapsed / 60);
    const s = elapsed % 60;
    timerEl.textContent = `${m}:${s.toString().padStart(2, '0')}`;
  }, 1000);

  // Auto-open first card
  container.querySelector('.exercise-card')?.classList.add('open');

  // Exercise card toggles
  container.querySelectorAll('.exercise-card .ex-header').forEach(header => {
    header.addEventListener('click', () => {
      header.closest('.exercise-card').classList.toggle('open');
    });
  });

  // Drum picker — open on field tap
  container.querySelectorAll('.set-field-tap').forEach(field => {
    field.addEventListener('click', () => {
      if (field.closest('.set-row').classList.contains('done')) return;
      field.classList.add('pressed');
      const row    = field.closest('.set-row');
      const setIdx = parseInt(row.dataset.set);
      const exName = row.dataset.ex;
      const w = parseFloat(row.dataset.weight) || 0;
      const r = parseInt(row.dataset.reps)     || 5;
      showDrumPicker({
        weight: w, reps: r,
        label: `${exName} — Set ${setIdx + 1}`,
        onConfirm(newW, newR) {
          row.dataset.weight = newW;
          row.dataset.reps   = newR;
          const wVal = row.querySelector('.set-fields .set-field:first-child .set-val');
          const rVal = row.querySelector('.set-fields .set-field:last-child .set-val');
          if (wVal) { wVal.textContent = newW; wVal.classList.remove('empty'); }
          if (rVal) { rVal.textContent = newR; rVal.classList.remove('empty'); }
        }
      });
      setTimeout(() => field.classList.remove('pressed'), 200);
    });
  });

  // Strength set done buttons
  container.querySelectorAll('.set-check-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.add('pop');
      btn.addEventListener('animationend', () => btn.classList.remove('pop'), { once: true });

      const exName = btn.dataset.ex;
      const setIdx = parseInt(btn.dataset.set);
      const exId   = exName.replace(/[^a-z0-9]/gi, '-');
      const row    = btn.closest('.set-row');
      const exSession = session.exercises.find(e => e.name === exName);
      if (!exSession) return;

      const w = parseFloat(row.dataset.weight) || null;
      const r = parseInt(row.dataset.reps)     || null;

      exSession.sets[setIdx] = { done: true, weight: w, reps: r, note: '' };

      row.classList.add('done');

      // Haptic
      if ('vibrate' in navigator) navigator.vibrate(40);

      // Per-exercise progress bar
      const doneSets  = exSession.sets.filter(s => s.done).length;
      const totalSets = exSession.sets.length;
      const progressFill = container.querySelector(`#sets-progress-${exId} .sets-progress-fill`);
      const progressTxt  = container.querySelector(`#sets-progress-${exId} .sets-progress-txt`);
      if (progressFill) progressFill.style.width = `${(doneSets / totalSets) * 100}%`;
      if (progressTxt)  progressTxt.textContent  = `${doneSets} / ${totalSets}`;

      // Overall header progress
      doneWorkoutSets++;
      const wktProgress = container.querySelector('#wkt-progress');
      if (wktProgress) wktProgress.textContent = `${workout.weekday} · ${doneWorkoutSets} / ${totalWorkoutSets} sets`;

      // Exercise complete
      if (doneSets === totalSets) {
        const exCard = container.querySelector(`.exercise-card[data-ex-name="${exName}"]`);
        exCard?.classList.add('ex-complete');
        const allCards = [...container.querySelectorAll('.exercise-card')];
        const nextCard = allCards[allCards.indexOf(exCard) + 1];
        document.activeElement?.blur();
        showRestTimer(container, 90, nextCard ? () => {
          exCard?.classList.remove('open');
          nextCard.classList.add('open');
          nextCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } : null);
      } else {
        document.activeElement?.blur();
        showRestTimer(container, 90);
      }
    });
  });

  // Cardio done buttons
  container.querySelectorAll('.cardio-done-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const exName    = btn.dataset.ex;
      const noteInput = container.querySelector(`.set-note[data-ex="${exName}"]`);
      const exSession = session.exercises.find(e => e.name === exName);
      if (!exSession) return;
      const isDone = btn.classList.toggle('done');
      exSession.sets[0] = { done: isDone, weight: null, reps: null, note: noteInput?.value || '' };
      if ('vibrate' in navigator) navigator.vibrate(isDone ? 40 : 20);
      const exCard = container.querySelector(`.exercise-card[data-ex-name="${exName}"]`);
      exCard?.classList.toggle('ex-complete', isDone);

      if (isDone) {
        document.activeElement?.blur();
        const allCards = [...container.querySelectorAll('.exercise-card')];
        const nextCard = allCards[allCards.indexOf(exCard) + 1];
        showRestTimer(container, 90, nextCard ? () => {
          exCard?.classList.remove('open');
          nextCard.classList.add('open');
          nextCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } : null);
      }
    });
  });

  container.querySelector('#finish-btn').addEventListener('click', () => {
    clearInterval(timerInterval);  timerInterval = null;
    clearInterval(restInterval);   restInterval = null;
    document.querySelector('.rest-overlay')?.remove();
    const durationMin = Math.max(1, Math.round((Date.now() - startTime) / 60000));
    session.durationMin = durationMin;
    saveSession(session);

    const btn = container.querySelector('#finish-btn');
    btn.classList.add('finishing');
    btn.textContent = '🎉 Workout saved!';
    setTimeout(() => {
      activeSession = null;
      navigate('home');
    }, 600);
  });
}

// ── Rest Timer ────────────────────────────────────────────
function showRestTimer(container, seconds, onDone) {
  clearInterval(restInterval);
  restInterval = null;
  document.querySelector('.rest-overlay')?.remove();

  const CIRC = 2 * Math.PI * 32;
  let remaining = seconds;
  const total = seconds;

  const overlay = document.createElement('div');
  overlay.className = 'rest-overlay';
  overlay.innerHTML = `
    <div class="rest-card">
      <div class="rest-lbl">${onDone ? 'Rest · Next exercise →' : 'Rest'}</div>
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
        <button class="rest-btn-skip" id="rest-skip">${onDone ? 'Skip →' : 'Skip'}</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

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
    countEl.textContent = fmtRest(remaining);
  });
}

function fmtRest(s) {
  const m = Math.floor(s / 60), sec = s % 60;
  return m > 0 ? `${m}:${sec.toString().padStart(2, '0')}` : `${s}s`;
}
