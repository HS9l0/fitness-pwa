const KEYS = { sessions: 'fit_sessions', settings: 'fit_settings', food: 'fit_food' };

function read(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}
function write(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

export function getSessions() { return read(KEYS.sessions, []); }
export function saveSession(session) {
  const sessions = getSessions().filter(s => s.date !== session.date || s.day !== session.day);
  write(KEYS.sessions, [session, ...sessions]);
}

export function getSettings() {
  return { waterGoalMl: 2000, weightUnit: 'kg', ...read(KEYS.settings, {}) };
}
export function saveSettings(patch) {
  write(KEYS.settings, { ...getSettings(), ...patch });
}

export function getLastWeights(exerciseName) {
  const sessions = getSessions();
  for (const s of sessions) {
    const ex = s.exercises?.find(e => e.name === exerciseName);
    if (ex) {
      const done = ex.sets?.find(set => set.done);
      if (done) return { reps: done.reps, weight: done.weight, note: done.note };
    }
  }
  return null;
}

export function today() {
  return new Date().toISOString().slice(0, 10);
}

export function getFoodLog(date) { return (read(KEYS.food, {}))[date] ?? []; }
export function addFoodEntry(date, entry) {
  const food = read(KEYS.food, {});
  food[date] = [entry, ...(food[date] ?? [])];
  write(KEYS.food, food);
}
export function removeFoodEntry(date, id) {
  const food = read(KEYS.food, {});
  food[date] = (food[date] ?? []).filter(e => e.id !== id);
  write(KEYS.food, food);
}

export function getWeightLog() { return read('fit_weight', {}); }
export function addWeightEntry(date, val) {
  const log = read('fit_weight', {});
  log[date] = val;
  write('fit_weight', log);
}

export function getSessionsForMonth(year, month) {
  return getSessions().filter(s => {
    const d = new Date(s.date + 'T12:00:00');
    return d.getFullYear() === year && d.getMonth() === month;
  });
}
