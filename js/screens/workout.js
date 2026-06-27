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
    <div class="screen-header">
      <button class="wkt-back-btn" id="wkt-back">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        Home
      </button>
      <h1>${workout.label}</h1>
      <p>${workout.focus}</p>
    </div>
    <div class="section">
      <div class="card wkt-summary-card" style="margin-bottom:12px">
        <div class="next-day-title">${workout.label}</div>
        <div class="next-day-focus">${workout.focus}</div>
        <div class="next-day-meta" style="margin-top:12px;margin-bottom:0">
          <div class="next-meta-item">${ICO_CLOCK} ~${workout.durationMin} min</div>
          <div class="next-meta-item">${ICO_DUMBBELL} ${workout.exercises.length} exercises</div>
        </div>
      </div>
      <div class="card" style="background:rgba(255,165,0,0.06);border-color:rgba(255,165,0,0.2);margin-bottom:12px">
        <div style="display:flex;gap:10px;align-items:flex-start">
          <span style="flex-shrink:0;display:flex">${ICO_FLAME}</span>
          <div>
            <div style="font-size:0.78rem;font-weight:700;color:#f0a500;margin-bottom:4px">Warm-Up First</div>
            <div style="font-size:0.8rem;color:var(--text-muted);line-height:1.5">${workout.warmup}</div>
          </div>
        </div>
      </div>
      <button class="btn-primary" id="begin-btn">Begin Workout ${ICO_CHEVRON_R}</button>
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
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Home
        </button>
        <div class="pwkt-hdr-left">
          <div class="pwkt-label">${workout.label}</div>
          <div class="pwkt-excount" id="pwkt-count">1 / ${total}</div>
        </div>
      </div>
      <div class="pwkt-prog-track">
        <div class="pwkt-prog-fill" id="pwkt-prog" style="width:${100/total}%"></div>
      </div>
      <div class="pwkt-timer-row">
        <div class="pwkt-timer" id="workout-timer">0:00</div>
        <div class="pwkt-timer-lbl">elapsed</div>
      </div>
      <div class="pwkt-stage" id="pwkt-stage">
        ${workout.exercises.map((ex, i) => renderExerciseCard(ex, i + 1, getLastWeights(ex.name))).join('')}
      </div>
      <div class="pwkt-foot">
        <button class="pwkt-arrow" id="pwkt-prev" aria-label="Previous">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <button class="btn-primary pwkt-finish-btn" id="finish-btn" style="display:none">Finish ${ICO_CHECK}</button>
        <button class="pwkt-arrow" id="pwkt-next" aria-label="Next">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
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
    container.style.paddingBottom = '';
    container.style.overflow = '';
    finishWorkout(container, session, navigate);
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
        <span class="yt-icon"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"/></svg></span>
        <span class="yt-label">Watch tutorial on YouTube</span>
        <span class="yt-arrow"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg></span>
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
function wireWorkoutEvents(container, session, workout, { incDone, getTotalSets, getDoneSets, onExComplete }) {
  // Drum pickers — separate picker for weight and for reps
  container.querySelectorAll('.set-field-tap').forEach(field => {
    field.addEventListener('click', () => {
      if (field.closest('.set-row').classList.contains('done')) return;
      const row    = field.closest('.set-row');
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
    });
  });

  // Skip buttons
  container.querySelectorAll('.set-skip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.add('pop');
      btn.addEventListener('animationend', () => btn.classList.remove('pop'), { once: true });

      const exName    = btn.dataset.ex;
      const setIdx    = parseInt(btn.dataset.set);
      const exId      = exName.replace(/[^a-z0-9]/gi, '-');
      const row       = btn.closest('.set-row');
      const exSession = session.exercises.find(e => e.name === exName);
      if (!exSession) return;

      exSession.sets[setIdx] = { done: true, skipped: true, weight: null, reps: null, note: '' };
      row.classList.add('skipped');
      if ('vibrate' in navigator) navigator.vibrate(20);

      const doneSets  = exSession.sets.filter(s => s.done).length;
      const totalSets = exSession.sets.length;
      const fill = container.querySelector(`#sets-progress-${exId} .sets-progress-fill`);
      const txt  = container.querySelector(`#sets-progress-${exId} .sets-progress-txt`);
      if (fill) fill.style.width = `${(doneSets / totalSets) * 100}%`;
      if (txt)  txt.textContent  = `${doneSets} / ${totalSets}`;

      if (allExercisesDone(session)) revealFinish(container);
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
        if (allExercisesDone(session)) revealFinish(container);
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
  const total   = seconds;

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
