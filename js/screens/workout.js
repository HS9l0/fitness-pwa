import { WORKOUTS, getNextWorkoutDay } from '../data.js';
import { getSessions, saveSession, getLastWeights, today } from '../store.js';
import { renderExerciseCard } from './plan.js';
import { showDrumPicker } from '../drum-picker.js';

let timerInterval = null;
let restInterval  = null;
let startTime     = null;
let activeSession = null;

function isPhone() {
  return window.matchMedia('(max-width: 479px)').matches;
}

export function renderWorkout(container, navigate) {
  const sessions = getSessions();
  const nextDay  = getNextWorkoutDay(sessions);
  const workout  = WORKOUTS[nextDay - 1];

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
        <p id="wkt-progress">${workout.weekday} · 0 / ${totalWorkoutSets} sets</p>
      </div>
      <div class="wkt-timer-wrap">
        <div class="timer" id="workout-timer">0:00</div>
        <div class="timer-lbl">elapsed</div>
      </div>
    </div>
    <div class="section">
      ${workout.exercises.map((ex, i) => renderExerciseCard(ex, i + 1, true, getLastWeights(ex.name))).join('')}
      <button class="btn-primary" id="finish-btn" style="margin-top:8px">Finish Workout ✓</button>
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
        <div class="pwkt-hdr-left">
          <div class="pwkt-label">${workout.label}</div>
          <div class="pwkt-excount" id="pwkt-count">1 / ${total}</div>
        </div>
        <div class="pwkt-timer-wrap">
          <div class="pwkt-timer" id="workout-timer">0:00</div>
          <div class="pwkt-timer-lbl">elapsed</div>
        </div>
      </div>
      <div class="pwkt-prog-track">
        <div class="pwkt-prog-fill" id="pwkt-prog" style="width:${100/total}%"></div>
      </div>
      <div class="pwkt-stage" id="pwkt-stage">
        ${workout.exercises.map((ex, i) => renderExerciseCard(ex, i + 1, true, getLastWeights(ex.name))).join('')}
      </div>
      <div class="pwkt-foot">
        <button class="pwkt-arrow" id="pwkt-prev" aria-label="Previous">‹</button>
        <button class="btn-primary pwkt-finish-btn" id="finish-btn">Finish ✓</button>
        <button class="pwkt-arrow" id="pwkt-next" aria-label="Next">›</button>
      </div>
    </div>
  `;

  startTimer(container.querySelector('#workout-timer'));

  const allCards = [...container.querySelectorAll('.exercise-card')];

  function updateNav() {
    container.querySelector('#pwkt-prev').style.opacity = currentIdx === 0 ? '0.3' : '1';
    container.querySelector('#pwkt-next').style.opacity = currentIdx === allCards.length - 1 ? '0.3' : '1';
    container.querySelector('#pwkt-count').textContent  = `${currentIdx + 1} / ${total}`;
    container.querySelector('#pwkt-prog').style.width   = `${((currentIdx + 1) / total) * 100}%`;
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
    container.style.paddingBottom = '';
    container.style.overflow = '';
    finishWorkout(container, session, navigate);
  });
}

// ── Shared event wiring ───────────────────────────────────
function wireWorkoutEvents(container, session, workout, { incDone, getTotalSets, getDoneSets, onExComplete }) {
  // Drum picker
  container.querySelectorAll('.set-field-tap').forEach(field => {
    field.addEventListener('click', () => {
      if (field.closest('.set-row').classList.contains('done')) return;
      field.classList.add('pressed');
      const row    = field.closest('.set-row');
      const setIdx = parseInt(row.dataset.set);
      const exName = row.dataset.ex;
      showDrumPicker({
        weight: parseFloat(row.dataset.weight) || 0,
        reps:   parseInt(row.dataset.reps)     || 5,
        label:  `${exName} — Set ${setIdx + 1}`,
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

  // Strength sets
  container.querySelectorAll('.set-check-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.add('pop');
      btn.addEventListener('animationend', () => btn.classList.remove('pop'), { once: true });

      const exName    = btn.dataset.ex;
      const setIdx    = parseInt(btn.dataset.set);
      const exId      = exName.replace(/[^a-z0-9]/gi, '-');
      const row       = btn.closest('.set-row');
      const exSession = session.exercises.find(e => e.name === exName);
      if (!exSession) return;

      exSession.sets[setIdx] = {
        done: true,
        weight: parseFloat(row.dataset.weight) || null,
        reps:   parseInt(row.dataset.reps)     || null,
        note: ''
      };
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
      if (wktProg) wktProg.textContent = `${workout.weekday} · ${getDoneSets()} / ${getTotalSets()} sets`;

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
    });
  });

  // Cardio
  container.querySelectorAll('.cardio-done-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const exName    = btn.dataset.ex;
      const noteInput = container.querySelector(`.set-note[data-ex="${exName}"]`);
      const exSession = session.exercises.find(e => e.name === exName);
      if (!exSession) return;
      const isDone = btn.classList.toggle('done');
      exSession.sets[0] = { done: isDone, weight: null, reps: null, note: noteInput?.value || '' };
      if ('vibrate' in navigator) navigator.vibrate(isDone ? 40 : 20);
      const exCard   = container.querySelector(`.exercise-card[data-ex-name="${exName}"]`);
      exCard?.classList.toggle('ex-complete', isDone);

      if (isDone) {
        document.activeElement?.blur();
        const allCards = [...container.querySelectorAll('.exercise-card')];
        const nextCard = allCards[allCards.indexOf(exCard) + 1];
        showRestTimer(container, 90, nextCard ? () => onExComplete(exCard, allCards, nextCard) : null);
      }
    });
  });
}

// ── Helpers ───────────────────────────────────────────────
function startTimer(el) {
  if (timerInterval) clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    el.textContent = `${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, '0')}`;
  }, 1000);
}

function finishWorkout(container, session, navigate) {
  clearInterval(timerInterval); timerInterval = null;
  clearInterval(restInterval);  restInterval  = null;
  document.querySelector('.rest-overlay')?.remove();
  session.durationMin = Math.max(1, Math.round((Date.now() - startTime) / 60000));
  saveSession(session);
  const btn = container.querySelector('#finish-btn');
  if (btn) { btn.classList.add('finishing'); btn.textContent = '🎉 Saved!'; }
  setTimeout(() => { activeSession = null; navigate('home'); }, 600);
}

// ── Rest Timer ────────────────────────────────────────────
function showRestTimer(container, seconds, onDone) {
  clearInterval(restInterval);
  restInterval = null;
  document.querySelector('.rest-overlay')?.remove();

  const CIRC = 2 * Math.PI * 32;
  let remaining = seconds;
  const total   = seconds;

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
