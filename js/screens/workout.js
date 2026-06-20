import { WORKOUTS, getNextWorkoutDay } from '../data.js';
import { getSessions, saveSession, getLastWeights, today } from '../store.js';
import { renderExerciseCard } from './plan.js';

let timerInterval = null;
let startTime = null;
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

  container.innerHTML = `
    <div class="workout-header">
      <div class="workout-header-left">
        <h2>${workout.label}</h2>
        <p>${workout.weekday} · ${workout.exercises.length} exercises</p>
      </div>
      <div class="timer" id="workout-timer">0:00</div>
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

  // Strength set check buttons
  container.querySelectorAll('.set-check').forEach(btn => {
    btn.addEventListener('click', () => {
      const exName = btn.dataset.ex;
      const setIdx = parseInt(btn.dataset.set);
      const weightInput = container.querySelector(`.set-weight[data-ex="${exName}"][data-set="${setIdx}"]`);
      const repsInput = container.querySelector(`.set-reps[data-ex="${exName}"][data-set="${setIdx}"]`);

      const exSession = session.exercises.find(e => e.name === exName);
      if (!exSession) return;

      exSession.sets[setIdx] = {
        done: true,
        weight: parseFloat(weightInput?.value) || null,
        reps: parseInt(repsInput?.value) || null,
        note: ''
      };

      btn.classList.add('checked');
      btn.closest('.set-row').style.opacity = '0.55';
    });
  });

  // Cardio done checkboxes
  container.querySelectorAll('.cardio-done').forEach(cb => {
    cb.addEventListener('change', () => {
      const exName = cb.dataset.ex;
      const noteInput = container.querySelector(`.set-note[data-ex="${exName}"]`);
      const exSession = session.exercises.find(e => e.name === exName);
      if (exSession) {
        exSession.sets[0] = { done: cb.checked, weight: null, reps: null, note: noteInput?.value || '' };
      }
    });
  });

  // Cardio note inputs sync
  container.querySelectorAll('.set-note').forEach(input => {
    input.addEventListener('input', () => {
      const exName = input.dataset.ex;
      const cb = container.querySelector(`.cardio-done[data-ex="${exName}"]`);
      const exSession = session.exercises.find(e => e.name === exName);
      if (exSession && cb?.checked) {
        exSession.sets[0].note = input.value;
      }
    });
  });

  container.querySelector('#finish-btn').addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
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
